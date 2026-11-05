import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from flask import Blueprint, request, jsonify, session
from db import get_connection

login_bp = Blueprint('login', __name__)

@login_bp.route('/login', methods=['POST'])
def login():
    try:
        username = (request.form.get('username') or '').strip()
        password = (request.form.get('password') or '').strip()

        if not username or not password:
            return jsonify({'success': False, 'message': 'Username and password are required!'})

        conn = get_connection()
        cursor = conn.cursor(dictionary=True, buffered=True)
        cursor.execute("SELECT username, employee_name, password, role FROM loginpage WHERE username = %s", (username,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user and password == user['password']:
            session['user_id'] = user['username']
            session['username'] = user['username']
            session['employee_name'] = user['employee_name']
            session['role'] = user['role']

            return jsonify({
                'success': True,
                'message': 'Login successful!',
                'user_id': session['user_id'],
                'role': session['role'],
                'employee_name': user['employee_name']
            })
        else:
            return jsonify({'success': False, 'message': 'Invalid username or password.'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Database error: {e}'})
