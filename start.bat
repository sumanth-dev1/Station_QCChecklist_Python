@echo off
setlocal enabledelayedexpansion
title Station QC Launcher
cd /d "%~dp0"

echo ========================================================
echo                STATION QC APPLICATION
echo ========================================================

:: 1. Check if server is already running
curl.exe -s -m 2 http://localhost:5001/health >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo.
    echo Station QC server is ALREADY running on http://localhost:5001/
    echo Opening application in your browser...
    start http://localhost:5001/
    ping 127.0.0.1 -n 3 >nul
    exit /b 0
)

:: 2. Check if virtual environment python exists, auto-create if missing
if not exist "%~dp0venv\Scripts\python.exe" (
    echo.
    echo [*] Virtual environment not found in newly cloned repository.
    echo [*] Automatically initializing Python virtual environment...
    echo.

    python --version >nul 2>&1
    if !ERRORLEVEL! neq 0 (
        echo [ERROR] Python is not installed or not in system PATH!
        echo Please install Python 3.10+ from python.org and check "Add python.exe to PATH".
        pause
        exit /b 1
    )

    for /f "tokens=*" %%v in ('python --version') do echo Found %%v

    echo [*] Creating virtual environment in .\venv ...
    python -m venv "%~dp0venv"
    if !ERRORLEVEL! neq 0 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )

    echo [*] Installing dependencies from requirements.txt (this takes ~30 seconds) ...
    "%~dp0venv\Scripts\python.exe" -m pip install --upgrade pip --quiet
    "%~dp0venv\Scripts\pip.exe" install -r "%~dp0requirements.txt"
    if !ERRORLEVEL! neq 0 (
        echo [ERROR] Failed to install dependencies from requirements.txt.
        pause
        exit /b 1
    )

    if not exist "%~dp0.env" (
        copy "%~dp0.env.example" "%~dp0.env" >nul
        echo [NOTE] Created .env file from .env.example.
    )

    echo.
    echo [OK] Virtual environment successfully configured!
    echo.
)

:: 3. Start server
echo.
echo Starting Station QC Waitress Server on port 5001...
start "Station QC Waitress Server" cmd /c ""%~dp0venv\Scripts\python.exe" run.py || pause"

echo Waiting for server to initialize on http://localhost:5001/ ...
set /a attempts=0

:WAIT_LOOP
set /a attempts+=1
ping 127.0.0.1 -n 2 >nul

curl.exe -s -m 2 http://localhost:5001/health >nul 2>&1
if !ERRORLEVEL! equ 0 (
    echo.
    echo Server is ready! (Connected in !attempts! seconds)
    echo Opening application at: http://localhost:5001/
    start http://localhost:5001/
    ping 127.0.0.1 -n 3 >nul
    exit /b 0
)

if !attempts! lss 15 (
    <nul set /p=.
    goto WAIT_LOOP
)

echo.
echo [WARNING] Server took longer than 15 seconds to respond.
echo Please check the "Station QC Waitress Server" window for any errors (e.g. MySQL connection).
echo Opening browser anyway...
start http://localhost:5001/
pause
