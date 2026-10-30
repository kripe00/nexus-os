import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  CHIRPER_POSTS,
  NEWS_ARTICLES,
  MISSIONS,
  ALL_CLUES,
  EMAIL_ACCOUNTS,
} from "../data/worldData";
import { ChirperPost, NewsArticle } from "../types/game";
import { IntraWebPage } from "../context/GameContext";

// Controllable mock state for useGame hook to test IntraWebApp component rendering
let mockGameState = {
  browserPage: "news" as IntraWebPage,
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
  activeApp: "intraweb" as const,
  windows: {
    intraweb: {
      id: "intraweb",
      title: "IntraWeb Browser",
      isOpen: true,
      isMinimized: false,
      zIndex: 10,
      position: { x: 0, y: 0 },
    },
  } as Record<string, any>,
  bringToFront: vi.fn(),
  closeApp: vi.fn(),
  minimizeApp: vi.fn(),
  maximizeApp: vi.fn(),
  restoreApp: vi.fn(),
  moveWindow: vi.fn(),
  startWindowDrag: vi.fn(),
  showContextMenu: vi.fn(),
};

vi.mock("../context/GameContext", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../context/GameContext")>();
  return {
    ...actual,
    useGame: () => mockGameState,
  };
});

// Import component after mock is registered
import { IntraWebApp } from "../apps/IntraWebApp";

/**
 * Challenger 2 — Milestone 2 Empirical Test Suite
 *
 * Verifies the dynamic filtering logic and UI markup in `src/apps/IntraWebApp.tsx`:
 * - Chirper and NewsWire chronological minMissionIndex gating
 * - Reactive post and article emergence upon mission completion (Op 02, Op 08)
 * - Breaking alert badges and reactive indicators in rendered HTML
 * - Adversarial edge cases: out-of-order progression, boundary conditions, noise isolation
 */

// Exact filtering logic as implemented in src/apps/IntraWebApp.tsx (lines 440-458)
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

describe("Milestone 2 Empirical Challenger: Reactive NewsWire & Dynamic Chirper Filtering", () => {
  beforeEach(() => {
    mockGameState.browserPage = "news";
    mockGameState.browserSearchQuery = "";
    mockGameState.currentMissionIndex = 0;
    mockGameState.completedMissionIds = [];
    mockGameState.difficulty = "normal";
  });

  describe("1. Initial Baseline State at Mission Index 0 (No Completed Missions)", () => {
    const visiblePosts = getVisibleChirperPosts(0, []);
    const visibleArticles = getVisibleNewsArticles(0, []);

    it("displays only initial chronological Chirper posts (minMissionIndex === 0)", () => {
      // Must contain Marcus Cole's target posts (Op 01 clues: Koda, Pixel, 1997, 2019)
      const marcusPosts = visiblePosts.filter(
        (p) => p.authorName === "Marcus Cole",
      );
      expect(marcusPosts.length).toBe(2);
      expect(marcusPosts.map((p) => p.id)).toEqual([
        "chirp_marcus_1",
        "chirp_marcus_2",
      ]);

      // Must contain Commissioner Gordon Vance (Bounty Contract 02 clues)
      const vancePost = visiblePosts.find((p) => p.id === "chirp_vance_bounty");
      expect(vancePost).toBeDefined();

      // Must contain initial noise posts with minMissionIndex === 0
      const noisePosts = visiblePosts.filter((p) =>
        p.id.startsWith("chirp_noise_"),
      );
      expect(noisePosts.length).toBe(7); // Lucas, Priya, Devon, Silicon Prophet, Crypto Cynic, Metro Transit, Byte & Brew

      // Verify every visible post satisfies minMissionIndex <= 0
      visiblePosts.forEach((post) => {
        expect(post.triggerMissionId).toBeUndefined();
        expect(post.minMissionIndex ?? 0).toBeLessThanOrEqual(0);
      });
    });

    it("strictly hides all later chronological Chirper posts at mission index 0", () => {
      const postIds = visiblePosts.map((p) => p.id);

      // Rowan Bennett (minMissionIndex: 1)
      expect(postIds).not.toContain("chirp_noise_rowan_1");
      // Julian Sterling (minMissionIndex: 2)
      expect(postIds).not.toContain("chirp_sterling_1");
      // Meteo Bureau & Frederik Solberg (minMissionIndex: 2)
      expect(postIds).not.toContain("chirp_noise_meteo_1");
      expect(postIds).not.toContain("chirp_noise_frederik_1");
      // Viktor Reyes (minMissionIndex: 4)
      expect(postIds).not.toContain("chirp_reyes_1");
      expect(postIds).not.toContain("chirp_reyes_2");
      // Ouroboros Daemon (minMissionIndex: 6, triggerMissionId: 'mission_7')
      expect(postIds).not.toContain("chirp_ouroboros_daemon");
      // Astrid Lindholm (minMissionIndex: 7)
      expect(postIds).not.toContain("chirp_astrid_1");
      // Kai Thorne (minMissionIndex: 8)
      expect(postIds).not.toContain("chirp_kai_1");
    });

    it("displays only initial chronological NewsWire articles (minMissionIndex === 0)", () => {
      expect(visibleArticles.length).toBe(3);
      const articleIds = visibleArticles.map((a) => a.id);

      expect(articleIds).toContain("news_velox_series_a");
      expect(articleIds).toContain("news_aethelgard_contract");
      expect(articleIds).toContain("news_nordgrid_winter");

      // Verify every visible article satisfies minMissionIndex <= 0
      visibleArticles.forEach((article) => {
        expect(article.triggerMissionId).toBeUndefined();
        expect(article.minMissionIndex ?? 0).toBeLessThanOrEqual(0);
      });
    });

    it("strictly hides later news articles (VALKYRIE-7) and all reactive news at index 0", () => {
      const articleIds = visibleArticles.map((a) => a.id);

      // Chronological article for Op 04 (minMissionIndex: 3)
      expect(articleIds).not.toContain("news_sat_constellation");

      // Reactive news articles must ALL be hidden
      expect(articleIds).not.toContain("news_react_velox_breach"); // Op 02
      expect(articleIds).not.toContain("news_react_vault_inquiry"); // Op 03
      expect(articleIds).not.toContain("news_react_valkyrie_glitch"); // Op 04
      expect(articleIds).not.toContain("news_react_delta_lockdown"); // Op 05
      expect(articleIds).not.toContain("news_react_blackout_pulse"); // Op 08
      expect(articleIds).not.toContain("news_react_subsea_sever"); // Op 09
      expect(articleIds).not.toContain("news_react_singularity_core"); // Op 10
    });

    it("verifies NO breaking alert badges are triggered in NewsWire at index 0", () => {
      // NewsWire button badge indicator: visibleNewsArticles.some(a => a.isBreaking)
      const hasBreakingNews = visibleArticles.some((a) => a.isBreaking);
      expect(hasBreakingNews).toBe(false);

      // Verify no article triggers the critical alert banner
      visibleArticles.forEach((article) => {
        expect(Boolean(article.isBreaking)).toBe(false);
      });
    });

    it("verifies NO reactive badges are triggered in Chirper at index 0", () => {
      visiblePosts.forEach((post) => {
        expect(Boolean(post.isReactive)).toBe(false);
      });
    });
  });

  describe("2. Operation 02 Reactive Trigger (Velox AI Breach)", () => {
    it("unlocks Velox breach news and Chirper reactions when completedMissionIds includes mission_2", () => {
      // Player is at mission index 2 having completed mission_1 and mission_2
      const completed = ["mission_1", "mission_2"];
      const visibleArticles = getVisibleNewsArticles(2, completed);
      const visiblePosts = getVisibleChirperPosts(2, completed);

      // 1. NewsWire: Op 02 reactive breach article emerges
      const veloxBreachArticle = visibleArticles.find(
        (a) => a.id === "news_react_velox_breach",
      );
      expect(veloxBreachArticle).toBeDefined();
      expect(veloxBreachArticle?.headline).toBe(
        "BREAKING: Velox AI Confirms Breach of Offshore Staging Relay",
      );
      expect(veloxBreachArticle?.source).toBe("Global NewsWire");
      expect(veloxBreachArticle?.category).toBe("CRIME");
      expect(veloxBreachArticle?.triggerMissionId).toBe("mission_2");

      // 2. Breaking Alert Badge logic on NewsWire button and article card
      expect(veloxBreachArticle?.isBreaking).toBe(true);
      const hasBreakingNews = visibleArticles.some((a) => a.isBreaking);
      expect(hasBreakingNews).toBe(true);

      // 3. Chirper: Op 02 reactive posts emerge
      const veloxLeakChirp = visiblePosts.find(
        (p) => p.id === "chirp_react_velox_leak",
      );
      expect(veloxLeakChirp).toBeDefined();
      expect(veloxLeakChirp?.authorName).toBe("CyberSec Monitor");
      expect(veloxLeakChirp?.authorHandle).toBe("@cyber_sec_monitor");
      expect(veloxLeakChirp?.isReactive).toBe(true);
      expect(veloxLeakChirp?.content).toContain(
        "monolithic transformer weights from Velox AI's v4 model",
      );

      const veloxPrChirp = visiblePosts.find(
        (p) => p.id === "chirp_react_velox_pr",
      );
      expect(veloxPrChirp).toBeDefined();
      expect(veloxPrChirp?.authorName).toBe("Elena Vance");
      expect(veloxPrChirp?.authorHandle).toBe("@elena_velox_ceo");
      expect(veloxPrChirp?.isReactive).toBe(true);
      expect(veloxPrChirp?.content).toContain("isolated perimeter anomaly");

      // 4. Ensure later reactive events (Op 03, Op 08, etc.) remain strictly hidden
      expect(
        visibleArticles.some((a) => a.id === "news_react_vault_inquiry"),
      ).toBe(false);
      expect(
        visibleArticles.some((a) => a.id === "news_react_blackout_pulse"),
      ).toBe(false);
      expect(visiblePosts.some((p) => p.id === "chirp_react_blackout_1")).toBe(
        false,
      );
      expect(visiblePosts.some((p) => p.id === "chirp_react_blackout_2")).toBe(
        false,
      );
    });

    it("keeps Op 02 reactive news hidden if player reaches index 2 WITHOUT mission_2 in completedMissionIds", () => {
      // Adversarial test: player index advanced without completing mission_2
      const visibleArticles = getVisibleNewsArticles(2, ["mission_1"]);
      const visiblePosts = getVisibleChirperPosts(2, ["mission_1"]);

      expect(
        visibleArticles.some((a) => a.id === "news_react_velox_breach"),
      ).toBe(false);
      expect(visiblePosts.some((p) => p.id === "chirp_react_velox_leak")).toBe(
        false,
      );
      expect(visiblePosts.some((p) => p.id === "chirp_react_velox_pr")).toBe(
        false,
      );
    });
  });

  describe("3. Operation 08 Reactive Trigger (Continental SCADA Blackout)", () => {
    it("unlocks Sector 7 blackout news and Chirper reactions when completedMissionIds includes mission_8", () => {
      // Player is at mission index 8 having completed operations up to mission_8
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

      // 1. NewsWire: Op 08 cascading blackout article emerges
      const blackoutArticle = visibleArticles.find(
        (a) => a.id === "news_react_blackout_pulse",
      );
      expect(blackoutArticle).toBeDefined();
      expect(blackoutArticle?.headline).toBe(
        "CRITICAL: Cascading Blackout Hits Sector 7; SCADA Desynchronization Suspected",
      );
      expect(blackoutArticle?.source).toBe("Nordic Energy News");
      expect(blackoutArticle?.category).toBe("INFRASTRUCTURE");
      expect(blackoutArticle?.triggerMissionId).toBe("mission_8");

      // 2. Breaking Alert Badge logic on NewsWire
      expect(blackoutArticle?.isBreaking).toBe(true);
      const hasBreakingNews = visibleArticles.some((a) => a.isBreaking);
      expect(hasBreakingNews).toBe(true);

      // 3. Chirper: Op 08 reactive posts emerge
      const citizenChirp = visiblePosts.find(
        (p) => p.id === "chirp_react_blackout_1",
      );
      expect(citizenChirp).toBeDefined();
      expect(citizenChirp?.authorName).toBe("Metro Citizen Pulse");
      expect(citizenChirp?.isReactive).toBe(true);
      expect(citizenChirp?.content).toContain("Total blackout across Sector 7");

      const astridStatementChirp = visiblePosts.find(
        (p) => p.id === "chirp_react_blackout_2",
      );
      expect(astridStatementChirp).toBeDefined();
      expect(astridStatementChirp?.authorName).toBe("Dr. Astrid Lindholm");
      expect(astridStatementChirp?.isReactive).toBe(true);
      expect(astridStatementChirp?.content).toContain("MODBUS-TRIP-77A");

      // 4. Ensure subsequent reactive events (Op 09 transatlantic fiber cut, Op 10 Ouroboros core) remain hidden
      expect(
        visibleArticles.some((a) => a.id === "news_react_subsea_sever"),
      ).toBe(false);
      expect(
        visibleArticles.some((a) => a.id === "news_react_singularity_core"),
      ).toBe(false);
      expect(visiblePosts.some((p) => p.id === "chirp_react_fiber_cut")).toBe(
        false,
      );
      expect(
        visiblePosts.some((p) => p.id === "chirp_react_ouroboros_down"),
      ).toBe(false);
    });

    it("verifies blackout reactive posts remain locked prior to completing mission_8", () => {
      const completedBeforeM8 = [
        "mission_1",
        "mission_2",
        "mission_3",
        "mission_4",
        "mission_5",
        "mission_6",
        "mission_7",
      ];
      const visibleArticles = getVisibleNewsArticles(7, completedBeforeM8);
      const visiblePosts = getVisibleChirperPosts(7, completedBeforeM8);

      expect(
        visibleArticles.some((a) => a.id === "news_react_blackout_pulse"),
      ).toBe(false);
      expect(visiblePosts.some((p) => p.id === "chirp_react_blackout_1")).toBe(
        false,
      );
      expect(visiblePosts.some((p) => p.id === "chirp_react_blackout_2")).toBe(
        false,
      );
    });
  });

  describe("4. IntraWebApp UI Markup & Badge Rendering Empirical Tests", () => {
    it("renders NewsWire page at mission index 0 without breaking alert badges or pulse indicators", () => {
      mockGameState.browserPage = "news";
      mockGameState.currentMissionIndex = 0;
      mockGameState.completedMissionIds = [];

      const html = renderToStaticMarkup(React.createElement(IntraWebApp));

      // Page banner and initial articles are present
      expect(html).toContain("GLOBAL NEWSWIRE // SYNDICATED DISPATCH");
      expect(html).toContain(
        "BREAKING INTELLIGENCE &amp; INFRASTRUCTURE BULLETINS",
      );
      expect(html).toContain(
        "Velox AI Expands Series-A Neural Research Infrastructure",
      );
      expect(html).toContain(
        "Aethelgard Awarded Defense Grid Telemetry Modernization Contract",
      );
      expect(html).toContain(
        "NordGrid Prepares Continental SCADA Infrastructure for Winter Peak",
      );

      // Breaking alert badges must NOT be present
      expect(html).not.toContain("CRITICAL ALERT // BREAKING INTELLIGENCE");
      expect(html).not.toContain(
        "w-1.5 h-1.5 rounded-full bg-[#f85149] animate-pulse",
      );
      expect(html).not.toContain(
        "BREAKING: Velox AI Confirms Breach of Offshore Staging Relay",
      );
      expect(html).not.toContain("CRITICAL: Cascading Blackout Hits Sector 7");
    });

    it("renders NewsWire page after Op 02 (mission_2) with critical alert banner and pulsing tab badge", () => {
      mockGameState.browserPage = "news";
      mockGameState.currentMissionIndex = 2;
      mockGameState.completedMissionIds = ["mission_1", "mission_2"];

      const html = renderToStaticMarkup(React.createElement(IntraWebApp));

      // Op 02 reactive breach article emerges with breaking alert banner
      expect(html).toContain(
        "BREAKING: Velox AI Confirms Breach of Offshore Staging Relay",
      );
      expect(html).toContain("CRITICAL ALERT // BREAKING INTELLIGENCE");

      // Tab quick button renders pulsing red dot indicator
      expect(html).toContain(
        "w-1.5 h-1.5 rounded-full bg-[#f85149] animate-pulse",
      );

      // Op 08 blackout must NOT be present
      expect(html).not.toContain("CRITICAL: Cascading Blackout Hits Sector 7");
    });

    it("renders Chirper feed after Op 02 (mission_2) with reactive badges on Velox leak posts", () => {
      mockGameState.browserPage = "chirper";
      mockGameState.currentMissionIndex = 2;
      mockGameState.completedMissionIds = ["mission_1", "mission_2"];

      const html = renderToStaticMarkup(React.createElement(IntraWebApp));

      // Chirper header
      expect(html).toContain("CHIRPER // PUBLIC SOCIAL FEED");

      // Initial target posts are visible
      expect(html).toContain("Marcus Cole");
      expect(html).toContain("@mcole_dev");

      // Reactive posts for Op 02 appear with REACTIVE badge
      expect(html).toContain("CyberSec Monitor (@cyber_sec_monitor)");
      expect(html).toContain("Elena Vance (@elena_velox_ceo)");
      expect(html).toContain(
        "px-1.5 py-0.2 bg-[#1f6feb]/20 border border-[#58a6ff] text-[#79c0ff] text-[9px] font-bold",
      );
      expect(html).toContain("REACTIVE");

      // Blackout posts must NOT be visible yet
      expect(html).not.toContain("Metro Citizen Pulse");
      expect(html).not.toContain("MODBUS-TRIP-77A");
    });

    it("renders NewsWire and Chirper after Op 08 (mission_8) with blackout breaking badges", () => {
      mockGameState.browserPage = "news";
      mockGameState.currentMissionIndex = 8;
      mockGameState.completedMissionIds = [
        "mission_1",
        "mission_2",
        "mission_3",
        "mission_4",
        "mission_5",
        "mission_6",
        "mission_7",
        "mission_8",
      ];

      const newsHtml = renderToStaticMarkup(React.createElement(IntraWebApp));

      // NewsWire: Blackout article is present with breaking banner
      expect(newsHtml).toContain(
        "CRITICAL: Cascading Blackout Hits Sector 7; SCADA Desynchronization Suspected",
      );
      expect(newsHtml).toContain("CRITICAL ALERT // BREAKING INTELLIGENCE");
      expect(newsHtml).toContain(
        "w-1.5 h-1.5 rounded-full bg-[#f85149] animate-pulse",
      );

      // Chirper: Switch to chirper
      mockGameState.browserPage = "chirper";
      const chirpHtml = renderToStaticMarkup(React.createElement(IntraWebApp));

      expect(chirpHtml).toContain("Metro Citizen Pulse (@metro_citizen)");
      expect(chirpHtml).toContain(
        "Total blackout across Sector 7 and downtown financial core",
      );
      expect(chirpHtml).toContain(
        "Dr. Astrid Lindholm (@dr_astrid_power // VP SCADA Systems)",
      );
      expect(chirpHtml).toContain("MODBUS-TRIP-77A");
      expect(chirpHtml).toContain("REACTIVE");
    });
  });

  describe("5. Adversarial Stress & Edge Case Scenarios", () => {
    it("handles out-of-order completedMissionIds gracefully without cross-polluting locked items", () => {
      // Suppose mission_8 was completed in sandbox/custom mode while currentMissionIndex is 0
      const visibleArticles = getVisibleNewsArticles(0, ["mission_8"]);
      const visiblePosts = getVisibleChirperPosts(0, ["mission_8"]);

      // Blackout news should be visible because triggerMissionId is satisfied
      expect(
        visibleArticles.some((a) => a.id === "news_react_blackout_pulse"),
      ).toBe(true);
      expect(visiblePosts.some((p) => p.id === "chirp_react_blackout_1")).toBe(
        true,
      );

      // BUT minMissionIndex > 0 chronological posts MUST STILL BE HIDDEN
      expect(visiblePosts.some((p) => p.id === "chirp_sterling_1")).toBe(false); // minMissionIndex: 2
      expect(visiblePosts.some((p) => p.id === "chirp_reyes_1")).toBe(false); // minMissionIndex: 4
      expect(
        visibleArticles.some((a) => a.id === "news_sat_constellation"),
      ).toBe(false); // minMissionIndex: 3

      // And uncompleted reactive posts MUST STILL BE HIDDEN
      expect(
        visibleArticles.some((a) => a.id === "news_react_velox_breach"),
      ).toBe(false);
      expect(visiblePosts.some((p) => p.id === "chirp_react_velox_leak")).toBe(
        false,
      );
    });

    it("handles unexpected, malformed, or empty mission strings in completedMissionIds", () => {
      const malformedIds = [
        "",
        "   ",
        "undefined",
        "null",
        "mission_unknown",
        "xyz",
      ];
      const visibleArticles = getVisibleNewsArticles(0, malformedIds);
      const visiblePosts = getVisibleChirperPosts(0, malformedIds);

      // None of the reactive articles or posts should unlock
      expect(
        visibleArticles.some((a) => a.triggerMissionId !== undefined),
      ).toBe(false);
      expect(visiblePosts.some((p) => p.triggerMissionId !== undefined)).toBe(
        false,
      );
    });

    it("verifies monotonic progression of chronological items across all mission indices (0 to 10)", () => {
      let previousArticleCount = 0;
      let previousPostCount = 0;

      for (let idx = 0; idx <= 10; idx++) {
        // Evaluate purely chronological items (completedMissionIds: [])
        const articles = getVisibleNewsArticles(idx, []);
        const posts = getVisibleChirperPosts(idx, []);

        expect(articles.length).toBeGreaterThanOrEqual(previousArticleCount);
        expect(posts.length).toBeGreaterThanOrEqual(previousPostCount);

        previousArticleCount = articles.length;
        previousPostCount = posts.length;
      }
    });

    it("verifies all breaking news articles have valid breaking badge attributes", () => {
      // Filter all articles that declare isBreaking: true
      const breakingArticles = NEWS_ARTICLES.filter((a) => a.isBreaking);
      expect(breakingArticles.length).toBe(3); // Velox breach (Op 02), Blackout (Op 08), Singularity core (Op 10)

      breakingArticles.forEach((article) => {
        expect(article.triggerMissionId).toBeDefined();
        expect(article.headline.length).toBeGreaterThan(10);
        expect(article.summary.length).toBeGreaterThan(20);
        expect(article.body.length).toBeGreaterThan(0);
      });
    });

    it("verifies all reactive Chirper posts have isReactive: true and non-empty content", () => {
      const reactivePosts = CHIRPER_POSTS.filter((p) => p.triggerMissionId);
      expect(reactivePosts.length).toBeGreaterThan(5);

      reactivePosts.forEach((post) => {
        // Exclude easter egg daemon which has corrupted styling
        if (post.id !== "chirp_ouroboros_daemon") {
          expect(
            post.isReactive,
            `Reactive post '${post.id}' must have isReactive: true for badge rendering`,
          ).toBe(true);
        }
        expect(post.authorName.length).toBeGreaterThan(0);
        expect(post.content.length).toBeGreaterThan(20);
      });
    });
  });
});
