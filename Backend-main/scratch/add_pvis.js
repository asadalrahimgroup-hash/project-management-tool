const fs = require('fs');
const path = require('path');

const dbJsPath = path.join(__dirname, '..', 'config', 'db.js');
let dbJs = fs.readFileSync(dbJsPath, 'utf8');

// Insert project
const projectInsert = \,
          ('proj-pvis', 'Pakistan Vehicle Intelligence System (PVIS)', 'Edge AI & Computer Vision', 'AI-powered vehicle monitoring system', 'Detects vehicles, reads Pakistani license plates using OCR, tracks entry/exit sessions, stores data locally on Jetson Nano, and syncs everything live to a cloud dashboard.', 'Completed', 'High', '2026-08-01', '2026-08-20', 100, 'prog-qarc', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad')\;
dbJs = dbJs.replace(/('proj-marketing-agent'.*?\))/, '' + projectInsert);

// Insert project members
const pmInsert = \,
          ('pm-pv-1', 'proj-pvis', 'usr-pm-asad', 'Project Manager')\;
dbJs = dbJs.replace(/('pm-ma-1'.*?\))/, '' + pmInsert);

// Insert tasks block
const tasksSql = \
      // Seed PVIS Tasks
      await client.query(\\\
        INSERT INTO tasks (id, name, description, status, priority, start_date, due_date, project_id, assignee_id, assigned_to, created_by, completed_at)
        VALUES 
          ('tsk-pvis-1', 'Phase 1 - Dataset & Annotation', 'Collected video footage, extracted frames, and organized dataset into structured folders for YOLO annotation.', 'Done', 'High', '2026-08-01', '2026-08-02', 'proj-pvis', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad', '2026-08-02 23:59:59'),
          ('tsk-pvis-2', 'Phase 2 - AI Detection & Tracking', 'Implemented YOLOv5 vehicle detection, EasyOCR for Pakistani license plates with dynamic cropping, and tracking with unique IDs.', 'Done', 'High', '2026-08-03', '2026-08-06', 'proj-pvis', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad', '2026-08-06 23:59:59'),
          ('tsk-pvis-3', 'Phase 3 - Edge Pipeline (Jetson Nano)', 'Built the 3-thread architecture (Producer, Consumer, OCR Worker) with MOG2 motion detection and SQLite db integration.', 'Done', 'High', '2026-08-07', '2026-08-10', 'proj-pvis', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad', '2026-08-10 23:59:59'),
          ('tsk-pvis-4', 'Phase 4 - Local Flask Dashboard', 'Created local UI on port 5000 with MJPEG live streams, start/stop controls, and real-time event logs.', 'Done', 'Medium', '2026-08-11', '2026-08-12', 'proj-pvis', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad', '2026-08-12 23:59:59'),
          ('tsk-pvis-5', 'Phase 5 - Cloud Backend', 'Deployed FastAPI backend on Railway connected to Neon PostgreSQL. Configured sync endpoints for events and sessions.', 'Done', 'High', '2026-08-13', '2026-08-14', 'proj-pvis', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad', '2026-08-14 23:59:59'),
          ('tsk-pvis-6', 'Phase 6 - Live Web Dashboard', 'Developed Next.js web application deployed on Vercel for real-time monitoring and traffic analytics.', 'Done', 'High', '2026-08-15', '2026-08-16', 'proj-pvis', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad', '2026-08-16 23:59:59'),
          ('tsk-pvis-7', 'Phase 7 - Cloud Sync & Offline Recovery', 'Implemented offline-first background daemon for sync and a standalone script for historical recovery.', 'Done', 'High', '2026-08-17', '2026-08-18', 'proj-pvis', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad', '2026-08-18 23:59:59'),
          ('tsk-pvis-8', 'Phase 8 - Jetson Nano Optimization', 'Resolved OOM issues, camera bottleneck (MJPG codec), PyTorch Hub prompt, and created swap file.', 'Done', 'High', '2026-08-19', '2026-08-19', 'proj-pvis', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad', '2026-08-19 23:59:59'),
          ('tsk-pvis-9', 'Phase 9 - Deployment & DevOps', 'Finalized GitHub repository, .gitignore, and configured the systemd service (pvis.service) to auto-start.', 'Done', 'Medium', '2026-08-20', '2026-08-20', 'proj-pvis', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad', '2026-08-20 23:59:59')
        ON CONFLICT (id) DO NOTHING;
      \\\);
\;
dbJs = dbJs.replace('// Seed task submissions', tasksSql + '\\n\\n      // Seed task submissions');

fs.writeFileSync(dbJsPath, dbJs);
console.log('Successfully injected PVIS tasks to config/db.js');

