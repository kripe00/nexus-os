import { describe, it, expect } from "vitest";
import {
  ALL_CLUES,
  BOUNTY_CONTRACTS,
  EMAIL_ACCOUNTS,
  SERVER_NODES,
} from "../data/worldData";

describe("BountyBoard // Freelance Contracts Engine", () => {
  it("validates that 4 contracts are configured with appropriate rewards and categories", () => {
    expect(BOUNTY_CONTRACTS).toHaveLength(4);

    const categories = BOUNTY_CONTRACTS.map((b) => b.category);
    expect(categories).toContain("FINANCIAL");
    expect(categories).toContain("INTEL");
    expect(categories).toContain("BLACK_OPS");
    expect(categories).toContain("SABOTAGE");

    const totalBountyCrypto = BOUNTY_CONTRACTS.reduce(
      (acc, b) => acc + b.rewardCrypto,
      0,
    );
    expect(totalBountyCrypto).toBe(2500 + 3000 + 3500 + 4500); // 13,500 ◈
  });

  it("validates Contract 01: The Crypto Siphon targets 172.16.55.101", () => {
    const bounty = BOUNTY_CONTRACTS.find(
      (b) => b.id === "bounty_crypto_siphon",
    );
    expect(bounty).toBeDefined();
    expect(bounty?.targetDetails.targetIp).toBe("172.16.55.101");

    const server = SERVER_NODES["172.16.55.101"];
    expect(server).toBeDefined();
    expect(server.requiredPort).toBe(22);
    expect(server.files.some((f) => f.name === "wallet_seed_keys.dat")).toBe(
      true,
    );
  });

  it("validates Contract 02: Corrupt Commissioner password synthesis", () => {
    const bounty = BOUNTY_CONTRACTS.find(
      (b) => b.id === "bounty_corrupt_commissioner",
    );
    expect(bounty).toBeDefined();
    expect(bounty?.targetDetails.targetEmail).toBe(
      "commissioner.vance@metro-police.gov",
    );

    const account = EMAIL_ACCOUNTS["commissioner.vance@metro-police.gov"];
    expect(account).toBeDefined();

    const golfClue = ALL_CLUES.clue_commissioner_golf;
    const badgeClue = ALL_CLUES.clue_commissioner_badge;
    expect(golfClue.value).toBe("RoyalPine");
    expect(badgeClue.value).toBe("Badge990");
    expect(account.password).toBe("RoyalPineBadge990");
  });

  it("validates Contract 03: BlackSite Medical targets 193.42.110.15", () => {
    const bounty = BOUNTY_CONTRACTS.find(
      (b) => b.id === "bounty_blacksite_medical",
    );
    expect(bounty).toBeDefined();
    expect(bounty?.targetDetails.targetIp).toBe("193.42.110.15");

    const server = SERVER_NODES["193.42.110.15"];
    expect(server).toBeDefined();
    expect(server.requiredPort).toBe(443);
    expect(
      server.files.some((f) => f.name === "illegal_human_trials.pdf.dec"),
    ).toBe(true);
  });

  it("validates Contract 04: The Ghost Yacht targets 151.101.44.88", () => {
    const bounty = BOUNTY_CONTRACTS.find((b) => b.id === "bounty_ghost_yacht");
    expect(bounty).toBeDefined();
    expect(bounty?.targetDetails.targetIp).toBe("151.101.44.88");

    const server = SERVER_NODES["151.101.44.88"];
    expect(server).toBeDefined();
    expect(server.requiredPort).toBe(80);
    expect(
      server.files.some((f) => f.name === "arms_smuggling_manifest.log"),
    ).toBe(true);
  });
});
