import os
import re

tasks_data = [
    ("Set up camera hardware for video capture", "2026-08-01"),
    ("Record IN gate footage (daylight)", "2026-08-01"),
    ("Record IN gate footage (night/low light)", "2026-08-01"),
    ("Record OUT gate footage", "2026-08-01"),
    ("Write script to extract 1 frame per second", "2026-08-02"),
    ("Filter out blurry and redundant frames", "2026-08-02"),
    ("Organize dataset directory structure", "2026-08-02"),
    ("Label car bounding boxes in YOLO format", "2026-08-02"),
    ("Label truck bounding boxes in YOLO format", "2026-08-02"),
    ("Label bus/motorcycle bounding boxes", "2026-08-02"),
    ("Export final dataset zip (pvis_dataset_v1)", "2026-08-02"),
    ("Initialize PyTorch environment for YOLOv5", "2026-08-03"),
    ("Load YOLOv5s from torch.hub (v6.2 branch)", "2026-08-03"),
    ("Bypass interactive PyTorch Hub prompt", "2026-08-03"),
    ("Configure YOLO detection thresholds", "2026-08-03"),
    ("Integrate EasyOCR for license plate reading", "2026-08-04"),
    ("Implement dynamic crop regions for cars", "2026-08-04"),
    ("Implement dynamic crop regions for trucks/buses", "2026-08-04"),
    ("Implement dynamic crop regions for motorcycles", "2026-08-04"),
    ("Add image upscaling before passing to OCR", "2026-08-05"),
    ("Implement custom IOU Tracker algorithm", "2026-08-05"),
    ("Assign unique persistent track IDs", "2026-08-05"),
    ("Add 2-second debounce logic", "2026-08-06"),
    ("Implement bbox aspect ratio filters (0.3-3.5)", "2026-08-06"),
    ("Design 3-Thread Architecture", "2026-08-07"),
    ("Implement Producer thread (camera read)", "2026-08-07"),
    ("Implement MOG2 motion detection", "2026-08-07"),
    ("Add 60-second post-roll logic", "2026-08-08"),
    ("Implement Consumer thread (YOLO inference)", "2026-08-08"),
    ("Create dynamic gate line detection", "2026-08-08"),
    ("Implement OCR Worker thread", "2026-08-09"),
    ("Force MJPG codec & 640x480 resolution", "2026-08-09"),
    ("Create SQLite schema for vehicle_events", "2026-08-09"),
    ("Implement db_manager.py for SQLite", "2026-08-10"),
    ("Build storage_manager.py for SD temp recording", "2026-08-10"),
    ("Logic to move MP4 clips to external HDD", "2026-08-10"),
    ("Auto-cut video files after 1-hour limit", "2026-08-10"),
    ("Setup Flask app (port 5000) on Jetson", "2026-08-11"),
    ("Create MJPEG streaming routes", "2026-08-11"),
    ("Build HTML UI with live stats cards", "2026-08-11"),
    ("Implement start/stop pipeline APIs controls", "2026-08-12"),
    ("Add video uploader panel for testing", "2026-08-12"),
    ("Initialize FastAPI cloud backend app", "2026-08-13"),
    ("Setup Neon PostgreSQL & SQLAlchemy models", "2026-08-13"),
    ("Create POST /api/v1/sync/events endpoint", "2026-08-13"),
    ("Create POST /api/v1/sync/sessions endpoint", "2026-08-14"),
    ("Create GET analytics and reporting endpoints", "2026-08-14"),
    ("Configure Railway deployment (port 8080)", "2026-08-14"),
    ("Initialize Next.js project for Vercel", "2026-08-15"),
    ("Build live vehicle event feed component", "2026-08-15"),
    ("Build real-time analytics charts", "2026-08-16"),
    ("Integrate date and plate number filters", "2026-08-16"),
    ("Build background cloud sync daemon", "2026-08-17"),
    ("Implement offline-first queueing mechanism", "2026-08-17"),
    ("Write sync_historical.py for bulk recovery", "2026-08-18"),
    ("Configure 4GB swap file for OOM prevention", "2026-08-19"),
    ("Disable Jetson desktop GUI for RAM savings", "2026-08-19"),
    ("Set torch.set_num_threads(2)", "2026-08-19"),
    ("Inject mock seaborn module to fix crashes", "2026-08-19"),
    ("Unpin psycopg2 version for Py3.13", "2026-08-19"),
    ("Write install_jetson.sh setup script", "2026-08-20"),
    ("Create systemd pvis.service file", "2026-08-20"),
    ("Configure auto-start and crash recovery", "2026-08-20"),
    ("Push final code to GitHub repo", "2026-08-20"),
    ("Final end-to-end integration test", "2026-08-20")
]

values_sql = []
for i, (name, date) in enumerate(tasks_data):
    safe_name = name.replace("'", "''")
    values_sql.append(f"          ('tsk-pvis-{i+1}', '{safe_name}', 'Completed task: {safe_name}', 'Done', 'High', '{date}', '{date}', 'proj-pvis', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad', '{date} 23:59:59')")

values_str = ",\n".join(values_sql)

full_sql = f'''      // Seed PVIS Tasks
      await client.query(
        INSERT INTO tasks (id, name, description, status, priority, start_date, due_date, project_id, assignee_id, assigned_to, created_by, completed_at)
        VALUES 
{values_str}
        ON CONFLICT (id) DO NOTHING;
      );\n\n'''

db_js_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'db.js')
with open(db_js_path, 'r', encoding='utf-8') as f:
    db_js = f.read()

# Split around the blocks
start_marker = "// Seed PVIS Tasks"
end_marker = "// Seed task submissions"

start_idx = db_js.find(start_marker)
end_idx = db_js.find(end_marker)

if start_idx != -1 and end_idx != -1:
    db_js = db_js[:start_idx] + full_sql + "      " + db_js[end_idx:]
    with open(db_js_path, 'w', encoding='utf-8') as f:
        f.write(db_js)
    print(f"Successfully expanded PVIS tasks to {len(tasks_data)} tasks!")
else:
    print("Could not find the markers to replace.")
