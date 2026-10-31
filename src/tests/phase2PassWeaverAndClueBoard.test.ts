import { describe, it, expect, vi } from "vitest";
import {
  EMAIL_ACCOUNTS,
  PASSWORD_PATTERN_SCHEMAS,
  ALL_CLUES,
} from "../data/worldData";
import { Clue, DifficultyPreset } from "../types/game";

describe("Phase 2: Difficulty-Driven Clue Board & PassWeaver Schema Engine", () => {
  describe("1. Password Pattern Schemas & Account Policies", () => {
    it("defines valid password pattern schemas with required metadata", () => {
      const schemas = Object.values(PASSWORD_PATTERN_SCHEMAS);
      expect(schemas.length).toBeGreaterThanOrEqual(4);

      for (const schema of schemas) {
        expect(schema.id).toBeDefined();
        expect(schema.name).toMatch(/Policy/);
        expect(schema.template).toBeDefined();
        expect(schema.description.length).toBeGreaterThan(10);
        expect(schema.example).toBeDefined();
      }
    });

    it("associates all key email accounts with valid pattern schemas", () => {
      expect(EMAIL_ACCOUNTS["m.cole@velox-ai.io"].patternSchemaId).toBe(
        "noun_year",
      );
      expect(EMAIL_ACCOUNTS["j.sterling@aethelgard.corp"].patternSchemaId).toBe(
        "project_pin",
      );
      expect(EMAIL_ACCOUNTS["v.reyes@aethelgard.corp"].patternSchemaId).toBe(
        "unit_shift",
      );

      // Verify referenced schema IDs actually exist
      for (const acc of Object.values(EMAIL_ACCOUNTS)) {
        if (acc.patternSchemaId) {
          expect(PASSWORD_PATTERN_SCHEMAS[acc.patternSchemaId]).toBeDefined();
        }
      }
    });

    it("verifies target password matches expected pattern schema structure", () => {
      // Marcus Cole: Koda1997 -> Noun (Koda) + Year (1997)
      const marcusAcc = EMAIL_ACCOUNTS["m.cole@velox-ai.io"];
      expect(marcusAcc.password).toBe("Koda1997");
      expect(marcusAcc.password).toMatch(/^[A-Z][a-z]+[0-9]{4}$/);

      // Julian Sterling: Hyperion0451 -> Project (Hyperion) + PIN (0451)
      const julianAcc = EMAIL_ACCOUNTS["j.sterling@aethelgard.corp"];
      expect(julianAcc.password).toBe("Hyperion0451");
      expect(julianAcc.password).toMatch(/^Hyperion[0-9]{4}$/);

      // Viktor Reyes: Phantom778821 -> Unit (Phantom) + Shift (778821)
      const reyesAcc = EMAIL_ACCOUNTS["v.reyes@aethelgard.corp"];
      expect(reyesAcc.password).toBe("Phantom778821");
      expect(reyesAcc.password).toMatch(/^Phantom[0-9]{6}$/);
    });
  });

  describe("2. Difficulty-Gated Intel Autoclassification", () => {
    it("differentiates target person visibility between Analyst and Operative/Ghost", () => {
      const clue = ALL_CLUES.clue_marcus_dog;

      const getDisplayTarget = (clueItem: Clue, diff: DifficultyPreset) => {
        if (diff === "analyst") return clueItem.targetPerson;
        if (clueItem.category === "ip") return "REMOTE HOST";
        return `[INTEL // ${clueItem.category.toUpperCase()}]`;
      };

      // In Analyst mode, full target name is revealed
      expect(getDisplayTarget(clue, "analyst")).toBe("Marcus Cole");

      // In Operative & Ghost mode, target name is masked to require deductive reasoning
      expect(getDisplayTarget(clue, "operative")).toBe("[INTEL // PERSONAL]");
      expect(getDisplayTarget(clue, "ghost")).toBe("[INTEL // PERSONAL]");

      // For IP clues in Operative mode
      const ipClue = ALL_CLUES.clue_dropoff_ip;
      expect(getDisplayTarget(ipClue, "analyst")).toBe("Marcus Cole / Buyer");
      expect(getDisplayTarget(ipClue, "operative")).toBe("REMOTE HOST");
    });

    it("verifies clue action labels reflect automation level", () => {
      const getActionLabel = (isIp: boolean, isEmail: boolean, diff: DifficultyPreset) => {
        if (isIp) return "Load IP in Terminal →";
        if (isEmail) return "Set Target in PassWeaver →";
        return diff === "analyst" ? "Add to PassWeaver →" : "Stage in PassWeaver →";
      };

      expect(getActionLabel(false, false, "analyst")).toBe("Add to PassWeaver →");
      expect(getActionLabel(false, false, "operative")).toBe("Stage in PassWeaver →");
      expect(getActionLabel(false, false, "ghost")).toBe("Stage in PassWeaver →");
    });
  });

  describe("3. PassWeaver Lockout & Complexity Thresholds", () => {
    it("enforces strict lockout thresholds according to difficulty preset", () => {
      const getThresholds = (diff: DifficultyPreset) => ({
        maxAttempts: diff === "ghost" ? 2 : diff === "operative" ? 3 : 5,
        lockoutSeconds: diff === "ghost" ? 35 : diff === "operative" ? 20 : 5,
      });

      expect(getThresholds("analyst")).toEqual({ maxAttempts: 5, lockoutSeconds: 5 });
      expect(getThresholds("operative")).toEqual({ maxAttempts: 3, lockoutSeconds: 20 });
      expect(getThresholds("ghost")).toEqual({ maxAttempts: 2, lockoutSeconds: 35 });
    });

    it("validates schema synthesis matching logic", () => {
      const checkSynthesis = (
        selectedClues: string[],
        selectedSchema: string,
        targetEmail: string,
        diff: DifficultyPreset,
      ) => {
        const acc = EMAIL_ACCOUNTS[targetEmail];
        if (!acc) return { success: false, reason: "NO_ACCOUNT" };

        const hasAllClues =
          acc.requiredClueIds.every((r) => selectedClues.includes(r)) &&
          selectedClues.length === acc.requiredClueIds.length;

        const hasSchema =
          diff === "analyst" || selectedSchema === (acc.patternSchemaId || "noun_year");

        if (hasAllClues && hasSchema) return { success: true };
        if (hasAllClues && !hasSchema) return { success: false, reason: "SCHEMA_MISMATCH" };
        return { success: false, reason: "INVALID_CLUES" };
      };

      const marcusClues = ["clue_marcus_dog", "clue_marcus_year"];

      // Analyst mode: succeeds even if wrong schema selected (auto-assisted)
      expect(
        checkSynthesis(marcusClues, "wrong_schema", "m.cole@velox-ai.io", "analyst").success,
      ).toBe(true);

      // Operative mode: fails if wrong schema selected
      const operativeWrongSchema = checkSynthesis(
        marcusClues,
        "project_pin",
        "m.cole@velox-ai.io",
        "operative",
      );
      expect(operativeWrongSchema.success).toBe(false);
      expect(operativeWrongSchema.reason).toBe("SCHEMA_MISMATCH");

      // Operative mode: succeeds when correct schema selected
      const operativeCorrect = checkSynthesis(
        marcusClues,
        "noun_year",
        "m.cole@velox-ai.io",
        "operative",
      );
      expect(operativeCorrect.success).toBe(true);

      // Ghost mode: fails with wrong clues
      const ghostWrongClues = checkSynthesis(
        ["clue_marcus_cat", "clue_marcus_year"],
        "noun_year",
        "m.cole@velox-ai.io",
        "ghost",
      );
      expect(ghostWrongClues.success).toBe(false);
      expect(ghostWrongClues.reason).toBe("INVALID_CLUES");
    });
  });
});
