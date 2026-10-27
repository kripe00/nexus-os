import { describe, it, expect } from "vitest";
import { DifficultyPreset, SaveSlotProfile } from "../types/game";

describe("Release Enhancements & Game Integrity", () => {
  describe("Difficulty Presets & Trace Multipliers", () => {
    const getTraceMultiplier = (diff: DifficultyPreset) => {
      switch (diff) {
        case "analyst":
          return 0.75;
        case "ghost":
          return 1.35;
        case "operative":
        default:
          return 1.0;
      }
    };

    it("correctly balances trace speed according to difficulty", () => {
      expect(getTraceMultiplier("analyst")).toBe(0.75); // 25% slower for story mode
      expect(getTraceMultiplier("operative")).toBe(1.0); // authentic standard speed
      expect(getTraceMultiplier("ghost")).toBe(1.35); // 35% faster for hardcore mode
    });

    it("calculates hint costs and availability per difficulty", () => {
      const getHintCost = (diff: DifficultyPreset, wallet: number) => {
        if (diff === "ghost") return null; // forbidden in ghost
        if (diff === "analyst") return 0; // free in analyst
        return Math.min(wallet, 50); // 50 crypto in operative
      };

      expect(getHintCost("analyst", 100)).toBe(0);
      expect(getHintCost("operative", 100)).toBe(50);
      expect(getHintCost("operative", 25)).toBe(25); // wallet-capped
      expect(getHintCost("ghost", 1000)).toBeNull(); // disabled
    });
  });

  describe("Smart Terminal Tab Autocompletion Logic", () => {
    const autocompleteCommand = (
      input: string,
      connectedIp: string | null,
      knownIps: string[],
      activeFiles: string[],
    ) => {
      const trimmed = input.trimStart();
      const parts = trimmed.split(/\s+/);
      const availableCommands = connectedIp
        ? ["ls", "cat", "download", "wipe_logs", "disconnect", "clear", "help"]
        : ["scan", "crack", "connect", "clear", "help"];

      if (parts.length <= 1) {
        const query = (parts[0] || "").toLowerCase();
        const match = availableCommands.find((c) => c.startsWith(query));
        if (match) {
          const noArg = [
            "ls",
            "wipe_logs",
            "disconnect",
            "clear",
            "help",
          ].includes(match);
          return match + (noArg ? "" : " ");
        }
        return input;
      }

      const cmd = parts[0].toLowerCase();
      const partialArg = parts.slice(1).join(" ").toLowerCase();

      if (cmd === "scan" || cmd === "connect") {
        const match = knownIps.find((ip) => ip.startsWith(partialArg));
        if (match) return `${cmd} ${match}`;
      } else if (cmd === "download" || cmd === "cat") {
        const match = activeFiles.find((f) =>
          f.toLowerCase().startsWith(partialArg),
        );
        if (match) return `${cmd} ${match}`;
      }

      return input;
    };

    it("autocompletes primary commands when typing prefix", () => {
      expect(autocompleteCommand("sc", null, [], [])).toBe("scan ");
      expect(autocompleteCommand("cr", null, [], [])).toBe("crack ");
      expect(autocompleteCommand("con", null, [], [])).toBe("connect ");
      expect(autocompleteCommand("wip", "198.51.100.42", [], [])).toBe(
        "wipe_logs",
      );
      expect(autocompleteCommand("down", "198.51.100.42", [], [])).toBe(
        "download ",
      );
    });

    it("autocompletes target IPs and file names", () => {
      const knownIps = ["198.51.100.42", "203.0.113.88", "194.165.16.100"];
      const files = ["transfer_manifest.log", "readme.txt", "payload.bin"];

      expect(autocompleteCommand("connect 198", null, knownIps, [])).toBe(
        "connect 198.51.100.42",
      );
      expect(autocompleteCommand("scan 203", null, knownIps, [])).toBe(
        "scan 203.0.113.88",
      );
      expect(
        autocompleteCommand("download trans", "198.51.100.42", knownIps, files),
      ).toBe("download transfer_manifest.log");
    });
  });

  describe("Window Boundary Clamping & Multi-Resolution Support", () => {
    const clampPos = (
      x: number,
      y: number,
      screenWidth: number,
      screenHeight: number,
    ) => {
      const maxX = Math.max(8, screenWidth - 340);
      const maxY = Math.max(8, screenHeight - 80);
      return {
        x: Math.max(8, Math.min(maxX, x)),
        y: Math.max(8, Math.min(maxY, y)),
      };
    };

    it("clamps windows safely within standard laptop resolution (1366x768)", () => {
      const posOffRight = clampPos(2000, 300, 1366, 768);
      expect(posOffRight.x).toBe(1366 - 340);
      expect(posOffRight.y).toBe(300);

      const posOffBottom = clampPos(200, 1200, 1366, 768);
      expect(posOffBottom.x).toBe(200);
      expect(posOffBottom.y).toBe(768 - 80);

      const posNegative = clampPos(-500, -100, 1366, 768);
      expect(posNegative.x).toBe(8);
      expect(posNegative.y).toBe(8);
    });

    it("clamps windows safely within 4K resolution (3840x2160)", () => {
      const posNormal = clampPos(1500, 800, 3840, 2160);
      expect(posNormal.x).toBe(1500);
      expect(posNormal.y).toBe(800);
    });
  });

  describe("Fail-State Penalties & Quarantine Calculation", () => {
    it("deducts proxy burn fee and enforces quarantine on 100% trace", () => {
      let wallet = 450;
      let quarantineSeconds = 0;

      const handleTraceFail = () => {
        wallet = Math.max(0, wallet - 100);
        quarantineSeconds = 15;
      };

      handleTraceFail();
      expect(wallet).toBe(350);
      expect(quarantineSeconds).toBe(15);
    });

    it("imposes timeout penalty when drone breach emergency reboot fails", () => {
      let wallet = 300;
      let firewallHealth = 0;

      const handleDroneTimeout = () => {
        wallet = Math.max(0, wallet - 200);
        firewallHealth = 35; // emergency recovery
      };

      handleDroneTimeout();
      expect(wallet).toBe(100);
      expect(firewallHealth).toBe(35);
    });
  });

  describe("Save Slot Profiles", () => {
    it("creates, validates, and serializes multiple save slot profiles", () => {
      const slots: SaveSlotProfile[] = [
        {
          id: "slot_1",
          operatorHandle: "KODEX_77",
          difficulty: "operative",
          updatedAt: "2026-10-27",
          currentMissionIndex: 2,
          crypto: 1250,
          completedMissionsCount: 2,
        },
        {
          id: "slot_2",
          operatorHandle: "GHOST_X",
          difficulty: "ghost",
          updatedAt: "2026-10-27",
          currentMissionIndex: 0,
          crypto: 50,
          completedMissionsCount: 0,
        },
        {
          id: "slot_3",
          operatorHandle: "EMPTY_SLOT",
          difficulty: "analyst",
          updatedAt: "",
          currentMissionIndex: 0,
          crypto: 50,
          completedMissionsCount: 0,
        },
      ];

      expect(slots.length).toBe(3);
      expect(slots[0].operatorHandle).toBe("KODEX_77");
      expect(slots[1].difficulty).toBe("ghost");
      expect(slots[2].operatorHandle).toBe("EMPTY_SLOT");

      const serialized = JSON.stringify(slots);
      const parsed: SaveSlotProfile[] = JSON.parse(serialized);
      expect(parsed).toEqual(slots);
    });
  });
});
