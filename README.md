
# 🛡️ WIN.REVANCED | PowerShell Patch Manager

[![Platform: Windows](https://img.shields.io/badge/Platform-Windows-0078D4?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/4rjunKM/revanced-patch-manager-cli)
[![Shell: PowerShell](https://img.shields.io/badge/Shell-PowerShell-5391FE?style=for-the-badge&logo=powershell&logoColor=white)](https://microsoft.com/powershell)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A high-performance orchestration layer for the **ReVanced CLI**, designed for Windows.

---

## ⚡ Quick Start

Open **PowerShell** and paste the following command:

```powershell
iwr -useb https://raw.githubusercontent.com/4rjunKM/revanced-patch-manager-cli/main/setup.ps1 | iex
```

---

## 🛠️ Troubleshooting

### 1. `revanced` command not found?
The installer tries to add this to your profile. If it doesn't work after installation, run:
```powershell
. $PROFILE
```
Or simply close and reopen PowerShell.

### 2. Network Failure during install?
Some firewalls block PowerShell from downloading `.jar` files. 
- Disable VPN/Proxy.
- Ensure you have **Java 17** installed.
- Check that your terminal has administrator privileges if `C:\Users` access is restricted.

### 3. UI not opening?
The script opens the dashboard at `https://4rjunKM.github.io/revanced-patch-manager-cli/`. You can navigate there manually if your browser blocks the script.

---

## 📂 Project Commands
- `revanced`: Opens the utility folder and shows CLI help.
- `revanced -ui`: Opens the web-based management dashboard.

<p align="center">
  Built with ❤️ by <b>4rjunKM</b>
</p>
