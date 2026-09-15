// scripts/test-all-features.js
const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
    const url = new URL(BASE_URL + endpoint);
    const method = options.method || 'GET';
    const headers = options.headers || {};
    let body = options.body;

    if (body && typeof body === 'object') {
        body = JSON.stringify(body);
        headers['Content-Type'] = 'application/json';
    }

    return new Promise((resolve, reject) => {
        const req = http.request(url, {
            method,
            headers
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                let parsed;
                try {
                    parsed = JSON.parse(data);
                } catch (e) {
                    parsed = data;
                }
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    data: parsed
                });
            });
        });

        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

function assert(condition, message) {
    if (!condition) {
        console.error(`❌ FAILED: ${message}`);
        throw new Error(message);
    }
    console.log(`✅ PASSED: ${message}`);
}

async function runTestSuite() {
    console.log('====================================================');
    console.log('🚀 RUNNING COMPREHENSIVE END-TO-END FEATURE TESTS');
    console.log('====================================================\n');

    let pmToken, fahadToken;
    let createdProgramId, createdProgramProjectId;
    let createdProjectId, createdTaskId, createdWorkPartId, createdSubmissionId;

    try {
        // 1. Authentication
        console.log('--- 1. Testing Authentication ---');
        const pmLogin = await request('/auth/login', {
            method: 'POST',
            body: { email: 'asad@argplatform.com', password: 'Password@123' }
        });
        assert(pmLogin.status === 200, 'PM Asad logged in successfully');
        pmToken = pmLogin.data.token;
        const pmUser = pmLogin.data.user;
        assert(pmUser.role === 'Project Manager', 'PM user role is Project Manager');

        const memberLogin = await request('/auth/login', {
            method: 'POST',
            body: { email: 'fahad@argplatform.com', password: 'Password@123' }
        });
        assert(memberLogin.status === 200, 'Member Fahad logged in successfully');
        fahadToken = memberLogin.data.token;
        const memberUser = memberLogin.data.user;
        assert(memberUser.role === 'Member', 'Fahad user role is Member');

        // 2. Program Creation & Deliverable Assignment
        console.log('\n--- 2. Testing Program Creation & Assignment ---');
        const newProgramPayload = {
            name: `Test Autonomous Grid Program ${Date.now()}`,
            description: 'Automated test suite program for verifying creation and lifecycle',
            domain: 'Smart City & Autonomous Systems',
            status: 'Active',
            priority: 'High',
            startDate: '2026-09-01',
            endDate: '2026-12-31'
        };

        const createProgRes = await request('/programs', {
            method: 'POST',
            headers: { Authorization: `Bearer ${pmToken}` },
            body: newProgramPayload
        });
        assert(createProgRes.status === 201, 'Program created successfully (Status 201)');
        createdProgramId = createProgRes.data.program.id;
        assert(!!createdProgramId, `Program has valid ID: ${createdProgramId}`);

        const deliverablePayload = {
            name: 'LiDAR Sensor Fusion Module',
            aboutTitle: 'Sensor Processing',
            aboutDescription: 'Real-time 3D point cloud processing pipeline',
            startDate: '2026-09-05',
            deadline: '2026-10-15',
            priority: 'High',
            assignedTo: memberUser.id
        };

        const createDeliverableRes = await request(`/programs/${createdProgramId}/projects`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${pmToken}` },
            body: deliverablePayload
        });
        assert(createDeliverableRes.status === 201, 'Program Deliverable created successfully (Status 201)');
        createdProgramProjectId = createDeliverableRes.data.project.id;
        assert(!!createdProgramProjectId, `Deliverable ID: ${createdProgramProjectId}`);

        const assignDeliverableRes = await request(`/programs/${createdProgramId}/projects/${createdProgramProjectId}/assign`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${pmToken}` },
            body: { assignedTo: memberUser.id }
        });
        assert(assignDeliverableRes.status === 200, 'Deliverable assigned to Member Fahad via PATCH /assign');
        assert(assignDeliverableRes.data.project.assigned_to === memberUser.id, 'Assignee matches Member ID');

        // 3. Member Program Access Scoping
        console.log('\n--- 3. Testing Member Program Access Scoping ---');
        const memberProgramsRes = await request('/programs', {
            method: 'GET',
            headers: { Authorization: `Bearer ${fahadToken}` }
        });
        assert(memberProgramsRes.status === 200, 'Member can query /programs');
        const memberPrograms = memberProgramsRes.data.programs;
        const hasAssignedProgram = memberPrograms.some(p => p.id === createdProgramId);
        assert(hasAssignedProgram, 'Member sees the program containing their assigned deliverable');

        // 4. Project Creation
        console.log('\n--- 4. Testing Project Creation ---');
        const newProjectPayload = {
            name: `E2E Vision Tracking Subsystem ${Date.now()}`,
            domain: 'Deep Learning',
            aboutTitle: 'Subsystem architecture',
            aboutDescription: 'Deep learning tracking subsystem pipeline',
            programId: createdProgramId,
            priority: 'High',
            startDate: '2026-09-10',
            deadline: '2026-10-30'
        };

        const createProjRes = await request('/projects', {
            method: 'POST',
            headers: { Authorization: `Bearer ${pmToken}` },
            body: newProjectPayload
        });
        assert(createProjRes.status === 201, 'Project created successfully via /api/projects (Status 201)');
        createdProjectId = createProjRes.data.project.id;
        assert(!!createdProjectId, `Project ID: ${createdProjectId}`);

        // 5. Task Creation & Assignment
        console.log('\n--- 5. Testing Task Creation & Assignment ---');
        const newTaskPayload = {
            name: 'Implement Kalman Filter for Bounding Box Smoothing',
            description: 'Apply constant velocity motion model to track bounding boxes across frames',
            status: 'To Do',
            priority: 'High',
            dueDate: '2026-09-25',
            assigneeId: memberUser.id
        };

        const createTaskRes = await request(`/tasks/project/${createdProjectId}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${pmToken}` },
            body: newTaskPayload
        });
        assert(createTaskRes.status === 201, 'Task created and assigned to Member Fahad (Status 201)');
        createdTaskId = createTaskRes.data.task.id;
        assert(!!createdTaskId, `Task ID: ${createdTaskId}`);
        assert(createTaskRes.data.task.assignee_id === memberUser.id, 'Task assignee_id matches Member');

        // 6. Work Parts & Member Submissions
        console.log('\n--- 6. Testing Work Parts & Member Submissions ---');
        const workPartPayload = {
            title: 'Mathematical formulation and matrix setup',
            description: 'Configured state transition F matrix and measurement H matrix',
            status: 'To Do'
        };

        const createWorkPartRes = await request(`/tasks/${createdTaskId}/work-parts`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${fahadToken}` },
            body: workPartPayload
        });
        assert(createWorkPartRes.status === 201, 'Work Part created by Member (Status 201)');
        createdWorkPartId = createWorkPartRes.data.workPart.id;

        const updateWorkPartRes = await request(`/work-parts/${createdWorkPartId}/status`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${fahadToken}` },
            body: { status: 'Done' }
        });
        assert(updateWorkPartRes.status === 200, 'Work Part marked Done (Status 200)');

        const submissionPayload = {
            link: 'https://github.com/qarc/vision-kalman-filter',
            description: 'Completed Kalman filter matrix formulation and initial test benchmarks'
        };

        const createSubmissionRes = await request(`/tasks/${createdTaskId}/submissions`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${fahadToken}` },
            body: submissionPayload
        });
        assert(createSubmissionRes.status === 201, 'Task submission recorded successfully (Status 201)');
        createdSubmissionId = createSubmissionRes.data.submission.id;

        const completeTaskRes = await request(`/tasks/${createdTaskId}/status`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${fahadToken}` },
            body: { status: 'Completed' }
        });
        assert(completeTaskRes.status === 200, 'Member marked task as Completed (Status 200)');

        const markDoneRes = await request(`/tasks/${createdTaskId}/mark-done`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${pmToken}` }
        });
        assert(markDoneRes.status === 200, 'PM marked task as Done (Status 200)');

        console.log('\n====================================================');
        console.log('🎉 ALL FUNCTIONALITY TESTS COMPLETED SUCCESSFULLY!');
        console.log('====================================================');

    } catch (err) {
        console.error('\n❌ Test Suite encountered an error:', err.message);
        process.exitCode = 1;
    } finally {
        console.log('\n--- Cleaning up test records from database ---');
        const pool = require('../config/db');
        try {
            if (createdWorkPartId) await pool.query('DELETE FROM task_work_parts WHERE id = $1', [createdWorkPartId]);
            if (createdSubmissionId) await pool.query('DELETE FROM task_submissions WHERE id = $1', [createdSubmissionId]);
            if (createdTaskId) await pool.query('DELETE FROM tasks WHERE id = $1', [createdTaskId]);
            if (createdProjectId) {
                await pool.query('DELETE FROM project_members WHERE project_id = $1', [createdProjectId]);
                await pool.query('DELETE FROM projects WHERE id = $1', [createdProjectId]);
            }
            if (createdProgramProjectId) await pool.query('DELETE FROM program_projects WHERE id = $1', [createdProgramProjectId]);
            if (createdProgramId) await pool.query('DELETE FROM programs WHERE id = $1', [createdProgramId]);
            console.log('🧹 Cleaned up all test entities successfully.');
        } catch (cleanupErr) {
            console.error('Warning: cleanup failed:', cleanupErr.message);
        } finally {
            await pool.end();
        }
    }
}

runTestSuite();
