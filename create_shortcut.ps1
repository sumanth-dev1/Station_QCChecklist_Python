$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$desktopDir = [System.Environment]::GetFolderPath('Desktop')
$iconPath = Join-Path $projectDir "static\stationary_kavach_logo.ico"

# 1. Create Desktop Shortcut: Station QC
$wsh = New-Object -ComObject WScript.Shell
$shortcutPath = Join-Path $desktopDir "Station QC.lnk"
$shortcut = $wsh.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "wscript.exe"
$shortcut.Arguments = "`"$projectDir\launch_silent.vbs`""
$shortcut.WorkingDirectory = $projectDir
$shortcut.Description = "Launch Station QC Python Application (http://localhost:5001/)"
if (Test-Path $iconPath) {
    $shortcut.IconLocation = "$iconPath,0"
} else {
    $shortcut.IconLocation = "shell32.dll,13"
}
$shortcut.Save()
Write-Output "Created Desktop Shortcut at: $shortcutPath"

# 2. Also create a URL shortcut on Desktop as backup
$urlPath = Join-Path $desktopDir "Station QC (Web Link).url"
$urlContent = @"
[InternetShortcut]
URL=http://localhost:5001/
IconIndex=0
IconFile=$iconPath
"@
[System.IO.File]::WriteAllText($urlPath, $urlContent)
Write-Output "Created Web Link at: $urlPath"

# 3. Add to Windows Startup folder so server runs automatically on boot
$startupDir = [System.Environment]::GetFolderPath('Startup')
$startupShortcutPath = Join-Path $startupDir "Station QC Server.lnk"
$startupShortcut = $wsh.CreateShortcut($startupShortcutPath)
$startupShortcut.TargetPath = "wscript.exe"
$startupShortcut.Arguments = "`"$projectDir\start_server_background.vbs`""
$startupShortcut.WorkingDirectory = $projectDir
$startupShortcut.Description = "Auto-start Station QC Waitress Server in background on Windows login"
if (Test-Path $iconPath) {
    $startupShortcut.IconLocation = "$iconPath,0"
}
$startupShortcut.Save()
Write-Output "Created Startup Shortcut at: $startupShortcutPath"
