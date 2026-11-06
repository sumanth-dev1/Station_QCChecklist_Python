import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import urllib.parse
import sqlite3
import gzip
import requests
from flask import Blueprint, request, jsonify, Response
import config

part_details_bp = Blueprint('part_details', __name__)

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'database', 'equipment_master.db')
GZ_PATH = DB_PATH + '.gz'

def ensure_master_db():
    """Extracts the offline equipment master SQLite DB from .gz if missing."""
    if not os.path.exists(DB_PATH) and os.path.exists(GZ_PATH):
        try:
            with gzip.open(GZ_PATH, 'rb') as f_in, open(DB_PATH, 'wb') as f_out:
                f_out.writelines(f_in)
        except Exception as e:
            print(f"Notice: Failed to extract equipment_master.db: {e}")

def query_offline_master(part_no_str):
    """
    Fast indexed lookup against the embedded SQLite equipment master database.
    Works 100% offline at remote railway stations, tracks, and sheds with no internet.
    """
    ensure_master_db()
    if not os.path.exists(DB_PATH):
        return None
    try:
        clean_part = str(part_no_str or '').strip().strip("'\"")
        if not clean_part:
            return None
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT part_no, name, system_code, level, type FROM equipment_master WHERE part_no = ? LIMIT 1", (clean_part,))
        row = cur.fetchone()
        if not row and len(clean_part) >= 10:
            cur.execute("SELECT part_no, name, system_code, level, type FROM equipment_master WHERE part_no LIKE ? LIMIT 1", (f"%{clean_part}",))
            row = cur.fetchone()
        conn.close()
        if row:
            return {
                "matched": True,
                "type": row[4],
                "partNo": row[0],
                "name": row[1],
                "systemCode": row[2],
                "level": row[3]
            }
    except Exception as e:
        print(f"Notice: Offline master query error: {e}")
    return None

@part_details_bp.route('/api/part-details', methods=['GET'])
@part_details_bp.route('/api/part-details/<path:part_no>', methods=['GET'])
def get_part_details(part_no=None):
    if not part_no:
        part_no = (request.args.get('partNo') or request.args.get('part_no') or request.args.get('serial') or '').strip()
    else:
        part_no = urllib.parse.unquote(str(part_no)).strip()

    if not part_no:
        return jsonify({
            'status': False,
            'matched': False,
            'message': 'Parameter partNo is required.'
        }), 400

    # 1. Offline master lookup first: instant (0ms), works on any laptop/tab offline at remote stations
    master_result = query_offline_master(part_no)
    if master_result:
        out_resp = jsonify({
            'status': True,
            'matched': True,
            'message': 'Part number matched',
            'data': master_result
        })
        out_resp.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        out_resp.headers['Pragma'] = 'no-cache'
        out_resp.headers['Expires'] = '0'
        return out_resp, 200

    # 2. Live central Configuration API (fallback if online and part is new/unregistered locally)
    base_url = getattr(config, 'CONFIG_API_BASE_URL', '').rstrip('/')
    if base_url:
        headers = {
            'User-Agent': 'Station-QC-Checklist-Backend',
            'Accept': 'application/json'
        }
        quoted_part = urllib.parse.quote(part_no, safe='')
        target_urls = [
            f"{base_url}/part-details/{quoted_part}",
            f"{base_url}/part-details?partNo={quoted_part}",
            f"{base_url}/part-details?serial={quoted_part}"
        ]

        for url in target_urls:
            try:
                resp = requests.get(url, headers=headers, timeout=2)
                if resp.status_code == 200:
                    out_resp = Response(resp.text, status=200, content_type='application/json')
                    out_resp.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
                    out_resp.headers['Pragma'] = 'no-cache'
                    out_resp.headers['Expires'] = '0'
                    return out_resp
                elif resp.status_code == 404:
                    break
            except requests.exceptions.RequestException:
                # Live API offline or no network at railway station -> pass silently
                pass

    # 3. Not found anywhere
    return jsonify({
        'status': False,
        'matched': False,
        'message': f'Part number {part_no} not found in equipment database'
    }), 404

