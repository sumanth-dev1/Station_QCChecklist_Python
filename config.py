"""
config.py
Loads configuration from environment variables (via local .env file).
"""

import os
from dotenv import load_dotenv

# Load variables from .env if present
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_USER = os.environ.get("DB_USER", "root")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "")
DB_NAME = os.environ.get("DB_NAME", "station_info")
PORT = int(os.environ.get("PORT", "5001"))

# Optional legacy directory for historical inspection uploads
LEGACY_UPLOADS_DIR = os.environ.get("LEGACY_UPLOADS_DIR", "")

SECRET_KEY = os.environ.get("SECRET_KEY", "station_qc_default_fallback_secret_key_12345")
