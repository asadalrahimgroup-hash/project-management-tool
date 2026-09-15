const pool = require('./config/db');

async function check() {
  try {
    const res = await pool.query(`
      SELECT table_name, column_name, column_default, is_nullable, data_type 
      FROM information_schema.columns 
      WHERE table_schema='public' 
        AND table_name IN ('programs', 'projects', 'program_projects', 'tasks', 'project_members', 'task_submissions')
      ORDER BY table_name, ordinal_position;
    `);

    const grouped = {};
    for (const row of res.rows) {
      if (!grouped[row.table_name]) grouped[row.table_name] = [];
      grouped[row.table_name].push({
        column: row.column_name,
        type: row.data_type,
        default: row.column_default,
        nullable: row.is_nullable
      });
    }

    console.log(JSON.stringify(grouped, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

check();
