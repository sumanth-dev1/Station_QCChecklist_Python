import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from flask import Blueprint, request, jsonify
from db import get_connection

getNextVersion_bp = Blueprint('getNextVersion', __name__)

@getNextVersion_bp.route('/getNextVersion', methods=['GET'])
def getNextVersion():
    station_id = (request.args.get('station_id') or '').strip()
    if not station_id:
        return jsonify({'success': False, 'message': 'station ID is required'})

    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True, buffered=True)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS report_versions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                station_id VARCHAR(50) NOT NULL,
                latest_version INT DEFAULT 1,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("SELECT latest_version FROM report_versions WHERE station_id = %s", (station_id,))
        row = cursor.fetchone()

        if row:
            next_version = int(row['latest_version']) + 1
            cursor.execute("UPDATE report_versions SET latest_version = %s WHERE station_id = %s", (next_version, station_id))
        else:
            next_version = 1
            cursor.execute("INSERT INTO report_versions (station_id, latest_version) VALUES (%s, %s)", (station_id, next_version))

        cursor.close()
        return jsonify({'success': True, 'version': next_version})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Database error: {e}'})
    finally:
        if conn and conn.is_connected():
            conn.close()
