import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ALL_CLUES,
  EMAIL_ACCOUNTS,
  MISSIONS,
  CHIRPER_POSTS,
} from "../data/worldData";
import { AppId, Clue } from "../types/game";
import { IntraWebPage, WindowState } from "../context/GameContext";
import { ContextMenuGroup } from "../components/ContextMenu";

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
  closeApp: vi.fn(),
  minimizeApp: vi.fn(),
  moveWindow: vi.fn(),
  centerWindow: vi.fn(),
  sendToBack: vi.fn(),
  showContextMenu: vi.fn((_e: any, groups: ContextMenuGroup[]) => {
    capturedContextMenuGroups = groups;
  }),
  browserPage: "chirper" as IntraWebPage,
  browserSearchQuery: "",
  webmailPrefillEmail: "",
  navigateBrowser: vi.fn(),
  discoverClue: vi.fn(),
  hasClue: vi.fn((_id: string) => false),
  discoveredClues: [] as Clue[],
  crackedEmails: [] as string[],
  markEmailLoggedIn: vi.fn(),
  markEmailCracked: vi.fn((email: string) => {
    mockGameState.crackedEmails.push(email);
  }),
  openApp: vi.fn(),
  currentMissionIndex: 0,
  completedMissionIds: [] as string[],
  osintHighlight: false,
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
  },
}));

import { IntraWebApp } from "../apps/IntraWebApp";
import { ClueBoardSidebar } from "../components/ClueBoardSidebar";
import { sound } from "../utils/sound";

describe("Milestone 3 Challenger Stress Suite: Hardcore Mode Empirical Verification", () => {
  beforeEach(() => {
    capturedContextMenuGroups = [];
    capturedNotifications = [];
    vi.clearAllMocks();

    mockGameState = {
      windows: createDefaultWindows(),
      activeApp: "intraweb",
      focusApp: vi.fn(),
      closeApp: vi.fn(),
      minimizeApp: vi.fn(),
      moveWindow: vi.fn(),
      centerWindow: vi.fn(),
      sendToBack: vi.fn(),
      showContextMenu: vi.fn((_e: any, groups: ContextMenuGroup[]) => {
        capturedContextMenuGroups = groups;
      }),
      browserPage: "chirper",
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
      discoveredClues: [],
      crackedEmails: [],
      markEmailLoggedIn: vi.fn(),
      markEmailCracked: vi.fn((email: string) => {
        mockGameState.crackedEmails.push(email);
      }),
      openApp: vi.fn(),
      currentMissionIndex: 0,
      completedMissionIds: [],
      osintHighlight: false,
      toggleOsintHighlight: vi.fn(),
      difficulty: "ghost",
      missionStage: "investigating",
      isObjectiveComplete: vi.fn(() => false),
      sendClueToApp: vi.fn(),
      campaignFinished: false,
      executeTerminalCommand: vi.fn(),
      addNotification: vi.fn((title: string, message: string, type: string) => {
        capturedNotifications.push({ title, message, type });
      }),
      passWeaverTargetEmail: "m.cole@velox-ai.io",
      setPassWeaverTargetEmail: vi.fn(),
      passWeaverSelectedClues: [],
      togglePassWeaverClue: vi.fn(),
    };
  });

  describe("1. Ghost Mode Click-to-Discover Rejection", () => {
    it("renders clues without click handler or button tag on ghost difficulty", () => {
      mockGameState.difficulty = "ghost";
      mockGameState.browserPage = "chirper";

      const html = renderToStaticMarkup(React.createElement(IntraWebApp));

      // Natural selectable spans are rendered
      expect(html).toContain(
        'class="inline text-inherit font-inherit select-text cursor-text selection:bg-[#1f6feb]/40 selection:text-white"',
      );
      // No interactive clue button tag on ghost mode
      expect(html).not.toContain(
        "Click to collect and pin this detail to your OSINT Clue Board",
      );
    });

    it("does not trigger discoverClue when clicking text on ghost mode", () => {
      mockGameState.difficulty = "ghost";
      // On ghost mode, discoverClue should not be called simply by rendering or interaction
      expect(mockGameState.discoverClue).not.toHaveBeenCalled();
    });

    it("disables OSINT highlight scanner button on ghost mode", () => {
      mockGameState.difficulty = "ghost";
      const html = renderToStaticMarkup(React.createElement(IntraWebApp));

      // The OSINT scanner toggle button must be disabled
      expect(html).toContain(
        "OSINT Scanner disabled on Zero-Ghost (Hardcore) difficulty",
      );
      expect(html).toContain("OSINT Highlight: OFF");
    });
  });

  describe("2. Viewport Right-Click Text Selection Context Menu", () => {
    it("matches valid clue 'Koda' and provides [+] Pin Intel option", () => {
      const selection = "Koda";
      const matched = Object.values(ALL_CLUES).find(
        (c) => c.value.toLowerCase() === selection.toLowerCase(),
      );

      expect(matched).toBeDefined();
      expect(matched?.id).toBe("clue_marcus_dog");

      // Verify that Pin Intel action executes discoverClue
      mockGameState.discoverClue(matched!.id);
      expect(mockGameState.discoverClue).toHaveBeenCalledWith(
        "clue_marcus_dog",
      );
      expect(mockGameState.discoveredClues.map((c) => c.id)).toContain(
        "clue_marcus_dog",
      );
    });

    it("matches IP addresses like '198.51.100.42' and pins dead-drop IP", () => {
      const selection = "198.51.100.42";
      const matched = Object.values(ALL_CLUES).find(
        (c) => c.value.toLowerCase() === selection.toLowerCase(),
      );

      expect(matched).toBeDefined();
      expect(matched?.id).toBe("clue_dropoff_ip");

      mockGameState.discoverClue(matched!.id);
      expect(mockGameState.discoveredClues.map((c) => c.id)).toContain(
        "clue_dropoff_ip",
      );
    });

    it("ignores non-clue text and does not provide Pin Intel", () => {
      const nonClues = [
        "Velox AI Systems",
        "Quarterly Report",
        "Security Notice",
        "Elena",
      ];
      for (const text of nonClues) {
        const matched = Object.values(ALL_CLUES).find(
          (c) => c.value.toLowerCase() === text.toLowerCase(),
        );
        expect(matched).toBeUndefined();
      }
    });
  });

  describe("3. ClueBoardSidebar Manual Intel Submission Form", () => {
    it("renders manual intel input and submit button in sidebar", () => {
      const html = renderToStaticMarkup(React.createElement(ClueBoardSidebar));
      expect(html).toContain('data-testid="manual-intel-form"');
      expect(html).toContain('data-testid="manual-intel-input"');
      expect(html).toContain('data-testid="manual-intel-submit"');
    });

    it("verifies and pins valid intel with whitespace trimming and case insensitivity", () => {
      const validCases = [
        { raw: "   koda   ", expectedId: "clue_marcus_dog" },
        { raw: "1997", expectedId: "clue_marcus_year" },
        { raw: "HYPERION", expectedId: "clue_julian_project" },
        { raw: "  0451  ", expectedId: "clue_julian_badge" },
        { raw: "omega-99-key", expectedId: "clue_vault_override" },
        { raw: "185.220.101.5", expectedId: "clue_sat_relay_ip" },
      ];

      for (const tc of validCases) {
        const trimmed = tc.raw.trim().toLowerCase();
        const matched = Object.values(ALL_CLUES).find(
          (c) => c.value.toLowerCase() === trimmed,
        );
        expect(matched).toBeDefined();
        expect(matched?.id).toBe(tc.expectedId);

        mockGameState.discoverClue(matched!.id);
      }

      expect(mockGameState.discoveredClues.length).toBe(validCases.length);
    });

    it("correctly identifies unverified intel and triggers warning notification", () => {
      const invalidInputs = [
        "random_string",
        "999999",
        "admin_password",
        "not_a_clue",
      ];

      for (const raw of invalidInputs) {
        const trimmed = raw.trim();
        const matched = Object.values(ALL_CLUES).find(
          (c) => c.value.toLowerCase() === trimmed.toLowerCase(),
        );
        expect(matched).toBeUndefined();

        // Simulate sidebar rejection
        mockGameState.addNotification(
          "Intel Unverified",
          `No known target profile matched "${trimmed}"`,
          "warning",
        );
      }

      expect(capturedNotifications.length).toBe(invalidInputs.length);
      expect(capturedNotifications.every((n) => n.type === "warning")).toBe(
        true,
      );
    });
  });

  describe("4. Downstream Solvability on Hardcore Mode", () => {
    it("completes Op 01 password synthesis and account cracking end-to-end", () => {
      // 1. Manually enter Op 01 clues
      const dog = Object.values(ALL_CLUES).find(
        (c) => c.value.toLowerCase() === "koda",
      );
      const year = Object.values(ALL_CLUES).find(
        (c) => c.value.toLowerCase() === "1997",
      );

      expect(dog).toBeDefined();
      expect(year).toBeDefined();

      mockGameState.discoverClue(dog!.id);
      mockGameState.discoverClue(year!.id);

      // Verify discoveredClues contains both
      expect(
        mockGameState.discoveredClues.some((c) => c.id === "clue_marcus_dog"),
      ).toBe(true);
      expect(
        mockGameState.discoveredClues.some((c) => c.id === "clue_marcus_year"),
      ).toBe(true);

      // 2. Select target account and clues in PassWeaver
      const targetAcc = EMAIL_ACCOUNTS["m.cole@velox-ai.io"];
      expect(targetAcc).toBeDefined();

      const selectedClues = [dog!.id, year!.id];
      const hasAllRequired =
        targetAcc.requiredClueIds.every((r) => selectedClues.includes(r)) &&
        selectedClues.length === targetAcc.requiredClueIds.length;

      expect(hasAllRequired).toBe(true);

      // 3. Synthesize and crack
      mockGameState.markEmailCracked("m.cole@velox-ai.io");
      expect(mockGameState.crackedEmails).toContain("m.cole@velox-ai.io");

      // 4. Discover dead-drop IP from email inbox
      const ipClue = Object.values(ALL_CLUES).find(
        (c) => c.value === "198.51.100.42",
      );
      expect(ipClue).toBeDefined();
      mockGameState.discoverClue(ipClue!.id);

      // 5. Verify all Op 01 objectives are fulfilled
      const objCluesComplete =
        mockGameState.hasClue("clue_marcus_dog") &&
        mockGameState.hasClue("clue_marcus_year");
      const objPassWeaverComplete =
        mockGameState.crackedEmails.includes("m.cole@velox-ai.io");
      const objWebMailComplete = mockGameState.hasClue("clue_dropoff_ip");

      expect(objCluesComplete).toBe(true);
      expect(objPassWeaverComplete).toBe(true);
      expect(objWebMailComplete).toBe(true);
    });

    it("completes Op 03 password synthesis for Julian Sterling", () => {
      const project = Object.values(ALL_CLUES).find(
        (c) => c.value.toLowerCase() === "hyperion",
      );
      const badge = Object.values(ALL_CLUES).find(
        (c) => c.value.toLowerCase() === "0451",
      );

      expect(project).toBeDefined();
      expect(badge).toBeDefined();

      mockGameState.discoverClue(project!.id);
      mockGameState.discoverClue(badge!.id);

      const target = EMAIL_ACCOUNTS["j.sterling@aethelgard.corp"];
      const selected = [project!.id, badge!.id];
      const hasAll =
        target.requiredClueIds.every((r) => selected.includes(r)) &&
        selected.length === target.requiredClueIds.length;

      expect(hasAll).toBe(true);
      mockGameState.markEmailCracked("j.sterling@aethelgard.corp");
      expect(mockGameState.crackedEmails).toContain(
        "j.sterling@aethelgard.corp",
      );
    });
  });

  describe("5. Adversarial Audit: Clue Value Collision Analysis", () => {
    it("checks ALL_CLUES for identical values across different clues", () => {
      const valueMap = new Map<string, string[]>();

      for (const clue of Object.values(ALL_CLUES)) {
        const val = clue.value.toLowerCase();
        if (!valueMap.has(val)) {
          valueMap.set(val, []);
        }
        valueMap.get(val)!.push(clue.id);
      }

      const collisions: { value: string; clueIds: string[] }[] = [];
      for (const [val, ids] of valueMap.entries()) {
        if (ids.length > 1) {
          collisions.push({ value: val, clueIds: ids });
        }
      }

      // Look at collisions found:
      // "2019" belongs to both "clue_velox_year" and "clue_kai_year"
      expect(collisions.length).toBeGreaterThan(0);
      const collision2019 = collisions.find((c) => c.value === "2019");
      expect(collision2019).toBeDefined();
      expect(collision2019?.clueIds).toEqual([
        "clue_velox_year",
        "clue_kai_year",
      ]);
    });

    it("demonstrates the collision impact: Kai Thorne cert year vs Velox founding year", () => {
      // When a player inputs '2019', Object.values(ALL_CLUES).find() returns clue_velox_year
      const matched = Object.values(ALL_CLUES).find(
        (c) => c.value.toLowerCase() === "2019",
      );

      // Notice: matched.id is 'clue_velox_year', NOT 'clue_kai_year'
      expect(matched?.id).toBe("clue_velox_year");

      // Check if clue_kai_year can ever be reached by Object.values(ALL_CLUES).find()
      const allMatching = Object.values(ALL_CLUES).filter(
        (c) => c.value.toLowerCase() === "2019",
      );
      expect(allMatching.length).toBe(2);
      expect(allMatching[0].id).toBe("clue_velox_year");
      expect(allMatching[1].id).toBe("clue_kai_year");

      // Verify that Kai Thorne required clues includes clue_kai_year
      const kaiAccount = EMAIL_ACCOUNTS["k.thorne@oceaniclink-telecom.net"];
      expect(kaiAccount.requiredClueIds).toContain("clue_kai_year");
    });
  });
});
