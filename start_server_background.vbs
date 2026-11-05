Option Explicit

Dim WshShell, fso, strDir, pythonwExe, runPy, checkCmd, ret

Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

strDir = fso.GetParentFolderName(WScript.ScriptFullName)
pythonwExe = strDir & "\venv\Scripts\pythonw.exe"
runPy = strDir & "\run.py"
WshShell.CurrentDirectory = strDir

checkCmd = "cmd /c curl.exe -s -m 2 http://localhost:5001/health >nul 2>&1"

' Check if server is already running
ret = WshShell.Run(checkCmd, 0, True)

If ret <> 0 And fso.FileExists(pythonwExe) Then
    ' Start server silently in background
    WshShell.Run """" & pythonwExe & """ """ & runPy & """", 0, False
End If
