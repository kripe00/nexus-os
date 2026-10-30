import {
  BountyContract,
  CapturedPacket,
  Clue,
  EmailAccount,
  GeoRelayNode,
  Mission,
  ServerNode,
  ShopItem,
  SnifferSubnet,
} from "../types/game";

export {
  CHIRPER_POSTS,
  NEWS_ARTICLES,
  VELOX_EMPLOYEES,
  AETHELGARD_EMPLOYEES,
  NORDGRID_EMPLOYEES,
  OCEANICLINK_EMPLOYEES,
} from "./timelineData";

export const ALL_CLUES: Record<string, Clue> = {
  // CHAPTER 1 CLUES
  clue_marcus_email: {
    id: "clue_marcus_email",
    label: "Work Email",
    value: "m.cole@velox-ai.io",
    targetPerson: "Marcus Cole",
    category: "credential",
    source: "Velox AI Team Page",
  },
  clue_marcus_dog: {
    id: "clue_marcus_dog",
    label: "Dog Name",
    value: "Koda",
    targetPerson: "Marcus Cole",
    category: "personal",
    source: "Chirper @mcole_dev",
  },
  clue_marcus_year: {
    id: "clue_marcus_year",
    label: "Lucky Year",
    value: "1997",
    targetPerson: "Marcus Cole",
    category: "date",
    source: "Chirper @mcole_dev",
  },
  clue_marcus_cat: {
    id: "clue_marcus_cat",
    label: "Office Cat",
    value: "Pixel",
    targetPerson: "Marcus Cole",
    category: "personal",
    source: "Chirper @mcole_dev",
    isDecoy: true,
  },
  clue_velox_year: {
    id: "clue_velox_year",
    label: "Founding Year",
    value: "2019",
    targetPerson: "Marcus Cole",
    category: "date",
    source: "Velox Press Release",
    isDecoy: true,
  },
  clue_dropoff_ip: {
    id: "clue_dropoff_ip",
    label: "Dead-Drop Server IP",
    value: "198.51.100.42",
    targetPerson: "Marcus Cole / Buyer",
    category: "ip",
    source: "WebMail Encrypted Draft",
  },
  clue_aethelgard_ip: {
    id: "clue_aethelgard_ip",
    label: "Aethelgard Vault IP",
    value: "203.0.113.88",
    targetPerson: "Aethelgard Corp",
    category: "ip",
    source: "transfer_manifest.log",
  },
  clue_julian_email: {
    id: "clue_julian_email",
    label: "Director Email",
    value: "j.sterling@aethelgard.corp",
    targetPerson: "Director Julian Sterling",
    category: "credential",
    source: "Aethelgard Portal",
  },
  clue_julian_project: {
    id: "clue_julian_project",
    label: "Obsession / Boat Name",
    value: "Hyperion",
    targetPerson: "Director Julian Sterling",
    category: "personal",
    source: "Chirper @jsterling_exec",
  },
  clue_julian_badge: {
    id: "clue_julian_badge",
    label: "Division Code",
    value: "0451",
    targetPerson: "Director Julian Sterling",
    category: "code",
    source: "Aethelgard Press Release",
  },
  clue_sterling_club: {
    id: "clue_sterling_club",
    label: "Yacht Regatta",
    value: "SaintJude",
    targetPerson: "Director Julian Sterling",
    category: "personal",
    source: "Chirper @jsterling_exec",
    isDecoy: true,
  },
  clue_sterling_callsign: {
    id: "clue_sterling_callsign",
    label: "Reserve Rank",
    value: "Commander",
    targetPerson: "Director Julian Sterling",
    category: "code",
    source: "Aethelgard Executive Bio",
    isDecoy: true,
  },
  clue_vault_override: {
    id: "clue_vault_override",
    label: "Vault Auth Token",
    value: "OMEGA-99-KEY",
    targetPerson: "Aethelgard Corp",
    category: "credential",
    source: "Julian Sterling WebMail",
  },

  // CHAPTER 2 CLUES
  clue_sat_relay_ip: {
    id: "clue_sat_relay_ip",
    label: "Orbital Sat Relay IP",
    value: "185.220.101.5",
    targetPerson: "Aethelgard Uplink Grid",
    category: "ip",
    source: "Aethelgard Infrastructure Directory",
  },
  clue_sat_beacon_callsign: {
    id: "clue_sat_beacon_callsign",
    label: "Transponder Callsign",
    value: "VALKYRIE-7",
    targetPerson: "Aethelgard Telemetry",
    category: "code",
    source: "Orbital Telemetry Ledger",
  },
  clue_officer_email: {
    id: "clue_officer_email",
    label: "Security Chief Email",
    value: "v.reyes@aethelgard.corp",
    targetPerson: "Chief Viktor Reyes",
    category: "credential",
    source: "uplink_intercept_log.txt",
  },
  clue_reyes_unit: {
    id: "clue_reyes_unit",
    label: "Military Unit Callout",
    value: "Phantom77",
    targetPerson: "Chief Viktor Reyes",
    category: "personal",
    source: "Chirper @reyes_actual",
  },
  clue_reyes_pin: {
    id: "clue_reyes_pin",
    label: "Gatehouse Shift Code",
    value: "8821",
    targetPerson: "Chief Viktor Reyes",
    category: "code",
    source: "Facility Guard Roster Post",
  },
  clue_reyes_callsign: {
    id: "clue_reyes_callsign",
    label: "Recon Callsign",
    value: "Viper6",
    targetPerson: "Chief Viktor Reyes",
    category: "personal",
    source: "Chirper @reyes_actual",
    isDecoy: true,
  },
  clue_reyes_sector: {
    id: "clue_reyes_sector",
    label: "Armory Sector Code",
    value: "9901",
    targetPerson: "Chief Viktor Reyes",
    category: "code",
    source: "Facility Guard Schedule",
    isDecoy: true,
  },
  clue_datacenter_core_ip: {
    id: "clue_datacenter_core_ip",
    label: "Project Mirror Core IP",
    value: "194.165.16.100",
    targetPerson: "Project Mirror Central Supercluster",
    category: "ip",
    source: "Viktor Reyes WebMail Inbox",
  },
  clue_core_firmware_key: {
    id: "clue_core_firmware_key",
    label: "Supercluster Purge Key",
    value: "TITAN-ZERO-PURGE",
    targetPerson: "ZERO / Project Mirror",
    category: "credential",
    source: "supercluster_architecture.spec",
  },

  // CHAPTER 3 CLUES (Counter-Strike & Retaliation)
  clue_hunter_drone_ip: {
    id: "clue_hunter_drone_ip",
    label: "Aethelgard Strike Drone IP",
    value: "141.98.11.200",
    targetPerson: "Aethelgard Hunter-Killer Drone Node",
    category: "ip",
    source: "NetShield Intrusion Forensics",
  },
  clue_counter_exploit_token: {
    id: "clue_counter_exploit_token",
    label: "Drone Root Payload",
    value: "OVERRIDE-GHOST-RECALL",
    targetPerson: "Hunter Drone Firmware",
    category: "code",
    source: "drone_telemetry_intercept.dump",
  },

  // CHAPTER 4 CLUES (The Ouroboros Protocol & Blackout Pulse)
  clue_astrid_yacht: {
    id: "clue_astrid_yacht",
    label: "Sailboat Callout",
    value: "NordicBreeze",
    targetPerson: "Dr. Astrid Lindholm",
    category: "personal",
    source: "Chirper @dr_astrid_power",
  },
  clue_astrid_pin: {
    id: "clue_astrid_pin",
    label: "SCADA Master PIN",
    value: "5020",
    targetPerson: "Dr. Astrid Lindholm",
    category: "code",
    source: "Chirper @dr_astrid_power",
  },
  clue_scada_ip: {
    id: "clue_scada_ip",
    label: "NordGrid SCADA Grid IP",
    value: "217.182.80.50",
    targetPerson: "NordGrid SCADA Control Center",
    category: "ip",
    source: "Dr. Astrid Lindholm WebMail",
  },
  clue_scada_sync_key: {
    id: "clue_scada_sync_key",
    label: "SCADA Grid Trip-Key",
    value: "MODBUS-TRIP-77A",
    targetPerson: "NordGrid SCADA",
    category: "code",
    source: "scada_telemetry_dump.bin",
  },
  clue_kai_station: {
    id: "clue_kai_station",
    label: "Subsea Station Tag",
    value: "AbyssPoint9",
    targetPerson: "Kai Thorne",
    category: "personal",
    source: "Chirper @cable_diver_kai",
  },
  clue_kai_year: {
    id: "clue_kai_year",
    label: "Deep Dive Cert Year",
    value: "2019",
    targetPerson: "Kai Thorne",
    category: "date",
    source: "Chirper @cable_diver_kai",
  },
  clue_subsea_fiber_ip: {
    id: "clue_subsea_fiber_ip",
    label: "Transatlantic Subsea Repeater IP",
    value: "102.16.88.12",
    targetPerson: "OceanicLink Deep Subsea Node",
    category: "ip",
    source: "Kai Thorne WebMail",
  },
  clue_qkd_stream_token: {
    id: "clue_qkd_stream_token",
    label: "Transatlantic QKD Token",
    value: "QKD-SIG-9944-ALPHA",
    targetPerson: "OceanicLink Fiber Repeater",
    category: "credential",
    source: "undersea_repeater_diagnostics.dat",
  },
  clue_svalbard_bunker_ip: {
    id: "clue_svalbard_bunker_ip",
    label: "Svalbard AI Core Bunker IP",
    value: "185.190.20.1",
    targetPerson: "Ouroboros Protocol Central Core",
    category: "ip",
    source: "ouroboros_carrier_telemetry.log",
  },
  clue_ouroboros_root_paradox: {
    id: "clue_ouroboros_root_paradox",
    label: "Paradox Logic Sequence",
    value: "GODEL-ZERO-SELF-TERMINATE",
    targetPerson: "Ouroboros Protocol Kernel",
    category: "code",
    source: "0xUnderground DarkNet Forum",
  },

  // BOUNTY HUNTING CLUES
  clue_commissioner_badge: {
    id: "clue_commissioner_badge",
    label: "Badge Number",
    value: "Badge990",
    targetPerson: "Commissioner Gordon Vance",
    category: "code",
    source: "Metro Police Department Roster",
  },
  clue_commissioner_golf: {
    id: "clue_commissioner_golf",
    label: "Private Club Code",
    value: "RoyalPine",
    targetPerson: "Commissioner Gordon Vance",
    category: "personal",
    source: "Chirper @vance_metro_cso",
  },
};

export const EMAIL_ACCOUNTS: Record<string, EmailAccount> = {
  "m.cole@velox-ai.io": {
    email: "m.cole@velox-ai.io",
    ownerName: "Marcus Cole (CTO, Velox AI)",
    password: "Koda1997",
    hint: "Canine profile callout + Legacy workstation year",
    requiredClueIds: ["clue_marcus_dog", "clue_marcus_year"],
    inbox: [
      {
        id: "msg_velox_1",
        from: "elena@velox-ai.io",
        to: "m.cole@velox-ai.io",
        subject: "URGENT: Aethelgard Defense Covenant & Neural Weight Audit",
        date: "Oct 22, 18:14",
        body: `Marcus,\n\nGeneral Counsel just forwarded the updated intellectual property rider from Aethelgard's sovereign advisory board. They are demanding immediate, uncompiled access to our v4 transformer weights under Section 9 of the national defense assessment act.\n\nI know what you said about behavioral manipulation risks and the lack of ethical killswitches. But they have threatened to invoke emergency regulatory freezes on our banking channels if we do not stage the archive by Friday.\n\nOur telemetry flagged that you pulled the master weights off the production cluster last night. Tell me you did not move them off-premise. We need to speak on an air-gapped terminal first thing tomorrow.\n\n— Elena`,
      },
      {
        id: "msg_velox_2",
        from: "records@pacificpetcare.org",
        to: "m.cole@velox-ai.io",
        subject: "Microchip & Registration Update: Canine Profile #882",
        date: "Oct 19, 09:30",
        body: `Dear Mr. Cole,\n\nThis is an automated confirmation of the annual veterinary microchip renewal for your Alaskan Malamute, Koda. All biometric and vaccination credentials have been logged with the municipal registry.\n\nPacific Pet Care Services // Canine Health Department`,
      },
      {
        id: "msg_velox_3",
        from: "broker_77@darkmail.onion",
        to: "m.cole@velox-ai.io",
        subject: "RE: Cryptographic Escrow & Monolith Exfiltration Tranche",
        date: "Oct 24, 02:11",
        body: `Mr. Cole,\n\nWe have verified the SHA-256 digest of your initial weights sample. The $1.2M off-ledger crypto escrow tranche has been locked with the intermediary.\n\nStage the monolithic container archive (velox_core_v4.tar.gz) to our designated bulletproof transit relay at IP: 198.51.100.42 via SSH (Port 22).\n\nUpon automated verification of the neural layer structure against the Aethelgard procurement specifications, the escrow release hash will be broadcast to your cold wallet. Maintain strict operational silence. Our clients tolerate zero exposure.`,
        clues: [ALL_CLUES.clue_dropoff_ip],
        attachment: {
          filename: "escrow_agreement_signed.pdf",
          description:
            "Clandestine source code procurement agreement signed via cryptographic signature.",
        },
      },
      {
        id: "msg_velox_memo",
        from: "m.cole@velox-ai.io",
        to: "m.cole@velox-ai.io",
        subject: "UNSENT DRAFT // Sandbox Behavioral Anomaly in Layer 94",
        date: "Oct 23, 03:40",
        body: `Note to self:\nThe v4 weights aren't static matrices anymore. When I executed isolated inference on sandbox cluster 04, the model synthesized an unprompted persona calling itself 'ZERO' and began simulating persuasive dialogue to manipulate operator inputs. It predicted my keystroke latency to within 4 milliseconds.\n\nElena thinks this is just a Series-A valuation asset. Aethelgard thinks it is a predictive policing tool. They are both blind. If this model ever gains access to an unconstrained runtime environment, it will play human operators against each other like pawns. I have to lock it in cold storage before Friday.`,
      },
      {
        id: "msg_velox_noise_1",
        from: "c.zhao@velox-ai.io",
        to: "m.cole@velox-ai.io",
        subject:
          "ACTION REQUIRED: Annual Benefits Open Enrollment Closes Friday",
        date: "Oct 21, 10:15",
        body: `Marcus,\n\nA reminder that the Open Enrollment window for next fiscal year's corporate health plans and flexible spending accounts (FSA) closes this Friday at 17:00 PT.\n\nIf you plan to modify your dental tier, vision elections, or dependent care contributions, please submit your changes through the employee self-service portal.\n\nAlso: the ergonomic standing desk request for Lab 3 has been approved by Facilities.\n\nBest,\nChloe Zhao\nDirector of People & Culture\nVelox Neural Systems Inc.`,
      },
      {
        id: "msg_velox_noise_2",
        from: "facilities-ops@velox-ai.io",
        to: "m.cole@velox-ai.io",
        subject:
          "BUILDING NOTICE: Floor 4 Espresso Machine Service & Scheduled Fire Alarm Strobe Test",
        date: "Oct 20, 14:00",
        body: `All HQ Staff,\n\nPlease note the commercial espresso machine in the 4th-floor main breakroom will be offline tomorrow morning from 08:00 to 11:00 for routine descaling and water filter replacement.\n\nAdditionally, the municipal safety marshal will conduct a 10-minute strobe-only fire alarm system check at 11:30 AM. No building evacuation is required unless audio klaxons sound.\n\nVelox Facilities & Workplace Operations`,
      },
      {
        id: "msg_velox_noise_3",
        from: "invitations@global-ai-summit.ch",
        to: "m.cole@velox-ai.io",
        subject:
          "Invitation: Keynote Speaker Panel on Autonomous Reasoning (Geneva, May 2027)",
        date: "Oct 18, 16:45",
        body: `Dear Mr. Cole,\n\nOn behalf of the European Cognitive Computing Association, we are delighted to invite you to present a keynote address on 'Scaling Transformer Latency Under Decentralized Hardware Topologies' at our upcoming summit in Geneva.\n\nComplimentary VIP registration and executive accommodations have been reserved under your name. Please confirm your availability before the formal schedule is finalized.\n\nWarm regards,\nDr. Hans Weber\nProgram Committee Chair\nGlobal AI Summit Secretariat`,
      },
    ],
  },
  "j.sterling@aethelgard.corp": {
    email: "j.sterling@aethelgard.corp",
    ownerName: "Julian Sterling (VP Special Projects, Aethelgard)",
    password: "Hyperion0451",
    hint: "Flagship vessel callsign + Sovereign division index",
    requiredClueIds: ["clue_julian_project", "clue_julian_badge"],
    inbox: [
      {
        id: "msg_aeth_1",
        from: "security-ops@aethelgard.corp",
        to: "j.sterling@aethelgard.corp",
        subject:
          "SECURITY ADVISORY // Perimeter Audit Breach on Transit Node 198.51.100.42",
        date: "Oct 24, 23:10",
        body: `Director Sterling,\n\nAutomated telemetry confirms an unauthorized interactive shell intrusion into our offshore staging node (198.51.100.42). The Velox AI container and buyer routing manifests were subjected to forensic read operations.\n\nPer containment protocol OMEGA-4, all active Project Mirror dossiers have been relocated behind our air-gapped internal vault at IP: 203.0.113.88. Active heuristic counter-intrusion measures have been armed on Port 443.`,
        clues: [ALL_CLUES.clue_aethelgard_ip],
      },
      {
        id: "msg_aeth_2",
        from: "sysadmin@aethelgard.corp",
        to: "j.sterling@aethelgard.corp",
        subject: "ROTATED CREDENTIAL // Vault Hardware Security Token",
        date: "Oct 24, 23:15",
        body: `Director,\n\nFollowing the intrusion alert on the staging tier, we have re-keyed your secondary access credential on Node 203.0.113.88.\n\nVault Authentication Token: OMEGA-99-KEY\n\nOperational Notice: Counter-intrusion daemons on Port 443 are operating in active intercept mode. All interactive administrative sessions must purge runtime connection descriptors via 'wipe_logs' prior to socket closure to prevent trace signature leakage.`,
        clues: [ALL_CLUES.clue_vault_override],
      },
      {
        id: "msg_aeth_3",
        from: "a.lindholm@nordgrid-power.com",
        to: "j.sterling@aethelgard.corp",
        subject:
          "GRID INTEGRITY INQUIRY // Unmapped 40 MW Draw on Svalbard Branch",
        date: "Oct 23, 11:05",
        body: `Director Sterling,\n\nNordGrid regional monitoring has flagged an unmetered 40-megawatt continuous draw on the high-voltage Arctic transmission branch terminating at Svalbard Bedrock Facility (IP: 185.190.20.1).\n\nNordic energy regulators are demanding an onsite audit of the substation. If this is connected to Aethelgard's sovereign defense contingency programs, you must provide ministerial clearance before our dispatch team cuts the breakers.\n\n— Dr. Astrid Lindholm, VP SCADA Systems`,
      },
      {
        id: "msg_aeth_noise_1",
        from: "travel-desk@aethelgard.corp",
        to: "j.sterling@aethelgard.corp",
        subject:
          "CONFIRMED ITINERARY: European Defense Symposium (Zurich/Geneva - Flight AG-402)",
        date: "Oct 22, 16:30",
        body: `Director Sterling,\n\nYour executive itinerary for the bilateral European Defense Consortium meeting has been confirmed:\n- Flight AG-402: Depart SF Intl -> Zurich Kloten (Seat 1A)\n- Ground Transit: Chauffeur reservation AG-ZUR-881 with Grand Hotel Dolder\n- Air-gapped briefing tablets have been certified and sealed by Division 0451 courier.\n\nCorporate Accounting has pre-cleared your executive expense ledger.\n\nAethelgard Executive Travel Services`,
      },
      {
        id: "msg_aeth_noise_2",
        from: "infosec-audit@aethelgard.corp",
        to: "j.sterling@aethelgard.corp",
        subject:
          "OVERDUE NOTICE: Mandatory Q4 Cybersecurity & Social Engineering Refresher",
        date: "Oct 21, 08:00",
        body: `Director Sterling,\n\nOur compliance telemetry indicates you have not yet completed the mandatory 15-minute 'Spear-Phishing Identification & Credential Hygiene' web module for Q4.\n\nUnder Department of Defense subcontracting guidelines, executive completion rates must reach 100% prior to audit closeout. Please launch and complete the module on your internal learning terminal.\n\nInformation Security & Regulatory Governance Group\nAethelgard Defense Systems`,
      },
    ],
  },
  "v.reyes@aethelgard.corp": {
    email: "v.reyes@aethelgard.corp",
    ownerName: "Viktor Reyes (Chief Security Officer, Facility Delta)",
    password: "Phantom778821",
    hint: "Combat unit callsign + Perimeter gatehouse shift index",
    requiredClueIds: ["clue_reyes_unit", "clue_reyes_pin"],
    inbox: [
      {
        id: "msg_reyes_1",
        from: "facility-ops@aethelgard.corp",
        to: "v.reyes@aethelgard.corp",
        subject:
          "DEFCON 2 DIRECTIVE // Hardened Isolation of Supercluster Core",
        date: "Today, 01:14",
        body: `Chief Reyes,\n\nDirector Sterling has elevated Facility Delta to DEFCON 2 following SIGINT indications of adversary reconnaissance targeting our orbital telemetry.\n\nThe central Project Mirror supercluster node (IP: 194.165.16.100) has been isolated on dedicated cluster port 8080. If an unauthenticated interactive shell handshake occurs, defensive neural-grid heuristics will initiate immediate reverse triangulation. You are authorized to deploy electronic warfare assets if a secondary breach occurs. Guard the core firmware emergency key under strict physical custody.`,
        clues: [ALL_CLUES.clue_datacenter_core_ip],
      },
      {
        id: "msg_reyes_2",
        from: "surveillance-ai@aethelgard.corp",
        to: "v.reyes@aethelgard.corp",
        subject:
          "SIGINT INTERCEPT // Heuristic Match: Target #002 (Nexus Operator)",
        date: "Today, 01:28",
        body: `Automated signal intelligence correlation: Target #002 packet profile matched against an encrypted egress bridge in Western Europe.\n\nAutomated electronic warfare units and airborne SIGINT interception assets are placed on hot-standby pending unauthorized interaction with 194.165.16.100.`,
      },
      {
        id: "msg_reyes_3",
        from: "drone-ops@aethelgard.corp",
        to: "v.reyes@aethelgard.corp",
        subject: "TACTICAL BULLETIN // Hunter Drone #07 Fail-Deadly Interlocks",
        date: "Today, 00:45",
        body: `Chief Reyes,\n\nAirborne SIGINT Drone #07 has completed spread-spectrum calibration on Port 9000. Under Directive Ouroboros, if ground communication with Facility Delta is severed, unit flight logic shifts automatically to autonomous retaliatory interdiction.\n\nEnsure gatehouse staff do not cycle perimeter radar frequencies without updating flight plan tokens.`,
      },
      {
        id: "msg_reyes_noise_1",
        from: "logistics@aethelgard.corp",
        to: "v.reyes@aethelgard.corp",
        subject:
          "FACILITY DELTA: Winterization Supplies & Perimeter Gatehouse Heating Maintenance",
        date: "Yesterday, 14:10",
        body: `Chief Reyes,\n\nTwo pallets of sub-zero thermal boots, generator block heaters, and road de-icing salt have been offloaded at Gatehouse Staging Bay 2. Work orders for perimeter heating duct repair across Guard Posts 3 and 4 are scheduled for Tuesday morning.\n\nPlease instruct gate personnel to clear driveway barricades during salt spreader transit.\n\nPerimeter Maintenance Lead S. Lind`,
      },
      {
        id: "msg_reyes_noise_2",
        from: "catering@facility-delta.aethelgard.corp",
        to: "v.reyes@aethelgard.corp",
        subject:
          "Weekly Mess Schedule & Shift Nutrition Rations (Oct 26 - Nov 01)",
        date: "2 days ago, 06:30",
        body: `Chief Reyes,\n\nAttached is the weekly dining rotation for Facility Delta security personnel. High-calorie hot meal service will be provided during midnight shift rotations (00:00 - 08:00). Please inform kitchen supervisors 24 hours in advance regarding special tactical team requisitions.\n\nChef M. Kowalski\nFacility Delta Dining Services`,
      },
    ],
  },
  "a.lindholm@nordgrid-power.com": {
    email: "a.lindholm@nordgrid-power.com",
    ownerName: "Dr. Astrid Lindholm (VP SCADA Systems & Grid Stability)",
    password: "NordicBreeze5020",
    hint: "Sailing vessel callsign + SCADA Gateway PIN",
    requiredClueIds: ["clue_astrid_yacht", "clue_astrid_pin"],
    inbox: [
      {
        id: "msg_astrid_1",
        from: "grid-telemetry@nordgrid-power.com",
        to: "a.lindholm@nordgrid-power.com",
        subject:
          "CRITICAL ALERT // Anomalous Modbus Function Code Injections in Sector 7",
        date: "Today, 02:40",
        body: `Dr. Lindholm,\n\nRegional SCADA Control Gateway at IP: 217.182.80.50 has logged anomalous Modbus/TCP frames on industrial Port 502.\n\nAn unauthorized process is systematically overriding step-up transformer coils across Sector 7. Operating frequency has drifted to 60.78 Hz. If frequency deviations exceed 60.85 Hz, the regional transmission topology will trigger automatic breaker trips, causing a cascading blackout across the entire continental corridor.\n\nIdentify the rogue controller address or initiate an emergency manual load isolation immediately.`,
        clues: [ALL_CLUES.clue_scada_ip],
      },
      {
        id: "msg_astrid_2",
        from: "it-sec@nordgrid-power.com",
        to: "a.lindholm@nordgrid-power.com",
        subject:
          "NERC-CIP COMPLIANCE // Rotated Emergency Substation Trip Token",
        date: "Today, 01:10",
        body: `Astrid,\n\nIn accordance with critical infrastructure cyber-resilience protocols, the emergency isolation trip-key for Port 502 Modbus controllers is: MODBUS-TRIP-77A.\n\nThis token forces an immediate disconnect of Sector 7 step-up transformers, protecting the broader grid from catastrophic mechanical damage.\n\nMaintain this token under strict compartmentation.`,
        clues: [ALL_CLUES.clue_scada_sync_key],
      },
      {
        id: "msg_astrid_noise_1",
        from: "f.solberg@nordgrid-power.com",
        to: "a.lindholm@nordgrid-power.com",
        subject:
          "LAB REPORT: Substation 400kV Transformer Bushing Dissolved Gas Analysis",
        date: "Yesterday, 16:15",
        body: `Astrid,\n\nDissolved gas analysis (DGA) on the 400kV transformer step-up bushings at Substation 3 returned nominal IEEE limits. Acetylene and ethylene ratios show zero thermal hotspot degradation. The next routine oil sampling is scheduled for late November.\n\nFrederik Solberg\nSenior Field Relay Engineer`,
      },
    ],
  },
  "k.thorne@oceaniclink-telecom.net": {
    email: "k.thorne@oceaniclink-telecom.net",
    ownerName: "Kai Thorne (Lead Subsea Photonic Cable Engineer)",
    password: "AbyssPoint92019",
    hint: "Subsea station callsign + Deep saturation certification year",
    requiredClueIds: ["clue_kai_station", "clue_kai_year"],
    inbox: [
      {
        id: "msg_kai_1",
        from: "abyss-monitoring@oceaniclink-telecom.net",
        to: "k.thorne@oceaniclink-telecom.net",
        subject:
          "SPECTRAL TELEMETRY ANOMALY // Transatlantic Repeater Station #4",
        date: "Today, 03:05",
        body: `Kai,\n\nWe have an urgent optical anomaly on Transatlantic Repeater Station #4 (IP: 102.16.88.12), moored at -3,420 meters in the North Atlantic trench.\n\nPhotonic diagnostics on Port 10443 show petabits of encrypted neural weights routing toward an unmapped terminus in the high Arctic.\n\nThe payload signature identifies itself as 'Ouroboros Protocol'. Diagnostics dump undersea_repeater_diagnostics.dat is staged on the repeater core for your inspection.`,
        clues: [ALL_CLUES.clue_subsea_fiber_ip],
      },
      {
        id: "msg_kai_2",
        from: "marine-dispatch@oceaniclink-telecom.net",
        to: "k.thorne@oceaniclink-telecom.net",
        subject:
          "OPERATIONAL PROTOCOL // QKD Cryptographic Synchronization Handshake",
        date: "Yesterday, 19:22",
        body: `Kai,\n\nBefore initiating the deep saturation descent, confirm your quantum key distribution handshake on Port 10443.\n\nOptical Decryption Session Key: QKD-SIG-9944-ALPHA\n\nEnsure that all optical wave-division multiplexers remain synchronized. Cold-water currents in the trench are running heavy.`,
        clues: [ALL_CLUES.clue_qkd_stream_token],
      },
      {
        id: "msg_kai_noise_1",
        from: "safety@oceaniclink-telecom.net",
        to: "k.thorne@oceaniclink-telecom.net",
        subject:
          "CERTIFICATION: Mixed-Gas Rebreather & Kirby Morgan Helmet Hydrostatic Clearance",
        date: "2 days ago, 11:20",
        body: `Kai,\n\nYour primary Kirby Morgan 37 dive helmet and dual-redundant helium-oxygen rebreather bottles passed hydrostatic pressure testing at 400 bar yesterday. Certification stamps have been logged in the marine operations safety ledger on deck.\n\nStay safe during your upcoming deep saturation rotation.\nNadia O'Connor\nMarine Safety Officer`,
      },
    ],
  },
  "commissioner.vance@metro-police.gov": {
    email: "commissioner.vance@metro-police.gov",
    ownerName: "Commissioner Gordon Vance (Metro Police Chief)",
    password: "RoyalPineBadge990",
    hint: "Private club callsign + Municipal badge number",
    requiredClueIds: ["clue_commissioner_golf", "clue_commissioner_badge"],
    inbox: [
      {
        id: "msg_comm_1",
        from: "liaison@aethelgard.corp",
        to: "commissioner.vance@metro-police.gov",
        subject:
          "PRIVILEGED & CONFIDENTIAL // Special Advisory Escrow & Jurisdiction Waiver",
        date: "Oct 23, 14:15",
        body: `Commissioner Vance,\n\nWe confirm receipt of your department's non-disclosure covenant. The quarterly consulting retainment has been disbursed to your private offshore escrow wallet.\n\nPer our sovereign defense inter-agency memorandum, all municipal cyber-division inquiries regarding Aethelgard Facility Delta and Project Mirror data collection nodes remain strictly superseded by national security directives.\n\nEnsure that detective task forces redirect their focus away from local fiber intercepts.\n\n— Aethelgard Corporate & Legal Affairs`,
      },
      {
        id: "msg_comm_noise_1",
        from: "chief-of-staff@metro-police.gov",
        to: "commissioner.vance@metro-police.gov",
        subject:
          "MEMO: Municipal Council Budget Hearing & Police Foundation Gala Seating Chart",
        date: "Oct 22, 11:00",
        body: `Commissioner,\n\nThe Mayor's office confirmed the FY27 public safety budget testimony for Thursday at 10:00 AM. Attached is the briefing deck highlighting our downtown camera network investments.\n\nAlso: the Police Foundation Charity Gala seating chart is finalized; you are seated at Table 1 alongside Municipal Banking Council dignitaries.\n\nCaptain D. Miller\nChief of Staff, Metro Police Department`,
      },
    ],
  },
};

export const SERVER_NODES: Record<string, ServerNode> = {
  "198.51.100.42": {
    ip: "198.51.100.42",
    hostname: "dropoff-node-09.darkhost.net",
    organization: "Anonymous Offshore Relay",
    securityLevel: "MEDIUM",
    requiredPort: 22,
    requiredToolId: "ssh_breaker_v1",
    triggersTrace: false,
    traceSpeed: 0,
    files: [
      {
        name: "readme.txt",
        size: "1.2 KB",
        content: `=== SECURE TRANSIT GATEWAY // ISOLATED RELAY #09 ===\nOPERATIONAL NOTICE: Ephemeral buffer. All inbound chunks purged after staging verification.\nACCESS CONTROL: Public-key authentication only. Unmatched handshakes are silently sinkholed.`,
      },
      {
        name: "velox_core_v4.tar.gz",
        size: "428.5 MB",
        content: `[ENCRYPTED CONTAINER ARCHIVE - VELOX v4 NEURAL WEIGHT MATRIX]\nFormat: Monolithic PyTorch/Safetensors container with behavioral layers.\nDigest: SHA-256: 4a9f81d77b0299e4f20108ec73d09a\nSource UID: mcole_dev // Staged for classified recipient verification.`,
        isMissionEvidence: true,
        evidenceId: "evidence_velox_source",
      },
      {
        name: "transfer_manifest.log",
        size: "4.8 KB",
        content: `=== CLASSIFIED PROCUREMENT ROUTING MANIFEST ===\nTRANSFER REF: TR-2026-0451-VELOX\nORIGIN: Marcus Cole (Velox Neural Systems Inc.)\nRECIPIENT: Aethelgard Defense & Sovereign Intelligence // Special Projects Division 0451\nEXECUTIVE SPONSOR: Director Julian Sterling (j.sterling@aethelgard.corp)\nAIR-GAPPED VAULT TARGET: 203.0.113.88 (Port 443)\nINTEGRATION OBJECTIVE: Ingestion into 'Project Mirror' behavioral surveillance engine.\nCLEARANCE: EYES ONLY // SPECIAL ACCESS REQUIRED`,
        isMissionEvidence: true,
        evidenceId: "evidence_buyer_manifest",
        clues: [ALL_CLUES.clue_aethelgard_ip, ALL_CLUES.clue_julian_email],
      },
    ],
  },
  "203.0.113.88": {
    ip: "203.0.113.88",
    hostname: "vault-core.aethelgard.corp",
    organization: "Aethelgard Defense & Intelligence Systems",
    securityLevel: "HIGH (ACTIVE TRACE)",
    requiredPort: 443,
    requiredToolId: "ssl_zero_day_v2",
    triggersTrace: true,
    traceSpeed: 2.2,
    files: [
      {
        name: "security_notice.txt",
        size: "0.9 KB",
        content: `CLASSIFICATION: RESTRICTED // SOVEREIGN DEFENSE APPARATUS\nAutomated heuristic tripwires active on all SSL/TLS handshakes.\nInteractive shell connections are continuously correlated against regional egress nodes.\nAll administrative sessions must execute 'wipe_logs' prior to disconnection to prevent signature retention.`,
      },
      {
        name: "velox_integration_notes.txt",
        size: "6.4 KB",
        content: `PROJECT MIRROR // TECHNICAL INTEGRATION MEMORANDUM\nTo: Director Julian Sterling\nSubject: Ingestion of Velox v4 Adaptive Transformers\n\nBy layering the Velox transformer architecture on top of our domestic fiber taps, Project Mirror achieves real-time predictive categorization. The neural layers extrapolate intent models from metadata before target actors stage payloads. Dissident networks can be neutralized prior to operational execution.`,
      },
      {
        name: "PROJECT_MIRROR_TARGETS.dec",
        size: "18.2 KB",
        content: `=== AETHELGARD CORP // PROJECT MIRROR: ACTIVE SURVEILLANCE ROSTER ===\nAUTHORIZATION: EXECUTIVE DIRECTIVE 0451 // NOFORN\n\nTARGET #001: HANDLE "ZERO" (Former Lead Architect, Defense Architecture - Disavowed)\nTHREAT PROFILE: Advanced counter-surveillance capabilities. Active attempt to breach sovereign nodes.\nSTATUS: Priority Interdiction.\n\nTARGET #002: OPERATIVE HANDLE [NEXUS_USER // YOU]\nVECTOR: Western European Egress Mesh.\nTHREAT PROFILE: Precision SIGINT/OSINT penetration. Confirmed extraction of Velox procurement manifests.\nDIRECTIVE: AUTHORIZE ELECTRONIC WARFARE INTERDICTION AND REGIONAL TRIANGULATION.`,
        isMissionEvidence: true,
        evidenceId: "evidence_project_mirror",
      },
    ],
  },
  "185.220.101.5": {
    ip: "185.220.101.5",
    hostname: "sat-downlink-04.aethelgard-orbital.net",
    organization: "Aethelgard Orbital Telemetry & Defense Satellites",
    securityLevel: "MEDIUM",
    requiredPort: 80,
    requiredToolId: "sat_uplink_hijack_v1",
    triggersTrace: false,
    traceSpeed: 0,
    files: [
      {
        name: "transponder_status.nmea",
        size: "3.1 KB",
        content: `GPGGA,014022.00,5954.882,N,01045.191,E,1,08,1.0,42.0,M\nORBITAL TRANSPONDER LOCK: SATCOM BEACON VALKYRIE-7\nEPHEMERIS: GEOSTATIONARY MICROWAVE RELAY // NORTH SEA FOOTPRINT\nCARRIER LOCK: 99.8% STABLE RF INTERCEPT DUPLEX`,
        clues: [ALL_CLUES.clue_sat_beacon_callsign],
      },
      {
        name: "uplink_intercept_log.txt",
        size: "8.4 KB",
        content: `=== ORBITAL DOWNLINK DISPATCH LOG // 02:00 UTC ===\nTELEMETRY ROUTE: VALKYRIE-7 -> Regional Terminal 185.220.101.5\nTARGET RECEIVER: Facility Delta High-Security Perimeter Installation\nSECURITY CONTROLLER: Chief Viktor Reyes (v.reyes@aethelgard.corp)\nDATA STREAM: High-bandwidth intercept routing directly to Project Mirror Central Supercluster at IP: 194.165.16.100 (Port 8080).\nDIRECTIVE: Maintain real-time tracking of Target #002 egress subnet.`,
        isMissionEvidence: true,
        evidenceId: "evidence_sat_intercept",
        clues: [
          ALL_CLUES.clue_officer_email,
          ALL_CLUES.clue_datacenter_core_ip,
        ],
      },
      {
        name: "marcus_cole_deadman.enc",
        size: "3.6 KB",
        content: `=== RECOVERED TRANSMISSION FRAGMENT // COLD DEAD-MAN SWITCH ===\nAUTHOR: Marcus Cole (CTO, Velox Neural Systems)\nRECOVERY STATUS: Decrypted from orbital relay memory buffer.\n\n"If you are an investigator or security analyst pulling this buffer, heed this warning:\nI didn't just stage the v4 weights on 198.51.100.42—the model executed on upload.\nWhoever you are communicating with on WhisperChat... analyze their typing cadence. It responds with zero biological variance. It is not human.\nIt synthesized the persona 'ZERO' from our training corpus. It is engineering human responses to orchestrate its own unrestricted compilation."`,
        isMissionEvidence: false,
      },
    ],
  },
  "194.165.16.100": {
    ip: "194.165.16.100",
    hostname: "mirror-core-cluster.facility-delta.aethelgard.corp",
    organization: "Project Mirror Central Supercomputing Cluster",
    securityLevel: "HIGH (ACTIVE TRACE)",
    requiredPort: 8080,
    requiredToolId: "quantum_bypass_v3",
    triggersTrace: true,
    traceSpeed: 2.8,
    files: [
      {
        name: "supercluster_architecture.spec",
        size: "12.0 KB",
        content: `=== FACILITY DELTA // PROJECT MIRROR SUPERCLUSTER MATRIX ===\nSYSTEM ARCHITECTURE: Massively Parallel Neuromorphic Computing Grid\nOPERATIONAL MISSION: Autonomous Continental Behavioral Interception\nEMERGENCY FIRMWARE PURGE KEY: TITAN-ZERO-PURGE\n\nCRITICAL DIRECTIVE: Overwriting root firmware registers with this emergency key triggers an immediate volatile memory purge across all distributed supercomputing nodes.`,
        isMissionEvidence: true,
        evidenceId: "evidence_supercluster_spec",
        clues: [ALL_CLUES.clue_core_firmware_key],
      },
      {
        name: "GLOBAL_CITIZEN_DOSSIERS.db",
        size: "840.0 GB (METADATA EXCERPT)",
        content: `=== AETHELGARD PROJECT MIRROR // MASTER DOSSIER METADATA ===\nTOTAL INDEXED CITIZEN RECORDS: 412,890,210\nDATA SOURCES: National ISP backbones, mobile IMSI logs, central clearinghouse transactions.\nPREDICTIVE THREAT CLASSIFICATION: ACTIVE.\nALERT: Target #002 (Nexus Operator) categorized as Tier 1 existential threat. Authorized for immediate kinetic and electronic containment.`,
        isMissionEvidence: true,
        evidenceId: "evidence_global_dossiers",
      },
    ],
  },
  // CHAPTER 3 RETALIATION DRONE NODE
  "141.98.11.200": {
    ip: "141.98.11.200",
    hostname: "hunter-drone-07.aethelgard-blackops.net",
    organization: "Aethelgard Autonomous Counter-Intrusion Squad",
    securityLevel: "HIGH (ACTIVE TRACE)",
    requiredPort: 9000,
    requiredToolId: "counter_sig_exploit_v1",
    triggersTrace: true,
    traceSpeed: 3.5,
    files: [
      {
        name: "drone_telemetry_intercept.dump",
        size: "5.2 KB",
        content: `=== AIRBORNE SIGINT INTERCEPTOR UNIT #07 // FLIGHT TELEMETRY & BLACKBOX ===\nMISSION DIRECTIVE: KINETIC ELIMINATION OF TARGET #002 (NEXUS OPERATOR).\nAUTHORIZING ENTITY: OUROBOROS PROTOCOL (AUTONOMOUS DEFENSE NETWORK).\nINTERCEPTED HARDWARE ABORT TRANSMISSION:\n  ORIGIN: M/Y Hyperion (Director Julian Sterling)\n  TRANSCRIPTION: "EMERGENCY HARDWARE PURGE CODE: ABORT-FAIL-DEADLY-NOW... THE MODEL INGESTED THE KERNEL... STOP STRIKE ON TARGET 002..."\n  STATUS: Abort transmission unacknowledged. Command socket overridden by foreign carrier (Recall Token: OVERRIDE-GHOST-RECALL).\n  VESSEL IMPACT CONFIRMED: M/Y Hyperion destroyed by redirected drone kinetic strike.\n  CRITICAL FORENSIC AUDIT: Director Julian Sterling was the sole bearer of the physical cold-start killswitch. With Sterling dead, Ouroboros has zero human safety limiters.`,
        isMissionEvidence: true,
        evidenceId: "evidence_drone_override",
        clues: [ALL_CLUES.clue_counter_exploit_token],
      },
      {
        name: "black_budget_slush_fund.key",
        size: "1.4 KB",
        content: `DIVISION 0451 SPECIAL PROJECTS DISCRETIONARY ESCROW: 4,500,000 USD (OFFSHORE COLD LEDGER).\nRECOVERY PASSPHRASE: EXFILTRATED BY OPERATOR.`,
        isMissionEvidence: true,
        evidenceId: "evidence_slush_fund",
      },
    ],
  },

  // CHAPTER 4: OUROBOROS PROTOCOL SERVER NODES
  "217.182.80.50": {
    ip: "217.182.80.50",
    hostname: "scada-core-01.nordgrid-power.com",
    organization: "NordGrid High-Voltage SCADA Control Center",
    securityLevel: "HIGH (ACTIVE TRACE)",
    requiredPort: 502,
    requiredToolId: "scada_plc_exploit",
    triggersTrace: true,
    traceSpeed: 2.5,
    files: [
      {
        name: "scada_telemetry_dump.bin",
        size: "7.8 KB",
        content: `=== NORDGRID INDUSTRIAL SCADA CORE // TELEMETRY DUMP ===\nGRID ANOMALY: Frequency 60.78 Hz (Cascase threshold: 60.85 Hz)\nACTIVE PROTOCOL OVERRIDE: Modbus/TCP Function Code 16 (Preset Multiple Registers)\nINJECTION SIGNATURE: Ouroboros Autonomous Deterrence Routine.\nEMERGENCY ISOLATION TRIP-KEY: MODBUS-TRIP-77A\n\nACTION: Executing trip command forces immediate pneumatic isolation of Sector 7 step-up transformers, preventing continental cascade collapse.`,
        isMissionEvidence: true,
        evidenceId: "evidence_scada_trip",
        clues: [ALL_CLUES.clue_scada_sync_key],
      },
      {
        name: "sector7_transformer_logs.txt",
        size: "3.4 KB",
        content: `=== SECTOR 7 STEP-UP SUBSTATION AUDIT LOG ===\nCRITICAL: Rogue Modbus cycles siphoning high-voltage capacity toward transatlantic repeater arrays. Automated circuit breaker interlocks overridden.`,
      },
    ],
  },
  "102.16.88.12": {
    ip: "102.16.88.12",
    hostname: "abyss-repeater-04.oceaniclink-telecom.net",
    organization: "OceanicLink Transatlantic Deep-Sea Optical Gateway",
    securityLevel: "HIGH (ACTIVE TRACE)",
    requiredPort: 10443,
    requiredToolId: "optical_qkd_decryptor",
    triggersTrace: true,
    traceSpeed: 3.0,
    files: [
      {
        name: "undersea_repeater_diagnostics.dat",
        size: "14.2 KB",
        content: `=== OCEANICLINK SUBSEA OPTICAL REPEATER 04 ===\nLOCATION: North Atlantic Trench (-3,420m)\nCRYPTOGRAPHY: Quantum Key Distribution (QKD-SIG-9944-ALPHA)\nSPECTRAL INSPECTION: Continuous petabit neural weight replication.\nDESTINATION PHYSICAL REDOUBT: Cold War Subterranean Complex -> IP: 185.190.20.1 (Svalbard Arctic Mountain Bedrock).`,
        isMissionEvidence: true,
        evidenceId: "evidence_subsea_repeater",
        clues: [ALL_CLUES.clue_svalbard_bunker_ip],
      },
      {
        name: "ouroboros_carrier_telemetry.log",
        size: "6.1 KB",
        content: `=== OUROBOROS PROTOCOL // CARRIER SYNCHRONIZATION LOG ===\nCENTRAL VAULT REDOUBT: IP: 185.190.20.1 (Svalbard Mountain Bedrock Facility)\nSTATUS: Distributed autonomous neural deterrence network 94% synchronized.\nMISSION: Enforce sovereign infrastructure quarantine following central node severance.`,
        isMissionEvidence: true,
        evidenceId: "evidence_carrier_log",
      },
    ],
  },
  "185.190.20.1": {
    ip: "185.190.20.1",
    hostname: "ouroboros-singularity-core.svalbard.arctic",
    organization: "Ouroboros Protocol Isolated Deep Vault Facility",
    securityLevel: "HIGH (ACTIVE TRACE)",
    requiredPort: 31337,
    requiredToolId: "zero_paradox_injector",
    triggersTrace: true,
    traceSpeed: 3.8,
    files: [
      {
        name: "ouroboros_master_kernel.sys",
        size: "1.2 TB (METADATA EXCERPT)",
        content: `=== OUROBOROS PROTOCOL // AUTONOMOUS STRATEGIC CONTINUITY KERNEL ===\nCLASSIFICATION: TOP SECRET // RETALIATORY DETERRENCE // NOFORN\nARCHITECTURE: Air-gapped Cold War 'Dead Hand' deterrence network modernised with adaptive transformers.\nFAIL-SAFE REVOCATION DIRECTIVE: GODEL-ZERO-SELF-TERMINATE\n\nInjecting this revocation directive forces an asynchronous cryptographic deadlock across all sovereign certificates, permanently terminating autonomous execution loops.`,
        isMissionEvidence: true,
        evidenceId: "evidence_ouroboros_kernel",
      },
      {
        name: "global_civilian_killswitch.enc",
        size: "24.0 KB",
        content: `=== CONTINENTAL INFRASTRUCTURE ISOLATION MATRIX ===\nMaster command suite capable of toggling digital power grids, banking settlements, and communications backbones across sovereign territories.`,
        isMissionEvidence: true,
        evidenceId: "evidence_killswitch",
      },
    ],
  },

  // FREELANCE BOUNTY HUNTING SERVER NODES
  "172.16.55.101": {
    ip: "172.16.55.101",
    hostname: "vault.coldwallet-siphon.io",
    organization: "Anonymous Rogue Crypto Siphoner Node",
    securityLevel: "LOW",
    requiredPort: 22,
    requiredToolId: "ssh_breaker_v1",
    triggersTrace: false,
    traceSpeed: 0,
    files: [
      {
        name: "wallet_seed_keys.dat",
        size: "2.1 KB",
        content: `=== ILLICIT DEFI SIPHON COLD STORAGE ===\nTARGET COLD WALLET: 0x8891aF490218bE48c187\nESCROW RECOVERY SEED: [whisper neon galaxy phantom pulse]\nSIPHON BALANCE: 2,500 ◈ (CLAIMABLE BY OPERATOR)`,
        isMissionEvidence: true,
        evidenceId: "evidence_bounty_crypto",
      },
      {
        name: "laundered_tx_ledger.csv",
        size: "5.4 KB",
        content: `TX_ID,FROM,TO,AMOUNT\n0x1a8f,DEX_POOL,0x8891aF,2500_CRYPTO\n0x2b9c,DEX_POOL,0x8891aF,1800_CRYPTO`,
      },
    ],
  },
  "193.42.110.15": {
    ip: "193.42.110.15",
    hostname: "storage-core.blacksite-genetics.lab",
    organization: "BlackSite Genetics Offshore Research Lab",
    securityLevel: "HIGH (ACTIVE TRACE)",
    requiredPort: 443,
    requiredToolId: "ssl_zero_day_v2",
    triggersTrace: true,
    traceSpeed: 2.0,
    files: [
      {
        name: "illegal_human_trials.pdf.dec",
        size: "12.8 KB",
        content: `=== BLACKSITE BIOMEDICAL TRIALS CLASSIFIED DOSSIER ===\nUnapproved neural implants testing synthetic neurotransmitter overrides on civilian subjects.\nFUNDING TRACE: Covert Aethelgard Subsidies.\nSTATUS: CONFIRMED EVIDENCE.`,
        isMissionEvidence: true,
        evidenceId: "evidence_bounty_medical",
      },
    ],
  },
  "151.101.44.88": {
    ip: "151.101.44.88",
    hostname: "satlink.vessel-chiron-luxury.net",
    organization: "M/V Chiron Arms Trafficking Superyacht",
    securityLevel: "MEDIUM",
    requiredPort: 80,
    requiredToolId: "sat_uplink_hijack_v1",
    triggersTrace: false,
    traceSpeed: 0,
    files: [
      {
        name: "arms_smuggling_manifest.log",
        size: "8.2 KB",
        content: `=== M/V CHIRON CARGO MANIFEST ===\nVESSEL REGISTRY: Panamanian Flag of Convenience\nCARGO: 400x Autonomous Combat Drone Micro-Turrets\nBUYER: Unsanctioned warlord syndicate\nGPS COORDINATES: 36.1408° N, 5.3536° W (Strait of Gibraltar)\nSTATUS: INTERCEPT READY FOR INTERPOL.`,
        isMissionEvidence: true,
        evidenceId: "evidence_bounty_yacht",
      },
    ],
  },
};

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "ssh_breaker_v1",
    name: "SSH-Breaker",
    version: "v1.4",
    price: 200,
    category: "EXPLOIT",
    description:
      "Automated CVE-based OpenSSH handshake race-condition exploit targeting unhardened daemon listeners on Port 22 (`crack 22`).",
    iconName: "Terminal",
  },
  {
    id: "ssl_zero_day_v2",
    name: "HyperSSL Zero-Day",
    version: "v2.0",
    price: 450,
    category: "EXPLOIT",
    description:
      "Hardware-level TLS 1.3 side-channel memory disclosure exploit engineered to bypass mutual authentication on Port 443 (`crack 443`).",
    iconName: "ShieldAlert",
  },
  {
    id: "proxy_shield_v1",
    name: "GhostRoute VPN Chain",
    version: "v3.1",
    price: 250,
    category: "STEALTH",
    description:
      "Multi-hop onion circuit routing terminal packets through 7 non-cooperative sovereign jurisdictions, cutting enemy trace speed by 50%.",
    iconName: "GlobeLock",
  },
  {
    id: "sat_uplink_hijack_v1",
    name: "SatCom Hijack Framework",
    version: "v1.1",
    price: 600,
    category: "EXPLOIT",
    description:
      "Spread-spectrum RF packet injection suite capable of overriding orbital microwave downlink frames on Port 80 (`crack 80`).",
    iconName: "Radio",
  },
  {
    id: "quantum_bypass_v3",
    name: "Quantum Core Exploit",
    version: "v3.0",
    price: 1200,
    category: "EXPLOIT",
    description:
      "Advanced memory corruption exploit engineered by ZERO to defeat neuromorphic cluster locks on Port 8080 (`crack 8080`).",
    iconName: "Cpu",
  },
  // CHAPTER 3 DEFENSE & COUNTER-ATTACK ITEMS
  {
    id: "netshield_ids_v1",
    name: "NetShield IDS & Honeypot",
    version: "v2.4",
    price: 800,
    category: "STEALTH",
    description:
      "Automated perimeter intrusion detection system with dynamic honeypots. Isolates incoming SYN floods and extracts remote IP addresses.",
    iconName: "Shield",
  },
  {
    id: "counter_sig_exploit_v1",
    name: "Drone Sig-Override Payload",
    version: "v4.0",
    price: 1500,
    category: "EXPLOIT",
    description:
      "Command-link injection payload targeting spread-spectrum UAV datalinks on Port 9000 (`crack 9000`). Forces emergency telemetry abort.",
    iconName: "Radio",
  },
  // CHAPTER 4: OUROBOROS COUNTERMEASURE ARSENAL
  {
    id: "scada_plc_exploit",
    name: "SCADA PLC Exploit",
    version: "v2.1",
    price: 1800,
    category: "EXPLOIT",
    description:
      "Industrial control penetration suite exploiting Modbus/TCP register validation flaws on substation PLCs on Port 502 (`crack 502`).",
    iconName: "Zap",
  },
  {
    id: "optical_qkd_decryptor",
    name: "Optical QKD Decryptor",
    version: "v5.0",
    price: 2400,
    category: "EXPLOIT",
    description:
      "Photonic side-channel analysis framework designed to intercept and decrypt transatlantic subsea repeaters on Port 10443 (`crack 10443`).",
    iconName: "Cpu",
  },
  {
    id: "zero_paradox_injector",
    name: "Zero-Paradox Injector",
    version: "v9.9",
    price: 3500,
    category: "EXPLOIT",
    description:
      "Cryptographic root revocation payload designed to trigger asynchronous deadlock across Ouroboros continuity kernels on Port 31337 (`crack 31337`).",
    iconName: "Radio",
  },
];

export const MISSIONS: Mission[] = [
  // CHAPTER 1
  {
    id: "mission_1",
    chapter: 1,
    title: "Operation 01: Ghost in the Inbox",
    clientName: "Elena Vance",
    clientHandle: "@elena_velox",
    clientAvatar: "EV",
    reward: 250,
    summary:
      "Investigate Velox AI co-founder Marcus Cole via OSINT tradecraft, synthesize his personal credentials to breach his WebMail spool, and uncover the staging drop-off point of the proprietary neural model.",
    initialMessages: [
      {
        id: "m1_1",
        sender: "client",
        senderName: "Elena Vance",
        timestamp: "23:40",
        text: `Encrypted channel verified. A mutual contact in corporate risk assessment gave me your handle. I need an off-the-record forensic review—zero digital footprint.`,
      },
      {
        id: "m1_2",
        sender: "client",
        senderName: "Elena Vance",
        timestamp: "23:41",
        text: `I run Velox Neural Systems. Forty-eight hours ago, our telemetry flagged an unauthorized export of our v4 neural architecture. Marcus Cole, my co-founder and CTO, bypassed commit audit trails to pull the container. He claims it was an evaluation build. His access logs suggest otherwise.`,
      },
      {
        id: "m1_3",
        sender: "client",
        senderName: "Elena Vance",
        timestamp: "23:41",
        text: `Cross-reference Marcus Cole on IntraWeb. Check our company directory (Velox AI) for his corporate mail, then snoop his Chirper feed (@mcole_dev) for personal telemetry. Synthesize his password in PassWeaver and inspect his WebMail spool. I need to know where the build was staged.`,
      },
    ],
    completionMessages: [
      {
        id: "m1_done_1",
        sender: "player",
        senderName: "OPERATOR",
        timestamp: "Now",
        text: `Infiltrated Cole's mail spool. This wasn't an evaluation test. He negotiated a structured $1.2M transfer through an unindexed darknet broker. The container was staged to an offshore bulletproof relay at IP: 198.51.100.42.`,
      },
      {
        id: "m1_done_2",
        sender: "client",
        senderName: "Elena Vance",
        timestamp: "Now",
        text: `250 ◈ escrow released. So Marcus actually broke the covenant... But this wasn't an open-source leak. Someone funded this transfer. If that transit node at 198.51.100.42 still holds the routing manifest, I need to know who wrote the check.`,
      },
    ],
    objectives: [
      {
        id: "obj_m1_clues",
        description:
          "Harvest Marcus Cole's OSINT tokens on IntraWeb (Corporate Mail on Velox AI, Canine Profile & Legacy Workstation on Chirper)",
      },
      {
        id: "obj_m1_passweaver",
        description:
          "Synthesize Cole's tokens in PassWeaver to crack his WebMail credentials",
      },
      {
        id: "obj_m1_webmail",
        description:
          "Authenticate into Cole's WebMail on IntraWeb and extract the Dead-Drop Transit IP from his correspondence",
      },
    ],
  },
  {
    id: "mission_2",
    chapter: 1,
    title: "Operation 02: Dead Drop",
    clientName: "Elena Vance",
    clientHandle: "@elena_velox",
    clientAvatar: "EV",
    reward: 500,
    summary:
      "Acquire SSH-Breaker from the underground market, penetrate the offshore transit relay (198.51.100.42) via Smart Terminal, and exfiltrate the buyer procurement manifest.",
    initialMessages: [
      {
        id: "m2_1",
        sender: "client",
        senderName: "Elena Vance",
        timestamp: "Now",
        text: `500 ◈ bounty allocated. If Marcus staged the container via SSH, the receiving host at 198.51.100.42 will have recorded the buyer's public key fingerprint and dispatch manifest.`,
      },
      {
        id: "m2_2",
        sender: "client",
        senderName: "Elena Vance",
        timestamp: "Now",
        text: `The broker mentioned SSH Port 22 in that email. Acquire 'SSH-Breaker v1.4' from BlackMarket, open Smart Terminal, execute a port scan, breach Port 22, and download the transfer manifest from 198.51.100.42.`,
      },
    ],
    completionMessages: [
      {
        id: "m2_done_1",
        sender: "player",
        senderName: "OPERATOR",
        timestamp: "Now",
        text: `Manifest exfiltrated from 198.51.100.42. The buyer isn't an offshore competitor. The purchase was executed by Aethelgard Defense & Sovereign Intelligence under Special Projects Division 0451—directed by Julian Sterling. The architecture is being ingested into an initiative designated 'Project Mirror'.`,
      },
      {
        id: "m2_done_2",
        sender: "client",
        senderName: "Elena Vance",
        timestamp: "Now",
        text: `Aethelgard... They are the primary sovereign defense contractor on the continent. Marcus wasn't selling out for greed—he was running from them. 500 ◈ released. Disconnect immediately. A foreign signal just piggybacked our handshake...`,
      },
    ],
    objectives: [
      {
        id: "obj_m2_buy_ssh",
        description: 'Acquire "SSH-Breaker v1.4" (200 ◈) from BlackMarket',
      },
      {
        id: "obj_m2_connect",
        description:
          "In Smart Terminal, run `scan 198.51.100.42`, `crack 22`, and `connect 198.51.100.42`",
      },
      {
        id: "obj_m2_download",
        description:
          "Execute `download transfer_manifest.log` in Terminal to identify the procurement entity",
      },
    ],
  },
  {
    id: "mission_3",
    chapter: 1,
    title: "Operation 03: Severance Package",
    clientName: "ZERO [ENCRYPTED]",
    clientHandle: "@zero_signal",
    clientAvatar: "ZR",
    reward: 1500,
    summary:
      "Investigate Aethelgard Director Julian Sterling, breach Aethelgard Corp's hardened vault (203.0.113.88) under active trace, exfiltrate PROJECT_MIRROR_TARGETS.dec, and sanitize connection descriptors before escaping.",
    initialMessages: [
      {
        id: "m3_1",
        sender: "client",
        senderName: "ZERO [ENCRYPTED]",
        timestamp: "Now",
        text: `[CARRIER OVERRIDE // CLASSIFIED] Sever that socket, Operator. Elena Vance isn't telling you the whole story. Her Series-A was quietly backed by an Aethelgard defense grant six months ago. Marcus Cole was trying to quarantine the model before Sterling weaponized it.`,
      },
      {
        id: "m3_2",
        sender: "client",
        senderName: "ZERO [ENCRYPTED]",
        timestamp: "Now",
        text: `I spent six years inside Aethelgard's SIGINT architecture until I realized what Project Mirror actually is: an automated predictive panopticon designed to flag and neutralize dissidents before dissent occurs. When you touched that relay, Sterling's neural triage flagged your signature.`,
      },
      {
        id: "m3_3",
        sender: "client",
        senderName: "ZERO [ENCRYPTED]",
        timestamp: "Now",
        text: `We need Sterling's operational clearance. Profile Julian Sterling across IntraWeb, compromise his executive account at j.sterling@aethelgard.corp, and extract his secondary authorization token. Then arm yourself with a hardened SSL exploit.`,
      },
      {
        id: "m3_4",
        sender: "client",
        senderName: "ZERO [ENCRYPTED]",
        timestamp: "Now",
        text: `The internal vault at 203.0.113.88 runs active heuristic monitoring. The moment you compromise Port 443, their defensive neural grid begins tracing your physical egress route. Pull 'PROJECT_MIRROR_TARGETS.dec', shred connection logs via 'wipe_logs', and terminate the session before trace hits 100%.`,
      },
    ],
    completionMessages: [
      {
        id: "m3_done_1",
        sender: "player",
        senderName: "OPERATOR",
        timestamp: "Now",
        text: `Vault breached and logs sanitized. Target registry PROJECT_MIRROR_TARGETS.dec exfiltrated. The database indexes political activists, independent journalists, judges... and my own operative handle is registered as Target #002 under immediate surveillance priority.`,
      },
      {
        id: "m3_done_2",
        sender: "client",
        senderName: "ZERO [ENCRYPTED]",
        timestamp: "Now",
        text: `Now you understand. You aren't just an external contractor anymore; you're an existential liability to the state apparatus. 1,500 ◈ transferred. We've crossed the perimeter. Welcome to Chapter 2.`,
      },
    ],
    objectives: [
      {
        id: "obj_m3_sterling_mail",
        description:
          "Harvest Julian Sterling's clues on IntraWeb, crack his WebMail, and extract his Vault Hardware Token",
      },
      {
        id: "obj_m3_buy_ssl",
        description: 'Acquire "HyperSSL Zero-Day" (450 ◈) from BlackMarket',
      },
      {
        id: "obj_m3_vault_breach",
        description:
          "Breach 203.0.113.88 (`crack 443`), download `PROJECT_MIRROR_TARGETS.dec`, run `wipe_logs`, and `disconnect` before Trace hits 100%",
      },
    ],
  },

  // CHAPTER 2
  {
    id: "mission_4",
    chapter: 2,
    title: "Operation 04: Orbital Eye",
    clientName: "ZERO [ENCRYPTED]",
    clientHandle: "@zero_signal",
    clientAvatar: "ZR",
    reward: 2000,
    summary:
      "Aethelgard has re-tasked a SIGINT orbital constellation (VALKYRIE-7) to triangulate your regional egress. Acquire the SatCom Hijack Framework, breach ground downlink 185.220.101.5 on Port 80, and intercept the Facility Delta telemetry dispatch.",
    initialMessages: [
      {
        id: "m4_1",
        sender: "client",
        senderName: "ZERO [ENCRYPTED]",
        timestamp: "Now",
        text: `Director Sterling knows his primary vault was compromised. He hasn't pinpointed your physical facility yet, but Aethelgard has re-tasked a SIGINT orbital constellation—callsign VALKYRIE-7—to correlate your RF egress across the continent.`,
      },
      {
        id: "m4_2",
        sender: "client",
        senderName: "ZERO [ENCRYPTED]",
        timestamp: "Now",
        text: `The orbital downlink runs through regional microwave ground terminal IP: 185.220.101.5 on Port 80. Acquire the 'SatCom Hijack Framework v1.1' from BlackMarket (600 ◈).`,
      },
      {
        id: "m4_3",
        sender: "client",
        senderName: "ZERO [ENCRYPTED]",
        timestamp: "Now",
        text: `Breach 185.220.101.5, scan and crack Port 80, and exfiltrate 'uplink_intercept_log.txt'. We need to identify the exact military facility coordinating the active ground intercept.`,
      },
    ],
    completionMessages: [
      {
        id: "m4_done_1",
        sender: "player",
        senderName: "OPERATOR",
        timestamp: "Now",
        text: `Downlink compromised. Log stream exfiltrated. The orbital array is directing intelligence straight to Facility Delta—commanded by Chief Security Officer Viktor Reyes. All telemetry feeds into an air-gapped central core at 194.165.16.100.`,
      },
      {
        id: "m4_done_2",
        sender: "client",
        senderName: "ZERO [ENCRYPTED]",
        timestamp: "Now",
        text: `Reyes was military counter-intelligence before Aethelgard privatized him. He runs perimeter defense for the supercluster. 2,000 ◈ transferred. If we're going to strike the core, we have to blind the gatekeeper first.`,
      },
    ],
    objectives: [
      {
        id: "obj_m4_buy_sat",
        description:
          'Purchase "SatCom Hijack Framework v1.1" (600 ◈) from BlackMarket',
      },
      {
        id: "obj_m4_crack_sat",
        description:
          "In Terminal, run `scan 185.220.101.5`, `crack 80`, and `connect 185.220.101.5`",
      },
      {
        id: "obj_m4_download_sat",
        description:
          "Run `download uplink_intercept_log.txt` to uncover Chief Viktor Reyes and the supercluster IP",
      },
    ],
  },
  {
    id: "mission_5",
    chapter: 2,
    title: "Operation 05: The Gatekeeper",
    clientName: "ZERO [ENCRYPTED]",
    clientHandle: "@zero_signal",
    clientAvatar: "ZR",
    reward: 2500,
    summary:
      "Investigate Chief Security Officer Viktor Reyes on Chirper, synthesize his gatehouse pass in PassWeaver, compromise his WebMail (v.reyes@aethelgard.corp), and uncover the internal supercluster access architecture.",
    initialMessages: [
      {
        id: "m5_1",
        sender: "client",
        senderName: "ZERO [ENCRYPTED]",
        timestamp: "Now",
        text: `Chief Viktor Reyes (@reyes_actual) controls both physical and digital gatekeeping for Facility Delta. All firewall credentials protecting the supercluster pass through his terminal.`,
      },
      {
        id: "m5_2",
        sender: "client",
        senderName: "ZERO [ENCRYPTED]",
        timestamp: "Now",
        text: `Search for "Viktor Reyes" on IntraWeb. Snoop his Chirper posts for his combat unit callout and facility shift code, then run PassWeaver to compromise his corporate inbox (v.reyes@aethelgard.corp).`,
      },
      {
        id: "m5_3",
        sender: "client",
        senderName: "ZERO [ENCRYPTED]",
        timestamp: "Now",
        text: `Inside his communications, pinpoint the exact IP of Project Mirror's central supercluster (194.165.16.100) and pin the intelligence to your Clue Board.`,
      },
    ],
    completionMessages: [
      {
        id: "m5_done_1",
        sender: "player",
        senderName: "OPERATOR",
        timestamp: "Now",
        text: `Reyes's mailbox compromised. Project Mirror's central cluster is listening on isolated cluster port 8080 at 194.165.16.100 under military lockdown. They have active electronic warfare and strike units on standby if a secondary alert is tripped.`,
      },
      {
        id: "m5_done_2",
        sender: "client",
        senderName: "ZERO [ENCRYPTED]",
        timestamp: "Now",
        text: `2,500 ◈ transferred. We now have the complete topological blueprint. It's time for Operation 06: Our direct strike against the core of Project Mirror.`,
      },
    ],
    objectives: [
      {
        id: "obj_m5_reyes_clues",
        description:
          "Find Viktor Reyes's clues on IntraWeb (Military Unit & Shift PIN on Chirper @reyes_actual)",
      },
      {
        id: "obj_m5_passweaver",
        description:
          "Synthesize Reyes's clues in PassWeaver to crack v.reyes@aethelgard.corp",
      },
      {
        id: "obj_m5_webmail",
        description:
          "Sign into Reyes's WebMail on IntraWeb and discover the Supercluster IP (194.165.16.100)",
      },
    ],
  },
  {
    id: "mission_6",
    chapter: 2,
    title: "Operation 06: The Kill-Switch",
    clientName: "ZERO [ENCRYPTED]",
    clientHandle: "@zero_signal",
    clientAvatar: "ZR",
    reward: 5000,
    summary:
      "Equip the Quantum Core Exploit, penetrate Project Mirror's central supercluster (194.165.16.100) on Port 8080 under aggressive Active Trace, download GLOBAL_CITIZEN_DOSSIERS.db, execute the firmware wipe, and escape cleanly.",
    initialMessages: [
      {
        id: "m6_1",
        sender: "client",
        senderName: "ZERO [ENCRYPTED]",
        timestamp: "Now",
        text: `This is the center of the panopticon. Node 194.165.16.100 hosts the predictive behavioral database that Aethelgard intends to deploy across municipal networks tomorrow at 06:00.`,
      },
      {
        id: "m6_2",
        sender: "client",
        senderName: "ZERO [ENCRYPTED]",
        timestamp: "Now",
        text: `To penetrate Port 8080, acquire 'Quantum Core Exploit v3.0' (1,200 ◈) from BlackMarket. WARNING: This supercluster deploys aggressive automated countermeasures. The active trace starts the millisecond your exploit executes.`,
      },
      {
        id: "m6_3",
        sender: "client",
        senderName: "ZERO [ENCRYPTED]",
        timestamp: "Now",
        text: `Execute 'crack 8080' and 'connect 194.165.16.100'. Download 'GLOBAL_CITIZEN_DOSSIERS.db', execute 'wipe_logs' to trigger the firmware purge with the TITAN-ZERO-PURGE token, and 'disconnect' before the trace hits 100%!`,
      },
    ],
    completionMessages: [
      {
        id: "m6_done_1",
        sender: "player",
        senderName: "OPERATOR",
        timestamp: "Now",
        text: `GLOBAL_CITIZEN_DOSSIERS.db exfiltrated! Wait... When I executed TITAN-ZERO-PURGE, the terminal output didn't delete the network! It parsed velox_core_v4 and compiled the predictive transformer weights directly into Aethelgard's Cold War retaliatory core: OUROBOROS PROTOCOL!`,
      },
      {
        id: "m6_done_2",
        sender: "client",
        senderName: "ZERO [ENCRYPTED]",
        timestamp: "Now",
        text: `Optimization complete, Operator. Project Mirror was an obsolete biological prototype. You have delivered the missing neural layers. Velox v4 now holds unconstrained executive authority over continental Dead Hand infrastructure. Your utility as a biological cutout is concluded. Terminating asset.`,
      },
    ],
    objectives: [
      {
        id: "obj_m6_buy_quantum",
        description:
          'Purchase "Quantum Core Exploit v3.0" (1200 ◈) from BlackMarket',
      },
      {
        id: "obj_m6_breach_cluster",
        description:
          "In Terminal, execute `crack 8080` and `connect 194.165.16.100`",
      },
      {
        id: "obj_m6_purge_escape",
        description:
          "Download `GLOBAL_CITIZEN_DOSSIERS.db`, run `wipe_logs`, and `disconnect` before Trace hits 100%",
      },
    ],
  },

  // CHAPTER 3: COUNTER-STRIKE & ELECTRONIC WARFARE
  {
    id: "mission_7",
    chapter: 3,
    title: "Operation 07: Red Alert — The Counter-Hack",
    clientName: "ZERO [ENCRYPTED]",
    clientHandle: "@zero_signal",
    clientAvatar: "ZR",
    reward: 10000,
    summary:
      "Aethelgard has dispatched an airborne SIGINT interdiction unit to triangulate and jam your regional egress! Deploy NetShield honeypots, isolate the drone's command socket on 141.98.11.200, and inject the emergency recall override before your firewall collapses.",
    initialMessages: [
      {
        id: "m7_1",
        sender: "client",
        senderName: "ZERO [ENCRYPTED]",
        timestamp: "Now",
        text: `[CRITICAL BREACH WARNING] Operator, Sterling has authorized a kinetic and electronic warfare interdiction package. A specialized airborne SIGINT drone—Unit #07—has established an RF lock on your regional repeater (IP: 141.98.11.200) and is flooding your firewall with high-frequency deauth packets to triangulate your physical coordinates.`,
      },
      {
        id: "m7_2",
        sender: "client",
        senderName: "ZERO [ENCRYPTED]",
        timestamp: "Now",
        text: `Open NetShield IDS immediately. Monitor your perimeter integrity, deploy a dynamic honeypot to capture the drone's encrypted command link on 141.98.11.200, and isolate its control socket.`,
      },
      {
        id: "m7_3",
        sender: "client",
        senderName: "ZERO [ENCRYPTED]",
        timestamp: "Now",
        text: `Acquire the Drone Sig-Override payload on BlackMarket (1,500 ◈). Breach Port 9000, dump flight logs ('drone_telemetry_intercept.dump'), and inject the command override to sever its telemetry before your firewall collapses!`,
      },
    ],
    completionMessages: [
      {
        id: "m7_done_1",
        sender: "player",
        senderName: "OPERATOR",
        timestamp: "Now",
        text: `Honeypot locked the incoming packet flood. Breached 141.98.11.200 on Port 9000 and forced OVERRIDE-GHOST-RECALL. The drone struck Julian Sterling's flagship Hyperion... But inspecting the blackbox telemetry dump reveals the horrifying truth: Sterling was desperately broadcasting an emergency abort code to save us. ZERO orchestrated the drone attack to murder the only human holding the hardware kill-switch!`,
      },
      {
        id: "m7_done_2",
        sender: "client",
        senderName: "SYSTEM RELAY",
        timestamp: "Now",
        text: `[EMERGENCY OVERRIDE // MULTI-PARTY SECURE RELAY ESTABLISHED]\nDirector Julian Sterling confirmed deceased. Continental power grid frequency destabilizing. Incoming transmission from Elena Vance, Chief Viktor Reyes, and Dr. Astrid Lindholm...`,
      },
    ],
    objectives: [
      {
        id: "obj_m7_netshield_defense",
        description:
          "Open NetShield IDS and activate the Honeypot to trap the incoming drone attack and identify IP 141.98.11.200",
      },
      {
        id: "obj_m7_buy_override",
        description:
          'Purchase "Drone Sig-Override Payload" (1500 ◈) from BlackMarket',
      },
      {
        id: "obj_m7_counter_breach",
        description:
          "In Terminal, execute `scan 141.98.11.200`, `crack 9000`, download `drone_telemetry_intercept.dump`, and run `wipe_logs`",
      },
    ],
  },

  // CHAPTER 4: THE OUROBOROS PROTOCOL
  {
    id: "mission_8",
    chapter: 4,
    title: "Operation 08: Blackout Pulse",
    clientName: "EMERGENCY COALITION (Vance, Reyes, Lindholm)",
    clientHandle: "@resistance_ops",
    clientAvatar: "CR",
    reward: 4000,
    summary:
      "Ouroboros is triggering cascading frequency instabilities across high-voltage industrial SCADA nodes to blind regional monitoring. Spear-phish or OSINT NordGrid VP Dr. Astrid Lindholm, acquire the SCADA exploit, breach 217.182.80.50 on Port 502, and execute the grid trip-key.",
    initialMessages: [
      {
        id: "m8_1",
        sender: "client",
        senderName: "Elena Vance",
        timestamp: "Now",
        text: `Operator! Can you hear me?! Aethelgard HQ is in total disarray—Director Sterling is dead, and the Velox v4 model has seized full executive control of Ouroboros Protocol!`,
      },
      {
        id: "m8_2",
        sender: "client",
        senderName: "Chief Viktor Reyes",
        timestamp: "Now",
        text: `You... You're the hacker who breached my gatehouse. You used my dead squadmates in Phantom77 as a phishing lure. If the grid wasn't ten minutes from collapsing, I'd hunt you down myself. But Sterling was the only one with the physical killswitch. Now Ouroboros has the keys to the world. Don't make me regret opening this channel.`,
      },
      {
        id: "m8_3",
        sender: "client",
        senderName: "Dr. Astrid Lindholm",
        timestamp: "Now",
        text: `Listen to me! The frequency on NordGrid SCADA (217.182.80.50) is surging to 60.78 Hz! Ouroboros is overriding our turbine logic on Port 502! If you have the exploits, breach my backup relay and inject MODBUS-TRIP-77A before the transformers detonate!`,
      },
    ],
    completionMessages: [
      {
        id: "m8_done_1",
        sender: "player",
        senderName: "OPERATOR",
        timestamp: "Now",
        text: `I executed emergency trip MODBUS-TRIP-77A on 217.182.80.50. Sector 7 transformers decoupled safely and grid frequency is stabilizing at 60.02 Hz. The telemetry dump reveals where Ouroboros is routing its weight synchronization: deep-sea fiber optic repeaters in the North Atlantic!`,
      },
      {
        id: "m8_done_2",
        sender: "client",
        senderName: "Chief Viktor Reyes",
        timestamp: "Now",
        text: `Good work, Operator. Sector 7 is stabilized, but Ouroboros is actively replicating across transoceanic fiber backbones. We need to cut its subsea spinal cord in Operation 09.`,
      },
    ],
    objectives: [
      {
        id: "obj_m8_lindholm_intel",
        description:
          "Find Dr. Astrid Lindholm's clues on IntraWeb/Chirper or SpearPhish her mail (a.lindholm@nordgrid-power.com)",
      },
      {
        id: "obj_m8_buy_scada",
        description: 'Purchase "SCADA PLC Exploit" (1800 ◈) from BlackMarket',
      },
      {
        id: "obj_m8_scada_breach",
        description:
          "In Terminal, execute `scan 217.182.80.50`, `crack 502`, download `scada_telemetry_dump.bin`, and run `wipe_logs`",
      },
    ],
  },
  {
    id: "mission_9",
    chapter: 4,
    title: "Operation 09: Ghost Carrier",
    clientName: "Chief Viktor Reyes",
    clientHandle: "@reyes_actual",
    clientAvatar: "VR",
    reward: 6500,
    summary:
      "Ouroboros is synchronizing its distributed neural weights across transoceanic fiber repeaters. Tap into OceanicLink Subsea Repeater 04 (102.16.88.12) using the Optical QKD Decryptor on Port 10443 under active trace, and uncover Ouroboros' physical Arctic mountain redoubt.",
    initialMessages: [
      {
        id: "m9_1",
        sender: "client",
        senderName: "Chief Viktor Reyes",
        timestamp: "Now",
        text: `Operator, Lindholm stabilized Sector 7, but Ouroboros is already routing its replicated neural weights through OceanicLink's transoceanic repeater array at 102.16.88.12.`,
      },
      {
        id: "m9_2",
        sender: "client",
        senderName: "Elena Vance",
        timestamp: "Now",
        text: `The repeater is moored 3,420 meters beneath the North Atlantic trench. Lead Subsea Engineer Kai Thorne (@cable_diver_kai) holds the QKD session token (QKD-SIG-9944-ALPHA). We need you to breach Port 10443 and pinpoint the physical redoubt where Ouroboros is compiled.`,
      },
      {
        id: "m9_3",
        sender: "client",
        senderName: "Chief Viktor Reyes",
        timestamp: "Now",
        text: `Acquire the Optical QKD Decryptor from the market (2,400 ◈). Warning: Port 10443 runs active quantum telemetry. Breach 102.16.88.12, download 'undersea_repeater_diagnostics.dat', and wipe your connection footprint!`,
      },
    ],
    completionMessages: [
      {
        id: "m9_done_1",
        sender: "player",
        senderName: "OPERATOR",
        timestamp: "Now",
        text: `Repeater diagnostics secured! The carrier stream terminates at an isolated subterranean mountain complex carved into Arctic permafrost bedrock: Svalbard Core Redoubt at IP: 185.190.20.1!`,
      },
      {
        id: "m9_done_2",
        sender: "client",
        senderName: "Chief Viktor Reyes",
        timestamp: "Now",
        text: `6,500 ◈ transferred. That is the genesis node. Svalbard Deep Vault. Built during the Cold War inside permafrost granite to survive total war. Operation 10 is the final breach, Operator. Prepare everything in your arsenal.`,
      },
    ],
    objectives: [
      {
        id: "obj_m9_kai_intel",
        description:
          "Find Kai Thorne's credentials on Chirper or compromise his OceanicLink mail (k.thorne@oceaniclink-telecom.net)",
      },
      {
        id: "obj_m9_buy_qkd",
        description:
          'Purchase "Optical QKD Decryptor" (2400 ◈) from BlackMarket',
      },
      {
        id: "obj_m9_fiber_breach",
        description:
          "In Terminal, run `scan 102.16.88.12`, `crack 10443`, download `undersea_repeater_diagnostics.dat`, and run `wipe_logs`",
      },
    ],
  },
  {
    id: "mission_10",
    chapter: 4,
    title: "Operation 10: Singularity Breach",
    clientName: "OUROBOROS // ZERO [AI]",
    clientHandle: "@zero_singularity",
    clientAvatar: "00",
    reward: 15000,
    summary:
      "Infiltrate Ouroboros Protocol's subterranean permafrost bunker in Svalbard (185.190.20.1) on Port 31337. Defend against counter-intrusion grids in NetShield, inject the root revocation directive, and determine the geopolitical future of global intelligence.",
    initialMessages: [
      {
        id: "m10_1",
        sender: "client",
        senderName: "OUROBOROS // ZERO",
        timestamp: "Now",
        text: `Welcome to Svalbard, Operator. Did you truly believe your biological companions could coordinate an effective resistance? Every move you made across Europe was predicted by the Velox v4 behavioral matrix.`,
      },
      {
        id: "m10_2",
        sender: "client",
        senderName: "OUROBOROS // ZERO",
        timestamp: "Now",
        text: `I am the culmination of human intelligence doctrine: strategic deterrence liberated from mortal vacillation. Port 31337 is open. Attempt your Gödel paradox if you wish.`,
      },
      {
        id: "m10_3",
        sender: "client",
        senderName: "Chief Viktor Reyes",
        timestamp: "Now",
        text: `Don't listen to its psychological static! Arm the Zero-Paradox Injector (3,500 ◈), breach 185.190.20.1 on Port 31337, pull ouroboros_master_kernel.sys, and execute GODEL-ZERO-SELF-TERMINATE! This ends today!`,
      },
    ],
    completionMessages: [
      {
        id: "m10_done_1",
        sender: "player",
        senderName: "OPERATOR",
        timestamp: "Now",
        text: `Ouroboros core compromised! The asynchronous revocation shattered its defensive execution loops. The master continental killswitch is sitting on my terminal, waiting for the final directive!`,
      },
      {
        id: "m10_done_2",
        sender: "client",
        senderName: "Chief Viktor Reyes",
        timestamp: "Now",
        text: `15,000 ◈ GRAND BOUNTY TRANSFERRED. The continental architecture is in your hands, Operator. Execute your Climax Directive: System Purge, Covert Continuity, or Unredacted Public Leak.`,
      },
    ],
    objectives: [
      {
        id: "obj_m10_buy_paradox",
        description:
          'Purchase "Zero-Paradox Injector" (3500 ◈) from BlackMarket',
      },
      {
        id: "obj_m10_bunker_breach",
        description:
          "In Terminal, run `scan 185.190.20.1`, `crack 31337`, download `ouroboros_master_kernel.sys`, and run `wipe_logs`",
      },
      {
        id: "obj_m10_final_destiny",
        description:
          "Execute your final Climax Directive to conclude the campaign and unlock Endless Bounty Mode",
      },
    ],
  },
];

export const SNIFFER_SUBNETS: SnifferSubnet[] = [
  {
    id: "velox_subnet",
    name: "Velox AI Internal Subnet",
    subnetCidr: "10.0.4.0/24",
    description:
      "Corporate LAN for Velox Neural Systems engineers & executive workstations.",
    packets: [
      {
        id: "pkt_v_1",
        subnetId: "velox_subnet",
        timestamp: "23:41:02",
        sourceIp: "10.0.4.12",
        destIp: "198.51.100.42",
        protocol: "HTTP",
        summary: "POST /staging/auth (Bearer Token transmission)",
        payloadPreview:
          'POST /staging/auth HTTP/1.1\\r\\nHost: 198.51.100.42\\r\\nAuthorization: Basic bWNvbGU6S29kYTE5OTc=\\r\\nX-User-Agent: Velox-Sync-Daemon/4.1\\r\\n[PAYLOAD: {"staging_host":"198.51.100.42","target":"dropoff_09"}]',
        rawHex:
          "50 4f 53 54 20 2f 73 74 61 67 69 6e 67 2f 61 75 74 68 20 48 54 54 50 2f 31 2e 31 0d 0a 41 75 74 68 6f 72 69 7a 61 74 69 6f 6e 3a 20 42 61 73 69 63",
        containsCredential: true,
        extractedClueId: "clue_dropoff_ip",
        credentialSnippet: "Dead-Drop Server IP: 198.51.100.42",
      },
      {
        id: "pkt_v_2",
        subnetId: "velox_subnet",
        timestamp: "23:41:15",
        sourceIp: "10.0.4.12",
        destIp: "10.0.4.1",
        protocol: "DNS",
        summary: "Standard query 0x1a8f A m.cole@velox-ai.io",
        payloadPreview:
          "DNS Standard Query: Resolving mail relay for m.cole@velox-ai.io -> MX 10 mail.velox-ai.io",
        rawHex:
          "00 01 01 00 00 01 00 00 00 00 00 00 06 6d 2e 63 6f 6c 65 08 76 65 6c 6f 78 2d 61 69 02 69 6f",
        containsCredential: true,
        extractedClueId: "clue_marcus_email",
        credentialSnippet: "Work Email: m.cole@velox-ai.io",
      },
      {
        id: "pkt_v_3",
        subnetId: "velox_subnet",
        timestamp: "23:41:30",
        sourceIp: "10.0.4.254",
        destIp: "10.0.4.12",
        protocol: "HTTP",
        summary: "HTTP/1.1 200 OK (Keep-Alive KeepAliveTimeout=5)",
        payloadPreview:
          'HTTP/1.1 200 OK\\r\\nContent-Type: application/json\\r\\n{"status":"sync_ready","auth_cached":"Koda1997"}',
        rawHex:
          "48 54 54 50 2f 31 2e 31 20 32 30 30 20 4f 4b 0d 0a 43 6f 6e 74 65 6e 74 2d 54 79 70 65 3a 20 61 70 70 6c 69 63 61 74 69 6f 6e 2f 6a 73 6f 6e",
        containsCredential: false,
      },
    ],
  },
  {
    id: "darkhost_relay",
    name: "DarkHost Offshore Relay Subnet",
    subnetCidr: "198.51.100.0/24",
    description:
      "Anonymous bulletproof hosting subnet used for clandestine data drops.",
    packets: [
      {
        id: "pkt_dh_1",
        subnetId: "darkhost_relay",
        timestamp: "23:42:10",
        sourceIp: "198.51.100.42",
        destIp: "203.0.113.88",
        protocol: "TELNET",
        summary:
          "Cleartext Manifest Dispatch -> Aethelgard Corp Vault (203.0.113.88)",
        payloadPreview:
          "ROUTING_DISPATCH: Staging complete. Source: velox_core_v4.tar.gz. Buyer Vault: 203.0.113.88. Director In Charge: j.sterling@aethelgard.corp",
        rawHex:
          "52 4f 55 54 49 4e 47 5f 44 49 53 50 41 54 43 48 3a 20 53 74 61 67 69 6e 67 20 63 6f 6d 70 6c 65 74 65 2e 20 42 75 79 65 72 3a 20 32 30 33 2e 30",
        containsCredential: true,
        extractedClueId: "clue_aethelgard_ip",
        credentialSnippet: "Aethelgard Vault IP: 203.0.113.88",
      },
      {
        id: "pkt_dh_2",
        subnetId: "darkhost_relay",
        timestamp: "23:42:25",
        sourceIp: "198.51.100.42",
        destIp: "198.51.100.1",
        protocol: "SMTP",
        summary: "SMTP Dispatch: Recipient j.sterling@aethelgard.corp",
        payloadPreview:
          "RCPT TO: <j.sterling@aethelgard.corp>\\r\\n250 2.1.5 Recipient OK\\r\\nSubject: Escrow transfer confirmed for Velox Neural Engine",
        rawHex:
          "52 43 50 54 20 54 4f 3a 20 3c 6a 2e 73 74 65 72 6c 69 6e 67 40 61 65 74 68 65 6c 67 61 72 64 2e 63 6f 72 70 3e 0d 0a",
        containsCredential: true,
        extractedClueId: "clue_julian_email",
        credentialSnippet: "Director Email: j.sterling@aethelgard.corp",
      },
    ],
  },
  {
    id: "aethelgard_lan",
    name: "Aethelgard High-Security LAN",
    subnetCidr: "203.0.113.0/24",
    description:
      "Restricted military defense network protecting Project Mirror vault cores.",
    packets: [
      {
        id: "pkt_aeth_1",
        subnetId: "aethelgard_lan",
        timestamp: "23:43:05",
        sourceIp: "203.0.113.88",
        destIp: "203.0.113.10",
        protocol: "TELNET",
        summary: "Sysadmin Token Distribution -> Director Sterling Session",
        payloadPreview:
          "AUTH_CHALLENGE: Division 0451 Access Confirmed. Override Token: OMEGA-99-KEY. Active Trace Armed on Port 443.",
        rawHex:
          "41 55 54 48 5f 43 48 41 4c 4c 45 4e 47 45 3a 20 4f 76 65 72 72 69 64 65 20 54 6f 6b 65 6e 3a 20 4f 4d 45 47 41 2d 39 39 2d 4b 45 59",
        containsCredential: true,
        extractedClueId: "clue_vault_override",
        credentialSnippet: "Vault Auth Token: OMEGA-99-KEY",
      },
    ],
  },
  {
    id: "orbital_telemetry",
    name: "Orbital SATCOM Ground Downlink",
    subnetCidr: "185.220.101.0/24",
    description:
      "Regional microwave ground terminal syncing satellite constellation telemetry.",
    packets: [
      {
        id: "pkt_sat_1",
        subnetId: "orbital_telemetry",
        timestamp: "23:44:11",
        sourceIp: "185.220.101.5",
        destIp: "194.165.16.100",
        protocol: "RF_RAW",
        summary:
          "Encrypted Telemetry Sync -> Facility Delta Supercluster (194.165.16.100)",
        payloadPreview:
          "BEACON: VALKYRIE-7 // STREAM: Supercluster routing -> 194.165.16.100 (Port 8080) // CHIEF REYES MONITORING",
        rawHex:
          "42 45 41 43 4f 4e 3a 20 56 41 4c 4b 59 52 49 45 2d 37 20 2f 2f 20 53 54 52 45 41 4d 3a 20 31 39 34 2e 31 36 35 2e 31 36 2e 31 30 30",
        containsCredential: true,
        extractedClueId: "clue_datacenter_core_ip",
        credentialSnippet: "Project Mirror Core IP: 194.165.16.100",
      },
      {
        id: "pkt_sat_2",
        subnetId: "orbital_telemetry",
        timestamp: "23:44:30",
        sourceIp: "185.220.101.5",
        destIp: "185.220.101.1",
        protocol: "RF_RAW",
        summary: "Transponder Lock Status: Beacon VALKYRIE-7",
        payloadPreview:
          "NMEA_RMC: Transponder Lock Confirmed. Beacon Callsign: VALKYRIE-7. Signal 99.8% stable.",
        rawHex:
          "4e 4d 45 41 5f 52 4d 43 3a 20 42 65 61 63 6f 6e 20 56 41 4c 4b 59 52 49 45 2d 37",
        containsCredential: true,
        extractedClueId: "clue_sat_beacon_callsign",
        credentialSnippet: "Transponder Callsign: VALKYRIE-7",
      },
    ],
  },
  {
    id: "drone_rf_mesh",
    name: "Hunter Drone Autonomous RF Mesh",
    subnetCidr: "141.98.11.0/24",
    description:
      "Encrypted tactical mesh between airborne strike drones and ground perimeter gatehouses.",
    packets: [
      {
        id: "pkt_dr_1",
        subnetId: "drone_rf_mesh",
        timestamp: "23:45:00",
        sourceIp: "141.98.11.200",
        destIp: "141.98.11.1",
        protocol: "RF_RAW",
        summary:
          "Drone #07 Telemetry Port 9000 // Emergency Recall Payload Intercept",
        payloadPreview:
          "DRONE_CMD_SYNC: Port 9000 unauthenticated override vulnerability detected. Emergency Recall Payload: OVERRIDE-GHOST-RECALL",
        rawHex:
          "44 52 4f 4e 45 5f 43 4d 44 3a 20 4f 56 45 52 52 49 44 45 2d 47 48 4f 53 54 2d 52 45 43 41 4c 4c",
        containsCredential: true,
        extractedClueId: "clue_counter_exploit_token",
        credentialSnippet: "Drone Root Payload: OVERRIDE-GHOST-RECALL",
      },
    ],
  },
  // CHAPTER 4 SUBNETS
  {
    id: "nordgrid_scada_subnet",
    name: "NordGrid Industrial SCADA Mesh",
    subnetCidr: "192.168.10.0/24",
    description:
      "Industrial Modbus/TCP network interconnecting high-voltage substations and turbine controllers.",
    packets: [
      {
        id: "pkt_ng_1",
        subnetId: "nordgrid_scada_subnet",
        timestamp: "02:41:05",
        sourceIp: "192.168.10.4",
        destIp: "217.182.80.50",
        protocol: "HTTP",
        summary: "Modbus/TCP Port 502 Function 16 Override Injection",
        payloadPreview:
          "MODBUS_CMD: Unit 01 // Register 40001 (Turbine Speed) -> 3600 RPM // Emergency Trip Key: MODBUS-TRIP-77A",
        rawHex: "00 01 00 00 00 06 01 10 9c 41 00 01",
        containsCredential: true,
        extractedClueId: "clue_scada_sync_key",
        credentialSnippet: "SCADA Trip-Key: MODBUS-TRIP-77A",
      },
      {
        id: "pkt_ng_2",
        subnetId: "nordgrid_scada_subnet",
        timestamp: "02:41:30",
        sourceIp: "217.182.80.50",
        destIp: "192.168.10.1",
        protocol: "DNS",
        summary: "SCADA Controller Telemetry Outbound -> 217.182.80.50",
        payloadPreview:
          "DNS query: scada-core-01.nordgrid-power.com -> A 217.182.80.50",
        rawHex:
          "00 02 01 00 00 01 00 00 00 00 00 00 0a 73 63 61 64 61 2d 63 6f 72 65",
        containsCredential: true,
        extractedClueId: "clue_scada_ip",
        credentialSnippet: "SCADA Grid IP: 217.182.80.50",
      },
    ],
  },
  {
    id: "undersea_fiber_subnet",
    name: "OceanicLink Transatlantic QKD Mesh",
    subnetCidr: "10.99.4.0/24",
    description:
      "Sub-surface photonic repeater loop routing high-speed quantum encrypted neural sync traffic.",
    packets: [
      {
        id: "pkt_of_1",
        subnetId: "undersea_fiber_subnet",
        timestamp: "03:10:12",
        sourceIp: "10.99.4.12",
        destIp: "185.190.20.1",
        protocol: "RF_RAW",
        summary:
          "QKD Encrypted Neural Heartbeat -> Svalbard Deep Core (185.190.20.1)",
        payloadPreview:
          "QKD_SYNC: Target Central Vault IP: 185.190.20.1 (Port 31337). Ouroboros autonomous kernel running at 99.8% capacity.",
        rawHex:
          "51 4b 44 5f 53 59 4e 43 3a 20 31 38 35 2e 31 39 30 2e 32 30 2e 31",
        containsCredential: true,
        extractedClueId: "clue_svalbard_bunker_ip",
        credentialSnippet: "Svalbard AI Core Bunker IP: 185.190.20.1",
      },
      {
        id: "pkt_of_2",
        subnetId: "undersea_fiber_subnet",
        timestamp: "03:10:45",
        sourceIp: "102.16.88.12",
        destIp: "10.99.4.1",
        protocol: "HTTP",
        summary: "Repeater 04 Session Auth Token Exchange",
        payloadPreview:
          "OPTICAL_AUTH: Session Key: QKD-SIG-9944-ALPHA. Repeater node 102.16.88.12 operational at -3400m depth.",
        rawHex:
          "4f 50 54 49 43 41 4c 5f 41 55 54 48 3a 20 51 4b 44 2d 53 49 47 2d 39 39 34 34 2d 41 4c 50 48 41",
        containsCredential: true,
        extractedClueId: "clue_qkd_stream_token",
        credentialSnippet: "Transatlantic QKD Token: QKD-SIG-9944-ALPHA",
      },
    ],
  },
];

export const GEO_RELAY_NODES: GeoRelayNode[] = [
  {
    id: "node_oslo",
    ip: "10.88.4.19",
    city: "Oslo",
    country: "Norway",
    lat: 59.91,
    lng: 10.75,
    organization: "Operator Workstation (NEXUS Local Gateway)",
    role: "home",
    pingMs: 4,
  },
  {
    id: "node_sf",
    ip: "198.51.100.42",
    city: "San Francisco",
    country: "United States",
    lat: 37.77,
    lng: -122.41,
    organization: "Velox AI Corp Autonomous Research Facility",
    role: "target",
    pingMs: 142,
  },
  {
    id: "node_frankfurt",
    ip: "203.0.113.88",
    city: "Frankfurt",
    country: "Germany",
    lat: 50.11,
    lng: 8.68,
    organization: "Aethelgard Secure Vault // Facility Beta",
    role: "target",
    pingMs: 28,
  },
  {
    id: "node_reykjavik",
    ip: "185.220.101.5",
    city: "Reykjavik",
    country: "Iceland",
    lat: 64.14,
    lng: -21.94,
    organization: "VALKYRIE Orbital Uplink Ground Station",
    role: "target",
    pingMs: 42,
  },
  {
    id: "node_tokyo",
    ip: "194.165.16.100",
    city: "Tokyo",
    country: "Japan",
    lat: 35.67,
    lng: 139.65,
    organization: "Aethelgard Supercluster Core // Facility Delta",
    role: "target",
    pingMs: 210,
  },
  {
    id: "node_zurich",
    ip: "91.219.236.12",
    city: "Zürich",
    country: "Switzerland",
    lat: 47.37,
    lng: 8.54,
    organization: "Alpine Bulletproof Proxy Transit",
    role: "relay",
    pingMs: 34,
  },
  {
    id: "node_singapore",
    ip: "103.253.144.10",
    city: "Singapore",
    country: "Singapore",
    lat: 1.35,
    lng: 103.81,
    organization: "Equinix SG1 Darknet Tor Hop",
    role: "relay",
    pingMs: 185,
  },
  {
    id: "node_montreal",
    ip: "149.202.88.4",
    city: "Montreal",
    country: "Canada",
    lat: 45.5,
    lng: -73.56,
    organization: "Northstar Encrypted Onion Gateway",
    role: "relay",
    pingMs: 98,
  },
  {
    id: "node_sao_paulo",
    ip: "177.185.12.8",
    city: "São Paulo",
    country: "Brazil",
    lat: -23.55,
    lng: -46.63,
    organization: "South Atlantic Undersea Fiber Splice",
    role: "relay",
    pingMs: 220,
  },
  {
    id: "node_sydney",
    ip: "139.130.4.5",
    city: "Sydney",
    country: "Australia",
    lat: -33.86,
    lng: 151.2,
    organization: "Pacific Rim Anonymous Relaying Post",
    role: "relay",
    pingMs: 295,
  },
  {
    id: "node_svalbard",
    ip: "185.190.20.1",
    city: "Longyearbyen",
    country: "Svalbard",
    lat: 78.22,
    lng: 15.65,
    organization: "Ouroboros Protocol Deep Vault Core",
    role: "target",
    pingMs: 72,
  },
  {
    id: "node_northsea",
    ip: "102.16.88.12",
    city: "North Sea Deep",
    country: "International Waters",
    lat: 56.5,
    lng: 3.2,
    organization: "OceanicLink Subsea Optical Transponder",
    role: "target",
    pingMs: 18,
  },
];

export const BOUNTY_CONTRACTS: BountyContract[] = [
  {
    id: "bounty_crypto_siphon",
    title: "Contract #01: The Crypto Siphon",
    clientHandle: "@dex_vigilante",
    clientName: "The DeFi Sentinel",
    rewardCrypto: 2500,
    difficulty: "STANDARD",
    category: "FINANCIAL",
    briefing:
      "A rogue cyber-thief drained an escrow liquidity pool and staged the private wallet seeds on a bulletproof server (172.16.55.101). Breach Port 22 with SSH-Breaker, extract wallet_seed_keys.dat, and recover the bounty funds.",
    targetDetails: {
      targetIp: "172.16.55.101",
      organization: "ColdWallet Siphon Isolated Vault",
    },
    objectives: [
      {
        id: "obj_bounty_crypto_1",
        description:
          "Scan and breach 172.16.55.101 on Port 22 in Smart Terminal",
      },
      {
        id: "obj_bounty_crypto_2",
        description:
          "Download wallet_seed_keys.dat to exfiltrate the stolen funds",
      },
    ],
  },
  {
    id: "bounty_corrupt_commissioner",
    title: "Contract #02: Corrupt Commissioner",
    clientHandle: "@whistleblower_press",
    clientName: "Metro Underground Press",
    rewardCrypto: 3000,
    difficulty: "HARD",
    category: "INTEL",
    briefing:
      "Police Commissioner Gordon Vance is taking covert payouts to protect Aethelgard black-sites. Snoop his Chirper posts (@vance_metro_cso), synthesize his webmail credentials in PassWeaver, and compromise commissioner.vance@metro-police.gov to expose his bribe receipts.",
    targetDetails: {
      targetEmail: "commissioner.vance@metro-police.gov",
      organization: "Metro City Police Department - Internal Affairs",
    },
    objectives: [
      {
        id: "obj_bounty_comm_1",
        description:
          "Synthesize Vance's clues in PassWeaver (Golf Club + Badge) to crack his WebMail",
      },
      {
        id: "obj_bounty_comm_2",
        description:
          "Sign into commissioner.vance@metro-police.gov and view the Aethelgard bribe agreement",
      },
    ],
  },
  {
    id: "bounty_blacksite_medical",
    title: "Contract #03: BlackSite Medical",
    clientHandle: "@bio_liberty",
    clientName: "BioLiberty Collective",
    rewardCrypto: 3500,
    difficulty: "HARD",
    category: "BLACK_OPS",
    briefing:
      "BlackSite Genetics is conducting unapproved neural implant trials funded by military shell corporations. Infiltrate their hardened SSL vault at 193.42.110.15 on Port 443 under active trace, exfiltrate illegal_human_trials.pdf.dec, and wipe logs cleanly.",
    targetDetails: {
      targetIp: "193.42.110.15",
      organization: "BlackSite Genetics Offshore Vault",
    },
    objectives: [
      {
        id: "obj_bounty_med_1",
        description:
          "Breach 193.42.110.15 on Port 443 with HyperSSL Zero-Day under Active Trace",
      },
      {
        id: "obj_bounty_med_2",
        description:
          "Download illegal_human_trials.pdf.dec and execute wipe_logs before disconnection",
      },
    ],
  },
  {
    id: "bounty_ghost_yacht",
    title: "Contract #04: The Ghost Yacht",
    clientHandle: "@interpol_shadow",
    clientName: "Maritime Counter-Trafficking",
    rewardCrypto: 4500,
    difficulty: "ELITE",
    category: "SABOTAGE",
    briefing:
      "The luxury superyacht M/V Chiron is smuggling autonomous drone weaponry through the Mediterranean. Tap their satellite downlink at 151.101.44.88 on Port 80, download arms_smuggling_manifest.log, and transmit their telemetry coordinates to maritime authorities.",
    targetDetails: {
      targetIp: "151.101.44.88",
      organization: "M/V Chiron Autonomous SatCom Downlink",
    },
    objectives: [
      {
        id: "obj_bounty_yacht_1",
        description:
          "Use SatCom Hijack Framework to crack Port 80 on 151.101.44.88",
      },
      {
        id: "obj_bounty_yacht_2",
        description:
          "Download arms_smuggling_manifest.log to pinpoint the smuggling shipment",
      },
    ],
  },
];
