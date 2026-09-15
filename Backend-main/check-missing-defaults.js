const pool = require('./config/db');

async function run() {
  const r = await pool.query(`
    SELECT table_name, column_name, data_type, is_nullable, column_default 
    FROM information_schema.columns 
    WHERE table_schema='public' AND column_name='id'
    ORDER BY table_name;
  `);

  console.log("=== Tables with 'id' column ===");
  for (const row of r.rows) {
    console.log(`${row.table_name.padEnd(25)} | nullable: ${row.is_nullable} | default: ${row.column_default}`);
  }

  pool.end();
}

run();
