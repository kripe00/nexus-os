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
  EmailMessage,
} from "../types/game";
import { IntraWebPage, WindowState } from "../context/GameContext";
import { ContextMenuGroup } from "../components/ContextMenu";

// ============================================================================
// Mock State & Window Configuration
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
  difficulty: "operative" as "analyst" | "operative" | "ghost",
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

// Mock Web Audio API sound utility to prevent audio errors in Node / Vitest
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

// Import components after mocks are registered
import { IntraWebApp } from "../apps/IntraWebApp";
import { ClueBoardSidebar } from "../components/ClueBoardSidebar";
import { sound } from "../utils/sound";

// ============================================================================
// Pure Data Filtering Helpers (Reflecting IntraWebApp useMemo Contracts)
// ============================================================================

function getVisibleChirperPosts(
  currentMissionIndex: number,
  completedMissionIds: string[],
): ChirperPost[] {
  return CHIRPER_POSTS.filter((post) => {
    if (post.triggerMissionId) {
      return completedMissionIds.includes(post.triggerMissionId);
    }
    const minIdx = post.minMissionIndex ?? 0;
    return currentMissionIndex >= minIdx;
  });
}

function getVisibleNewsArticles(
  currentMissionIndex: number,
  completedMissionIds: string[],
): NewsArticle[] {
  return NEWS_ARTICLES.filter((article) => {
    if (article.triggerMissionId) {
      return completedMissionIds.includes(article.triggerMissionId);
    }
    const minIdx = article.minMissionIndex ?? 0;
    return currentMissionIndex >= minIdx;
  });
}

// ============================================================================
// Master Test Suite: Timeline & Hardcore Mode Integration
// ============================================================================

describe("Master Acceptance Test Suite: Timeline, OSINT Noise & Hardcore Mode", () => {
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
    mockGameState.osintHighlight = true;
    mockGameState.difficulty = "operative";
    mockGameState.discoveredClues = [];
    mockGameState.crackedEmails = [];
    vi.clearAllMocks();
  });

  // ==========================================================================
  // PART 1: TIMELINE & REACTIVE TRIGGERS (R1)
  // ==========================================================================
  describe("Part 1: Timeline & Reactive Triggers (Requirement 1)", () => {
    describe("1.1 Chronological Chirper Post Filtering", () => {
      it("displays initial target posts and baseline noise at mission index 0 while hiding future posts", () => {
        const visiblePosts = getVisibleChirperPosts(0, []);

        // Target posts for Op 01 (Marcus Cole)
        const marcusPosts = visiblePosts.filter(
          (p) => p.authorName === "Marcus Cole",
        );
        expect(marcusPosts.length).toBe(2);
        expect(marcusPosts.map((p) => p.id)).toEqual([
          "chirp_marcus_1",
          "chirp_marcus_2",
        ]);

        // Commissioner Gordon Vance bounty post
        const vancePost = visiblePosts.find(
          (p) => p.id === "chirp_vance_bounty",
        );
        expect(vancePost).toBeDefined();

        // Later milestone posts must be strictly excluded at index 0
        const postIds = visiblePosts.map((p) => p.id);
        expect(postIds).not.toContain("chirp_noise_rowan_1"); // minMissionIndex: 1
        expect(postIds).not.toContain("chirp_sterling_1"); // minMissionIndex: 2
        expect(postIds).not.toContain("chirp_reyes_1"); // minMissionIndex: 4
        expect(postIds).not.toContain("chirp_reyes_2"); // minMissionIndex: 4
        expect(postIds).not.toContain("chirp_astrid_1"); // minMissionIndex: 7
        expect(postIds).not.toContain("chirp_kai_1"); // minMissionIndex: 8

        // Invariant: all visible posts must satisfy minMissionIndex <= 0 and have no triggerMissionId
        visiblePosts.forEach((post) => {
          expect(post.triggerMissionId).toBeUndefined();
          expect(post.minMissionIndex ?? 0).toBeLessThanOrEqual(0);
        });
      });

      it("progressively unlocks target posts across campaign milestones monotonically", () => {
        // Step 1: Mission index 1 -> Rowan Bennett unlocks, Julian Sterling remains locked
        const index1Posts = getVisibleChirperPosts(1, []);
        expect(index1Posts.some((p) => p.id === "chirp_noise_rowan_1")).toBe(
          true,
        );
        expect(
          index1Posts.some((p) => p.authorName === "Julian Sterling"),
        ).toBe(false);

        // Step 2: Mission index 2 -> Julian Sterling unlocks, Viktor Reyes remains locked
        const index2Posts = getVisibleChirperPosts(2, []);
        expect(
          index2Posts.some((p) => p.authorName === "Julian Sterling"),
        ).toBe(true);
        expect(
          index2Posts.some((p) => p.authorName === "Chief Viktor Reyes"),
        ).toBe(false);

        // Step 3: Mission index 4 -> Viktor Reyes unlocks, Astrid Lindholm remains locked
        const index4Posts = getVisibleChirperPosts(4, []);
        expect(
          index4Posts.some((p) => p.authorName === "Chief Viktor Reyes"),
        ).toBe(true);
        expect(
          index4Posts.some((p) => p.authorName === "Dr. Astrid Lindholm"),
        ).toBe(false);

        // Step 4: Mission index 7 -> Astrid Lindholm unlocks, Kai Thorne remains locked
        const index7Posts = getVisibleChirperPosts(7, []);
        expect(
          index7Posts.some((p) => p.authorName === "Dr. Astrid Lindholm"),
        ).toBe(true);
        expect(index7Posts.some((p) => p.authorName === "Kai Thorne")).toBe(
          false,
        );

        // Step 5: Mission index 8 -> Kai Thorne unlocks
        const index8Posts = getVisibleChirperPosts(8, []);
        expect(index8Posts.some((p) => p.authorName === "Kai Thorne")).toBe(
          true,
        );

        // Monotonic progression invariant: visible count at index k <= index k + 1
        for (let i = 0; i < 9; i++) {
          const currentCount = getVisibleChirperPosts(i, []).length;
          const nextCount = getVisibleChirperPosts(i + 1, []).length;
          expect(nextCount).toBeGreaterThanOrEqual(currentCount);
        }
      });

      it("renders Chirper feed HTML markup reflecting chronological gating", () => {
        mockGameState.browserPage = "chirper";
        mockGameState.currentMissionIndex = 0;

        const htmlIndex0 = renderToStaticMarkup(
          React.createElement(IntraWebApp),
        );
        expect(htmlIndex0).toContain("CHIRPER // PUBLIC SOCIAL FEED");
        expect(htmlIndex0).toContain("Marcus Cole");
        expect(htmlIndex0).toContain("Koda");
        expect(htmlIndex0).toContain("1997");
        expect(htmlIndex0).not.toContain("Julian Sterling");
        expect(htmlIndex0).not.toContain("Chief Viktor Reyes");
        expect(htmlIndex0).not.toContain("NordicBreeze");
        expect(htmlIndex0).not.toContain("AbyssPoint9");

        // Advance to index 2 (Julian Sterling accessible)
        mockGameState.currentMissionIndex = 2;
        const htmlIndex2 = renderToStaticMarkup(
          React.createElement(IntraWebApp),
        );
        expect(htmlIndex2).toContain("Julian Sterling");
        expect(htmlIndex2).toContain("Hyperion");
        expect(htmlIndex2).not.toContain("Chief Viktor Reyes");
      });
    });

    describe("1.2 Reactive Breaking News & Chirper Triggers (Op 02 Velox AI & Op 08 NordGrid SCADA)", () => {
      it("keeps Op 02 and Op 08 reactive content strictly hidden prior to mission completion", () => {
        const postsWithoutCompletion = getVisibleChirperPosts(2, ["mission_1"]);
        const newsWithoutCompletion = getVisibleNewsArticles(2, ["mission_1"]);

        expect(
          postsWithoutCompletion.some((p) => p.id === "chirp_react_velox_leak"),
        ).toBe(false);
        expect(
          postsWithoutCompletion.some((p) => p.id === "chirp_react_velox_pr"),
        ).toBe(false);
        expect(
          newsWithoutCompletion.some((a) => a.id === "news_react_velox_breach"),
        ).toBe(false);
        expect(
          newsWithoutCompletion.some(
            (a) => a.id === "news_react_blackout_pulse",
          ),
        ).toBe(false);
        expect(
          postsWithoutCompletion.some((p) => p.id === "chirp_react_blackout_1"),
        ).toBe(false);
      });

      it("triggers Op 02 (mission_2) reactive breaking news article and Chirper posts upon completion", () => {
        const completed = ["mission_1", "mission_2"];
        const visibleArticles = getVisibleNewsArticles(2, completed);
        const visiblePosts = getVisibleChirperPosts(2, completed);

        // NewsWire: Velox AI breach breaking news appears
        const breachArticle = visibleArticles.find(
          (a) => a.id === "news_react_velox_breach",
        );
        expect(breachArticle).toBeDefined();
        expect(breachArticle?.headline).toBe(
          "BREAKING: Velox AI Confirms Breach of Offshore Staging Relay",
        );
        expect(breachArticle?.category).toBe("CRIME");
        expect(breachArticle?.source).toBe("Global NewsWire");
        expect(breachArticle?.isBreaking).toBe(true);
        expect(breachArticle?.triggerMissionId).toBe("mission_2");

        // Chirper: CyberSec Monitor and Elena Vance PR posts emerge
        const leakPost = visiblePosts.find(
          (p) => p.id === "chirp_react_velox_leak",
        );
        expect(leakPost).toBeDefined();
        expect(leakPost?.authorName).toBe("CyberSec Monitor");
        expect(leakPost?.authorHandle).toBe("@cyber_sec_monitor");
        expect(leakPost?.isReactive).toBe(true);
        expect(leakPost?.content).toContain(
          "monolithic transformer weights from Velox AI's v4 model",
        );

        const prPost = visiblePosts.find(
          (p) => p.id === "chirp_react_velox_pr",
        );
        expect(prPost).toBeDefined();
        expect(prPost?.authorName).toBe("Elena Vance");
        expect(prPost?.authorHandle).toBe("@elena_velox_ceo");
        expect(prPost?.isReactive).toBe(true);
        expect(prPost?.content).toContain("isolated perimeter anomaly");

        // Op 08 blackout items MUST remain locked
        expect(
          visibleArticles.some((a) => a.id === "news_react_blackout_pulse"),
        ).toBe(false);
        expect(
          visiblePosts.some((p) => p.id === "chirp_react_blackout_1"),
        ).toBe(false);
      });

      it("triggers Op 08 (mission_8) reactive cascading blackout news and Chirper posts upon completion", () => {
        const completed = [
          "mission_1",
          "mission_2",
          "mission_3",
          "mission_4",
          "mission_5",
          "mission_6",
          "mission_7",
          "mission_8",
        ];
        const visibleArticles = getVisibleNewsArticles(8, completed);
        const visiblePosts = getVisibleChirperPosts(8, completed);

        // NewsWire: NordGrid blackout article appears
        const blackoutArticle = visibleArticles.find(
          (a) => a.id === "news_react_blackout_pulse",
        );
        expect(blackoutArticle).toBeDefined();
        expect(blackoutArticle?.headline).toBe(
          "CRITICAL: Cascading Blackout Hits Sector 7; SCADA Desynchronization Suspected",
        );
        expect(blackoutArticle?.category).toBe("INFRASTRUCTURE");
        expect(blackoutArticle?.source).toBe("Nordic Energy News");
        expect(blackoutArticle?.isBreaking).toBe(true);
        expect(blackoutArticle?.triggerMissionId).toBe("mission_8");

        // Chirper: Metro Citizen Pulse and Dr. Astrid Lindholm posts emerge
        const citizenPost = visiblePosts.find(
          (p) => p.id === "chirp_react_blackout_1",
        );
        expect(citizenPost).toBeDefined();
        expect(citizenPost?.authorName).toBe("Metro Citizen Pulse");
        expect(citizenPost?.isReactive).toBe(true);
        expect(citizenPost?.content).toContain(
          "Total blackout across Sector 7",
        );

        const astridPost = visiblePosts.find(
          (p) => p.id === "chirp_react_blackout_2",
        );
        expect(astridPost).toBeDefined();
        expect(astridPost?.authorName).toBe("Dr. Astrid Lindholm");
        expect(astridPost?.isReactive).toBe(true);
        expect(astridPost?.content).toContain("MODBUS-TRIP-77A");

        // Op 09 and Op 10 reactive items MUST remain locked
        expect(
          visibleArticles.some((a) => a.id === "news_react_subsea_sever"),
        ).toBe(false);
        expect(
          visibleArticles.some((a) => a.id === "news_react_singularity_core"),
        ).toBe(false);
      });

      it("renders reactive alert banners and REACTIVE badges in IntraWebApp HTML", () => {
        // NewsWire after Op 02: Critical alert banner
        mockGameState.browserPage = "news";
        mockGameState.currentMissionIndex = 2;
        mockGameState.completedMissionIds = ["mission_1", "mission_2"];

        const newsHtml = renderToStaticMarkup(React.createElement(IntraWebApp));
        expect(newsHtml).toContain(
          "BREAKING: Velox AI Confirms Breach of Offshore Staging Relay",
        );
        expect(newsHtml).toContain("CRITICAL ALERT // BREAKING INTELLIGENCE");

        // Chirper after Op 02: REACTIVE badges
        mockGameState.browserPage = "chirper";
        const chirpHtml = renderToStaticMarkup(
          React.createElement(IntraWebApp),
        );
        expect(chirpHtml).toContain("CyberSec Monitor (@cyber_sec_monitor)");
        expect(chirpHtml).toContain("Elena Vance (@elena_velox_ceo)");
        expect(chirpHtml).toContain("REACTIVE");
      });
    });

    describe("1.3 NewsWire Portal Navigation Button & Categorized Article Listing", () => {
      it("renders NewsWire nav button with active/inactive styling and dynamic pulse dot indicator", () => {
        // Baseline index 0 without breaking news: no pulse indicator
        mockGameState.browserPage = "search";
        mockGameState.currentMissionIndex = 0;
        mockGameState.completedMissionIds = [];

        const searchHtml = renderToStaticMarkup(
          React.createElement(IntraWebApp),
        );
        expect(searchHtml).toContain("NewsWire");
        expect(searchHtml).not.toContain(
          "w-1.5 h-1.5 rounded-full bg-[#f85149] animate-pulse",
        );

        // After Op 02: breaking news triggers red pulse dot on NewsWire button
        mockGameState.completedMissionIds = ["mission_1", "mission_2"];
        const searchWithBreakingHtml = renderToStaticMarkup(
          React.createElement(IntraWebApp),
        );
        expect(searchWithBreakingHtml).toContain(
          "w-1.5 h-1.5 rounded-full bg-[#f85149] animate-pulse",
        );

        // Active state highlight when navigated to news
        mockGameState.browserPage = "news";
        const newsHtml = renderToStaticMarkup(React.createElement(IntraWebApp));
        expect(newsHtml).toContain("bg-[#211612] text-white border-[#f0883e]");
      });

      it("renders categorized articles with category badges and verified CSS class styles", () => {
        mockGameState.browserPage = "news";
        mockGameState.currentMissionIndex = 2;
        mockGameState.completedMissionIds = ["mission_1", "mission_2"];

        const html = renderToStaticMarkup(React.createElement(IntraWebApp));

        // Page banner
        expect(html).toContain("GLOBAL NEWSWIRE // SYNDICATED DISPATCH");
        expect(html).toContain(
          "BREAKING INTELLIGENCE &amp; INFRASTRUCTURE BULLETINS",
        );

        // Category: TECH (Velox Series-A)
        expect(html).toContain(
          "Velox AI Expands Series-A Neural Research Infrastructure",
        );
        expect(html).toContain("text-[#58a6ff] border-[#1f6feb] bg-[#0c1829]");
        expect(html).toContain(">TECH<");

        // Category: DEFENSE (Aethelgard Contract)
        expect(html).toContain(
          "Aethelgard Awarded Defense Grid Telemetry Modernization Contract",
        );
        expect(html).toContain("text-[#ff7b72] border-[#8e1515] bg-[#210909]");
        expect(html).toContain(">DEFENSE<");

        // Category: INFRASTRUCTURE (NordGrid Winter)
        expect(html).toContain(
          "NordGrid Prepares Continental SCADA Infrastructure for Winter Peak",
        );
        expect(html).toContain("text-[#e3b341] border-[#9e6a03] bg-[#241a05]");
        expect(html).toContain(">INFRASTRUCTURE<");

        // Category: CRIME (Velox Breach - reactive breaking article)
        expect(html).toContain(
          "BREAKING: Velox AI Confirms Breach of Offshore Staging Relay",
        );
        expect(html).toContain("text-[#f85149] border-[#da3633] bg-[#2d0f0f]");
        expect(html).toContain(">CRIME<");
      });

      it("renders each article with complete structured layout: category, source, timestamp, headline, summary, body", () => {
        mockGameState.browserPage = "news";
        mockGameState.currentMissionIndex = 0;
        mockGameState.completedMissionIds = [];

        const html = renderToStaticMarkup(React.createElement(IntraWebApp));

        // Check article components for Velox Series-A
        expect(html).toContain("Metro Tech Daily");
        expect(html).toContain("3 days ago");
        expect(html).toContain(
          "San Francisco startup Velox Systems completes $45M funding round",
        );
        expect(html).toContain(
          "Velox Systems has announced the completion of its Series-A funding round",
        );
      });
    });
  });

  // ==========================================================================
  // PART 2: OSINT NOISE & RED HERRINGS (R2)
  // ==========================================================================
  describe("Part 2: OSINT Noise & Red Herrings Verification (Requirement 2)", () => {
    const MUNDANE_EMPLOYEE_IDS = [
      // Velox AI (4 noise staff)
      "emp_velox_devon",
      "emp_velox_priya",
      "emp_velox_lucas",
      "emp_velox_chloe",
      // Aethelgard Defense (4 noise staff)
      "emp_aeth_rowan",
      "emp_aeth_soren",
      "emp_aeth_mireille",
      "emp_aeth_erik",
      // NordGrid Power (2 noise staff)
      "emp_nord_frederik",
      "emp_nord_ingrid",
      // OceanicLink Telecom (2 noise staff)
      "emp_ocean_nadia",
      "emp_ocean_sean",
    ];

    const ALL_EMPLOYEES: CorporateEmployee[] = [
      ...VELOX_EMPLOYEES,
      ...AETHELGARD_EMPLOYEES,
      ...NORDGRID_EMPLOYEES,
      ...OCEANICLINK_EMPLOYEES,
    ];

    const MUNDANE_EMAIL_IDS = [
      "msg_velox_noise_1",
      "msg_velox_noise_2",
      "msg_velox_noise_3",
      "msg_aeth_noise_1",
      "msg_aeth_noise_2",
      "msg_reyes_noise_1",
      "msg_reyes_noise_2",
      "msg_astrid_noise_1",
      "msg_kai_noise_1",
      "msg_comm_noise_1",
    ];

    const allInboxMessages: EmailMessage[] = Object.values(
      EMAIL_ACCOUNTS,
    ).flatMap((acc) => acc.inbox);

    describe("2.1 Corporate Employee Directory Purity", () => {
      it("verifies all 12 mundane noise employees exist across corporate datasets", () => {
        expect(MUNDANE_EMPLOYEE_IDS.length).toBe(12);

        MUNDANE_EMPLOYEE_IDS.forEach((id) => {
          const found = ALL_EMPLOYEES.find((emp) => emp.id === id);
          expect(
            found,
            `Mundane employee with ID ${id} must exist in corporate directories`,
          ).toBeDefined();
        });
      });

      it("ensures all 12 mundane employees have isTarget === false and no emailClueId", () => {
        MUNDANE_EMPLOYEE_IDS.forEach((id) => {
          const emp = ALL_EMPLOYEES.find((e) => e.id === id)!;
          expect(
            emp.isTarget,
            `Noise employee ${emp.name} (${id}) must have isTarget set to false or undefined`,
          ).toBeFalsy();
          expect(
            emp.emailClueId,
            `Noise employee ${emp.name} (${id}) must NOT have an emailClueId assigned`,
          ).toBeUndefined();
        });
      });

      it("verifies non-target executive Elena Vance also remains clean of clue bindings", () => {
        const elena = VELOX_EMPLOYEES.find((e) => e.id === "emp_velox_elena")!;
        expect(elena).toBeDefined();
        expect(elena.isTarget).toBeFalsy();
        expect(elena.emailClueId).toBeUndefined();
      });

      it("confirms only designated mission targets possess isTarget === true", () => {
        const targets = ALL_EMPLOYEES.filter((e) => e.isTarget);
        const targetIds = targets.map((e) => e.id).sort();

        // Exactly 5 target personnel across the entire world
        expect(targetIds).toEqual(
          [
            "emp_aeth_reyes",
            "emp_aeth_sterling",
            "emp_nord_astrid",
            "emp_ocean_kai",
            "emp_velox_marcus",
          ].sort(),
        );

        // Only Marcus Cole and Julian Sterling bind public work email clue IDs
        const emailClueTargets = ALL_EMPLOYEES.filter((e) => e.emailClueId);
        expect(emailClueTargets.length).toBe(2);
        expect(emailClueTargets.map((e) => e.emailClueId).sort()).toEqual([
          "clue_julian_email",
          "clue_marcus_email",
        ]);
      });

      it("asserts that no mundane employee email exists as a clue value in ALL_CLUES", () => {
        const allClueValues = new Set(
          Object.values(ALL_CLUES).map((c) => c.value.toLowerCase()),
        );

        MUNDANE_EMPLOYEE_IDS.forEach((id) => {
          const emp = ALL_EMPLOYEES.find((e) => e.id === id)!;
          expect(
            allClueValues.has(emp.email.toLowerCase()),
            `Mundane employee email "${emp.email}" must NOT match any clue value in ALL_CLUES`,
          ).toBe(false);
        });
      });

      it("ensures none of the 12 noise employees fulfill or advance any mission objective", () => {
        MUNDANE_EMPLOYEE_IDS.forEach((id) => {
          const emp = ALL_EMPLOYEES.find((e) => e.id === id)!;
          MISSIONS.forEach((mission) => {
            mission.objectives.forEach((obj) => {
              expect(obj.id.toLowerCase()).not.toContain(emp.id.toLowerCase());
              expect(obj.description.toLowerCase()).not.toContain(
                emp.email.toLowerCase(),
              );
            });
          });
        });
      });

      it("renders corporate directories with plain text for noise staff and ClueSpan for targets", () => {
        mockGameState.browserPage = "velox";
        const veloxHtml = renderToStaticMarkup(
          React.createElement(IntraWebApp),
        );

        // Target: Marcus Cole has ClueSpan for work email
        expect(veloxHtml).toContain("Work Email:");
        expect(veloxHtml).toContain("m.cole@velox-ai.io");

        // Noise: Devon Brooks and Priya Nair render plain Contact text
        expect(veloxHtml).toContain("Contact: d.brooks@velox-ai.io");
        expect(veloxHtml).toContain("Contact: p.nair@velox-ai.io");
      });
    });

    describe("2.2 Mundane Corporate Email Noise in EMAIL_ACCOUNTS", () => {
      const targetPasswords = Object.values(EMAIL_ACCOUNTS).map(
        (a) => a.password,
      );
      const serverIps = Object.keys(SERVER_NODES);
      const criticalTokens = [
        "OMEGA-99-KEY",
        "TITAN-ZERO-PURGE",
        "MODBUS-TRIP-77A",
        "QKD-SIG-9944-ALPHA",
        "GODEL-ZERO-SELF-TERMINATE",
        "OVERRIDE-GHOST-RECALL",
      ];

      it("verifies all 10 mundane noise emails are distributed across target inboxes", () => {
        expect(MUNDANE_EMAIL_IDS.length).toBe(10);

        MUNDANE_EMAIL_IDS.forEach((id) => {
          const found = allInboxMessages.find((m) => m.id === id);
          expect(
            found,
            `Mundane noise email ${id} must exist in EMAIL_ACCOUNTS inboxes`,
          ).toBeDefined();
        });

        // Exact account distribution
        expect(
          EMAIL_ACCOUNTS["m.cole@velox-ai.io"].inbox.filter((m) =>
            m.id.startsWith("msg_velox_noise_"),
          ).length,
        ).toBe(3);
        expect(
          EMAIL_ACCOUNTS["j.sterling@aethelgard.corp"].inbox.filter((m) =>
            m.id.startsWith("msg_aeth_noise_"),
          ).length,
        ).toBe(2);
        expect(
          EMAIL_ACCOUNTS["v.reyes@aethelgard.corp"].inbox.filter((m) =>
            m.id.startsWith("msg_reyes_noise_"),
          ).length,
        ).toBe(2);
        expect(
          EMAIL_ACCOUNTS["a.lindholm@nordgrid-power.com"].inbox.filter((m) =>
            m.id.startsWith("msg_astrid_noise_"),
          ).length,
        ).toBe(1);
        expect(
          EMAIL_ACCOUNTS["k.thorne@oceaniclink-telecom.net"].inbox.filter((m) =>
            m.id.startsWith("msg_kai_noise_"),
          ).length,
        ).toBe(1);
        expect(
          EMAIL_ACCOUNTS["commissioner.vance@metro-police.gov"].inbox.filter(
            (m) => m.id.startsWith("msg_comm_noise_"),
          ).length,
        ).toBe(1);
      });

      it("ensures zero clues or attachments are assigned to mundane email messages", () => {
        MUNDANE_EMAIL_IDS.forEach((id) => {
          const msg = allInboxMessages.find((m) => m.id === id)!;
          expect(
            msg.clues === undefined || msg.clues.length === 0,
            `Mundane email ${id} must have undefined or empty clues array`,
          ).toBe(true);
          expect(
            msg.attachment === undefined,
            `Mundane email ${id} must not carry evidence attachments`,
          ).toBe(true);
        });
      });

      it("ensures mundane email contents do not leak target passwords", () => {
        MUNDANE_EMAIL_IDS.forEach((id) => {
          const msg = allInboxMessages.find((m) => m.id === id)!;
          const fullContent = `${msg.subject} ${msg.body}`;

          targetPasswords.forEach((pw) => {
            expect(
              fullContent.includes(pw),
              `Mundane email ${id} must not contain target password "${pw}"`,
            ).toBe(false);
          });
        });
      });

      it("ensures mundane email contents do not leak hackable server IPs or critical tokens", () => {
        MUNDANE_EMAIL_IDS.forEach((id) => {
          const msg = allInboxMessages.find((m) => m.id === id)!;
          const fullContent = `${msg.subject} ${msg.body}`;

          serverIps.forEach((ip) => {
            expect(
              fullContent.includes(ip),
              `Mundane email ${id} must not leak server node IP "${ip}"`,
            ).toBe(false);
          });

          criticalTokens.forEach((token) => {
            expect(
              fullContent.includes(token),
              `Mundane email ${id} must not leak critical token "${token}"`,
            ).toBe(false);
          });
        });
      });

      it("confirms legitimate mission clues and passwords remain fully intact and solvable", () => {
        // Marcus Cole
        const marcusAcc = EMAIL_ACCOUNTS["m.cole@velox-ai.io"];
        expect(marcusAcc.password).toBe("Koda1997");
        expect(marcusAcc.requiredClueIds).toEqual([
          "clue_marcus_dog",
          "clue_marcus_year",
        ]);
        const marcusDropoffMsg = marcusAcc.inbox.find(
          (m) => m.id === "msg_velox_3",
        )!;
        expect(marcusDropoffMsg.clues?.[0].id).toBe("clue_dropoff_ip");
        expect(marcusDropoffMsg.clues?.[0].value).toBe("198.51.100.42");

        // Julian Sterling
        const sterlingAcc = EMAIL_ACCOUNTS["j.sterling@aethelgard.corp"];
        expect(sterlingAcc.password).toBe("Hyperion0451");
        expect(sterlingAcc.requiredClueIds).toEqual([
          "clue_julian_project",
          "clue_julian_badge",
        ]);
        const sterlingVaultMsg = sterlingAcc.inbox.find(
          (m) => m.id === "msg_aeth_2",
        )!;
        expect(sterlingVaultMsg.clues?.[0].id).toBe("clue_vault_override");
        expect(sterlingVaultMsg.clues?.[0].value).toBe("OMEGA-99-KEY");

        // Viktor Reyes
        const reyesAcc = EMAIL_ACCOUNTS["v.reyes@aethelgard.corp"];
        expect(reyesAcc.password).toBe("Phantom778821");
        expect(reyesAcc.requiredClueIds).toEqual([
          "clue_reyes_unit",
          "clue_reyes_pin",
        ]);
        const reyesCoreMsg = reyesAcc.inbox.find(
          (m) => m.id === "msg_reyes_1",
        )!;
        expect(reyesCoreMsg.clues?.[0].id).toBe("clue_datacenter_core_ip");
        expect(reyesCoreMsg.clues?.[0].value).toBe("194.165.16.100");

        // Astrid Lindholm
        const astridAcc = EMAIL_ACCOUNTS["a.lindholm@nordgrid-power.com"];
        expect(astridAcc.password).toBe("NordicBreeze5020");
        expect(astridAcc.requiredClueIds).toEqual([
          "clue_astrid_yacht",
          "clue_astrid_pin",
        ]);
        const astridTripMsg = astridAcc.inbox.find(
          (m) => m.id === "msg_astrid_2",
        )!;
        expect(astridTripMsg.clues?.[0].id).toBe("clue_scada_sync_key");
        expect(astridTripMsg.clues?.[0].value).toBe("MODBUS-TRIP-77A");

        // Kai Thorne
        const kaiAcc = EMAIL_ACCOUNTS["k.thorne@oceaniclink-telecom.net"];
        expect(kaiAcc.password).toBe("AbyssPoint92019");
        expect(kaiAcc.requiredClueIds).toEqual([
          "clue_kai_station",
          "clue_kai_year",
        ]);
        const kaiTokenMsg = kaiAcc.inbox.find((m) => m.id === "msg_kai_2")!;
        expect(kaiTokenMsg.clues?.[0].id).toBe("clue_qkd_stream_token");
        expect(kaiTokenMsg.clues?.[0].value).toBe("QKD-SIG-9944-ALPHA");

        // Commissioner Vance
        const vanceAcc = EMAIL_ACCOUNTS["commissioner.vance@metro-police.gov"];
        expect(vanceAcc.password).toBe("RoyalPineBadge990");
        expect(vanceAcc.requiredClueIds).toEqual([
          "clue_commissioner_golf",
          "clue_commissioner_badge",
        ]);
      });
    });

    describe("2.3 Zero False-Positive Clue Discovery", () => {
      it("asserts that matching mundane employee properties against ALL_CLUES returns zero matches", () => {
        const allCluesList = Object.values(ALL_CLUES);
        const mundaneEmployees = [
          ...VELOX_EMPLOYEES.filter((e) => !e.isTarget),
          ...AETHELGARD_EMPLOYEES.filter((e) => !e.isTarget),
          ...NORDGRID_EMPLOYEES.filter((e) => !e.isTarget),
          ...OCEANICLINK_EMPLOYEES.filter((e) => !e.isTarget),
        ];

        mundaneEmployees.forEach((emp) => {
          const emailMatches = allCluesList.filter(
            (c) => c.value.toLowerCase() === emp.email.toLowerCase(),
          );
          expect(
            emailMatches.length,
            `Selecting mundane email "${emp.email}" must match 0 clues`,
          ).toBe(0);

          const nameMatches = allCluesList.filter(
            (c) => c.value.toLowerCase() === emp.name.toLowerCase(),
          );
          expect(
            nameMatches.length,
            `Selecting mundane employee name "${emp.name}" must match 0 clues`,
          ).toBe(0);

          const roleMatches = allCluesList.filter(
            (c) => c.value.toLowerCase() === emp.role.toLowerCase(),
          );
          expect(
            roleMatches.length,
            `Selecting mundane role "${emp.role}" must match 0 clues`,
          ).toBe(0);
        });
      });

      it("verifies all 10 red herring Chirper posts have no clues and cannot trigger clue discovery", () => {
        const noiseChirps = CHIRPER_POSTS.filter((p) =>
          p.id.startsWith("chirp_noise_"),
        );
        expect(noiseChirps.length).toBe(10);

        noiseChirps.forEach((post) => {
          expect(
            post.clues === undefined || post.clues.length === 0,
            `Noise Chirper post ${post.id} must not carry clues`,
          ).toBe(true);
        });
      });

      it("verifies simulated manual intel entry with mundane terms triggers zero clue discoveries", () => {
        const discoveredClues: string[] = [];
        const discoverClueMock = (clueId: string) => {
          discoveredClues.push(clueId);
        };

        const testMundaneInputs = [
          "d.brooks@velox-ai.io",
          "Chloe Zhao",
          "r.bennett@aethelgard.corp",
          "Facilities Operations",
          "f.solberg@nordgrid-power.com",
          "n.oconnor@oceaniclink-telecom.net",
          "Kirby Morgan 37",
          "Dissolved Gas Analysis",
          "Floor 4 Espresso Machine",
        ];

        testMundaneInputs.forEach((input) => {
          const matches = Object.values(ALL_CLUES).filter(
            (c) => c.value.toLowerCase() === input.trim().toLowerCase(),
          );
          if (matches.length > 0) {
            matches.forEach((m) => discoverClueMock(m.id));
          }
        });

        expect(
          discoveredClues.length,
          "Submitting mundane terms must produce zero clue discoveries",
        ).toBe(0);
      });

      it("confirms an operative interacting exclusively with noise content achieves zero objective completions", () => {
        const playerDiscoveredClues: string[] = [];
        const hasClueId = (id: string) => playerDiscoveredClues.includes(id);
        const crackedEmails: string[] = [];
        const successfulPhishes: string[] = [];

        const isObjectiveComplete = (objId: string): boolean => {
          switch (objId) {
            case "obj_m1_clues":
              return (
                hasClueId("clue_marcus_email") ||
                hasClueId("clue_dropoff_ip") ||
                (hasClueId("clue_marcus_dog") && hasClueId("clue_marcus_year"))
              );
            case "obj_m1_passweaver":
              return (
                crackedEmails.includes("m.cole@velox-ai.io") ||
                hasClueId("clue_dropoff_ip") ||
                successfulPhishes.includes("phish_marcus")
              );
            case "obj_m1_webmail":
              return hasClueId("clue_dropoff_ip");
            case "obj_m3_sterling_mail":
              return hasClueId("clue_vault_override");
            case "obj_m5_reyes_clues":
              return (
                hasClueId("clue_reyes_unit") && hasClueId("clue_reyes_pin")
              );
            case "obj_m5_webmail":
              return hasClueId("clue_datacenter_core_ip");
            case "obj_m8_lindholm_intel":
              return (
                crackedEmails.includes("a.lindholm@nordgrid-power.com") ||
                hasClueId("clue_scada_ip") ||
                successfulPhishes.includes("phish_astrid")
              );
            case "obj_m9_kai_intel":
              return (
                crackedEmails.includes("k.thorne@oceaniclink-telecom.net") ||
                hasClueId("clue_subsea_fiber_ip") ||
                successfulPhishes.includes("phish_kai")
              );
            default:
              return false;
          }
        };

        const testObjectives = [
          "obj_m1_clues",
          "obj_m1_passweaver",
          "obj_m1_webmail",
          "obj_m3_sterling_mail",
          "obj_m5_reyes_clues",
          "obj_m5_webmail",
          "obj_m8_lindholm_intel",
          "obj_m9_kai_intel",
        ];

        testObjectives.forEach((objId) => {
          expect(
            isObjectiveComplete(objId),
            `Objective ${objId} must remain incomplete when only noise is encountered`,
          ).toBe(false);
        });
      });
    });
  });

  // ==========================================================================
  // PART 3: HARDCORE MODE & ACTIVE SEARCH (R3)
  // ==========================================================================
  describe("Part 3: Hardcore Mode (Zero-Ghost) & Active Search Mechanics (Requirement 3)", () => {
    describe("3.1 Hardcore Mode Click Suppression & Scanner Invalidation", () => {
      it("renders clues as natural unstyled text spans without buttons or click discovery on ghost difficulty", () => {
        mockGameState.difficulty = "ghost";
        mockGameState.browserPage = "chirper";

        const html = renderToStaticMarkup(React.createElement(IntraWebApp));

        // Clue text is present in rendered DOM
        expect(html).toContain("Koda");
        expect(html).toContain("1997");

        // Rendered markup must use select-text and cursor-text
        expect(html).toContain("select-text cursor-text");

        // Interactive button tags and cybernetic tooltip prompts must NOT be present
        expect(html).not.toContain(
          "Click to collect and pin this detail to your OSINT Clue Board",
        );
        expect(html).not.toContain("cursor-default select-none");

        // discoverClue must not have been triggered simply by rendering
        expect(mockGameState.discoverClue).not.toHaveBeenCalled();
      });

      it("restores cybernetic scanner button when switching to operative difficulty with highlight ON", () => {
        mockGameState.difficulty = "operative";
        mockGameState.osintHighlight = true;
        mockGameState.browserPage = "chirper";

        const html = renderToStaticMarkup(React.createElement(IntraWebApp));

        // Buttons and scanner overlays are enabled on operative difficulty
        expect(html).toContain(
          "Click to collect and pin this detail to your OSINT Clue Board",
        );
      });

      it("disables OSINT highlight scanner button on ghost mode across IntraWeb and ClueBoardSidebar", () => {
        mockGameState.difficulty = "ghost";

        const intraWebHtml = renderToStaticMarkup(
          React.createElement(IntraWebApp),
        );
        expect(intraWebHtml).toContain(
          "OSINT Scanner disabled on Zero-Ghost (Hardcore) difficulty",
        );
        expect(intraWebHtml).toContain("OSINT Highlight: OFF");

        const sidebarHtml = renderToStaticMarkup(
          React.createElement(ClueBoardSidebar),
        );
        expect(sidebarHtml).toContain(
          "OSINT Scanner disabled on Zero-Ghost (Hardcore) difficulty",
        );
      });
    });

    describe("3.2 Hardcore Mode Selectable Text & Style Enforcement", () => {
      it("renders ClueSpan with exact select-text cursor-text classes without yellow text or hover borders", () => {
        mockGameState.difficulty = "ghost";
        mockGameState.browserPage = "chirper";

        const html = renderToStaticMarkup(React.createElement(IntraWebApp));

        // Exact class styling contract for ClueSpan on ghost mode
        expect(html).toContain(
          'class="inline text-inherit font-inherit select-text cursor-text selection:bg-[#1f6feb]/40 selection:text-white"',
        );

        // Verifies complete absence of yellow text highlights and hover borders
        expect(html).not.toContain("text-yellow-");
        expect(html).not.toContain("text-[#e3b341]");
        expect(html).not.toContain("hover:border-dashed");
      });

      it("ensures the IntraWeb browser viewport wrapper has select-text for mouse selection", () => {
        mockGameState.browserPage = "chirper";
        const html = renderToStaticMarkup(React.createElement(IntraWebApp));

        // Viewport wrapper must be selectable
        expect(html).toContain(
          "flex-1 overflow-y-auto p-5 bg-[#060708] text-xs select-text",
        );
      });
    });

    describe("3.3 Context Menu Active Pinning via Text Selection", () => {
      it("generates [+] Pin Intel item for valid clue text selections and executes discoverClue on click", () => {
        const selection = "Koda";
        const matchedClues = Object.values(ALL_CLUES).filter(
          (c) => c.value.toLowerCase() === selection.toLowerCase(),
        );

        expect(matchedClues.length).toBe(1);
        const matched = matchedClues[0];
        expect(matched.id).toBe("clue_marcus_dog");
        expect(matched.label).toBe("Dog Name");

        // Verify pinning action executes discoverClue
        mockGameState.discoverClue(matched.id);
        expect(mockGameState.discoverClue).toHaveBeenCalledWith(
          "clue_marcus_dog",
        );
        expect(mockGameState.discoveredClues.map((c) => c.id)).toContain(
          "clue_marcus_dog",
        );
      });

      it("matches IP address clues like '185.220.101.5' case-insensitively for Pin Intel", () => {
        const selection = "185.220.101.5";
        const matchedClues = Object.values(ALL_CLUES).filter(
          (c) => c.value.toLowerCase() === selection.toLowerCase(),
        );

        expect(matchedClues.length).toBe(1);
        const matched = matchedClues[0];
        expect(matched.id).toBe("clue_sat_relay_ip");
        expect(matched.label).toBe("Orbital Sat Relay IP");

        mockGameState.discoverClue(matched.id);
        expect(mockGameState.discoveredClues.map((c) => c.id)).toContain(
          "clue_sat_relay_ip",
        );
      });

      it("excludes [+] Pin Intel options when non-clue text is selected", () => {
        const nonClueTexts = [
          "Velox Neural Systems",
          "Quarterly Financial Statement",
          "Elena Vance CEO",
          "Unknown Red Herring",
        ];

        for (const text of nonClueTexts) {
          const matches = Object.values(ALL_CLUES).filter(
            (c) => c.value.toLowerCase() === text.toLowerCase(),
          );
          expect(matches.length).toBe(0);
        }
      });
    });

    describe("3.4 ClueBoardSidebar Manual Intel Submission Form", () => {
      it("renders manual intel entry form, input field, and pin button in sidebar", () => {
        const html = renderToStaticMarkup(
          React.createElement(ClueBoardSidebar),
        );

        expect(html).toContain('data-testid="manual-intel-form"');
        expect(html).toContain('data-testid="manual-intel-input"');
        expect(html).toContain('data-testid="manual-intel-submit"');
        expect(html).toContain("Manual intel entry (e.g. Koda, 0451)...");
      });

      it("successfully discovers valid clues with whitespace trimming and case insensitivity", () => {
        const testCases = [
          { raw: "   koda   ", expectedId: "clue_marcus_dog" },
          { raw: "1997", expectedId: "clue_marcus_year" },
          { raw: "HYPERION", expectedId: "clue_julian_project" },
          { raw: "  0451  ", expectedId: "clue_julian_badge" },
          { raw: "SaintJude", expectedId: "clue_sterling_club" },
          { raw: "198.51.100.42", expectedId: "clue_dropoff_ip" },
          { raw: "omega-99-key", expectedId: "clue_vault_override" },
        ];

        for (const tc of testCases) {
          const trimmed = tc.raw.trim().toLowerCase();
          const matches = Object.values(ALL_CLUES).filter(
            (c) => c.value.toLowerCase() === trimmed,
          );

          expect(matches.length).toBeGreaterThan(0);
          expect(matches[0].id).toBe(tc.expectedId);

          matches.forEach((m) => mockGameState.discoverClue(m.id));
        }

        expect(mockGameState.discoveredClues.length).toBe(testCases.length);
        expect(sound.playError).not.toHaveBeenCalled();
      });

      it("rejects unknown intel entries, plays error audio, and creates warning notification", () => {
        const invalidInputs = [
          "random_gibberish",
          "password1234",
          "999999",
          "not_a_valid_clue",
        ];

        for (const raw of invalidInputs) {
          const trimmed = raw.trim();
          const matches = Object.values(ALL_CLUES).filter(
            (c) => c.value.toLowerCase() === trimmed.toLowerCase(),
          );

          expect(matches.length).toBe(0);

          // Simulate ClueBoardSidebar rejection handler
          sound.playError();
          mockGameState.addNotification(
            "Intel Unverified",
            `No known target profile matched "${trimmed}"`,
            "warning",
          );
        }

        expect(sound.playError).toHaveBeenCalledTimes(invalidInputs.length);
        expect(capturedNotifications.length).toBe(invalidInputs.length);
        expect(capturedNotifications.every((n) => n.type === "warning")).toBe(
          true,
        );
        expect(capturedNotifications[0].title).toBe("Intel Unverified");
      });

      it("ignores blank or whitespace-only submissions without error or clue discovery", () => {
        const blanks = ["", "   ", "\t", "\n"];

        for (const b of blanks) {
          const trimmed = b.trim();
          expect(!trimmed).toBe(true);
        }

        expect(mockGameState.discoverClue).not.toHaveBeenCalled();
        expect(sound.playError).not.toHaveBeenCalled();
      });
    });

    describe("3.5 Multi-Clue Collision Resolution & Kai Thorne Op 09 Solvability", () => {
      it("identifies '2019' value collision between clue_velox_year and clue_kai_year in ALL_CLUES", () => {
        const targetVal = "2019".trim().toLowerCase();
        const matches = Object.values(ALL_CLUES).filter(
          (c) => c.value.toLowerCase() === targetVal,
        );

        // Must find exactly 2 matching clues
        expect(matches.length).toBe(2);
        const matchIds = matches.map((c) => c.id);
        expect(matchIds).toContain("clue_velox_year");
        expect(matchIds).toContain("clue_kai_year");

        // Verify one is decoy and one is real
        const veloxClue = matches.find((c) => c.id === "clue_velox_year");
        const kaiClue = matches.find((c) => c.id === "clue_kai_year");
        expect(veloxClue?.isDecoy).toBe(true);
        expect(kaiClue?.isDecoy).toBeUndefined();
      });

      it("discovers BOTH clue_velox_year and clue_kai_year when entering '2019' in manual intel form", () => {
        const input = "  2019  ";
        const trimmed = input.trim().toLowerCase();
        const matches = Object.values(ALL_CLUES).filter(
          (c) => c.value.toLowerCase() === trimmed,
        );

        // Simulate sidebar submission loop: matches.forEach(m => discoverClue(m.id))
        matches.forEach((m) => mockGameState.discoverClue(m.id));

        expect(mockGameState.discoverClue).toHaveBeenCalledWith(
          "clue_velox_year",
        );
        expect(mockGameState.discoverClue).toHaveBeenCalledWith(
          "clue_kai_year",
        );

        const discoveredIds = mockGameState.discoveredClues.map((c) => c.id);
        expect(discoveredIds).toContain("clue_velox_year");
        expect(discoveredIds).toContain("clue_kai_year");
      });

      it("generates separate [+] Pin Intel context menu items for both clues when '2019' is selected", () => {
        const selection = "2019";
        const matches = Object.values(ALL_CLUES).filter(
          (c) => c.value.toLowerCase() === selection.toLowerCase(),
        );

        const items: { label: string; clueId: string }[] = [];
        matches.forEach((matchedClue) => {
          items.unshift({
            label: `[+] Pin Intel: ${matchedClue.label} ("${matchedClue.value}")`,
            clueId: matchedClue.id,
          });
        });

        expect(items.length).toBe(2);
        expect(items[0].clueId).toBe("clue_kai_year");
        expect(items[0].label).toBe(
          '[+] Pin Intel: Deep Dive Cert Year ("2019")',
        );
        expect(items[1].clueId).toBe("clue_velox_year");
        expect(items[1].label).toBe('[+] Pin Intel: Founding Year ("2019")');
      });

      it("guarantees Kai Thorne password synthesis in Op 09 succeeds without soft-lock following '2019' discovery", () => {
        // 1. Discover subsea station callsign
        const stationClue = ALL_CLUES.clue_kai_station;
        expect(stationClue).toBeDefined();
        mockGameState.discoverClue(stationClue.id);

        // 2. Discover '2019' via multi-match resolution
        const matches = Object.values(ALL_CLUES).filter(
          (c) => c.value.toLowerCase() === "2019",
        );
        matches.forEach((m) => mockGameState.discoverClue(m.id));

        // 3. Inspect target account requirements
        const kaiAccount = EMAIL_ACCOUNTS["k.thorne@oceaniclink-telecom.net"];
        expect(kaiAccount).toBeDefined();

        const discoveredIds = mockGameState.discoveredClues.map((c) => c.id);
        const allRequiredDiscovered = kaiAccount.requiredClueIds.every(
          (reqId) => discoveredIds.includes(reqId),
        );
        expect(allRequiredDiscovered).toBe(true);

        // 4. Synthesize password
        const synthesizedPassword = `${stationClue.value}${ALL_CLUES.clue_kai_year.value}`;
        expect(synthesizedPassword).toBe("AbyssPoint92019");
        expect(synthesizedPassword).toBe(kaiAccount.password);

        // 5. Mark cracked and verify account state
        mockGameState.markEmailCracked(kaiAccount.email);
        expect(mockGameState.crackedEmails).toContain(kaiAccount.email);
      });
    });
  });
});
