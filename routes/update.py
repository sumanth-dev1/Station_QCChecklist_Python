import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from flask import Blueprint, request, Response
from db import get_connection

update_bp = Blueprint('update', __name__)

@update_bp.route('/update', methods=['POST'])
def update():
    data = request.get_json(silent=True) or {}
    station_id = data.get('station_id')
    rows = data.get('rows')

    if station_id is None or rows is None:
        return Response("error: missing data", mimetype="text/plain")

    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True, buffered=True)

        has_row_key = False
        try:
            cursor.execute("SHOW COLUMNS FROM verification_of_equipment_serial_numbers LIKE 'row_key'")
            if cursor.fetchone():
                has_row_key = True
            else:
                cursor.execute("ALTER TABLE verification_of_equipment_serial_numbers ADD COLUMN row_key VARCHAR(100) DEFAULT NULL, ADD INDEX idx_station_rowkey (station_id, row_key)")
                has_row_key = True
        except Exception:
            has_row_key = False

        for row in rows:
            row_key = (row.get('row_key') or '').strip()
            sno = (row.get('sno') or row.get('S_no') or '').strip()
            barcode = (row.get('barcode') or '').strip()
            status = (row.get('status') or '').strip()
            remarks = (row.get('remarks') or '').strip()
            obs_text = (row.get('observation_text') or '').strip()

            if not row_key and not sno:
                continue

            if has_row_key and row_key:
                check_sql = "SELECT id FROM verification_of_equipment_serial_numbers WHERE station_id = %s AND (row_key = %s OR (S_no = %s AND (row_key IS NULL OR row_key = '')))"
                cursor.execute(check_sql, (station_id, row_key, sno))
            else:
                check_sql = "SELECT id FROM verification_of_equipment_serial_numbers WHERE station_id = %s AND S_no = %s"
                cursor.execute(check_sql, (station_id, sno))

            existing = cursor.fetchone()

            if existing:
                if has_row_key and row_key:
                    update_sql = """
                        UPDATE verification_of_equipment_serial_numbers SET 
                        S_no = %s, barcode_kavach_main_unit = %s, observation_status = %s, 
                        remarks = %s, observation_text = %s, row_key = %s, updated_at = NOW() 
                        WHERE station_id = %s AND (row_key = %s OR (S_no = %s AND (row_key IS NULL OR row_key = '')))
                    """
                    cursor.execute(update_sql, (sno, barcode, status, remarks, obs_text, row_key, station_id, row_key, sno))
                else:
                    update_sql = """
                        UPDATE verification_of_equipment_serial_numbers SET 
                        barcode_kavach_main_unit = %s, observation_status = %s, 
                        remarks = %s, observation_text = %s, updated_at = NOW() 
                        WHERE station_id = %s AND S_no = %s
                    """
                    cursor.execute(update_sql, (barcode, status, remarks, obs_text, station_id, sno))
            else:
                if has_row_key and row_key:
                    insert_sql = """
                        INSERT INTO verification_of_equipment_serial_numbers 
                        (station_id, row_key, S_no, barcode_kavach_main_unit, observation_status, remarks, observation_text, created_at, updated_at) 
                        VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
                    """
                    cursor.execute(insert_sql, (station_id, row_key, sno, barcode, status, remarks, obs_text))
                else:
                    insert_sql = """
                        INSERT INTO verification_of_equipment_serial_numbers 
                        (station_id, S_no, barcode_kavach_main_unit, observation_status, remarks, observation_text, created_at, updated_at) 
                        VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())
                    """
                    cursor.execute(insert_sql, (station_id, sno, barcode, status, remarks, obs_text))

        cursor.execute("UPDATE station SET updated_date = NOW() WHERE station_id = %s", (station_id,))
        cursor.close()
        return Response("success", mimetype="text/plain")
    except Exception as e:
        return Response(f"error: {e}", mimetype="text/plain")
    finally:
        if conn and conn.is_connected():
            conn.close()
