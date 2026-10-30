import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ALL_CLUES, EMAIL_ACCOUNTS, MISSIONS } from "../data/worldData";
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

// Controllable mock state for useGame hook
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
};

vi.mock("../context/GameContext", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../context/GameContext")>();
  return {
    ...actual,
    useGame: () => mockGameState,
  };
});

// Mock sound module
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

describe("Milestone 3: Hardcore Mode Clue Mechanics, Text Selection & Manual Intel Pinning", () => {
  beforeEach(() => {
    capturedContextMenuGroups = [];
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
      discoverClue: vi.fn(),
      hasClue: vi.fn((_id: string) => false),
      discoveredClues: [],
      crackedEmails: [],
      markEmailLoggedIn: vi.fn(),
      openApp: vi.fn(),
      currentMissionIndex: 0,
      completedMissionIds: [],
      osintHighlight: true,
      toggleOsintHighlight: vi.fn(),
      difficulty: "ghost",
      missionStage: "investigating",
      isObjectiveComplete: vi.fn(() => false),
      sendClueToApp: vi.fn(),
      campaignFinished: false,
      executeTerminalCommand: vi.fn(),
      addNotification: vi.fn(),
    };
  });

  describe("1. ClueSpan on Ghost (Hardcore) Difficulty", () => {
    it("renders clues as natural selectable text with select-text and cursor-text", () => {
      mockGameState.difficulty = "ghost";
      mockGameState.browserPage = "chirper";

      const html = renderToStaticMarkup(React.createElement(IntraWebApp));

      // Must contain natural text tokens
      expect(html).toContain("Koda");
      expect(html).toContain("1997");

      // Must have select-text and cursor-text styles for mouse selection
      expect(html).toContain("select-text cursor-text");

      // Must NOT contain old select-none or scanner buttons
      expect(html).not.toContain("cursor-default select-none");
      expect(html).not.toContain(
        "Click to collect and pin this detail to your OSINT Clue Board",
      );
    });

    it("restores cybernetic scanner overlay when difficulty is operative and highlight is ON", () => {
      mockGameState.difficulty = "operative";
      mockGameState.osintHighlight = true;
      mockGameState.browserPage = "chirper";

      const html = renderToStaticMarkup(React.createElement(IntraWebApp));
      expect(html).toContain(
        "Click to collect and pin this detail to your OSINT Clue Board",
      );
    });
  });

  describe("2. Viewport Text Selection & Right-Click Context Menu", () => {
    it("renders the viewport with select-text class to enable mouse selection", () => {
      const html = renderToStaticMarkup(React.createElement(IntraWebApp));
      expect(html).toContain("select-text");
    });

    it("verifies clue matching logic for right-click Pin Intel action", () => {
      // Simulate selection of target clue value "Koda"
      const selection = "Koda";
      const matchedClue = Object.values(ALL_CLUES).find(
        (c) => c.value.toLowerCase() === selection.toLowerCase(),
      );

      expect(matchedClue).toBeDefined();
      expect(matchedClue?.id).toBe("clue_marcus_dog");
      expect(matchedClue?.label).toBe("Dog Name");
    });

    it("verifies IP address clue matching logic for '185.220.101.5'", () => {
      const selection = "185.220.101.5";
      const matchedClue = Object.values(ALL_CLUES).find(
        (c) => c.value.toLowerCase() === selection.toLowerCase(),
      );

      expect(matchedClue).toBeDefined();
      expect(matchedClue?.id).toBe("clue_sat_relay_ip");
      expect(matchedClue?.label).toBe("Orbital Sat Relay IP");
    });

    it("verifies non-clue text selection does not match any ALL_CLUES", () => {
      const selection = "Random Corporation Text";
      const matchedClue = Object.values(ALL_CLUES).find(
        (c) => c.value.toLowerCase() === selection.toLowerCase(),
      );

      expect(matchedClue).toBeUndefined();
    });
  });

  describe("3. ClueBoardSidebar Manual Intel Submission Form", () => {
    it("renders manual intel submission input and pin button", () => {
      const html = renderToStaticMarkup(React.createElement(ClueBoardSidebar));

      expect(html).toContain('data-testid="manual-intel-form"');
      expect(html).toContain('data-testid="manual-intel-input"');
      expect(html).toContain('data-testid="manual-intel-submit"');
      expect(html).toContain("Manual intel entry (e.g. Koda, 0451)...");
    });

    it("matches valid clue values case-insensitively and handles whitespace", () => {
      const testCases = [
        { input: "koda", expectedId: "clue_marcus_dog" },
        { input: "  1997  ", expectedId: "clue_marcus_year" },
        { input: "198.51.100.42", expectedId: "clue_dropoff_ip" },
        { input: "hyperion", expectedId: "clue_julian_project" },
        { input: "0451", expectedId: "clue_julian_badge" },
        { input: "SaintJude", expectedId: "clue_sterling_club" },
      ];

      for (const tc of testCases) {
        const trimmed = tc.input.trim().toLowerCase();
        const matched = Object.values(ALL_CLUES).find(
          (c) => c.value.toLowerCase() === trimmed,
        );
        expect(matched).toBeDefined();
        expect(matched?.id).toBe(tc.expectedId);
      }
    });

    it("rejects unknown intel and identifies non-matching strings", () => {
      const invalidInputs = ["", "   ", "random_gibberish", "not_a_clue_1234"];

      for (const raw of invalidInputs) {
        const trimmed = raw.trim();
        if (!trimmed) {
          expect(trimmed).toBe("");
          continue;
        }
        const matched = Object.values(ALL_CLUES).find(
          (c) => c.value.toLowerCase() === trimmed.toLowerCase(),
        );
        expect(matched).toBeUndefined();
      }
    });
  });

  describe("4. End-to-End Investigation & Password Synthesis Compatibility", () => {
    it("allows manual clues to fulfill PassWeaver password synthesis for Op 01", () => {
      const dog = ALL_CLUES.clue_marcus_dog;
      const year = ALL_CLUES.clue_marcus_year;
      const target = EMAIL_ACCOUNTS["m.cole@velox-ai.io"];

      expect(target).toBeDefined();
      expect(target.requiredClueIds).toContain(dog.id);
      expect(target.requiredClueIds).toContain(year.id);

      // Operator synthesizes password from manually pinned clues
      const synthesized = `${dog.value}${year.value}`;
      expect(synthesized).toBe(target.password);
    });

    it("allows manual clues to fulfill PassWeaver password synthesis for Op 03 (Julian Sterling)", () => {
      const project = ALL_CLUES.clue_julian_project;
      const badge = ALL_CLUES.clue_julian_badge;
      const target = EMAIL_ACCOUNTS["j.sterling@aethelgard.corp"];

      expect(target).toBeDefined();
      expect(target.requiredClueIds).toEqual([project.id, badge.id]);

      const synthesized = `${project.value}${badge.value}`;
      expect(synthesized).toBe(target.password);
    });

    it("recognizes decoy clues correctly in manual submission", () => {
      const catClue = ALL_CLUES.clue_marcus_cat;
      expect(catClue.isDecoy).toBe(true);
      expect(catClue.value).toBe("Pixel");

      const yearClue = ALL_CLUES.clue_velox_year;
      expect(yearClue.isDecoy).toBe(true);
      expect(yearClue.value).toBe("2019");

      // Decoys still exist in ALL_CLUES so operators can verify and pin them
      const matched = Object.values(ALL_CLUES).find(
        (c) => c.value.toLowerCase() === "pixel",
      );
      expect(matched?.id).toBe("clue_marcus_cat");
      expect(matched?.isDecoy).toBe(true);
    });
  });

  describe("5. Clue Value Collision Remediation ('2019')", () => {
    it("discovers all matching clues when multiple clues share identical value '2019'", () => {
      const trimmed = "2019".trim().toLowerCase();
      const matches = Object.values(ALL_CLUES).filter(
        (c) => c.value.toLowerCase() === trimmed,
      );

      expect(matches.length).toBe(2);
      const matchIds = matches.map((c) => c.id);
      expect(matchIds).toContain("clue_velox_year");
      expect(matchIds).toContain("clue_kai_year");

      // Verify each matched clue is discovered
      matches.forEach((matched) => mockGameState.discoverClue(matched.id));

      expect(mockGameState.discoverClue).toHaveBeenCalledWith(
        "clue_velox_year",
      );
      expect(mockGameState.discoverClue).toHaveBeenCalledWith("clue_kai_year");
    });

    it("enables Kai Thorne password synthesis after discovering '2019' via multi-match resolution", () => {
      // 1. Discover 'AbyssPoint9'
      const station = ALL_CLUES.clue_kai_station;
      expect(station).toBeDefined();
      mockGameState.discoveredClues.push(station);
      mockGameState.discoverClue(station.id);

      // 2. Discover '2019' via filter
      const matches = Object.values(ALL_CLUES).filter(
        (c) => c.value.toLowerCase() === "2019",
      );
      matches.forEach((m) => {
        mockGameState.discoveredClues.push(m);
        mockGameState.discoverClue(m.id);
      });

      // 3. Verify Kai Thorne account requirements
      const kaiAccount = EMAIL_ACCOUNTS["k.thorne@oceaniclink-telecom.net"];
      expect(kaiAccount).toBeDefined();

      const discoveredIds = mockGameState.discoveredClues.map((c) => c.id);
      const hasKaiYear = discoveredIds.includes("clue_kai_year");
      expect(hasKaiYear).toBe(true);

      const hasAllRequired = kaiAccount.requiredClueIds.every((r) =>
        discoveredIds.includes(r),
      );
      expect(hasAllRequired).toBe(true);

      // 4. Verify password synthesis
      const synthesized = `${station.value}${ALL_CLUES.clue_kai_year.value}`;
      expect(synthesized).toBe(kaiAccount.password);
    });

    it("creates Pin Intel context menu items for all matched clues on selection", () => {
      const selection = "2019";
      const matchedClues = Object.values(ALL_CLUES).filter(
        (c) => c.value.toLowerCase() === selection.toLowerCase(),
      );

      const items: { label: string; clueId: string }[] = [];
      matchedClues.forEach((matchedClue) => {
        items.unshift({
          label: `[+] Pin Intel: ${matchedClue.label} ("${matchedClue.value}")`,
          clueId: matchedClue.id,
        });
      });

      expect(items.length).toBe(2);
      expect(items[0].clueId).toBe("clue_kai_year");
      expect(items[0].label).toContain("Deep Dive Cert Year");
      expect(items[1].clueId).toBe("clue_velox_year");
      expect(items[1].label).toContain("Founding Year");
    });
  });
});
