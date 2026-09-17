import os
import re

db_js_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'db.js')
with open(db_js_path, 'r', encoding='utf-8') as f:
    db_js = f.read()

# 1. Add Project
project_sql = ",\\n          ('proj-pia-track', 'PIA Cargo: Track & Trace Automation', 'Logistics & Automation', 'Automated PIA AWB Scraper & Emails', 'Custom full-stack app automating Pakistan International Airlines (PIA) Cargo AWB tracking via Playwright, async scheduling, and branded HTML emails.', 'Completed', 'High', '2026-09-01', '2026-09-15', 100, 'prog-qarc', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad')"
db_js = re.sub(r"('proj-track-trace'.*?\))(\n\s*ON CONFLICT \(id\) DO UPDATE SET\n\s*name = EXCLUDED.name,)", r"\1" + project_sql + r"\2", db_js)

# 2. Add Program Project
pp_sql = ",\\n          ('pp-pia-track', 'prog-qarc', 'PIA Cargo: Track & Trace Automation', 'Logistics & Automation', 'Automated PIA AWB Scraper & Emails', 'Custom full-stack app automating PIA Cargo AWB tracking via Playwright.', 'Completed', 'High', '2026-09-01', '2026-09-15', 'usr-pm-asad', 'usr-pm-asad')"
db_js = re.sub(r"('pp-track-trace'.*?\))(\n\s*ON CONFLICT \(id\) DO UPDATE SET\n\s*name = EXCLUDED.name,)", r"\1" + pp_sql + r"\2", db_js)

# 3. Add Project Member
pm_sql = ",\\n          ('pm-pia-1', 'proj-pia-track', 'usr-pm-asad', 'Project Manager')"
db_js = re.sub(r"('pm-tt-1'.*?\))(\n\s*ON CONFLICT \(id\) DO NOTHING;)", r"\1" + pm_sql + r"\2", db_js)

# 4. Add Tasks
tasks_data = [
    # Phase 1: Core Architecture & Database Setup (Sep 1-2)
    ("Initialize Project Structure for frontend and backend", "2026-09-01"),
    ("Set up Vite + React + TypeScript frontend scaffold", "2026-09-01"),
    ("Set up FastAPI + Python 3 backend scaffold", "2026-09-01"),
    ("Write initial docker-compose.yml for PostgreSQL 16", "2026-09-01"),
    ("Configure asyncpg database connection string", "2026-09-01"),
    ("Build SQLAlchemy async session engine (database.py)", "2026-09-01"),
    ("Create AWBShipment relational schema", "2026-09-02"),
    ("Create AWBEvent historical timeline schema", "2026-09-02"),
    ("Create StatusChange audit trail schema", "2026-09-02"),
    ("Create Alert system internal schema", "2026-09-02"),
    ("Generate initial Alembic migrations for DB", "2026-09-02"),

    # Phase 2: PIA Scraper Engine (Sep 3-5)
    ("Install and configure Microsoft Playwright", "2026-09-03"),
    ("Build headless browser initialization logic", "2026-09-03"),
    ("Write navigation sequence for PIA Cargo portal", "2026-09-03"),
    ("Bypass initial PIA portal cookie/consent popups", "2026-09-03"),
    ("Engineer DOM selectors for raw AWB text extraction", "2026-09-04"),
    ("Extract PIA flight legs and routing tables from DOM", "2026-09-04"),
    ("Extract event history tables into structured JSON", "2026-09-04"),
    ("Build change_detector.py to compare against DB snapshot", "2026-09-05"),
    ("Develop algorithm to identify new flight legs", "2026-09-05"),
    ("Develop algorithm to detect status shifts", "2026-09-05"),
    ("Implement adaptive polling interval logic", "2026-09-05"),
    ("Configure Immediate/Fast/Normal/Slow/Daily tiers", "2026-09-05"),

    # Phase 3: Background Scheduler (Sep 6-7)
    ("Build scheduler.py async worker loop", "2026-09-06"),
    ("Integrate scheduler with FastAPI lifecycle events", "2026-09-06"),
    ("Add asyncio.Semaphore to limit simultaneous scrapes", "2026-09-06"),
    ("Test memory consumption under heavy load", "2026-09-06"),
    ("Debug SQLAlchemy lazy-load errors in background tasks", "2026-09-07"),
    ("Refactor queries to use selectinload for eager loading", "2026-09-07"),
    ("Write unit tests for the worker loop", "2026-09-07"),

    # Phase 4: Customer Notifications (Sep 8-9)
    ("Transition from Gmail API to generic SMTP lib", "2026-09-08"),
    ("Configure SSL over Port 465 for operations@gsaetcargo.com.pk", "2026-09-08"),
    ("Design responsive HTML email template for PIA", "2026-09-08"),
    ("Inject dynamic variables into HTML template", "2026-09-08"),
    ("Wire scheduler to trigger emails on PIA status changes", "2026-09-09"),
    ("Add logic to prevent duplicate emails for the same event", "2026-09-09"),
    ("Create isolated test_email.py mock scripts", "2026-09-09"),

    # Phase 5: Branding & UI Enhancements (Sep 10)
    ("Update global app naming to PIA Automation", "2026-09-10"),
    ("Sync React dashboard palette to PIA Brand Colors", "2026-09-10"),
    ("Attach PIA/M&S Aviators logo as CID inline image in emails", "2026-09-10"),
    ("Update Dashboard Header with prominent logo", "2026-09-10"),

    # Phase 6: Frontend Dashboard (Sep 11-13)
    ("Build FastAPI REST routes to add/list AWBs", "2026-09-11"),
    ("Build FastAPI route to fetch AWB histories", "2026-09-11"),
    ("Create React dynamic table for active shipments", "2026-09-11"),
    ("Implement expandable rows for routing breakdown", "2026-09-12"),
    ("Implement expandable rows for event timeline", "2026-09-12"),
    ("Build Add AWB sidebar form with email bindings", "2026-09-12"),
    ("Integrate xlsx/csv batch upload parsing", "2026-09-13"),
    ("Create batch upload API endpoint", "2026-09-13"),
    ("Add 'Manual Run' action button in UI", "2026-09-13"),

    # Phase 7: Non-Technical System Logs (Sep 14)
    ("Create ScrapeLog database model", "2026-09-14"),
    ("Log success/skipped/failed states in scheduler", "2026-09-14"),
    ("Create GET /api/logs route for latest 100 events", "2026-09-14"),
    ("Build toggleable 'System Logs' view in React UI", "2026-09-14"),

    # Phase 8: Deployment Planning (Sep 15)
    ("Evaluate Cloud VPS vs Office Server architecture", "2026-09-15"),
    ("Document Datacenter IP block risks for Playwright (PIA)", "2026-09-15"),
    ("Setup and provision the internal Office Server", "2026-09-15"),
    ("Write systemd service for FastAPI and Scheduler", "2026-09-15"),
    ("Final end-to-end handover testing", "2026-09-15"),
]

values_sql = []
for i, (name, date) in enumerate(tasks_data):
    safe_name = name.replace("'", "''")
    values_sql.append(f"          ('tsk-pia-{i+1}', '{safe_name}', 'Completed task: {safe_name}', 'Done', 'High', '{date}', '{date}', 'proj-pia-track', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad', '{date} 23:59:59')")

tasks_str = ",\\n" + ",\n".join(values_sql)
db_js = re.sub(r"('tsk-tt-55'.*?\))(\n\s*ON CONFLICT \(id\) DO NOTHING;)", r"\1" + tasks_str + r"\2", db_js)

with open(db_js_path, 'w', encoding='utf-8') as f:
    f.write(db_js)

print("PIA Automation tasks and project successfully injected!")
