
# Windows ReVanced Utility - Global Bootstrap
# Created by 4rjunKM
# Repository: https://github.com/4rjunKM/revanced-patch-manager-cli

$ProgressPreference = 'SilentlyContinue'
$InstallDir = "$HOME\ReVanced-Utility"
$GhUser = "4rjunKM"
$GhRepo = "revanced-patch-manager-cli"

Clear-Host
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   WIN.REVANCED UTILITY INSTALLER            " -ForegroundColor White -BackgroundColor Blue
Write-Host "   Version 4.9 | Agent: $GhUser              " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Environment Check
Write-Host "[*] Validating Environment..." -ForegroundColor Yellow

# Java Check
if (!(Get-Command java -ErrorAction SilentlyContinue)) {
    Write-Host "[!] Error: Java 17+ is required but not found." -ForegroundColor Red
    Write-Host "    Downloading Zulu JDK 17 installer..."
    Start-Process "https://www.azul.com/downloads/?package=jdk#zulu"
    exit
}

# 2. Directory Setup
if (!(Test-Path $InstallDir)) {
    New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
    Write-Host "[+] Created workspace at $InstallDir" -ForegroundColor Green
}
Set-Location $InstallDir

# 3. Fetching Core Binaries
Write-Host "[*] Fetching latest ReVanced binaries from GitHub..." -ForegroundColor Yellow

$CLI_URL = "https://github.com/revanced/revanced-cli/releases/latest/download/revanced-cli.jar"
$PATCHES_URL = "https://github.com/revanced/revanced-patches/releases/latest/download/patches.rvp"

try {
    Invoke-WebRequest -Uri $CLI_URL -OutFile "revanced-cli.jar"
    Invoke-WebRequest -Uri $PATCHES_URL -OutFile "patches.rvp"
    Write-Host "[+] Download Success: Core binaries are up to date." -ForegroundColor Green
} catch {
    Write-Host "[!] Network Failure: Could not reach GitHub releases." -ForegroundColor Red
}

# 4. Create Global Alias (Persistence)
$ProfilePath = $PROFILE.CurrentUserAllHosts
if (!(Test-Path $ProfilePath)) {
    New-Item -ItemType File -Path $ProfilePath -Force | Out-Null
}

$AliasCode = @"
function revanced {
    Set-Location "$InstallDir"
    Clear-Host
    Write-Host "--- WIN.REVANCED WORKSPACE ---" -ForegroundColor Cyan
    Write-Host "Location: $InstallDir" -ForegroundColor Gray
    Write-Host "Ready to build. Run the GUI or use CLI commands directly." -ForegroundColor White
    java -jar revanced-cli.jar --help
}
"@

if (!((Get-Content $ProfilePath) -contains 'function revanced {')) {
    Add-Content -Path $ProfilePath -Value "`n$AliasCode"
    Write-Host "[+] Added shortcut: You can now type 'revanced' in any terminal." -ForegroundColor Green
}

Write-Host ""
Write-Host "---------------------------------------------" -ForegroundColor Cyan
Write-Host "INSTALLATION COMPLETE" -ForegroundColor White
Write-Host "1. Navigate to: $InstallDir" -ForegroundColor Gray
Write-Host "2. Your Launch Command: revanced" -ForegroundColor Cyan
Write-Host "---------------------------------------------" -ForegroundColor Cyan
Write-Host ""
