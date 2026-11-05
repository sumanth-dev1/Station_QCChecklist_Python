import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from flask import Blueprint, request, jsonify
from db import get_connection

manage_row_templates_bp = Blueprint('manage_row_templates', __name__)

@manage_row_templates_bp.route('/manage_row_templates', methods=['POST', 'GET'])
def manage_row_templates():
    action = request.form.get('action') or request.args.get('action') or ''

    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True, buffered=True)

        # Ensure table exists with station_id and user_id columns
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS row_templates (
                id INT AUTO_INCREMENT PRIMARY KEY,
                section_id VARCHAR(50) NOT NULL,
                s_no VARCHAR(50) NOT NULL,
                description TEXT NOT NULL,
                station_id VARCHAR(50) DEFAULT NULL,
                user_id VARCHAR(50) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Ensure station_id and user_id columns exist if table already existed without them
        try:
            cursor.execute("ALTER TABLE row_templates ADD COLUMN station_id VARCHAR(50) DEFAULT NULL")
        except Exception:
            pass
        try:
            cursor.execute("ALTER TABLE row_templates ADD COLUMN user_id VARCHAR(50) DEFAULT NULL")
        except Exception:
            pass

        if action == 'fetch':
            section_id = (request.form.get('section_id') or request.args.get('section_id') or '').strip()
            station_id = (request.form.get('station_id') or request.args.get('station_id') or '').strip()
            user_id = (request.form.get('user_id') or request.args.get('user_id') or '').strip()

            if station_id:
                # Fetch global templates (station_id IS NULL) PLUS custom rows added for this specific station
                cursor.execute("""
                    SELECT * FROM row_templates 
                    WHERE section_id = %s 
                      AND (station_id IS NULL OR station_id = '' OR station_id = %s)
                    ORDER BY id ASC
                """, (section_id, station_id))
            else:
                cursor.execute("""
                    SELECT * FROM row_templates 
                    WHERE section_id = %s AND (station_id IS NULL OR station_id = '')
                    ORDER BY id ASC
                """, (section_id,))
                
            rows = cursor.fetchall()
            return jsonify({"success": True, "data": rows})

        elif action == 'add':
            section_id = (request.form.get('section_id') or '').strip()
            s_no = (request.form.get('s_no') or '').strip()
            description = (request.form.get('description') or '').strip()
            station_id = (request.form.get('station_id') or '').strip()
            user_id = (request.form.get('user_id') or '').strip()

            if not section_id or not s_no or not description:
                return jsonify({"success": False, "message": "Missing required fields"})

            cursor.execute("""
                INSERT INTO row_templates (section_id, s_no, description, station_id, user_id) 
                VALUES (%s, %s, %s, %s, %s)
            """, (section_id, s_no, description, station_id or None, user_id or None))
            return jsonify({"success": True, "id": cursor.lastrowid})

        elif action == 'delete':
            s_no = (request.form.get('s_no') or '').strip()
            section_id = (request.form.get('section_id') or '').strip()
            station_id = (request.form.get('station_id') or '').strip()
            
            if station_id:
                cursor.execute("DELETE FROM row_templates WHERE section_id = %s AND s_no = %s AND (station_id = %s OR station_id IS NULL)", (section_id, s_no, station_id))
            else:
                cursor.execute("DELETE FROM row_templates WHERE section_id = %s AND s_no = %s", (section_id, s_no))
            return jsonify({"success": True, "message": "Row template deleted successfully."})

        return jsonify({"success": False, "message": f"Unknown action: {action}"})

    except Exception as e:
        return jsonify({"success": False, "message": f"Database error: {e}"})
    finally:
        if conn and conn.is_connected():
            conn.close()
