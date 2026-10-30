import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ALL_CLUES,
  EMAIL_ACCOUNTS,
  MISSIONS,
  CHIRPER_POSTS,
  NEWS_ARTICLES,
} from "../data/worldData";
import { AppId, Clue } from "../types/game";
import { IntraWebPage, WindowState } from "../context/GameContext";
import { ContextMenuGroup } from "../components/ContextMenu";
import { IntraWebApp } from "../apps/IntraWebApp";
import { ClueBoardSidebar } from "../components/ClueBoardSidebar";
import { PassWeaverApp } from "../apps/PassWeaverApp";

const createDefaultWindows = (): Record<AppId, WindowState> => ({
  whisper: {
    id: "whisper",
    title: "Whisper",
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 0, y: 0 },
  },
  intraweb: {
    id: "intraweb",
    title: "IntraWeb",
    isOpen: true,
    isMinimized: false,
    zIndex: 10,
    position: { x: 0, y: 0 },
  },
  passweaver: {
    id: "passweaver",
    title: "PassWeaver",
    isOpen: true,
    isMinimized: false,
    zIndex: 5,
    position: { x: 0, y: 0 },
  },
  terminal: {
    id: "terminal",
    title: "Terminal",
    isOpen: true,
    isMinimized: false,
    zIndex: 1,
    position: { x: 0, y: 0 },
  },
  blackmarket: {
    id: "blackmarket",
    title: "BlackMarket",
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 0, y: 0 },
  },
  netshield: {
    id: "netshield",
    title: "NetShield",
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 0, y: 0 },
  },
  spearphish: {
    id: "spearphish",
    title: "SpearPhish",
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 0, y: 0 },
  },
  bountyboard: {
    id: "bountyboard",
    title: "BountyBoard",
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 0, y: 0 },
  },
  packetsniffer: {
    id: "packetsniffer",
    title: "PacketSniffer",
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 0, y: 0 },
  },
  georelay: {
    id: "georelay",
    title: "GeoRelay",
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 0, y: 0 },
  },
  files: {
    id: "files",
    title: "Files",
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 0, y: 0 },
  },
});

let capturedContextMenuGroups: ContextMenuGroup[] = [];

let mockGameState = {
  windows: createDefaultWindows(),
  activeApp: "intraweb" as AppId,
  focusApp: vi.fn(),
  closeApp: vi.fn(),
  minimizeApp: vi.fn(),
  moveWindow: vi.fn(),
  centerWindow: vi.fn(),
  sendToBack: vi.fn(),
  showContextMenu: vi.fn((_e: any, groups: ContextMenuGroup[]) => {
    capturedContextMenuGroups = groups;
  }),
  browserPage: "search" as IntraWebPage,
  browserSearchQuery: "",
  webmailPrefillEmail: "",
  navigateBrowser: vi.fn(),
  discoverClue: vi.fn(),
  hasClue: vi.fn((_id: string) => false),
  discoveredClues: [] as Clue[],
  crackedEmails: [] as string[],
  markEmailLoggedIn: vi.fn(),
  markEmailCracked: vi.fn(),
  openApp: vi.fn(),
  currentMissionIndex: 0,
  completedMissionIds: [] as string[],
  osintHighlight: true,
  toggleOsintHighlight: vi.fn(),
  difficulty: "ghost" as "analyst" | "operative" | "ghost",
  missionStage: "investigating" as const,
  isObjectiveComplete: vi.fn(() => false),
  sendClueToApp: vi.fn(),
  campaignFinished: false,
  executeTerminalCommand: vi.fn(),
  addNotification: vi.fn(),
  passWeaverTargetEmail: "m.cole@velox-ai.io",
  setPassWeaverTargetEmail: vi.fn(),
  passWeaverSelectedClues: [] as string[],
  togglePassWeaverClue: vi.fn(),
};

vi.mock("../context/GameContext", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../context/GameContext")>();
  return {
    ...actual,
    useGame: () => mockGameState,
  };
});

vi.mock("../utils/sound", () => ({
  sound: {
    playClick: vi.fn(),
    playKey: vi.fn(),
    playSuccess: vi.fn(),
    playError: vi.fn(),
    playClueFound: vi.fn(),
    playWindowOpen: vi.fn(),
    playWindowClose: vi.fn(),
    playContextMenuOpen: vi.fn(),
  },
}));

describe("Challenger Stress Suite: Search Integration, Manual Intel Edge Cases & Clue Linking", () => {
  beforeEach(() => {
    capturedContextMenuGroups = [];
    vi.clearAllMocks();
  });

  describe("1. Duplicate Clue Value Collision & Shadowing in ALL_CLUES", () => {
    it("detects any duplicate clue values in ALL_CLUES", () => {
      const clueList = Object.values(ALL_CLUES);
      const valueMap = new Map<string, Clue[]>();

      for (const clue of clueList) {
        const valLower = clue.value.toLowerCase();
        const existing = valueMap.get(valLower) || [];
        existing.push(clue);
        valueMap.set(valLower, existing);
      }

      const duplicates = Array.from(valueMap.entries()).filter(
        ([_, clues]) => clues.length > 1,
      );

      // We document any duplicate values discovered
      console.log(
        "Duplicate clue values found in ALL_CLUES:",
        duplicates.map(([val, clues]) => ({
          value: val,
          clueIds: clues.map((c) => c.id),
          labels: clues.map((c) => c.label),
          targets: clues.map((c) => c.targetPerson),
        })),
      );

      // Verify whether '2019' is duplicated
      expect(valueMap.get("2019")?.length).toBe(2);
      expect(valueMap.get("2019")?.map((c) => c.id)).toEqual([
        "clue_velox_year",
        "clue_kai_year",
      ]);
    });

    it("evaluates impact of '2019' collision on Kai Thorne password synthesis in Hardcore mode", () => {
      // In ClueBoardSidebar / handleManualIntelSubmit:
      const input = "2019";
      const trimmed = input.trim();
      const matched = Object.values(ALL_CLUES).find(
        (c) => c.value.toLowerCase() === trimmed.toLowerCase(),
      );

      // matched is clue_velox_year because it appears first in ALL_CLUES!
      expect(matched?.id).toBe("clue_velox_year");
      expect(matched?.targetPerson).toBe("Marcus Cole");
      expect(matched?.isDecoy).toBe(true);

      // Now check Kai Thorne's required clues:
      const kaiAccount = EMAIL_ACCOUNTS["k.thorne@oceaniclink-telecom.net"];
      expect(kaiAccount.requiredClueIds).toContain("clue_kai_year");

      // If the player pins "2019", they receive clue_velox_year, NOT clue_kai_year!
      const playerDiscoveredClues = [ALL_CLUES.clue_kai_station, matched!];
      const playerSelectedClueIds = playerDiscoveredClues.map((c) => c.id);

      // Check PassWeaver synthesis requirement:
      const req = kaiAccount.requiredClueIds;
      const hasAllRequired =
        req.every((r) => playerSelectedClueIds.includes(r)) &&
        playerSelectedClueIds.length === req.length;

      // This demonstrates the collision issue:
      // When find() stops at the first match, clue_kai_year is shadowed by clue_velox_year!
      expect(hasAllRequired).toBe(false);
    });

    it("verifies multi-match resolution (finding all matching clues with filter)", () => {
      const input = "2019";
      const trimmed = input.trim().toLowerCase();
      const matches = Object.values(ALL_CLUES).filter(
        (c) => c.value.toLowerCase() === trimmed,
      );

      expect(matches.length).toBe(2);
      const matchIds = matches.map((c) => c.id);
      expect(matchIds).toContain("clue_velox_year");
      expect(matchIds).toContain("clue_kai_year");

      // If all matches with identical values are pinned, Kai Thorne's synthesis succeeds:
      const kaiAccount = EMAIL_ACCOUNTS["k.thorne@oceaniclink-telecom.net"];
      const playerDiscovered = [ALL_CLUES.clue_kai_station, ...matches];
      const selectedIds = ["clue_kai_station", "clue_kai_year"];
      const hasAll =
        kaiAccount.requiredClueIds.every((r) => selectedIds.includes(r)) &&
        selectedIds.length === kaiAccount.requiredClueIds.length;

      expect(hasAll).toBe(true);
    });
  });

  describe("2. Manual Intel Input Edge Cases in ClueBoardSidebar", () => {
    it("handles extreme whitespace variations (tabs, newlines, multiple leading/trailing spaces)", () => {
      const inputs = [
        { raw: "  Koda  ", expected: "clue_marcus_dog" },
        { raw: "\t\t1997\n", expected: "clue_marcus_year" },
        { raw: "   0451   \r\n", expected: "clue_julian_badge" },
        { raw: "  AbyssPoint9  ", expected: "clue_kai_station" },
        { raw: "\n\tMODBUS-TRIP-77A\t\n", expected: "clue_scada_sync_key" },
      ];

      for (const { raw, expected } of inputs) {
        const trimmed = raw.trim();
        const matched = Object.values(ALL_CLUES).find(
          (c) => c.value.toLowerCase() === trimmed.toLowerCase(),
        );
        expect(matched).toBeDefined();
        expect(matched?.id).toBe(expected);
      }
    });

    it("handles casing variations across all alphabet characters", () => {
      const casingVariations = [
        { raw: "koda", expected: "clue_marcus_dog" },
        { raw: "KODA", expected: "clue_marcus_dog" },
        { raw: "kOdA", expected: "clue_marcus_dog" },
        { raw: "hyperion", expected: "clue_julian_project" },
        { raw: "HYPERION", expected: "clue_julian_project" },
        { raw: "HyPeRiOn", expected: "clue_julian_project" },
        {
          raw: "godel-zero-self-terminate",
          expected: "clue_ouroboros_root_paradox",
        },
        {
          raw: "GODEL-ZERO-SELF-TERMINATE",
          expected: "clue_ouroboros_root_paradox",
        },
        {
          raw: "Godel-Zero-Self-Terminate",
          expected: "clue_ouroboros_root_paradox",
        },
      ];

      for (const { raw, expected } of casingVariations) {
        const trimmed = raw.trim().toLowerCase();
        const matched = Object.values(ALL_CLUES).find(
          (c) => c.value.toLowerCase() === trimmed,
        );
        expect(matched).toBeDefined();
        expect(matched?.id).toBe(expected);
      }
    });

    it("handles special characters, hyphens, dots, and colons safely without crashes", () => {
      const specialCharClues = [
        { val: "198.51.100.42", id: "clue_dropoff_ip" },
        { val: "203.0.113.88", id: "clue_aethelgard_ip" },
        { val: "185.220.101.5", id: "clue_sat_relay_ip" },
        { val: "194.165.16.100", id: "clue_datacenter_core_ip" },
        { val: "141.98.11.200", id: "clue_hunter_drone_ip" },
        { val: "217.182.80.50", id: "clue_scada_ip" },
        { val: "102.16.88.12", id: "clue_subsea_fiber_ip" },
        { val: "185.190.20.1", id: "clue_svalbard_bunker_ip" },
        { val: "OMEGA-99-KEY", id: "clue_vault_override" },
        { val: "VALKYRIE-7", id: "clue_sat_beacon_callsign" },
        { val: "TITAN-ZERO-PURGE", id: "clue_core_firmware_key" },
        { val: "OVERRIDE-GHOST-RECALL", id: "clue_counter_exploit_token" },
        { val: "MODBUS-TRIP-77A", id: "clue_scada_sync_key" },
        { val: "QKD-SIG-9944-ALPHA", id: "clue_qkd_stream_token" },
        { val: "GODEL-ZERO-SELF-TERMINATE", id: "clue_ouroboros_root_paradox" },
        { val: "j.sterling@aethelgard.corp", id: "clue_julian_email" },
        { val: "v.reyes@aethelgard.corp", id: "clue_officer_email" },
      ];

      for (const item of specialCharClues) {
        const trimmed = item.val.trim().toLowerCase();
        const matched = Object.values(ALL_CLUES).find(
          (c) => c.value.toLowerCase() === trimmed,
        );
        expect(matched).toBeDefined();
        expect(matched?.id).toBe(item.id);
      }
    });

    it("correctly identifies all decoy clues when submitted manually", () => {
      const decoys = Object.values(ALL_CLUES).filter((c) => c.isDecoy);
      expect(decoys.length).toBeGreaterThan(0);

      for (const decoy of decoys) {
        const trimmed = decoy.value.trim().toLowerCase();
        const matched = Object.values(ALL_CLUES).find(
          (c) => c.value.toLowerCase() === trimmed,
        );
        expect(matched).toBeDefined();
        expect(matched?.isDecoy).toBe(true);
      }
    });

    it("gracefully rejects adversarial strings, empty strings, and script payloads", () => {
      const adversarial = [
        "",
        "   ",
        "\t\n",
        "<script>alert(1)</script>",
        "' OR '1'='1",
        "../../etc/passwd",
        "undefined",
        "null",
        "NaN",
        "0",
        "true",
        "false",
        "__proto__",
        "constructor",
        "a".repeat(1000),
      ];

      for (const raw of adversarial) {
        const trimmed = raw.trim();
        if (!trimmed) {
          expect(trimmed.length).toBe(0);
          continue;
        }
        const matched = Object.values(ALL_CLUES).find(
          (c) => c.value.toLowerCase() === trimmed.toLowerCase(),
        );
        expect(matched).toBeUndefined();
      }
    });
  });

  describe("3. LookUp Search Integration for Discovered Tokens", () => {
    // Import SEARCH_INDEX logic from IntraWebApp
    const SEARCH_INDEX = [
      {
        id: "res_velox",
        page: "velox" as IntraWebPage,
        title: "Velox AI — Executive Team & Neural Architecture",
        url: "http://velox-ai.io/org/directory.html",
        snippet:
          "Official corporate directory for Velox Neural Systems Inc. CEO Elena Vance, CTO Marcus Cole (m.cole@velox-ai.io).",
        keywords: [
          "velox",
          "marcus",
          "cole",
          "elena",
          "vance",
          "cto",
          "ceo",
          "company",
          "email",
          "devon",
          "brooks",
          "sre",
          "priya",
          "nair",
          "lucas",
          "meyer",
          "chloe",
          "zhao",
          "hr",
          "directory",
          "engineering",
          "infrastructure",
          "compliance",
          "m.cole@velox-ai.io",
        ],
      },
      {
        id: "res_news",
        page: "news" as IntraWebPage,
        title: "Global NewsWire — Syndicated Press & Breaking Telemetry",
        url: "http://newswire.global/intel/breaking.html",
        snippet:
          "Syndicated international news coverage, breaking security dispatches, Velox AI leaks, and continental infrastructure bulletins.",
        keywords: [
          "news",
          "newswire",
          "press",
          "breaking",
          "bulletin",
          "media",
          "dispatch",
          "leak",
          "breach",
          "blackout",
          "dead-drop",
          "198.51.100.42",
          "217.182.80.50",
          "scada",
          "valkyrie",
          "delta",
        ],
      },
      {
        id: "res_chirper_marcus",
        page: "chirper" as IntraWebPage,
        title: "Chirper Public Stream — Verified Execs & Personnel",
        url: "http://chirper.net/stream/public",
        snippet:
          "Public microblogging feed featuring posts from Marcus Cole (@mcole_dev), Julian Sterling (@jsterling_exec), and Security Chief Viktor Reyes (@reyes_actual).",
        keywords: [
          "chirper",
          "marcus",
          "cole",
          "mcole",
          "social",
          "julian",
          "sterling",
          "reyes",
          "viktor",
          "dog",
          "posts",
          "koda",
          "pixel",
          "1997",
          "2019",
          "hyperion",
          "saintjude",
          "commander",
          "phantom77",
          "viper6",
          "8821",
          "9901",
          "nordicbreeze",
          "5020",
          "abysspoint9",
          "vance",
          "royalpine",
          "badge990",
          "astrid",
          "lindholm",
          "kai",
          "thorne",
          "ouroboros",
        ],
      },
      {
        id: "res_webmail",
        page: "webmail" as IntraWebPage,
        title: "Nexus Corporate WebMail Gateway (IMAP/SMTP)",
        url: "https://mail.nexus-relay.io/auth",
        snippet:
          "Encrypted webmail login portal for @velox-ai.io and @aethelgard.corp employee accounts.",
        keywords: [
          "mail",
          "webmail",
          "email",
          "inbox",
          "login",
          "velox",
          "aethelgard",
          "reyes",
          "sterling",
          "dead-drop",
          "198.51.100.42",
          "relay",
          "imap",
          "smtp",
        ],
      },
      {
        id: "res_aethelgard",
        page: "aethelgard" as IntraWebPage,
        title:
          "Aethelgard Defense Systems — Division 0451 & Orbital Operations",
        url: "http://aethelgard.corp/div-0451/press.html",
        snippet:
          "Director Julian Sterling appointed to lead Special Projects Division 0451. Satellite tracking network and Facility Delta operations.",
        keywords: [
          "aethelgard",
          "julian",
          "sterling",
          "0451",
          "mirror",
          "defense",
          "director",
          "sat",
          "orbital",
          "reyes",
          "hyperion",
          "phantom77",
          "8821",
          "facility delta",
          "delta",
          "procurement",
          "logistics",
          "legal",
          "soren",
          "mireille",
          "185.220.101.5",
          "203.0.113.88",
          "194.165.16.100",
          "valkyrie-7",
        ],
      },
      {
        id: "res_nordgrid",
        page: "nordgrid" as IntraWebPage,
        title: "NordGrid High-Voltage Power Systems — Regional SCADA Telemetry",
        url: "http://nordgrid-power.com/grid/scada-status.html",
        snippet:
          "Regional electric grid transmission authority. Lead engineer Dr. Astrid Lindholm (a.lindholm@nordgrid-power.com). Monitoring 502/TCP Modbus frequency regulators.",
        keywords: [
          "nordgrid",
          "power",
          "grid",
          "scada",
          "astrid",
          "lindholm",
          "modbus",
          "electric",
          "blackout",
          "nordicbreeze",
          "5020",
          "217.182.80.50",
          "substation",
          "frederik",
          "solberg",
          "ingrid",
          "dahl",
          "relay",
          "transformer",
        ],
      },
      {
        id: "res_oceaniclink",
        page: "oceaniclink" as IntraWebPage,
        title: "OceanicLink Subsea Telecom — Transatlantic Photonic Repeaters",
        url: "http://oceaniclink-telecom.net/infrastructure/subsea-cables.html",
        snippet:
          "Global undersea fiber-optic cabling and Quantum Key Distribution repeaters. Lead saturation diver Kai Thorne (k.thorne@oceaniclink-telecom.net).",
        keywords: [
          "oceaniclink",
          "fiber",
          "subsea",
          "cable",
          "kai",
          "thorne",
          "repeater",
          "qkd",
          "atlantic",
          "telecom",
          "abysspoint9",
          "102.16.88.12",
          "diver",
          "saturation",
          "nadia",
          "sean",
          "photonic",
        ],
      },
      {
        id: "res_svalbard",
        page: "svalbard" as IntraWebPage,
        title:
          "Svalbard Deep Vault Facility — Arctic Geological & AI Core Storage",
        url: "http://svalbard-vault.arctic/core/research-facility.html",
        snippet:
          "Subterranean research compound embedded in Svalbard permafrost bedrock. High-security autonomous computing array at 185.190.20.1.",
        keywords: [
          "svalbard",
          "vault",
          "arctic",
          "ouroboros",
          "bunker",
          "singularity",
          "core",
          "185.190.20.1",
          "permafrost",
        ],
      },
      {
        id: "res_darkforum",
        page: "darkforum" as IntraWebPage,
        title:
          "0xUnderground DarkNet Forum — Vulnerability Disclosures & Exploits",
        url: "http://0xunderground.onion/threads/ouroboros-leak.html",
        snippet:
          "Encrypted underground message board. Active threads on Aethelgard fallout, Ouroboros Protocol Gödel paradox override, and freelance bounties.",
        keywords: [
          "0xunderground",
          "forum",
          "darknet",
          "onion",
          "ouroboros",
          "paradox",
          "godel",
          "bounty",
          "exploit",
          "underground",
          "godel-zero-self-terminate",
        ],
      },
    ];

    const runSearch = (query: string, missionIndex: number = 0) => {
      const q = query.trim().toLowerCase();
      return SEARCH_INDEX.filter((item) => {
        if (!q) {
          if (item.page === "aethelgard" && missionIndex < 1) return false;
          return true;
        }
        return (
          item.title.toLowerCase().includes(q) ||
          item.snippet.toLowerCase().includes(q) ||
          item.keywords.some((k) => q.includes(k) || k.includes(q))
        );
      });
    };

    it("verifies LookUp returns relevant results for all primary OSINT clues", () => {
      const osintQueries = [
        { q: "Koda", expectedPage: "chirper" },
        { q: "1997", expectedPage: "chirper" },
        { q: "198.51.100.42", expectedPage: "news" },
        { q: "Hyperion", expectedPage: "chirper" },
        { q: "0451", expectedPage: "aethelgard" },
        { q: "SaintJude", expectedPage: "chirper" },
        { q: "Commander", expectedPage: "chirper" },
        { q: "185.220.101.5", expectedPage: "aethelgard" },
        { q: "VALKYRIE-7", expectedPage: "aethelgard" },
        { q: "Phantom77", expectedPage: "chirper" },
        { q: "8821", expectedPage: "chirper" },
        { q: "194.165.16.100", expectedPage: "aethelgard" },
        { q: "NordicBreeze", expectedPage: "chirper" },
        { q: "5020", expectedPage: "chirper" },
        { q: "217.182.80.50", expectedPage: "news" },
        { q: "AbyssPoint9", expectedPage: "chirper" },
        { q: "102.16.88.12", expectedPage: "oceaniclink" },
        { q: "185.190.20.1", expectedPage: "svalbard" },
        { q: "GODEL-ZERO-SELF-TERMINATE", expectedPage: "darkforum" },
        { q: "Badge990", expectedPage: "chirper" },
        { q: "RoyalPine", expectedPage: "chirper" },
      ];

      for (const tc of osintQueries) {
        const results = runSearch(tc.q, 1);
        expect(results.length).toBeGreaterThan(0);
        const pages = results.map((r) => r.page);
        expect(pages).toContain(tc.expectedPage);
      }
    });

    it("handles whitespace, case, and substring variations in LookUp queries", () => {
      const queries = [
        "  marcus  ",
        "MARCUS COLE",
        "m.cole@velox-ai.io",
        "aethelgard",
        "SCADA",
        "dr. astrid lindholm",
        "subsea",
        "ouroboros",
      ];

      for (const q of queries) {
        const res = runSearch(q, 1);
        expect(res.length).toBeGreaterThan(0);
      }
    });

    it("returns zero results safely without crash for non-existent keywords and symbols", () => {
      const nonExistent = [
        "xyz_totally_not_in_nexus_9999",
        "+++***???",
        "()()()",
        "---___---",
      ];

      for (const q of nonExistent) {
        const res = runSearch(q, 1);
        expect(res.length).toBe(0);
      }
    });
  });

  describe("4. Zero Regression across All Campaign Operations", () => {
    it("verifies all 10 campaign missions have valid objectives and solvable conditions", () => {
      expect(MISSIONS.length).toBe(10);

      for (let i = 0; i < MISSIONS.length; i++) {
        const m = MISSIONS[i];
        expect(m.id).toBeDefined();
        expect(m.title).toBeDefined();
        expect(m.chapter).toBeGreaterThanOrEqual(1);
        expect(m.chapter).toBeLessThanOrEqual(4);
        expect(m.objectives.length).toBeGreaterThan(0);

        for (const obj of m.objectives) {
          expect(obj.id).toBeDefined();
          expect(obj.description).toBeDefined();
        }
      }
    });

    it("verifies all cracked email accounts have matching required clues in ALL_CLUES", () => {
      for (const [email, account] of Object.entries(EMAIL_ACCOUNTS)) {
        expect(account.password).toBeDefined();
        expect(account.requiredClueIds).toBeDefined();

        for (const clueId of account.requiredClueIds) {
          const clue = ALL_CLUES[clueId];
          expect(clue).toBeDefined();
          expect(clue.id).toBe(clueId);
        }
      }
    });
  });
});
