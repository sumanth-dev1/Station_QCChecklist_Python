import sys, os

# If launched under pythonw.exe, redirect stdout and stderr to avoid NoneType errors
if sys.stdout is None:
    sys.stdout = open(os.path.join(os.path.dirname(__file__), "server.log"), "a", encoding="utf-8")
if sys.stderr is None:
    sys.stderr = open(os.path.join(os.path.dirname(__file__), "server_err.log"), "a", encoding="utf-8")

import config
from waitress import serve
from app import app
from database.setup_database import setup_or_migrate

if __name__ == "__main__":
    try:
        # Automatically ensures station_info exists with all 23 tables and admin user
        setup_or_migrate()
    except Exception as e:
        print(f"Database pre-check notice: {e}")

    print("========================================================")
    print(f"  STATION QC PYTHON SERVER STARTING ON PORT {config.PORT}")
    print(f"  Access URL: http://localhost:{config.PORT}/")
    print("========================================================")
    serve(app, host='0.0.0.0', port=config.PORT)
