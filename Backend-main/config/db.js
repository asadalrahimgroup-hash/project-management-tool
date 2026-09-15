const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

process.env.JWT_SECRET = process.env.JWT_SECRET || "al-rahim-group-jwt-secret-2026";

let pool;

async function initDatabase(poolInstance) {
  try {
    const client = await poolInstance.connect();
    try {
      console.log("🚀 Initializing database schema & actual dataset...");

      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          full_name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'Member',
          job_title TEXT DEFAULT 'Specialist',
          is_active BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_login_at TIMESTAMP WITH TIME ZONE
        );

        CREATE TABLE IF NOT EXISTS programs (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          code TEXT,
          description TEXT,
          domain TEXT,
          priority TEXT DEFAULT 'Medium',
          status TEXT DEFAULT 'Active',
          start_date DATE,
          end_date DATE,
          created_by TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          domain TEXT,
          about_title TEXT,
          about_description TEXT,
          status TEXT DEFAULT 'Active',
          priority TEXT DEFAULT 'Medium',
          start_date DATE,
          deadline DATE,
          progress INTEGER DEFAULT 0,
          program_id TEXT,
          manager_id TEXT,
          project_manager_id TEXT,
          created_by TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS program_projects (
          id TEXT PRIMARY KEY,
          program_id TEXT NOT NULL,
          name TEXT NOT NULL,
          domain TEXT,
          about_title TEXT,
          about_description TEXT,
          status TEXT DEFAULT 'In Progress',
          priority TEXT DEFAULT 'Medium',
          start_date DATE,
          deadline DATE,
          created_by TEXT,
          assigned_to TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS project_members (
          id TEXT PRIMARY KEY,
          project_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          role TEXT DEFAULT 'Contributor',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS teams (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          created_by TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS team_members (
          team_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          PRIMARY KEY (team_id, user_id)
        );

        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          title TEXT,
          description TEXT,
          status TEXT DEFAULT 'To Do',
          priority TEXT DEFAULT 'Medium',
          start_date DATE,
          due_date DATE,
          project_id TEXT,
          assignee_id TEXT,
          assigned_to TEXT,
          created_by TEXT,
          completed_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS program_project_tasks (
          id TEXT PRIMARY KEY,
          program_project_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'To Do',
          priority TEXT DEFAULT 'Medium',
          assigned_to TEXT,
          due_date DATE,
          created_by TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS program_project_members (
          program_project_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          assigned_by TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          PRIMARY KEY (program_project_id, user_id)
        );

        CREATE TABLE IF NOT EXISTS task_work_parts (
          id TEXT PRIMARY KEY,
          task_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'To Do',
          created_by TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS task_submissions (
          id TEXT PRIMARY KEY,
          task_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          link TEXT NOT NULL,
          description TEXT,
          version INTEGER DEFAULT 1,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS task_challenges (
          id TEXT PRIMARY KEY,
          task_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          challenge TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS task_attachments (
          id TEXT PRIMARY KEY DEFAULT 'att-' || extract(epoch from now())::bigint || '-' || floor(random()*1000000)::text,
          task_id TEXT NOT NULL,
          file_name TEXT NOT NULL,
          file_type TEXT,
          mime_type TEXT,
          file_size INTEGER DEFAULT 0,
          file_path TEXT,
          file_content BYTEA,
          uploaded_by TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS project_reports (
          id TEXT PRIMARY KEY DEFAULT 'rpt-' || extract(epoch from now())::bigint || '-' || floor(random()*1000000)::text,
          project_id TEXT NOT NULL UNIQUE,
          title TEXT,
          content TEXT,
          format TEXT DEFAULT 'text',
          file_path TEXT,
          submitted_by TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      // Seed users with rotated credentials
      const asadHash = bcrypt.hashSync("Arg@Asad2026!", 10);
      const qasimHash = bcrypt.hashSync("Arg@Qasim2026!", 10);
      const fahadHash = bcrypt.hashSync("Arg@Fahad2026!", 10);
      const ajiyaHash = bcrypt.hashSync("Arg@Ajiya2026!", 10);
      const hibaHash = bcrypt.hashSync("Arg@Hiba2026!", 10);
      const kinjalHash = bcrypt.hashSync("Arg@Kinjal2026!", 10);
      const khizraHash = bcrypt.hashSync("Arg@Khizra2026!", 10);

      await client.query(`
        INSERT INTO users (id, full_name, email, password_hash, role, job_title, is_active)
        VALUES 
          ('usr-pm-asad', 'Asad Navaid', 'asad@argplatform.com', '${asadHash}', 'Project Manager', 'Project Director & Head of AI', true),
          ('usr-pm-qasim', 'Qasim', 'qasim@argplatform.com', '${qasimHash}', 'Project Manager', 'Project Manager & AI Operations Lead', true),
          ('usr-fahad', 'Fahad', 'fahad@argplatform.com', '${fahadHash}', 'Member', 'Edge AI & Computer Vision Engineer', true),
          ('usr-ajiya', 'Ajiya', 'ajiya@argplatform.com', '${ajiyaHash}', 'Member', 'AI Pipeline & Voice Architect', true),
          ('usr-hiba', 'Hiba', 'hiba@argplatform.com', '${hibaHash}', 'Member', 'Backend & Systems Integration Engineer', true),
          ('usr-kinjal', 'Kinjal', 'kinjal@argplatform.com', '${kinjalHash}', 'Member', 'RAG & Full-Stack AI Engineer', true),
          ('usr-khizra', 'Khizra', 'khizra@argplatform.com', '${khizraHash}', 'Member', 'Agentic AI & Workflow Specialist', true)
        ON CONFLICT (id) DO UPDATE SET 
          full_name = EXCLUDED.full_name,
          email = EXCLUDED.email,
          password_hash = EXCLUDED.password_hash,
          role = EXCLUDED.role,
          job_title = EXCLUDED.job_title;
      `);

      // Seed program: QUANTUM AGENTIC RESEARCH CENTER (QARC)
      await client.query(`
        INSERT INTO programs (id, name, code, description, domain, priority, status, start_date, end_date, created_by)
        VALUES 
          ('prog-qarc', 'QUANTUM AGENTIC RESEARCH CENTER', 'QARC', 'Advanced AI agent research, multimodal pipelines, edge intelligence, and autonomous enterprise systems.', 'Agentic AI & Edge Intelligence', 'High', 'Active', '2026-08-01', '2026-12-31', 'usr-pm-asad')
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          code = EXCLUDED.code,
          description = EXCLUDED.description;
      `);

      // Seed teams
      await client.query(`
        INSERT INTO teams (id, name, description, created_by)
        VALUES
          ('tm-edge-voice', 'Edge AI & Multimodal Speech Lab', 'Offline edge vision pipelines, speech synthesis, and voice cloning.', 'usr-pm-asad'),
          ('tm-agents-enterprise', 'Autonomous Agents & Enterprise Logistics', 'Multi-agent orchestration, commercial freight engines, and HR automation.', 'usr-pm-asad')
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO team_members (team_id, user_id)
        VALUES
          ('tm-edge-voice', 'usr-pm-asad'),
          ('tm-edge-voice', 'usr-fahad'),
          ('tm-edge-voice', 'usr-ajiya'),
          ('tm-edge-voice', 'usr-kinjal'),
          ('tm-agents-enterprise', 'usr-hiba'),
          ('tm-agents-enterprise', 'usr-khizra')
        ON CONFLICT DO NOTHING;
      `);

      // Seed projects (All 5 under QARC)
      await client.query(`
        INSERT INTO projects (id, name, domain, about_title, about_description, status, priority, start_date, deadline, progress, program_id, manager_id, project_manager_id, created_by)
        VALUES 
          ('proj-voicescribe', 'VoiceScribe', 'Speech & Translation AI', 'Multilingual Meeting Transcription & Diarization', 'Real-time audio transcription, speaker diarization, multi-model translation, and meeting recordings analysis.', 'In Progress', 'High', '2026-08-15', '2026-09-30', 100, 'prog-qarc', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad'),
          ('proj-fishery', 'Fishery Automation', 'Edge Vision & Embedded AI', 'Offline Jetson Nano Freshness & Weighing Scale Pipeline', 'Offline Jetson Nano edge deployment on factory scales, YOLOv8n fish and eye freshness detectors, rotated bbox sizing, and ByteTrack packing dispatch telemetry.', 'In Progress', 'High', '2026-08-20', '2026-10-15', 50, 'prog-qarc', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad'),
          ('proj-hr-agent', 'HR Agent', 'Enterprise Workflow Automation', 'Autonomous Multi-Stage HR Workflow System', 'Autonomous candidate screening, 5-stage automated workflows, interview evaluations, dashboard UI, and sequence validation.', 'In Progress', 'Medium', '2026-08-20', '2026-09-25', 83, 'prog-qarc', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad'),
          ('proj-freight', 'AI Freight Forwarding Lifecycle', 'Logistics & Commercial AI', 'End-to-End Autonomous Freight & Commercial Engine', 'Commercial master data, tariff versioning, RFQ & Pricing agents, Sea FCL/Air Direct shipment workspaces, BL/AWB, financial ledger, DGR compliance, and exception control tower.', 'In Progress', 'High', '2026-09-01', '2026-11-15', 52, 'prog-qarc', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad'),
          ('proj-ai-tutor', 'AI Tutor', 'Conversational AI & Avatars', 'Multimodal Avatar & Local Real-Time Voice Tutor', 'SadTalker talking-head video rendering, Coqui XTTS-v2 code-mixed Urdu-English voice cloning, RAG document grounding, Faster-Whisper, and Silero VAD live voice loop.', 'In Progress', 'High', '2026-08-01', '2026-10-10', 80, 'prog-qarc', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad'),
          ('proj-uae-voice', 'UAE Voice Model for Competition', 'Arabic Speech AI & Voice Synthesis', 'Emirati Dialect Competitive Neural Voice AI', 'Specialized Emirati Arabic neural voice synthesis, dialectal acoustic modeling, prosody transfer, and ultra-low latency inference for the UAE International AI Competition.', 'Unassigned', 'High', '2026-08-25', '2026-10-30', 0, 'prog-qarc', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad'),
          ('proj-axiom', 'Axiom', 'Formal Reasoning & Neural-Symbolic AI', 'Automated Mathematical Proof & Logic Engine', 'Neural-symbolic theorem prover, automated code invariant generation, formal verification solvers, and strict mathematical proof validation for mission-critical systems.', 'Unassigned', 'High', '2026-08-20', '2026-11-15', 0, 'prog-qarc', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad'),
          ('proj-ecommerce-agent', 'Ecommerce Agent', 'Autonomous Commerce & Conversational Selling', 'Autonomous Multi-Channel Shopping & Cart Agent', 'Autonomous agentic shopping assistant with dynamic product catalog search, real-time inventory synchronization, intelligent upsell recommendations, and headless cart orchestration.', 'Unassigned', 'High', '2026-08-22', '2026-10-25', 0, 'prog-qarc', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad'),
          ('proj-embassy-reachout', 'Embassy Reach out', 'Diplomatic Intelligence & Automated Outreach', 'Autonomous Diplomatic Communications & Partner Engagement', 'Automated diplomatic stakeholder mapping, bilateral protocol compliance, customized diplomatic communication pipelines, and international partnership dossier generation.', 'Unassigned', 'Medium', '2026-08-28', '2026-11-20', 0, 'prog-qarc', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad'),
          ('proj-retina-scan', 'Retina Scan Early Disease Detection', 'Medical Imaging & Diagnostic AI', 'Deep Learning Fundus Image Pathology Classification', 'High-resolution retinal fundus photography analysis using hybrid CNN-ViT architectures for automated early detection of diabetic retinopathy, glaucoma, and macular degeneration.', 'Unassigned', 'High', '2026-08-15', '2026-10-31', 0, 'prog-qarc', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad'),
          ('proj-fmd-detection', 'Foot and Mouth Disease (FMD) Detection in Animals', 'Veterinary Computer Vision & Edge Diagnostics', 'Livestock Lesion Detection & Thermal Screening Vision Pipeline', 'Real-time multi-spectral thermal and RGB computer vision pipeline deployed on edge cameras for early detection of FMD vesicular lesions in cattle hooves and muzzles.', 'Unassigned', 'High', '2026-08-18', '2026-11-10', 0, 'prog-qarc', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad'),
          ('proj-marketing-agent', 'Marketing Agent', 'Autonomous Marketing & Growth Automation', 'Autonomous Omnichannel Campaign & Content Engine', 'Autonomous growth agent capable of market research, high-conversion copy generation, dynamic creative synthesis, SEO keyword cluster analysis, and cross-platform campaign optimization.', 'Unassigned', 'Medium', '2026-08-25', '2026-10-20', 0, 'prog-qarc', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad')
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          domain = EXCLUDED.domain,
          about_title = EXCLUDED.about_title,
          about_description = EXCLUDED.about_description,
          status = EXCLUDED.status,
          progress = EXCLUDED.progress;
      `);

      // Seed program_projects
      await client.query(`
        INSERT INTO program_projects (id, program_id, name, domain, about_title, about_description, status, priority, start_date, deadline, created_by, assigned_to)
        VALUES 
          ('pp-voicescribe', 'prog-qarc', 'VoiceScribe', 'Speech & Translation AI', 'Meeting Audio & Translation Pipeline', 'Multi-model transcription and diarization.', 'In Progress', 'High', '2026-08-15', '2026-09-30', 'usr-pm-asad', 'usr-ajiya'),
          ('pp-fishery', 'prog-qarc', 'Fishery Automation', 'Edge Vision & Embedded AI', 'Jetson Nano Scale Vision System', 'Real-time fish freshness grading and count tracking.', 'In Progress', 'High', '2026-08-20', '2026-10-15', 'usr-pm-asad', 'usr-fahad'),
          ('pp-hr-agent', 'prog-qarc', 'HR Agent', 'Enterprise Workflow Automation', 'Autonomous HR Candidate Workflows', '5-stage autonomous hiring pipelines and screening.', 'In Progress', 'Medium', '2026-08-20', '2026-09-25', 'usr-pm-asad', 'usr-khizra'),
          ('pp-freight', 'prog-qarc', 'AI Freight Forwarding Lifecycle', 'Logistics & Commercial AI', 'Autonomous Logistics Operations & Finance Engine', '8-phase commercial freight engine with multi-agent orchestration.', 'In Progress', 'High', '2026-09-01', '2026-11-15', 'usr-pm-asad', 'usr-hiba'),
          ('pp-ai-tutor', 'prog-qarc', 'AI Tutor', 'Conversational AI & Avatars', 'Talking Head Avatar & Real-time Voice Tutor', 'SadTalker, XTTS-v2 voice cloning, and Silero VAD interactive tutor.', 'In Progress', 'High', '2026-08-01', '2026-10-10', 'usr-pm-asad', 'usr-kinjal'),
          ('pp-uae-voice', 'prog-qarc', 'UAE Voice Model for Competition', 'Arabic Speech AI & Voice Synthesis', 'Emirati Dialect Competitive Neural Voice AI', 'Specialized Emirati Arabic neural voice synthesis, dialectal acoustic modeling, and latency optimization.', 'Unassigned', 'High', '2026-08-25', '2026-10-30', 'usr-pm-asad', NULL),
          ('pp-axiom', 'prog-qarc', 'Axiom', 'Formal Reasoning & Neural-Symbolic AI', 'Automated Mathematical Proof & Logic Engine', 'Neural-symbolic theorem prover, automated code invariant generation, and formal verification solvers.', 'Unassigned', 'High', '2026-08-20', '2026-11-15', 'usr-pm-asad', NULL),
          ('pp-ecommerce-agent', 'prog-qarc', 'Ecommerce Agent', 'Autonomous Commerce & Conversational Selling', 'Autonomous Multi-Channel Shopping & Cart Agent', 'Dynamic product catalog search, real-time inventory sync, intelligent recommendations, and headless cart.', 'Unassigned', 'High', '2026-08-22', '2026-10-25', 'usr-pm-asad', NULL),
          ('pp-embassy-reachout', 'prog-qarc', 'Embassy Reach out', 'Diplomatic Intelligence & Automated Outreach', 'Autonomous Diplomatic Communications & Partner Engagement', 'Automated diplomatic stakeholder mapping, bilateral protocol compliance, and customized outreach pipelines.', 'Unassigned', 'Medium', '2026-08-28', '2026-11-20', 'usr-pm-asad', NULL),
          ('pp-retina-scan', 'prog-qarc', 'Retina Scan Early Disease Detection', 'Medical Imaging & Diagnostic AI', 'Deep Learning Fundus Image Pathology Classification', 'High-resolution retinal fundus photography analysis using CNN-ViT for diabetic retinopathy & glaucoma detection.', 'Unassigned', 'High', '2026-08-15', '2026-10-31', 'usr-pm-asad', NULL),
          ('pp-fmd-detection', 'prog-qarc', 'Foot and Mouth Disease (FMD) Detection in Animals', 'Veterinary Computer Vision & Edge Diagnostics', 'Livestock Lesion Detection & Thermal Screening Vision Pipeline', 'Multi-spectral thermal and RGB computer vision for early detection of FMD vesicular lesions in hooves and muzzles.', 'Unassigned', 'High', '2026-08-18', '2026-11-10', 'usr-pm-asad', NULL),
          ('pp-marketing-agent', 'prog-qarc', 'Marketing Agent', 'Autonomous Marketing & Growth Automation', 'Autonomous Omnichannel Campaign & Content Engine', 'Autonomous growth agent capable of market research, high-conversion copy generation, and multi-channel optimization.', 'Unassigned', 'Medium', '2026-08-25', '2026-10-20', 'usr-pm-asad', NULL)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          domain = EXCLUDED.domain,
          status = EXCLUDED.status,
          assigned_to = EXCLUDED.assigned_to;
      `);

      // Seed project_members
      await client.query(`
        INSERT INTO project_members (id, project_id, user_id, role)
        VALUES
          ('pm-vs-1', 'proj-voicescribe', 'usr-pm-asad', 'Project Manager'),
          ('pm-vs-2', 'proj-voicescribe', 'usr-ajiya', 'AI Pipeline Lead'),
          ('pm-vs-3', 'proj-voicescribe', 'usr-khizra', 'Backend Engineer'),
          ('pm-vs-4', 'proj-voicescribe', 'usr-fahad', 'Diarization Specialist'),
          
          ('pm-fa-1', 'proj-fishery', 'usr-pm-asad', 'Project Manager'),
          ('pm-fa-2', 'proj-fishery', 'usr-fahad', 'Vision & Edge Lead'),

          ('pm-hr-1', 'proj-hr-agent', 'usr-pm-asad', 'Project Manager'),
          ('pm-hr-2', 'proj-hr-agent', 'usr-khizra', 'Workflow Lead'),

          ('pm-ff-1', 'proj-freight', 'usr-pm-asad', 'Project Manager'),
          ('pm-ff-2', 'proj-freight', 'usr-ajiya', 'Commercial Lead'),
          ('pm-ff-3', 'proj-freight', 'usr-hiba', 'Backend & Automation Lead'),
          ('pm-ff-4', 'proj-freight', 'usr-kinjal', 'Operations & Compliance Lead'),
          ('pm-ff-5', 'proj-freight', 'usr-khizra', 'Agents Specialist'),

          ('pm-at-1', 'proj-ai-tutor', 'usr-pm-asad', 'Project Manager'),
          ('pm-at-2', 'proj-ai-tutor', 'usr-ajiya', 'Avatar & Voice Lead'),
          ('pm-at-3', 'proj-ai-tutor', 'usr-kinjal', 'RAG & Audio Pipeline Lead'),

          ('pm-uv-1', 'proj-uae-voice', 'usr-pm-asad', 'Project Manager'),
          ('pm-ax-1', 'proj-axiom', 'usr-pm-asad', 'Project Manager'),
          ('pm-ea-1', 'proj-ecommerce-agent', 'usr-pm-asad', 'Project Manager'),
          ('pm-er-1', 'proj-embassy-reachout', 'usr-pm-asad', 'Project Manager'),
          ('pm-rs-1', 'proj-retina-scan', 'usr-pm-asad', 'Project Manager'),
          ('pm-fm-1', 'proj-fmd-detection', 'usr-pm-asad', 'Project Manager'),
          ('pm-ma-1', 'proj-marketing-agent', 'usr-pm-asad', 'Project Manager')
        ON CONFLICT (id) DO NOTHING;
      `);

      // Seed task submissions
      await client.query(`
        INSERT INTO task_submissions (id, task_id, user_id, link, description, version)
        VALUES
          ('sub-hr-6', 'tsk-hr-6', 'usr-khizra', 'https://github.com/qarc-ai/hr-agent/pull/19', 'HR Agent 5-stage automated workflows completed and verified with test matrix.', 1),
          ('sub-ff-9', 'tsk-ff-9', 'usr-ajiya', 'https://github.com/qarc-ai/freight-lifecycle/pull/142', '5.1 Shipment Financial Profile & Variance Engine with ledger audit API endpoints.', 1),
          ('sub-ff-12', 'tsk-ff-12', 'usr-hiba', 'https://github.com/qarc-ai/freight-lifecycle/pull/145', '5.4 Accounts Receivable with FIFO/LIFO allocation and automated dunning workflow.', 1),
          ('sub-ff-13', 'tsk-ff-13', 'usr-kinjal', 'https://github.com/qarc-ai/freight-lifecycle/pull/148', '5.5 DGR Compliance Engine with validation rules and compliance audit trail.', 1),
          ('sub-ff-29', 'tsk-ff-29', 'usr-hiba', 'https://github.com/qarc-ai/freight-lifecycle/pull/160', 'Gmail API alert dispatch integrated across all 5 automations.', 1),
          ('sub-ff-31', 'tsk-ff-31', 'usr-khizra', 'https://github.com/qarc-ai/freight-lifecycle/pull/162', 'Multi-agent output verification test suite with 100% assertions passed.', 1)
        ON CONFLICT (id) DO NOTHING;
      `);

      // Seed task work parts
      await client.query(`
        INSERT INTO task_work_parts (id, task_id, title, description, status, created_by)
        VALUES
          ('wp-vs-1', 'tsk-vs-1', 'PyTorch Audio Preprocessing Pipeline', 'Chunking, resampling to 16kHz, and VAD audio framing', 'Done', 'usr-ajiya'),
          ('wp-vs-2', 'tsk-vs-1', 'Whisper ASR Model Benchmarking', 'Benchmarking base vs medium Whisper weights on Colab', 'Done', 'usr-ajiya'),
          ('wp-fa-1', 'tsk-fa-2', 'YOLOv8n Freshness Detector Weight Export', 'Exported best.pt achieving 92.2% mAP50', 'Done', 'usr-fahad'),
          ('wp-fa-2', 'tsk-fa-2', 'Fish Eye Crop Classification Model', 'Anatomical eye crop freshness classifier 95.9% mAP50', 'Done', 'usr-fahad'),
          ('wp-at-1', 'tsk-at-3', 'Coqui XTTS-v2 Multilingual Urdu-English Reference Audio', 'Curated 20-second reference samples for voice cloning', 'Done', 'usr-ajiya'),
          ('wp-at-2', 'tsk-at-7', 'FAISS & BM25 Hybrid Retrieval Worker', 'Combined dense vector search with sparse BM25 scoring', 'Done', 'usr-kinjal')
        ON CONFLICT (id) DO NOTHING;
      `);

      console.log("✅ QARC Database schema & actual dataset successfully synchronized!");

    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Database initialization error:", err);
  }
}

if (process.env.DATABASE_URL) {
  console.log("Connecting to PostgreSQL / Neon via DATABASE_URL...");
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
  });

  pool.on("connect", () => {
    console.log("PostgreSQL connection established");
  });

  pool.on("error", (err) => {
    console.error("Unexpected PostgreSQL pool error:", err);
  });

  // Run schema creation and actual seed on real PostgreSQL database
  initDatabase(pool);
} else {
  console.log("⚡ DATABASE_URL not found: Initializing Local In-Memory PostgreSQL (pg-mem)...");
  const { newDb } = require("pg-mem");
  const mem = newDb();

  // Register common pg functions
  mem.public.registerFunction({
    name: "now",
    args: [],
    returns: mem.public.getType("timestamp with time zone"),
    implementation: () => new Date(),
  });

  const pg = mem.adapters.createPg();
  pool = new pg.Pool();

  initDatabase(pool);
}

module.exports = pool;
