import { Clue, EmailAccount, Mission, ServerNode, ShopItem } from '../types/game';

export const ALL_CLUES: Record<string, Clue> = {
  // Mission 1 Clues (Marcus Cole)
  clue_marcus_email: {
    id: 'clue_marcus_email',
    label: 'Work Email',
    value: 'm.cole@velox-ai.io',
    targetPerson: 'Marcus Cole',
    category: 'credential',
    source: 'Velox AI Team Page',
  },
  clue_marcus_dog: {
    id: 'clue_marcus_dog',
    label: 'Dog Name',
    value: 'Koda',
    targetPerson: 'Marcus Cole',
    category: 'personal',
    source: 'Chirper @mcole_dev',
  },
  clue_marcus_year: {
    id: 'clue_marcus_year',
    label: 'Lucky Year',
    value: '1997',
    targetPerson: 'Marcus Cole',
    category: 'date',
    source: 'Chirper @mcole_dev',
  },
  // Found inside Marcus's email -> Unlocks Mission 1 completion & Mission 2 target
  clue_dropoff_ip: {
    id: 'clue_dropoff_ip',
    label: 'Dead-Drop Server IP',
    value: '198.51.100.42',
    targetPerson: 'Marcus Cole / Buyer',
    category: 'ip',
    source: 'WebMail Encrypted Draft',
  },

  // Mission 2 Clues (Found on Dead-Drop Server 198.51.100.42)
  clue_aethelgard_ip: {
    id: 'clue_aethelgard_ip',
    label: 'Aethelgard Vault IP',
    value: '203.0.113.88',
    targetPerson: 'Aethelgard Corp',
    category: 'ip',
    source: 'transfer_manifest.log',
  },

  // Mission 3 Clues (Dr. Julian Vance / Aethelgard Corp)
  clue_julian_email: {
    id: 'clue_julian_email',
    label: 'Director Email',
    value: 'j.sterling@aethelgard.corp',
    targetPerson: 'Director Julian Sterling',
    category: 'credential',
    source: 'Aethelgard Portal',
  },
  clue_julian_project: {
    id: 'clue_julian_project',
    label: 'Obsession / Boat Name',
    value: 'Hyperion',
    targetPerson: 'Director Julian Sterling',
    category: 'personal',
    source: 'Chirper @jsterling_exec',
  },
  clue_julian_badge: {
    id: 'clue_julian_badge',
    label: 'Division Code',
    value: '0451',
    targetPerson: 'Director Julian Sterling',
    category: 'code',
    source: 'Aethelgard Press Release',
  },
  clue_vault_override: {
    id: 'clue_vault_override',
    label: 'Vault Auth Token',
    value: 'OMEGA-99-KEY',
    targetPerson: 'Aethelgard Corp',
    category: 'credential',
    source: 'Julian Sterling WebMail',
  },
};

export const EMAIL_ACCOUNTS: Record<string, EmailAccount> = {
  'm.cole@velox-ai.io': {
    email: 'm.cole@velox-ai.io',
    ownerName: 'Marcus Cole (CTO, Velox AI)',
    password: 'Koda1997',
    hint: 'Pet name + Birth/Lucky year',
    requiredClueIds: ['clue_marcus_dog', 'clue_marcus_year'],
    inbox: [
      {
        id: 'msg_velox_1',
        from: 'elena@velox-ai.io',
        to: 'm.cole@velox-ai.io',
        subject: 'Series A Pitch Deck & Neural Weights',
        date: 'Oct 22, 18:14',
        body: `Marcus,\n\nI noticed you exported the v4 neural weights from the main repository last night. Are you running local benchmarks before Monday's investor demo?\n\nLet me know—the board is nervous enough as it is.\n\n— Elena`,
      },
      {
        id: 'msg_velox_2',
        from: 'vet@pacificpetcare.org',
        to: 'm.cole@velox-ai.io',
        subject: 'Vaccination Reminder for Koda',
        date: 'Oct 19, 09:30',
        body: `Hi Marcus! Just a friendly reminder that Koda is due for his annual checkup next week. See you soon!`,
      },
      {
        id: 'msg_velox_3',
        from: 'broker_77@darkmail.onion',
        to: 'm.cole@velox-ai.io',
        subject: 'RE: Acquisition of Velox Core Architecture',
        date: 'Oct 24, 02:11',
        body: `Mr. Cole,\n\nOur client has verified your sample. The $1.2M crypto escrow is locked and ready.\n\nUpload the full proprietary source archive (velox_core_v4.tar.gz) to our isolated staging node at IP: 198.51.100.42 via SSH (Port 22).\n\nOnce the file checksum is verified on that server, the funds will be released to your cold wallet. Do NOT contact us from this address again.`,
        clues: [ALL_CLUES.clue_dropoff_ip],
        attachment: {
          filename: 'escrow_agreement_signed.pdf',
          description: 'Cryptographic proof of illicit source code sale by Marcus Cole.',
        },
      },
    ],
  },
  'j.sterling@aethelgard.corp': {
    email: 'j.sterling@aethelgard.corp',
    ownerName: 'Julian Sterling (VP Special Projects, Aethelgard)',
    password: 'Hyperion0451',
    hint: 'Yacht/Project name + Division Code',
    requiredClueIds: ['clue_julian_project', 'clue_julian_badge'],
    inbox: [
      {
        id: 'msg_aeth_1',
        from: 'security-ops@aethelgard.corp',
        to: 'j.sterling@aethelgard.corp',
        subject: 'URGENT: Intrusion Detected on Staging Node 198.51.100.42',
        date: 'Today, 23:10',
        body: `Director Sterling,\n\nSomeone breached our external dead-drop server (198.51.100.42) and accessed the Velox AI transfer manifest.\n\nWe have migrated all sensitive Project Mirror dossiers to the internal high-security vault (IP: 203.0.113.88). Active Trace countermeasures are armed on Port 443.`,
        clues: [ALL_CLUES.clue_aethelgard_ip],
      },
      {
        id: 'msg_aeth_2',
        from: 'sysadmin@aethelgard.corp',
        to: 'j.sterling@aethelgard.corp',
        subject: 'Your Updated Vault Root Token',
        date: 'Today, 23:15',
        body: `Sir,\n\nPer protocol, the Aethelgard Internal Vault (203.0.113.88) now requires both port exploitation and your secondary authorization token stored in your profile.\n\nAuthorization Token: OMEGA-99-KEY\n\nRemember: Any unauthorized terminal session on 203.0.113.88 triggers an immediate neural-grid trace. Always run 'wipe_logs' before disconnecting.`,
        clues: [ALL_CLUES.clue_vault_override],
      },
    ],
  },
};

export const SERVER_NODES: Record<string, ServerNode> = {
  '198.51.100.42': {
    ip: '198.51.100.42',
    hostname: 'dropoff-node-09.darkhost.net',
    organization: 'Anonymous Offshore Relay',
    securityLevel: 'MEDIUM',
    requiredPort: 22,
    requiredToolId: 'ssh_breaker_v1',
    triggersTrace: false,
    traceSpeed: 0,
    files: [
      {
        name: 'readme.txt',
        size: '1.2 KB',
        content: `=== DARKHOST ISOLATED RELAY #09 ===\nAuthorized drop-off point. All transfers are purged every 72 hours.`,
      },
      {
        name: 'velox_core_v4.tar.gz',
        size: '428.5 MB',
        content: `[BINARY ARCHIVE - VELOX AI PROPRIETARY NEURAL ENGINE]\nStatus: Staged for buyer pickup.\nUploaded by user: mcole_dev`,
        isMissionEvidence: true,
        evidenceId: 'evidence_velox_source',
      },
      {
        name: 'transfer_manifest.log',
        size: '4.8 KB',
        content: `=== BUYER ROUTING MANIFEST ===\nSELLER: Marcus Cole (Velox AI)\nBUYER ENTITY: AETHELGARD CORP - DIVISION 0451 (BLACK-OPS AI)\nDIRECTOR IN CHARGE: Julian Sterling (j.sterling@aethelgard.corp)\nDESTINATION VAULT IP: 203.0.113.88\nPURPOSE: Integration into 'PROJECT MIRROR' mass predictive surveillance grid.`,
        isMissionEvidence: true,
        evidenceId: 'evidence_buyer_manifest',
        clues: [ALL_CLUES.clue_aethelgard_ip, ALL_CLUES.clue_julian_email],
      },
    ],
  },

  '203.0.113.88': {
    ip: '203.0.113.88',
    hostname: 'vault-core.aethelgard.corp',
    organization: 'Aethelgard Defense & Intelligence Systems',
    securityLevel: 'HIGH (ACTIVE TRACE)',
    requiredPort: 443,
    requiredToolId: 'ssl_zero_day_v2',
    triggersTrace: true,
    traceSpeed: 2.2, // ~45 seconds base (slower with ProxyShield)
    files: [
      {
        name: 'security_notice.txt',
        size: '0.9 KB',
        content: `WARNING: AETHELGARD HONEYPOT & TRACE GRID ACTIVE.\nAll terminal sessions are logged in /var/connection.log.\nUse 'wipe_logs' prior to disconnection or physical dispatch units will be alerted.`,
      },
      {
        name: 'velox_integration_notes.txt',
        size: '6.4 KB',
        content: `By combining Velox AI's predictive engine with our global ISP tap, Project Mirror can identify independent hackers and digital investigators before they even execute a payload.`,
      },
      {
        name: 'PROJECT_MIRROR_TARGETS.dec',
        size: '18.2 KB',
        content: `=== AETHELGARD CORP // PROJECT MIRROR: PRIORITY WATCHLIST ===\nClassification: EYES ONLY (Director J. Sterling)\n\nTarget #001: "ZERO" (Former Aethelgard Lead Architect - Rogue)\nStatus: At large. Actively recruiting freelance operatives.\n\nTarget #002: OPERATIVE HANDLE [NEXUS_USER // YOU]\nLocation: Triangulating subnet...\nAssessment: High-level OSINT & intrusion capability. Responsible for Velox AI leak interception.\nDirective: TERMINATE DIGITAL ACCESS IMMEDIATELY.\n\n[END OF CHAPTER 1 FILE]`,
        isMissionEvidence: true,
        evidenceId: 'evidence_project_mirror',
      },
    ],
  },
};

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'ssh_breaker_v1',
    name: 'SSH-Breaker',
    version: 'v1.4',
    price: 200,
    category: 'EXPLOIT',
    description: 'Brute-forces standard Port 22 SSH daemons on offshore and medium-security servers. Enables `crack 22` in Terminal.',
    iconName: 'Terminal',
  },
  {
    id: 'ssl_zero_day_v2',
    name: 'HyperSSL Zero-Day',
    version: 'v2.0',
    price: 450,
    category: 'EXPLOIT',
    description: 'Corporate-grade exploit targeting hardened HTTPS/SSL Port 443 vaults. Required to breach Aethelgard Corp servers (`crack 443`).',
    iconName: 'ShieldAlert',
  },
  {
    id: 'proxy_shield_v1',
    name: 'GhostRoute VPN Chain',
    version: 'v3.1',
    price: 250,
    category: 'STEALTH',
    description: 'Routes terminal traffic through 7 encrypted onion nodes, cutting enemy Active Trace speed by 50%.',
    iconName: 'GlobeLock',
  },
];

export const MISSIONS: Mission[] = [
  {
    id: 'mission_1',
    chapter: 1,
    title: 'Operation 01: Ghost in the Inbox',
    clientName: 'Elena Vance',
    clientHandle: '@elena_velox',
    clientAvatar: 'EV',
    reward: 250,
    summary: 'Investigate Velox AI co-founder Marcus Cole using OSINT, weave his personal clues to crack his WebMail password, and uncover where he is hiding the stolen neural engine.',
    initialMessages: [
      {
        id: 'm1_1',
        sender: 'client',
        senderName: 'Elena Vance',
        timestamp: '23:40',
        text: `Hey. A contact told me you're the best digital investigator on NexusOS—someone who can find answers without leaving footprints.`,
      },
      {
        id: 'm1_2',
        sender: 'client',
        senderName: 'Elena Vance',
        timestamp: '23:41',
        text: `I'm the CEO of Velox AI. Last night, my co-founder and CTO, Marcus Cole, downloaded a full copy of our proprietary AI engine. He claims he's just running tests, but I think he's selling us out.`,
      },
      {
        id: 'm1_3',
        sender: 'client',
        senderName: 'Elena Vance',
        timestamp: '23:41',
        text: `Can you look up "Marcus Cole" on IntraWeb? Check our company site (Velox AI) for his email address, snoop his Chirper social feed for personal details, and use your PassWeaver app to get into his WebMail inbox.`,
      },
    ],
    completionMessages: [
      {
        id: 'm1_done_1',
        sender: 'player',
        senderName: 'OPERATOR',
        timestamp: 'Now',
        text: `I'm inside Marcus's WebMail. Your instincts were right—he struck a $1.2M deal with an anonymous broker and uploaded the source code to an offshore server at 198.51.100.42.`,
      },
      {
        id: 'm1_done_2',
        sender: 'client',
        senderName: 'Elena Vance',
        timestamp: 'Now',
        text: `I knew it... Damn it, Marcus! Sending your 250 ◈ fee right now. Wait—can you actually break into that server (198.51.100.42) and find out WHO is buying our tech?`,
      },
    ],
    objectives: [
      {
        id: 'obj_m1_clues',
        description: 'Open IntraWeb & click highlighted clues on Velox AI and Chirper (Email, Pet Name, Lucky Year)',
      },
      {
        id: 'obj_m1_passweaver',
        description: 'Use PassWeaver to combine Marcus\'s clues and crack his password',
      },
      {
        id: 'obj_m1_webmail',
        description: 'Log into Marcus\'s WebMail on IntraWeb and click the Dead-Drop Server IP clue in his emails',
      },
    ],
  },
  {
    id: 'mission_2',
    chapter: 1,
    title: 'Operation 02: Dead Drop',
    clientName: 'Elena Vance',
    clientHandle: '@elena_velox',
    clientAvatar: 'EV',
    reward: 500,
    summary: 'Acquire SSH-Breaker from the BlackMarket, breach the offshore dead-drop server (198.51.100.42) via Smart Terminal, and download the buyer transfer manifest.',
    initialMessages: [
      {
        id: 'm2_1',
        sender: 'client',
        senderName: 'Elena Vance',
        timestamp: 'Now',
        text: `I've transferred 250 ◈ to your wallet. If we can prove who the buyer is and recover the manifest on 198.51.100.42, I'll pay you double (500 ◈).`,
      },
      {
        id: 'm2_2',
        sender: 'client',
        senderName: 'Elena Vance',
        timestamp: 'Now',
        text: `The broker mentioned SSH Port 22 in that email. Head to the BlackMarket app, buy 'SSH-Breaker v1.4', then open your Smart Terminal to scan, crack, and download the files on 198.51.100.42!`,
      },
    ],
    completionMessages: [
      {
        id: 'm2_done_1',
        sender: 'player',
        senderName: 'OPERATOR',
        timestamp: 'Now',
        text: `Got the manifest off 198.51.100.42. The buyer isn't a normal tech rival—it's Aethelgard Corp, Division 0451, led by Director Julian Sterling. They're feeding your AI into something called 'Project Mirror'.`,
      },
      {
        id: 'm2_done_2',
        sender: 'client',
        senderName: 'Elena Vance',
        timestamp: 'Now',
        text: `Aethelgard Defense?! That's a multi-billion dollar military contractor... Here is your 500 ◈. Be careful—someone else just pinged my encrypted relay looking for you.`,
      },
    ],
    objectives: [
      {
        id: 'obj_m2_buy_ssh',
        description: 'Buy "SSH-Breaker v1.4" (200 ◈) from the BlackMarket app',
      },
      {
        id: 'obj_m2_connect',
        description: 'In Smart Terminal, run `scan 198.51.100.42`, `crack 22`, and `connect 198.51.100.42`',
      },
      {
        id: 'obj_m2_download',
        description: 'Run `download transfer_manifest.log` in Terminal to expose the buyer',
      },
    ],
  },
  {
    id: 'mission_3',
    chapter: 1,
    title: 'Operation 03: Severance Package',
    clientName: 'ZERO [ENCRYPTED]',
    clientHandle: '@zero_signal',
    clientAvatar: 'ZR',
    reward: 1500,
    summary: 'Investigate Aethelgard Director Julian Sterling, breach Aethelgard Corp\'s high-security vault (203.0.113.88) under Active Trace, download PROJECT_MIRROR_TARGETS.dec, and wipe your connection logs before escaping.',
    initialMessages: [
      {
        id: 'm3_1',
        sender: 'client',
        senderName: 'ZERO [ENCRYPTED]',
        timestamp: 'Now',
        text: `[INCOMING ENCRYPTED OVERRIDE] Don't panic, Operator. I watched your breach on the offshore relay. Clean work.`,
      },
      {
        id: 'm3_2',
        sender: 'client',
        senderName: 'ZERO [ENCRYPTED]',
        timestamp: 'Now',
        text: `I used to build systems for Aethelgard Corp until I saw what Director Julian Sterling is doing with Project Mirror. Since you touched that relay, Aethelgard's algorithms are already profiling you.`,
      },
      {
        id: 'm3_3',
        sender: 'client',
        senderName: 'ZERO [ENCRYPTED]',
        timestamp: 'Now',
        text: `First: Snoop Julian Sterling on IntraWeb (Aethelgard Corp site + Chirper), crack his WebMail (j.sterling@aethelgard.corp), and grab his Vault Auth Token. Second: Buy 'HyperSSL Zero-Day' in BlackMarket (and 'GhostRoute VPN' if you want more time).`,
      },
      {
        id: 'm3_4',
        sender: 'client',
        senderName: 'ZERO [ENCRYPTED]',
        timestamp: 'Now',
        text: `Finally: Breach Aethelgard's Vault at 203.0.113.88. WARNING: Cracking Port 443 triggers an ACTIVE TRACE. You MUST download 'PROJECT_MIRROR_TARGETS.dec', run 'wipe_logs', and 'disconnect' before the trace hits 100%!`,
      },
    ],
    completionMessages: [
      {
        id: 'm3_done_1',
        sender: 'player',
        senderName: 'OPERATOR',
        timestamp: 'Now',
        text: `I extracted PROJECT_MIRROR_TARGETS.dec and wiped the connection logs with seconds to spare... Wait. My own handle is Target #002 on their kill-switch list!`,
      },
      {
        id: 'm3_done_2',
        sender: 'client',
        senderName: 'ZERO [ENCRYPTED]',
        timestamp: 'Now',
        text: `Now you see why I reached out. 1,500 ◈ transferred to your wallet. Welcome to the resistance, Operator. Get your rig ready—Chapter 2 begins soon.`,
      },
    ],
    objectives: [
      {
        id: 'obj_m3_sterling_mail',
        description: 'Find Julian Sterling\'s clues on IntraWeb, crack his WebMail, and collect his Vault Auth Token',
      },
      {
        id: 'obj_m3_buy_ssl',
        description: 'Buy "HyperSSL Zero-Day" (450 ◈) from BlackMarket',
      },
      {
        id: 'obj_m3_vault_breach',
        description: 'Breach 203.0.113.88 (`crack 443`), download `PROJECT_MIRROR_TARGETS.dec`, run `wipe_logs`, and `disconnect` before Trace hits 100%',
      },
    ],
  },
];
