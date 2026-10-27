---
name: nexus-qa-verifier
description: >-
  Systematic quality assurance, regression testing, and release verification runbook for NexusOS.
  Use when validating game progression, verifying puzzle solvability, running test suites,
  testing fail-states, window clamping, and ensuring zero soft-locks across all chapters.
---

# NexusOS QA & Release Verifier

Use this skill to run thorough verification, catch regressions, and ensure that NexusOS remains 100% bug-free and playable from first boot to final credits.

---

## 1. Automated Test Suite

Always verify TypeScript types and the Vitest suite first:

```bash
# 1. Type check without emitting files
npx tsc -b

# 2. Run all unit tests
npm test
```

### Test Coverage Locations
- `src/tests/gameProgression.test.ts` — Tests progression across Chapter 1–3, objective completion, and reward distribution.
- `src/tests/windowManagement.test.ts` — Window z-index stacking, minimizing, clamping, and proxy hop dampeners.
- `src/tests/worldData.test.ts` — Verifies integrity of all clue IDs, email hints, server nodes, and shop items.
- `src/tests/spearPhishAndDefense.test.ts` — Verifies social engineering lures, honeypot traps, and firewall recovery.
- `src/tests/bountyBoard.test.ts` — Verifies endless contracts, difficulty scaling, and claim rewards.
- `src/tests/packetSniffer.test.ts` — Verifies network subnets, hex preview decoders, and credential extraction.

---

## 2. Regression & Anti-Soft-Lock Checklist

When verifying a release candidate build, manually or programmatically verify that:

1. **Crypto Economy:**
   - Players must never be soft-locked due to lack of Crypto (`◈`). If an exploit binary is required, check that previous operations or bounties provide sufficient payout.
2. **Offline Fallback:**
   - Terminate the backend server (`node server/index.js`) and ensure the client still boots seamlessly via `localStorage` guest session.
3. **Fail-State Integrity:**
   - Check what happens when `tracePercent` reaches 100% on a secure server.
   - Check what happens when `firewallHealth` reaches 0% during Operation 07 (drone assault).
4. **Window Boundaries:**
   - Test dragging windows on a 1366x768 or resized viewport. Windows must never disappear off-screen.
5. **Autocompletion & Terminal:**
   - Test pressing `Tab` in the Smart Terminal for commands and file names.
   - Test pressing `Up/Down` arrow keys for command history.
6. **Accessibility:**
   - Verify that the CRT scanlines toggle immediately disables screen flicker and scanline artifacts.
   - Verify UI scaling at 100%, 125%, and 150%.
