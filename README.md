# Station QC Python Application (STCAS)

A pure Python 3.14 + MySQL web application migrated from PHP/Apache.
This application operates completely independently of XAMPP and Apache.

---

## 🚀 Key Features

* **Zero PHP, Zero Apache**: Handled natively by Python (Flask + Waitress WSGI server).
* **Direct MySQL Integration**: Connects straight to local or remote MySQL (`station_info` database).
* **No Port Conflicts**: Runs on port `5001` (allowing Loco QC on port `5000` and Station QC on `5001` to run simultaneously).
* **Zero Frontend Modifications**: Identical UI, checklists, auto-save timers, scanner support, and WFMS workflows.
* **Modernized REST Routes**: Clean URLs with Python Blueprint endpoints.
* **High-Speed Summary Generator**: Uses Python's native `openpyxl` and `pypdf`.
* **One-Click Startup**: Double-click `Station QC.lnk` on the Desktop or run `start.bat`.

---

## 📁 Directory Structure

```
station_qc_python/
├── .env.example                 # Template for environment configuration
├── config.py                    # Environment configuration loader
├── db.py                        # Centralized MySQL connection pool
├── app.py                       # Main Flask application & route registrations
├── run.py                       # Waitress production runner
├── requirements.txt             # Project Python dependencies
├── start.bat                    # Server start & browser launcher
├── stop.bat                     # Server shutdown script
├── create_shortcut.ps1          # Desktop shortcut creator
├── database/
│   └── schema.sql               # Database schema and initial checklist definitions
├── routes/                      # Modular Python blueprints (all 18 sections, auth, reports, WFMS)
├── static/                      # Frontend HTML, CSS, JS, images, and installation manuals
└── uploads/                     # Storage for inspection images and generated PDF reports
```

---

## 🛠️ Installation & Setup (Fresh Clone)

### 1. Prerequisites
* Python 3.10+ (Recommended Python 3.14)
* MySQL Server (Standalone MySQL Community Server 8.0/9.0, MariaDB, or MySQL Workbench)

### 2. Database Setup
1. Open MySQL Workbench or MySQL CLI:
   ```sql
   CREATE DATABASE station_info CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Import the schema file:
   ```cmd
   mysql -u root -p station_info < database/schema.sql
   ```
   *(Default initial admin login: username `admin`, password `admin123`)*

### 3. Environment Configuration
Copy `.env.example` to `.env` and fill in your MySQL credentials:
```cmd
copy .env.example .env
```
Edit `.env`:
```ini
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=station_info
PORT=5001
```

### 4. Create Virtual Environment & Install Dependencies
```cmd
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

---

## 🏃 Running the Application

### Option A: One-Click (Windows)
Run `start.bat` (or use the Desktop shortcut created via `create_shortcut.ps1`).

### Option B: Command Line
```cmd
venv\Scripts\python.exe run.py
```

To stop the server:
```cmd
stop.bat
```

---

## 🌐 Application URLs

* **Dashboard**: [http://localhost:5001/](http://localhost:5001/)
* **Login**: [http://localhost:5001/login.html](http://localhost:5001/login.html)
* **Checklist**: [http://localhost:5001/create.html](http://localhost:5001/create.html)
* **Reports**: [http://localhost:5001/viewReports](http://localhost:5001/viewReports)
* **Health Check**: [http://localhost:5001/health](http://localhost:5001/health)
