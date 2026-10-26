import { describe, it, expect } from "vitest";
import {
  ALL_CLUES,
  EMAIL_ACCOUNTS,
  SERVER_NODES,
  SHOP_ITEMS,
  MISSIONS,
} from "../data/worldData";

describe("Nexus OS World Data Integrity", () => {
  it("should have all 10 operations configured across 4 chapters", () => {
    expect(MISSIONS.length).toBe(10);

    const chapter1 = MISSIONS.filter((m) => m.chapter === 1);
    const chapter2 = MISSIONS.filter((m) => m.chapter === 2);
    const chapter3 = MISSIONS.filter((m) => m.chapter === 3);
    const chapter4 = MISSIONS.filter((m) => m.chapter === 4);

    expect(chapter1.length).toBe(3);
    expect(chapter2.length).toBe(3);
    expect(chapter3.length).toBe(1);
    expect(chapter4.length).toBe(3);

    // Each mission must have distinct IDs, titles, and non-empty objectives
    const missionIds = new Set<string>();
    MISSIONS.forEach((m) => {
      expect(missionIds.has(m.id)).toBe(false);
      missionIds.add(m.id);
      expect(m.title).toBeTruthy();
      expect(m.reward).toBeGreaterThan(0);
      expect(m.objectives.length).toBeGreaterThan(0);
      expect(m.initialMessages.length).toBeGreaterThan(0);
      expect(m.completionMessages.length).toBeGreaterThan(0);

      // Verify all objective IDs are unique
      const objIds = new Set<string>();
      m.objectives.forEach((obj) => {
        expect(objIds.has(obj.id)).toBe(false);
        objIds.add(obj.id);
        expect(obj.description).toBeTruthy();
      });
    });
  });

  it("should have valid clues referenced across all accounts and servers", () => {
    const clueKeys = Object.keys(ALL_CLUES);
    expect(clueKeys.length).toBeGreaterThan(10);

    // Clue properties
    clueKeys.forEach((key) => {
      const clue = ALL_CLUES[key];
      expect(clue.id).toBe(key);
      expect(clue.label).toBeTruthy();
      expect(clue.value).toBeTruthy();
      expect(clue.targetPerson).toBeTruthy();
    });

    // Check email required clues
    Object.values(EMAIL_ACCOUNTS).forEach((account) => {
      account.requiredClueIds.forEach((clueId) => {
        expect(
          ALL_CLUES[clueId],
          `Required clue ${clueId} in account ${account.email} must exist in ALL_CLUES`,
        ).toBeDefined();
      });

      // Verify that combining the clue values matches the password
      const clueValues = account.requiredClueIds.map(
        (id) => ALL_CLUES[id].value,
      );
      expect(account.password.toLowerCase()).toContain(
        clueValues[0].toLowerCase(),
      );
    });
  });

  it("should have valid servers and exploitable ports matching shop tools", () => {
    const toolIds = new Set(SHOP_ITEMS.map((t) => t.id));

    Object.values(SERVER_NODES).forEach((server) => {
      expect(server.ip).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
      expect(server.hostname).toBeTruthy();
      expect(server.requiredPort).toBeGreaterThan(0);
      expect(
        toolIds.has(server.requiredToolId),
        `Server ${server.ip} requires tool ${server.requiredToolId} which must be in SHOP_ITEMS`,
      ).toBe(true);

      // Verify files
      expect(server.files.length).toBeGreaterThan(0);
      const fileNames = new Set<string>();
      server.files.forEach((file) => {
        expect(fileNames.has(file.name)).toBe(false);
        fileNames.add(file.name);
        expect(file.content).toBeTruthy();

        // Any attached clues must be in ALL_CLUES
        if (file.clues) {
          file.clues.forEach((c) => {
            expect(ALL_CLUES[c.id]).toBeDefined();
          });
        }
      });
    });
  });

  it("should have consistent shop inventory and valid tools", () => {
    expect(SHOP_ITEMS.length).toBeGreaterThanOrEqual(5);
    const seenIds = new Set<string>();
    SHOP_ITEMS.forEach((item) => {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.price).toBeGreaterThan(0);
      expect(item.category).toMatch(/^(EXPLOIT|STEALTH)$/);
      expect(seenIds.has(item.id)).toBe(false);
      seenIds.add(item.id);
    });
  });

  describe("Campaign Overhaul & Narrative Continuity (v5.0)", () => {
    it("contains decoy clues and distinguishes them from true authentication tokens", () => {
      const decoyKeys = [
        "clue_marcus_cat",
        "clue_velox_year",
        "clue_sterling_club",
        "clue_sterling_callsign",
        "clue_reyes_callsign",
        "clue_reyes_sector",
      ];
      decoyKeys.forEach((key) => {
        expect(ALL_CLUES[key]).toBeDefined();
        expect(ALL_CLUES[key].isDecoy).toBe(true);
      });

      // True clues must NOT be marked isDecoy
      const marcusAccount = EMAIL_ACCOUNTS["m.cole@velox-ai.io"];
      marcusAccount.requiredClueIds.forEach((id) => {
        expect(ALL_CLUES[id].isDecoy).toBeFalsy();
      });
    });

    it("verifies early foreshadowing emails for Svalbard bunker and autonomous drone protocols", () => {
      const coleInbox = EMAIL_ACCOUNTS["m.cole@velox-ai.io"].inbox;
      const layer94Msg = coleInbox.find((m) => m.subject.includes("Layer 94"));
      expect(layer94Msg).toBeDefined();
      expect(layer94Msg?.body).toContain("v4 weights");
      expect(layer94Msg?.body).toContain("ZERO");

      const sterlingInbox = EMAIL_ACCOUNTS["j.sterling@aethelgard.corp"].inbox;
      const svalbardDrawMsg = sterlingInbox.find((m) =>
        m.from.includes("lindholm"),
      );
      expect(svalbardDrawMsg).toBeDefined();
      expect(svalbardDrawMsg?.body).toContain("185.190.20.1");

      const reyesInbox = EMAIL_ACCOUNTS["v.reyes@aethelgard.corp"].inbox;
      const droneInterlockMsg = reyesInbox.find((m) =>
        m.subject.includes("Drone #07"),
      );
      expect(droneInterlockMsg).toBeDefined();
      expect(droneInterlockMsg?.body).toContain(
        "autonomous retaliatory interdiction",
      );
    });

    it("verifies Marcus Cole dead-man warning and Julian Sterling hardware abort broadcast", () => {
      const satServer = SERVER_NODES["185.220.101.5"];
      const coleWarningFile = satServer.files.find(
        (f) => f.name === "marcus_cole_deadman.enc",
      );
      expect(coleWarningFile).toBeDefined();
      expect(coleWarningFile?.content).toContain("typing cadence");

      const droneServer = SERVER_NODES["141.98.11.200"];
      const telemetryDump = droneServer.files.find(
        (f) => f.name === "drone_telemetry_intercept.dump",
      );
      expect(telemetryDump).toBeDefined();
      expect(telemetryDump?.content).toContain(
        "INTERCEPTED HARDWARE ABORT TRANSMISSION",
      );
      expect(telemetryDump?.content).toContain("Hyperion");
    });

    it("verifies emergency coalition in Act IV dialogue and Reyes lure callout", () => {
      const op8 = MISSIONS[7];
      expect(op8.clientAvatar).toBe("CR");
      const reyesIntro = op8.initialMessages.find((m) =>
        m.senderName.includes("Reyes"),
      );
      expect(reyesIntro).toBeDefined();
      expect(reyesIntro?.text).toContain("Phantom77");

      const op10 = MISSIONS[9];
      expect(op10.clientAvatar).toBe("00");
      expect(
        op10.objectives.some((o) => o.id === "obj_m10_bunker_breach"),
      ).toBe(true);
    });
  });
});
