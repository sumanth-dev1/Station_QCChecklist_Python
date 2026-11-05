import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import re
from flask import Blueprint, request, jsonify
from db import get_connection

generateReport_bp = Blueprint('generateReport', __name__)

TABLE_MAP = {
    "verification_of_equipment_serial_numbers": {"id": "2_0", "img_entity": "verification_of_equipment_serial_numbers"},
    "tower": {"id": "3_0", "img_entity": "tower"},
    "rtu": {"id": "4_0", "img_entity": "rtu"},
    "rf_antennas": {"id": "5_0", "img_entity": "rf_antennas"},
    "installation_of_kavach_equipment": {"id": "6_0", "img_entity": "installation_of_kavach_equipment"},
    "networking_rack": {"id": "7_0", "img_entity": "networking_rack"},
    "ips": {"id": "8_0", "img_entity": "ips"},
    "dc_convertor": {"id": "9_0", "img_entity": "dc_convertor"},
    "pdu": {"id": "10_0", "img_entity": "pdu"},
    "smocip": {"id": "11_0", "img_entity": "smocip"},
    "outdoor_cabling": {"id": "12_0", "img_entity": "outdoor_cabling"},
    "relay_rack": {"id": "13_0", "img_entity": "relay_rack"},
    "riu": {"id": "14_0", "img_entity": "riu"},
    "laying_of_sectional_ofc_cable": {"id": "15_0", "img_entity": "laying_of_sectional_ofc_cable"},
    "gps_gsm_antenna": {"id": "16_0", "img_entity": "gps_gsm_antenna"},
    "rfid_tags": {"id": "17_0", "img_entity": "rfid_tags"},
    "tag_to_tag_distance": {"id": "18_0", "img_entity": "tag_to_tag_distance"},
}

def sort_sno_key(item):
    sno = item.get('S_no', '')
    parts = sno.split('.')
    main_num = int(parts[0]) if len(parts) > 0 and parts[0].isdigit() else 0
    sub_clean = re.sub(r'[^0-9]', '', parts[1]) if len(parts) > 1 else '0'
    sub_num = int(sub_clean) if sub_clean else 0
    subsub_clean = re.sub(r'[^0-9]', '', parts[2]) if len(parts) > 2 else '0'
    subsub_num = int(subsub_clean) if subsub_clean else 0
    return (main_num, sub_num, subsub_num)

@generateReport_bp.route('/generateReport', methods=['POST'])
def generateReport():
    station_id = (request.form.get('station-id') or request.form.get('station_id') or '').strip()
    division = (request.form.get('division') or '').strip()
    zone = (request.form.get('zone') or '').strip()
    section_name = (request.form.get('section-name') or request.form.get('section_name') or '').strip()

    if not station_id:
        return jsonify({'success': False, 'message': 'Missing necessary POST data'}), 400

    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True, buffered=True)

        # Fetch station details
        if zone and division and section_name:
            cursor.execute(
                """SELECT id, station_id, station_name, railway_zone, division, section_name, initial_date, updated_date
                   FROM station
                   WHERE station_id = %s AND railway_zone = %s AND division = %s AND section_name = %s""",
                (station_id, zone, division, section_name)
            )
            station_details = cursor.fetchone()
        else:
            station_details = None

        if not station_details:
            cursor.execute(
                """SELECT id, station_id, station_name, railway_zone, division, section_name, initial_date, updated_date
                   FROM station
                   WHERE station_id = %s OR station_name = %s LIMIT 1""",
                (station_id, station_id)
            )
            station_details = cursor.fetchone()

        if not station_details:
            return jsonify({'success': False, 'message': 'Station details not found.'}), 404

        # Pre-fetch all images for this station
        images_map = {}
        cursor.execute("SELECT s_no, entity_type, image_path FROM images WHERE station_id = %s", (station_id,))
        for img in cursor.fetchall():
            ent = img['entity_type']
            sno = img['s_no']
            if ent not in images_map:
                images_map[ent] = {}
            if sno not in images_map[ent]:
                images_map[ent][sno] = []
            images_map[ent][sno].append(img['image_path'])

        host = request.host
        scheme = request.scheme
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

        observations = []

        for table_name, config in TABLE_MAP.items():
            sec_id = config['id']
            img_entity = config['img_entity']
            sec_images = images_map.get(img_entity, {})

            if sec_id == '13_0' and not sec_images:
                sec_images = images_map.get('rfid_tags', {})

            extra_col = ", barcode_kavach_main_unit" if table_name == 'verification_of_equipment_serial_numbers' else ""
            sql = f"SELECT S_no, observation_text, requirement_text, remarks, observation_status, '{sec_id}' as section_id {extra_col} FROM {table_name} WHERE station_id = %s"

            try:
                cursor.execute(sql, (station_id,))
                table_obs = cursor.fetchall()

                for obs in table_obs:
                    sno = obs['S_no']
                    raw_imgs = sec_images.get(sno, [])
                    valid_imgs = []
                    for ip in raw_imgs:
                        ip_clean = ip.lstrip('/\\')
                        local_full = os.path.join(base_dir, ip_clean)
                        if os.path.exists(local_full) or ip.startswith('uploads/'):
                            valid_imgs.append(f"{scheme}://{host}/{ip_clean}")

                    obs['images'] = valid_imgs
                    observations.append(obs)
            except Exception:
                continue

        # Filter out 13.2 if needed, and sort
        observations = [obs for obs in observations if obs['S_no'] != '13.2']
        observations.sort(key=sort_sno_key)

        return jsonify({
            'success': True,
            'stationDetails': station_details,
            'observations': observations
        })
    except Exception as e:
        return jsonify({'success': False, 'message': f'Database error: {e}'}), 500
    finally:
        if conn and conn.is_connected():
            conn.close()
