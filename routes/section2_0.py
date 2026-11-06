import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import json, html
from flask import Blueprint, request, jsonify
from db import get_connection

section2_0_bp = Blueprint('section2_0', __name__)

@section2_0_bp.route('/section2_0', methods=['POST'])
def section2_0():
    station_id = request.form.get('station-id')
    section_id = request.form.get('section-id')
    observations_raw = request.form.get('observations')

    if not station_id or not observations_raw:
        return jsonify({'success': False, 'message': 'Missing necessary POST data'})

    try:
        observations = json.loads(observations_raw)
    except Exception:
        return jsonify({'success': False, 'message': 'Error: Invalid JSON format for observations.'})

    if not observations or not isinstance(observations, list):
        return jsonify({'success': False, 'message': 'Error: No observations to save.'})

    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True, buffered=True)

        try:
            cursor.execute("ALTER TABLE `verification_of_equipment_serial_numbers` ADD COLUMN `atr_serial` VARCHAR(255) NULL")
        except Exception:
            pass
        cursor.execute("SHOW COLUMNS FROM `verification_of_equipment_serial_numbers` LIKE 'atr_serial'")
        has_atr_col = bool(cursor.fetchone())

        for obs in observations:
            s_no = html.escape(str(obs.get('S_no') or obs.get('sno') or ''))
            obs_text = str(obs.get('observation_text') or '')
            req_text = str(obs.get('requirement_text') or '')
            remarks = html.escape(str(obs.get('remarks') or ''))
            status = html.escape(str(obs.get('observation_status') or obs.get('status') or ''))
            barcode = html.escape(str(obs.get('barcode_kavach_main_unit') or obs.get('barcode') or ''))
            atr_serial = html.escape(str(obs.get('atr_serial') or barcode or ''))

            # Check if row exists
            cursor.execute('SELECT id FROM verification_of_equipment_serial_numbers WHERE station_id = %s AND S_no = %s', (station_id, s_no))
            existing = cursor.fetchone()

            if existing:
                if has_atr_col:
                    cursor.execute(
                        'UPDATE verification_of_equipment_serial_numbers SET observation_text = %s, requirement_text = %s, remarks = %s, observation_status = %s, barcode_kavach_main_unit = %s, atr_serial = %s, updated_at = NOW() WHERE station_id = %s AND S_no = %s',
                        (obs_text, req_text, remarks, status, barcode, atr_serial, station_id, s_no)
                    )
                else:
                    cursor.execute(
                        'UPDATE verification_of_equipment_serial_numbers SET observation_text = %s, requirement_text = %s, remarks = %s, observation_status = %s, barcode_kavach_main_unit = %s, updated_at = NOW() WHERE station_id = %s AND S_no = %s',
                        (obs_text, req_text, remarks, status, barcode, station_id, s_no)
                    )
            else:
                if has_atr_col:
                    cursor.execute(
                        'INSERT INTO verification_of_equipment_serial_numbers (station_id, S_no, observation_text, requirement_text, remarks, observation_status, barcode_kavach_main_unit, atr_serial, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())',
                        (station_id, s_no, obs_text, req_text, remarks, status, barcode, atr_serial)
                    )
                else:
                    cursor.execute(
                        'INSERT INTO verification_of_equipment_serial_numbers (station_id, S_no, observation_text, requirement_text, remarks, observation_status, barcode_kavach_main_unit, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW())',
                        (station_id, s_no, obs_text, req_text, remarks, status, barcode)
                    )

        cursor.execute('UPDATE station SET updated_date = NOW() WHERE station_id = %s', (station_id,))
        cursor.close()
        return jsonify({'success': True, 'message': 'Observations saved successfully.'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error saving observations: {e}'})
    finally:
        if conn and conn.is_connected():
            conn.close()
