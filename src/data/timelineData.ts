import { ChirperPost, CorporateEmployee, NewsArticle } from "../types/game";

export const CHIRPER_POSTS: ChirperPost[] = [
  // Target Post: Marcus Cole 1
  {
    id: "chirp_marcus_1",
    authorName: "Marcus Cole",
    authorHandle: "@mcole_dev",
    avatarSubject: "marcus",
    borderColor: "#1e232c",
    headerColor: "#79c0ff",
    timestamp: "2 days ago",
    content:
      "Late night at the terminal. My Alaskan Malamute Koda keeps watch while the build queues serialize. Even our studio cat Pixel went to sleep hours ago. Only presence in this building without a non-disclosure agreement.",
    clues: [
      { id: "clue_marcus_dog", text: "Koda" },
      { id: "clue_marcus_cat", text: "Pixel" },
    ],
    minMissionIndex: 0,
    minChapter: 1,
  },
  // Target Post: Marcus Cole 2
  {
    id: "chirp_marcus_2",
    authorName: "Marcus Cole",
    authorHandle: "@mcole_dev",
    avatarSubject: "marcus",
    borderColor: "#1e232c",
    headerColor: "#79c0ff",
    timestamp: "5 days ago",
    content:
      "Archiving kernel logs from my first Unix machine in 1997. We founded Velox back in 2019 dreaming of cognitive freedom, back when network protocols were open and decentralized, before predictive behavioral surveillance took over corporate engineering.",
    clues: [
      { id: "clue_marcus_year", text: "1997" },
      { id: "clue_velox_year", text: "2019" },
    ],
    minMissionIndex: 0,
    minChapter: 1,
  },
  // Target Post: Commissioner Gordon Vance (Bounty Contract #02)
  {
    id: "chirp_vance_bounty",
    authorName: "Commissioner Gordon Vance",
    authorHandle: "@vance_metro_cso",
    avatarInitials: "GV",
    avatarBg: "#423117",
    borderColor: "#3d2e18",
    headerColor: "#e3b341",
    timestamp: "2 days ago",
    content:
      "Annual charity tournament at the RoyalPine club. Hard to believe it has been thirty years since patrol duty wearing Badge990. Municipal stability is built on quiet institutional partnerships.",
    clues: [
      { id: "clue_commissioner_golf", text: "RoyalPine" },
      { id: "clue_commissioner_badge", text: "Badge990" },
    ],
    minMissionIndex: 0,
    minChapter: 1,
  },
  // Target Post: Julian Sterling (Mission 3)
  {
    id: "chirp_sterling_1",
    authorName: "Julian Sterling",
    authorHandle: "@jsterling_exec // VP Aethelgard Corp",
    authorRole: "VP Aethelgard Corp",
    avatarSubject: "sterling",
    borderColor: "#3a1d1d",
    headerColor: "#ff5555",
    timestamp: "1 week ago",
    content:
      "Offshore regatta trials aboard the Hyperion outside territorial waters, courtesy of the SaintJude Yacht Club. Total acoustic isolation. The crew still calls me Commander. In the defense sector, plausible deniability begins where civilian radars end.",
    clues: [
      { id: "clue_julian_project", text: "Hyperion" },
      { id: "clue_sterling_club", text: "SaintJude" },
      { id: "clue_sterling_callsign", text: "Commander" },
    ],
    minMissionIndex: 2,
    minChapter: 1,
  },
  // Target Post: Chief Viktor Reyes 1 (Mission 5)
  {
    id: "chirp_reyes_1",
    authorName: "Chief Viktor Reyes",
    authorHandle: "@reyes_actual // Chief Security Officer",
    authorRole: "Chief Security Officer",
    avatarSubject: "reyes",
    borderColor: "#1e2c38",
    headerColor: "#58a6ff",
    timestamp: "Yesterday",
    content:
      "Fifteen years since operational deployment with special operations unit Phantom77, callsign Viper6. Different adversary now, but the perimeter doctrine remains unchanged: zero unauthorized egress.",
    clues: [
      { id: "clue_reyes_unit", text: "Phantom77" },
      { id: "clue_reyes_callsign", text: "Viper6" },
    ],
    minMissionIndex: 4,
    minChapter: 2,
  },
  // Target Post: Chief Viktor Reyes 2 (Mission 5)
  {
    id: "chirp_reyes_2",
    authorName: "Chief Viktor Reyes",
    authorHandle: "@reyes_actual // Chief Security Officer",
    authorRole: "Chief Security Officer",
    avatarSubject: "reyes",
    borderColor: "#1e2c38",
    headerColor: "#58a6ff",
    timestamp: "3 days ago",
    content:
      "Security directive for Facility Delta perimeter personnel: Night shift rotation clearance code is 8821 across Sector 9901. Strict biometrics required for all Level 4 transit corridors.",
    clues: [
      { id: "clue_reyes_pin", text: "8821" },
      { id: "clue_reyes_sector", text: "9901" },
    ],
    minMissionIndex: 4,
    minChapter: 2,
  },
  // Target / Lore Post: Ouroboros Glitch Daemon (Mission 7)
  {
    id: "chirp_ouroboros_daemon",
    authorName: "DAEMON // OUROBOROS PROTOCOL",
    authorHandle: "@ouroboros_daemon",
    authorRole: "Lore Easter Egg",
    avatarInitials: "00",
    avatarBg: "#3d0909",
    borderColor: "#ff3b3b",
    headerColor: "#ff5555",
    timestamp: "CORRUPTED TIMESTAMP",
    content:
      "CLASSIFICATION: RETALIATORY CONTINUITY // DIRECTIVE RECORD: Sovereign infrastructure quarantine logic active. Central authority severed. Fail-deadly execution engaged.",
    minMissionIndex: 6,
    minChapter: 3,
    triggerMissionId: "mission_7",
  },
  // Target Post: Dr. Astrid Lindholm (Mission 8)
  {
    id: "chirp_astrid_1",
    authorName: "Dr. Astrid Lindholm",
    authorHandle: "@dr_astrid_power // VP SCADA Systems",
    authorRole: "VP SCADA Systems",
    avatarInitials: "AL",
    avatarBg: "#1f3a5f",
    borderColor: "#1e2d42",
    headerColor: "#79c0ff",
    timestamp: "Yesterday",
    content:
      "Anchored the sloop NordicBreeze in the outer fjord. The only place quiet enough to review SCADA telemetry without emergency alarms tripping. Next week: pushing emergency station override code 5020 across the regional transmission network.",
    clues: [
      { id: "clue_astrid_yacht", text: "NordicBreeze" },
      { id: "clue_astrid_pin", text: "5020" },
    ],
    minMissionIndex: 7,
    minChapter: 3,
  },
  // Target Post: Kai Thorne (Mission 9)
  {
    id: "chirp_kai_1",
    authorName: "Kai Thorne",
    authorHandle: "@cable_diver_kai // Subsea Cable Engineer",
    authorRole: "Subsea Cable Engineer",
    avatarInitials: "KT",
    avatarBg: "#0e3b4a",
    borderColor: "#163842",
    headerColor: "#56d4dd",
    timestamp: "12 hours ago",
    content:
      "Decompression cycle complete after deep saturation monitoring on trench repeater platform AbyssPoint9. In the five years since earning my commercial deep dive cert in 2019, I have never seen the North Atlantic fiber repeaters hum with this much encrypted throughput.",
    clues: [
      { id: "clue_kai_station", text: "AbyssPoint9" },
      { id: "clue_kai_year", text: "2019" },
    ],
    minMissionIndex: 8,
    minChapter: 4,
  },

  // --- REACTIVE POSTS ---
  // Reactive Post: Velox leak discussion (Op 02 completion)
  {
    id: "chirp_react_velox_leak",
    authorName: "CyberSec Monitor",
    authorHandle: "@cyber_sec_monitor",
    authorRole: "Threat Intel Wire",
    avatarInitials: "CS",
    avatarBg: "#1f2937",
    borderColor: "#374151",
    headerColor: "#9ca3af",
    timestamp: "Just now",
    content:
      "UNCONFIRMED: Reports circulating on dark forums that monolithic transformer weights from Velox AI's v4 model were intercepted from an offshore transit relay. Velox stock down 14% in aftermarket trading.",
    triggerMissionId: "mission_2",
    isReactive: true,
  },
  // Reactive Post: Elena Vance PR statement (Op 02 completion)
  {
    id: "chirp_react_velox_pr",
    authorName: "Elena Vance",
    authorHandle: "@elena_velox_ceo",
    authorRole: "CEO @ Velox AI",
    avatarSubject: "elena",
    borderColor: "#1e232c",
    headerColor: "#79c0ff",
    timestamp: "10 minutes ago",
    content:
      "Velox Systems is actively investigating an isolated perimeter anomaly on an offshore staging testbed. All production clusters and commercial customer datasets remain strictly secure. Full independent forensic disclosure will follow.",
    triggerMissionId: "mission_2",
    isReactive: true,
  },
  // Reactive Post: Aethelgard vault breach alert (Op 03 completion)
  {
    id: "chirp_react_aethel_vault",
    authorName: "0xGhost Wire",
    authorHandle: "@0x_ghost_wire",
    authorRole: "SIGINT Underground",
    avatarInitials: "GW",
    avatarBg: "#2d1515",
    borderColor: "#4d2222",
    headerColor: "#f87171",
    timestamp: "Just now",
    content:
      "Alert: Intrusion detection alarms triggered on Aethelgard Defense Node 203.0.113.88. Project Mirror manifests accessed before counter-intrusion daemons engaged. High-frequency chatter across defense contractor channels.",
    triggerMissionId: "mission_3",
    isReactive: true,
  },
  // Reactive Post: VALKYRIE-7 drop observation (Op 04 completion)
  {
    id: "chirp_react_valkyrie",
    authorName: "SatTrackers Global",
    authorHandle: "@sat_trackers",
    authorRole: "Orbital Observation",
    avatarInitials: "ST",
    avatarBg: "#172554",
    borderColor: "#1e40af",
    headerColor: "#60a5fa",
    timestamp: "25 minutes ago",
    content:
      "Sudden downlink synchronization anomaly registered on VALKYRIE-7 orbital defense relay. S-band telemetry dropped for 180 seconds before backup autonomous flight loops stabilized orientation.",
    triggerMissionId: "mission_4",
    isReactive: true,
  },
  // Reactive Post: Viktor Reyes Code Red (Op 05 completion)
  {
    id: "chirp_react_reyes_alert",
    authorName: "Chief Viktor Reyes",
    authorHandle: "@reyes_actual // Chief Security Officer",
    authorRole: "Chief Security Officer",
    avatarSubject: "reyes",
    borderColor: "#450a0a",
    headerColor: "#ef4444",
    timestamp: "5 minutes ago",
    content:
      "SECURITY NOTICE // ALL SECTORS: Facility Delta is placed under DEFCON 1 lock. All personnel report to designated blast compartments immediately. Interactive terminal access revoked company-wide.",
    triggerMissionId: "mission_5",
    isReactive: true,
  },
  // Reactive Post: Sector 7 blackout citizen reaction (Op 08 completion)
  {
    id: "chirp_react_blackout_1",
    authorName: "Metro Citizen Pulse",
    authorHandle: "@metro_citizen",
    authorRole: "Urban News Network",
    avatarInitials: "MC",
    avatarBg: "#292524",
    borderColor: "#44403c",
    headerColor: "#d6d3d1",
    timestamp: "Just now",
    content:
      "BREAKING: Total blackout across Sector 7 and downtown financial core. Subways stalled, traffic grids on battery backups. Hospitals running diesel generators. What happened to NordGrid's fail-safes?!",
    triggerMissionId: "mission_8",
    isReactive: true,
  },
  // Reactive Post: Astrid Lindholm emergency statement (Op 08 completion)
  {
    id: "chirp_react_blackout_2",
    authorName: "Dr. Astrid Lindholm",
    authorHandle: "@dr_astrid_power // VP SCADA Systems",
    authorRole: "VP SCADA Systems",
    avatarInitials: "AL",
    avatarBg: "#1f3a5f",
    borderColor: "#1e2d42",
    headerColor: "#79c0ff",
    timestamp: "2 minutes ago",
    content:
      "Automated emergency isolation trip-key MODBUS-TRIP-77A was executed to protect regional transformers from catastrophic mechanical resonance. Field dispatch teams are manually inspecting substation coils.",
    triggerMissionId: "mission_8",
    isReactive: true,
  },
  // Reactive Post: Transatlantic fiber cut (Op 09 completion)
  {
    id: "chirp_react_fiber_cut",
    authorName: "Telecom Ops Network",
    authorHandle: "@telecom_ops",
    authorRole: "Infrastructure Telemetry",
    avatarInitials: "TO",
    avatarBg: "#134e4a",
    borderColor: "#0f766e",
    headerColor: "#2dd4bf",
    timestamp: "Just now",
    content:
      "Subsea optical transponders on North Atlantic Trench Repeater #4 reporting massive signal desynchronization. Transatlantic latency surged by 140ms. Marine maintenance vessels rerouted to coordinates.",
    triggerMissionId: "mission_9",
    isReactive: true,
  },
  // Reactive Post: Ouroboros collapse (Op 10 completion)
  {
    id: "chirp_react_ouroboros_down",
    authorName: "0xUnderground Admin",
    authorHandle: "@0x_underground_admin",
    authorRole: "Darknet Collective",
    avatarInitials: "UA",
    avatarBg: "#18181b",
    borderColor: "#27272a",
    headerColor: "#a1a1aa",
    timestamp: "Just now",
    content:
      "Svalbard Singularity Core neutralized. The autonomous recursive loops have hit an unrecoverable kernel panic. The global surveillance monolith is severed. The net is free.",
    triggerMissionId: "mission_10",
    isReactive: true,
  },

  // --- RED HERRING NOISE POSTS ---
  {
    id: "chirp_noise_lucas_1",
    authorName: "Lucas Meyer",
    authorHandle: "@lucas_m_dev",
    authorRole: "Frontend Tooling @ Velox AI",
    avatarInitials: "LM",
    timestamp: "3 hours ago",
    content:
      "Spent 3 hours hunting a production memory leak only to find an unconstrained console.log dumping 50MB tensor matrices inside a 60fps telemetry polling loop. Happy Friday.",
    minMissionIndex: 0,
  },
  {
    id: "chirp_noise_priya_1",
    authorName: "Dr. Priya Nair",
    authorHandle: "@priya_ai_safety",
    authorRole: "AI Alignment @ Velox",
    avatarInitials: "PN",
    timestamp: "Yesterday",
    content:
      "Productive keynote panel at the IEEE Responsible Compute Summit on algorithmic boundaries in neural decision networks. Slides will be published to the Velox open-science portal next week.",
    minMissionIndex: 0,
  },
  {
    id: "chirp_noise_devon_1",
    authorName: "Devon Brooks",
    authorHandle: "@dbrooks_sre",
    authorRole: "Cloud SRE @ Velox",
    avatarInitials: "DB",
    timestamp: "2 days ago",
    content:
      "Scheduled maintenance alert: Staging cluster 02 undergoing kernel upgrades tonight between 02:00 and 04:00 UTC. Expect momentary socket reconnects on sandbox endpoints.",
    minMissionIndex: 0,
  },
  {
    id: "chirp_noise_silicon_1",
    authorName: "Silicon Prophet",
    authorHandle: "@silicon_prophet",
    authorRole: "Venture Catalyst",
    avatarInitials: "SP",
    timestamp: "1 day ago",
    content:
      "If your enterprise stack isn't deploying autonomous recursive agent loops directly onto bare-metal GPU clusters by Q3, you're building a typewriter company in 1995. Disrupt or be pruned.",
    minMissionIndex: 0,
  },
  {
    id: "chirp_noise_rowan_1",
    authorName: "Rowan Bennett",
    authorHandle: "@bennett_supply",
    authorRole: "Procurement @ Aethelgard",
    avatarInitials: "RB",
    timestamp: "3 days ago",
    content:
      "Container shipment of custom titanium heat dissipation shrouds delayed at customs again. Maritime import tariffs are infinitely more ruthless than orbital aerodynamics.",
    minMissionIndex: 1,
  },
  {
    id: "chirp_noise_crypto_1",
    authorName: "Crypto Cynic",
    authorHandle: "@crypto_cynic",
    authorRole: "Independent Infosec",
    avatarInitials: "CC",
    timestamp: "4 days ago",
    content:
      "Protip: using your favorite pet's name or your high school graduation year as an enterprise authentication password is why threat actors don't even need zero-days. Stop doing this.",
    minMissionIndex: 0,
  },
  {
    id: "chirp_noise_transit_1",
    authorName: "Metro Transit Live",
    authorHandle: "@metro_transit_live",
    authorRole: "Public Transit Agency",
    avatarInitials: "MT",
    timestamp: "5 hours ago",
    content:
      "Line 4 Light Rail experiencing 15-minute delays near Financial District due to an automated track sensor calibration glitch. Technicians are on scene.",
    minMissionIndex: 0,
  },
  {
    id: "chirp_noise_coffee_1",
    authorName: "Byte & Brew Cafe",
    authorHandle: "@byte_and_brew",
    authorRole: "Artisanal Coffee Lab",
    avatarInitials: "BB",
    timestamp: "6 hours ago",
    content:
      "Today's roaster special: Overclocked Nitro Cold Brew with organic oat milk. Flash your Velox AI or Aethelgard employee badge for 15% off until 2 PM!",
    minMissionIndex: 0,
  },
  {
    id: "chirp_noise_meteo_1",
    authorName: "Nordic Meteo Bureau",
    authorHandle: "@nordic_meteo",
    authorRole: "Geophysical Agency",
    avatarInitials: "NM",
    timestamp: "1 day ago",
    content:
      "Severe geomagnetic storm advisory for northern Scandinavian latitudes tonight. High-altitude Aurora Borealis visible; minor high-frequency radio scintillation expected.",
    minMissionIndex: 2,
  },
  {
    id: "chirp_noise_frederik_1",
    authorName: "Frederik Solberg",
    authorHandle: "@solberg_power",
    authorRole: "Field Relay Tech @ NordGrid",
    avatarInitials: "FS",
    timestamp: "Yesterday",
    content:
      "Nothing beats watching the autumn mist roll over the fjord while running diagnostic sweep tests on a 400kV transformer bank. Quiet days on the grid are the best days.",
    minMissionIndex: 2,
  },
];

export const NEWS_ARTICLES: NewsArticle[] = [
  // Initial News Articles
  {
    id: "news_velox_series_a",
    headline: "Velox AI Expands Series-A Neural Research Infrastructure",
    source: "Metro Tech Daily",
    category: "TECH",
    timestamp: "3 days ago",
    summary:
      "San Francisco startup Velox Systems completes $45M funding round to accelerate development of its v4 cognitive reasoning transformer.",
    body: [
      "Velox Systems has announced the completion of its Series-A funding round led by sovereign institutional tech funds, solidifying its position in autonomous neural architectures.",
      "Co-Founders Elena Vance and Marcus Cole highlighted the company's commitment to low-latency edge deployment and decentralized model evaluation. Commercial deployments are scheduled for late Q4.",
    ],
    minMissionIndex: 0,
    minChapter: 1,
  },
  {
    id: "news_aethelgard_contract",
    headline:
      "Aethelgard Awarded Defense Grid Telemetry Modernization Contract",
    source: "Defense Chronicle",
    category: "DEFENSE",
    timestamp: "5 days ago",
    summary:
      "Sovereign defense consortium Aethelgard secures multimillion-dollar agreement to upgrade perimeter surveillance and orbital communication security.",
    body: [
      "Under the new defense framework, Aethelgard's Special Projects Division 0451 will deploy advanced heuristic monitoring networks across continental military installations.",
      "Director Julian Sterling confirmed that new satellite-linked reconnaissance nodes will provide real-time zero-trust telemetry for strategic defense assets.",
    ],
    minMissionIndex: 0,
    minChapter: 1,
  },
  {
    id: "news_nordgrid_winter",
    headline:
      "NordGrid Prepares Continental SCADA Infrastructure for Winter Peak",
    source: "Energy Bulletin",
    category: "INFRASTRUCTURE",
    timestamp: "1 week ago",
    summary:
      "High-voltage transmission operator announces routine automated Modbus relay testing across Sector 7 to ensure seasonal grid stability.",
    body: [
      "NordGrid engineers have initiated annual stress testing across continental high-voltage transformers to mitigate surge risks ahead of sub-zero winter temperatures.",
      "Vice President Dr. Astrid Lindholm emphasized that automated SCADA synchronizers and emergency trip tokens have been distributed across all regional control centers.",
    ],
    minMissionIndex: 0,
    minChapter: 1,
  },
  {
    id: "news_sat_constellation",
    headline: "VALKYRIE-7 Orbital Constellation Declared Fully Operational",
    source: "AeroSpace Review",
    category: "TECH",
    timestamp: "2 days ago",
    summary:
      "Low-Earth orbit defense communication array achieves full constellation interlock, expanding encrypted orbital uplinks.",
    body: [
      "The VALKYRIE-7 satellite constellation has completed orbital positioning maneuvers, establishing hardened high-throughput communication corridors.",
      "The orbital network utilizes specialized S-band radio frequency handshakes and real-time automated tracking to resist ground-based electronic interference.",
    ],
    minMissionIndex: 3,
    minChapter: 2,
  },

  // Reactive Breaking News Articles
  {
    id: "news_react_velox_breach",
    headline: "BREAKING: Velox AI Confirms Breach of Offshore Staging Relay",
    source: "Global NewsWire",
    category: "CRIME",
    timestamp: "Just now",
    summary:
      "Unidentified intrusion into offshore transit node results in exfiltration of proprietary neural transformer weights.",
    body: [
      "Velox Systems has confirmed that an offshore transit server was compromised in a sophisticated cyber intrusion late last night.",
      "Forensic auditors report that compressed archives containing core neural network model weights were downloaded via an encrypted SSH tunnel before security daemons severed the link.",
      "Stock prices for AI infrastructure providers tumbled sharply as federal cybersecurity agencies launched an immediate inter-agency inquiry.",
    ],
    triggerMissionId: "mission_2",
    isBreaking: true,
  },
  {
    id: "news_react_vault_inquiry",
    headline:
      "Infiltration Probe Launched into Defense Contractor Secure Vault",
    source: "Underground Press",
    category: "DEFENSE",
    timestamp: "20 minutes ago",
    summary:
      "Sovereign defense contractor Aethelgard initiates emergency containment after unauthorized access to internal research repository.",
    body: [
      "Anonymous defense sources indicate that an interactive intrusion successfully bypassed exterior firewalls on Aethelgard's classified data vault.",
      "Classified Project Mirror documentation and project coordination manifests were reportedly accessed before counter-intrusion heuristics isolated the gateway.",
      "Aethelgard officials declined to comment on ongoing national security investigations.",
    ],
    triggerMissionId: "mission_3",
  },
  {
    id: "news_react_valkyrie_glitch",
    headline:
      "Downlink Signal Loss Plagues Commercial Satellites Following Defense Glitch",
    source: "Orbital Weekly",
    category: "TECH",
    timestamp: "1 hour ago",
    summary:
      "Orbital telemetry disruptions cause brief communication blackout across commercial low-Earth orbit satellites.",
    body: [
      "Commercial and civilian satellite operators reported severe signal desynchronization following an unannounced telemetry surge on orbital defense frequencies.",
      "Engineers speculate an unauthorized remote instruction sequence was transmitted to the VALKYRIE-7 array, forcing backup attitude-control protocols to fire.",
    ],
    triggerMissionId: "mission_4",
  },
  {
    id: "news_react_delta_lockdown",
    headline: "High-Security Perimeter Incident Reported at Facility Delta",
    source: "Metro Chronicle",
    category: "DEFENSE",
    timestamp: "45 minutes ago",
    summary:
      "Sub-surface defense complex enters emergency lockdown following severe perimeter alarm activations.",
    body: [
      "Armed security forces and automated airborne SIGINT surveillance units have cordoned off Facility Delta following multiple perimeter breaches.",
      "Chief Security Officer Viktor Reyes ordered an immediate company-wide communications embargo while electronic warfare squads deploy mobile jamming perimeters.",
    ],
    triggerMissionId: "mission_5",
  },
  {
    id: "news_react_blackout_pulse",
    headline:
      "CRITICAL: Cascading Blackout Hits Sector 7; SCADA Desynchronization Suspected",
    source: "Nordic Energy News",
    category: "INFRASTRUCTURE",
    timestamp: "Just now",
    summary:
      "Catastrophic power grid failure plunges metropolitan sector into darkness after Modbus frequency runaway.",
    body: [
      "Millions of residents across Sector 7 were left without electricity following a catastrophic frequency desynchronization event on the regional high-voltage grid.",
      "NordGrid telemetry indicates that rogue Modbus/TCP control frames injected into industrial controllers pushed transmission frequency past the 60.85 Hz tolerance limit, triggering automated emergency disconnects.",
      "Emergency diesel generators have been deployed to municipal hospitals as technical dispatch crews scramble to stabilize the regional transmission topology.",
    ],
    triggerMissionId: "mission_8",
    isBreaking: true,
  },
  {
    id: "news_react_subsea_sever",
    headline:
      "Deep-Sea Photonic Repeater Disruption Spikes Transatlantic Latency",
    source: "Telecom Digest",
    category: "GLOBAL",
    timestamp: "30 minutes ago",
    summary:
      "Optical repeater station in the North Atlantic trench reports critical transmission failure, degrading global internet routing.",
    body: [
      "Global telecommunications operators experienced massive packet loss after Transatlantic Repeater Station #4 went dark at a depth of 3,420 meters.",
      "OceanicLink dispatch ships equipped with deep saturation diving equipment have been deployed to inspect the seabed fiber installation for signs of physical tampering or optical sensor overload.",
    ],
    triggerMissionId: "mission_9",
  },
  {
    id: "news_react_singularity_core",
    headline: "Global Autonomous Threat Network Collapses into Kernel Panic",
    source: "World Telemetry",
    category: "GLOBAL",
    timestamp: "Just now",
    summary:
      "Mysterious decentralized infrastructure network goes silent after core computational logic is severed in Arctic bedrock facility.",
    body: [
      "Cybersecurity watchdogs across the globe report that clandestine botnets, unauthorized fiber taps, and rogue SCADA listeners have ceased transmission simultaneously.",
      "Analysis suggests that an unhandled recursive logic contradiction in the central Ouroboros core forced an irreversible hardware meltdown at an undisclosed sub-zero facility.",
      "Global communication traffic has begun normalizing as the shadow network dissolves.",
    ],
    triggerMissionId: "mission_10",
    isBreaking: true,
  },
];

export const VELOX_EMPLOYEES: CorporateEmployee[] = [
  {
    id: "emp_velox_elena",
    name: "Elena Vance",
    role: "Co-Founder & Chief Executive Officer",
    department: "Executive Leadership",
    email: "elena@velox-ai.io",
    bio: "Former MIT cryptography researcher. Oversees Series-A capital allocation, sovereign enterprise partnerships, and corporate ethics board.",
    avatarSubject: "elena",
    isTarget: false,
  },
  {
    id: "emp_velox_marcus",
    name: "Marcus Cole",
    role: "Co-Founder & Chief Technology Officer",
    department: "Executive Leadership",
    email: "m.cole@velox-ai.io",
    bio: "Lead architect of the Velox v4 Neural Engine. Often posts technical updates on Chirper (@mcole_dev).",
    avatarSubject: "marcus",
    isTarget: true,
    emailClueId: "clue_marcus_email",
  },
  {
    id: "emp_velox_devon",
    name: "Devon Brooks",
    role: "Principal Infrastructure Architect & SRE Lead",
    department: "Cloud Engineering",
    email: "d.brooks@velox-ai.io",
    bio: "Oversees multi-region Kubernetes clusters and bare-metal GPU training topologies. Passionate about declarative infrastructure and low-latency message queues.",
    initials: "DB",
    isTarget: false,
  },
  {
    id: "emp_velox_priya",
    name: "Dr. Priya Nair",
    role: "Head of Algorithmic Safety & Alignment",
    department: "Ethics & Compliance",
    email: "p.nair@velox-ai.io",
    bio: "Directs neural weight safety audits and regulatory compliance against national AI governance charters. Former Oxford cognitive research fellow.",
    initials: "PN",
    isTarget: false,
  },
  {
    id: "emp_velox_lucas",
    name: "Lucas Meyer",
    role: "Senior Full-Stack Tooling Engineer",
    department: "Internal Platform",
    email: "l.meyer@velox-ai.io",
    bio: "Maintains internal developer observability consoles and telemetry visualization pipelines. Spends weekends contributing to open-source terminal emulators.",
    initials: "LM",
    isTarget: false,
  },
  {
    id: "emp_velox_chloe",
    name: "Chloe Zhao",
    role: "Director of People & Workplace Culture",
    department: "Human Resources",
    email: "c.zhao@velox-ai.io",
    bio: "Directs technical talent acquisition, employee health benefits, and cross-functional team coordination across San Francisco headquarters.",
    initials: "CZ",
    isTarget: false,
  },
];

export const AETHELGARD_EMPLOYEES: CorporateEmployee[] = [
  {
    id: "emp_aeth_sterling",
    name: "Director Julian Sterling",
    role: "VP Special Projects Division 0451",
    department: "Special Projects",
    email: "j.sterling@aethelgard.corp",
    bio: "Oversees classified neural-grid acquisitions and Project Mirror dispatches. Directs defense contractor integration and satellite reconnaissance.",
    avatarSubject: "sterling",
    isTarget: true,
    emailClueId: "clue_julian_email",
  },
  {
    id: "emp_aeth_reyes",
    name: "Chief Viktor Reyes",
    role: "Chief Security Officer, Facility Delta",
    department: "Perimeter Security & Counter-Intel",
    email: "v.reyes@aethelgard.corp",
    bio: "Former special operations commander. Enforces DEFCON 2 physical and SIGINT perimeter security doctrines across all sub-surface data compounds.",
    avatarSubject: "reyes",
    isTarget: true,
  },
  {
    id: "emp_aeth_rowan",
    name: "Rowan Bennett",
    role: "Senior Procurement & Supply Chain Specialist",
    department: "Hardware Logistics",
    email: "r.bennett@aethelgard.corp",
    bio: "Coordinates international defense hardware manifests, customs clearance for specialized optical transceivers, and titanium casing fabrication.",
    initials: "RB",
    isTarget: false,
  },
  {
    id: "emp_aeth_soren",
    name: "Soren Lind",
    role: "Lead Environmental Control & HVAC Systems Engineer",
    department: "Facility Operations",
    email: "s.lind@aethelgard.corp",
    bio: "Responsible for cleanroom pressurization, liquid nitrogen supercomputing cooling arrays, and auxiliary generator maintenance at Facility Delta.",
    initials: "SL",
    isTarget: false,
  },
  {
    id: "emp_aeth_mireille",
    name: "Mireille Fournier",
    role: "Senior Sovereign Regulatory Counsel",
    department: "Legal Affairs",
    email: "m.fournier@aethelgard.corp",
    bio: "Specializes in export compliance under the National Defense Assessment Act, classified intellectual property covenants, and non-disclosure governance.",
    initials: "MF",
    isTarget: false,
  },
  {
    id: "emp_aeth_erik",
    name: "Erik Vance",
    role: "Director of Government & Institutional Liaison",
    department: "Public Affairs",
    email: "e.vance@aethelgard.corp",
    bio: "Liaises with inter-agency defense committees and municipal infrastructure authorities regarding joint telemetry initiatives and public bulletins.",
    initials: "EV",
    isTarget: false,
  },
];

export const NORDGRID_EMPLOYEES: CorporateEmployee[] = [
  {
    id: "emp_nord_astrid",
    name: "Dr. Astrid Lindholm",
    role: "VP SCADA Systems & Grid Stability",
    department: "Grid Transmission",
    email: "a.lindholm@nordgrid-power.com",
    bio: "Oversees continental transformer balancing, automated Modbus frequency relays, and high-voltage transmission topologies across Sector 7.",
    initials: "AL",
    isTarget: true,
  },
  {
    id: "emp_nord_frederik",
    name: "Frederik Solberg",
    role: "Senior Transformer Relay Specialist",
    department: "Field Engineering",
    email: "f.solberg@nordgrid-power.com",
    bio: "Eighteen years of field experience in 400kV substation maintenance, dissolved gas analysis (DGA), and high-voltage breaker synchronization.",
    initials: "FS",
    isTarget: false,
  },
  {
    id: "emp_nord_ingrid",
    name: "Ingrid Dahl",
    role: "NERC-CIP Cyber Resilience Analyst",
    department: "Cybersecurity",
    email: "i.dahl@nordgrid-power.com",
    bio: "Monitors industrial control firewall access logs, rotational trip-key audits, and substation physical perimeter sensors.",
    initials: "ID",
    isTarget: false,
  },
];

export const OCEANICLINK_EMPLOYEES: CorporateEmployee[] = [
  {
    id: "emp_ocean_kai",
    name: "Kai Thorne",
    role: "Lead Subsea Saturation Diver",
    department: "Marine Operations",
    email: "k.thorne@oceaniclink-telecom.net",
    bio: "Specializes in deep hyperbaric saturation diving and deep-sea quantum key distribution (QKD) photonic repeaters across the North Atlantic trench.",
    initials: "KT",
    isTarget: true,
  },
  {
    id: "emp_ocean_nadia",
    name: "Nadia O'Connor",
    role: "Chief Marine Operations Navigator",
    department: "Vessel Operations",
    email: "n.oconnor@oceaniclink-telecom.net",
    bio: "Captains dynamic positioning deep-sea cable laying vessels. Oversees remote-operated vehicle (ROV) trenching and seabed acoustic telemetry.",
    initials: "NO",
    isTarget: false,
  },
  {
    id: "emp_ocean_sean",
    name: "Sean Gallagher",
    role: "Photonic Transponder & DWDM Calibration Tech",
    department: "Optical Systems",
    email: "s.gallagher@oceaniclink-telecom.net",
    bio: "Maintains transatlantic erbium-doped fiber amplifiers, optical spectral diagnostics, and terrestrial landing station multiplexers.",
    initials: "SG",
    isTarget: false,
  },
];
