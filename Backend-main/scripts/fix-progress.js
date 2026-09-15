require('dotenv').config();
const pool = require('../config/db');

(async () => {
  try {
    const unstarted = [
      'proj-axiom',
      'proj-marketing-agent',
      'proj-ecommerce-agent',
      'proj-embassy-reachout',
      'proj-fmd-detection',
      'proj-retina-scan',
      'proj-uae-voice'
    ];

    console.log('1. Setting progress = 0 and status = Unassigned for 7 unstarted projects...');
    await pool.query(
      `UPDATE projects SET progress = 0, status = 'Unassigned' WHERE id = ANY($1::text[])`,
      [unstarted]
    );

    console.log('2. Ensuring program_projects status = Unassigned and assigned_to = NULL...');
    await pool.query(
      `UPDATE program_projects SET status = 'Unassigned', assigned_to = NULL WHERE id = ANY($1::text[])`,
      [unstarted.map(id => id.replace('proj-', 'pp-'))]
    );

    console.log('3. Recalculating progress for projects that have tasks...');
    await pool.query(`
      UPDATE projects p
      SET progress = sub.pct
      FROM (
        SELECT project_id, ROUND((COUNT(CASE WHEN status = 'Done' THEN 1 END)::numeric / COUNT(*)::numeric) * 100)::integer as pct
        FROM tasks
        GROUP BY project_id
      ) sub
      WHERE p.id = sub.project_id
    `);

    console.log('4. Verifying project progress in Neon PostgreSQL:');
    const r = await pool.query(`
      SELECT 
        p.id, 
        p.name, 
        p.status, 
        p.progress,
        COUNT(t.id) as total_tasks,
        COUNT(CASE WHEN t.status = 'Done' THEN 1 END) as done_tasks
      FROM projects p
      LEFT JOIN tasks t ON p.id = t.project_id
      GROUP BY p.id, p.name, p.status, p.progress
      ORDER BY p.name ASC
    `);
    console.table(r.rows);
  } catch (err) {
    console.error('Error fixing progress:', err);
  } finally {
    process.exit(0);
  }
})();
