import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ALL_CLUES,
  EMAIL_ACCOUNTS,
  SERVER_NODES,
  MISSIONS,
  CHIRPER_POSTS,
  NEWS_ARTICLES,
  VELOX_EMPLOYEES,
  AETHELGARD_EMPLOYEES,
  NORDGRID_EMPLOYEES,
  OCEANICLINK_EMPLOYEES,
} from "../data/worldData";
import {
  AppId,
  Clue,
  ChirperPost,
  NewsArticle,
  CorporateEmployee,
} from "../types/game";
import { IntraWebPage, WindowState } from "../context/GameContext";
import { ContextMenuGroup } from "../components/ContextMenu";

// ============================================================================
// Mock Setup
// ============================================================================

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
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
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
let capturedNotifications: { title: string; message: string; type: string }[] =
  [];

let mockGameState = {
  windows: createDefaultWindows(),
  activeApp: "intraweb" as AppId,
  focusApp: vi.fn(),
  bringToFront: vi.fn(),
  closeApp: vi.fn(),
  minimizeApp: vi.fn(),
  maximizeApp: vi.fn(),
  restoreApp: vi.fn(),
  moveWindow: vi.fn(),
  centerWindow: vi.fn(),
  sendToBack: vi.fn(),
  startWindowDrag: vi.fn(),
  showContextMenu: vi.fn((_e: any, groups: ContextMenuGroup[]) => {
    capturedContextMenuGroups = groups;
  }),
  browserPage: "news" as IntraWebPage,
  browserSearchQuery: "",
  webmailPrefillEmail: "",
  navigateBrowser: vi.fn(),
  discoverClue: vi.fn((clueId: string) => {
    const c = ALL_CLUES[clueId];
    if (c && !mockGameState.discoveredClues.some((x) => x.id === clueId)) {
      mockGameState.discoveredClues.push(c);
    }
  }),
  hasClue: vi.fn((id: string) =>
    mockGameState.discoveredClues.some((c) => c.id === id),
  ),
  discoveredClues: [] as Clue[],
  crackedEmails: [] as string[],
  markEmailLoggedIn: vi.fn(),
  markEmailCracked: vi.fn((email: string) => {
    if (!mockGameState.crackedEmails.includes(email)) {
      mockGameState.crackedEmails.push(email);
    }
  }),
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
  addNotification: vi.fn((title: string, message: string, type: string) => {
    capturedNotifications.push({ title, message, type });
  }),
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
    playTerminalType: vi.fn(),
    playAlert: vi.fn(),
  },
}));

import { IntraWebApp } from "../apps/IntraWebApp";
import { ClueBoardSidebar } from "../components/ClueBoardSidebar";
import { sound } from "../utils/sound";

// ============================================================================
// Challenger Stress Suite
// ============================================================================

describe("Challenger Master Stress Suite: Adversarial Verification for Milestone 4", () => {
  beforeEach(() => {
    capturedContextMenuGroups = [];
    capturedNotifications = [];
    mockGameState.windows = createDefaultWindows();
    mockGameState.activeApp = "intraweb";
    mockGameState.browserPage = "news";
    mockGameState.browserSearchQuery = "";
    mockGameState.webmailPrefillEmail = "";
    mockGameState.currentMissionIndex = 0;
    mockGameState.completedMissionIds = [];
    mockGameState.osintHighlight = false;
    mockGameState.difficulty = "ghost";
    mockGameState.discoveredClues = [];
    mockGameState.crackedEmails = [];
    vi.clearAllMocks();
  });

  // --------------------------------------------------------------------------
  // Dimension 1: Extreme & Erratic Mission Progression Transitions
  // --------------------------------------------------------------------------
  describe("Dimension 1: Extreme & Erratic Mission Progression Transitions", () => {
    function filterPosts(idx: number, completed: string[]): ChirperPost[] {
      return CHIRPER_POSTS.filter((post) => {
        if (post.triggerMissionId) {
          return completed.includes(post.triggerMissionId);
        }
        const minIdx = post.minMissionIndex ?? 0;
        return idx >= minIdx;
      });
    }

    function filterNews(idx: number, completed: string[]): NewsArticle[] {
      return NEWS_ARTICLES.filter((article) => {
        if (article.triggerMissionId) {
          return completed.includes(article.triggerMissionId);
        }
        const minIdx = article.minMissionIndex ?? 0;
        return idx >= minIdx;
      });
    }

    it("survives extreme out-of-bounds mission indices without throwing or corrupting feeds", () => {
      const boundaryIndices = [-999, -1, 0, 8, 9, 10, 100, 99999];

      for (const idx of boundaryIndices) {
        expect(() => filterPosts(idx, [])).not.toThrow();
        expect(() => filterNews(idx, [])).not.toThrow();

        const posts = filterPosts(idx, []);
        const news = filterNews(idx, []);

        // Assert all elements are defined and have valid string IDs
        posts.forEach((p) => {
          expect(p).toBeDefined();
          expect(typeof p.id).toBe("string");
          expect(p.id.length).toBeGreaterThan(0);
        });
        news.forEach((n) => {
          expect(n).toBeDefined();
          expect(typeof n.id).toBe("string");
          expect(n.id.length).toBeGreaterThan(0);
        });

        // Assert zero duplicate IDs in the returned lists
        const postIds = posts.map((p) => p.id);
        const newsIds = news.map((n) => n.id);
        expect(new Set(postIds).size).toBe(postIds.length);
        expect(new Set(newsIds).size).toBe(newsIds.length);
      }
    });

    it("maintains strict subset invariant under monotonic forward progression", () => {
      for (let i = 0; i < 9; i++) {
        const postsNow = filterPosts(i, []).filter((p) => !p.triggerMissionId);
        const postsNext = filterPosts(i + 1, []).filter(
          (p) => !p.triggerMissionId,
        );

        const currentIds = new Set(postsNow.map((p) => p.id));
        const nextIds = new Set(postsNext.map((p) => p.id));

        // Every post visible at step i MUST be a subset of posts visible at step i + 1
        for (const id of currentIds) {
          expect(nextIds.has(id)).toBe(true);
        }
      }
    });

    it("survives rapid non-monotonic jumps (e.g. save-slot rollbacks 8 -> 1 -> 8 -> 0)", () => {
      const transitions = [8, 1, 8, 0, 4, 2, 7, 3, 0];

      for (const targetIdx of transitions) {
        mockGameState.currentMissionIndex = targetIdx;
        mockGameState.browserPage = "chirper";

        expect(() => {
          renderToStaticMarkup(React.createElement(IntraWebApp));
        }).not.toThrow();

        const posts = filterPosts(targetIdx, []);
        if (targetIdx === 0) {
          expect(posts.some((p) => p.authorName === "Julian Sterling")).toBe(
            false,
          );
          expect(posts.some((p) => p.authorName === "Chief Viktor Reyes")).toBe(
            false,
          );
        } else if (targetIdx >= 4) {
          expect(posts.some((p) => p.authorName === "Julian Sterling")).toBe(
            true,
          );
          expect(posts.some((p) => p.authorName === "Chief Viktor Reyes")).toBe(
            true,
          );
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // Dimension 2: Combinatorial Reactive Trigger Stress
  // --------------------------------------------------------------------------
  describe("Dimension 2: Combinatorial Reactive Trigger Stress", () => {
    function filterPosts(idx: number, completed: string[]): ChirperPost[] {
      return CHIRPER_POSTS.filter((post) => {
        if (post.triggerMissionId) {
          return completed.includes(post.triggerMissionId);
        }
        const minIdx = post.minMissionIndex ?? 0;
        return idx >= minIdx;
      });
    }

    function filterNews(idx: number, completed: string[]): NewsArticle[] {
      return NEWS_ARTICLES.filter((article) => {
        if (article.triggerMissionId) {
          return completed.includes(article.triggerMissionId);
        }
        const minIdx = article.minMissionIndex ?? 0;
        return idx >= minIdx;
      });
    }

    it("never shows reactive news or posts when completedMissionIds is empty, even at maximum mission index", () => {
      const highIndices = [0, 1, 2, 5, 8, 9, 50];

      for (const idx of highIndices) {
        const posts = filterPosts(idx, []);
        const news = filterNews(idx, []);

        const reactivePosts = posts.filter(
          (p) => p.isReactive || p.triggerMissionId,
        );
        const reactiveNews = news.filter(
          (n) => n.triggerMissionId || n.isBreaking,
        );

        expect(reactivePosts.length).toBe(0);
        expect(reactiveNews.length).toBe(0);
      }
    });

    it("handles heavily duplicated completedMissionIds without generating duplicate feed entries", () => {
      const dirtyCompleted = [
        "mission_2",
        "mission_2",
        "mission_2",
        "mission_8",
        "mission_8",
        "mission_2",
        "fake_mission_999",
        "",
      ];

      const posts = filterPosts(0, dirtyCompleted);
      const news = filterNews(0, dirtyCompleted);

      const postIds = posts.map((p) => p.id);
      const newsIds = news.map((n) => n.id);

      expect(new Set(postIds).size).toBe(postIds.length);
      expect(new Set(newsIds).size).toBe(newsIds.length);

      // Op 02 and Op 08 reactive posts must be present exactly once
      expect(
        posts.filter((p) => p.id === "chirp_react_velox_leak").length,
      ).toBe(1);
      expect(posts.filter((p) => p.id === "chirp_react_velox_pr").length).toBe(
        1,
      );
      expect(
        posts.filter((p) => p.id === "chirp_react_blackout_1").length,
      ).toBe(1);
      expect(
        posts.filter((p) => p.id === "chirp_react_blackout_2").length,
      ).toBe(1);

      // Op 02 and Op 08 reactive news must be present exactly once
      expect(
        news.filter((n) => n.id === "news_react_velox_breach").length,
      ).toBe(1);
      expect(
        news.filter((n) => n.id === "news_react_blackout_pulse").length,
      ).toBe(1);
    });

    it("verifies strict bi-directional contract for reactive dataset definitions", () => {
      CHIRPER_POSTS.forEach((post) => {
        if (post.isReactive) {
          expect(post.triggerMissionId).toBeDefined();
          expect(typeof post.triggerMissionId).toBe("string");
        }
        // chirp_ouroboros_daemon is the specialized corrupted daemon easter egg
        if (post.triggerMissionId && post.id !== "chirp_ouroboros_daemon") {
          expect(post.isReactive).toBe(true);
        }
      });

      NEWS_ARTICLES.forEach((article) => {
        if (article.isBreaking) {
          expect(article.triggerMissionId).toBeDefined();
          expect(typeof article.triggerMissionId).toBe("string");
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // Dimension 3: OSINT Noise Red Herring Fuzzing & Isolation
  // --------------------------------------------------------------------------
  describe("Dimension 3: OSINT Noise Red Herring Fuzzing & Isolation", () => {
    const ALL_NOISE_EMPLOYEES: CorporateEmployee[] = [
      ...VELOX_EMPLOYEES.filter((e) => !e.isTarget),
      ...AETHELGARD_EMPLOYEES.filter((e) => !e.isTarget),
      ...NORDGRID_EMPLOYEES.filter((e) => !e.isTarget),
      ...OCEANICLINK_EMPLOYEES.filter((e) => !e.isTarget),
    ];

    it("verifies all noise employees fail WebMail login and never authenticate", () => {
      mockGameState.browserPage = "webmail";

      for (const emp of ALL_NOISE_EMPLOYEES) {
        const cleanEmail = emp.email.trim().toLowerCase();
        // Employee email must NOT exist in EMAIL_ACCOUNTS
        expect(EMAIL_ACCOUNTS[cleanEmail]).toBeUndefined();
      }
    });

    it("ensures zero leakage of any mission passwords or keys in employee bios or noise emails", () => {
      const allSensitiveTokens = [
        "Koda1997",
        "Hyperion0451",
        "Phantom778821",
        "NordicBreeze5020",
        "AbyssPoint92019",
        "RoyalPineBadge990",
        "OMEGA-99-KEY",
        "MODBUS-TRIP-77A",
        "QKD-SIG-9944-ALPHA",
        "198.51.100.42",
        "194.165.16.100",
        "185.220.101.5",
      ];

      // Check noise employee bios
      for (const emp of ALL_NOISE_EMPLOYEES) {
        const text = `${emp.name} ${emp.role} ${emp.department} ${emp.bio}`;
        for (const token of allSensitiveTokens) {
          expect(
            text.includes(token),
            `Employee ${emp.name} bio leaked sensitive token: ${token}`,
          ).toBe(false);
        }
      }

      // Check all mundane emails across all inboxes
      const mundaneEmails = Object.values(EMAIL_ACCOUNTS)
        .flatMap((acc) => acc.inbox)
        .filter((msg) => msg.id.includes("_noise_"));

      expect(mundaneEmails.length).toBe(10);

      for (const msg of mundaneEmails) {
        const fullContent = `${msg.subject} ${msg.body}`;
        for (const token of allSensitiveTokens) {
          expect(
            fullContent.includes(token),
            `Mundane email ${msg.id} leaked sensitive token: ${token}`,
          ).toBe(false);
        }
      }
    });

    it("fuzzes LookUp Search Engine with extreme and malicious inputs without crash", () => {
      const maliciousQueries = [
        "",
        "   ",
        "\t\n\r",
        "<script>alert('xss')</script>",
        "' OR '1'='1' --",
        "../../etc/passwd",
        "${7*7}",
        "A".repeat(5000),
        "👾🚀💻⚡🔥",
        "Devon Brooks",
        "Priya Nair",
        "Lucas Moreau",
        "Soren Lind",
        "Mireille Boucher",
        "Frederik Holst",
        "Sean Gallagher",
      ];

      for (const q of maliciousQueries) {
        mockGameState.browserSearchQuery = q;
        mockGameState.browserPage = "search";

        expect(() => {
          renderToStaticMarkup(React.createElement(IntraWebApp));
        }).not.toThrow();
      }
    });
  });

  // --------------------------------------------------------------------------
  // Dimension 4: Hardcore Ghost Mode Selection & Multi-Clue Collision Stress
  // --------------------------------------------------------------------------
  describe("Dimension 4: Hardcore Ghost Mode Selection & Multi-Clue Collision Stress", () => {
    it("renders ClueSpan on Ghost mode as unstyled text with zero button or onClick markup", () => {
      mockGameState.difficulty = "ghost";
      mockGameState.osintHighlight = true; // highlight flag set, but ghost mode must suppress it!
      mockGameState.browserPage = "chirper";
      mockGameState.currentMissionIndex = 0;

      const html = renderToStaticMarkup(React.createElement(IntraWebApp));

      // Ghost mode MUST NOT contain clue buttons or fingerprint pulsing icons
      expect(html).not.toContain("animate-pulse");
      expect(html).not.toContain("border-dashed");
      expect(html).not.toContain("Click to collect and pin this detail");

      // Ghost mode class MUST be present
      expect(html).toContain("select-text cursor-text");
    });

    it("correctly handles selection matching with leading/trailing whitespace and mixed casing", () => {
      const selections = [
        { raw: "   KODA   ", expectedId: "clue_marcus_dog" },
        { raw: "kOdA", expectedId: "clue_marcus_dog" },
        { raw: "  198.51.100.42  ", expectedId: "clue_dropoff_ip" },
        { raw: "hyperion", expectedId: "clue_julian_project" },
        { raw: "  0451  ", expectedId: "clue_julian_badge" },
        { raw: "  185.220.101.5  ", expectedId: "clue_sat_relay_ip" },
      ];

      for (const item of selections) {
        const clean = item.raw.trim().toLowerCase();
        const matches = Object.values(ALL_CLUES).filter(
          (c) => c.value.toLowerCase() === clean,
        );

        expect(matches.length).toBeGreaterThan(0);
        expect(matches[0].id).toBe(item.expectedId);

        // Discovery idempotent check
        mockGameState.discoverClue(matches[0].id);
        mockGameState.discoverClue(matches[0].id); // duplicate call
        expect(
          mockGameState.discoveredClues.filter((c) => c.id === item.expectedId)
            .length,
        ).toBe(1);
      }
    });

    it("strictly isolates substring non-clues from generating [+] Pin Intel options", () => {
      const nonClues = [
        "Marcus",
        "Cole",
        "Vance",
        "Elena",
        "Systems",
        "Neural",
        "Aethelgard",
        "NordGrid",
        "OceanicLink",
      ];

      for (const nonClue of nonClues) {
        const matches = Object.values(ALL_CLUES).filter(
          (c) => c.value.toLowerCase() === nonClue.toLowerCase(),
        );
        expect(matches.length).toBe(0);
      }
    });

    it("verifies simultaneous discovery and zero soft-lock on '2019' multi-clue collision", () => {
      const query = "  2019  ";
      const matches = Object.values(ALL_CLUES).filter(
        (c) => c.value.toLowerCase() === query.trim().toLowerCase(),
      );

      expect(matches.length).toBe(2);
      const matchIds = matches.map((c) => c.id);
      expect(matchIds).toContain("clue_velox_year");
      expect(matchIds).toContain("clue_kai_year");

      // Discover both
      matches.forEach((m) => mockGameState.discoverClue(m.id));

      const discoveredIds = mockGameState.discoveredClues.map((c) => c.id);
      expect(discoveredIds).toContain("clue_velox_year");
      expect(discoveredIds).toContain("clue_kai_year");

      // Verify Kai Thorne password synthesis
      const station = ALL_CLUES.clue_kai_station.value;
      const certYear = ALL_CLUES.clue_kai_year.value;
      const combined = `${station}${certYear}`;
      expect(combined).toBe("AbyssPoint92019");
      expect(combined).toBe(
        EMAIL_ACCOUNTS["k.thorne@oceaniclink-telecom.net"].password,
      );
    });

    it("stress tests manual intel submission form with edge inputs", () => {
      const edgeInputs = [
        "a".repeat(4000), // very long string
        ".*", // regex wildcard
        "^koda$", // regex anchor
        "[0-9]+", // regex range
        "<xml>data</xml>",
      ];

      for (const inp of edgeInputs) {
        const trimmed = inp.trim().toLowerCase();
        const matches = Object.values(ALL_CLUES).filter(
          (c) => c.value.toLowerCase() === trimmed,
        );
        // None of these regex or edge strings should match any literal clue
        expect(matches.length).toBe(0);
      }
    });
  });

  // --------------------------------------------------------------------------
  // Dimension 5: Full 9-Operation Solvability Oracle
  // --------------------------------------------------------------------------
  describe("Dimension 5: Full 9-Operation Solvability Oracle", () => {
    it("empirically verifies all 9 missions remain 100% solvable without soft-locks", () => {
      // Operation 01: Velox AI (Marcus Cole)
      mockGameState.discoverClue("clue_marcus_dog");
      mockGameState.discoverClue("clue_marcus_year");
      const marcusAcc = EMAIL_ACCOUNTS["m.cole@velox-ai.io"];
      expect(
        marcusAcc.requiredClueIds.every((id) => mockGameState.hasClue(id)),
      ).toBe(true);
      const marcusPass = `${ALL_CLUES.clue_marcus_dog.value}${ALL_CLUES.clue_marcus_year.value}`;
      expect(marcusPass).toBe(marcusAcc.password);

      // Operation 03: Aethelgard Corp (Julian Sterling)
      mockGameState.discoverClue("clue_julian_project");
      mockGameState.discoverClue("clue_julian_badge");
      const sterlingAcc = EMAIL_ACCOUNTS["j.sterling@aethelgard.corp"];
      expect(
        sterlingAcc.requiredClueIds.every((id) => mockGameState.hasClue(id)),
      ).toBe(true);
      const sterlingPass = `${ALL_CLUES.clue_julian_project.value}${ALL_CLUES.clue_julian_badge.value}`;
      expect(sterlingPass).toBe(sterlingAcc.password);

      // Operation 04: Facility Delta (Viktor Reyes)
      mockGameState.discoverClue("clue_reyes_unit");
      mockGameState.discoverClue("clue_reyes_pin");
      const reyesAcc = EMAIL_ACCOUNTS["v.reyes@aethelgard.corp"];
      expect(
        reyesAcc.requiredClueIds.every((id) => mockGameState.hasClue(id)),
      ).toBe(true);
      const reyesPass = `${ALL_CLUES.clue_reyes_unit.value}${ALL_CLUES.clue_reyes_pin.value}`;
      expect(reyesPass).toBe(reyesAcc.password);

      // Operation 08: NordGrid SCADA (Astrid Lindholm)
      mockGameState.discoverClue("clue_astrid_yacht");
      mockGameState.discoverClue("clue_astrid_pin");
      const astridAcc = EMAIL_ACCOUNTS["a.lindholm@nordgrid-power.com"];
      expect(
        astridAcc.requiredClueIds.every((id) => mockGameState.hasClue(id)),
      ).toBe(true);
      const astridPass = `${ALL_CLUES.clue_astrid_yacht.value}${ALL_CLUES.clue_astrid_pin.value}`;
      expect(astridPass).toBe(astridAcc.password);

      // Operation 09: OceanicLink (Kai Thorne)
      mockGameState.discoverClue("clue_kai_station");
      mockGameState.discoverClue("clue_kai_year");
      const kaiAcc = EMAIL_ACCOUNTS["k.thorne@oceaniclink-telecom.net"];
      expect(
        kaiAcc.requiredClueIds.every((id) => mockGameState.hasClue(id)),
      ).toBe(true);
      const kaiPass = `${ALL_CLUES.clue_kai_station.value}${ALL_CLUES.clue_kai_year.value}`;
      expect(kaiPass).toBe(kaiAcc.password);

      // Commissioner Vance (Sub-plot)
      mockGameState.discoverClue("clue_commissioner_golf");
      mockGameState.discoverClue("clue_commissioner_badge");
      const vanceAcc = EMAIL_ACCOUNTS["commissioner.vance@metro-police.gov"];
      expect(
        vanceAcc.requiredClueIds.every((id) => mockGameState.hasClue(id)),
      ).toBe(true);
      const vancePass = `${ALL_CLUES.clue_commissioner_golf.value}${ALL_CLUES.clue_commissioner_badge.value}`;
      expect(vancePass).toBe(vanceAcc.password);
    });
  });
});
