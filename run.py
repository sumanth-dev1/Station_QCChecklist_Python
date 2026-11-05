import sys, os

# If launched under pythonw.exe, redirect stdout and stderr to avoid NoneType errors
if sys.stdout is None:
    sys.stdout = open(os.path.join(os.path.dirname(__file__), "server.log"), "a", encoding="utf-8")
if sys.stderr is None:
    sys.stderr = open(os.path.join(os.path.dirname(__file__), "server_err.log"), "a", encoding="utf-8")

import config
from waitress import serve
from app import app

if __name__ == "__main__":
    print("========================================================")
    print(f"  STATION QC PYTHON SERVER STARTING ON PORT {config.PORT}")
    print(f"  Access URL: http://localhost:{config.PORT}/")
    print("========================================================")
    serve(app, host='0.0.0.0', port=config.PORT)
