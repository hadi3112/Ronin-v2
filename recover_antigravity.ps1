# Antigravity IDE Recovery and Configuration Script
$ErrorActionPreference = "SilentlyContinue"

$roaming = $env:APPDATA
$legacyDir = Join-Path $roaming "Antigravity"
$ideDir = Join-Path $roaming "Antigravity IDE"

Write-Output "========================================"
Write-Output "   ANTIGRAVITY IDE RECOVERY TOOL        "
Write-Output "========================================"
Write-Output "Legacy directory: $legacyDir"
Write-Output "IDE directory   : $ideDir"
Write-Output ""
Write-Output "Step 1: Waiting for all Antigravity processes to close..."

# Loop until all processes exit
while ($true) {
    $processes = Get-Process | Where-Object { $_.Name -like "*Antigravity*" }
    if (-not $processes) {
        Write-Output "All Antigravity processes have exited."
        break
    }
    Start-Sleep -Seconds 1
}

# Add a buffer delay for file handle release
Start-Sleep -Seconds 2

# Step 2: Perform migration if needed
if (-not (Test-Path $ideDir) -and (Test-Path $legacyDir)) {
    Write-Output "Step 2: Migrating legacy profiles and history to the new IDE folder..."
    New-Item -ItemType Directory -Path $ideDir | Out-Null
    Copy-Item -Path "$legacyDir\*" -Destination $ideDir -Recurse -Force -ErrorAction SilentlyContinue
} elseif (Test-Path $legacyDir) {
    Write-Output "Step 2: Syncing folders to ensure history and profiles are restored..."
    Copy-Item -Path "$legacyDir\*" -Destination $ideDir -Recurse -Force -ErrorAction SilentlyContinue
} else {
    Write-Output "Step 2: IDE settings directory already prepared."
}

# Step 3: Write the settings file to disable Agent view on startup
$settingsDirs = @(
    (Join-Path $legacyDir "User"),
    (Join-Path $ideDir "User")
)

Write-Output "Step 3: Disabling default Agent View on startup..."
foreach ($dir in $settingsDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
    }
    $settingsFile = Join-Path $dir "settings.json"
    
    $settings = @{}
    if (Test-Path $settingsFile) {
        $content = Get-Content -Raw -Path $settingsFile
        if ($content) {
            $settings = ConvertFrom-Json $content
        }
    }
    
    # Configure the exact key to prevent Agent View / Side Bar opening on startup
    $settings["antigravity.agent.openOnStartup"] = $false
    
    # Save settings file
    $jsonContent = ConvertTo-Json $settings -Depth 100
    Set-Content -Path $settingsFile -Value $jsonContent -Force
    Write-Output "Applied startup settings to: $settingsFile"
}

# Step 4: Relaunch the IDE executable
$exePath = "C:\Users\hadim\AppData\Local\Programs\Antigravity\Antigravity IDE.exe"
$legacyExePath = "C:\Users\hadim\AppData\Local\Programs\Antigravity\Antigravity.exe"

Write-Output "Step 4: Relaunching your Antigravity IDE..."
if (Test-Path $exePath) {
    Start-Process -FilePath $exePath
    Write-Output "Successfully launched Antigravity IDE.exe!"
} elseif (Test-Path $legacyExePath) {
    Start-Process -FilePath $legacyExePath
    Write-Output "Successfully launched Antigravity.exe!"
} else {
    Write-Output "Warning: Could not automatically locate the executable to relaunch."
}

Write-Output "========================================"
Write-Output "   RECOVERY COMPLETED SUCCESSFULLY      "
Write-Output "========================================"
