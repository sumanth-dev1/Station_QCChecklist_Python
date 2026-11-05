import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import re
from flask import Blueprint, request, jsonify
from db import get_connection

getReportById_bp = Blueprint('getReportById', __name__)

@getReportById_bp.route('/getReportById', methods=['GET'])
def getReportById():
    station_id_raw = (request.args.get('station_id') or request.args.get('stationId') or '').strip()
    if not station_id_raw:
        return jsonify({'success': False, 'message': 'Missing station_id parameter.'})

    # Clean filename if full report name was passed
    if '_Report_' in station_id_raw or station_id_raw.endswith('.pdf'):
        m = re.match(r'^([^_]+)', station_id_raw)
        station_id_clean = m.group(1).strip() if m else station_id_raw
    else:
        station_id_clean = station_id_raw

    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True, buffered=True)
        cursor.execute(
            """SELECT station_id, station_name, railway_zone, division, section_name, initial_date, updated_date 
               FROM station 
               WHERE station_id = %s OR station_name = %s 
               LIMIT 1""",
            (station_id_clean, station_id_clean)
        )
        row = cursor.fetchone()
        cursor.close()

        if not row:
            return jsonify({'success': False, 'message': f'No station details found for: {station_id_raw}'})

        transformed = {
            'stationId': row['station_id'],
            'stationName': row['station_name'],
            'zone': row['railway_zone'],
            'division': row['division'],
            'sectionName': row['section_name'],
            'initialDate': str(row['initial_date']) if row['initial_date'] else '',
            'updatedDate': str(row['updated_date']) if row['updated_date'] else ''
        }

        return jsonify({'success': True, 'report': transformed})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Database error: {e}'})
    finally:
        if conn and conn.is_connected():
            conn.close()
