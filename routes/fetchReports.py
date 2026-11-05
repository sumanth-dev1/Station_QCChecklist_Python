import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from flask import Blueprint, request, jsonify
from db import get_connection

fetchReports_bp = Blueprint('fetchReports', __name__)

@fetchReports_bp.route('/fetchReports', methods=['GET'])
def fetchReports():
    username = (request.args.get('user_id') or request.args.get('username') or '').strip()
    if not username:
        return jsonify({'success': False, 'message': 'Missing or invalid username.'})

    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True, buffered=True)

        cursor.execute("SELECT role FROM loginpage WHERE username = %s", (username,))
        user = cursor.fetchone()

        role = user['role'] if user else 'user'

        if role == 'admin':
            cursor.execute("SELECT * FROM report ORDER BY upload_date DESC")
        else:
            cursor.execute("SELECT * FROM report WHERE user_id = %s ORDER BY upload_date DESC", (username,))

        reports = cursor.fetchall()
        cursor.close()

        for r in reports:
            if 'upload_date' in r and r['upload_date']:
                r['upload_date'] = str(r['upload_date'])

        return jsonify({'success': True, 'reports': reports})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Database error: {e}'})
    finally:
        if conn and conn.is_connected():
            conn.close()
