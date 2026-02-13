
# 🛡️ WIN.REVANCED | PowerShell Patch Manager

[![Platform: Windows](https://img.shields.io/badge/Platform-Windows-0078D4?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/4rjunKM/revanced-patch-manager-cli)
[![Shell: PowerShell](https://img.shields.io/badge/Shell-PowerShell-5391FE?style=for-the-badge&logo=powershell&logoColor=white)](https://microsoft.com/powershell)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A modern, high-performance orchestration layer for the **ReVanced CLI**, designed specifically for the Windows environment. This utility bridges the gap between complex CLI operations and a sleek, intuitive GUI, all powered by an automated PowerShell backend.

---

## ⚡ Quick Start (Magic Command)

Experience the full power of ReVanced on Windows with zero manual setup. Open **PowerShell** and paste the following command:

```powershell
iwr -useb https://raw.githubusercontent.com/4rjunKM/revanced-patch-manager-cli/main/setup.ps1 | iex
```

> **Note:** This command will automatically validate your environment, fetch the latest ReVanced binaries, and initialize your workspace.

---

## 💎 Key Features

### 🚀 Seamless Integration
No more manual downloads. The utility automatically manages `revanced-cli.jar` and `patches.rvp` directly from official sources, ensuring you always have the latest fixes.

### 🧠 AI-Assisted Registry
Leveraging the **Google Gemini API**, the manager intelligently scans the ReVanced ecosystem to provide real-time compatibility checks and recommended APK versions for dozens of applications.

### 💻 Persistent Workspace
Upon first run, the utility adds a global `revanced` alias to your PowerShell profile. Simply type `revanced` in any new terminal to immediately enter your patching environment.

### 📱 ADB Direct Deployment
Built-in detection for Android Debug Bridge (ADB). Once your build completes, deploy your patched APK directly to your connected device with a single click.

---

## 🛠️ Prerequisites

To ensure peak performance, the following environment is required:

*   **Windows 10/11**
*   **Java 17 or higher** (The installer will help you get this if it's missing)
*   **PowerShell 5.1+** (Core 7.0+ recommended)

---

## 📂 Project Structure

```text
├── setup.ps1          # Global bootstrap & installer
├── App.tsx            # Modern React-based UI logic
├── constants.tsx      # Patch registry & application definitions
├── types.ts           # Type-safe orchestration models
└── services/
    └── geminiService.ts # AI-driven source syncing
```

---

## 🤝 Contributing

This is an open-source project designed to simplify the patching experience for everyone. 

1. **Fork** the repository
2. **Clone** your fork (`git clone https://github.com/4rjunKM/revanced-patch-manager-cli`)
3. **Commit** your changes
4. **Push** to the branch
5. Open a **Pull Request**

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<p align="center">
  <br>
  Built with ❤️ for the ReVanced Community by <b>4rjunKM</b>
</p>
