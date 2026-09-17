import os
import re

db_js_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'db.js')
with open(db_js_path, 'r', encoding='utf-8') as f:
    db_js = f.read()

# 1. Add Project
project_sql = ",\\n          ('proj-track-trace', 'M&S Aviators: Track & Trace', 'Logistics & Automation', 'Automated AWB Scraper & Emails', 'Custom full-stack app automating Ethiopian Airlines Cargo AWB tracking via Playwright, async scheduling, and branded HTML emails.', 'Completed', 'High', '2026-08-21', '2026-09-04', 100, 'prog-qarc', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad')"
db_js = re.sub(r"('proj-pvis'.*?\))(\n\s*ON CONFLICT \(id\) DO UPDATE SET\n\s*name = EXCLUDED.name,)", r"\1" + project_sql + r"\2", db_js)

# 2. Add Program Project
pp_sql = ",\\n          ('pp-track-trace', 'prog-qarc', 'M&S Aviators: Track & Trace', 'Logistics & Automation', 'Automated AWB Scraper & Emails', 'Custom full-stack app automating Ethiopian Airlines Cargo AWB tracking via Playwright.', 'Completed', 'High', '2026-08-21', '2026-09-04', 'usr-pm-asad', 'usr-pm-asad')"
db_js = re.sub(r"('pp-pvis'.*?\))(\n\s*ON CONFLICT \(id\) DO UPDATE SET\n\s*name = EXCLUDED.name,)", r"\1" + pp_sql + r"\2", db_js)

# 3. Add Project Member
pm_sql = ",\\n          ('pm-tt-1', 'proj-track-trace', 'usr-pm-asad', 'Project Manager')"
db_js = re.sub(r"('pm-pvis-1'.*?\))(\n\s*ON CONFLICT \(id\) DO NOTHING;)", r"\1" + pm_sql + r"\2", db_js)

# 4. Add Tasks
tasks_data = [
    # Phase 1: Core Architecture & Database Setup (Aug 21-22)
    ("Initialize Project Structure for frontend and backend", "2026-08-21"),
    ("Set up Vite + React + TypeScript frontend scaffold", "2026-08-21"),
    ("Set up FastAPI + Python 3 backend scaffold", "2026-08-21"),
    ("Write initial docker-compose.yml for PostgreSQL 16", "2026-08-21"),
    ("Configure asyncpg database connection string", "2026-08-21"),
    ("Build SQLAlchemy async session engine (database.py)", "2026-08-21"),
    ("Create AWBShipment relational schema", "2026-08-22"),
    ("Create AWBEvent historical timeline schema", "2026-08-22"),
    ("Create StatusChange audit trail schema", "2026-08-22"),
    ("Create Alert system internal schema", "2026-08-22"),
    ("Generate initial Alembic migrations for DB", "2026-08-22"),

    # Phase 2: Ethiopian Airlines Scraper Engine (Aug 23-25)
    ("Install and configure Microsoft Playwright", "2026-08-23"),
    ("Build headless browser initialization logic", "2026-08-23"),
    ("Write navigation sequence for Ethiopian Airlines portal", "2026-08-23"),
    ("Bypass initial cookie/consent popups on portal", "2026-08-23"),
    ("Engineer DOM selectors for raw AWB text extraction", "2026-08-24"),
    ("Extract flight legs and routing tables from DOM", "2026-08-24"),
    ("Extract event history tables into structured JSON", "2026-08-24"),
    ("Build change_detector.py to compare against DB snapshot", "2026-08-25"),
    ("Develop algorithm to identify new flight legs", "2026-08-25"),
    ("Develop algorithm to detect status shifts", "2026-08-25"),
    ("Implement adaptive polling interval logic", "2026-08-25"),
    ("Configure Immediate/Fast/Normal/Slow/Daily tiers", "2026-08-25"),

    # Phase 3: Background Scheduler (Aug 26-27)
    ("Build scheduler.py async worker loop", "2026-08-26"),
    ("Integrate scheduler with FastAPI lifecycle events", "2026-08-26"),
    ("Add asyncio.Semaphore to limit simultaneous scrapes", "2026-08-26"),
    ("Test memory consumption under heavy load", "2026-08-26"),
    ("Debug SQLAlchemy lazy-load errors in background tasks", "2026-08-27"),
    ("Refactor queries to use selectinload for eager loading", "2026-08-27"),
    ("Write unit tests for the worker loop", "2026-08-27"),

    # Phase 4: Customer Notifications (Aug 28-29)
    ("Transition from Gmail API to generic SMTP lib", "2026-08-28"),
    ("Configure SSL over Port 465 for operations@gsaetcargo.com.pk", "2026-08-28"),
    ("Design responsive HTML email template", "2026-08-28"),
    ("Inject dynamic variables into HTML template", "2026-08-28"),
    ("Wire scheduler to trigger emails on status changes", "2026-08-29"),
    ("Add logic to prevent duplicate emails for the same event", "2026-08-29"),
    ("Create isolated test_email.py mock scripts", "2026-08-29"),

    # Phase 5: Branding & UI Enhancements (Aug 30)
    ("Update global app naming to 'M&S AVIATORS'", "2026-08-30"),
    ("Sync React dashboard palette to Deep Blue & Green", "2026-08-30"),
    ("Attach M&S Aviators logo as CID inline image in emails", "2026-08-30"),
    ("Update Dashboard Header with prominent logo", "2026-08-30"),

    # Phase 6: Frontend Dashboard (Aug 31 - Sep 2)
    ("Build FastAPI REST routes to add/list AWBs", "2026-08-31"),
    ("Build FastAPI route to fetch AWB histories", "2026-08-31"),
    ("Create React dynamic table for active shipments", "2026-08-31"),
    ("Implement expandable rows for routing breakdown", "2026-09-01"),
    ("Implement expandable rows for event timeline", "2026-09-01"),
    ("Build Add AWB sidebar form with email bindings", "2026-09-01"),
    ("Integrate xlsx/csv batch upload parsing", "2026-09-02"),
    ("Create batch upload API endpoint", "2026-09-02"),
    ("Add 'Manual Run' action button in UI", "2026-09-02"),

    # Phase 7: Non-Technical System Logs (Sep 3)
    ("Create ScrapeLog database model", "2026-09-03"),
    ("Log success/skipped/failed states in scheduler", "2026-09-03"),
    ("Create GET /api/logs route for latest 100 events", "2026-09-03"),
    ("Build toggleable 'System Logs' view in React UI", "2026-09-03"),

    # Phase 8: Deployment Planning (Sep 4)
    ("Evaluate Cloud VPS vs Office Server architecture", "2026-09-04"),
    ("Document Datacenter IP block risks for Playwright", "2026-09-04"),
    ("Setup and provision the internal Office Server", "2026-09-04"),
    ("Write systemd service for FastAPI and Scheduler", "2026-09-04"),
    ("Final end-to-end handover testing", "2026-09-04"),
]

values_sql = []
for i, (name, date) in enumerate(tasks_data):
    safe_name = name.replace("'", "''")
    values_sql.append(f"          ('tsk-tt-{i+1}', '{safe_name}', 'Completed task: {safe_name}', 'Done', 'High', '{date}', '{date}', 'proj-track-trace', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad', '{date} 23:59:59')")

tasks_str = ",\\n" + ",\n".join(values_sql)
db_js = re.sub(r"('tsk-pvis-65'.*?\))(\n\s*ON CONFLICT \(id\) DO NOTHING;)", r"\1" + tasks_str + r"\2", db_js)

with open(db_js_path, 'w', encoding='utf-8') as f:
    f.write(db_js)

print("M&S Aviators tasks and project successfully injected!")
