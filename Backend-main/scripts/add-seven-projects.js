// scripts/add-seven-projects.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function addProjects() {
  const client = await pool.connect();
  try {
    console.log('🚀 Adding 7 New Projects to Neon Database under QUANTUM AGENTIC RESEARCH CENTER (prog-qarc)...');

    // 1. Ensure Program prog-qarc exists
    await client.query(`
      INSERT INTO programs (id, name, code, description, domain, priority, status, start_date, end_date, created_by)
      VALUES 
        ('prog-qarc', 'QUANTUM AGENTIC RESEARCH CENTER', 'QARC', 'Advanced AI agent research, multimodal pipelines, edge intelligence, and autonomous enterprise systems.', 'Agentic AI & Edge Intelligence', 'High', 'Active', '2026-08-01', '2026-12-31', 'usr-pm-asad')
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        code = EXCLUDED.code,
        description = EXCLUDED.description;
    `);

    // 2. Insert the 7 Projects into projects table
    const newProjects = [
      {
        id: 'proj-uae-voice',
        name: 'UAE Voice Model for Competition',
        domain: 'Arabic Speech AI & Voice Synthesis',
        about_title: 'Emirati Dialect Competitive Neural Voice AI',
        about_description: 'Specialized Emirati Arabic neural voice synthesis, dialectal acoustic modeling, prosody transfer, and ultra-low latency inference for the UAE International AI Competition.',
        status: 'In Progress',
        priority: 'High',
        start_date: '2026-08-25',
        deadline: '2026-10-30',
        progress: 60,
        program_id: 'prog-qarc',
        manager_id: 'usr-pm-asad',
        project_manager_id: 'usr-pm-asad',
        created_by: 'usr-pm-asad'
      },
      {
        id: 'proj-axiom',
        name: 'Axiom',
        domain: 'Formal Reasoning & Neural-Symbolic AI',
        about_title: 'Automated Mathematical Proof & Logic Engine',
        about_description: 'Neural-symbolic theorem prover, automated code invariant generation, formal verification solvers, and strict mathematical proof validation for mission-critical systems.',
        status: 'In Progress',
        priority: 'High',
        start_date: '2026-08-20',
        deadline: '2026-11-15',
        progress: 50,
        program_id: 'prog-qarc',
        manager_id: 'usr-pm-asad',
        project_manager_id: 'usr-pm-asad',
        created_by: 'usr-pm-asad'
      },
      {
        id: 'proj-ecommerce-agent',
        name: 'Ecommerce Agent',
        domain: 'Autonomous Commerce & Conversational Selling',
        about_title: 'Autonomous Multi-Channel Shopping & Cart Agent',
        about_description: 'Autonomous agentic shopping assistant with dynamic product catalog search, real-time inventory synchronization, intelligent upsell recommendations, and headless cart orchestration.',
        status: 'In Progress',
        priority: 'High',
        start_date: '2026-08-22',
        deadline: '2026-10-25',
        progress: 70,
        program_id: 'prog-qarc',
        manager_id: 'usr-pm-asad',
        project_manager_id: 'usr-pm-asad',
        created_by: 'usr-pm-asad'
      },
      {
        id: 'proj-embassy-reachout',
        name: 'Embassy Reach out',
        domain: 'Diplomatic Intelligence & Automated Outreach',
        about_title: 'Autonomous Diplomatic Communications & Partner Engagement',
        about_description: 'Automated diplomatic stakeholder mapping, bilateral protocol compliance, customized diplomatic communication pipelines, and international partnership dossier generation.',
        status: 'In Progress',
        priority: 'Medium',
        start_date: '2026-08-28',
        deadline: '2026-11-20',
        progress: 45,
        program_id: 'prog-qarc',
        manager_id: 'usr-pm-asad',
        project_manager_id: 'usr-pm-asad',
        created_by: 'usr-pm-asad'
      },
      {
        id: 'proj-retina-scan',
        name: 'Retina Scan Early Disease Detection',
        domain: 'Medical Imaging & Diagnostic AI',
        about_title: 'Deep Learning Fundus Image Pathology Classification',
        about_description: 'High-resolution retinal fundus photography analysis using hybrid CNN-ViT architectures for automated early detection of diabetic retinopathy, glaucoma, and macular degeneration.',
        status: 'In Progress',
        priority: 'High',
        start_date: '2026-08-15',
        deadline: '2026-10-31',
        progress: 65,
        program_id: 'prog-qarc',
        manager_id: 'usr-pm-asad',
        project_manager_id: 'usr-pm-asad',
        created_by: 'usr-pm-asad'
      },
      {
        id: 'proj-fmd-detection',
        name: 'Foot and Mouth Disease (FMD) Detection in Animals',
        domain: 'Veterinary Computer Vision & Edge Diagnostics',
        about_title: 'Livestock Lesion Detection & Thermal Screening Vision Pipeline',
        about_description: 'Real-time multi-spectral thermal and RGB computer vision pipeline deployed on edge cameras for early detection of FMD vesicular lesions in cattle hooves and muzzles.',
        status: 'In Progress',
        priority: 'High',
        start_date: '2026-08-18',
        deadline: '2026-11-10',
        progress: 55,
        program_id: 'prog-qarc',
        manager_id: 'usr-pm-asad',
        project_manager_id: 'usr-pm-asad',
        created_by: 'usr-pm-asad'
      },
      {
        id: 'proj-marketing-agent',
        name: 'Marketing Agent',
        domain: 'Autonomous Marketing & Growth Automation',
        about_title: 'Autonomous Omnichannel Campaign & Content Engine',
        about_description: 'Autonomous growth agent capable of market research, high-conversion copy generation, dynamic creative synthesis, SEO keyword cluster analysis, and cross-platform campaign optimization.',
        status: 'In Progress',
        priority: 'Medium',
        start_date: '2026-08-25',
        deadline: '2026-10-20',
        progress: 50,
        program_id: 'prog-qarc',
        manager_id: 'usr-pm-asad',
        project_manager_id: 'usr-pm-asad',
        created_by: 'usr-pm-asad'
      }
    ];

    for (const p of newProjects) {
      await client.query(`
        INSERT INTO projects (id, name, domain, about_title, about_description, status, priority, start_date, deadline, progress, program_id, manager_id, project_manager_id, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          domain = EXCLUDED.domain,
          about_title = EXCLUDED.about_title,
          about_description = EXCLUDED.about_description,
          status = EXCLUDED.status,
          priority = EXCLUDED.priority,
          start_date = EXCLUDED.start_date,
          deadline = EXCLUDED.deadline,
          progress = EXCLUDED.progress,
          program_id = EXCLUDED.program_id,
          manager_id = EXCLUDED.manager_id,
          project_manager_id = EXCLUDED.project_manager_id,
          created_by = EXCLUDED.created_by;
      `, [
        p.id, p.name, p.domain, p.about_title, p.about_description,
        p.status, p.priority, p.start_date, p.deadline, p.progress,
        p.program_id, p.manager_id, p.project_manager_id, p.created_by
      ]);
    }
    console.log('✅ 7 Projects seeded into projects table');

    // 3. Insert into program_projects table (Deliverables under prog-qarc)
    const newProgramProjects = [
      {
        id: 'pp-uae-voice',
        program_id: 'prog-qarc',
        name: 'UAE Voice Model for Competition',
        domain: 'Arabic Speech AI & Voice Synthesis',
        about_title: 'Emirati Dialect Competitive Neural Voice AI',
        about_description: 'Specialized Emirati Arabic neural voice synthesis, dialectal acoustic modeling, and latency optimization.',
        status: 'In Progress',
        priority: 'High',
        start_date: '2026-08-25',
        deadline: '2026-10-30',
        created_by: 'usr-pm-asad',
        assigned_to: 'usr-fahad'
      },
      {
        id: 'pp-axiom',
        program_id: 'prog-qarc',
        name: 'Axiom',
        domain: 'Formal Reasoning & Neural-Symbolic AI',
        about_title: 'Automated Mathematical Proof & Logic Engine',
        about_description: 'Neural-symbolic theorem prover, automated code invariant generation, and formal verification solvers.',
        status: 'In Progress',
        priority: 'High',
        start_date: '2026-08-20',
        deadline: '2026-11-15',
        created_by: 'usr-pm-asad',
        assigned_to: 'usr-kinjal'
      },
      {
        id: 'pp-ecommerce-agent',
        program_id: 'prog-qarc',
        name: 'Ecommerce Agent',
        domain: 'Autonomous Commerce & Conversational Selling',
        about_title: 'Autonomous Multi-Channel Shopping & Cart Agent',
        about_description: 'Dynamic product catalog search, real-time inventory sync, intelligent recommendations, and headless cart.',
        status: 'In Progress',
        priority: 'High',
        start_date: '2026-08-22',
        deadline: '2026-10-25',
        created_by: 'usr-pm-asad',
        assigned_to: 'usr-khizra'
      },
      {
        id: 'pp-embassy-reachout',
        program_id: 'prog-qarc',
        name: 'Embassy Reach out',
        domain: 'Diplomatic Intelligence & Automated Outreach',
        about_title: 'Autonomous Diplomatic Communications & Partner Engagement',
        about_description: 'Automated diplomatic stakeholder mapping, bilateral protocol compliance, and customized outreach pipelines.',
        status: 'In Progress',
        priority: 'Medium',
        start_date: '2026-08-28',
        deadline: '2026-11-20',
        created_by: 'usr-pm-asad',
        assigned_to: 'usr-hiba'
      },
      {
        id: 'pp-retina-scan',
        program_id: 'prog-qarc',
        name: 'Retina Scan Early Disease Detection',
        domain: 'Medical Imaging & Diagnostic AI',
        about_title: 'Deep Learning Fundus Image Pathology Classification',
        about_description: 'High-resolution retinal fundus photography analysis using CNN-ViT for diabetic retinopathy & glaucoma detection.',
        status: 'In Progress',
        priority: 'High',
        start_date: '2026-08-15',
        deadline: '2026-10-31',
        created_by: 'usr-pm-asad',
        assigned_to: 'usr-fahad'
      },
      {
        id: 'pp-fmd-detection',
        program_id: 'prog-qarc',
        name: 'Foot and Mouth Disease (FMD) Detection in Animals',
        domain: 'Veterinary Computer Vision & Edge Diagnostics',
        about_title: 'Livestock Lesion Detection & Thermal Screening Vision Pipeline',
        about_description: 'Multi-spectral thermal and RGB computer vision for early detection of FMD vesicular lesions in hooves and muzzles.',
        status: 'In Progress',
        priority: 'High',
        start_date: '2026-08-18',
        deadline: '2026-11-10',
        created_by: 'usr-pm-asad',
        assigned_to: 'usr-fahad'
      },
      {
        id: 'pp-marketing-agent',
        program_id: 'prog-qarc',
        name: 'Marketing Agent',
        domain: 'Autonomous Marketing & Growth Automation',
        about_title: 'Autonomous Omnichannel Campaign & Content Engine',
        about_description: 'Autonomous growth agent capable of market research, high-conversion copy generation, and multi-channel optimization.',
        status: 'In Progress',
        priority: 'Medium',
        start_date: '2026-08-25',
        deadline: '2026-10-20',
        created_by: 'usr-pm-asad',
        assigned_to: 'usr-khizra'
      }
    ];

    for (const pp of newProgramProjects) {
      await client.query(`
        INSERT INTO program_projects (id, program_id, name, domain, about_title, about_description, status, priority, start_date, deadline, created_by, assigned_to)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          domain = EXCLUDED.domain,
          about_title = EXCLUDED.about_title,
          about_description = EXCLUDED.about_description,
          status = EXCLUDED.status,
          priority = EXCLUDED.priority,
          start_date = EXCLUDED.start_date,
          deadline = EXCLUDED.deadline,
          assigned_to = EXCLUDED.assigned_to;
      `, [
        pp.id, pp.program_id, pp.name, pp.domain, pp.about_title, pp.about_description,
        pp.status, pp.priority, pp.start_date, pp.deadline, pp.created_by, pp.assigned_to
      ]);
    }
    console.log('✅ 7 Program Projects seeded into program_projects table');

    // 4. Project Memberships
    const members = [
      // UAE Voice Model
      { id: 'pm-uv-1', project_id: 'proj-uae-voice', user_id: 'usr-pm-asad', role: 'Project Manager' },
      { id: 'pm-uv-2', project_id: 'proj-uae-voice', user_id: 'usr-fahad', role: 'Speech & Acoustic Lead' },
      { id: 'pm-uv-3', project_id: 'proj-uae-voice', user_id: 'usr-ajiya', role: 'Pipeline Specialist' },

      // Axiom
      { id: 'pm-ax-1', project_id: 'proj-axiom', user_id: 'usr-pm-asad', role: 'Project Manager' },
      { id: 'pm-ax-2', project_id: 'proj-axiom', user_id: 'usr-kinjal', role: 'Logic & Proof Lead' },
      { id: 'pm-ax-3', project_id: 'proj-axiom', user_id: 'usr-khizra', role: 'Backend Engineer' },

      // Ecommerce Agent
      { id: 'pm-ea-1', project_id: 'proj-ecommerce-agent', user_id: 'usr-pm-asad', role: 'Project Manager' },
      { id: 'pm-ea-2', project_id: 'proj-ecommerce-agent', user_id: 'usr-khizra', role: 'Commerce Agent Lead' },
      { id: 'pm-ea-3', project_id: 'proj-ecommerce-agent', user_id: 'usr-hiba', role: 'Automation Specialist' },

      // Embassy Reach out
      { id: 'pm-er-1', project_id: 'proj-embassy-reachout', user_id: 'usr-pm-asad', role: 'Project Manager' },
      { id: 'pm-er-2', project_id: 'proj-embassy-reachout', user_id: 'usr-hiba', role: 'Outreach & Protocol Lead' },
      { id: 'pm-er-3', project_id: 'proj-embassy-reachout', user_id: 'usr-ajiya', role: 'Communications Lead' },

      // Retina Scan
      { id: 'pm-rs-1', project_id: 'proj-retina-scan', user_id: 'usr-pm-asad', role: 'Project Manager' },
      { id: 'pm-rs-2', project_id: 'proj-retina-scan', user_id: 'usr-fahad', role: 'Medical Vision Lead' },
      { id: 'pm-rs-3', project_id: 'proj-retina-scan', user_id: 'usr-ajiya', role: 'Dataset Specialist' },

      // FMD Detection
      { id: 'pm-fm-1', project_id: 'proj-fmd-detection', user_id: 'usr-pm-asad', role: 'Project Manager' },
      { id: 'pm-fm-2', project_id: 'proj-fmd-detection', user_id: 'usr-fahad', role: 'Edge Vision Lead' },
      { id: 'pm-fm-3', project_id: 'proj-fmd-detection', user_id: 'usr-kinjal', role: 'Edge Deployment Specialist' },

      // Marketing Agent
      { id: 'pm-ma-1', project_id: 'proj-marketing-agent', user_id: 'usr-pm-asad', role: 'Project Manager' },
      { id: 'pm-ma-2', project_id: 'proj-marketing-agent', user_id: 'usr-khizra', role: 'Growth Agent Lead' },
      { id: 'pm-ma-3', project_id: 'proj-marketing-agent', user_id: 'usr-hiba', role: 'Campaign Automation Lead' }
    ];

    for (const m of members) {
      await client.query(`
        INSERT INTO project_members (id, project_id, user_id, role)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO UPDATE SET
          role = EXCLUDED.role;
      `, [m.id, m.project_id, m.user_id, m.role]);
    }
    console.log('✅ Project memberships seeded');

    // 5. Initial Tasks for all 7 Projects
    const newTasks = [
      // UAE Voice Model
      { id: 'tsk-uv-1', name: 'Emirati Arabic Dataset Audio Curation & Phonetic Alignment', title: 'Emirati Audio Dataset Curation', desc: 'Curated and cleaned high-fidelity Emirati Arabic speech recordings with phonetic forced alignment.', status: 'Done', prio: 'High', start: '2026-08-25', due: '2026-08-25', proj: 'proj-uae-voice', user: 'usr-fahad' },
      { id: 'tsk-uv-2', name: 'Fine-tune Tacotron/VITS with Emirati Accent Conditioning', title: 'Acoustic Model Training', desc: 'Fine-tuning neural voice synthesis weights with Emirati prosody conditioning and pitch contours.', status: 'In Progress', prio: 'High', start: '2026-08-28', due: '2026-09-22', proj: 'proj-uae-voice', user: 'usr-ajiya' },
      { id: 'tsk-uv-3', name: 'Low-Latency ONNX/TensorRT Export for Competition Benchmark', title: 'TensorRT Latency Benchmark', desc: 'Quantizing model weights to INT8/FP16 for sub-100ms streaming audio generation during the competition.', status: 'To Do', prio: 'High', start: '2026-09-23', due: '2026-10-15', proj: 'proj-uae-voice', user: 'usr-fahad' },

      // Axiom
      { id: 'tsk-ax-1', name: 'Formal Logic Grammar & Abstract Syntax Tree Parser', title: 'Grammar & AST Parser', desc: 'Constructed custom grammar for mathematical statements and symbolic logic expressions.', status: 'Done', prio: 'High', start: '2026-08-20', due: '2026-08-20', proj: 'proj-axiom', user: 'usr-kinjal' },
      { id: 'tsk-ax-2', name: 'Integration of Z3 SMT Solver & Neural Invariant Heuristics', title: 'SMT Solver Integration', desc: 'Connecting the Z3 solver with embedding-driven neural heuristic search for automated lemma discovery.', status: 'In Progress', prio: 'High', start: '2026-08-24', due: '2026-09-25', proj: 'proj-axiom', user: 'usr-kinjal' },
      { id: 'tsk-ax-3', name: 'Automated Proof Generation & Theorem Benchmarking', title: 'Proof Gen & Benchmarks', desc: 'Running regression tests against standard MiniF2F mathematical theorem benchmarks.', status: 'To Do', prio: 'Medium', start: '2026-09-26', due: '2026-10-20', proj: 'proj-axiom', user: 'usr-khizra' },

      // Ecommerce Agent
      { id: 'tsk-ea-1', name: 'Catalog Embedding Index & Multi-Attribute Search Engine', title: 'Catalog Vector Indexing', desc: 'Vectorized product catalogs with hybrid lexical-semantic filtering for real-time natural language queries.', status: 'Done', prio: 'High', start: '2026-08-22', due: '2026-08-22', proj: 'proj-ecommerce-agent', user: 'usr-khizra' },
      { id: 'tsk-ea-2', name: 'Conversational Cart Orchestrator & Stripe/Shopify Webhooks', title: 'Cart Orchestration Engine', desc: 'Implemented stateful cart management, inventory verification, and secure payment session handling.', status: 'In Progress', prio: 'High', start: '2026-08-26', due: '2026-09-20', proj: 'proj-ecommerce-agent', user: 'usr-khizra' },
      { id: 'tsk-ea-3', name: 'Personalized Upsell Recommender & Checkout Session Automation', title: 'Upsell & Session Automation', desc: 'Contextual product bundling and automated checkout recovery workflow.', status: 'To Do', prio: 'Medium', start: '2026-09-21', due: '2026-10-10', proj: 'proj-ecommerce-agent', user: 'usr-hiba' },

      // Embassy Reach out
      { id: 'tsk-er-1', name: 'Diplomatic Protocol Knowledge Base & Persona Modeling', title: 'Diplomatic Protocol Knowledge Base', desc: 'Codified diplomatic etiquette, formal address conventions, and bilateral priority frameworks.', status: 'Done', prio: 'Medium', start: '2026-08-28', due: '2026-08-28', proj: 'proj-embassy-reachout', user: 'usr-hiba' },
      { id: 'tsk-er-2', name: 'Automated Outreach Campaign Pipeline & Multi-Tier Follow-Ups', title: 'Outreach Campaign Engine', desc: 'Configured automated secure email dispatch and diplomatic briefing attachments generation.', status: 'In Progress', prio: 'High', start: '2026-09-01', due: '2026-09-24', proj: 'proj-embassy-reachout', user: 'usr-hiba' },
      { id: 'tsk-er-3', name: 'Embassy Response Sentiment & Bilateral Engagement Analytics', title: 'Engagement Sentiment Analytics', desc: 'Parsing incoming embassy responses, extracting action items, and populating partnership intelligence dashboards.', status: 'To Do', prio: 'Medium', start: '2026-09-25', due: '2026-10-25', proj: 'proj-embassy-reachout', user: 'usr-ajiya' },

      // Retina Scan Early Disease detection
      { id: 'tsk-rs-1', name: 'Fundus Image Preprocessing, Denoising & Vessel Segmentation', title: 'Fundus Image Pipeline', desc: 'Developed contrast-limited adaptive histogram equalization (CLAHE) and vessel segmentation pipeline.', status: 'Done', prio: 'High', start: '2026-08-15', due: '2026-08-15', proj: 'proj-retina-scan', user: 'usr-fahad' },
      { id: 'tsk-rs-2', name: 'Multi-Label Retinopathy & Glaucoma Classifier Training', title: 'Retinopathy Model Training', desc: 'Trained Swin Transformer backbone on fundus datasets achieving 94.8% AUC for diabetic retinopathy.', status: 'In Progress', prio: 'High', start: '2026-08-20', due: '2026-09-26', proj: 'proj-retina-scan', user: 'usr-fahad' },
      { id: 'tsk-rs-3', name: 'Clinical Explainability Heatmaps (Grad-CAM) & Diagnostic Report Gen', title: 'Grad-CAM & Diagnostic Reports', desc: 'Generating anatomical explainability overlays and clinical summary PDFs for ophthalmologists.', status: 'To Do', prio: 'High', start: '2026-09-27', due: '2026-10-20', proj: 'proj-retina-scan', user: 'usr-ajiya' },

      // Foot mouth disease FMD detection in animals
      { id: 'tsk-fm-1', name: 'Dataset Collection & Lesion Annotation for Cattle Hooves and Muzzles', title: 'FMD Dataset Annotation', desc: 'Curated 3,500 annotated multi-angle RGB and thermal images of bovine lesions.', status: 'Done', prio: 'High', start: '2026-08-18', due: '2026-08-18', proj: 'proj-fmd-detection', user: 'usr-fahad' },
      { id: 'tsk-fm-2', name: 'YOLOv9 Lesion Detector & Dual-Spectrum Thermal Alignment', title: 'YOLOv9 Lesion & Thermal Model', desc: 'Trained dual-head detector for localized blister detection with thermal temperature gradient anomaly scoring.', status: 'In Progress', prio: 'High', start: '2026-08-22', due: '2026-09-28', proj: 'proj-fmd-detection', user: 'usr-fahad' },
      { id: 'tsk-fm-3', name: 'Edge Deployment on Livestock Pen Cameras with Quarantining Alerts', title: 'Livestock Camera Deployment', desc: 'Containerized deployment for Jetson edge devices mounted at milking and feeding stalls with SMS alerts.', status: 'To Do', prio: 'High', start: '2026-09-29', due: '2026-10-30', proj: 'proj-fmd-detection', user: 'usr-kinjal' },

      // MARKETING AGENT
      { id: 'tsk-ma-1', name: 'Brand Voice Embedding & Copywriting Style Guide Conditioning', title: 'Brand Voice Persona Model', desc: 'Embedded brand positioning guidelines, tone vectors, and historical top-performing copy samples.', status: 'Done', prio: 'Medium', start: '2026-08-25', due: '2026-08-25', proj: 'proj-marketing-agent', user: 'usr-khizra' },
      { id: 'tsk-ma-2', name: 'Automated Multi-Platform Social & Email Sequence Generator', title: 'Social & Email Copy Engine', desc: 'Constructed multi-turn generator for LinkedIn, X threads, and 5-touch email nurture funnels.', status: 'In Progress', prio: 'High', start: '2026-08-29', due: '2026-09-22', proj: 'proj-marketing-agent', user: 'usr-khizra' },
      { id: 'tsk-ma-3', name: 'Campaign Performance Analytics & A/B Test Variant Allocator', title: 'A/B Test Analytics Engine', desc: 'Bayesian multi-armed bandit algorithm for automated dynamic ad budget and variant allocation.', status: 'To Do', prio: 'Medium', start: '2026-09-23', due: '2026-10-18', proj: 'proj-marketing-agent', user: 'usr-hiba' }
    ];

    for (const t of newTasks) {
      await client.query(`
        INSERT INTO tasks (id, name, title, description, status, priority, start_date, due_date, project_id, assignee_id, assigned_to, created_by, completed_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          status = EXCLUDED.status,
          priority = EXCLUDED.priority,
          start_date = EXCLUDED.start_date,
          due_date = EXCLUDED.due_date,
          project_id = EXCLUDED.project_id,
          assignee_id = EXCLUDED.assignee_id,
          assigned_to = EXCLUDED.assigned_to;
      `, [
        t.id, t.name, t.title, t.desc, t.status, t.prio, t.start, t.due,
        t.proj, t.user, t.user, 'usr-pm-asad',
        (t.status === 'Done' || t.status === 'Completed') ? new Date() : null
      ]);
    }
    console.log('✅ Tasks for all 7 projects seeded into tasks table');

    console.log('🎉 ALL 7 PROJECTS SUCCESSFULLY ADDED TO QUANTUM AGENTIC RESEARCH CENTER (prog-qarc)!');
  } catch (err) {
    console.error('❌ Error adding projects:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

addProjects();
