import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import re
from flask import Blueprint, request, jsonify
from db import get_connection

fetch_observations_bp = Blueprint('fetch_observations', __name__)

TABLE_NAMES = [
    "verification_of_equipment_serial_numbers", "tower", "rtu", "rf_antennas",
    "installation_of_kavach_equipment", "networking_rack", "ips", "dc_convertor",
    "pdu", "smocip", "outdoor_cabling", "relay_rack", "riu",
    "laying_of_sectional_ofc_cable", "gps_gsm_antenna", "rfid_tags", "tag_to_tag_distance"
]

def sort_sno_key(item):
    sno = item.get('S_no', '')
    parts = sno.split('.')
    main_num = int(parts[0]) if len(parts) > 0 and parts[0].isdigit() else 0
    sub_clean = re.sub(r'[^0-9]', '', parts[1]) if len(parts) > 1 else '0'
    sub_num = int(sub_clean) if sub_clean else 0
    subsub_clean = re.sub(r'[^0-9]', '', parts[2]) if len(parts) > 2 else '0'
    subsub_num = int(subsub_clean) if subsub_clean else 0
    return (main_num, sub_num, subsub_num)

@fetch_observations_bp.route('/fetch_observations', methods=['GET', 'POST'])
def fetch_observations():
    station_id = (request.args.get('station_id') or request.form.get('station_id') or '').strip()
    if not station_id:
        return jsonify({'status': 'error', 'message': 'Missing station_id'})

    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True, buffered=True)

        # Pre-fetch all images for this station
        images_map = {}
        cursor.execute("SELECT s_no, entity_type, image_path FROM images WHERE station_id = %s", (station_id,))
        for img in cursor.fetchall():
            ent = img['entity_type']
            s_no = img['s_no']
            if ent not in images_map:
                images_map[ent] = {}
            if s_no not in images_map[ent]:
                images_map[ent][s_no] = []
            images_map[ent][s_no].append(img['image_path'])

        has_atr_col = False
        try:
            cursor.execute("SHOW COLUMNS FROM verification_of_equipment_serial_numbers LIKE 'atr_serial'")
            has_atr_col = bool(cursor.fetchone())
        except Exception:
            has_atr_col = False
        atr_col_expr = ", atr_serial" if has_atr_col else ", NULL as atr_serial"

        observations = []
        for table in TABLE_NAMES:
            if table == "verification_of_equipment_serial_numbers":
                sql = f"SELECT S_no, observation_text, requirement_text, observation_status, remarks, created_at, updated_at, barcode_kavach_main_unit {atr_col_expr} FROM {table} WHERE station_id = %s"
            else:
                sql = f"SELECT S_no, observation_text, requirement_text, observation_status, remarks, created_at, updated_at FROM {table} WHERE station_id = %s"

            try:
                cursor.execute(sql, (station_id,))
                rows = cursor.fetchall()
                for row in rows:
                    sno = row['S_no']
                    image_paths = images_map.get(table, {}).get(sno, [])
                    row_bc = row.get('barcode_kavach_main_unit')
                    row_atr = row.get('atr_serial') or row_bc
                    observations.append({
                        'S_no': row['S_no'],
                        'observation_text': row['observation_text'] or '',
                        'requirement_text': row['requirement_text'] or '',
                        'observation_status': row['observation_status'] or '',
                        'remarks': row['remarks'] or '',
                        'image_paths': image_paths,
                        'barcode_kavach_main_unit': row_bc,
                        'barcode': row_bc,
                        'atr_serial': row_atr,
                        'created_at': str(row['created_at']) if row.get('created_at') else None,
                        'updated_at': str(row['updated_at']) if row.get('updated_at') else None
                    })
            except Exception as table_err:
                # Log and continue if a specific table errors
                continue

        # Count custom rows from row_templates
        custom_count = 0
        try:
            cursor.execute("SELECT COUNT(*) as cnt FROM row_templates")
            c_row = cursor.fetchone()
            if c_row:
                custom_count = int(c_row['cnt'])
        except Exception:
            pass

        # Filter out removed rows (like 13.2) and sort numerically
        observations = [obs for obs in observations if obs['S_no'] != '13.2']
        observations.sort(key=sort_sno_key)

        if observations:
            return jsonify({'status': 'success', 'data': observations, 'total_custom_points': custom_count})
        else:
            return jsonify({'status': 'error', 'message': 'No observations found', 'total_custom_points': custom_count})

    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Database error: {e}'})
    finally:
        if conn and conn.is_connected():
            conn.close()
