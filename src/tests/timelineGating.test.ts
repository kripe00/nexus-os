import { describe, it, expect } from "vitest";
import {
  ALL_CLUES,
  EMAIL_ACCOUNTS,
  MISSIONS,
  CHIRPER_POSTS,
  NEWS_ARTICLES,
  VELOX_EMPLOYEES,
  AETHELGARD_EMPLOYEES,
  NORDGRID_EMPLOYEES,
  OCEANICLINK_EMPLOYEES,
} from "../data/worldData";
import { ChirperPost, NewsArticle } from "../types/game";

describe("Milestone 1 Empirical Challenge: Timeline Gating, Reactive Triggers & Noise Isolation", () => {
  describe("1. Reactive Trigger Validation against MISSIONS", () => {
    const validMissionIds = new Set(MISSIONS.map((m) => m.id));

    it("verifies that all Chirper posts with triggerMissionId map to valid missions in MISSIONS", () => {
      const reactivePosts = CHIRPER_POSTS.filter((p) => p.triggerMissionId);
      expect(reactivePosts.length).toBeGreaterThan(0);

      reactivePosts.forEach((post) => {
        expect(
          validMissionIds.has(post.triggerMissionId!),
          `Chirper post ${post.id} references invalid triggerMissionId '${post.triggerMissionId}'`,
        ).toBe(true);
      });
    });

    it("verifies that all News articles with triggerMissionId map to valid missions in MISSIONS", () => {
      const reactiveArticles = NEWS_ARTICLES.filter((a) => a.triggerMissionId);
      expect(reactiveArticles.length).toBeGreaterThan(0);

      reactiveArticles.forEach((article) => {
        expect(
          validMissionIds.has(article.triggerMissionId!),
          `News article ${article.id} references invalid triggerMissionId '${article.triggerMissionId}'`,
        ).toBe(true);
      });
    });

    it("verifies coverage of all key reactive events across campaign operations", () => {
      const reactiveMissionIds = new Set([
        ...CHIRPER_POSTS.map((p) => p.triggerMissionId).filter(Boolean),
        ...NEWS_ARTICLES.map((a) => a.triggerMissionId).filter(Boolean),
      ]);

      // Op 02 (Velox leak), Op 03 (Vault breach), Op 04 (Valkyrie), Op 05 (Delta lockdown),
      // Op 08 (Blackout), Op 09 (Subsea sever), Op 10 (Singularity core)
      expect(reactiveMissionIds.has("mission_2")).toBe(true);
      expect(reactiveMissionIds.has("mission_3")).toBe(true);
      expect(reactiveMissionIds.has("mission_4")).toBe(true);
      expect(reactiveMissionIds.has("mission_5")).toBe(true);
      expect(reactiveMissionIds.has("mission_8")).toBe(true);
      expect(reactiveMissionIds.has("mission_9")).toBe(true);
      expect(reactiveMissionIds.has("mission_10")).toBe(true);
    });
  });

  describe("2. Chronological minMissionIndex Gating & Clue Availability", () => {
    // Standard filtering function as specified for Milestone 2
    const filterTimelineItems = <T extends ChirperPost | NewsArticle>(
      items: T[],
      currentMissionIndex: number,
      completedMissionIds: string[],
    ): T[] => {
      return items.filter((item) => {
        if (item.triggerMissionId) {
          return completedMissionIds.includes(item.triggerMissionId);
        }
        if (item.minMissionIndex !== undefined) {
          return item.minMissionIndex <= currentMissionIndex;
        }
        return true;
      });
    };

    it("allows early target clues (Marcus Cole & Gordon Vance) at index 0", () => {
      const visiblePosts = filterTimelineItems(CHIRPER_POSTS, 0, []);

      // Marcus Cole Chirper posts (clues: Koda, Pixel, 1997, 2019)
      const marcusPosts = visiblePosts.filter(
        (p) => p.authorName === "Marcus Cole",
      );
      expect(marcusPosts.length).toBe(2);

      const marcusClueIds = marcusPosts.flatMap((p) =>
        p.clues ? p.clues.map((c) => c.id) : [],
      );
      expect(marcusClueIds).toContain("clue_marcus_dog");
      expect(marcusClueIds).toContain("clue_marcus_year");

      // Gordon Vance Bounty #02 Chirper post (clues: RoyalPine, Badge990)
      const vancePost = visiblePosts.find((p) => p.id === "chirp_vance_bounty");
      expect(vancePost).toBeDefined();
      const vanceClueIds = vancePost?.clues?.map((c) => c.id) || [];
      expect(vanceClueIds).toContain("clue_commissioner_golf");
      expect(vanceClueIds).toContain("clue_commissioner_badge");

      // Marcus Cole corporate profile on Velox AI
      const marcusEmp = VELOX_EMPLOYEES.find((e) => e.name === "Marcus Cole");
      expect(marcusEmp).toBeDefined();
      expect(marcusEmp?.isTarget).toBe(true);
      expect(marcusEmp?.emailClueId).toBe("clue_marcus_email");
    });

    it("gates later target clues strictly behind their respective minMissionIndex thresholds", () => {
      // At index 0: later target posts must NOT be visible
      const index0Posts = filterTimelineItems(CHIRPER_POSTS, 0, []);
      expect(index0Posts.some((p) => p.authorName === "Julian Sterling")).toBe(
        false,
      );
      expect(
        index0Posts.some((p) => p.authorName === "Chief Viktor Reyes"),
      ).toBe(false);
      expect(index0Posts.some((p) => p.id === "chirp_ouroboros_daemon")).toBe(
        false,
      );
      expect(
        index0Posts.some((p) => p.authorName === "Dr. Astrid Lindholm"),
      ).toBe(false);
      expect(index0Posts.some((p) => p.authorName === "Kai Thorne")).toBe(
        false,
      );

      // At index 1: Julian Sterling still gated (minMissionIndex: 2)
      const index1Posts = filterTimelineItems(CHIRPER_POSTS, 1, []);
      expect(index1Posts.some((p) => p.authorName === "Julian Sterling")).toBe(
        false,
      );

      // At index 2: Julian Sterling visible, but Reyes, Astrid, Kai still gated
      const index2Posts = filterTimelineItems(CHIRPER_POSTS, 2, []);
      expect(index2Posts.some((p) => p.authorName === "Julian Sterling")).toBe(
        true,
      );
      expect(
        index2Posts.some((p) => p.authorName === "Chief Viktor Reyes"),
      ).toBe(false);
      expect(
        index2Posts.some((p) => p.authorName === "Dr. Astrid Lindholm"),
      ).toBe(false);
      expect(index2Posts.some((p) => p.authorName === "Kai Thorne")).toBe(
        false,
      );

      // At index 4: Chief Viktor Reyes visible, but Astrid and Kai still gated
      const index4Posts = filterTimelineItems(CHIRPER_POSTS, 4, []);
      expect(
        index4Posts.some((p) => p.authorName === "Chief Viktor Reyes"),
      ).toBe(true);
      expect(
        index4Posts.some((p) => p.authorName === "Dr. Astrid Lindholm"),
      ).toBe(false);
      expect(index4Posts.some((p) => p.authorName === "Kai Thorne")).toBe(
        false,
      );

      // At index 7: Dr. Astrid Lindholm visible, but Kai still gated
      const index7Posts = filterTimelineItems(CHIRPER_POSTS, 7, []);
      expect(
        index7Posts.some((p) => p.authorName === "Dr. Astrid Lindholm"),
      ).toBe(true);
      expect(index7Posts.some((p) => p.authorName === "Kai Thorne")).toBe(
        false,
      );

      // At index 8: Kai Thorne visible
      const index8Posts = filterTimelineItems(CHIRPER_POSTS, 8, []);
      expect(index8Posts.some((p) => p.authorName === "Kai Thorne")).toBe(true);
    });

    it("verifies reactive post unlocking dynamically upon mission completion", () => {
      // Initially, no reactive post should be visible
      const initialPosts = filterTimelineItems(CHIRPER_POSTS, 0, []);
      const initialArticles = filterTimelineItems(NEWS_ARTICLES, 0, []);
      expect(initialPosts.some((p) => p.isReactive)).toBe(false);
      expect(initialArticles.some((a) => a.triggerMissionId)).toBe(false);

      // After completing mission_2 (Op 02), Velox breach reactions unlock
      const op2Posts = filterTimelineItems(CHIRPER_POSTS, 2, ["mission_2"]);
      const op2Articles = filterTimelineItems(NEWS_ARTICLES, 2, ["mission_2"]);

      expect(op2Posts.some((p) => p.id === "chirp_react_velox_leak")).toBe(
        true,
      );
      expect(op2Posts.some((p) => p.id === "chirp_react_velox_pr")).toBe(true);
      expect(op2Articles.some((a) => a.id === "news_react_velox_breach")).toBe(
        true,
      );

      // Other reactive posts remain locked
      expect(op2Posts.some((p) => p.id === "chirp_react_blackout_1")).toBe(
        false,
      );
      expect(
        op2Articles.some((a) => a.id === "news_react_blackout_pulse"),
      ).toBe(false);

      // After completing mission_8 (Op 08), blackout reactions unlock
      const op8Posts = filterTimelineItems(CHIRPER_POSTS, 8, [
        "mission_2",
        "mission_8",
      ]);
      const op8Articles = filterTimelineItems(NEWS_ARTICLES, 8, [
        "mission_2",
        "mission_8",
      ]);
      expect(op8Posts.some((p) => p.id === "chirp_react_blackout_1")).toBe(
        true,
      );
      expect(op8Posts.some((p) => p.id === "chirp_react_blackout_2")).toBe(
        true,
      );
      expect(
        op8Articles.some((a) => a.id === "news_react_blackout_pulse"),
      ).toBe(true);
    });
  });

  describe("3. PassWeaver Password Synthesis & WebMail Invariants", () => {
    it("preserves password cracking logic and required clues for all target accounts", () => {
      const crackableTargets = [
        {
          email: "m.cole@velox-ai.io",
          expectedPassword: "Koda1997",
          requiredClues: ["clue_marcus_dog", "clue_marcus_year"],
        },
        {
          email: "j.sterling@aethelgard.corp",
          expectedPassword: "Hyperion0451",
          requiredClues: ["clue_julian_project", "clue_julian_badge"],
        },
        {
          email: "a.lindholm@nordgrid-power.com",
          expectedPassword: "NordicBreeze5020",
          requiredClues: ["clue_astrid_yacht", "clue_astrid_pin"],
        },
        {
          email: "k.thorne@oceaniclink-telecom.net",
          expectedPassword: "AbyssPoint92019",
          requiredClues: ["clue_kai_station", "clue_kai_year"],
        },
        {
          email: "commissioner.vance@metro-police.gov",
          expectedPassword: "RoyalPineBadge990",
          requiredClues: ["clue_commissioner_golf", "clue_commissioner_badge"],
        },
      ];

      crackableTargets.forEach(({ email, expectedPassword, requiredClues }) => {
        const account = EMAIL_ACCOUNTS[email];
        expect(
          account,
          `Target account '${email}' missing in EMAIL_ACCOUNTS`,
        ).toBeDefined();
        expect(account.password).toBe(expectedPassword);
        expect(account.requiredClueIds).toEqual(requiredClues);

        // Verify clues exist and synthesize into expected password
        const clueValues = requiredClues.map((id) => {
          const clue = ALL_CLUES[id];
          expect(
            clue,
            `Required clue '${id}' missing in ALL_CLUES`,
          ).toBeDefined();
          return clue.value;
        });

        // PassWeaver synthesis combines [clueA, clueB] as `${a}${b}`
        const synthesized = `${clueValues[0]}${clueValues[1]}`;
        expect(synthesized).toBe(expectedPassword);
      });
    });

    it("verifies Viktor Reyes hardware token protection in EMAIL_ACCOUNTS and PassWeaver specification", () => {
      const reyesAccount = EMAIL_ACCOUNTS["v.reyes@aethelgard.corp"];
      expect(reyesAccount).toBeDefined();
      expect(reyesAccount.requiredClueIds).toEqual([
        "clue_reyes_unit",
        "clue_reyes_pin",
      ]);
      expect(ALL_CLUES["clue_reyes_unit"].value).toBe("Phantom77");
      expect(ALL_CLUES["clue_reyes_pin"].value).toBe("8821");
      expect(reyesAccount.password).toBe("Phantom778821");
    });
  });

  describe("4. Noise Isolation & Red Herring Verification", () => {
    it("ensures all 10 mundane noise emails have zero clues and expose no credentials", () => {
      const expectedNoiseEmailIds = [
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

      const allMessages = Object.values(EMAIL_ACCOUNTS).flatMap((a) => a.inbox);
      const noiseMessages = allMessages.filter((m) =>
        expectedNoiseEmailIds.includes(m.id),
      );

      expect(noiseMessages.length).toBe(10);

      noiseMessages.forEach((msg) => {
        // Mundane emails must have no clues array or an empty clues array
        expect(
          !msg.clues || msg.clues.length === 0,
          `Noise email '${msg.id}' unexpectedly contains clue attachments!`,
        ).toBe(true);

        // Mundane emails must have no attachment or attachment without evidence
        if (msg.attachment) {
          expect(msg.attachment).not.toHaveProperty("isEvidence");
        }
      });
    });

    it("ensures corporate staff red herrings are marked isTarget: false and lack emailClueId", () => {
      const allStaff = [
        ...VELOX_EMPLOYEES,
        ...AETHELGARD_EMPLOYEES,
        ...NORDGRID_EMPLOYEES,
        ...OCEANICLINK_EMPLOYEES,
      ];

      const targets = allStaff.filter((e) => e.isTarget);
      const nonTargets = allStaff.filter((e) => !e.isTarget);

      // Verify known targets
      const targetNames = targets.map((t) => t.name);
      expect(targetNames).toContain("Marcus Cole");
      expect(targetNames).toContain("Director Julian Sterling");
      expect(targetNames).toContain("Chief Viktor Reyes");
      expect(targetNames).toContain("Dr. Astrid Lindholm");
      expect(targetNames).toContain("Kai Thorne");

      // Verify non-targets are clean of clue metadata
      nonTargets.forEach((emp) => {
        expect(emp.isTarget).toBe(false);
        expect(emp.emailClueId).toBeUndefined();
      });
    });

    it("ensures Chirper red herring posts contain no clues", () => {
      const noiseChirps = CHIRPER_POSTS.filter((p) =>
        p.id.startsWith("chirp_noise_"),
      );
      expect(noiseChirps.length).toBe(10);

      noiseChirps.forEach((post) => {
        expect(
          !post.clues || post.clues.length === 0,
          `Red herring Chirper post '${post.id}' contains clue data!`,
        ).toBe(true);
      });
    });
  });
});
