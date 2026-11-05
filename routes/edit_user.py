import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from flask import Blueprint, request, render_template_string
from db import get_connection

edit_user_bp = Blueprint('edit_user', __name__)

EDIT_USER_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Password</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { width: 50%; margin: 50px auto; background-color: #ffffff; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); border-radius: 8px; }
        .heading { text-align: center; color: #333333; margin-bottom: 20px; font-size: 24px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; font-weight: bold; margin-bottom: 5px; color: #333333; }
        input[type="password"] { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        .submit-btn { width: 100%; background-color: #4CAF50; color: white; padding: 10px; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; }
        .submit-btn:hover { background-color: #45a049; }
        .message { text-align: center; font-size: 16px; margin-bottom: 15px; }
        .error { color: red; }
        .success { color: green; }
        .button-group { display: flex; justify-content: space-between; margin-top: 15px; }
        .nav-btn { background-color: #008CBA; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; }
        .nav-btn:hover { background-color: #007B9E; }
    </style>
</head>
<body>
    <div class="container">
        <h2 class="heading">Edit Password</h2>
        {% if error %}<div class="message error">{{ error }}</div>{% endif %}
        {% if success %}<div class="message success">{{ success }}</div>{% endif %}
        <form method="POST">
            <div class="form-group">
                <label for="new_password">New Password:</label>
                <input type="password" id="new_password" name="new_password" required>
            </div>
            <div class="form-group">
                <label for="confirm_password">Confirm New Password:</label>
                <input type="password" id="confirm_password" name="confirm_password" required>
            </div>
            <button type="submit" class="submit-btn">Update Password</button>
        </form>

        <div class="button-group">
            <button class="nav-btn" onclick="window.location.href='login.html'">Go to Login</button>
            <button class="nav-btn" onclick="window.location.href='view_users'">Back to User List</button>
        </div>
    </div>
</body>
</html>
"""

@edit_user_bp.route('/edit_user', methods=['GET', 'POST'])
def edit_user():
    user_id = request.args.get('id')
    error = None
    success = None

    if request.method == 'POST':
        new_password = request.form.get('new_password', '')
        confirm_password = request.form.get('confirm_password', '')

        if new_password != confirm_password:
            error = "Passwords do not match."
        else:
            conn = None
            try:
                conn = get_connection()
                cursor = conn.cursor()
                cursor.execute("UPDATE loginpage SET password = %s WHERE id = %s", (new_password, user_id))
                cursor.close()
                conn.close()
                success = "Password updated successfully."
            except Exception as e:
                error = f"Error updating password: {e}"

    return render_template_string(EDIT_USER_HTML, error=error, success=success)
