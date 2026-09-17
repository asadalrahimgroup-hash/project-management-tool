import os
import re

db_js_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'db.js')
with open(db_js_path, 'r', encoding='utf-8') as f:
    db_js = f.read()

# Fix the project details in-place from the fake PIA to real PIA CargoSpot
db_js = db_js.replace("'PIA Cargo: Track & Trace Automation'", "'PIA CargoSpot Automation'")
db_js = db_js.replace("'proj-pia-track'", "'proj-pia-cargospot'")
db_js = db_js.replace("'pp-pia-track'", "'pp-pia-cargospot'")
db_js = db_js.replace("'pm-pia-1'", "'pm-pia-cs-1'")
db_js = db_js.replace(
    "'Custom full-stack app automating Pakistan International Airlines (PIA) Cargo AWB tracking via Playwright, async scheduling, and branded HTML emails.'",
    "'Optimized async browser automation tool for monitoring and extracting cargo flights from the CHAMP CargoSpot portal. Features Playwright, MooTools handling, and Excel I/O.'"
)
db_js = db_js.replace("'Automated PIA AWB Scraper & Emails'", "'Async Cargo Flight Polling Bot'")

tasks_data = [
    # Phase 1: Core Automation & Setup (Sep 1-3)
    ("Initialize Python project and virtual environment", "2026-09-01"),
    ("Set up python-dotenv for secure credentials", "2026-09-01"),
    ("Configure PORTAL_USERNAME and PORTAL_PASSWORD in .env", "2026-09-01"),
    ("Write read_booking_input to parse PIA_Booking.xlsx", "2026-09-01"),
    ("Write append_results_to_excel to format and output data", "2026-09-02"),
    ("Configure Playwright Chromium async instance", "2026-09-02"),
    ("Maximize viewport and set default timeouts", "2026-09-02"),
    ("Build on_dialog automatic popup/alert dismissal handler", "2026-09-02"),
    ("Write intelligent auto-login sequence", "2026-09-03"),
    ("Handle authentication state checks", "2026-09-03"),
    ("Handle login failure edge cases", "2026-09-03"),

    # Phase 2: Form Handling & Legacy UI Navigation (Sep 4-7)
    ("Analyze CargoSpot MooTools legacy AJAX dropdowns", "2026-09-04"),
    ("Engineer fill_station_autocomplete logic", "2026-09-04"),
    ("Wait for ul.ui-autocomplete DOM spawn events", "2026-09-04"),
    ("Handle Origin/Destination dropdown item clicks", "2026-09-05"),
    ("Create select_product_and_price_class custom injector", "2026-09-05"),
    ("Dispatch pure JavaScript DOM events (createEvent HTMLEvents)", "2026-09-05"),
    ("Force selection of SEA FOOD bypassing UI glitches", "2026-09-05"),
    ("Build set_departure_date instant injection logic", "2026-09-06"),
    ("Dispatch input, change, and blur events on date fields", "2026-09-06"),
    ("Read AWB, Commodity, Pieces, Weight from Excel", "2026-09-07"),
    ("Program smart form pre-filling on the first loop iteration", "2026-09-07"),

    # Phase 3: Searching & Data Extraction (Sep 8-10)
    ("Replace Playwright native clicks with direct JS findFlightBooking()", "2026-09-08"),
    ("Analyze and bypass invisible loading overlays", "2026-09-08"),
    ("Implement popup window memory cleanup routine", "2026-09-08"),
    ("Clear page.context.pages at the start of each cycle", "2026-09-08"),
    ("Build ultra-fast polling loop replacing time.sleep", "2026-09-09"),
    ("Poll document.readyState for millisecond accuracy", "2026-09-09"),
    ("Monitor DOM for routing, flight, no flights keywords", "2026-09-09"),
    ("Build extract_flight_rows HTML table parser", "2026-09-09"),
    ("Extract flight numbers, routing, departure times, prices", "2026-09-10"),
    ("Develop is_direct_flight multi-signal verification engine", "2026-09-10"),
    ("Analyze flight segments, aircraft counts, Stops Where text", "2026-09-10"),
    ("Output Direct flights as green in Excel", "2026-09-10"),
    ("Output Transit flights as red in Excel", "2026-09-10"),

    # Phase 4: Advanced Looping & Workflow Modes (Sep 11-13)
    ("Build Unlimited Single Date Mode continuous loop", "2026-09-11"),
    ("Optimize memory for high-speed narrow booking windows", "2026-09-11"),
    ("Build Date Range Mode with automatic incrementation", "2026-09-11"),
    ("Implement Friday-skipping logic in Range Mode", "2026-09-11"),
    ("Implement automatic range looping/restart logic", "2026-09-12"),
    ("Add detection for HTTP 403 Forbidden", "2026-09-12"),
    ("Add detection for HTTP 429 Too Many Requests", "2026-09-12"),
    ("Build automatic session refresher (context teardown/rebuild)", "2026-09-12"),
    ("Implement state restoration after rate limit resets", "2026-09-13"),
    ("Build Success Pause logic (Infinite lock on FLIGHT FOUND)", "2026-09-13"),
    ("Build Failure Pause logic (5.0s visual verification window)", "2026-09-13"),
    ("Add instant skip if user manually closes failure window", "2026-09-13"),

    # Phase 5: File Structure & Finalization (Sep 14-15)
    ("Architect pia_automation.py main engine", "2026-09-14"),
    ("Build dashboard.py UI for launching/modifying settings", "2026-09-14"),
    ("Configure PIA_Booking.xlsx master template", "2026-09-14"),
    ("Setup /screenshots/ directory for automated debugging", "2026-09-14"),
    ("Write automated CAPTCHA and rate limit screenshot hooks", "2026-09-15"),
    ("Final end-to-end regression testing on production portal", "2026-09-15"),
    ("Final code cleanup and dependency freeze", "2026-09-15"),
    ("Deployment handover and project completion sign-off", "2026-09-15"),
]

values_sql = []
for i, (name, date) in enumerate(tasks_data):
    safe_name = name.replace("'", "''")
    values_sql.append(f"          ('tsk-pia-cs-{i+1}', '{safe_name}', 'Completed task: {safe_name}', 'Done', 'High', '{date}', '{date}', 'proj-pia-cargospot', 'usr-pm-asad', 'usr-pm-asad', 'usr-pm-asad', '{date} 23:59:59')")

new_tasks_block = ",\\n" + ",\n".join(values_sql)

# Regex to append after tsk-tt-59
pattern = r"(\'tsk-tt-59\'.*?\))(\n\s*ON CONFLICT \(id\) DO NOTHING;)"
if re.search(pattern, db_js, re.DOTALL):
    db_js = re.sub(pattern, r"\1" + new_tasks_block + r"\2", db_js, flags=re.DOTALL)
    print("Tasks successfully injected!")
else:
    print("Could not find tsk-tt-59!")

with open(db_js_path, 'w', encoding='utf-8') as f:
    f.write(db_js)
