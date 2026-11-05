import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from flask import Blueprint, request, jsonify
from db import get_connection

getReportDetails_bp = Blueprint('getReportDetails', __name__)

@getReportDetails_bp.route('/getReportDetails', methods=['GET'])
def getReportDetails():
    station_id = request.args.get('station_id')
    if not station_id:
        return jsonify({'success': False, 'message': 'Invalid request. Station ID is required.'})

    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True, buffered=True)
        cursor.execute("SELECT * FROM report WHERE station_id = %s OR file_name LIKE %s LIMIT 1", (station_id, f"%{station_id}%"))
        report = cursor.fetchone()
        cursor.close()

        if report:
            return jsonify({'success': True, 'report': report})
        else:
            return jsonify({'success': False, 'message': 'Report not found for this station.'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Database error: {e}'})
    finally:
        if conn and conn.is_connected():
            conn.close()
