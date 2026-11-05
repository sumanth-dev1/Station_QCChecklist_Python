import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from flask import Blueprint, request, jsonify, Response
import requests

wfms_proxy_bp = Blueprint('wfms_proxy', __name__)

WFMS_BASE_URL = "https://eg.hbl.in:5100/api"

@wfms_proxy_bp.route('/wfms_proxy', methods=['POST'])
def wfms_proxy():
    action = request.form.get('action') or ''

    if action == 'login':
        user = request.form.get('user', '')
        password = request.form.get('pass', '')

        try:
            resp = requests.post(
                f"{WFMS_BASE_URL}/login",
                json={"username": user, "password": password},
                headers={"Content-Type": "application/json", "x-app-module": "WFMS2"},
                timeout=30,
                verify=False
            )
            return Response(resp.content, status=resp.status_code, mimetype='application/json')
        except Exception as e:
            return jsonify({'status': False, 'message': f'Login Connection Error: {e}'})

    elif action == 'get_all_stations':
        token = request.form.get('token', '')

        try:
            resp = requests.get(
                f"{WFMS_BASE_URL}/stations",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                    "x-app-module": "WFMS2"
                },
                timeout=30,
                verify=False
            )
            return Response(resp.content, status=resp.status_code, mimetype='application/json')
        except Exception as e:
            return jsonify({'status': False, 'message': f'Error fetching stations: {e}'})

    return jsonify({'status': False, 'message': f'Unknown action: {action}'})
