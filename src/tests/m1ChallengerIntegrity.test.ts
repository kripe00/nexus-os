import { describe, it, expect } from "vitest";
import {
  ALL_CLUES,
  EMAIL_ACCOUNTS,
  SERVER_NODES,
  MISSIONS,
  BOUNTY_CONTRACTS,
  CHIRPER_POSTS,
  NEWS_ARTICLES,
  VELOX_EMPLOYEES,
  AETHELGARD_EMPLOYEES,
  NORDGRID_EMPLOYEES,
  OCEANICLINK_EMPLOYEES,
} from "../data/worldData";
import { ChirperPost } from "../types/game";

describe("Milestone 1 Data Integrity & Progression Challenger Suite", () => {
  describe("1. Mundane Email Isolation & Credential Security", () => {
    const mundaneEmailIds = [
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
    const serverIps = Object.keys(SERVER_NODES);

    it("verifies all 10 mundane noise emails exist in inboxes", () => {
      const allInboxMessages = Object.values(EMAIL_ACCOUNTS).flatMap(
        (a) => a.inbox,
      );
      mundaneEmailIds.forEach((id) => {
        const found = allInboxMessages.find((m) => m.id === id);
        expect(
          found,
          `Mundane email ${id} must exist in inboxes`,
        ).toBeDefined();
      });
    });

    it("ensures zero clues are attached to any mundane email", () => {
      const allInboxMessages = Object.values(EMAIL_ACCOUNTS).flatMap(
        (a) => a.inbox,
      );
      mundaneEmailIds.forEach((id) => {
        const msg = allInboxMessages.find((m) => m.id === id)!;
        expect(
          msg.clues === undefined || msg.clues.length === 0,
          `Mundane email ${id} must NOT contain clues`,
        ).toBe(true);
      });
    });

    it("ensures mundane emails do not expose any target passwords", () => {
      const allInboxMessages = Object.values(EMAIL_ACCOUNTS).flatMap(
        (a) => a.inbox,
      );
      mundaneEmailIds.forEach((id) => {
        const msg = allInboxMessages.find((m) => m.id === id)!;
        const textContent = `${msg.subject} ${msg.body}`;

        targetPasswords.forEach((pw) => {
          expect(
            textContent.includes(pw),
            `Mundane email ${id} must not leak password "${pw}"`,
          ).toBe(false);
        });
      });
    });

    it("ensures mundane emails do not expose critical tokens or hackable server IPs", () => {
      const allInboxMessages = Object.values(EMAIL_ACCOUNTS).flatMap(
        (a) => a.inbox,
      );
      mundaneEmailIds.forEach((id) => {
        const msg = allInboxMessages.find((m) => m.id === id)!;
        const textContent = `${msg.subject} ${msg.body}`;

        criticalTokens.forEach((token) => {
          expect(
            textContent.includes(token),
            `Mundane email ${id} must not leak token "${token}"`,
          ).toBe(false);
        });

        serverIps.forEach((ip) => {
          expect(
            textContent.includes(ip),
            `Mundane email ${id} must not leak server IP "${ip}"`,
          ).toBe(false);
        });
      });
    });

    it("confirms target account credentials and required clues remain untouched", () => {
      expect(EMAIL_ACCOUNTS["m.cole@velox-ai.io"].password).toBe("Koda1997");
      expect(EMAIL_ACCOUNTS["m.cole@velox-ai.io"].requiredClueIds).toEqual([
        "clue_marcus_dog",
        "clue_marcus_year",
      ]);

      expect(EMAIL_ACCOUNTS["j.sterling@aethelgard.corp"].password).toBe(
        "Hyperion0451",
      );
      expect(
        EMAIL_ACCOUNTS["j.sterling@aethelgard.corp"].requiredClueIds,
      ).toEqual(["clue_julian_project", "clue_julian_badge"]);

      expect(EMAIL_ACCOUNTS["v.reyes@aethelgard.corp"].password).toBe(
        "Phantom778821",
      );
      expect(EMAIL_ACCOUNTS["v.reyes@aethelgard.corp"].requiredClueIds).toEqual(
        ["clue_reyes_unit", "clue_reyes_pin"],
      );

      expect(EMAIL_ACCOUNTS["a.lindholm@nordgrid-power.com"].password).toBe(
        "NordicBreeze5020",
      );
      expect(
        EMAIL_ACCOUNTS["a.lindholm@nordgrid-power.com"].requiredClueIds,
      ).toEqual(["clue_astrid_yacht", "clue_astrid_pin"]);

      expect(EMAIL_ACCOUNTS["k.thorne@oceaniclink-telecom.net"].password).toBe(
        "AbyssPoint92019",
      );
      expect(
        EMAIL_ACCOUNTS["k.thorne@oceaniclink-telecom.net"].requiredClueIds,
      ).toEqual(["clue_kai_station", "clue_kai_year"]);

      expect(
        EMAIL_ACCOUNTS["commissioner.vance@metro-police.gov"].password,
      ).toBe("RoyalPineBadge990");
      expect(
        EMAIL_ACCOUNTS["commissioner.vance@metro-police.gov"].requiredClueIds,
      ).toEqual(["clue_commissioner_golf", "clue_commissioner_badge"]);
    });
  });

  describe("2. Chirper Posts Gating & Essential Clue Availability", () => {
    // Helper to evaluate standard timeline filtering by mission index
    function getVisibleChirpsByIndex(
      missionIndex: number,
      completedIds: string[],
    ): ChirperPost[] {
      return CHIRPER_POSTS.filter((post) => {
        if (post.isReactive) {
          return post.triggerMissionId
            ? completedIds.includes(post.triggerMissionId)
            : false;
        }
        return (post.minMissionIndex ?? 0) <= missionIndex;
      });
    }

    // Helper to evaluate strict filtering checking BOTH minMissionIndex AND minChapter
    function getVisibleChirpsByChapter(
      missionIndex: number,
      chapter: number,
      completedIds: string[],
    ): ChirperPost[] {
      return CHIRPER_POSTS.filter((post) => {
        if (post.isReactive) {
          return post.triggerMissionId
            ? completedIds.includes(post.triggerMissionId)
            : false;
        }
        const matchesIndex = (post.minMissionIndex ?? 0) <= missionIndex;
        const matchesChapter =
          post.minChapter !== undefined ? post.minChapter <= chapter : true;
        return matchesIndex && matchesChapter;
      });
    }

    it("verifies Operation 01 essential clues are available at mission index 0", () => {
      const visible = getVisibleChirpsByIndex(0, []);
      const visibleClueIds = visible.flatMap(
        (p) => p.clues?.map((c) => c.id) ?? [],
      );

      expect(visibleClueIds).toContain("clue_marcus_dog");
      expect(visibleClueIds).toContain("clue_marcus_year");
      // Decoys
      expect(visibleClueIds).toContain("clue_marcus_cat");
      expect(visibleClueIds).toContain("clue_velox_year");
    });

    it("verifies Bounty Contract 02 clues (Gordon Vance) are available at start", () => {
      const visible = getVisibleChirpsByIndex(0, []);
      const visibleClueIds = visible.flatMap(
        (p) => p.clues?.map((c) => c.id) ?? [],
      );

      expect(visibleClueIds).toContain("clue_commissioner_golf");
      expect(visibleClueIds).toContain("clue_commissioner_badge");
    });

    it("verifies Operation 03 clues (Julian Sterling) by mission index", () => {
      // Op 03 is index 2
      const completed = ["mission_1", "mission_2"];
      const visible = getVisibleChirpsByIndex(2, completed);
      const visibleClueIds = visible.flatMap(
        (p) => p.clues?.map((c) => c.id) ?? [],
      );

      expect(visibleClueIds).toContain("clue_julian_project");
      expect(visibleClueIds).toContain("clue_sterling_club");
      expect(visibleClueIds).toContain("clue_sterling_callsign");
    });

    it("ADVERSARIAL STRESS: confirms minChapter in chirp_sterling_1 does not soft-lock Operation 03", () => {
      // In MISSIONS, mission_3 has chapter: 1!
      const op3 = MISSIONS[2];
      expect(op3.id).toBe("mission_3");
      expect(op3.chapter).toBe(1);

      const completed = ["mission_1", "mission_2"];
      const visibleStrict = getVisibleChirpsByChapter(
        2,
        op3.chapter,
        completed,
      );
      const visibleClueIdsStrict = visibleStrict.flatMap(
        (p) => p.clues?.map((c) => c.id) ?? [],
      );

      const sterlingPost = CHIRPER_POSTS.find(
        (p) => p.id === "chirp_sterling_1",
      )!;
      expect(sterlingPost).toBeDefined();

      // Confirms chirp_sterling_1 has minChapter: 1 aligned with Chapter 1 (no soft-lock)
      const hasChapterDiscrepancy =
        sterlingPost.minChapter !== undefined &&
        sterlingPost.minChapter > op3.chapter;
      expect(hasChapterDiscrepancy).toBe(false);
      expect(sterlingPost.minChapter).toBe(1);
      // Under strict chapter filtering, clue_julian_project is now available:
      expect(visibleClueIdsStrict.includes("clue_julian_project")).toBe(true);
    });

    it("verifies Operation 05 clues (Viktor Reyes) are available at mission index 4", () => {
      const op5Index = 4;
      const op5Chapter = MISSIONS[op5Index].chapter; // chapter 2
      const completed = ["mission_1", "mission_2", "mission_3", "mission_4"];

      const visible = getVisibleChirpsByIndex(op5Index, completed);
      const visibleClueIds = visible.flatMap(
        (p) => p.clues?.map((c) => c.id) ?? [],
      );

      expect(visibleClueIds).toContain("clue_reyes_unit");
      expect(visibleClueIds).toContain("clue_reyes_pin");
      expect(visibleClueIds).toContain("clue_reyes_callsign");
      expect(visibleClueIds).toContain("clue_reyes_sector");
    });

    it("verifies Operation 08 clues (Astrid Lindholm) are available at mission index 7", () => {
      const op8Index = 7;
      const completed = MISSIONS.slice(0, 7).map((m) => m.id);

      const visible = getVisibleChirpsByIndex(op8Index, completed);
      const visibleClueIds = visible.flatMap(
        (p) => p.clues?.map((c) => c.id) ?? [],
      );

      expect(visibleClueIds).toContain("clue_astrid_yacht");
      expect(visibleClueIds).toContain("clue_astrid_pin");
    });

    it("verifies Operation 09 clues (Kai Thorne) are available at mission index 8", () => {
      const op9Index = 8;
      const completed = MISSIONS.slice(0, 8).map((m) => m.id);

      const visible = getVisibleChirpsByIndex(op9Index, completed);
      const visibleClueIds = visible.flatMap(
        (p) => p.clues?.map((c) => c.id) ?? [],
      );

      expect(visibleClueIds).toContain("clue_kai_station");
      expect(visibleClueIds).toContain("clue_kai_year");
    });

    it("verifies reactive Chirper posts only appear AFTER triggering mission completion", () => {
      // Prior to completing mission_2
      const beforeM2 = getVisibleChirpsByIndex(1, ["mission_1"]);
      expect(beforeM2.some((p) => p.id === "chirp_react_velox_leak")).toBe(
        false,
      );
      expect(beforeM2.some((p) => p.id === "chirp_react_velox_pr")).toBe(false);

      // After completing mission_2
      const afterM2 = getVisibleChirpsByIndex(2, ["mission_1", "mission_2"]);
      expect(afterM2.some((p) => p.id === "chirp_react_velox_leak")).toBe(true);
      expect(afterM2.some((p) => p.id === "chirp_react_velox_pr")).toBe(true);
    });

    it("verifies all 10 red herring Chirper posts have no clues", () => {
      const noisePosts = CHIRPER_POSTS.filter((p) =>
        p.id.startsWith("chirp_noise_"),
      );
      expect(noisePosts.length).toBe(10);
      noisePosts.forEach((post) => {
        expect(
          post.clues === undefined || post.clues.length === 0,
          `Noise post ${post.id} must not have clues`,
        ).toBe(true);
      });
    });
  });

  describe("3. Corporate Employee Datasets", () => {
    it("verifies Velox employee directory has exactly 1 target with valid emailClueId", () => {
      expect(VELOX_EMPLOYEES.length).toBe(6);
      const targets = VELOX_EMPLOYEES.filter((e) => e.isTarget);
      expect(targets.length).toBe(1);
      expect(targets[0].emailClueId).toBe("clue_marcus_email");
      expect(ALL_CLUES[targets[0].emailClueId!].value).toBe(targets[0].email);

      const nonTargets = VELOX_EMPLOYEES.filter((e) => !e.isTarget);
      expect(nonTargets.length).toBe(5);
      nonTargets.forEach((e) => {
        expect(e.emailClueId).toBeUndefined();
      });
    });

    it("verifies Aethelgard employee directory targets and non-targets", () => {
      expect(AETHELGARD_EMPLOYEES.length).toBe(6);
      const targets = AETHELGARD_EMPLOYEES.filter((e) => e.isTarget);
      expect(targets.length).toBe(2); // Julian Sterling & Viktor Reyes

      const sterling = targets.find((e) => e.id === "emp_aeth_sterling")!;
      expect(sterling).toBeDefined();
      expect(sterling.emailClueId).toBe("clue_julian_email");
      expect(ALL_CLUES[sterling.emailClueId!].value).toBe(sterling.email);

      const nonTargets = AETHELGARD_EMPLOYEES.filter((e) => !e.isTarget);
      expect(nonTargets.length).toBe(4);
      nonTargets.forEach((e) => {
        expect(e.emailClueId).toBeUndefined();
      });
    });

    it("verifies NordGrid employee directory", () => {
      expect(NORDGRID_EMPLOYEES.length).toBe(3);
      const targets = NORDGRID_EMPLOYEES.filter((e) => e.isTarget);
      expect(targets.length).toBe(1);
      expect(targets[0].id).toBe("emp_nord_astrid");

      const nonTargets = NORDGRID_EMPLOYEES.filter((e) => !e.isTarget);
      expect(nonTargets.length).toBe(2);
    });

    it("verifies OceanicLink employee directory", () => {
      expect(OCEANICLINK_EMPLOYEES.length).toBe(3);
      const targets = OCEANICLINK_EMPLOYEES.filter((e) => e.isTarget);
      expect(targets.length).toBe(1);
      expect(targets[0].id).toBe("emp_ocean_kai");

      const nonTargets = OCEANICLINK_EMPLOYEES.filter((e) => !e.isTarget);
      expect(nonTargets.length).toBe(2);
    });
  });

  describe("4. News Articles Dataset", () => {
    it("contains 4 initial articles and 7 reactive breaking articles", () => {
      const initial = NEWS_ARTICLES.filter((a) => !a.triggerMissionId);
      const reactive = NEWS_ARTICLES.filter((a) => a.triggerMissionId);

      expect(initial.length).toBe(4);
      expect(reactive.length).toBe(7);

      // Verify reactive articles correspond to valid mission IDs
      const validMissionIds = new Set(MISSIONS.map((m) => m.id));
      reactive.forEach((article) => {
        expect(
          validMissionIds.has(article.triggerMissionId!),
          `Trigger mission ID ${article.triggerMissionId} in article ${article.id} must exist in MISSIONS`,
        ).toBe(true);
      });
    });
  });
});
