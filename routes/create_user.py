import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import re
from flask import Blueprint, request
from db import get_connection

create_user_bp = Blueprint('create_user', __name__)

@create_user_bp.route('/create_user', methods=['GET', 'POST'])
def create_user():
    if request.method == 'POST':
        employee_name = (request.form.get('employee_name') or '').strip()
        phone_number = (request.form.get('phone_number') or '').strip()
        username = (request.form.get('username') or '').strip()
        password = (request.form.get('password') or '').strip()

        errors = []
        if len(employee_name) < 3 or len(employee_name) > 50:
            errors.append("Employee Name must be between 3 and 50 characters.")
        if not re.match(r"^\d{10}$", phone_number):
            errors.append("Phone Number must contain exactly 10 digits.")
        if not username:
            errors.append("Username is required.")
        if not password:
            errors.append("Password is required.")

        if errors:
            err_html = "<h3>Errors:</h3><ul>"
            for err in errors:
                err_html += f"<li>{err}</li>"
            err_html += "</ul>"
            return err_html

        conn = None
        try:
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO loginpage (employee_name, phone_number, username, password) VALUES (%s, %s, %s, %s)",
                (employee_name, phone_number, username, password)
            )
            cursor.close()
            conn.close()
            return "<h3>Account created successfully!</h3><p><a href='login.html'>Click here to login</a></p>"
        except Exception as e:
            return f"Error: {e}"
    return ""
