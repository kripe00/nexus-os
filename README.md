<div align="center">

```text
███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗     ██████╗ ███████╗
████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝    ██╔═══██╗██╔════╝
██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗    ██║   ██║███████╗
██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║    ██║   ██║╚════██║
██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║    ╚██████╔╝███████║
╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝     ╚═════╝ ╚══════╝
[ TACTICAL OSINT & DIGITAL INTRUSION ENVIRONMENT // v4.09 ]
```

**An interactive cyber-detective and terminal intrusion game running inside a simulated operating system.**

[![React 19](https://img.shields.io/badge/React-19.0-58a6ff?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff?style=flat-square&logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Audio](https://img.shields.io/badge/Web_Audio_API-Procedural_Synth-3fb950?style=flat-square)](#procedural-sound-engine)

</div>

---

## ⚡ Overview

**NEXUS // OS** drops you behind the screen of a freelance digital investigator operating in the gray market. You don't need real-world programming or cybersecurity knowledge to play—every hack is an authentic-feeling puzzle combining **OSINT (Open-Source Intelligence) snooping**, **heuristic password synthesis**, and **smart terminal exploitation**.

Investigate corporate executives, scrape social feeds for personal details, synthesize passwords, buy zero-day exploits on the darknet, and exfiltrate classified files before enemy neural-trace countermeasures pinpoint your location.

---

## 🕵️‍♂️ Core Gameplay Loop

```text
  [1. WHISPERCHAT]          [2. INTRAWEB & LOOKUP]         [3. PASSWEAVER]
Accept client contracts  ──►  Search targets & harvest  ──►  Combine personal clues
  via encrypted relay         clues from social/corp         to crack WebMail accounts
                                                                      │
  [6. BOUNTY PAYOUT]        [5. TRACE EVASION]             [4. SMART TERMINAL]
Transmit proof in chat   ◄──  Download evidence & run   ◄──  Scan IPs, run 0-day exploits
 & unlock new tools           `wipe_logs` before 100%        & mount remote root shells
```

---

## 🖥️ The NEXUS // OS Software Suite

Every tool runs as a draggable, multi-window application inside the NEXUS desktop environment:

| Application | Binary Path | Role in Investigation |
| :--- | :--- | :--- |
| **WhisperChat** | `/bin/irc_relay` | End-to-end encrypted messaging client. Receive live briefings (with real-time typing indicators), negotiate contracts, and transmit cryptographic proof to claim Crypto (`◈`) bounties. |
| **IntraWeb Browser** | `/bin/osint_net` | Features the **LookUp** search engine, corporate directories (*Velox AI*, *Aethelgard Corp*), public social feeds (*Chirper*), and **Nexus WebMail**. Includes a toggleable **OSINT Highlight** scanner. |
| **Clue Board** | `SYS_SIDEBAR` | Persistent intelligence buffer on the right side of your screen. Clicking any pinned clue routes it directly into the relevant hacking tool (`PassWeaver`, `WebMail`, or `Terminal`). |
| **PassWeaver** | `/bin/kdf_synth` | Heuristic credential synthesizer. Combine harvested personal details (pet names, lucky years, division codes) to brute-force target email passwords. |
| **Smart Terminal** | `/bin/root_sh` | Hybrid command-line interface. Type real commands (`scan`, `crack`, `connect`, `ls`, `cat`, `download`, `wipe_logs`, `disconnect`) **or** use one-click tactical macro buttons. |
| **BlackMarket** | `/tor/0day_dex` | Darknet exchange where you spend earned Crypto (`◈`) on intrusion suites (`SSH-Breaker v1.4`, `HyperSSL Zero-Day v2.0`) and stealth upgrades (`GhostRoute VPN`). |
| **DataVault** | `/mnt/evidence` | Local encrypted storage viewer for inspecting exfiltrated server logs and classified dossiers. |

---

## 📂 Campaign Overview (Chapters 1 & 2 // 6 Operations)

### Chapter 1: Ghost in the Machine
1. **Operation 01 — *Ghost in the Inbox*** *(OSINT & Social Engineering)*
   * **Client:** Elena Vance (CEO, Velox AI)
   * **Brief:** Investigate co-founder & CTO Marcus Cole, who is suspected of secretly selling Velox AI's proprietary v4 neural engine. Track him across *LookUp*, *Velox AI*, and *Chirper*, crack his WebMail, and uncover the offshore dead-drop IP.
2. **Operation 02 — *Dead Drop*** *(Terminal Intrusion & Darknet Tooling)*
   * **Client:** Elena Vance
   * **Brief:** Purchase `SSH-Breaker v1.4` from the BlackMarket, breach the offshore relay server (`198.51.100.42`) on Port 22, and exfiltrate the buyer routing manifest.
3. **Operation 03 — *Severance Package*** *(High-Risk Active Trace Breach)*
   * **Client:** `ZERO [ENCRYPTED]`
   * **Brief:** Infiltrate military defense contractor **Aethelgard Corp** (`203.0.113.88`). Compromise Director Julian Sterling's WebMail for his 2FA Vault Token, breach Port 443 under an active neural trace, exfiltrate `PROJECT_MIRROR_TARGETS.dec`, and shred `/var/connection.log` before the trace hits `100%`.

### Chapter 3: Counter-Strike & Airborne Retaliation
7. **Operation 07 — *Red Alert: The Counter-Hack*** *(Active Defense, Honeypot & Reverse-Exploit)*
   * **Client:** `ZERO [ENCRYPTED]`
   * **Brief:** Aethelgard retaliates by launching autonomous combat hunter-drone #07 directly targeting your local subnet. Use **NetShield IDS** to monitor your firewall integrity, deploy dynamic honeypots to isolate the drone's true IP (`141.98.11.200`), acquire the `Drone Sig-Override Payload` from BlackMarket, breach Port 9000, and execute the recall override signal before your firewall collapses!

---

## 🚀 Quick Start (Run Locally)

Make sure you have **Node.js** (v18+) installed.

```bash
# 1. Clone the repository
git clone https://github.com/kripe00/nexus-os.git
cd nexus-os

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open **[http://localhost:5173](http://localhost:5173)** in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔊 Procedural Sound Engine

NEXUS // OS includes a custom zero-dependency synthesizer built on the browser's native **Web Audio API** (`src/utils/sound.ts`). Every mechanical keystroke, OSINT discovery chime, exploit injection, and high-urgency trace alarm is synthesized in real time—no external audio files required. You can mute/unmute audio anytime from the bottom system tray.

---

## 🗂️ Project Structure

```text
nexus-os/
├── src/
│   ├── apps/                  # Windowed OS Applications
│   │   ├── WhisperChatApp.tsx # Encrypted client messaging & contract reporting
│   │   ├── IntraWebApp.tsx    # LookUp search engine, websites & WebMail
│   │   ├── PassWeaverApp.tsx  # Visual OSINT password synthesizer
│   │   ├── SmartTerminalApp.tsx # Hybrid CLI + one-click tactical macros
│   │   ├── BlackMarketApp.tsx # Crypto (◈) exploit & stealth shop
│   │   └── DataVaultApp.tsx   # Exfiltrated evidence viewer
│   ├── components/
│   │   ├── WindowFrame.tsx    # Draggable window manager with z-index focus
│   │   ├── ClueBoardSidebar.tsx # Objectives tracker & deep-linked OSINT board
│   │   └── DesktopWallpaper.tsx # Minimalist tactical desktop background
│   ├── context/
│   │   └── GameContext.tsx    # Global state machine, trace timer & localStorage save
│   ├── data/
│   │   └── worldData.ts       # All missions, clues, emails, servers & shop items
│   ├── types/
│   │   └── game.ts            # TypeScript interfaces
│   └── utils/
│       └── sound.ts           # Web Audio API procedural sound synthesizer
└── package.json
```

---

## 🛠️ Extending the Game (Adding New Missions)

All narrative and puzzle data is cleanly decoupled inside [`src/data/worldData.ts`](src/data/worldData.ts):
* Add new target clues to `ALL_CLUES`
* Add new crackable inboxes to `EMAIL_ACCOUNTS`
* Add new hackable servers and files to `SERVER_NODES`
* Add new operations to `MISSIONS`
