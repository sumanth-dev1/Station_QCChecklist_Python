@echo off
setlocal enabledelayedexpansion
title Station QC Setup
cd /d "%~dp0"

echo ========================================================
echo             STATION QC ENVIRONMENT SETUP
echo ========================================================
echo.

:: 1. Check if Python is installed
python --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.10+ from python.org and check "Add python.exe to PATH"
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('python --version') do echo Found %%v

:: 2. Create virtual environment if missing
if not exist "%~dp0venv\Scripts\python.exe" (
    echo.
    echo [*] Creating virtual environment in .\venv ...
    python -m venv "%~dp0venv"
    if !ERRORLEVEL! neq 0 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
    echo [OK] Virtual environment created.
) else (
    echo [OK] Virtual environment already exists.
)

:: 3. Upgrade pip and install requirements
echo.
echo [*] Installing required packages from requirements.txt ...
"%~dp0venv\Scripts\python.exe" -m pip install --upgrade pip --quiet
"%~dp0venv\Scripts\pip.exe" install -r "%~dp0requirements.txt"
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to install requirements.
    pause
    exit /b 1
)
echo [OK] All dependencies installed successfully.

:: 4. Create .env if missing
if not exist "%~dp0.env" (
    echo.
    echo [*] Creating .env file from .env.example ...
    copy "%~dp0.env.example" "%~dp0.env" >nul
    echo [NOTE] Created .env file.
    echo Please open .env and set DB_PASSWORD to match your local MySQL root password!
) else (
    echo [OK] .env file exists.
)

:: 5. Initialize or verify MySQL database
echo.
echo [*] Checking database connection and schema...
if exist "%~dp0database\setup_database.py" (
    "%~dp0venv\Scripts\python.exe" "%~dp0database\setup_database.py"
) else (
    "%~dp0venv\Scripts\python.exe" -c "import db; print('[OK] Connected to database:', db.get_connection().database)" 2>nul
    if !ERRORLEVEL! equ 0 (
        echo [OK] Database connection verified!
    ) else (
        echo [NOTE] Could not connect to MySQL yet. Ensure MySQL Server is running and DB_PASSWORD in .env is correct.
    )
)

echo.
echo ========================================================
echo              SETUP COMPLETED SUCCESSFULLY!
echo ========================================================
echo You can now double-click "start.bat" to launch the application.
echo.
pause
