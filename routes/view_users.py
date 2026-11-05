import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from flask import Blueprint, render_template_string
from db import get_connection

view_users_bp = Blueprint('view_users', __name__)

VIEW_USERS_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Details</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { width: 80%; margin: 50px auto; background-color: #ffffff; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); border-radius: 8px; }
        .heading { text-align: center; color: #333333; margin-bottom: 20px; font-size: 24px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 12px; text-align: left; border: 1px solid #ddd; }
        th { background-color: #4CAF50; color: white; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        tr:hover { background-color: #f1f1f1; }
        .no-records { text-align: center; font-size: 18px; color: #888888; }
        .back-btn, .edit-btn { display: inline-block; padding: 10px 20px; font-size: 14px; text-align: center; border-radius: 4px; text-decoration: none; cursor: pointer; }
        .back-btn { background-color: #008CBA; color: white; margin-top: 10px; }
        .back-btn:hover { background-color: #007B9E; }
        .edit-btn { background-color: #4CAF50; color: white; padding: 6px 12px; }
        .edit-btn:hover { background-color: #45a049; }
    </style>
</head>
<body>
    <div class="container">
        <h2 class="heading">User Details</h2>
        {% if users %}
            <table>
                <tr><th>ID</th><th>Employee Name</th><th>Phone Number</th><th>Username</th><th>Action</th></tr>
                {% for row in users %}
                    <tr>
                        <td>{{ row.id }}</td>
                        <td>{{ row.employee_name }}</td>
                        <td>{{ row.phone_number }}</td>
                        <td>{{ row.username }}</td>
                        <td><a class='edit-btn' href='edit_user?id={{ row.id }}'>Edit</a></td>
                    </tr>
                {% endfor %}
            </table>
        {% else %}
            <div class='no-records'>No users found.</div>
        {% endif %}
        <a class="back-btn" href="create_user.html">Back</a>
    </div>
</body>
</html>
"""

@view_users_bp.route('/view_users', methods=['GET', 'POST'])
def view_users():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True, buffered=True)
        cursor.execute("SELECT id, employee_name, phone_number, username FROM loginpage")
        users = cursor.fetchall()
        cursor.close()
        conn.close()
        return render_template_string(VIEW_USERS_HTML, users=users)
    except Exception as e:
        return f"Error: {e}"
