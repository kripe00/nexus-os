---
name: nexus-release-packager
description: >-
  Build, bundle, and package NexusOS as a standalone desktop executable (.exe, dmg, AppImage)
  for commercial release on Steam, itch.io, or standalone distribution.
  Use when setting up Tauri or Electron, configuring production Vite builds,
  managing desktop app windows, offline persistence, and preparing store assets.
---

# NexusOS Desktop Release Packager

Use this skill when preparing, building, and bundling **NEXUS // OS** into a standalone commercial desktop application for **Steam**, **itch.io**, or direct download.

---

## 1. Architecture Strategy: Web to Standalone

NexusOS currently runs as a Vite + React web application. For commercial release, the recommended packager is **Tauri (v2)** due to its tiny binary size (~10MB vs ~120MB for Electron) and native system security.

```text
[ NexusOS Desktop Executable (Tauri / Rust) ]
       │
       ├── Embedded Chromium Webview (Frontend: React 19 + Tailwind)
       │
       └── Native Rust Layer / SQLite Bridge
             ├── Local AppData Storage (%APPDATA%/NexusOS/saves.db)
             ├── Window Controls & Borderless Fullscreen (F11)
             └── Steamworks SDK Integration (Achievements, Cloud Saves)
```

---

## 2. Production Vite Build Checklist

Before packaging into Tauri or Electron, verify the static production build:

```bash
# 1. Clean build verification
npm run build

# 2. Preview production build locally
npm run preview
```

### Critical Production Rules:
1. **Zero External Backend Mandate:**
   - The production client must run fully offline without requiring `node server/index.js` on port 3001.
   - All save states must store in `localStorage` or `IndexedDB` when running as a packaged client.
2. **Asset Pathing:**
   - Ensure `vite.config.ts` uses relative base paths (`base: './'`) if packaging into Electron/Tauri file URLs.

---

## 3. Quickstart Tauri Integration

To add Tauri to NexusOS:

```bash
# 1. Add Tauri CLI
npm install -D @tauri-apps/cli

# 2. Initialize Tauri configuration
npx tauri init
```

In `src-tauri/tauri.conf.json`:
- `build.devUrl`: `http://localhost:5173`
- `build.frontendDist`: `../dist`
- `app.windows[0].title`: `NEXUS // OS`
- `app.windows[0].width`: 1280
- `app.windows[0].height`: 800
- `app.windows[0].minWidth`: 1024
- `app.windows[0].minHeight`: 600

---

## 4. Steamworks SDK & Distribution Prep

When publishing to Steam:
1. **Steam App ID:** Configure `steam_appid.txt` in the root executable folder.
2. **Steam Cloud:** Map `%APPDATA%/NexusOS/saves/` to Steam Auto-Cloud in the Steamworks partner portal.
3. **Steam Achievements:** Wire game progression milestones:
   - `ACH_CHAPTER_1_CLEARED` — Complete Operation 03.
   - `ACH_CHAPTER_2_CLEARED` — Complete Operation 06.
   - `ACH_COUNTER_STRIKE` — Override drone in Operation 07.
   - `ACH_MASTER_SYNTHESIZER` — Synthesize 5 passwords without failed hashes.
