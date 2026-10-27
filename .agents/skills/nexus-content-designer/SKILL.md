---
name: nexus-content-designer
description: >-
  Design, implement, and balance campaign operations, OSINT clues, social engineering targets,
  server nodes, and darknet puzzles for the NexusOS cyber-espionage game.
  Use when creating new missions, authoring world data in worldData.ts, adding new clues,
  or designing multi-stage investigative puzzle chains.
---

# NexusOS Content Designer Guide

Use this skill when designing, authoring, or balancing narrative campaign operations, bounty contracts, and OSINT investigation chains in **NEXUS // OS**.

All world data lives centrally in:
- `src/data/worldData.ts`
- `src/types/game.ts`

---

## 1. Anatomy of an Investigative Puzzle Chain

Every operation must provide an authentic investigative chain without dead-ends:

```text
[ Briefing in WhisperChat ]
          │
          ▼
[ Recon on IntraWeb / Chirper ]  ──►  (Harvest 2 OSINT tokens into Clue Board)
          │
          ▼
[ Credential Synthesis in PassWeaver ]  ──►  (Unlocks target's WebMail password)
          │
          ▼
[ Corporate WebMail Exfiltration ]  ──►  (Finds classified drop IP & auth tokens)
          │
          ▼
[ Server Intrusion in SmartTerminal ]  ──►  (Scan -> Crack -> Connect -> ls -> download)
          │
          ▼
[ Trace Sanitization ]  ──►  (Run wipe_logs before Active Trace hits 100%)
          │
          ▼
[ Report Submission & Escrow Settlement ]  ──►  (Claim Crypto ◈ & unlock next chapter)
```

---

## 2. Integrity Checklist for New Missions

When adding a new `Mission` to `MISSIONS` in `src/data/worldData.ts`, ensure:

1. **Unique IDs:**
   - Mission ID: `mission_<number>`
   - Objective IDs: `obj_m<num>_<slug>` (e.g., `obj_m1_clues`, `obj_m1_webmail`)
   - Clue IDs: `clue_<target>_<descriptor>` (e.g., `clue_mcole_pet_name`)
2. **Cross-Referenced Clues:**
   - If an email password requires OSINT, the `EmailAccount` in `EMAIL_ACCOUNTS` must set `requiredClueIds: ['clue_id_1', 'clue_id_2']`.
   - The corresponding clues MUST exist in `ALL_CLUES` and be discoverable on an IntraWeb page (via `data-clue-id="..."` or Chirper post).
3. **Server Nodes (`SERVER_NODES`):**
   - Each IP used in the mission must be defined with:
     - `requiredPort`: e.g. 22 (SSH), 80 (HTTP), 443 (HTTPS), 8080 (Supercluster), 9000 (Drone RF).
     - `requiredToolId`: Tool available in `SHOP_ITEMS` (e.g. `ssh_breaker_v1`, `drone_override_v4`).
     - `triggersTrace`: Set `true` for high-security targets to engage the countdown timer.
     - `files`: Must include at least one file with `isMissionEvidence: true`.
4. **Accept and Report Dialogues:**
   - Update `acceptOptions` and `reportOptions` in `src/apps/WhisperChatApp.tsx` matching the new mission index.
5. **Objective Validation:**
   - In `src/context/GameContext.tsx`, verify the objective completion rules for your new objective IDs in `isObjectiveComplete()`.

---

## 3. Moral Alignment Vectors

Operations in later chapters should offer meaningful choices that influence the player's alignment (`purge`, `hegemony`, `disclosure`):
- **Purge:** Destruction of surveillance architecture, revocation of root certificates.
- **Hegemony:** Clandestine takeover, redirection of slush funds, shadow control.
- **Disclosure:** Public decentralized leaking to 0xUnderground and open-source networks.
