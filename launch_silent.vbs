Option Explicit

Dim WshShell, fso, strDir, pythonwExe, runPy, checkCmd, ret, i, serverReady

Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

strDir = fso.GetParentFolderName(WScript.ScriptFullName)
pythonwExe = strDir & "\venv\Scripts\pythonw.exe"
runPy = strDir & "\run.py"
WshShell.CurrentDirectory = strDir

checkCmd = "cmd /c curl.exe -s -m 2 http://localhost:5001/health >nul 2>&1"

' 1. Check if server is already responding
ret = WshShell.Run(checkCmd, 0, True)

If ret <> 0 Then
    ' Check if pythonw exists
    If Not fso.FileExists(pythonwExe) Then
        MsgBox "Station QC Python environment not found at:" & vbCrLf & pythonwExe & vbCrLf & vbCrLf & "Please run start.bat first to configure.", vbCritical, "Station QC - Error"
        WScript.Quit 1
    End If

    ' Start server in background (0 = hidden window)
    WshShell.Run """" & pythonwExe & """ """ & runPy & """", 0, False

    ' Wait up to 15 seconds for server to respond
    serverReady = False
    For i = 1 To 15
        WScript.Sleep 1000
        ret = WshShell.Run(checkCmd, 0, True)
        If ret = 0 Then
            serverReady = True
            Exit For
        End If
    Next

    If Not serverReady Then
        MsgBox "Station QC Server did not start within 15 seconds." & vbCrLf & vbCrLf & "Please ensure MySQL is running, or run start.bat to check details.", vbExclamation, "Station QC - Warning"
    End If
End If

' 2. Open application in default browser
WshShell.Run "http://localhost:5001/"
