import os
db_js_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'db.js')
with open(db_js_path, 'r', encoding='utf-8') as f:
    db_js = f.read()

db_js = db_js.replace("INSERT INTO projects (id, name, domain, about_title, about_description, status, priority, start_date, deadline, progress, program_id, pm_id, tl_id, created_by)", "INSERT INTO projects (id, name, domain, about_title, about_description, status, priority, start_date, deadline, progress, program_id, manager_id, project_manager_id, created_by)")

db_js = db_js.replace("INSERT INTO program_projects (id, program_id, project_name, domain, about_title, about_description, status, priority, start_date, deadline, pm_id, tl_id)", "INSERT INTO program_projects (id, program_id, name, domain, about_title, about_description, status, priority, start_date, deadline, created_by, assigned_to)")

with open(db_js_path, 'w', encoding='utf-8') as f:
    f.write(db_js)
