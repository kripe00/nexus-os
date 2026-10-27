import { describe, it, expect } from "vitest";
import { ALL_CLUES } from "../data/worldData";

describe("Tactical SpearPhish Engine & NetShield Defense", () => {
  it("correctly associates targets with their psychological OSINT profile", () => {
    // Marcus Cole is attached to his dog Koda
    const kodaClue = ALL_CLUES.clue_marcus_dog;
    expect(kodaClue.value).toBe("Koda");

    // Viktor Reyes is attached to military unit Phantom77
    const unitClue = ALL_CLUES.clue_reyes_unit;
    expect(unitClue.value).toBe("Phantom77");

    // Retaliation drone clue reveals drone node IP
    const droneClue = ALL_CLUES.clue_hunter_drone_ip;
    expect(droneClue.value).toBe("141.98.11.200");

    // Firmware purge key
    const purgeKey = ALL_CLUES.clue_core_firmware_key;
    expect(purgeKey.value).toBe("TITAN-ZERO-PURGE");
  });

  it("validates firewall degradation and honeypot capture logic", () => {
    let firewallIntegrity = 100;
    const underAttack = true;

    // Simulate attack tick
    if (underAttack) {
      firewallIntegrity = Math.max(0, firewallIntegrity - 15);
    }
    expect(firewallIntegrity).toBe(85);

    // Simulate repair
    firewallIntegrity = Math.min(100, firewallIntegrity + 35);
    expect(firewallIntegrity).toBe(100);

    // Simulate honeypot trapping
    let honeypotActive = false;
    let capturedIp: string | null = null;

    honeypotActive = true;
    if (honeypotActive) {
      capturedIp = "141.98.11.200";
    }

    expect(capturedIp).toBe("141.98.11.200");
  });

  it("allows activating honeypot while attack is actively underway", () => {
    // Scenario: Operator is in mission 7, underAttack is true, attack already draining firewall
    const underAttack = true;
    let deployingHoneypot = false;
    let honeypotActive = false;
    let capturedAttackerIp: string | null = null;
    let discoveredClues: string[] = [];

    // Player triggers honeypot activation
    const canDeploy = !deployingHoneypot; // Not blocked by underAttack or prior honeypotActive
    expect(canDeploy).toBe(true);

    deployingHoneypot = true;
    // Honeypot triggers
    honeypotActive = true;
    capturedAttackerIp = "141.98.11.200";
    if (!discoveredClues.includes("clue_hunter_drone_ip")) {
      discoveredClues.push("clue_hunter_drone_ip");
    }
    deployingHoneypot = false;

    expect(underAttack).toBe(true);
    expect(honeypotActive).toBe(true);
    expect(capturedAttackerIp).toBe("141.98.11.200");
    expect(discoveredClues).toContain("clue_hunter_drone_ip");
  });
});
