import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from flask import Blueprint, request, jsonify
from db import get_connection

checkObservations_bp = Blueprint('checkObservations', __name__)

TABLE_NAMES = {
    0: 'station',
    2: 'verification_of_equipment_serial_numbers',
    3: 'tower',
    4: 'rtu',
    5: 'rf_antennas',
    6: 'installation_of_kavach_equipment',
    7: 'networking_rack',
    8: 'ips',
    9: 'dc_convertor',
    10: 'pdu',
    11: 'smocip',
    12: 'outdoor_cabling',
    13: 'relay_rack',
    14: 'riu',
    15: 'laying_of_sectional_ofc_cable',
    16: 'gps_gsm_antenna',
    17: 'rfid_tags',
    18: 'tag_to_tag_distance'
}

@checkObservations_bp.route('/checkObservations', methods=['POST'])
def checkObservations():
    data = request.get_json(silent=True) or request.form

    station_id = data.get("stationId") or data.get("station-id")
    zone = data.get("zone")
    division = data.get("division")
    section_id_raw = data.get("sectionId") or data.get("section-id")
    subsection = data.get("subsection")

    if not station_id or section_id_raw is None:
        return jsonify({"error": "Missing required parameters", "received": data})

    try:
        section_id = int(str(section_id_raw).replace('_0', '').replace('.0', ''))
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid section ID"})

    if section_id not in TABLE_NAMES:
        return jsonify({"error": "Invalid section ID"})

    table = TABLE_NAMES[section_id]
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(buffered=True)

        if section_id == 0:
            cursor.execute(
                "SELECT COUNT(*) FROM station WHERE station_id = %s AND railway_zone = %s AND division = %s",
                (station_id, zone, division)
            )
        else:
            if subsection:
                like_pattern = str(subsection) + "%"
                cursor.execute(
                    f"SELECT COUNT(*) FROM {table} WHERE station_id = %s AND s_no LIKE %s",
                    (station_id, like_pattern)
                )
            else:
                cursor.execute(
                    f"SELECT COUNT(*) FROM {table} WHERE station_id = %s",
                    (station_id,)
                )

        count = cursor.fetchone()[0]
        exists = count > 0

        return jsonify({
            "exists": exists,
            "sectionId": section_id,
            "subsection": subsection,
            "message": "Section/Subsection is filled" if exists else "Section/Subsection is empty"
        })
    except Exception as e:
        return jsonify({"error": f"Database error: {e}"})
    finally:
        if conn and conn.is_connected():
            conn.close()
