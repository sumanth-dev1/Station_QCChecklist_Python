import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from db import get_connection

uploadReport_bp = Blueprint('uploadReport', __name__)

@uploadReport_bp.route('/uploadReport', methods=['POST'])
def uploadReport():
    user_id = request.form.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'message': 'Missing user_id. Report cannot be uploaded.'})

    file = request.files.get('file')
    if not file or file.filename == '':
        return jsonify({'success': False, 'message': 'No file uploaded.'})

    upload_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'uploads', 'reports'))
    os.makedirs(upload_dir, exist_ok=True)

    file_name = file.filename
    dest_path = os.path.join(upload_dir, file_name)
    file.save(dest_path)

    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(buffered=True)
        cursor.execute("INSERT INTO report (user_id, file_name, upload_date) VALUES (%s, %s, NOW())", (user_id, file_name))
        cursor.close()
        return jsonify({'success': True, 'message': 'File uploaded and report saved to database.'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error inserting report: {e}'})
    finally:
        if conn and conn.is_connected():
            conn.close()
