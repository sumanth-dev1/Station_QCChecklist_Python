import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import datetime, pytz
from flask import Blueprint, request, jsonify
from db import get_connection

update_completed_time_bp = Blueprint('update_completed_time', __name__)

@update_completed_time_bp.route('/update_completed_time', methods=['POST'])
def update_completed_time():
    station_id = (request.form.get('station_id') or request.form.get('station-id') or '').strip()
    if not station_id:
        return jsonify({"success": False, "message": "❌ Missing station_id"})

    kolkata = pytz.timezone("Asia/Kolkata")
    current_time = datetime.datetime.now(kolkata).strftime('%Y-%m-%d %H:%M:%S')

    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE station SET completed_time = %s WHERE station_id = %s", (current_time, station_id))
        cursor.close()
        return jsonify({"success": True, "message": "✅ Completed time updated"})
    except Exception as e:
        return jsonify({"success": False, "message": f"❌ Update failed: {e}"})
    finally:
        if conn and conn.is_connected():
            conn.close()
