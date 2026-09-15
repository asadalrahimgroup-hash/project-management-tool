const pool = require('../config/db');

async function migrate() {
  console.log("Applying table default ID migrations...");
  const queries = [
    `ALTER TABLE programs ALTER COLUMN id SET DEFAULT ('prog-' || substr(md5(random()::text || clock_timestamp()::text), 1, 10));`,
    `ALTER TABLE projects ALTER COLUMN id SET DEFAULT ('proj-' || substr(md5(random()::text || clock_timestamp()::text), 1, 10));`,
    `ALTER TABLE program_projects ALTER COLUMN id SET DEFAULT ('pp-' || substr(md5(random()::text || clock_timestamp()::text), 1, 10));`,
    `ALTER TABLE tasks ALTER COLUMN id SET DEFAULT ('tsk-' || substr(md5(random()::text || clock_timestamp()::text), 1, 10));`,
    `ALTER TABLE program_project_tasks ALTER COLUMN id SET DEFAULT ('ppt-' || substr(md5(random()::text || clock_timestamp()::text), 1, 10));`,
    `ALTER TABLE project_members ALTER COLUMN id SET DEFAULT ('pm-' || substr(md5(random()::text || clock_timestamp()::text), 1, 10));`,
    `ALTER TABLE task_attachments ALTER COLUMN id SET DEFAULT ('att-' || substr(md5(random()::text || clock_timestamp()::text), 1, 10));`,
    `ALTER TABLE task_challenges ALTER COLUMN id SET DEFAULT ('ch-' || substr(md5(random()::text || clock_timestamp()::text), 1, 10));`,
    `ALTER TABLE task_submissions ALTER COLUMN id SET DEFAULT ('sub-' || substr(md5(random()::text || clock_timestamp()::text), 1, 10));`,
    `ALTER TABLE task_work_parts ALTER COLUMN id SET DEFAULT ('twp-' || substr(md5(random()::text || clock_timestamp()::text), 1, 10));`,
    `ALTER TABLE teams ALTER COLUMN id SET DEFAULT ('tm-' || substr(md5(random()::text || clock_timestamp()::text), 1, 10));`,
    `ALTER TABLE task_submissions ALTER COLUMN link DROP NOT NULL;`
  ];

  for (const q of queries) {
    try {
      await pool.query(q);
      console.log("✅ Success:", q.substring(0, 45) + "...");
    } catch (e) {
      console.error("❌ Failed query:", q, e.message);
    }
  }

  console.log("Migration complete!");
  pool.end();
}

migrate();
