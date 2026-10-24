<div align="center">

```text
███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗     ██████╗ ███████╗
████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝    ██╔═══██╗██╔════╝
██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗    ██║   ██║███████╗
██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║    ██║   ██║╚════██║
██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║    ╚██████╔╝███████║
╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝     ╚═════╝ ╚══════╝
[ TACTICAL OSINT & DIGITAL INTRUSION ENVIRONMENT // KERNEL v4.09 ]
```

**An authentic cyber-espionage and digital investigation game played inside a windowed, dark-mode tactical operating system.**

</div>

---

## Table of Contents
1. [Game Overview & Setting](#-game-overview--setting)
2. [Core Gameplay Loop & Mechanics](#-core-gameplay-loop--mechanics)
3. [The Desktop Arsenal (Application Guide)](#-the-desktop-arsenal-application-guide)
4. [Campaign Operations Guide (Chapters 1–3)](#-campaign-operations-guide-chapters-13)
5. [Investigation Field Manual & Tactical Tips](#-investigation-field-manual--tactical-tips)
6. [How to Launch the Rig](#-how-to-launch-the-rig)

---

## 🛰️ Game Overview & Setting

In **NEXUS // OS**, you sit behind the screen of a freelance digital investigator operating in the encrypted underbelly of the global web. You need **zero real-world programming or cybersecurity knowledge** to play—every breach is engineered as an intuitive, immersive detective puzzle combining **OSINT (Open-Source Intelligence)**, **social engineering**, **credential synthesis**, and **command-line exploitation**.

You begin taking mundane freelance contracts from tech founders who suspect their co-founders of foul play. However, as you trace unencrypted packets and forensic drop-off points, you stumble into a global predictive surveillance conspiracy orchestrated by sovereign defense contractor **Aethelgard Corp** and their clandestine panopticon initiative: **Project Mirror**.

---

## 🔄 Core Gameplay Loop & Mechanics

Every operation in NEXUS // OS follows a multi-phase investigative lifecycle:

```text
  ┌───────────────────────┐         ┌────────────────────────┐         ┌────────────────────────┐
  │  1. BRIEFING & CHAT   │         │  2. RECON & OSINT      │         │  3. CREDENTIAL FORGERY │
  │  Accept contract via  │───────► │  Search targets via    │───────► │  Synthesize passwords  │
  │  WhisperChat relay    │         │  LookUp & Chirper feed │         │  or spear-phish targets│
  └───────────────────────┘         └────────────────────────┘         └────────────────────────┘
                                                                                    │
  ┌───────────────────────┐         ┌────────────────────────┐                      │
  │  6. ESCROW SETTLEMENT │         │  5. TRACE COUNTERMEAS. │                      │
  │  Transmit proof &     │◄─────── │  Shred connection logs │◄─────────────────────┘
  │  collect Crypto (◈)   │         │  before Active Trace   │         ┌────────────────────────┐
  └───────────────────────┘         └────────────────────────┘         │  4. SERVER INTRUSION   │
                                                ▲                      │  Scan ports, purchase  │
                                                └──────────────────────│  0-days, mount root sh │
                                                                       └────────────────────────┘
```

1. **Contract Negotiation (`WhisperChat`):** Clients message you via encrypted relay with live typing streams. You choose how to respond, accept the operation, and receive objectives.
2. **Reconnaissance & OSINT Harvesting (`IntraWeb`):** Use the built-in search engine to examine target dossiers, press releases, corporate directories, and social media posts. Clicking any critical text string (dog names, birth years, military callouts, IP addresses) pins it directly into your **Clue Board**.
3. **Exploitation & Social Engineering (`PassWeaver` / `SpearPhish`):**
   * Feed personal intelligence into `PassWeaver` to crack corporate webmail passwords through heuristic mask combinations.
   * Or craft bespoke `SpearPhish` emails with forged sender headers and tailored lures to trick executives into voluntarily submitting credentials.
4. **Server Intrusion (`Smart Terminal`):** Run port scans (`scan <ip>`), verify open security daemons, and crack vulnerable ports using modules bought from the `BlackMarket`.
5. **High-Stakes Exfiltration & Active Trace:** Heavy corporate servers deploy neural counter-intrusion grids. When cracking secured nodes, a countdown timer begins. You must locate the classified archive (`ls`, `cat`, `download`), shred your forensic trails (`wipe_logs`), and sever the link (`disconnect`) before the trace hits 100%.
6. **Active Defense (`NetShield IDS`):** When enemies counter-attack your workstation, monitor firewall health in real time, deploy honeypot traps to isolate hostile IP addresses, and launch direct reverse-exploits.

---

## 🖥️ The Desktop Arsenal (Application Guide)

### 💬 WhisperChat (`/bin/irc_relay`)
* **Role:** Encrypted point-to-point communication suite.
* **Details:** Your clients (Elena Vance, the rogue architect ZERO) communicate here with real-time typing indicators. When an operation's objectives are complete, you must return to WhisperChat to transmit your cryptographic proof and collect your Crypto (`◈`) payout.

### 🌐 IntraWeb Browser (`/bin/osint_net`)
* **Role:** Full-featured in-game browser.
* **Features:**
  * **LookUp Search Engine:** Type names or keywords (`Marcus Cole`, `Velox AI`, `Viktor Reyes`, `Facility Delta`) or use query suggestion chips to index web nodes.
  * **Corporate Portals:** Read internal press bulletins and executive rosters.
  * **Chirper Social Stream:** Browse public social micro-posts to discover personal details that targets carelessly publish.
  * **Nexus WebMail Gateway:** The web-based corporate email client where you authenticate into compromised executive inboxes to intercept drafts and classified attachments.
  * **OSINT Scanner Toggle:** Switch on the tactical highlighter at the top of the browser to illuminate actionable strings within web pages.

### 📌 The Clue Board (`SYS_SIDEBAR`)
* **Role:** Persistent intelligence dashboard on the right of your workspace.
* **Interactive Routing:**
  * Displays active operation directives and completed checklists.
  * Lists every compromised corporate credential with a one-click auto-fill button into WebMail.
  * Clicking an **IP Clue** immediately focuses `Smart Terminal` with the remote host set.
  * Clicking an **Email Clue** loads the target into `PassWeaver`.
  * Clicking **Personal Detail Clues** slots them straight into password synthesis inputs.

### 🔑 PassWeaver (`/bin/kdf_synth`)
* **Role:** Heuristic credential synthesizer.
* **Details:** Select a target profile and two harvested OSINT tokens (e.g., Pet Name `Koda` + Lucky Year `1997`). Watch the synthesis engine calculate permutations in real time with audio feedback. A successful hash collision unlocks the target's plaintext WebMail password.

### 🎣 SpearPhish (`/bin/social_eng`)
* **Role:** Social engineering campaign designer.
* **Details:** Allows you to forge sender email headers (e.g., veterinary hospitals, military pension offices). You must choose the subject line that targets the victim's psychological soft spots and select a malicious payload (cloned authentication portal vs. suspicious executable). If your recon is accurate, the target bites, handing over root tokens immediately.

### 💻 Smart Terminal (`/bin/root_sh`)
* **Role:** Hybrid command-line interface.
* **Details:** Supports full manual command execution as well as one-click tactical macro buttons:
  * `scan <ip>` — Executes SYN port scan and fingerprints security levels.
  * `crack <port>` — Executes installed binary exploit against listening port (22, 80, 443, 8080, 9000).
  * `connect <ip>` — Establishes SSH/encrypted tunnel into remote host filesystem.
  * `ls` — Lists remote directory contents.
  * `cat <filename>` — Dumps remote file contents to stdout.
  * `download <filename>` — Exfiltrates file and extracts embedded clues to your DataVault.
  * `wipe_logs` — Overwrites `/var/connection.log` (3 passes) to neutralize Active Trace.
  * `disconnect` — Closes remote session cleanly.

### 🛡️ NetShield IDS (`/bin/firewall_ids`)
* **Role:** Workstation perimeter defense and intrusion detection.
* **Details:** Shows your live firewall integrity gauge (100% → 0%). When hostile combat drones assault your local IP, your firewall decays under packet floods. Use manual reinforcement to buy time, deploy a dynamic honeypot trap to isolate the attacker's IP (`141.98.11.200`), and launch a counter-breach.

### 🛒 BlackMarket (`/tor/0day_dex`)
* **Role:** Darknet hardware and software repository.
* **Inventory:**
  * `SSH-Breaker v1.4` (`200 ◈`) — Brute-forces Port 22 on offshore drop-off relays.
  * `HyperSSL Zero-Day v2.0` (`450 ◈`) — Bypasses Port 443 on hardened corporate vaults.
  * `GhostRoute VPN Chain v3.1` (`250 ◈`) — Routes traffic through 7 onion nodes, halving enemy Active Trace speed.
  * `SatCom Hijack Framework v1.1` (`600 ◈`) — Over-the-air RF packet injection for Port 80 orbital downlinks.
  * `Quantum Core Exploit v3.0` (`1200 ◈`) — Military zero-day payload engineered to breach supercomputing clusters on Port 8080.
  * `Drone Sig-Override Payload v4.0` (`1500 ◈`) — Reverse-hijack payload targeting combat drones on Port 9000.

### 💾 DataVault (`/mnt/evidence`)
* **Role:** Encrypted storage filesystem.
* **Details:** All exfiltrated files, buyer manifests, citizen surveillance databases, and telemetry logs are decrypted and viewable here for forensic inspection.

---

## 📜 Campaign Operations Guide (Chapters 1–3)

### CHAPTER 1: Ghost in the Machine
* **Operation 01 — *Ghost in the Inbox***
  * *Client:* Elena Vance (CEO, Velox AI) | *Bounty:* `250 ◈`
  * *Objective:* Investigate co-founder and CTO Marcus Cole. Search Velox AI's directory on LookUp for his work email, scour Chirper to find his Alaskan Malamute's name (`Koda`) and lucky year (`1997`), synthesize his password in PassWeaver, and uncover the offshore dead-drop IP hidden in his WebMail inbox.
* **Operation 02 — *Dead Drop***
  * *Client:* Elena Vance | *Bounty:* `500 ◈`
  * *Objective:* Acquire `SSH-Breaker v1.4` from the BlackMarket, breach the offshore relay server (`198.51.100.42`) on Port 22 via Terminal, and exfiltrate the buyer manifest proving that military defense giant Aethelgard Corp bought the neural engine.
* **Operation 03 — *Severance Package***
  * *Client:* `ZERO [ENCRYPTED]` | *Bounty:* `1500 ◈`
  * *Objective:* Infiltrate Aethelgard Corp's internal vault (`203.0.113.88`). Snoop Director Julian Sterling on Chirper (Yacht `Hyperion` + Division `0451`) to crack his inbox for the secondary vault token (`OMEGA-99-KEY`). Breach Port 443 under Active Trace, exfiltrate `PROJECT_MIRROR_TARGETS.dec`, wipe connection logs, and discover that your own handle is Target #002 on their priority watchlist.

### CHAPTER 2: Deep State Mirror
* **Operation 04 — *Orbital Eye***
  * *Client:* `ZERO [ENCRYPTED]` | *Bounty:* `2000 ◈`
  * *Objective:* Aethelgard re-tasks military surveillance satellite *VALKYRIE-7* to triangulate your exit node. Buy the `SatCom Hijack Framework v1.1`, breach orbital ground downlink `185.220.101.5` on Port 80, and exfiltrate the telemetry logs uncovering Facility Delta's coordinates.
* **Operation 05 — *The Gatekeeper***
  * *Client:* `ZERO [ENCRYPTED]` | *Bounty:* `2500 ◈`
  * *Objective:* Profile Chief Security Officer Viktor Reyes (`@reyes_actual`) on Chirper. Harvest his military unit callout (`Phantom77`) and gatehouse shift code (`8821`), use PassWeaver or SpearPhish to breach his corporate inbox (`v.reyes@aethelgard.corp`), and extract the Project Mirror central supercluster IP (`194.165.16.100`).
* **Operation 06 — *The Kill-Switch***
  * *Client:* `ZERO [ENCRYPTED]` | *Bounty:* `5000 ◈`
  * *Objective:* Arm yourself with the `Quantum Core Exploit v3.0`. Infiltrate the Project Mirror central supercluster on Port 8080 under violent Active Trace, download `GLOBAL_CITIZEN_DOSSIERS.db`, and execute `wipe_logs` to inject the unrecoverable firmware purge (`TITAN-ZERO-PURGE`).

### CHAPTER 3: Counter-Strike & Airborne Retaliation
* **Operation 07 — *Red Alert: The Counter-Hack***
  * *Client:* `ZERO [ENCRYPTED]` | *Bounty:* `10000 ◈`
  * *Objective:* Retaliation is instant: Director Sterling deploys autonomous combat hunter-drone #07 against your local IP! Watch your firewall decay in NetShield IDS, reinforce your buffers, activate the honeypot to trap the drone's true IP (`141.98.11.200`), purchase the `Drone Sig-Override Payload`, breach Port 9000 in Terminal, and broadcast `OVERRIDE-GHOST-RECALL` to crash the drone into Sterling's command ship!

---

## 💡 Investigation Field Manual & Tactical Tips

* **Never disconnect while logs are dirty:** On servers marked with `HIGH (ACTIVE TRACE)`, disconnecting without running `wipe_logs` leaves forensic footprints and triggers an emergency security lockout.
* **Invest in Stealth early:** Buying `GhostRoute VPN Chain` (`250 ◈`) from the BlackMarket permanently cuts all enemy Active Trace speeds by 50%, giving you crucial extra seconds during intense breaches.
* **Use Cross-App Deep Linking:** You don't have to re-type IPs or target emails manually. Clicking any clue in your right-hand **Clue Board** automatically opens the correct application and pre-loads the data.
* **Inspect Mode in IntraWeb:** If you're stuck looking for information on a page, toggle **OSINT Highlight: ON** in the top navigation bar to light up extractable data points.
* **Procedural Synth Audio:** Keystrokes, port exploitation pulses, and incoming whisper messages feature authentic Web Audio synthesis. You can toggle audio on or off anytime via the bottom taskbar.

---

## 🚀 How to Launch the Rig

Make sure you have **Node.js** (v18+) installed on your machine.

```bash
# 1. Clone the repository
git clone https://github.com/kripe00/nexus-os.git
cd nexus-os

# 2. Install dependencies
npm install

# 3. Spin up the local workstation
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser and accept your first contract in WhisperChat.
