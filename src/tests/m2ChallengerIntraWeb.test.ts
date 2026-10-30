import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ALL_CLUES,
  CHIRPER_POSTS,
  NEWS_ARTICLES,
  VELOX_EMPLOYEES,
  AETHELGARD_EMPLOYEES,
  NORDGRID_EMPLOYEES,
  OCEANICLINK_EMPLOYEES,
  EMAIL_ACCOUNTS,
  MISSIONS,
} from "../data/worldData";
import { IntraWebPage, WindowState } from "../context/GameContext";
import { AppId } from "../types/game";

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
    isOpen: false,
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
  showContextMenu: vi.fn(),
  browserPage: "chirper" as IntraWebPage,
  browserSearchQuery: "",
  webmailPrefillEmail: "",
  navigateBrowser: vi.fn(),
  discoverClue: vi.fn(),
  hasClue: vi.fn((_id: string) => false),
  crackedEmails: [] as string[],
  markEmailLoggedIn: vi.fn(),
  openApp: vi.fn(),
  currentMissionIndex: 0,
  completedMissionIds: [] as string[],
  osintHighlight: true,
  toggleOsintHighlight: vi.fn(),
  difficulty: "normal" as "normal" | "ghost" | "story",
};

vi.mock("../context/GameContext", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../context/GameContext")>();
  return {
    ...actual,
    useGame: () => mockGameState,
  };
});

// Mock sound module to avoid Web Audio API issues in Node
vi.mock("../utils/sound", () => ({
  sound: {
    playClick: vi.fn(),
    playKey: vi.fn(),
    playSuccess: vi.fn(),
    playError: vi.fn(),
    playWindowOpen: vi.fn(),
    playWindowClose: vi.fn(),
  },
}));

// Import IntraWebApp after mocking dependencies
import { IntraWebApp } from "../apps/IntraWebApp";

describe("Milestone 2 Challenger Suite: IntraWeb Progression, Clue Extraction & Noise Isolation", () => {
  beforeEach(() => {
    mockGameState = {
      windows: createDefaultWindows(),
      activeApp: "intraweb",
      focusApp: vi.fn(),
      closeApp: vi.fn(),
      minimizeApp: vi.fn(),
      moveWindow: vi.fn(),
      centerWindow: vi.fn(),
      sendToBack: vi.fn(),
      showContextMenu: vi.fn(),
      browserPage: "chirper",
      browserSearchQuery: "",
      webmailPrefillEmail: "",
      navigateBrowser: vi.fn(),
      discoverClue: vi.fn(),
      hasClue: vi.fn((_id: string) => false),
      crackedEmails: [],
      markEmailLoggedIn: vi.fn(),
      openApp: vi.fn(),
      currentMissionIndex: 0,
      completedMissionIds: [],
      osintHighlight: true,
      toggleOsintHighlight: vi.fn(),
      difficulty: "normal",
    };
  });

  describe("1. Chirper Target Clue Extraction & ALL_CLUES Integrity", () => {
    it("verifies all clues embedded in CHIRPER_POSTS exist in ALL_CLUES and match exact values", () => {
      const postsWithClues = CHIRPER_POSTS.filter(
        (p) => p.clues && p.clues.length > 0,
      );
      expect(postsWithClues.length).toBeGreaterThanOrEqual(8);

      postsWithClues.forEach((post) => {
        post.clues!.forEach((clue) => {
          const registeredClue = ALL_CLUES[clue.id];
          expect(
            registeredClue,
            `Clue ID '${clue.id}' in post '${post.id}' must exist in ALL_CLUES`,
          ).toBeDefined();

          expect(
            clue.text,
            `Clue text '${clue.text}' in post '${post.id}' must match ALL_CLUES value '${registeredClue.value}'`,
          ).toBe(registeredClue.value);

          expect(
            post.content.includes(clue.text),
            `Post '${post.id}' content must contain clue substring '${clue.text}'`,
          ).toBe(true);
        });
      });
    });

    it("verifies all Chirper-sourced clues in ALL_CLUES are present in CHIRPER_POSTS", () => {
      const chirperSourcedClues = Object.values(ALL_CLUES).filter((c) =>
        c.source?.toLowerCase().includes("chirper"),
      );
      expect(chirperSourcedClues.length).toBeGreaterThanOrEqual(10);

      const allEmbeddedClueIds = new Set(
        CHIRPER_POSTS.flatMap((p) => p.clues?.map((c) => c.id) ?? []),
      );

      chirperSourcedClues.forEach((clue) => {
        expect(
          allEmbeddedClueIds.has(clue.id),
          `Chirper clue '${clue.id}' (${clue.label}: ${clue.value}) must be embedded in CHIRPER_POSTS`,
        ).toBe(true);
      });
    });

    it("ensures no two clues in the same Chirper post are identical or cause substring collisions", () => {
      CHIRPER_POSTS.forEach((post) => {
        if (!post.clues || post.clues.length <= 1) return;
        const texts = post.clues.map((c) => c.text);
        const uniqueTexts = new Set(texts);
        expect(
          uniqueTexts.size,
          `Post '${post.id}' contains duplicate clue texts`,
        ).toBe(texts.length);

        // Check for proper substring collision avoidance
        for (let i = 0; i < texts.length; i++) {
          for (let j = 0; j < texts.length; j++) {
            if (i !== j) {
              expect(
                texts[i] !== texts[j],
                `Post '${post.id}' has conflicting identical clue texts`,
              ).toBe(true);
            }
          }
        }
      });
    });
  });

  describe("2. Chirper Clue Substring Rendering & Markup Integrity", () => {
    it("renders Chirper feed on Normal mode with ClueSpan buttons and OSINT scanner cues", () => {
      mockGameState.browserPage = "chirper";
      mockGameState.currentMissionIndex = 0;
      mockGameState.osintHighlight = true;
      mockGameState.difficulty = "normal";

      const html = renderToStaticMarkup(React.createElement(IntraWebApp));

      // At mission 0, Marcus Cole's posts must be visible
      expect(html).toContain("Marcus Cole");
      expect(html).toContain("@mcole_dev");

      // Verify clue text is rendered inside interactive button with scanner cue
      expect(html).toContain("Koda");
      expect(html).toContain("Pixel");
      expect(html).toContain("1997");
      expect(html).toContain("2019");

      // ClueSpan buttons have title "Click to collect and pin this detail"
      expect(html).toContain(
        "Click to collect and pin this detail to your OSINT Clue Board",
      );

      // Verify Gordon Vance Bounty #02 clues are visible at start
      expect(html).toContain("Commissioner Gordon Vance");
      expect(html).toContain("RoyalPine");
      expect(html).toContain("Badge990");
    });

    it("renders Chirper feed on Hardcore (Zero-Ghost) mode as unstyled text spans without scanner buttons", () => {
      mockGameState.browserPage = "chirper";
      mockGameState.currentMissionIndex = 0;
      mockGameState.osintHighlight = true; // Even if state is true
      mockGameState.difficulty = "ghost"; // Ghost mode suppresses scanner highlights

      const html = renderToStaticMarkup(React.createElement(IntraWebApp));

      // Clue substrings still appear in the text
      expect(html).toContain("Koda");
      expect(html).toContain("1997");

      // But scanner buttons and titles MUST NOT appear
      expect(html).not.toContain(
        "Click to collect and pin this detail to your OSINT Clue Board",
      );
      // Hardcore mode renders clues as selectable text per Requirement R3
      expect(html).toContain("select-text cursor-text");
    });

    it("reconstructs exact post content text when ClueSpans are rendered", () => {
      // Direct oracle test: verify that splitting and reassembling content preserves every character
      CHIRPER_POSTS.filter((p) => p.clues && p.clues.length > 0).forEach(
        (post) => {
          const escaped = post.clues!.map((c) =>
            c.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          );
          const regex = new RegExp(`(${escaped.join("|")})`, "g");
          const parts = post.content.split(regex);
          const reassembled = parts.join("");
          expect(
            reassembled,
            `Reassembled parts for post '${post.id}' must match original content`,
          ).toBe(post.content);
        },
      );
    });
  });

  describe("3. Corporate Employee Directories Clue Preservation & Isolation", () => {
    it("renders Velox AI directory: Marcus Cole binds clue_marcus_email; non-targets render plain text", () => {
      mockGameState.browserPage = "velox";
      mockGameState.osintHighlight = true;
      mockGameState.difficulty = "normal";

      const html = renderToStaticMarkup(React.createElement(IntraWebApp));

      // Directory header
      expect(html).toContain("VELOX NEURAL SYSTEMS INC.");
      expect(html).toContain("VELOX AI — EXECUTIVE DIRECTORY");

      // Marcus Cole target profile
      expect(html).toContain("Marcus Cole");
      expect(html).toContain("Work Email:");
      expect(html).toContain("m.cole@velox-ai.io");

      // Verify clue_marcus_email matches ALL_CLUES
      expect(ALL_CLUES["clue_marcus_email"].value).toBe("m.cole@velox-ai.io");

      // Verify mundane employees render plain text contact without ClueSpan buttons
      const mundaneVelox = [
        "Elena Vance",
        "Devon Brooks",
        "Dr. Priya Nair",
        "Lucas Meyer",
        "Chloe Zhao",
      ];
      mundaneVelox.forEach((name) => {
        expect(html).toContain(name);
      });

      // Elena Vance has contact without "Work Email: <button"
      expect(html).toContain("Contact: elena@velox-ai.io");
      expect(html).toContain("Contact: d.brooks@velox-ai.io");
      expect(html).toContain("Contact: p.nair@velox-ai.io");
      expect(html).toContain("Contact: l.meyer@velox-ai.io");
      expect(html).toContain("Contact: c.zhao@velox-ai.io");
    });

    it("renders Aethelgard directory: Julian Sterling binds clue_julian_badge & clue_julian_email; Orbital IP bound; non-targets clean", () => {
      mockGameState.browserPage = "aethelgard";
      mockGameState.currentMissionIndex = 2;
      mockGameState.osintHighlight = true;
      mockGameState.difficulty = "normal";

      const html = renderToStaticMarkup(React.createElement(IntraWebApp));

      // Directory header
      expect(html).toContain("AETHELGARD DEFENSE &amp; SOVEREIGN INTELLIGENCE");

      // Julian Sterling binds badge 0451 and email
      expect(html).toContain("Director Julian Sterling");
      expect(html).toContain("0451");
      expect(html).toContain("j.sterling@aethelgard.corp");
      expect(ALL_CLUES["clue_julian_badge"].value).toBe("0451");
      expect(ALL_CLUES["clue_julian_email"].value).toBe(
        "j.sterling@aethelgard.corp",
      );

      // Orbital Telemetry ground station IP
      expect(html).toContain("185.220.101.5");
      expect(ALL_CLUES["clue_sat_relay_ip"].value).toBe("185.220.101.5");

      // Chief Viktor Reyes is target for lore but emailClueId is undefined in directory
      expect(html).toContain("Chief Viktor Reyes");
      expect(html).toContain("Contact: v.reyes@aethelgard.corp");

      // Non-target staff
      const mundaneAethel = [
        "Rowan Bennett",
        "Soren Lind",
        "Mireille Fournier",
        "Erik Vance",
      ];
      mundaneAethel.forEach((name) => {
        expect(html).toContain(name);
      });
      expect(html).toContain("Contact: r.bennett@aethelgard.corp");
      expect(html).toContain("Contact: s.lind@aethelgard.corp");
      expect(html).toContain("Contact: m.fournier@aethelgard.corp");
      expect(html).toContain("Contact: e.vance@aethelgard.corp");
    });

    it("renders NordGrid SCADA directory: Astrid Lindholm binds clue_scada_ip (217.182.80.50); staff clean", () => {
      mockGameState.browserPage = "nordgrid";
      mockGameState.osintHighlight = true;
      mockGameState.difficulty = "normal";

      const html = renderToStaticMarkup(React.createElement(IntraWebApp));

      expect(html).toContain("NORDGRID HIGH-VOLTAGE POWER TRANSMISSION");
      expect(html).toContain("Dr. Astrid Lindholm");
      expect(html).toContain("217.182.80.50");
      expect(ALL_CLUES["clue_scada_ip"].value).toBe("217.182.80.50");

      // Non-target engineers
      expect(html).toContain("Frederik Solberg");
      expect(html).toContain("Ingrid Dahl");
      expect(html).toContain("f.solberg@nordgrid-power.com");
      expect(html).toContain("i.dahl@nordgrid-power.com");
    });

    it("renders OceanicLink directory: Station 04 binds clue_subsea_fiber_ip (102.16.88.12); staff clean", () => {
      mockGameState.browserPage = "oceaniclink";
      mockGameState.osintHighlight = true;
      mockGameState.difficulty = "normal";

      const html = renderToStaticMarkup(React.createElement(IntraWebApp));

      expect(html).toContain("OCEANICLINK GLOBAL SUBSEA TELECOM");
      expect(html).toContain("Kai Thorne");
      expect(html).toContain("102.16.88.12");
      expect(ALL_CLUES["clue_subsea_fiber_ip"].value).toBe("102.16.88.12");

      // Non-target marine staff
      expect(html).toContain("Nadia O&#x27;Connor");
      expect(html).toContain("Sean Gallagher");
      expect(html).toContain("n.oconnor@oceaniclink-telecom.net");
      expect(html).toContain("s.gallagher@oceaniclink-telecom.net");
    });

    it("renders Svalbard Vault and DarkForum clues without regression", () => {
      // Svalbard
      mockGameState.browserPage = "svalbard";
      const svalbardHtml = renderToStaticMarkup(
        React.createElement(IntraWebApp),
      );
      expect(svalbardHtml).toContain("185.190.20.1");
      expect(ALL_CLUES["clue_svalbard_bunker_ip"].value).toBe("185.190.20.1");

      // DarkForum
      mockGameState.browserPage = "darkforum";
      const darkForumHtml = renderToStaticMarkup(
        React.createElement(IntraWebApp),
      );
      expect(darkForumHtml).toContain("GODEL-ZERO-SELF-TERMINATE");
      expect(ALL_CLUES["clue_ouroboros_root_paradox"].value).toBe(
        "GODEL-ZERO-SELF-TERMINATE",
      );
    });
  });

  describe("4. NewsWire Portal Gating & Breaking Alert Display", () => {
    it("renders initial articles at mission index 0 and excludes locked reactive articles", () => {
      mockGameState.browserPage = "news";
      mockGameState.currentMissionIndex = 0;
      mockGameState.completedMissionIds = [];

      const html = renderToStaticMarkup(React.createElement(IntraWebApp));

      expect(html).toContain("GLOBAL NEWSWIRE // SYNDICATED DISPATCH");
      expect(html).toContain(
        "Velox AI Expands Series-A Neural Research Infrastructure",
      );
      expect(html).toContain(
        "Aethelgard Awarded Defense Grid Telemetry Modernization Contract",
      );
      expect(html).toContain(
        "NordGrid Prepares Continental SCADA Infrastructure for Winter Peak",
      );

      // Later chronological article (minMissionIndex: 3) must NOT be visible at index 0
      expect(html).not.toContain(
        "VALKYRIE-7 Orbital Constellation Declared Fully Operational",
      );

      // Reactive articles must NOT be visible yet
      expect(html).not.toContain(
        "BREAKING: Velox AI Confirms Breach of Offshore Staging Relay",
      );
      expect(html).not.toContain(
        "CRITICAL: Cascading Blackout Hits Sector 7; SCADA Desynchronization Suspected",
      );
    });

    it("renders reactive breaking news article with critical alert banner after triggering mission completion", () => {
      mockGameState.browserPage = "news";
      mockGameState.currentMissionIndex = 2;
      mockGameState.completedMissionIds = ["mission_1", "mission_2"];

      const html = renderToStaticMarkup(React.createElement(IntraWebApp));

      // Op 02 reactive article appears
      expect(html).toContain(
        "BREAKING: Velox AI Confirms Breach of Offshore Staging Relay",
      );
      expect(html).toContain("CRITICAL ALERT // BREAKING INTELLIGENCE");
    });
  });

  describe("5. LookUp Search Engine Query Indexing & Clue Resolvability", () => {
    it("resolves target persons, companies, and clues to their respective pages in LookUp search", () => {
      mockGameState.browserPage = "search";
      mockGameState.currentMissionIndex = 0;

      // When search query is empty
      const defaultSearchHtml = renderToStaticMarkup(
        React.createElement(IntraWebApp),
      );
      expect(defaultSearchHtml).toContain("LOOKUP // OSINT DIRECTORY INDEX");
      expect(defaultSearchHtml).toContain("Velox AI — Executive Team");
      expect(defaultSearchHtml).toContain("Chirper Public Stream");

      // Verify quick queries
      expect(defaultSearchHtml).toContain("Marcus Cole");
      expect(defaultSearchHtml).toContain("Velox AI");
      expect(defaultSearchHtml).toContain("NewsWire");
    });
  });

  describe("6. Noise Text Purity & Decoy Isolation", () => {
    it("confirms 10 red herring Chirper posts have no clues and contain no unintended target passwords", () => {
      const targetPasswords = Object.values(EMAIL_ACCOUNTS).map(
        (a) => a.password,
      );
      const criticalTokens = [
        "OMEGA-99-KEY",
        "TITAN-ZERO-PURGE",
        "MODBUS-TRIP-77A",
        "QKD-SIG-9944-ALPHA",
        "GODEL-ZERO-SELF-TERMINATE",
        "OVERRIDE-GHOST-RECALL",
      ];

      const noisePosts = CHIRPER_POSTS.filter((p) =>
        p.id.startsWith("chirp_noise_"),
      );
      expect(noisePosts.length).toBe(10);

      noisePosts.forEach((post) => {
        expect(
          post.clues === undefined || post.clues.length === 0,
          `Noise post ${post.id} must have no clues`,
        ).toBe(true);

        targetPasswords.forEach((pw) => {
          expect(
            post.content.includes(pw),
            `Noise post ${post.id} must not leak password ${pw}`,
          ).toBe(false);
        });

        criticalTokens.forEach((token) => {
          expect(
            post.content.includes(token),
            `Noise post ${post.id} must not leak token ${token}`,
          ).toBe(false);
        });
      });
    });

    it("confirms non-target corporate employees do not match any clue values", () => {
      const allNonTargets = [
        ...VELOX_EMPLOYEES.filter((e) => !e.isTarget),
        ...AETHELGARD_EMPLOYEES.filter((e) => !e.isTarget),
        ...NORDGRID_EMPLOYEES.filter((e) => !e.isTarget),
        ...OCEANICLINK_EMPLOYEES.filter((e) => !e.isTarget),
      ];

      expect(allNonTargets.length).toBe(13);

      const allClueValues = new Set(
        Object.values(ALL_CLUES).map((c) => c.value),
      );

      allNonTargets.forEach((emp) => {
        expect(
          allClueValues.has(emp.email),
          `Non-target ${emp.name} email '${emp.email}' must not collide with any clue value`,
        ).toBe(false);
      });
    });
  });

  describe("7. Adversarial Stress: Timeline Progression Retention", () => {
    it("ensures early clues are never lost or locked out when advancing to later mission indices", () => {
      // Simulate player reaching Operation 10 (currentMissionIndex = 9)
      const allMissionIds = MISSIONS.map((m) => m.id);

      for (let missionIdx = 0; missionIdx < MISSIONS.length; missionIdx++) {
        const completed = allMissionIds.slice(0, missionIdx);
        mockGameState.currentMissionIndex = missionIdx;
        mockGameState.completedMissionIds = completed;
        mockGameState.browserPage = "chirper";

        const html = renderToStaticMarkup(React.createElement(IntraWebApp));

        // Marcus Cole clues from Op 01 must ALWAYS be visible across all 10 operations!
        expect(
          html.includes("Koda"),
          `Koda must remain visible at mission index ${missionIdx}`,
        ).toBe(true);
        expect(
          html.includes("1997"),
          `1997 must remain visible at mission index ${missionIdx}`,
        ).toBe(true);

        // If missionIdx >= 2, Julian Sterling clues must be visible
        if (missionIdx >= 2) {
          expect(
            html.includes("Hyperion"),
            `Hyperion must be visible at mission index ${missionIdx}`,
          ).toBe(true);
        }

        // If missionIdx >= 4, Viktor Reyes clues must be visible
        if (missionIdx >= 4) {
          expect(
            html.includes("Phantom77"),
            `Phantom77 must be visible at mission index ${missionIdx}`,
          ).toBe(true);
          expect(
            html.includes("8821"),
            `8821 must be visible at mission index ${missionIdx}`,
          ).toBe(true);
        }

        // If missionIdx >= 7, Astrid Lindholm clues must be visible
        if (missionIdx >= 7) {
          expect(
            html.includes("NordicBreeze"),
            `NordicBreeze must be visible at mission index ${missionIdx}`,
          ).toBe(true);
          expect(
            html.includes("5020"),
            `5020 must be visible at mission index ${missionIdx}`,
          ).toBe(true);
        }

        // If missionIdx >= 8, Kai Thorne clues must be visible
        if (missionIdx >= 8) {
          expect(
            html.includes("AbyssPoint9"),
            `AbyssPoint9 must be visible at mission index ${missionIdx}`,
          ).toBe(true);
        }
      }
    });
  });
});
