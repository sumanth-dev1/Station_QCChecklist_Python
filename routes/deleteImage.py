import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from flask import Blueprint, request, jsonify
from db import get_connection

deleteImage_bp = Blueprint('deleteImage', __name__)

@deleteImage_bp.route('/deleteImage', methods=['POST'])
def deleteImage():
    data = request.get_json(silent=True) or request.form
    station_id = data.get('station_id') or data.get('station-id')
    s_no = data.get('s_no') or data.get('sno')
    img_path = data.get('imgPath') or data.get('image_path')

    if not station_id or not s_no or not img_path:
        return jsonify({'success': False, 'message': 'Missing parameters'})

    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(buffered=True)

        cursor.execute("DELETE FROM images WHERE station_id = %s AND s_no = %s AND image_path = %s", (station_id, s_no, img_path))
        rows_affected = cursor.rowcount
        cursor.close()

        # Delete from disk if exists
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        full_path = os.path.join(base_dir, img_path.lstrip('/\\'))
        if os.path.exists(full_path):
            try:
                os.remove(full_path)
            except Exception:
                pass

        if rows_affected > 0:
            return jsonify({'success': True, 'message': 'Image deleted successfully.'})
        else:
            return jsonify({'success': True, 'message': 'Image record updated.'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error deleting image: {e}'})
    finally:
        if conn and conn.is_connected():
            conn.close()
