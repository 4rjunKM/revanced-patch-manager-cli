
# Windows ReVanced Utility - Global Bootstrap
# Created by 4rjunKM
# Repository: https://github.com/4rjunKM/revanced-patch-manager-cli

# 1. Network & Protocol Hardening
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

$ProgressPreference = 'SilentlyContinue'
$InstallDir = "$HOME\ReVanced-Utility"
$GhUser = "4rjunKM"
$GhRepo = "revanced-patch-manager-cli"
$DashboardUrl = "https://4rjunKM.github.io/revanced-patch-manager-cli/"

Clear-Host
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   WIN.REVANCED UTILITY INSTALLER            " -ForegroundColor White -BackgroundColor Blue
Write-Host "   Version 5.0 | High-Reliability Mode       " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# 2. Pre-Flight Checks
Write-Host "[*] Checking Environment..." -ForegroundColor Yellow

if (!(Get-Command java -ErrorAction SilentlyContinue)) {
    Write-Host "[!] JAVA MISSING: Redirecting to Zulu JDK 17..." -ForegroundColor Red
    Start-Process "https://www.azul.com/downloads/?package=jdk#zulu"
    Write-Host "[!] Please install Java and restart this script." -ForegroundColor Yellow
    exit
}

if (!(Test-Path $InstallDir)) {
    New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
    Write-Host "[+] Created workspace: $InstallDir" -ForegroundColor Green
}

# 3. Robust Download Engine
Write-Host "[*] Synchronizing ReVanced Binaries..." -ForegroundColor Yellow

$Files = @{
    "revanced-cli.jar" = "https://github.com/revanced/revanced-cli/releases/latest/download/revanced-cli.jar"
    "patches.rvp"      = "https://github.com/revanced/revanced-patches/releases/latest/download/patches.rvp"
}

foreach ($File in $Files.Keys) {
    $Target = Join-Path $InstallDir $File
    try {
        Write-Host "    -> Downloading $File..." -NoNewline
        Invoke-WebRequest -Uri $Files[$File] -OutFile $Target -UserAgent $UA -UseBasicParsing -TimeoutSec 30
        Write-Host " [DONE]" -ForegroundColor Green
    } catch {
        Write-Host " [FAILED]" -ForegroundColor Red
        Write-Host "    ERROR: $($_.Exception.Message)" -ForegroundColor Gray
        Write-Host "    TIP: Try disabling your VPN or Firewall temporarily." -ForegroundColor Yellow
    }
}

# 4. Alias Logic (Current Session + Persistence)
$AliasCode = @"
function revanced {
    param([switch]`$ui)
    if (`$ui) {
        Write-Host "[*] Launching Dashboard..." -ForegroundColor Cyan
        Start-Process "$DashboardUrl"
        return
    }
    Set-Location "$InstallDir"
    Clear-Host
    Write-Host "--- WIN.REVANCED WORKSPACE ---" -ForegroundColor Cyan
    Write-Host "JAR Path: $InstallDir" -ForegroundColor Gray
    Write-Host "Commands: 'revanced -ui' for Dashboard" -ForegroundColor Green
    Write-Host "------------------------------"
    if (Test-Path "$InstallDir\revanced-cli.jar") {
        java -jar "$InstallDir\revanced-cli.jar" --help
    } else {
        Write-Host "[!] revanced-cli.jar not found in $InstallDir" -ForegroundColor Red
    }
}
"@

# Define in current session immediately
Invoke-Expression $AliasCode

# Persist to Profile
$ProfilePath = $PROFILE.CurrentUserAllHosts
if (!(Test-Path $ProfilePath)) {
    $null = New-Item -Path $ProfilePath -ItemType File -Force
}

if (!((Get-Content $ProfilePath -ErrorAction SilentlyContinue) -contains 'function revanced {')) {
    Add-Content -Path $ProfilePath -Value "`n$AliasCode"
    Write-Host "[+] Alias 'revanced' persisted to: $ProfilePath" -ForegroundColor Green
}

# 5. Finalize
Write-Host ""
Write-Host "---------------------------------------------" -ForegroundColor Cyan
Write-Host "   INSTALLATION COMPLETE" -ForegroundColor White
Write-Host "---------------------------------------------" -ForegroundColor Cyan
Write-Host "[!] IMPORTANT: The 'revanced' command is now active." -ForegroundColor Green
Write-Host "[!] Try it now: Type 'revanced' or 'revanced -ui'" -ForegroundColor Cyan
Write-Host ""

# Launch UI
Start-Process $DashboardUrl
