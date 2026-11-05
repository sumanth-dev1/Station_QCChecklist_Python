import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import re
from flask import Blueprint, session, render_template_string, request
from db import get_connection

viewReports_bp = Blueprint('viewReports', __name__)

VIEW_REPORTS_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reports - HBL Engineering Ltd.</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 0; padding: 0; }
    h1, h2 { text-align: center; margin: 0; }
    .container { padding: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    table, th, td { border: 1px solid #ddd; }
    th, td { padding: 10px; text-align: left; }
    th { background-color: #00457C; color: white; }
    td a { color: #00457C; text-decoration: none; }
    td a:hover { text-decoration: underline; }
    .btn { padding: 5px 10px; margin: 5px; cursor: pointer; color: white; border: none; border-radius: 5px; display: inline-block; }
    .view-btn { background-color: #17a2b8; }
    .edit-btn { background-color: #ffc107; }
    .download-btn { background-color: #28a745; }
    .upload-btn { background-color: #6f42c1; color: white; border: none; padding: 5px 10px; margin: 5px; cursor: pointer; border-radius: 5px; display: inline-block; }
    .upload-btn:hover { background-color: #5a32a3; }
    .back-btn { background-color: #6c757d; }
    .status-label { padding: 4px 8px; border-radius: 4px; font-weight: bold; }
    .completed { color: green; background-color: #d3ffd3; }
    .not-completed { color: red; background-color: #ffd3d3; }
    .profile { position: absolute; right: 20px; color: white; font-size: 14px; }
    #search-input { padding: 10px; width: 300px; max-width: 100%; box-sizing: border-box; margin-top: 20px; margin-right: 0; }
    
    .wfms-modal {
        display: none;
        position: fixed;
        z-index: 3000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.7);
        justify-content: center;
        align-items: center;
    }
    .wfms-modal-content {
        background-color: #fff;
        padding: 25px;
        border-radius: 8px;
        width: 400px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }
    .wfms-modal-header {
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        margin-bottom: 15px;
        font-size: 1.2rem;
        font-weight: bold;
        color: #3f51b5;
    }
    .wfms-form-group {
        margin-bottom: 15px;
    }
    .wfms-form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 600;
    }
    .wfms-form-group input, .wfms-form-group select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .wfms-btn-row {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 20px;
    }
    .loader {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        animation: spin 2s linear infinite;
        display: inline-block;
        vertical-align: middle;
        margin-right: 8px;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>

<header style="display: flex; align-items: center; justify-content: center; background-color: #00457C; color: white; padding: 20px; position: relative;">
    <img src="hbl_logo.jpg" alt="HBL Engineering Ltd. Logo" style="position: absolute; left: 20px; height: 50px;">
    <div>
      <h1>HBL Engineering Ltd.</h1>
      <h2>Rail Signaling Division</h2>
    </div>
    <div class="profile">User: {{ username }} | Employee: {{ employee_name }}</div>
</header>

<div class="container">
    <a href="index.html" class="btn back-btn">Back to Home</a>

    <div style="text-align: right;">
      <input type="text" id="search-input" placeholder="Search by Station ID...">
    </div>

    <div style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; margin-top: 20px; margin-bottom: 20px;">
      <div></div>
      <h2 style="margin: 0; text-align: center;">Your Uploaded Reports</h2>
      <div style="text-align: left; padding-left: 15px;">
        <button class="btn download-btn" onclick="downloadSummaryReport()" style="padding: 6px 14px; font-weight: bold; font-size: 14px; margin: 0; cursor: pointer;">Summary Report</button>
      </div>
    </div>

    {% if reports %}
        <table id="report-table">
            <thead>
                <tr>
                    <th>Report</th>
                    <th>Upload Date</th>
                    <th>Upload Time</th>
                    {% if role == 'admin' %}<th>User ID</th>{% endif %}
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            {% for report in reports %}
                <tr data-station-id="{{ report.station_id }}" data-report-date="{{ report.report_date }}">
                    <td>{{ report.file_name }}</td>
                    <td>{{ report.upload_date_fmt }}</td>
                    <td>{{ report.upload_time }}</td>
                    {% if role == 'admin' %}<td>{{ report.user_id }}</td>{% endif %}
                    <td>{{ report.status_label | safe }}</td>
                    <td>
                        <a href="uploads/reports/{{ report.file_name }}" class="btn view-btn" target="_blank">View</a>
                        <a href="create.html?station_id={{ report.station_id }}" class="btn edit-btn">Edit</a>
                        <a href="uploads/reports/{{ report.file_name }}" download class="btn download-btn">Download</a>
                        <button class="btn upload-btn" onclick="openWFMSLogin(event, '{{ report.id }}', '{{ report.station_id }}', '{{ report.file_name }}')">Push to WFMS</button>
                    </td>
                </tr>
            {% endfor %}
            </tbody>
        </table>
    {% else %}
        <p>No reports available.</p>
    {% endif %}
</div>

<!-- WFMS Login Modal -->
<div id="wfmsLoginModal" class="wfms-modal">
    <div class="wfms-modal-content">
        <div class="wfms-modal-header">Login to WFMS</div>
        <div class="wfms-form-group">
            <label>Username</label>
            <input type="text" id="wfms_user" placeholder="WFMS Username">
        </div>
        <div class="wfms-form-group">
            <label>Password</label>
            <input type="password" id="wfms_pass" placeholder="WFMS Password">
        </div>
        <div id="login_error" style="color:red; font-size:0.9rem; margin-bottom:10px; display:none;"></div>
        <div class="wfms-btn-row">
            <button class="btn back-btn" onclick="closeWFMSModal('wfmsLoginModal')">Cancel</button>
            <button class="btn upload-btn" id="loginBtn" onclick="doWFMSLogin()">Login & Next</button>
        </div>
    </div>
</div>

<!-- WFMS Station Selection Modal -->
<div id="wfmsStationModal" class="wfms-modal">
    <div class="wfms-modal-content">
        <div class="wfms-modal-header">Select Assigned Station</div>
        <p style="font-size: 0.9rem; color: #666;">Choosing from your WFMS assignments:</p>
        <div class="wfms-form-group">
            <label>Assigned Station</label>
            <select id="wfms_station_select">
                <option value="">Loading assignments...</option>
            </select>
        </div>
        <div id="station_error" style="color:red; font-size:0.9rem; margin-bottom:10px; display:none;"></div>
        <div class="wfms-btn-row">
            <button class="btn back-btn" onclick="closeWFMSModal('wfmsStationModal')">Cancel</button>
            <button class="btn upload-btn" id="pushBtn" onclick="doFinalPush()">Push Report</button>
        </div>
    </div>
</div>

<script>
  let currentReportId = null;
  let currentStationId = null;
  let currentFileName = null;
  let wfmsToken = null;
  let assignedActivities = [];

  function openWFMSLogin(event, reportId, stationId, fileName) {
    if (!navigator.onLine) {
        alert("No internet connection. Please check your connectivity to push to WFMS.");
        return;
    }
    const btn = event ? (event.currentTarget || event.target) : null;
    const tr = btn ? btn.closest('tr') : null;
    currentReportId = reportId || (btn ? btn.getAttribute('data-report-id') : '');
    currentStationId = stationId || (btn ? btn.getAttribute('data-station-id') : '');
    currentFileName = fileName || (tr ? tr.cells[0]?.textContent?.trim() : '');

    if (wfmsToken && assignedActivities && assignedActivities.length > 0) {
        openStationSelection();
    } else {
        document.getElementById('wfmsLoginModal').style.display = 'flex';
    }
  }

  function closeWFMSModal(id) {
    document.getElementById(id).style.display = 'none';
  }

  async function doWFMSLogin() {
    const user = document.getElementById('wfms_user').value;
    const pass = document.getElementById('wfms_pass').value;
    const errorDiv = document.getElementById('login_error');
    const btn = document.getElementById('loginBtn');

    if (!user || !pass) {
        errorDiv.innerText = "Please enter WFMS credentials";
        errorDiv.style.display = 'block';
        return;
    }

    errorDiv.style.display = 'none';
    btn.disabled = true;
    btn.innerHTML = '<span class="loader"></span> Connecting...';

    try {
        const response = await fetch('wfms_proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=login&user=${encodeURIComponent(user)}&pass=${encodeURIComponent(pass)}`
        });
        const result = await response.json();

        if (result.status) {
            wfmsToken = result.data.token;
            closeWFMSModal('wfmsLoginModal');
            openStationSelection();
        } else {
            errorDiv.innerText = result.message || "Invalid WFMS credentials";
            errorDiv.style.display = 'block';
        }
    } catch (e) {
        errorDiv.innerText = "Error connecting to WFMS Server";
        errorDiv.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.innerText = "Login & Next";
    }
  }

  async function openStationSelection() {
    document.getElementById('wfmsStationModal').style.display = 'flex';
    const select = document.getElementById('wfms_station_select');
    select.innerHTML = '<option value="">Loading assignments...</option>';

    try {
        const response = await fetch('wfms_proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=get_all_stations&token=${encodeURIComponent(wfmsToken)}`
        });
        const result = await response.json();

        if (result.status && Array.isArray(result.data)) {
            assignedActivities = result.data;
            const stationMap = new Map();

            result.data.forEach(act => {
                const actName = act.name || '';
                if (actName.toLowerCase().includes('wayside qa audit')) {
                    const stObj = act.station || act.stationId;
                    if (stObj) {
                        const sId = stObj._id || stObj.id || (typeof stObj === 'string' ? stObj : null);
                        const sName = stObj.name || stObj.stationName || stObj.station_name || (typeof stObj === 'string' ? stObj : 'Unknown Station');
                        if (sId && !stationMap.has(sId)) {
                            stationMap.set(sId, sName);
                        }
                    }
                }
            });

            if (stationMap.size === 0) {
                select.innerHTML = '<option value="">No "Wayside QA Audit" assignments found for your account.</option>';
                return;
            }

            select.innerHTML = '<option value="">-- Choose Assigned Station --</option>';
            stationMap.forEach((name, id) => {
                const opt = document.createElement('option');
                opt.value = id;
                opt.textContent = name;
                opt.setAttribute('data-station-name', name);
                select.appendChild(opt);
            });
        } else {
            select.innerHTML = '<option value="">Failed to load stations.</option>';
        }
    } catch (e) {
        select.innerHTML = '<option value="">Connection error.</option>';
    }
  }

  async function doFinalPush() {
    const wfmsStationId = document.getElementById('wfms_station_select').value;
    const errorDiv = document.getElementById('station_error');
    const btn = document.getElementById('pushBtn');

    errorDiv.style.display = 'none';

    if (!wfmsStationId) {
        errorDiv.innerText = "Please select a valid station.";
        errorDiv.style.display = 'block';
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span class="loader"></span> Uploading...';

    try {
        const targetActivity = assignedActivities.find(act => {
            const stObj = act.station || act.stationId;
            const stId = stObj ? (stObj._id || stObj.id || stObj) : null;
            return stId === wfmsStationId;
        });

        const select = document.getElementById('wfms_station_select');
        const selectedOpt = select.options[select.selectedIndex];
        const stationName = selectedOpt ? selectedOpt.getAttribute('data-station-name') : '';

        const formData = new FormData();
        formData.append('reportId', currentReportId || '');
        formData.append('stationId', currentStationId || '');
        formData.append('fileName', currentFileName || '');
        formData.append('wfms_token', wfmsToken || '');
        formData.append('wfms_station_name', stationName);
        formData.append('activityId', targetActivity ? targetActivity._id : '');

        const uploadResponse = await fetch('upload_to_wfms', {
            method: 'POST',
            body: formData
        });
        const uploadResult = await uploadResponse.json();

        if (uploadResult.success) {
            alert("Success: " + uploadResult.message);
            location.reload();
        } else {
            errorDiv.innerText = uploadResult.message;
            errorDiv.style.display = 'block';
            btn.disabled = false;
            btn.innerText = "Push Report";
        }
    } catch (e) {
        errorDiv.innerText = "Error: " + e.message;
        errorDiv.style.display = 'block';
        btn.disabled = false;
        btn.innerText = "Push Report";
    }
  }

  function downloadSummaryReport() {
    const searchVal = document.getElementById('search-input')?.value || '';
    window.location.href = 'generateSummaryReport?search=' + encodeURIComponent(searchVal);
  }

  // Client-side instant search filter
  document.getElementById('search-input')?.addEventListener('input', function() {
    const val = this.value.toLowerCase().trim();
    const rows = document.querySelectorAll('#report-table tbody tr');
    rows.forEach(tr => {
        const text = tr.textContent.toLowerCase();
        tr.style.display = text.includes(val) ? '' : 'none';
    });
  });
</script>

</body>
</html>
"""

@viewReports_bp.route('/viewReports', methods=['GET', 'POST'])
def viewReports():
    username = session.get('username') or request.args.get('username') or request.args.get('user_id')
    if not username:
        return '<script>alert("Unauthorized access. Please log in."); window.location.href="login.html";</script>', 401

    employee_name = session.get('employee_name', 'Unknown Employee')
    role = session.get('role', 'user')

    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True, buffered=True)

        cursor.execute("SELECT username, employee_name, role FROM loginpage WHERE username = %s", (username,))
        u = cursor.fetchone()
        if u:
            employee_name = u.get('employee_name') or employee_name
            role = u.get('role') or role
            session['username'] = username
            session['employee_name'] = employee_name
            session['role'] = role

        if role == 'admin':
            sql = "SELECT id, file_name, upload_date, DATE_FORMAT(upload_date, '%H:%i') AS upload_time, user_id FROM report ORDER BY upload_date DESC"
            cursor.execute(sql)
        else:
            sql = "SELECT id, file_name, upload_date, DATE_FORMAT(upload_date, '%H:%i') AS upload_time, user_id FROM report WHERE user_id = %s ORDER BY upload_date DESC"
            cursor.execute(sql, (username,))

        raw_reports = cursor.fetchall()
        formatted_reports = []

        for r in raw_reports:
            file_name = r['file_name']
            m_station = re.match(r'^(.*?)_([0-9]{4}-[0-9]{2}-[0-9]{2})_Report_', file_name, re.I)
            if m_station:
                extracted_name = m_station.group(1).strip()
                report_date = m_station.group(2)
                station_id = extracted_name
            else:
                m_lead = re.match(r'^([^_]+)', file_name)
                station_id = m_lead.group(1).strip() if m_lead else 'N/A'
                report_date = str(r['upload_date'])[:10] if r['upload_date'] else ''

            m_status = re.search(r'_Report_([^_]+)_Version[\w-]+\.(pdf)$', file_name, re.IGNORECASE)
            status_text = m_status.group(1).strip().lower() if m_status else ''

            if status_text == 'completed':
                status_label = '<span class="status-label completed">Completed</span>'
            else:
                status_label = '<span class="status-label not-completed">Not Completed</span>'

            upload_dt = r['upload_date']
            date_fmt = upload_dt.strftime('%d/%m/%y') if hasattr(upload_dt, 'strftime') else str(upload_dt)

            formatted_reports.append({
                'id': r['id'],
                'file_name': file_name,
                'upload_date_fmt': date_fmt,
                'upload_time': r['upload_time'],
                'user_id': r['user_id'],
                'station_id': station_id,
                'report_date': report_date,
                'status_label': status_label
            })

        cursor.close()
        return render_template_string(VIEW_REPORTS_HTML, username=username, employee_name=employee_name, role=role, reports=formatted_reports)
    except Exception as e:
        return f"Error: {e}"
    finally:
        if conn and conn.is_connected():
            conn.close()
