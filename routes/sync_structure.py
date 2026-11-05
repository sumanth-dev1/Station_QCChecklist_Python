import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from flask import Blueprint, Response
from db import get_connection

sync_structure_bp = Blueprint('sync_structure', __name__)

@sync_structure_bp.route('/sync_structure', methods=['GET', 'POST'])
def sync_structure():
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        tables_to_index = [
            "verification_of_equipment_serial_numbers", "tower", "rtu", "rf_antennas",
            "installation_of_kavach_equipment", "networking_rack", "ips", "dc_convertor",
            "pdu", "smocip", "outdoor_cabling", "relay_rack", "riu",
            "laying_of_sectional_ofc_cable", "gps_gsm_antenna", "rfid_tags", "tag_to_tag_distance"
        ]

        for table in tables_to_index:
            try:
                cursor.execute(f"ALTER TABLE `{table}` ADD INDEX `idx_station_sno` (`station_id`, `S_no`)")
            except Exception:
                pass

        try:
            cursor.execute("ALTER TABLE `verification_of_equipment_serial_numbers` ADD COLUMN `row_key` VARCHAR(100) DEFAULT NULL")
        except Exception:
            pass

        try:
            cursor.execute("ALTER TABLE `images` ADD COLUMN `row_key` VARCHAR(100) DEFAULT NULL")
        except Exception:
            pass

        cursor.close()
        return Response("success", mimetype="text/plain")
    except Exception as e:
        return Response(f"error: {e}", mimetype="text/plain")
    finally:
        if conn and conn.is_connected():
            conn.close()
