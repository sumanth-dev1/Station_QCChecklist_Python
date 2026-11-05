import sys, os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from flask import Flask, jsonify, send_from_directory, session
from mysql.connector import Error as MySQLError

import config
import db

import logging
logging.basicConfig(
    filename='app_errors.log',
    level=logging.ERROR,
    format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s'
)

app = Flask(__name__, static_folder='static')
app.secret_key = config.SECRET_KEY

# Register all endpoint blueprints
from routes.connect import connect_bp
from routes.login import login_bp
from routes.create_user import create_user_bp
from routes.edit_user import edit_user_bp
from routes.view_users import view_users_bp
from routes.verify_admin import verify_admin_bp

from routes.section2_0 import section2_0_bp
from routes.section3_0 import section3_0_bp
from routes.section4_0 import section4_0_bp
from routes.section5_0 import section5_0_bp
from routes.section6_0 import section6_0_bp
from routes.section7_0 import section7_0_bp
from routes.section8_0 import section8_0_bp
from routes.section9_0 import section9_0_bp
from routes.section10_0 import section10_0_bp
from routes.section11_0 import section11_0_bp
from routes.section12_0 import section12_0_bp
from routes.section13_0 import section13_0_bp
from routes.section14_0 import section14_0_bp
from routes.section15_0 import section15_0_bp
from routes.section16_0 import section16_0_bp
from routes.section17_0 import section17_0_bp
from routes.section18_0 import section18_0_bp

from routes.updateObservations import updateObservations_bp
from routes.update import update_bp
from routes.checkObservations import checkObservations_bp
from routes.fetch_observations import fetch_observations_bp
from routes.update_completed_time import update_completed_time_bp
from routes.get_loco_timings import get_loco_timings_bp

from routes.upload import upload_bp
from routes.deleteImage import deleteImage_bp
from routes.manage_row_templates import manage_row_templates_bp
from routes.sync_structure import sync_structure_bp

from routes.generateReport import generateReport_bp
from routes.uploadReport import uploadReport_bp
from routes.viewReports import viewReports_bp
from routes.getReportById import getReportById_bp
from routes.getReportDetails import getReportDetails_bp
from routes.getNextVersion import getNextVersion_bp
from routes.fetchReports import fetchReports_bp
from routes.update_version import update_version_bp
from routes.generateSummaryReport import generateSummaryReport_bp

from routes.wfms_proxy import wfms_proxy_bp
from routes.upload_to_wfms import upload_to_wfms_bp

blueprints = [
    connect_bp, login_bp, create_user_bp, edit_user_bp, view_users_bp, verify_admin_bp,
    section2_0_bp, section3_0_bp, section4_0_bp, section5_0_bp, section6_0_bp, section7_0_bp,
    section8_0_bp, section9_0_bp, section10_0_bp, section11_0_bp, section12_0_bp, section13_0_bp,
    section14_0_bp, section15_0_bp, section16_0_bp, section17_0_bp, section18_0_bp,
    updateObservations_bp, update_bp, checkObservations_bp, fetch_observations_bp,
    update_completed_time_bp, get_loco_timings_bp,
    upload_bp, deleteImage_bp, manage_row_templates_bp, sync_structure_bp,
    generateReport_bp, uploadReport_bp, viewReports_bp, getReportById_bp, getReportDetails_bp,
    getNextVersion_bp, fetchReports_bp, update_version_bp, generateSummaryReport_bp,
    wfms_proxy_bp, upload_to_wfms_bp
]

for bp in blueprints:
    app.register_blueprint(bp)

@app.route("/health")
def health():
    return jsonify({"status": "ok", "app": "Station QC Python", "port": config.PORT})

@app.route("/test-db")
def test_db():
    try:
        tables = db.list_tables()
        return jsonify({
            "success": True,
            "database": config.DB_NAME,
            "tables": tables,
            "table_count": len(tables),
        })
    except MySQLError as e:
        return jsonify({
            "success": False,
            "message": f"MySQL query failed: {e}",
        }), 500

# Static and uploaded files serving
@app.route("/uploads/<path:filename>")
def serve_uploads(filename):
    uploads_dir = os.path.abspath("uploads")
    target_file = os.path.join(uploads_dir, filename)
    if os.path.exists(target_file) and os.path.isfile(target_file):
        return send_from_directory(uploads_dir, filename)

    # Optional legacy fallback: if configured, check historical uploads directory
    if config.LEGACY_UPLOADS_DIR and os.path.exists(config.LEGACY_UPLOADS_DIR):
        candidates = [
            os.path.join(config.LEGACY_UPLOADS_DIR, filename),
            os.path.join(config.LEGACY_UPLOADS_DIR, "reports", filename),
        ]
        for candidate in candidates:
            if os.path.exists(candidate) and os.path.isfile(candidate):
                return send_from_directory(os.path.dirname(candidate), os.path.basename(candidate))

    return jsonify({"error": "File not found"}), 404

@app.route("/")
def serve_root():
    return send_from_directory(os.path.abspath("static"), "index.html")

@app.route("/<path:path>")
def serve_static(path):
    if not path or path.endswith("/"):
        path += "index.html"

    # Check uploads
    if path.startswith("uploads/"):
        return send_from_directory(os.path.abspath("."), path)

    static_dir = os.path.abspath("static")
    target_file = os.path.join(static_dir, path)

    if os.path.exists(target_file) and os.path.isfile(target_file):
        return send_from_directory(static_dir, path)

    # Try checking if path without .html exists (e.g. /create -> /create.html)
    if not path.endswith(".html"):
        html_target = os.path.join(static_dir, path + ".html")
        if os.path.exists(html_target) and os.path.isfile(html_target):
            return send_from_directory(static_dir, path + ".html")

    return jsonify({"error": "File not found"}), 404

@app.after_request
def add_cache_control_headers(response):
    if "Cache-Control" not in response.headers:
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    return response

if __name__ == "__main__":
    from waitress import serve
    print(f"Starting Waitress production server on http://0.0.0.0:{config.PORT}...")
    serve(app, host="0.0.0.0", port=config.PORT)
