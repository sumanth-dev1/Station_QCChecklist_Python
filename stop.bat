@echo off
title Stopping Station QC Server
cd /d "%~dp0"

echo ========================================================
echo              STOPPING STATION QC SERVER
echo ========================================================

set found=0

:: Kill any process listening on port 5001
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5001" ^| findstr "LISTENING"') do (
    set found=1
    taskkill /F /PID %%a >nul 2>&1
)

:: Also close any window titled Station QC Waitress Server
taskkill /F /FI "WINDOWTITLE eq Station QC Waitress Server*" /T >nul 2>&1

ping 127.0.0.1 -n 2 >nul

:: Verify port is freed
netstat -aon | findstr ":5001" | findstr "LISTENING" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [WARNING] Port 5001 is still in use. Retrying...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5001" ^| findstr "LISTENING"') do (
        taskkill /F /PID %%a >nul 2>&1
    )
)

echo.
echo Station QC server has been stopped.
ping 127.0.0.1 -n 2 >nul
