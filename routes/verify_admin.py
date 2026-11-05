import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from flask import Blueprint, request, redirect

verify_admin_bp = Blueprint('verify_admin', __name__)

@verify_admin_bp.route('/verify_admin', methods=['POST'])
def verify_admin():
    admin_password = 'hbl@123'
    entered_password = request.form.get('admin_password', '')

    if entered_password == admin_password:
        return redirect('/create_user.html')
    else:
        return ("<script>"
                "alert('Invalid admin password! Please try again.');"
                "window.location.href = 'account.html';"
                "</script>")
