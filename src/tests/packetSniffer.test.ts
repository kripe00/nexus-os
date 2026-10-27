import { describe, it, expect } from "vitest";
import { ALL_CLUES, SNIFFER_SUBNETS } from "../data/worldData";

describe("PacketSniffer & Multi-Vector Infiltration Suite", () => {
  it("validates sniffer subnets and packet protocol formats", () => {
    expect(SNIFFER_SUBNETS.length).toBeGreaterThanOrEqual(4);

    const validProtos = new Set(["HTTP", "SMTP", "TELNET", "DNS", "RF_RAW"]);

    SNIFFER_SUBNETS.forEach((subnet) => {
      expect(subnet.id).toBeTruthy();
      expect(subnet.name).toBeTruthy();
      expect(subnet.subnetCidr).toMatch(
        /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2}$/,
      );
      expect(subnet.packets.length).toBeGreaterThan(0);

      subnet.packets.forEach((pkt) => {
        expect(pkt.id).toBeTruthy();
        expect(validProtos.has(pkt.protocol)).toBe(true);
        expect(pkt.sourceIp).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
        expect(pkt.destIp).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
        expect(pkt.rawHex.length).toBeGreaterThan(10);

        if (pkt.containsCredential) {
          expect(pkt.extractedClueId).toBeDefined();
          expect(ALL_CLUES[pkt.extractedClueId!]).toBeDefined();
          expect(pkt.credentialSnippet).toBeTruthy();
        }
      });
    });
  });

  it("proves Operation 01 can be solved via PacketSniffer wiretap instead of WebMail", () => {
    const veloxSubnet = SNIFFER_SUBNETS.find((s) => s.id === "velox_subnet");
    expect(veloxSubnet).toBeDefined();

    // Packet 1 leaks the dead-drop server IP
    const stagingPacket = veloxSubnet?.packets.find(
      (p) => p.extractedClueId === "clue_dropoff_ip",
    );
    expect(stagingPacket).toBeDefined();
    expect(stagingPacket?.extractedClueId).toBe("clue_dropoff_ip");
    expect(ALL_CLUES[stagingPacket!.extractedClueId!].value).toBe(
      "198.51.100.42",
    );
  });

  it("proves Operation 03 can be solved via Aethelgard LAN wiretap", () => {
    const aethelgardLan = SNIFFER_SUBNETS.find(
      (s) => s.id === "aethelgard_lan",
    );
    expect(aethelgardLan).toBeDefined();

    const overridePacket = aethelgardLan?.packets.find(
      (p) => p.extractedClueId === "clue_vault_override",
    );
    expect(overridePacket).toBeDefined();
    expect(ALL_CLUES[overridePacket!.extractedClueId!].value).toBe(
      "OMEGA-99-KEY",
    );
  });
});
