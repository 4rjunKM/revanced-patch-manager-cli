
# Windows ReVanced Utility - Global Bootstrap
# Created by 4rjunKM
# Repository: https://github.com/4rjunKM/revanced-patch-manager-cli

# Force TLS 1.2 for secure GitHub connections (Fixes "Network Failure" on older systems)
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$ProgressPreference = 'SilentlyContinue'
$InstallDir = "$HOME\ReVanced-Utility"
$GhUser = "4rjunKM"
$GhRepo = "revanced-patch-manager-cli"
$DashboardUrl = "https://4rjunKM.github.io/revanced-patch-manager-cli/" # Update this to your actual deployment URL

Clear-Host
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   WIN.REVANCED UTILITY INSTALLER            " -ForegroundColor White -BackgroundColor Blue
Write-Host "   Version 4.9 | Deployment Agent            " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Environment Check
Write-Host "[*] Validating Environment..." -ForegroundColor Yellow

# Java Check
if (!(Get-Command java -ErrorAction SilentlyContinue)) {
    Write-Host "[!] Error: Java 17+ is required but not found." -ForegroundColor Red
    Write-Host "    Redirecting to OpenJDK download page..."
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
    # Using -UseBasicParsing to avoid IE engine dependencies
    Invoke-WebRequest -Uri $CLI_URL -OutFile "revanced-cli.jar" -UseBasicParsing
    Invoke-WebRequest -Uri $PATCHES_URL -OutFile "patches.rvp" -UseBasicParsing
    Write-Host "[+] Binary Sync Successful." -ForegroundColor Green
} catch {
    Write-Host "[!] Network Error: Failed to reach GitHub. Please check your internet connection." -ForegroundColor Red
    Write-Host "    Technical Note: Ensure TLS 1.2 is enabled on your system." -ForegroundColor Gray
}

# 4. Create Global Alias (Persistence)
$ProfilePath = $PROFILE.CurrentUserAllHosts
if (!(Test-Path $ProfilePath)) {
    New-Item -ItemType File -Path $ProfilePath -Force | Out-Null
}

$AliasCode = @"
function revanced {
    param([switch]`$ui)
    if (`$ui) {
        Start-Process "$DashboardUrl"
        return
    }
    Set-Location "$InstallDir"
    Clear-Host
    Write-Host "--- WIN.REVANCED WORKSPACE ---" -ForegroundColor Cyan
    Write-Host "Location: $InstallDir" -ForegroundColor Gray
    Write-Host "Commands: 'revanced -ui' to launch dashboard" -ForegroundColor Green
    java -jar revanced-cli.jar --help
}
"@

if (!((Get-Content $ProfilePath) -contains 'function revanced {')) {
    Add-Content -Path $ProfilePath -Value "`n$AliasCode"
    Write-Host "[+] Shortcut Created: You can now type 'revanced' anywhere." -ForegroundColor Green
}

Write-Host ""
Write-Host "[*] INITIALIZING DASHBOARD UI..." -ForegroundColor Cyan
Start-Sleep -Seconds 1
Start-Process $DashboardUrl

Write-Host "---------------------------------------------" -ForegroundColor Cyan
Write-Host "SETUP COMPLETE" -ForegroundColor White
Write-Host "The dashboard should have opened in your browser." -ForegroundColor Gray
Write-Host "If not, visit: $DashboardUrl" -ForegroundColor Cyan
Write-Host "---------------------------------------------" -ForegroundColor Cyan
Write-Host ""
