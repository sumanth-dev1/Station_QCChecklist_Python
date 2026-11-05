import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import hashlib, requests, urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
from flask import Blueprint, request, jsonify, session
from db import get_connection

upload_to_wfms_bp = Blueprint('upload_to_wfms', __name__)

WFMS_BASE_URL = "https://eg.hbl.in:5100/api"
WFMS_ACTIVITY = "Wayside QA Audit"
WFMS_FILE = "Wayside QA Audit Report"

@upload_to_wfms_bp.route('/upload_to_wfms', methods=['POST'])
@upload_to_wfms_bp.route('/upload-to-wfms', methods=['POST'])
def upload_to_wfms():
    if 'username' not in session and not request.form.get('wfms_token'):
        return jsonify({'success': False, 'message': 'Unauthorized access. Please log in.'})

    report_id = request.form.get('reportId')
    file_name_param = request.form.get('fileName') or request.form.get('file_name')
    wfms_token = request.form.get('wfms_token', '')
    wfms_station_name = request.form.get('wfms_station_name', '')
    activity_id = request.form.get('activityId')
    doc_id = request.form.get('docId')

    if not wfms_token or not wfms_station_name or wfms_station_name == 'undefined':
        return jsonify({'success': False, 'message': 'WFMS Authentication or Station selection missing.'})

    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True, buffered=True)

        report = None
        if report_id and report_id not in ['undefined', 'null', '']:
            cursor.execute("SELECT id, file_name, last_uploaded_hash FROM report WHERE id = %s", (report_id,))
            report = cursor.fetchone()

        if not report and file_name_param:
            cursor.execute("SELECT id, file_name, last_uploaded_hash FROM report WHERE file_name = %s", (file_name_param,))
            report = cursor.fetchone()

        if not report:
            return jsonify({'success': False, 'message': 'Report not found in database.'})

        rep_id = report['id']
        file_name = report['file_name']
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        file_path = os.path.join(base_dir, 'uploads', 'reports', file_name)

        if not os.path.exists(file_path):
            return jsonify({'success': False, 'message': f'Report file found in DB but missing on disk: {file_name}'})

        # Calculate SHA-256
        with open(file_path, 'rb') as f:
            local_hash = hashlib.sha256(f.read()).hexdigest()

        if report.get('last_uploaded_hash') == local_hash:
            return jsonify({'success': True, 'message': 'Report is already up-to-date in WFMS.'})

        headers = {
            'Authorization': f'Bearer {wfms_token}',
            'x-app-module': 'WFMS2'
        }

        act_success = False
        if activity_id and doc_id and activity_id not in ['undefined', 'null'] and doc_id not in ['undefined', 'null']:
            with open(file_path, 'rb') as f:
                files = {'file': (file_name, f, 'application/pdf')}
                data = {'activityId': activity_id, 'docId': doc_id}
                act_resp = requests.post(f"{WFMS_BASE_URL}/activity/upload", headers=headers, data=data, files=files, verify=False, timeout=60)
                if act_resp.status_code == 200:
                    act_json = act_resp.json()
                    act_success = act_json.get('status', False)

        with open(file_path, 'rb') as f:
            files = {'file': (file_name, f, 'application/pdf')}
            data = {'stationName': wfms_station_name, 'activityName': WFMS_ACTIVITY, 'fileName': WFMS_FILE}
            st_resp = requests.post(f"{WFMS_BASE_URL}/station-file", headers=headers, data=data, files=files, verify=False, timeout=60)
            st_json = st_resp.json() if st_resp.status_code == 200 else {}
            st_success = st_json.get('status', False)

        if act_success or st_success:
            try:
                cursor.execute("UPDATE report SET last_uploaded_hash = %s WHERE id = %s", (local_hash, rep_id))
            except Exception:
                pass
            return jsonify({'success': True, 'message': 'Report pushed to WFMS Wayside activity successfully!'})
        else:
            err = st_json.get('message') or 'WFMS rejected the upload.'
            return jsonify({'success': False, 'message': f'WFMS Error: {err}'})

    except Exception as e:
        return jsonify({'success': False, 'message': f'Server error: {e}'})
    finally:
        if conn and conn.is_connected():
            conn.close()
