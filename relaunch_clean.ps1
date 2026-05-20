# Detached clean restart script
Start-Sleep -Seconds 3

# Kill all hung processes
Get-Process | Where-Object { $_.Name -like "*Antigravity*" -or $_.Name -eq "language_server" } | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2

# Launch the IDE
$exePath = "C:\Users\hadim\AppData\Local\Programs\Antigravity\Antigravity IDE.exe"
if (Test-Path $exePath) {
    Start-Process -FilePath $exePath
} else {
    $legacyExePath = "C:\Users\hadim\AppData\Local\Programs\Antigravity\Antigravity.exe"
    if (Test-Path $legacyExePath) {
        Start-Process -FilePath $legacyExePath
    }
}
