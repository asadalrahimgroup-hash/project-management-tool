const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Y0DTt2lqfMBi@ep-silent-night-ae3sk4pw-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🚀 Connecting to Neon to initialize QARC real dataset...');

    // Clear old mock seed
    await client.query(`
      TRUNCATE 
        task_submissions, 
        task_work_parts, 
        task_challenges, 
        task_attachments, 
        tasks, 
        program_project_tasks, 
        program_project_members, 
        program_projects, 
        project_members, 
        team_members, 
        teams, 
        projects, 
        programs, 
        users 
      CASCADE
    `);

    const passwordHash = bcrypt.hashSync('Password@123', 10);

    // 1. Users: Project Manager Asad Navaid & Members (Fahad, Ajiya, Hiba, Kinjal, Khizra)
    console.log('👤 Seeding Project Manager & Team Members...');
    await client.query(`
      INSERT INTO users (id, full_name, email, password_hash, role, job_title, is_active)
      VALUES 
        ('usr-pm-asad', 'Asad Navaid', 'asad@argplatform.com', '${passwordHash}', 'Project Manager', 'Project Director & Head of AI', true),
        ('usr-fahad', 'Fahad', 'fahad@argplatform.com', '${passwordHash}', 'Member', 'Edge AI & Computer Vision Engineer', true),
        ('usr-ajiya', 'Ajiya', 'ajiya@argplatform.com', '${passwordHash}', 'Member', 'AI Pipeline & Voice Architect', true),
        ('usr-hiba', 'Hiba', 'hiba@argplatform.com', '${passwordHash}', 'Member', 'Backend & Systems Integration Engineer', true),
        ('usr-kinjal', 'Kinjal', 'kinjal@argplatform.com', '${passwordHash}', 'Member', 'RAG & Full-Stack AI Engineer', true),
        ('usr-khizra', 'Khizra', 'khizra@argplatform.com', '${passwordHash}', 'Member', 'Agentic AI & Workflow Specialist', true)
      ON CONFLICT (id) DO UPDATE SET 
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        job_title = EXCLUDED.job_title;
    `);

    // 2. Program: QUANTUM AGENTIC RESEARCH CENTER (QARC)
    console.log('🏢 Seeding Program: QUANTUM AGENTIC RESEARCH CENTER (QARC)...');
    await client.query(`
      INSERT INTO programs (id, name, code, description, domain, priority, status, start_date, end_date, created_by)
      VALUES 
        ('prog-qarc', 'QUANTUM AGENTIC RESEARCH CENTER', 'QARC', 'Advanced AI agent research, multimodal pipelines, edge intelligence, and autonomous enterprise systems.', 'Agentic AI & Edge Intelligence', 'High', 'Active', '2026-08-01', '2026-12-31', 'usr-pm-asad')
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        code = EXCLUDED.code,
        description = EXCLUDED.description;
    `);

    // 3. Teams
    console.log('👥 Seeding Teams & Memberships...');
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

    // 4. Projects (All 5 under QARC)
    console.log('📂 Seeding 5 Real Projects under QARC...');
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

    // 5. Program Projects (for /programs detail view)
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

    // 6. Project Memberships
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

    // 7. Insert all specific real tasks provided by user
    console.log('📋 Seeding All Actual Work Deliverables & Historical Logs...');
    const tasks = [
      // VoiceScribe
      { id: 'tsk-vs-1', name: 'Develop AI Pipeline of VoiceScribe', title: 'VoiceScribe AI Pipeline', desc: 'Developed the primary AI audio ingestion and processing pipeline for VoiceScribe.', status: 'Done', prio: 'High', start: '2026-08-18', due: '2026-08-18', proj: 'proj-voicescribe', user: 'usr-ajiya' },
      { id: 'tsk-vs-2', name: 'Translation Refinement Across Models', title: 'Multi-Model Translations', desc: 'Modifying the translations using different language models for multi-lingual transcript accuracy.', status: 'Done', prio: 'Medium', start: '2026-08-19', due: '2026-08-19', proj: 'proj-voicescribe', user: 'usr-ajiya' },
      { id: 'tsk-vs-3', name: 'Meeting Recording Ingestion Testing', title: 'Meeting Audio Validation', desc: 'Comprehensive testing on recordings from different meeting platforms and background noise levels.', status: 'Done', prio: 'Medium', start: '2026-08-20', due: '2026-08-20', proj: 'proj-voicescribe', user: 'usr-ajiya' },
      { id: 'tsk-vs-4', name: 'Node.js Express Backend Infrastructure', title: 'Backend Setup', desc: 'Setup all things of backend using Node.js, Express.js architecture and REST controllers.', status: 'Done', prio: 'High', start: '2026-08-20', due: '2026-08-20', proj: 'proj-voicescribe', user: 'usr-khizra' },
      { id: 'tsk-vs-5', name: 'Database Schema & Backend API Optimization', title: 'Backend & DB Modification', desc: 'Modifying the backend routes, database models, and audio storage mechanisms.', status: 'Done', prio: 'High', start: '2026-08-21', due: '2026-08-21', proj: 'proj-voicescribe', user: 'usr-khizra' },
      { id: 'tsk-vs-6', name: 'VoiceScribe Integration Testing & Debugging', title: 'Debugging & Regression', desc: 'End-to-end debugging day and system integration testing across API endpoints.', status: 'Done', prio: 'Medium', start: '2026-08-22', due: '2026-08-22', proj: 'proj-voicescribe', user: 'usr-khizra' },
      { id: 'tsk-vs-7', name: 'Fix Speaker Diarization in VoiceScribe Pipeline', title: 'Speaker Diarization Fix', desc: 'Fixed the diarization issue in VoiceScribe pipeline to accurately identify and separate speaker identities.', status: 'Done', prio: 'High', start: '2026-08-22', due: '2026-08-22', proj: 'proj-voicescribe', user: 'usr-fahad' },

      // Fishery Automation
      { id: 'tsk-fa-1', name: 'Factory Scale Edge AI Architecture & Dataset Curation', title: 'Requirements & Architecture', desc: 'Researched requirements, documented architecture, and curated datasets aimed at deploying an offline Jetson Nano AI pipeline on factory weighing scales.', status: 'Done', prio: 'High', start: '2026-08-24', due: '2026-08-24', proj: 'proj-fishery', user: 'usr-fahad' },
      { id: 'tsk-fa-2', name: 'Train YOLOv8n Fish & Eye Freshness Detectors', title: 'YOLOv8 Freshness Training', desc: 'Trained YOLOv8n fish (92.2% mAP50) and eye (95.9% mAP50) detectors to achieve automated, objective freshness classification from anatomical crops.', status: 'Done', prio: 'High', start: '2026-08-28', due: '2026-08-28', proj: 'proj-fishery', user: 'usr-fahad' },
      { id: 'tsk-fa-3', name: 'Rotated Fish Sizing & ByteTrack Dispatch Tracking', title: 'Rotated Sizing & Zone Tracking', desc: 'Implemented rotated fish sizing (minAreaRect) and ByteTrack zone tracking to automate weighing-to-box dispatch counting and packaging throughput.', status: 'Done', prio: 'High', start: '2026-08-29', due: '2026-08-29', proj: 'proj-fishery', user: 'usr-fahad' },
      { id: 'tsk-fa-4', name: 'Fine-tune ConvNeXt Target Commercial Species Classifier', title: 'ConvNeXt Species Classifier', desc: 'Align and fine-tune the ConvNeXt species classifier on the factory target commercial species to ensure 100% accurate automated sorting and batch categorization.', status: 'In Progress', prio: 'High', start: '2026-09-01', due: '2026-09-18', proj: 'proj-fishery', user: 'usr-fahad' },
      { id: 'tsk-fa-5', name: 'FastAPI Backend & RS-232 Digital Scale Serial Telemetry', title: 'FastAPI & RS-232 Scale Integration', desc: 'Build the FastAPI/PostgreSQL backend and integrate RS-232 digital scale serial communication to link live weight telemetry with vision metadata into structured inventory logs.', status: 'To Do', prio: 'High', start: '2026-09-19', due: '2026-09-28', proj: 'proj-fishery', user: 'usr-fahad' },
      { id: 'tsk-fa-6', name: 'TensorRT FP16 Export & Jetson Nano Edge Deployment', title: 'TensorRT Jetson Deployment', desc: 'Export models to TensorRT (FP16) and deploy onto the NVIDIA Jetson Nano edge device to achieve high-FPS real-time processing and complete the standalone factory installation.', status: 'To Do', prio: 'High', start: '2026-09-29', due: '2026-10-10', proj: 'proj-fishery', user: 'usr-fahad' },

      // HR Agent
      { id: 'tsk-hr-1', name: 'Project Initialization & Workflow 1-2 Implementation', title: 'HR Setup & Workflow 1-2', desc: 'Setup all project and built workflow 1 and 2 for autonomous applicant ingestion.', status: 'Done', prio: 'High', start: '2026-08-21', due: '2026-08-21', proj: 'proj-hr-agent', user: 'usr-khizra' },
      { id: 'tsk-hr-2', name: 'Build Workflow 3 and 4 Screening Engines', title: 'Workflow 3-4 Engines', desc: 'Worked on the workflow 3 and 4 for candidate screening and interview scheduling.', status: 'Done', prio: 'High', start: '2026-08-22', due: '2026-08-22', proj: 'proj-hr-agent', user: 'usr-khizra' },
      { id: 'tsk-hr-3', name: 'Workflow 5 Integration & Frontend Dashboard Finalization', title: 'Workflow 5 & Frontend Finalization', desc: 'Working on the workflow 5, frontend, and finalizing project deliverables.', status: 'Done', prio: 'High', start: '2026-08-27', due: '2026-08-27', proj: 'proj-hr-agent', user: 'usr-khizra' },
      { id: 'tsk-hr-4', name: 'Dashboard UI Polish & Presentation Deliverables', title: 'UI Modification & Presentation', desc: 'Presentation day, also modified Dashboard UI, and some frontend features.', status: 'Done', prio: 'Medium', start: '2026-08-28', due: '2026-08-28', proj: 'proj-hr-agent', user: 'usr-khizra' },
      { id: 'tsk-hr-5', name: 'Workflow Sequence Reordering & UI Refinements', title: 'Workflow Sequence Refinement', desc: 'Add some modification in UI, also modifying some workflow sequence logic.', status: 'Done', prio: 'Medium', start: '2026-08-29', due: '2026-08-29', proj: 'proj-hr-agent', user: 'usr-khizra' },
      { id: 'tsk-hr-6', name: 'Comprehensive HR Agent Testing & Stakeholder Verification', title: 'HR Testing & Stakeholder Review', desc: 'Attended meetings, comprehensive testing and verification of HR Agent workflows.', status: 'Completed', prio: 'High', start: '2026-09-01', due: '2026-09-01', proj: 'proj-hr-agent', user: 'usr-khizra' },

      // AI Freight Forwarding Lifecycle
      { id: 'tsk-ff-1', name: 'Phase 2 & 3 Commercial Backend & Core Engine Development', title: 'Commercial Backend Engine', desc: 'Master data, tariff management, RFQ capture, cargo calculation, multi-carrier quotes, margin validation, booking creation, and credit control.', status: 'Done', prio: 'High', start: '2026-09-02', due: '2026-09-02', proj: 'proj-freight', user: 'usr-ajiya' },
      { id: 'tsk-ff-2', name: 'RFQ Agent & Pricing Agent Workflow Architecture', title: 'RFQ & Pricing Agents', desc: 'Understanding workflow architecture for AI Agents, building the first RFQ Agent and Pricing Agent.', status: 'Done', prio: 'High', start: '2026-09-02', due: '2026-09-02', proj: 'proj-freight', user: 'usr-khizra' },
      { id: 'tsk-ff-3', name: 'Backend Architecture & Database Integration (All 8 Phases)', title: 'Full 8-Phase DB Architecture', desc: 'Completed Backend Architecture with fully integrated database spanning all 8 operational phases.', status: 'Done', prio: 'High', start: '2026-09-02', due: '2026-09-02', proj: 'proj-freight', user: 'usr-hiba' },
      { id: 'tsk-ff-4', name: 'Team 1 Platform & Database Phase Completion', title: 'Team 1 Platform Architecture', desc: 'Completed Team 1, all phases covering backend systems and database schema validation.', status: 'Done', prio: 'High', start: '2026-09-02', due: '2026-09-02', proj: 'proj-freight', user: 'usr-kinjal' },
      { id: 'tsk-ff-5', name: 'Phase 5 Financial Integrity & Phase 7 Commercial Analytics', title: 'Financial Integrity & Analytics', desc: 'Vendor bill discrepancies, settlement cost tracking, market-rate review reporting, RFQ funnel analytics, 151/151 regression tests passed.', status: 'Done', prio: 'High', start: '2026-09-03', due: '2026-09-03', proj: 'proj-freight', user: 'usr-ajiya' },
      { id: 'tsk-ff-6', name: 'Shipment Workspace API (4.1) & Sea FCL/Air Direct Workflows', title: 'Shipment Workspace & FCL/Air', desc: 'Implemented Shipment Workspace API (4.1) with role-based filtering, task tracking, Sea FCL (4.2), Air Direct (4.3), BL/AWB, VGM, and demurrage rules.', status: 'Done', prio: 'High', start: '2026-09-03', due: '2026-09-03', proj: 'proj-freight', user: 'usr-hiba' },
      { id: 'tsk-ff-7', name: 'Shipment Workspace Verification & Markdown Architecture', title: 'Workspace SLA & Verification', desc: 'Tested and verified markdown architectures locally; built Shipment Workspace API with SLA tracking and demurrage validation.', status: 'Done', prio: 'High', start: '2026-09-03', due: '2026-09-03', proj: 'proj-freight', user: 'usr-kinjal' },
      { id: 'tsk-ff-8', name: 'Shipment Operations & Control Tower Modules', title: 'Shipment Operations & Control Tower', desc: 'Document management, versioned uploads, ETA/ETD history, exception handling with auto-escalation, and Operations Control Tower.', status: 'Done', prio: 'High', start: '2026-09-04', due: '2026-09-04', proj: 'proj-freight', user: 'usr-ajiya' },
      { id: 'tsk-ff-9', name: '5.1 Shipment Financial Profile & Variance Engine', title: 'Shipment Financial Profile', desc: 'Revenue/Cost Ledger APIs, shipment profitability, quoted-vs-actual variance, negative-margin financial exceptions, and immutable audit entries.', status: 'Completed', prio: 'High', start: '2026-09-04', due: '2026-09-04', proj: 'proj-freight', user: 'usr-ajiya' },
      { id: 'tsk-ff-10', name: '5.2 Customer Invoicing & Multi-Currency Engine', title: 'Customer Invoicing Engine', desc: 'Invoice generation from approved revenue ledger lines, multi-currency, GST/VAT calculations, branded PDF generation, and debit/credit notes.', status: 'Completed', prio: 'High', start: '2026-09-04', due: '2026-09-04', proj: 'proj-freight', user: 'usr-ajiya' },
      { id: 'tsk-ff-11', name: '5.3 Vendor Bill Processing & Three-Way Matching (AP)', title: 'Vendor Bill Processing', desc: 'Shipment and cost-ledger linking, three-way matching, variance detection with configurable tolerance, vendor aging, and payment batching.', status: 'Completed', prio: 'High', start: '2026-09-04', due: '2026-09-04', proj: 'proj-freight', user: 'usr-ajiya' },
      { id: 'tsk-ff-12', name: '5.4 Accounts Receivable & Dunning Automation', title: 'Accounts Receivable & Dunning', desc: 'Customer aging reports, payment allocation (FIFO/LIFO), and automated dunning workflows with escalating reminders.', status: 'Completed', prio: 'High', start: '2026-09-04', due: '2026-09-04', proj: 'proj-freight', user: 'usr-hiba' },
      { id: 'tsk-ff-13', name: '5.5 Dangerous Goods DGR Compliance Engine', title: 'DGR Compliance Engine', desc: 'Dangerous goods data capture, versioned DGR rules, compatibility checks, required document generation, and Compliance Officer sign-off.', status: 'Completed', prio: 'High', start: '2026-09-04', due: '2026-09-04', proj: 'proj-freight', user: 'usr-kinjal' },
      { id: 'tsk-ff-14', name: '5.6 Customs Module & HS Code Management', title: 'Customs & HS Code Engine', desc: 'Customs declaration management, HS codes, duties/taxes, FTA preferential rates, sanctions check, and clearance tracking.', status: 'Completed', prio: 'High', start: '2026-09-04', due: '2026-09-04', proj: 'proj-freight', user: 'usr-hiba' },
      { id: 'tsk-ff-15', name: '5.7 LCL Sea Consolidation & HBL/MBL Hierarchy', title: 'LCL Sea Consolidation', desc: 'Grouping shipments into containers, container planning, House BL/Master BL hierarchy, and carrier cost allocation across HAWBs.', status: 'Completed', prio: 'High', start: '2026-09-04', due: '2026-09-04', proj: 'proj-freight', user: 'usr-kinjal' },
      { id: 'tsk-ff-16', name: '5.8 Air Consolidation & Break-Bulk Logistics', title: 'Air Consolidation Engine', desc: 'MAWB/HAWB hierarchy, optimal consolidation planning, airline cost allocation, destination break-bulk, and individual HAWB delivery tracking.', status: 'Completed', prio: 'High', start: '2026-09-04', due: '2026-09-04', proj: 'proj-freight', user: 'usr-hiba' },
      { id: 'tsk-ff-17', name: '5.9 Freight Claims Management & Carrier Scorecard', title: 'Freight Claims Management', desc: 'Cargo damage/loss state machine, net-loss calculation, insurance recovery, and carrier performance integration.', status: 'Completed', prio: 'High', start: '2026-09-04', due: '2026-09-04', proj: 'proj-freight', user: 'usr-kinjal' },
      { id: 'tsk-ff-18', name: '5.10 Automated Financial Reconciliation Engine', title: 'Automated Financial Reconciliation', desc: 'Scheduled weekly checks for revenue overbilling, cost variances, revenue leakage, unregistered vendor costs, and tolerance handling.', status: 'Completed', prio: 'High', start: '2026-09-04', due: '2026-09-04', proj: 'proj-freight', user: 'usr-hiba' },
      { id: 'tsk-ff-19', name: 'Phase 6 Shipment Operations & Customer/Agent Portals', title: 'Portals & Tracking Events', desc: 'Exposing tracking events, document versioning, proof-of-delivery (POD) handling, customer portal tracking, and agent dispatch operations.', status: 'In Progress', prio: 'High', start: '2026-09-04', due: '2026-09-20', proj: 'proj-freight', user: 'usr-kinjal' },
      { id: 'tsk-ff-20', name: 'Phase 7 & 8 Analytics & Advanced AI Tracking Anomaly Engine', title: 'AI Anomaly & EDIFACT Ingestion', desc: 'On-time KPIs, gross-profit analysis, AI-driven tracking anomaly detection, exception prediction, and EDI/EDIFACT (CUSREP, BAPLIE) ingestion.', status: 'In Progress', prio: 'High', start: '2026-09-04', due: '2026-09-22', proj: 'proj-freight', user: 'usr-hiba' },
      { id: 'tsk-ff-21', name: 'AI Agents 2 & 3 Construction & Agent 1 Optimization', title: 'AI Agents 1, 2, 3 Build', desc: 'Built and connected AI Agents 2 & 3, and made required modifications to Agent 1.', status: 'Done', prio: 'High', start: '2026-09-04', due: '2026-09-04', proj: 'proj-freight', user: 'usr-khizra' },
      { id: 'tsk-ff-22', name: 'Agent 5 (Compliance Agent) & Backend Agent Verification', title: 'Agent 5 Compliance Build', desc: 'Working on Agent 5 (Compliance Agent) and verifying/modifying all previous agents from backend.', status: 'Done', prio: 'High', start: '2026-09-05', due: '2026-09-05', proj: 'proj-freight', user: 'usr-khizra' },
      { id: 'tsk-ff-23', name: 'Agent 1 Database Integration & Multi-Agent Health Check', title: 'Agent 1 DB Integration', desc: 'Database integration in Agent 1 and also verified other agents.', status: 'Done', prio: 'High', start: '2026-09-07', due: '2026-09-07', proj: 'proj-freight', user: 'usr-khizra' },
      { id: 'tsk-ff-24', name: 'LLM Removal & Optimization for Agents 3 & 10', title: 'Agent 3 & 10 Optimization', desc: 'Removed LLM dependency from agent 3 and agent 10 to optimize latency and token costs.', status: 'Done', prio: 'High', start: '2026-09-07', due: '2026-09-07', proj: 'proj-freight', user: 'usr-hiba' },
      { id: 'tsk-ff-25', name: 'Implementation of 4 Core Freight Automations', title: 'Automations 1, 2, 3, 4', desc: 'Automation 1 (Rate Expiry Alerts), Automation 2 (Job Number Auto-Generation), Automation 3 (Credit Check), Automation 4 (Document Missing Alerts).', status: 'Done', prio: 'High', start: '2026-09-08', due: '2026-09-08', proj: 'proj-freight', user: 'usr-hiba' },
      { id: 'tsk-ff-26', name: 'Implement Automations 6, 7, and 10', title: 'Automations 6, 7, 10', desc: 'Workflow trigger implementation and testing for automations 6, 7, and 10.', status: 'Done', prio: 'High', start: '2026-09-08', due: '2026-09-08', proj: 'proj-freight', user: 'usr-khizra' },
      { id: 'tsk-ff-27', name: 'Automation 5 — ETA Deviation Alerts Implementation', title: 'Automation 5 ETA Deviations', desc: 'Built real-time container tracking ETA deviation calculation with automatic stakeholder alerts.', status: 'Done', prio: 'High', start: '2026-09-09', due: '2026-09-09', proj: 'proj-freight', user: 'usr-hiba' },
      { id: 'tsk-ff-28', name: 'Freight Multi-Agent Pipeline Verification', title: 'Agents Verification', desc: 'Stress testing, input/output validation, and error recovery across all active agents.', status: 'Done', prio: 'High', start: '2026-09-09', due: '2026-09-09', proj: 'proj-freight', user: 'usr-khizra' },
      { id: 'tsk-ff-29', name: 'Gmail Dispatch Integration Across All 5 Automations', title: 'Automations Gmail Integration', desc: 'Integrated Gmail API dispatch for alert delivery across all 5 automations with research notes.', status: 'Completed', prio: 'High', start: '2026-09-10', due: '2026-09-10', proj: 'proj-freight', user: 'usr-hiba' },
      { id: 'tsk-ff-30', name: 'Freight Workflow Automation Refinement', title: 'Automation Refinements', desc: 'Performance tuning and edge-case handling for active automation triggers.', status: 'In Progress', prio: 'Medium', start: '2026-09-10', due: '2026-09-15', proj: 'proj-freight', user: 'usr-khizra' },
      { id: 'tsk-ff-31', name: 'Agent Final Output Verification & Schema Validation', title: 'Agent Output Verification', desc: 'Verifying agents outputs, payload schema adherence, and audit logging.', status: 'Completed', prio: 'High', start: '2026-09-11', due: '2026-09-11', proj: 'proj-freight', user: 'usr-khizra' },

      // AI Tutor
      { id: 'tsk-at-1', name: 'MuseTalk Lip-Sync Avatar Pipeline Evaluation', title: 'MuseTalk Pipeline Evaluation', desc: 'Attempted full avatar pipeline using MuseTalk for lip-sync generation; analyzed architectural bottlenecks and decided on SadTalker pivot.', status: 'Done', prio: 'Medium', start: '2026-08-05', due: '2026-08-05', proj: 'proj-ai-tutor', user: 'usr-ajiya' },
      { id: 'tsk-at-2', name: 'SadTalker Avatar Generation Pipeline on Colab T4 GPU', title: 'SadTalker Pipeline Build', desc: 'Built full avatar generation pipeline with isolated Python 3.8 / CUDA 11.3 conda environment, PyTorch 1.12.1, and end-to-end talking-head MP4 rendering.', status: 'Done', prio: 'High', start: '2026-08-07', due: '2026-08-07', proj: 'proj-ai-tutor', user: 'usr-ajiya' },
      { id: 'tsk-at-3', name: 'Coqui XTTS-v2 Voice Cloning for Code-Mixed Urdu-English', title: 'Coqui XTTS-v2 Voice Cloning', desc: 'Integrated Coqui XTTS-v2 voice cloning with reference samples, multilingual code-mixed Urdu-English output, and direct wiring into SadTalker rendering.', status: 'Done', prio: 'High', start: '2026-08-08', due: '2026-08-08', proj: 'proj-ai-tutor', user: 'usr-ajiya' },
      { id: 'tsk-at-4', name: 'End-to-End Conversational Layer with Groq LLM Avatar', title: 'Groq Conversational Avatar Persona', desc: 'Integrated Groq-hosted LLM with custom Urdu-English avatar persona, single-pass turn-taking (text -> response -> TTS -> video render).', status: 'Done', prio: 'High', start: '2026-08-09', due: '2026-08-09', proj: 'proj-ai-tutor', user: 'usr-ajiya' },
      { id: 'tsk-at-5', name: 'Document-Grounded RAG with FAISS Vector Store', title: 'FAISS RAG Document Grounding', desc: 'Implemented DocumentLoader, chunking with overlap, all-MiniLM-L6-v2 embeddings, and FAISS VectorStore with deduplicated top-k retrieval.', status: 'Done', prio: 'High', start: '2026-08-10', due: '2026-08-10', proj: 'proj-ai-tutor', user: 'usr-ajiya' },
      { id: 'tsk-at-6', name: 'Silero VAD Real-Time Voice Activity Detection Loop', title: 'Silero VAD Real-Time Loop', desc: 'Researching and implementing Silero VAD for real-time voice activity detection to enable live conversational voice loop.', status: 'In Progress', prio: 'High', start: '2026-08-11', due: '2026-09-18', proj: 'proj-ai-tutor', user: 'usr-ajiya' },
      { id: 'tsk-at-7', name: 'Flask Backend & BM25 / FAISS Hybrid Retrieval for AI Tutor', title: 'Flask RAG & Local Ollama Tutor', desc: 'Built RAG-based AI Tutor with Flask backend, FAISS vector index, BM25 retrieval, SentenceTransformer embeddings, and Ollama local LLM integration.', status: 'Done', prio: 'High', start: '2026-08-07', due: '2026-08-07', proj: 'proj-ai-tutor', user: 'usr-kinjal' },
      { id: 'tsk-at-8', name: 'Intelligent Tutoring System Intent Detection & Pedagogical Routing', title: 'Tutoring Pedagogical Modes', desc: 'Implemented educational-domain filtering, tutoring intent detection, RAG/Hybrid routing, and tutor behaviors (explain, teach, quiz, hint, reteach).', status: 'Done', prio: 'High', start: '2026-08-09', due: '2026-08-09', proj: 'proj-ai-tutor', user: 'usr-kinjal' },
      { id: 'tsk-at-9', name: 'Local Real-Time Voice Pipeline with Faster-Whisper & Kokoro TTS', title: 'Faster-Whisper & Kokoro TTS', desc: 'Local real-time voice pipeline for AI Tutor using Faster-Whisper (STT), Ollama (LLM), and Kokoro (TTS), eliminating external cloud dependencies.', status: 'Done', prio: 'High', start: '2026-08-10', due: '2026-08-10', proj: 'proj-ai-tutor', user: 'usr-kinjal' },
      { id: 'tsk-at-10', name: 'Silero VAD Voice Integration & External API Costing Analysis', title: 'Silero VAD & Cost Modeling', desc: 'Implementing Silero VAD for real-time voice, searched external API costing models for freight and AI tutor projects.', status: 'In Progress', prio: 'Medium', start: '2026-08-11', due: '2026-09-16', proj: 'proj-ai-tutor', user: 'usr-kinjal' }
    ];

    for (const t of tasks) {
      await client.query(`
        INSERT INTO tasks (id, name, title, description, status, priority, start_date, due_date, project_id, assignee_id, assigned_to, created_by, completed_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          status = EXCLUDED.status,
          assignee_id = EXCLUDED.assignee_id;
      `, [
        t.id,
        t.name,
        t.title,
        t.desc,
        t.status,
        t.prio,
        t.start,
        t.due,
        t.proj,
        t.user,
        t.user,
        'usr-pm-asad',
        (t.status === 'Done' || t.status === 'Completed') ? new Date() : null
      ]);
    }

    // 8. Seed Submissions for Pending Approvals
    console.log('📬 Seeding Task Submissions for Manager Pending Approval Queue...');
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

    // 9. Seed Work Parts for atomic task breakdown
    console.log('⚙️ Seeding Atomic Work Parts...');
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

    console.log('🌟 SUCCESS! Neon Database fully initialized with QARC, Asad Navaid, Team, Projects, and Real Tasks!');
  } catch (err) {
    console.error('❌ Migration error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
