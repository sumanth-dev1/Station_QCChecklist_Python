import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import uuid
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

upload_bp = Blueprint('upload', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/upload', methods=['POST'])
def upload():
    uploads_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'uploads'))
    os.makedirs(uploads_dir, exist_ok=True)

    uploaded_files = []

    files = request.files.getlist('images') or request.files.getlist('images[]') or request.files.getlist('file')
    if not files:
        # Check if individual files exist
        for key in request.files:
            files.extend(request.files.getlist(key))

    for file in files:
        if file and file.filename != '':
            ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else 'jpg'
            if ext in ALLOWED_EXTENSIONS:
                unique_name = f"img_{uuid.uuid4().hex[:16]}.{ext}"
                save_path = os.path.join(uploads_dir, unique_name)
                file.save(save_path)
                uploaded_files.append(f"uploads/{unique_name}")

    if uploaded_files:
        return jsonify({"success": True, "file_paths": uploaded_files})
    else:
        return jsonify({"success": False, "message": "No valid images uploaded."})
