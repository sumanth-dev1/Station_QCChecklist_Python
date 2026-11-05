import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import datetime, pytz
from flask import Blueprint, request, jsonify
from db import get_connection

connect_bp = Blueprint('connect', __name__)

@connect_bp.route('/connect', methods=['POST'])
def connect():
    if request.method != 'POST':
        return jsonify({'success': False, 'message': '❌ Only POST allowed'})

    station_id = (request.form.get('station-id') or '').strip()
    station_name = (request.form.get('station-name') or '').strip()
    zone = (request.form.get('zone') or '').strip()
    division = (request.form.get('division') or '').strip()
    section_name = (request.form.get('section-name') or '').strip()
    initial_date = (request.form.get('initial-date') or '').strip()
    updated_date = (request.form.get('updated-date') or '').strip()

    if not station_id or not station_name or not zone or not division or not section_name or not initial_date or not updated_date:
        return jsonify({'success': False, 'message': '❌ All fields are required'})

    kolkata = pytz.timezone("Asia/Kolkata")
    current_time = datetime.datetime.now(kolkata).strftime('%Y-%m-%d %H:%M:%S')

    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(buffered=True)

        cursor.execute("SELECT 1 FROM station WHERE station_id = %s", (station_id,))
        row = cursor.fetchone()

        if row:
            return jsonify({'success': True, 'message': 'ℹ️ Station already exists. Start time preserved.'})
        else:
            cursor.execute(
                """INSERT INTO station 
                (station_id, station_name, railway_zone, division, section_name, initial_date, updated_date, start_time, completed_time)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                (station_id, station_name, zone, division, section_name, initial_date, updated_date, current_time, current_time)
            )
            return jsonify({'success': True, 'message': '✅ Station info saved with start time'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'❌ Insert failed: {e}'})
    finally:
        if conn and conn.is_connected():
            conn.close()
