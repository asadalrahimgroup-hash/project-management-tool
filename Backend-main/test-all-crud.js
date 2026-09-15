const pool = require('./config/db');

async function run() {
  console.log("=== Testing DB Inserts Without ID ===");
  try {
    await pool.query("INSERT INTO programs (name) VALUES ('Test')");
    console.log("Programs insert succeeded without id");
  } catch (e) {
    console.log("Programs insert failed:", e.message);
  }

  try {
    await pool.query("INSERT INTO projects (name) VALUES ('Test')");
    console.log("Projects insert succeeded without id");
  } catch (e) {
    console.log("Projects insert failed:", e.message);
  }

  try {
    await pool.query("INSERT INTO tasks (name) VALUES ('Test')");
    console.log("Tasks insert succeeded without id");
  } catch (e) {
    console.log("Tasks insert failed:", e.message);
  }

  try {
    await pool.query("INSERT INTO program_projects (program_id, name) VALUES ('prog-qarc', 'Test')");
    console.log("Program_projects insert succeeded without id");
  } catch (e) {
    console.log("Program_projects insert failed:", e.message);
  }

  pool.end();
}

run();
