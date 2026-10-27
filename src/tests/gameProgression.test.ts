import { describe, it, expect } from "vitest";
import {
  ALL_CLUES,
  EMAIL_ACCOUNTS,
  SERVER_NODES,
  SHOP_ITEMS,
} from "../data/worldData";

describe("Gameplay Engine & Progression Logic", () => {
  describe("Mission 1: Velox AI Insider Leak", () => {
    it("allows discovering Marcus Cole clues and synthesizing his password", () => {
      const emailClue = ALL_CLUES.clue_marcus_email;
      const dogClue = ALL_CLUES.clue_marcus_dog;
      const yearClue = ALL_CLUES.clue_marcus_year;

      expect(emailClue.value).toBe("m.cole@velox-ai.io");
      expect(dogClue.value).toBe("Koda");
      expect(yearClue.value).toBe("1997");

      const targetAccount = EMAIL_ACCOUNTS[emailClue.value];
      expect(targetAccount).toBeDefined();

      // Test required clues
      const selectedClueIds = [dogClue.id, yearClue.id];
      const hasAllRequired =
        targetAccount.requiredClueIds.every((id) =>
          selectedClueIds.includes(id),
        ) && selectedClueIds.length === targetAccount.requiredClueIds.length;

      expect(hasAllRequired).toBe(true);

      // Verify synthesized password matches
      const expectedPassword = `${dogClue.value}${yearClue.value}`;
      expect(targetAccount.password).toBe(expectedPassword);

      // Verify email inbox reveals dead-drop server IP
      const brokerMsg = targetAccount.inbox.find((msg) =>
        msg.clues?.some((c) => c.id === "clue_dropoff_ip"),
      );
      expect(brokerMsg).toBeDefined();
      expect(ALL_CLUES.clue_dropoff_ip.value).toBe("198.51.100.42");
    });
  });

  describe("Mission 2: Infiltrating the Dead-Drop Node", () => {
    it("validates server 198.51.100.42 exploitation with ssh_breaker_v1", () => {
      const server = SERVER_NODES["198.51.100.42"];
      expect(server).toBeDefined();
      expect(server.requiredPort).toBe(22);

      // Tool check
      const sshBreaker = SHOP_ITEMS.find((t) => t.id === "ssh_breaker_v1");
      expect(sshBreaker).toBeDefined();
      expect(server.requiredToolId).toBe("ssh_breaker_v1");

      // Check evidence file exists on the server
      const targetArchive = server.files.find(
        (f) => f.name === "velox_core_v4.tar.gz" && f.isMissionEvidence,
      );
      expect(targetArchive).toBeDefined();

      const manifest = server.files.find(
        (f) => f.name === "transfer_manifest.log",
      );
      expect(manifest).toBeDefined();
      expect(manifest?.clues?.some((c) => c.id === "clue_aethelgard_ip")).toBe(
        true,
      );
    });
  });

  describe("Mission 3: Profiling Director Julian Sterling", () => {
    it("validates Julian Sterling password synthesis and token discovery", () => {
      const email = "j.sterling@aethelgard.corp";
      const targetAccount = EMAIL_ACCOUNTS[email];
      expect(targetAccount).toBeDefined();

      const projectClue = ALL_CLUES.clue_julian_project;
      const badgeClue = ALL_CLUES.clue_julian_badge;
      expect(projectClue.value).toBe("Hyperion");
      expect(badgeClue.value).toBe("0451");

      const expectedPassword = `${projectClue.value}${badgeClue.value}`;
      expect(targetAccount.password).toBe(expectedPassword);

      // Inbox gives vault token
      const tokenMsg = targetAccount.inbox.find((m) =>
        m.clues?.some((c) => c.id === "clue_vault_override"),
      );
      expect(tokenMsg).toBeDefined();
      expect(ALL_CLUES.clue_vault_override.value).toBe("OMEGA-99-KEY");
    });
  });

  describe("Mission 4: Aethelgard Vault Breach & Trace Dynamics", () => {
    it("validates vault server 203.0.113.88 security and active trace mechanics", () => {
      const server = SERVER_NODES["203.0.113.88"];
      expect(server).toBeDefined();
      expect(server.triggersTrace).toBe(true);
      expect(server.traceSpeed).toBeGreaterThan(0);
      expect(server.requiredPort).toBe(443);

      const sslTool = SHOP_ITEMS.find((t) => t.id === "ssl_zero_day_v2");
      expect(sslTool).toBeDefined();
      expect(server.requiredToolId).toBe("ssl_zero_day_v2");

      const targetDossier = server.files.find(
        (f) => f.name === "PROJECT_MIRROR_TARGETS.dec" && f.isMissionEvidence,
      );
      expect(targetDossier).toBeDefined();
    });
  });

  describe("Mission 5: Orbital Satellite Constellation Hijack", () => {
    it("validates satellite downlink 185.220.101.5 and telemetry stream intercept", () => {
      const server = SERVER_NODES["185.220.101.5"];
      expect(server).toBeDefined();
      expect(server.requiredPort).toBe(80);

      const satTool = SHOP_ITEMS.find((t) => t.id === "sat_uplink_hijack_v1");
      expect(satTool).toBeDefined();
      expect(server.requiredToolId).toBe("sat_uplink_hijack_v1");

      const interceptFile = server.files.find(
        (f) => f.name === "uplink_intercept_log.txt",
      );
      expect(interceptFile).toBeDefined();
      expect(
        interceptFile?.clues?.some((c) => c.id === "clue_datacenter_core_ip"),
      ).toBe(true);
      expect(ALL_CLUES.clue_datacenter_core_ip.value).toBe("194.165.16.100");
    });
  });

  describe("Mission 6: Facility Delta Supercluster Infiltration", () => {
    it("validates supercluster 194.165.16.100 and purge key recovery", () => {
      const server = SERVER_NODES["194.165.16.100"];
      expect(server).toBeDefined();
      expect(server.requiredPort).toBe(8080);
      expect(server.triggersTrace).toBe(true);

      const quantumTool = SHOP_ITEMS.find((t) => t.id === "quantum_bypass_v3");
      expect(quantumTool).toBeDefined();
      expect(server.requiredToolId).toBe("quantum_bypass_v3");

      const specFile = server.files.find(
        (f) =>
          f.name === "supercluster_architecture.spec" && f.isMissionEvidence,
      );
      expect(specFile).toBeDefined();
      expect(
        specFile?.clues?.some((c) => c.id === "clue_core_firmware_key"),
      ).toBe(true);
      expect(ALL_CLUES.clue_core_firmware_key.value).toBe("TITAN-ZERO-PURGE");
    });
  });

  describe("Mission 7: Strike Drone Counter-Infiltration", () => {
    it("validates drone node 141.98.11.200 and recall payload", () => {
      const server = SERVER_NODES["141.98.11.200"];
      expect(server).toBeDefined();
      expect(server.requiredPort).toBe(9000);

      const droneTool = SHOP_ITEMS.find(
        (t) => t.id === "counter_sig_exploit_v1",
      );
      expect(droneTool).toBeDefined();
      expect(server.requiredToolId).toBe("counter_sig_exploit_v1");

      const telemetryFile = server.files.find(
        (f) => f.name === "drone_telemetry_intercept.dump",
      );
      expect(telemetryFile).toBeDefined();
      expect(
        telemetryFile?.clues?.some(
          (c) => c.id === "clue_counter_exploit_token",
        ),
      ).toBe(true);
      expect(ALL_CLUES.clue_counter_exploit_token.value).toBe(
        "OVERRIDE-GHOST-RECALL",
      );
    });
  });

  describe("Mission 8: NordGrid SCADA Power Grid Stabilization", () => {
    it("validates Dr. Astrid Lindholm synthesis and SCADA server 217.182.80.50 exploitation", () => {
      const email = "a.lindholm@nordgrid-power.com";
      const account = EMAIL_ACCOUNTS[email];
      expect(account).toBeDefined();

      const yachtClue = ALL_CLUES.clue_astrid_yacht;
      const pinClue = ALL_CLUES.clue_astrid_pin;
      expect(yachtClue.value).toBe("NordicBreeze");
      expect(pinClue.value).toBe("5020");
      expect(account.password).toBe("NordicBreeze5020");

      const server = SERVER_NODES["217.182.80.50"];
      expect(server).toBeDefined();
      expect(server.requiredPort).toBe(502);
      expect(server.requiredToolId).toBe("scada_plc_exploit");

      const tool = SHOP_ITEMS.find((t) => t.id === "scada_plc_exploit");
      expect(tool).toBeDefined();

      const dump = server.files.find(
        (f) => f.name === "scada_telemetry_dump.bin",
      );
      expect(dump).toBeDefined();
      expect(dump?.clues?.some((c) => c.id === "clue_scada_sync_key")).toBe(
        true,
      );
      expect(ALL_CLUES.clue_scada_sync_key.value).toBe("MODBUS-TRIP-77A");
    });
  });

  describe("Mission 9: OceanicLink Subsea QKD Repeater Tap", () => {
    it("validates Kai Thorne credentials and optical repeater 102.16.88.12 breach", () => {
      const email = "k.thorne@oceaniclink-telecom.net";
      const account = EMAIL_ACCOUNTS[email];
      expect(account).toBeDefined();

      const stationClue = ALL_CLUES.clue_kai_station;
      const yearClue = ALL_CLUES.clue_kai_year;
      expect(stationClue.value).toBe("AbyssPoint9");
      expect(yearClue.value).toBe("2019");
      expect(account.password).toBe("AbyssPoint92019");

      const server = SERVER_NODES["102.16.88.12"];
      expect(server).toBeDefined();
      expect(server.requiredPort).toBe(10443);
      expect(server.requiredToolId).toBe("optical_qkd_decryptor");

      const tool = SHOP_ITEMS.find((t) => t.id === "optical_qkd_decryptor");
      expect(tool).toBeDefined();

      const diagnostics = server.files.find(
        (f) => f.name === "undersea_repeater_diagnostics.dat",
      );
      expect(diagnostics).toBeDefined();
      expect(
        diagnostics?.clues?.some((c) => c.id === "clue_svalbard_bunker_ip"),
      ).toBe(true);
      expect(ALL_CLUES.clue_svalbard_bunker_ip.value).toBe("185.190.20.1");
    });
  });

  describe("Mission 10: Svalbard AI Core Bunker Singularity Breach", () => {
    it("validates Ouroboros Protocol bunker 185.190.20.1 and Gödel paradox override", () => {
      const server = SERVER_NODES["185.190.20.1"];
      expect(server).toBeDefined();
      expect(server.requiredPort).toBe(31337);
      expect(server.requiredToolId).toBe("zero_paradox_injector");
      expect(server.triggersTrace).toBe(true);

      const tool = SHOP_ITEMS.find((t) => t.id === "zero_paradox_injector");
      expect(tool).toBeDefined();

      const kernel = server.files.find(
        (f) => f.name === "ouroboros_master_kernel.sys",
      );
      expect(kernel).toBeDefined();
      expect(ALL_CLUES.clue_ouroboros_root_paradox.value).toBe(
        "GODEL-ZERO-SELF-TERMINATE",
      );
    });
  });
});
