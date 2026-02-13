
# Windows ReVanced Utility - Global Bootstrap
# Usage: iwr -useb https://raw.githubusercontent.com/YOUR_USER/revanced-win-utility/main/setup.ps1 | iex

$ProgressPreference = 'SilentlyContinue'
$InstallDir = "$HOME\ReVanced-Utility"
$RepoUrl = "https://github.com/YOUR_USER/revanced-win-utility"

Clear-Host
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   WINDOWS REVANCED OPEN-SOURCE UTILITY      " -ForegroundColor White -BackgroundColor Blue
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Environment Check
Write-Host "[*] Checking System Prerequisites..." -ForegroundColor Yellow

# Java Check
if (!(Get-Command java -ErrorAction SilentlyContinue)) {
    Write-Host "[!] Error: Java 17+ is required but not found." -ForegroundColor Red
    Write-Host "    Redirecting to OpenJDK download page..."
    Start-Process "https://www.azul.com/downloads/?package=jdk#zulu"
    exit
}

# Git Check
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[!] Warning: Git not found. Source syncing will be limited." -ForegroundColor Yellow
}

# 2. Directory Setup
if (!(Test-Path $InstallDir)) {
    New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
    Write-Host "[+] Initializing workspace at $InstallDir" -ForegroundColor Green
}
Set-Location $InstallDir

# 3. Fetching Core Binaries
Write-Host "[*] Fetching latest ReVanced Mediums..." -ForegroundColor Yellow

$CLI_URL = "https://github.com/revanced/revanced-cli/releases/latest/download/revanced-cli.jar"
$PATCHES_URL = "https://github.com/revanced/revanced-patches/releases/latest/download/patches.rvp"

try {
    Invoke-WebRequest -Uri $CLI_URL -OutFile "revanced-cli.jar"
    Invoke-WebRequest -Uri $PATCHES_URL -OutFile "patches.rvp"
    Write-Host "[+] Sync Complete: revanced-cli.jar and patches.rvp updated." -ForegroundColor Green
} catch {
    Write-Host "[!] Network Error: Failed to download binaries." -ForegroundColor Red
}

# 4. ADB Check for Deployment
if (Get-Command adb -ErrorAction SilentlyContinue) {
    Write-Host "[+] ADB Detected: Direct deployment to Android enabled." -ForegroundColor Green
} else {
    Write-Host "[-] ADB Missing: Manual APK installation required." -ForegroundColor Gray
}

Write-Host ""
Write-Host "---------------------------------------------" -ForegroundColor Cyan
Write-Host "DEPLOYMENT READY: Use the GUI to build patches." -ForegroundColor White
Write-Host "Launch Command: cd $InstallDir; start ." -ForegroundColor Cyan
Write-Host "---------------------------------------------" -ForegroundColor Cyan
