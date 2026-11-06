import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import json
from flask import Blueprint, request, jsonify
from db import get_connection

updateObservations_bp = Blueprint('updateObservations', __name__)

TABLE_NAMES = [
    "verification_of_equipment_serial_numbers", "tower", "rtu", "rf_antennas",
    "installation_of_kavach_equipment", "networking_rack", "ips", "dc_convertor",
    "pdu", "smocip", "outdoor_cabling", "relay_rack", "riu",
    "laying_of_sectional_ofc_cable", "gps_gsm_antenna", "rfid_tags", "tag_to_tag_distance"
]

@updateObservations_bp.route('/updateObservations', methods=['POST'])
def updateObservations():
    section_index_raw = request.form.get('section_index')
    section_id_raw = request.form.get('section-id') or request.form.get('section_id') or ''
    
    sec_idx = None
    if section_index_raw is not None:
        try:
            sec_idx = int(section_index_raw)
        except ValueError:
            pass

    if sec_idx is None and section_id_raw:
        try:
            raw_clean = str(section_id_raw).replace('_0', '').replace('.0', '').split('_')[0].split('.')[0]
            # Sections 2.0 through 18.0 map to 0 through 16:
            sec_idx = int(raw_clean) - 2
        except (ValueError, TypeError):
            pass

    if sec_idx is None or sec_idx < 0 or sec_idx >= len(TABLE_NAMES):
        return jsonify({'success': False, 'message': 'Invalid or missing section index.'})

    table_name = TABLE_NAMES[sec_idx]

    station_id = (request.form.get('station-id') or request.form.get('station_id') or '').strip()
    section_id = (request.form.get('section-id') or request.form.get('section_id') or '').strip()
    observations_json = request.form.get('observations') or ''

    if not station_id or not observations_json:
        return jsonify({'success': False, 'message': 'Missing required data.'})

    try:
        observations = json.loads(observations_json) if isinstance(observations_json, str) else observations_json
    except Exception as e:
        return jsonify({'success': False, 'message': f'Invalid observations format: {e}'})

    if not isinstance(observations, list):
        return jsonify({'success': False, 'message': 'Observations must be a list.'})

    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True, buffered=True)

        # Check row_key column support in table and images
        has_row_key_table = False
        try:
            cursor.execute(f"SHOW COLUMNS FROM {table_name} LIKE 'row_key'")
            if cursor.fetchone():
                has_row_key_table = True
            elif table_name == 'verification_of_equipment_serial_numbers':
                cursor.execute(f"ALTER TABLE {table_name} ADD COLUMN row_key VARCHAR(100) DEFAULT NULL, ADD INDEX idx_station_rowkey (station_id, row_key)")
                has_row_key_table = True
        except Exception:
            has_row_key_table = False

        has_row_key_images = False
        try:
            cursor.execute("SHOW COLUMNS FROM images LIKE 'row_key'")
            if cursor.fetchone():
                has_row_key_images = True
            else:
                cursor.execute("ALTER TABLE images ADD COLUMN row_key VARCHAR(100) DEFAULT NULL, ADD INDEX idx_station_rowkey (station_id, row_key)")
                has_row_key_images = True
        except Exception:
            has_row_key_images = False

        has_atr_col = False
        if table_name == 'verification_of_equipment_serial_numbers':
            try:
                cursor.execute(f"SHOW COLUMNS FROM {table_name} LIKE 'atr_serial'")
                if cursor.fetchone():
                    has_atr_col = True
                else:
                    cursor.execute(f"ALTER TABLE {table_name} ADD COLUMN atr_serial VARCHAR(255) NULL")
                    has_atr_col = True
            except Exception:
                has_atr_col = False

        for obs in observations:
            s_no = str(obs.get('S_no') or obs.get('sno') or '').strip()
            row_key = (obs.get('row_key') or '').strip() or None
            remarks = obs.get('remarks') or ''
            status = obs.get('observation_status') or obs.get('status') or ''
            requirement_text = obs.get('requirement_text') or ''
            observation_text = obs.get('observation_text') or ''
            barcode = (obs.get('barcode_kavach_main_unit') or obs.get('barcode') or '').strip()
            atr_serial = (obs.get('atr_serial') or barcode).strip()
            image_paths = obs.get('image_paths') or []

            # Check if record exists
            if table_name == 'verification_of_equipment_serial_numbers' and row_key and has_row_key_table:
                cursor.execute(
                    f"SELECT id FROM {table_name} WHERE station_id = %s AND (row_key = %s OR (S_no = %s AND (row_key IS NULL OR row_key = '')))",
                    (station_id, row_key, s_no)
                )
            else:
                cursor.execute(
                    f"SELECT id FROM {table_name} WHERE station_id = %s AND S_no = %s",
                    (station_id, s_no)
                )

            existing = cursor.fetchone()

            if existing:
                if table_name == 'verification_of_equipment_serial_numbers':
                    if row_key and has_row_key_table:
                        if has_atr_col:
                            sql = f"""UPDATE {table_name} SET 
                                observation_status = %s, remarks = %s, observation_text = %s, 
                                barcode_kavach_main_unit = %s, atr_serial = %s, row_key = %s, updated_at = NOW() 
                                WHERE station_id = %s AND (row_key = %s OR (S_no = %s AND (row_key IS NULL OR row_key = '')))"""
                            cursor.execute(sql, (status, remarks, observation_text, barcode, atr_serial, row_key, station_id, row_key, s_no))
                        else:
                            sql = f"""UPDATE {table_name} SET 
                                observation_status = %s, remarks = %s, observation_text = %s, 
                                barcode_kavach_main_unit = %s, row_key = %s, updated_at = NOW() 
                                WHERE station_id = %s AND (row_key = %s OR (S_no = %s AND (row_key IS NULL OR row_key = '')))"""
                            cursor.execute(sql, (status, remarks, observation_text, barcode, row_key, station_id, row_key, s_no))
                    else:
                        if has_atr_col:
                            sql = f"""UPDATE {table_name} SET 
                                observation_status = %s, remarks = %s, observation_text = %s, 
                                barcode_kavach_main_unit = %s, atr_serial = %s, updated_at = NOW() 
                                WHERE station_id = %s AND S_no = %s"""
                            cursor.execute(sql, (status, remarks, observation_text, barcode, atr_serial, station_id, s_no))
                        else:
                            sql = f"""UPDATE {table_name} SET 
                                observation_status = %s, remarks = %s, observation_text = %s, 
                                barcode_kavach_main_unit = %s, updated_at = NOW() 
                                WHERE station_id = %s AND S_no = %s"""
                            cursor.execute(sql, (status, remarks, observation_text, barcode, station_id, s_no))
                else:
                    sql = f"""UPDATE {table_name} SET 
                        observation_status = %s, remarks = %s, observation_text = %s, updated_at = NOW() 
                        WHERE station_id = %s AND S_no = %s"""
                    cursor.execute(sql, (status, remarks, observation_text, station_id, s_no))
            else:
                if table_name == 'verification_of_equipment_serial_numbers':
                    if row_key and has_row_key_table:
                        if has_atr_col:
                            sql = f"""INSERT INTO {table_name} 
                                (station_id, S_no, observation_text, requirement_text, observation_status, remarks, barcode_kavach_main_unit, atr_serial, row_key, created_at, updated_at) 
                                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())"""
                            cursor.execute(sql, (station_id, s_no, observation_text, requirement_text, status, remarks, barcode, atr_serial, row_key))
                        else:
                            sql = f"""INSERT INTO {table_name} 
                                (station_id, S_no, observation_text, requirement_text, observation_status, remarks, barcode_kavach_main_unit, row_key, created_at, updated_at) 
                                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())"""
                            cursor.execute(sql, (station_id, s_no, observation_text, requirement_text, status, remarks, barcode, row_key))
                    else:
                        if has_atr_col:
                            sql = f"""INSERT INTO {table_name} 
                                (station_id, S_no, observation_text, requirement_text, observation_status, remarks, barcode_kavach_main_unit, atr_serial, created_at, updated_at) 
                                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())"""
                            cursor.execute(sql, (station_id, s_no, observation_text, requirement_text, status, remarks, barcode, atr_serial))
                        else:
                            sql = f"""INSERT INTO {table_name} 
                                (station_id, S_no, observation_text, requirement_text, observation_status, remarks, barcode_kavach_main_unit, created_at, updated_at) 
                                VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW())"""
                            cursor.execute(sql, (station_id, s_no, observation_text, requirement_text, status, remarks, barcode))
                else:
                    sql = f"""INSERT INTO {table_name} 
                        (station_id, S_no, observation_text, requirement_text, observation_status, remarks, created_at, updated_at) 
                        VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())"""
                    cursor.execute(sql, (station_id, s_no, observation_text, requirement_text, status, remarks))

            # Handle images sync for this observation
            if image_paths is not None:
                cursor.execute("DELETE FROM images WHERE station_id = %s AND s_no = %s AND entity_type = %s", (station_id, s_no, table_name))
                for img_path in image_paths:
                    if not img_path:
                        continue
                    if has_row_key_images and row_key:
                        cursor.execute(
                            "INSERT INTO images (entity_type, station_id, s_no, image_path, row_key, created_at) VALUES (%s, %s, %s, %s, %s, NOW())",
                            (table_name, station_id, s_no, img_path, row_key)
                        )
                    else:
                        cursor.execute(
                            "INSERT INTO images (entity_type, station_id, s_no, image_path, created_at) VALUES (%s, %s, %s, %s, NOW())",
                            (table_name, station_id, s_no, img_path)
                        )

        # Update station updated_date
        cursor.execute("UPDATE station SET updated_date = NOW() WHERE station_id = %s", (station_id,))
        cursor.close()

        return jsonify({'success': True, 'message': 'Observations and station info updated successfully.'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error updating observations: {e}'})
    finally:
        if conn and conn.is_connected():
            conn.close()
