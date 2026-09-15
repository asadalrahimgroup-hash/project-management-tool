const pool = require('./config/db');

async function clean() {
  await pool.query("DELETE FROM tasks WHERE name = 'Test'");
  await pool.query("DELETE FROM program_projects WHERE name = 'Test'");
  await pool.query("DELETE FROM projects WHERE name = 'Test'");
  await pool.query("DELETE FROM programs WHERE name = 'Test'");
  console.log("✅ Test entries cleaned successfully");
  pool.end();
}

clean();
