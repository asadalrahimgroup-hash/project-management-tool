// scripts/inspect-db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function inspect() {
  const info = await pool.query('SELECT current_database(), current_user');
  console.log('DB Info:', info.rows[0]);

  const tables = await pool.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);
  console.log('\nTables in public schema:');
  for (let r of tables.rows) {
    try {
      const count = await pool.query('SELECT count(*) FROM ' + r.table_name);
      console.log(' - ' + r.table_name + ': ' + count.rows[0].count + ' rows');
    } catch(e) {
      console.log(' - ' + r.table_name + ': error reading count');
    }
  }

  const p = await pool.query('SELECT id, name, program_id, status FROM projects ORDER BY created_at ASC');
  console.log('\nAll projects in projects table (' + p.rows.length + '):');
  p.rows.forEach(r => console.log(' * ' + r.id + ' | ' + r.name + ' | ' + r.program_id + ' | ' + r.status));

  const pp = await pool.query('SELECT id, name, program_id, status, assigned_to FROM program_projects ORDER BY created_at ASC');
  console.log('\nAll program_projects (' + pp.rows.length + '):');
  pp.rows.forEach(r => console.log(' * ' + r.id + ' | ' + r.name + ' | ' + r.program_id + ' | ' + r.status + ' | ' + r.assigned_to));

  await pool.end();
}
inspect().catch(console.error);
