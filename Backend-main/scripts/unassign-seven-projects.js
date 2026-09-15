// scripts/unassign-seven-projects.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function unassignNewProjects() {
  const client = await pool.connect();
  try {
    const projectIds = [
      'proj-uae-voice',
      'proj-axiom',
      'proj-ecommerce-agent',
      'proj-embassy-reachout',
      'proj-retina-scan',
      'proj-fmd-detection',
      'proj-marketing-agent'
    ];
    const ppIds = [
      'pp-uae-voice',
      'pp-axiom',
      'pp-ecommerce-agent',
      'pp-embassy-reachout',
      'pp-retina-scan',
      'pp-fmd-detection',
      'pp-marketing-agent'
    ];

    // 1. In program_projects, set assigned_to = NULL and status = 'Unassigned'
    await client.query(
      `UPDATE program_projects
       SET assigned_to = NULL, status = 'Unassigned'
       WHERE id = ANY($1::text[])`,
      [ppIds]
    );

    // 2. Remove any tasks associated with these projects so members are not assigned tasks
    await client.query(
      `DELETE FROM tasks
       WHERE project_id = ANY($1::text[])`,
      [projectIds]
    );

    // 3. Remove members from project_members except PM Asad
    await client.query(
      `DELETE FROM project_members
       WHERE project_id = ANY($1::text[]) AND user_id != 'usr-pm-asad'`,
      [projectIds]
    );

    console.log('✅ Successfully unassigned all 7 projects.');

    const res = await client.query(
      `SELECT id, name, assigned_to, status FROM program_projects WHERE id = ANY($1::text[])`,
      [ppIds]
    );
    console.log('Current state of the 7 projects:');
    res.rows.forEach(r => {
      console.log(`- ${r.name} (${r.id}): assigned_to=${r.assigned_to}, status=${r.status}`);
    });

  } finally {
    client.release();
    await pool.end();
  }
}

unassignNewProjects().catch(console.error);
