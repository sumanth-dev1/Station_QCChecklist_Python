import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import io, re, datetime, html
from flask import Blueprint, request, session, send_file, render_template_string
from pypdf import PdfReader
import openpyxl
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.utils import get_column_letter
from db import get_connection
import config

generateSummaryReport_bp = Blueprint('generateSummaryReport', __name__)

NO_REPORTS_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Summary Report - HBL Engineering Ltd.</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 0; padding: 0; }
    h1, h2 { text-align: center; margin: 0; }
    .container { padding: 20px; }
    .profile { position: absolute; right: 20px; color: white; font-size: 14px; }
    .btn { padding: 8px 16px; background-color: #6c757d; color: white; text-decoration: none; border-radius: 5px; display: inline-block; }
    .card { background: white; border: 1px solid #ddd; padding: 30px; text-align: center; margin-top: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
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
    <a href="viewReports" class="btn">Back to Reports</a>

    <div class="card">
      <h2>No 'Not Completed' Reports Found</h2>
      <p style="color: #666; margin-top: 10px;">There are currently no reports with Status <strong>'Not Completed'</strong> matching your criteria.</p>
    </div>
</div>
</body>
</html>
"""

def normalize_station_name(raw):
    name = (raw or '').strip().upper()
    name = re.sub(r'\s+OC$', '', name, flags=re.I)
    name = re.sub(r'OC$', '', name, flags=re.I)
    return name.strip()

def get_section_name_for_sno(sno, section_id=None):
    if section_id is not None:
        sec_str = str(section_id).strip()
        if sec_str in ['2', '2_0', '2.0']: return '1.0_Serial Number verification'
        if sec_str in ['3', '3_0', '3.0']: return '2_Building'
        if sec_str in ['4', '4_0', '4.0']: return '3_Tower'
        if sec_str in ['10', '10_0', '10.0']: return '4.1_PDU'
        if sec_str in ['9', '9_0', '9.0']: return '4.2_DC-DC Converter'
        if sec_str in ['6', '6_0', '6.0']: return '5.1_Kavach unit'
        if sec_str in ['11', '11_0', '11.0']: return '5.2_SMOCIP'
        if sec_str in ['16', '16_0', '16.0']: return '5.3_GPS GSM'
        if sec_str in ['14', '14_0', '14.0']: return '5.4_RIU'
        if sec_str in ['7', '7_0', '7.0']: return '7.0_OFC Networking Rack'
        if sec_str in ['13', '13_0', '13.0']: return '8.0_Relay Rack'
        if sec_str in ['12', '12_0', '12.0']: return '9.0_Earthing'
        if sec_str in ['15', '15_0', '15.0']: return '11_Outdoor Cabling'
        if sec_str in ['17', '17_0', '17.0', '18', '18_0', '18.0']: return '12_RFID Tag'

    parts = str(sno).split('.')
    p0 = int(parts[0]) if len(parts) > 0 and parts[0].isdigit() else 0
    p1 = int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else 0

    if p0 == 1: return '1.0_Serial Number verification'
    if p0 == 2: return '2_Building'
    if p0 == 3: return '3_Tower'
    if p0 == 4:
        if p1 == 1: return '4.1_PDU'
        if p1 == 2: return '4.2_DC-DC Converter'
        return '4.1_PDU'
    if p0 == 5:
        if p1 == 1: return '5.1_Kavach unit'
        if p1 == 2: return '5.2_SMOCIP'
        if p1 == 3: return '5.3_GPS GSM'
        if p1 == 4: return '5.4_RIU'
        if p1 == 5: return '5.5_EI'
        return '5.1_Kavach unit'
    if p0 == 6:
        if p1 == 1: return '6.1_RTU'
        if p1 == 2: return '6.2_RF Antenna Installation'
        return '6.1_RTU'
    if p0 == 7: return '7.0_OFC Networking Rack'
    if p0 == 8: return '8.0_Relay Rack'
    if p0 == 9: return '9.0_Earthing'
    if p0 == 10: return '10_Indoor wiring'
    if p0 == 11: return '11_Outdoor Cabling'
    if p0 == 12: return '12_RFID Tag'
    if p0 == 13: return '13_Components Inspection'
    return f"Section {p0}"

def strip_tags_and_entities(s):
    if not s:
        return ""
    clean = re.sub(r'<[^>]+>', '', s)
    return html.unescape(clean).strip()

@generateSummaryReport_bp.route('/generateSummaryReport', methods=['GET'])
def generateSummaryReport():
    username = session.get('username') or session.get('user_id') or request.args.get('username') or ''
    employee_name = session.get('employee_name', 'Employee')
    role = session.get('role', 'user')
    search_filter = (request.args.get('search') or '').strip()

    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True, buffered=True)

        if role == 'admin' or not username:
            cursor.execute("SELECT id, file_name, upload_date, DATE_FORMAT(upload_date, '%H:%i') AS upload_time, user_id FROM report ORDER BY upload_date DESC")
        else:
            cursor.execute("SELECT id, file_name, upload_date, DATE_FORMAT(upload_date, '%H:%i') AS upload_time, user_id FROM report WHERE user_id = %s ORDER BY upload_date DESC", (username,))

        raw_reports = cursor.fetchall()
        if not raw_reports:
            cursor.close()
            conn.close()
            return render_template_string(NO_REPORTS_HTML, username=username, employee_name=employee_name)

        grouped_reports = {}
        for r in raw_reports:
            file_name = r['file_name']
            m = re.search(r'_Report_([^_]+)_Version[\w-]+\.(pdf)$', file_name, flags=re.I)
            status_captured = m.group(1).strip() if m else ''
            if status_captured.lower() == 'completed':
                continue

            st_m = re.search(r'^(.*?)_([0-9]{4}-[0-9]{2}-[0-9]{2})_Report_.*_Version-?(\d+)', file_name, flags=re.I)
            if st_m:
                st_name = st_m.group(1)
                version = int(st_m.group(3))
            else:
                st_m2 = re.search(r'^([^_]+)', file_name)
                st_name = st_m2.group(1) if st_m2 else ''
                version = 1

            norm_st = normalize_station_name(st_name)
            if not norm_st:
                continue

            ts = int(r['upload_date'].timestamp()) if hasattr(r['upload_date'], 'timestamp') else 0
            grouped_reports.setdefault(norm_st, []).append({
                'id': r['id'],
                'file_name': file_name,
                'raw_station': st_name,
                'norm_station': norm_st,
                'upload_date': r['upload_date'],
                'timestamp': ts,
                'version': version
            })

        if not grouped_reports:
            cursor.close()
            conn.close()
            return render_template_string(NO_REPORTS_HTML, username=username, employee_name=employee_name)

        latest_reports = {}
        for norm_st, r_list in grouped_reports.items():
            r_list.sort(key=lambda x: (x['timestamp'], x['version']), reverse=True)
            latest_reports[norm_st] = r_list[0]

        latest_reports = dict(sorted(latest_reports.items()))

        obs_tables = [
            "verification_of_equipment_serial_numbers", "tower", "rtu", "rf_antennas", "installation_of_kavach_equipment",
            "networking_rack", "ips", "dc_convertor", "pdu", "smocip", "outdoor_cabling", "relay_rack", "riu",
            "laying_of_sectional_ofc_cable", "gps_gsm_antenna", "rfid_tags", "tag_to_tag_distance"
        ]

        db_aspects = {}
        for tbl in obs_tables:
            try:
                cursor.execute(f"SELECT S_no, observation_text FROM {tbl} WHERE observation_text IS NOT NULL AND TRIM(observation_text) <> '' GROUP BY S_no, observation_text")
                for r in cursor.fetchall():
                    sno = str(r['S_no']).strip()
                    text = strip_tags_and_entities(r['observation_text'])
                    if sno not in db_aspects and text != '':
                        db_aspects[sno] = text
            except Exception:
                pass

        checklist_master = [
            {'sno': '2.1', 'section': '2_Building', 'obs': 'KAVACH Building Works'},
            {'sno': '3.1', 'section': '3_Tower', 'obs': 'Tower Installation'},
            {'sno': '4.1.1', 'section': '4.1_PDU', 'obs': 'Installation'},
            {'sno': '4.1.2', 'section': '4.1_PDU', 'obs': 'Installation'},
            {'sno': '4.1.3', 'section': '4.1_PDU', 'obs': 'Cabling'},
            {'sno': '4.1.4', 'section': '4.1_PDU', 'obs': 'Cabling'},
            {'sno': '4.1.5', 'section': '4.1_PDU', 'obs': 'Cabling'},
            {'sno': '4.1.6', 'section': '4.1_PDU', 'obs': 'Earthing'},
            {'sno': '4.1.7', 'section': '4.1_PDU', 'obs': 'Earthing'},
            {'sno': '4.1.8', 'section': '4.1_PDU', 'obs': 'Functionality'},
            {'sno': '4.2.1', 'section': '4.2_DC-DC Converter', 'obs': 'Installation'},
            {'sno': '4.2.2', 'section': '4.2_DC-DC Converter', 'obs': 'Cabling'},
            {'sno': '4.2.3', 'section': '4.2_DC-DC Converter', 'obs': 'Earthing'},
            {'sno': '4.2.4', 'section': '4.2_DC-DC Converter', 'obs': 'Earthing'},
            {'sno': '4.2.5', 'section': '4.2_DC-DC Converter', 'obs': 'Functionality'},
            {'sno': '5.1.1', 'section': '5.1_Kavach unit', 'obs': 'Installation'},
            {'sno': '5.1.2', 'section': '5.1_Kavach unit', 'obs': 'Cabling'},
            {'sno': '5.1.3', 'section': '5.1_Kavach unit', 'obs': 'Earthing'},
            {'sno': '5.1.4', 'section': '5.1_Kavach unit', 'obs': 'Earthing'},
            {'sno': '5.1.5', 'section': '5.1_Kavach unit', 'obs': 'Termination Unit'},
            {'sno': '5.1.6', 'section': '5.1_Kavach unit', 'obs': 'Termination Unit'},
            {'sno': '5.2.1', 'section': '5.2_SMOCIP', 'obs': 'Installation'},
            {'sno': '5.2.2', 'section': '5.2_SMOCIP', 'obs': 'Termination Unit'},
            {'sno': '5.2.3', 'section': '5.2_SMOCIP', 'obs': 'Termination Unit'},
            {'sno': '5.2.4', 'section': '5.2_SMOCIP', 'obs': 'Termination Unit'},
            {'sno': '5.2.5', 'section': '5.2_SMOCIP', 'obs': 'Earthing'},
            {'sno': '5.2.6', 'section': '5.2_SMOCIP', 'obs': 'Earthing'},
            {'sno': '5.2.7', 'section': '5.2_SMOCIP', 'obs': 'Functionality'},
            {'sno': '5.2.8', 'section': '5.2_SMOCIP', 'obs': 'Functionality'},
            {'sno': '5.2.9', 'section': '5.2_SMOCIP', 'obs': 'Checksum'},
            {'sno': '5.3.1', 'section': '5.3_GPS GSM', 'obs': 'Installation'},
            {'sno': '5.3.2', 'section': '5.3_GPS GSM', 'obs': 'Installation'},
            {'sno': '5.3.3', 'section': '5.3_GPS GSM', 'obs': 'Cabling'},
            {'sno': '5.3.4', 'section': '5.3_GPS GSM', 'obs': 'Cabling'},
            {'sno': '5.3.5', 'section': '5.3_GPS GSM', 'obs': 'Cabling'},
            {'sno': '5.4.1', 'section': '5.4_RIU', 'obs': 'Installation'},
            {'sno': '5.4.2', 'section': '5.4_RIU', 'obs': 'Cabling'},
            {'sno': '5.4.3', 'section': '5.4_RIU', 'obs': 'Cabling'},
            {'sno': '5.4.4', 'section': '5.4_RIU', 'obs': 'Earthing'},
            {'sno': '5.4.5', 'section': '5.4_RIU', 'obs': 'Earthing'},
            {'sno': '5.4.6', 'section': '5.4_RIU', 'obs': 'FDMS Box installation'},
            {'sno': '5.5.1', 'section': '5.5_EI', 'obs': 'Installation'},
            {'sno': '5.5.2', 'section': '5.5_EI', 'obs': 'Cabling'},
            {'sno': '5.5.3', 'section': '5.5_EI', 'obs': 'Earthing'},
            {'sno': '5.5.4', 'section': '5.5_EI', 'obs': 'Earthing'},
            {'sno': '5.5.5', 'section': '5.5_EI', 'obs': 'EI Interface test report'},
            {'sno': '6.1.1', 'section': '6.1_RTU', 'obs': 'RTU Fixing'},
            {'sno': '6.1.2', 'section': '6.1_RTU', 'obs': 'RTU Fixing'},
            {'sno': '6.1.3', 'section': '6.1_RTU', 'obs': 'RTU Earthing'},
            {'sno': '6.1.4', 'section': '6.1_RTU', 'obs': 'RTU Earthing'},
            {'sno': '6.1.5', 'section': '6.1_RTU', 'obs': 'OFC cable termination'},
            {'sno': '6.1.6', 'section': '6.1_RTU', 'obs': 'OFC cables spliced'},
            {'sno': '6.1.7', 'section': '6.1_RTU', 'obs': '110V Power cable termination'},
            {'sno': '6.1.8', 'section': '6.1_RTU', 'obs': '110V Power cable termination'},
            {'sno': '6.1.9', 'section': '6.1_RTU', 'obs': '110V Power cable termination'},
            {'sno': '6.1.10', 'section': '6.1_RTU', 'obs': 'Cabiling'},
            {'sno': '6.1.11', 'section': '6.1_RTU', 'obs': 'Radio Configuration'},
            {'sno': '6.2.1', 'section': '6.2_RF Antenna Installation', 'obs': 'RF antenna installation and Audit'},
            {'sno': '6.2.2', 'section': '6.2_RF Antenna Installation', 'obs': 'RF antenna installation and Audit'},
            {'sno': '7.1', 'section': '7.0_OFC Networking Rack', 'obs': 'Installation'},
            {'sno': '7.2', 'section': '7.0_OFC Networking Rack', 'obs': 'Installation'},
            {'sno': '7.3', 'section': '7.0_OFC Networking Rack', 'obs': 'Cabling'},
            {'sno': '7.4', 'section': '7.0_OFC Networking Rack', 'obs': 'Cabling'},
            {'sno': '7.5', 'section': '7.0_OFC Networking Rack', 'obs': 'Earthing'},
            {'sno': '7.6', 'section': '7.0_OFC Networking Rack', 'obs': 'Earthing'},
            {'sno': '7.7', 'section': '7.0_OFC Networking Rack', 'obs': 'Earthing'},
            {'sno': '7.8', 'section': '7.0_OFC Networking Rack', 'obs': 'FDMS Box Installation in Network Rack'},
            {'sno': '7.9', 'section': '7.0_OFC Networking Rack', 'obs': 'FDMS Box Installation in Network Rack'},
            {'sno': '7.10', 'section': '7.0_OFC Networking Rack', 'obs': 'OFC cable continuity check, after splicing'},
            {'sno': '8.1', 'section': '8.0_Relay Rack', 'obs': 'Installation'},
            {'sno': '8.2', 'section': '8.0_Relay Rack', 'obs': 'Wiring'},
            {'sno': '8.3', 'section': '8.0_Relay Rack', 'obs': 'Wiring'},
            {'sno': '8.4', 'section': '8.0_Relay Rack', 'obs': 'Wiring'},
            {'sno': '8.5', 'section': '8.0_Relay Rack', 'obs': 'Continuity Test / Bell Test'},
            {'sno': '8.6', 'section': '8.0_Relay Rack', 'obs': 'Earthing'},
            {'sno': '8.7', 'section': '8.0_Relay Rack', 'obs': 'Earthing'},
            {'sno': '9.1', 'section': '9.0_Earthing', 'obs': 'Installation'},
            {'sno': '9.2', 'section': '9.0_Earthing', 'obs': 'Earth Resistance Measurement'},
            {'sno': '9.2.1', 'section': '9.0_Earthing', 'obs': 'Earth Resistance Measurement'},
            {'sno': '9.3', 'section': '9.0_Earthing', 'obs': 'Test Reports'},
            {'sno': '9.4', 'section': '9.0_Earthing', 'obs': 'Labeling'},
            {'sno': '10.1', 'section': '10_Indoor wiring', 'obs': 'Redundant cabling'},
            {'sno': '10.2', 'section': '10_Indoor wiring', 'obs': 'SMOCIP'},
            {'sno': '10.3', 'section': '10_Indoor wiring', 'obs': 'No Joints'},
            {'sno': '10.4', 'section': '10_Indoor wiring', 'obs': 'Color Coding'},
            {'sno': '10.5', 'section': '10_Indoor wiring', 'obs': 'Tagging/Labeling'},
            {'sno': '10.6', 'section': '10_Indoor wiring', 'obs': 'Termination & Connection'},
            {'sno': '11.1', 'section': '11_Outdoor Cabling', 'obs': 'Cable route plan for OFC & Power cable (Relay Room to Tower)'},
            {'sno': '11.2', 'section': '11_Outdoor Cabling', 'obs': 'Cable route markers'},
            {'sno': '12.1', 'section': '12_RFID Tag', 'obs': 'RFID Tag Installation'},
            {'sno': '12.2', 'section': '12_RFID Tag', 'obs': 'RFID Tag Installation'},
            {'sno': '12.3', 'section': '12_RFID Tag', 'obs': 'RFID Tag data Validation and Placement verification'},
            {'sno': '12.4', 'section': '12_RFID Tag', 'obs': 'Verify replacement of RFID Point Tags with the new FRP Tag Mounting Base'},
            {'sno': '13.1', 'section': '13_Components Inspection', 'obs': 'Materials Inspection (Which are not Inspected by RDSO or Consignee)'},
        ]

        for m_item in checklist_master:
            if m_item['sno'] in db_aspects:
                m_item['obs'] = db_aspects[m_item['sno']]

        sec1_map = {}
        try:
            cursor.execute("""
                SELECT S_no, observation_text 
                FROM verification_of_equipment_serial_numbers 
                WHERE observation_text IS NOT NULL AND TRIM(observation_text) <> '' 
                GROUP BY S_no 
                ORDER BY CAST(SUBSTRING_INDEX(S_no, '.', -1) AS UNSIGNED)
            """)
            for sec1_row in cursor.fetchall():
                sno = str(sec1_row['S_no']).strip()
                obs_text = strip_tags_and_entities(sec1_row['observation_text'])
                if sno not in sec1_map and obs_text:
                    sec1_map[sno] = obs_text
        except Exception:
            pass

        custom_templates = {}
        try:
            cursor.execute("SELECT id, section_id, s_no, description FROM row_templates ORDER BY id ASC")
            for rt_row in cursor.fetchall():
                rt_sno = str(rt_row['s_no']).strip()
                rt_desc = strip_tags_and_entities(rt_row['description'])
                rt_sec_id = str(rt_row['section_id'] or '').strip()
                if rt_sno:
                    custom_templates[rt_sno] = {
                        'sno': rt_sno,
                        'obs': rt_desc,
                        'section_id': rt_sec_id
                    }
                    if rt_sno.startswith('1.') or rt_sec_id in ['2_0', '2']:
                        sec1_map[rt_sno] = rt_desc
        except Exception:
            pass

        max_sec1 = 68
        for s in sec1_map.keys():
            p = s.split('.')
            if len(p) > 1 and p[1].isdigit() and int(p[1]) > max_sec1:
                max_sec1 = int(p[1])

        for i in range(1, max_sec1 + 1):
            sno = f"1.{i}"
            obs_label = sec1_map.get(sno, db_aspects.get(sno, f"Equipment serial number verification ({sno})"))
            checklist_master.append({
                'sno': sno,
                'section': '1.0_Serial Number verification',
                'obs': obs_label
            })

        existing_sno_set = {it['sno'] for it in checklist_master}
        for sno, obs_label in sec1_map.items():
            if sno not in existing_sno_set:
                checklist_master.append({
                    'sno': sno,
                    'section': '1.0_Serial Number verification',
                    'obs': obs_label
                })
                existing_sno_set.add(sno)

        for rt_sno, rt_info in custom_templates.items():
            if rt_sno not in existing_sno_set:
                checklist_master.append({
                    'sno': rt_sno,
                    'section': get_section_name_for_sno(rt_sno, rt_info['section_id']),
                    'obs': rt_info['obs']
                })
                existing_sno_set.add(rt_sno)

        station_id_map = {}
        try:
            cursor.execute("SELECT station_id, station_name FROM station")
            for st_row in cursor.fetchall():
                st_norm = normalize_station_name(st_row['station_name'])
                st_upper = (st_row['station_name'] or '').strip().upper()
                sid = st_row['station_id']
                station_id_map.setdefault(st_norm, []).append(sid)
                station_id_map.setdefault(st_upper, []).append(sid)
        except Exception:
            pass

        active_station_ids = []
        for rep_st, rep_info in latest_reports.items():
            raw_st = (rep_info['raw_station'] or '').strip().upper()
            if rep_st in station_id_map: active_station_ids.extend(station_id_map[rep_st])
            if raw_st in station_id_map: active_station_ids.extend(station_id_map[raw_st])
        active_station_ids = list(set(active_station_ids))

        if active_station_ids:
            in_clause = ','.join(str(int(sid)) for sid in active_station_ids)
            for tbl in obs_tables:
                try:
                    cursor.execute(f"SELECT DISTINCT S_no, observation_text FROM {tbl} WHERE station_id IN ({in_clause}) AND S_no IS NOT NULL AND TRIM(S_no) <> ''")
                    for c_row in cursor.fetchall():
                        c_sno = str(c_row['S_no']).strip()
                        if c_sno and c_sno not in existing_sno_set:
                            c_obs = strip_tags_and_entities(c_row['observation_text'])
                            if not c_obs:
                                c_obs = db_aspects.get(c_sno, f"Observation ({c_sno})")
                            checklist_master.append({
                                'sno': c_sno,
                                'section': get_section_name_for_sno(c_sno),
                                'obs': c_obs
                            })
                            existing_sno_set.add(c_sno)
                except Exception:
                    pass

        station_pending_map = {}
        station_na_map = {}
        station_obs_map = {}
        station_date_map = {}
        station_report_total_map = {}
        station_report_closed_map = {}
        station_report_open_map = {}
        skipped_reports = []

        for station, rep in latest_reports.items():
            rel_path = os.path.join('uploads', 'reports', rep['file_name'])
            pdf_path = rel_path
            if not os.path.exists(pdf_path) and getattr(config, 'LEGACY_UPLOADS_DIR', None):
                candidate2 = os.path.join(config.LEGACY_UPLOADS_DIR, 'reports', rep['file_name'])
                if os.path.exists(candidate2):
                    pdf_path = candidate2

            dt = rep['upload_date']
            station_date_map[station] = dt.strftime('%d/%m/%y') if hasattr(dt, 'strftime') else str(dt)
            station_na_map[station] = {}
            station_obs_map[station] = {}

            raw_st = (rep['raw_station'] or '').strip().upper()
            norm_st = station

            if not os.path.exists(pdf_path):
                skipped_reports.append({
                    'file_name': rep['file_name'],
                    'station': station,
                    'upload_date': str(rep['upload_date']),
                    'path_checked': rel_path,
                    'file_exists': 'N',
                    'reason': 'Report PDF file not found in uploads directory'
                })
                continue

            try:
                reader = PdfReader(pdf_path)
                text = '\n'.join([p.extract_text() or '' for p in reader.pages])

                # Extract the exact Station ID from the PDF report header
                m_sid = re.search(r'Station\s+ID\s+Station\s+Name[^\n]*\n\s*(\d+)', text, re.I)
                if m_sid:
                    matched_ids = [int(m_sid.group(1))]
                else:
                    matched_ids = []
                    if norm_st in station_id_map: matched_ids.extend(station_id_map[norm_st])
                    if raw_st in station_id_map: matched_ids.extend(station_id_map[raw_st])
                    matched_ids = list(set(matched_ids))

                for sid in matched_ids:
                    for tbl in obs_tables:
                        try:
                            cursor.execute(f"SELECT S_no, observation_status FROM {tbl} WHERE station_id = %s", (sid,))
                            for obs_row in cursor.fetchall():
                                sno_key = str(obs_row['S_no'] or '').strip()
                                st_val = str(obs_row['observation_status'] or '').strip()
                                if sno_key:
                                    station_obs_map[station][sno_key] = st_val
                                if st_val.lower() in ['not applicable', 'na', 'n/a', 'not installed']:
                                    station_na_map[station][sno_key] = True
                        except Exception:
                            pass

                summary_search_text = text
                billing_pos = summary_search_text.lower().find('station billing summary')
                if billing_pos != -1:
                    summary_search_text = summary_search_text[:billing_pos]

                sm = re.search(r'Total\s+Points\s+Closed\s+Points\s+Open\s+Points\s+(\d+)\s+(\d+)\s+(\d+)', summary_search_text, re.I)
                if not sm:
                    sm = re.search(r'Total\s+Points[^\d]*?(\d+)[^\d\w]+Closed\s+Points[^\d]*?(\d+)[^\d\w]+Open\s+Points[^\d]*?(\d+)', summary_search_text, re.I | re.S)
                if not sm:
                    sm = re.search(r'Total\s+Points\s+Closed\s+Points\s+Open\s+Points\s+(\d+)\s+(\d+)\s+(\d+)', text, re.I)
                if not sm:
                    sm = re.search(r'Total\s+Points[^\d]*?(\d+)[^\d\w]+Closed\s+Points[^\d]*?(\d+)[^\d\w]+Open\s+Points[^\d]*?(\d+)', text, re.I | re.S)

                report_total_points = int(sm.group(1)) if sm else None
                report_closed_points = int(sm.group(2)) if sm else None
                report_open_points = int(sm.group(3)) if sm else None

                expected_total = None
                pending_set = set()

                pos = text.find("The following are the pending items")
                if pos != -1:
                    pending_text = text[pos:]
                    end_pos = pending_text.find("Note :")
                    if end_pos != -1:
                        pending_text = pending_text[:end_pos]

                    tot_m = re.search(r'Total\s+(\d+)', pending_text, re.I)
                    if tot_m:
                        expected_total = int(tot_m.group(1))

                    clean_pending_text = re.sub(r'Section\s+\d+(?:\.\d+)?(?::|\s)', '', pending_text, flags=re.I)
                    found_points = re.findall(r'\b\d+\.\d+(?:\.\d+)?\b', clean_pending_text)
                    pending_set = set(dict.fromkeys(found_points))

                actual_count = len(pending_set)

                if expected_total is not None and actual_count != expected_total:
                    skipped_reports.append({
                        'file_name': rep['file_name'],
                        'station': station,
                        'upload_date': str(rep['upload_date']),
                        'path_checked': rel_path,
                        'file_exists': 'Y',
                        'reason': f"count mismatch (expected {expected_total}, got {actual_count})"
                    })
                    continue

                station_pending_map[station] = pending_set

                body_text = text
                if pos != -1:
                    body_text = text[:pos]

                # Section-level NA
                sec_matches = re.findall(r'(?:^|\n)\s*(?:Section\s+)?([2-9]|1[0-3])\.0\s+[^\r\n]*?Not Applicable', body_text, re.I)
                for sec_num in sec_matches:
                    for item in checklist_master:
                        parts = item['sno'].split('.')
                        if parts[0] == sec_num:
                            station_na_map[station][item['sno']] = True

                # Subsection-level NA
                sub_matches = re.findall(r'(?:^|\n)\s*(4\.1|4\.2|5\.1|5\.2|5\.3|5\.4|5\.5)[^:\r\n]*:\s*Not Applicable', body_text, re.I)
                for sub_sec in sub_matches:
                    for item in checklist_master:
                        if item['sno'].startswith(sub_sec):
                            station_na_map[station][item['sno']] = True

                # Row-level NA
                for b_line in body_text.splitlines():
                    if 'not applicable' in b_line.lower():
                        row_m = re.search(r'^\s*(\d+\.\d+(?:\.\d+)?)', b_line)
                        if row_m:
                            matched_sno = row_m.group(1)
                            if not re.match(r'^\d+\.0$', matched_sno):
                                station_na_map[station][matched_sno] = True

                na_count = len(station_na_map[station])
                fallback_total = max(0, len(checklist_master) - na_count)
                fallback_open = report_open_points if report_open_points is not None else (expected_total if expected_total is not None else actual_count)
                fallback_closed = max(0, fallback_total - fallback_open)

                station_report_total_map[station] = report_total_points if report_total_points is not None else fallback_total
                station_report_closed_map[station] = report_closed_points if report_closed_points is not None else fallback_closed
                station_report_open_map[station] = report_open_points if report_open_points is not None else fallback_open
            except Exception as e:
                skipped_reports.append({
                    'file_name': rep['file_name'],
                    'station': station,
                    'upload_date': str(rep['upload_date']),
                    'path_checked': rel_path,
                    'file_exists': 'Y',
                    'reason': f"PDF parse error: {e}"
                })

        parsed_stations = list(station_pending_map.keys())
        valid_rows = []
        station_open_totals = {st: 0 for st in parsed_stations}
        station_close_totals = {st: 0 for st in parsed_stations}
        station_na_totals = {st: 0 for st in parsed_stations}

        closed_statuses = [
            'matching', 'verified', 'available', 'ok', 'yes',
            'routing done', 'fixed', 'secured', 'installed', 'done'
        ]

        for item in checklist_master:
            sno = item['sno']
            row_statuses = {}

            for st in parsed_stations:
                if sno in station_na_map[st]:
                    row_statuses[st] = 'NA'
                    station_na_totals[st] += 1
                elif sno in station_pending_map[st]:
                    row_statuses[st] = 'Open'
                else:
                    if sno in station_obs_map[st]:
                        db_val = station_obs_map[st][sno].strip().lower()
                        if db_val in ['not applicable', 'not installed', 'na', 'n/a']:
                            row_statuses[st] = 'NA'
                            station_na_totals[st] += 1
                        elif db_val in closed_statuses:
                            row_statuses[st] = 'Close'
                        else:
                            row_statuses[st] = 'Open'
                    else:
                        row_statuses[st] = 'Open'

            row_copy = dict(item)
            row_copy['statuses'] = row_statuses
            valid_rows.append(row_copy)

        station_total_points = {}
        for st in parsed_stations:
            station_total_points[st] = station_report_total_map.get(st, 0)
            station_close_totals[st] = station_report_closed_map.get(st, 0)
            station_open_totals[st] = station_report_open_map.get(st, 0)

        def sort_key(x):
            parts = str(x['sno']).split('.')
            p0 = int(parts[0]) if len(parts) > 0 and parts[0].isdigit() else 999
            p1 = int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else 0
            p2 = int(parts[2]) if len(parts) > 2 and parts[2].isdigit() else 0
            return (p0, p1, p2)

        valid_rows.sort(key=sort_key)

        cursor.close()
        conn.close()

        # Build Excel Workbook with openpyxl
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Site Audit Summary Report"

        title_font = Font(name="Calibri", size=14, bold=True, color="00457C")
        header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
        header_fill = PatternFill(start_color="00457C", end_color="00457C", fill_type="solid")
        header_align = Alignment(horizontal="center", vertical="center", wrap_text=True)

        open_font = Font(name="Calibri", size=11, bold=True, color="9C0006")
        open_fill = PatternFill(start_color="FFC7CE", end_color="FFC7CE", fill_type="solid")

        close_font = Font(name="Calibri", size=11, bold=True, color="006100")
        close_fill = PatternFill(start_color="C6EFCE", end_color="C6EFCE", fill_type="solid")

        na_font = Font(name="Calibri", size=11, bold=True, color="595959")
        na_fill = PatternFill(start_color="E0E0E0", end_color="E0E0E0", fill_type="solid")

        total_row_font = Font(name="Calibri", size=11, bold=True)
        total_row_fill = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")

        thin_side = Side(style='thin', color='000000')
        med_side = Side(style='medium', color='000000')
        green_side = Side(style='medium', color='00B050')

        border_thin = Border(left=thin_side, right=thin_side, top=thin_side, bottom=thin_side)
        border_medium = Border(left=med_side, right=med_side, top=med_side, bottom=med_side)

        align_center = Alignment(horizontal="center", vertical="center")
        align_left = Alignment(horizontal="left", vertical="center")

        num_stations = len(parsed_stations)
        total_points_col_idx = 5 + num_stations
        closed_col_idx = 6 + num_stations
        open_col_idx = 7 + num_stations
        last_col_idx = open_col_idx

        # Title Row (Row 1)
        ws.merge_cells("A1:D1")
        ws["A1"] = "HBL Engineering Ltd. - In-process Site Audit Summary Report"
        ws["A1"].font = title_font
        ws["A1"].alignment = align_left
        ws.row_dimensions[1].height = 28.0

        for col in range(1, last_col_idx + 1):
            ws.cell(1, col).border = Border(bottom=green_side)

        # Row 2: Thin green separator bar
        ws.row_dimensions[2].height = 5.0
        green_fill = PatternFill(start_color="00B050", end_color="00B050", fill_type="solid")
        for col in range(1, last_col_idx + 1):
            ws.cell(2, col).fill = green_fill

        # Row 3: Header Row
        ws.row_dimensions[3].height = 40.0
        ws.cell(3, 1, "Sr. No")
        ws.cell(3, 2, "Section")
        ws.cell(3, 3, "Serial No")
        ws.cell(3, 4, "Observations")

        col_idx = 5
        for st in parsed_stations:
            up_date = station_date_map.get(st, '')
            header_label = f"{st}\nUploaded: {up_date}"
            ws.cell(3, col_idx, header_label)
            col_idx += 1

        ws.cell(3, total_points_col_idx, "Total points")
        ws.cell(3, closed_col_idx, "closed")
        ws.cell(3, open_col_idx, "Open")

        for col in range(1, last_col_idx + 1):
            c = ws.cell(3, col)
            c.font = header_font
            c.fill = header_fill
            c.alignment = header_align
            c.border = border_thin

        # Data Rows (Row 4 onwards)
        curr_row = 4
        sr_no = 1
        for vr in valid_rows:
            ws.cell(curr_row, 1, sr_no).alignment = align_center
            ws.cell(curr_row, 2, vr['section']).alignment = align_left

            c_sno = ws.cell(curr_row, 3, str(vr['sno']))
            c_sno.number_format = '@'
            c_sno.alignment = align_center

            ws.cell(curr_row, 4, vr['obs']).alignment = align_left

            col_idx = 5
            row_open_count = 0
            row_close_count = 0
            row_na_count = 0

            for st in parsed_stations:
                st_val = vr['statuses'].get(st, 'Close')
                c = ws.cell(curr_row, col_idx, st_val)
                c.alignment = align_center
                c.border = border_thin
                if st_val == 'Open':
                    c.font = open_font
                    c.fill = open_fill
                    row_open_count += 1
                elif st_val == 'NA':
                    c.font = na_font
                    c.fill = na_fill
                    row_na_count += 1
                else:
                    c.font = close_font
                    c.fill = close_fill
                    row_close_count += 1
                col_idx += 1

            row_total_points = row_close_count + row_open_count

            c_tot = ws.cell(curr_row, total_points_col_idx, row_total_points)
            c_tot.font = Font(name="Calibri", size=11, bold=True)
            c_tot.alignment = align_center

            c_cl = ws.cell(curr_row, closed_col_idx, row_close_count)
            c_cl.font = Font(name="Calibri", size=11, bold=True)
            c_cl.alignment = align_center

            c_op = ws.cell(curr_row, open_col_idx, row_open_count)
            c_op.font = Font(name="Calibri", size=11, bold=True)
            c_op.alignment = align_center

            for col in range(1, last_col_idx + 1):
                ws.cell(curr_row, col).border = border_thin

            curr_row += 1
            sr_no += 1

        # Grand Totals
        grand_total_closed = sum(station_close_totals.values())
        grand_total_open = sum(station_open_totals.values())
        grand_total_points = sum(station_total_points.values())
        grand_total_pct = f"{round((grand_total_closed / grand_total_points) * 100, 2):.2f}%" if grand_total_points > 0 else "0%"

        def style_total_row(row_num):
            ws.row_dimensions[row_num].height = 22.0
            for c_idx in range(1, last_col_idx + 1):
                c_cell = ws.cell(row_num, c_idx)
                c_cell.font = total_row_font
                c_cell.fill = total_row_fill
                c_cell.alignment = align_center
                c_cell.border = border_medium

        # Summary Row 1: Total points
        ws.cell(curr_row, 1, "")
        ws.cell(curr_row, 2, "Total points")
        ws.cell(curr_row, 3, "")
        ws.cell(curr_row, 4, "")
        ws.merge_cells(start_row=curr_row, start_column=2, end_row=curr_row, end_column=4)
        col_idx = 5
        for st in parsed_stations:
            ws.cell(curr_row, col_idx, station_total_points.get(st, 0))
            col_idx += 1
        ws.cell(curr_row, total_points_col_idx, grand_total_points)
        ws.cell(curr_row, closed_col_idx, "")
        ws.cell(curr_row, open_col_idx, "")
        style_total_row(curr_row)
        curr_row += 1

        # Summary Row 2: Total closed points
        ws.cell(curr_row, 1, "")
        ws.cell(curr_row, 2, "Total closed points")
        ws.cell(curr_row, 3, "")
        ws.cell(curr_row, 4, "")
        ws.merge_cells(start_row=curr_row, start_column=2, end_row=curr_row, end_column=4)
        col_idx = 5
        for st in parsed_stations:
            ws.cell(curr_row, col_idx, station_close_totals.get(st, 0))
            col_idx += 1
        ws.cell(curr_row, total_points_col_idx, "")
        ws.cell(curr_row, closed_col_idx, grand_total_closed)
        ws.cell(curr_row, open_col_idx, "")
        style_total_row(curr_row)
        curr_row += 1

        # Summary Row 3: Total open points
        ws.cell(curr_row, 1, "")
        ws.cell(curr_row, 2, "Total open points")
        ws.cell(curr_row, 3, "")
        ws.cell(curr_row, 4, "")
        ws.merge_cells(start_row=curr_row, start_column=2, end_row=curr_row, end_column=4)
        col_idx = 5
        for st in parsed_stations:
            ws.cell(curr_row, col_idx, station_open_totals.get(st, 0))
            col_idx += 1
        ws.cell(curr_row, total_points_col_idx, "")
        ws.cell(curr_row, closed_col_idx, "")
        ws.cell(curr_row, open_col_idx, grand_total_open)
        style_total_row(curr_row)
        curr_row += 1

        # Summary Row 4: Total % of completion
        ws.cell(curr_row, 1, "")
        ws.cell(curr_row, 2, "Total % of completion")
        ws.cell(curr_row, 3, "")
        ws.cell(curr_row, 4, "")
        ws.merge_cells(start_row=curr_row, start_column=2, end_row=curr_row, end_column=4)
        col_idx = 5
        for st in parsed_stations:
            st_cl = station_close_totals.get(st, 0)
            st_tot = station_total_points.get(st, 0)
            st_pct = f"{round((st_cl / st_tot) * 100, 2):.2f}%" if st_tot > 0 else "0%"
            ws.cell(curr_row, col_idx, st_pct)
            col_idx += 1
        ws.cell(curr_row, total_points_col_idx, grand_total_pct)
        ws.cell(curr_row, closed_col_idx, "")
        ws.cell(curr_row, open_col_idx, "")
        style_total_row(curr_row)

        ws.freeze_panes = 'A4'

        for col in range(1, last_col_idx + 1):
            col_letter = get_column_letter(col)
            max_len = 0
            for row in range(3, curr_row + 1):
                val = str(ws.cell(row, col).value or '')
                for line in val.split('\n'):
                    if len(line) > max_len:
                        max_len = len(line)
            ws.column_dimensions[col_letter].width = max(max_len + 4, 12)

        if skipped_reports:
            skip_ws = wb.create_sheet(title="Skipped reports")
            skip_headers = ['Sr. No', 'Report File Name', 'Station Name', 'Upload Date', 'Path checked', 'File exists (Y/N)', 'Reason for Skipping']
            for idx, h in enumerate(skip_headers, 1):
                c = skip_ws.cell(1, idx, h)
                c.font = header_font
                c.fill = header_fill
                c.alignment = header_align
                c.border = border_thin
            skip_ws.row_dimensions[1].height = 25.0
            for s_idx, sr in enumerate(skipped_reports, 1):
                r_num = s_idx + 1
                skip_ws.cell(r_num, 1, s_idx).alignment = align_center
                skip_ws.cell(r_num, 2, sr['file_name'])
                skip_ws.cell(r_num, 3, sr['station'])
                skip_ws.cell(r_num, 4, sr['upload_date'])
                skip_ws.cell(r_num, 5, sr['path_checked'])
                skip_ws.cell(r_num, 6, sr['file_exists']).alignment = align_center
                skip_ws.cell(r_num, 7, sr['reason'])
                for col_i in range(1, 8):
                    skip_ws.cell(r_num, col_i).border = border_thin
            for c in range(1, 8):
                skip_ws.column_dimensions[get_column_letter(c)].width = 25

        output = io.BytesIO()
        wb.save(output)
        output.seek(0)

        system_name = re.sub(r'[^A-Za-z0-9_-]', '_', search_filter) if search_filter else 'Wayside_QC_Ratlam'
        today_date = datetime.date.today().strftime('%Y-%m-%d')
        download_file_name = f"Summary_Report_{system_name}_{today_date}.xlsx"

        return send_file(
            output,
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            as_attachment=True,
            download_name=download_file_name
        )

    except Exception as e:
        if conn and conn.is_connected():
            conn.close()
        return render_template_string(NO_REPORTS_HTML, username=username, employee_name=employee_name)
