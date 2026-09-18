import os
db_js_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'db.js')
with open(db_js_path, 'r', encoding='utf-8') as f:
    db_js = f.read()

db_js = db_js.replace("ON CONFLICT (id) DO NOTHING;\n          );\n      console.log", "ON CONFLICT (id) DO NOTHING;\n        );\n      console.log")
db_js = db_js.replace("ON CONFLICT (id) DO NOTHING;\n        \);\n      console.log", "ON CONFLICT (id) DO NOTHING;\n        );\n      console.log")

with open(db_js_path, 'w', encoding='utf-8') as f:
    f.write(db_js)
