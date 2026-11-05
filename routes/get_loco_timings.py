import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from flask import Blueprint, request, jsonify
from db import get_connection

get_loco_timings_bp = Blueprint('get_loco_timings', __name__)

@get_loco_timings_bp.route('/get_loco_timings', methods=['GET'])
def get_loco_timings():
    station_id = (request.args.get('station_id') or request.args.get('station-id') or '').strip()
    if not station_id:
        return jsonify({"success": False, "message": "❌ Missing station_id"})

    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True, buffered=True)
        cursor.execute("SELECT start_time, completed_time FROM station WHERE station_id = %s", (station_id,))
        row = cursor.fetchone()
        cursor.close()

        if row:
            start_str = str(row['start_time']) if row['start_time'] else ''
            comp_str = str(row['completed_time']) if row['completed_time'] else ''
            return jsonify({
                "success": True,
                "start_time": start_str,
                "completed_time": comp_str
            })
        else:
            return jsonify({"success": False, "message": "❌ station ID not found"})
    except Exception as e:
        return jsonify({"success": False, "message": f"❌ Query failed: {e}"})
    finally:
        if conn and conn.is_connected():
            conn.close()
