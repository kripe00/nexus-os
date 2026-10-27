export type AppId =
  | "whisper"
  | "intraweb"
  | "passweaver"
  | "terminal"
  | "blackmarket"
  | "netshield"
  | "spearphish"
  | "packetsniffer"
  | "georelay"
  | "files"
  | "bountyboard";

export interface GeoRelayNode {
  id: string;
  ip: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  organization: string;
  role: "home" | "relay" | "target";
  pingMs: number;
}

export interface CapturedPacket {
  id: string;
  subnetId: string;
  timestamp: string;
  sourceIp: string;
  destIp: string;
  protocol: "HTTP" | "SMTP" | "TELNET" | "DNS" | "RF_RAW";
  summary: string;
  payloadPreview: string;
  rawHex: string;
  containsCredential?: boolean;
  extractedClueId?: string;
  credentialSnippet?: string;
}

export interface SnifferSubnet {
  id: string;
  name: string;
  subnetCidr: string;
  description: string;
  packets: CapturedPacket[];
}

export type MoralDecision = "honor" | "sell" | "leak";
export type MoralAlignment = "purge" | "hegemony" | "disclosure";
export type CamStatus = "off" | "active";
export type TerminalTheme = "default" | "amber_phosphor";

export interface ExfiltratedArchiveChoice {
  fileId: string;
  decision: MoralDecision;
  payoutBonus: number;
  timestamp: string;
}

export interface Clue {
  id: string;
  label: string; // e.g. "Pet Name"
  value: string; // e.g. "Koda"
  targetPerson: string; // e.g. "Marcus Cole"
  category: "personal" | "date" | "code" | "ip" | "credential";
  source: string; // e.g. "Chirper @mcole_dev"
  isDecoy?: boolean;
}

export interface EmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  body: string;
  clues?: Clue[];
  attachment?: {
    filename: string;
    description: string;
  };
}

export interface EmailAccount {
  email: string;
  ownerName: string;
  password: string;
  hint: string;
  requiredClueIds: string[]; // Clues that when combined in PassWeaver crack this password
  inbox: EmailMessage[];
}

export interface ServerFile {
  name: string;
  size: string;
  content: string;
  isMissionEvidence?: boolean;
  evidenceId?: string;
  clues?: Clue[];
}

export interface ServerNode {
  ip: string;
  hostname: string;
  organization: string;
  securityLevel: "LOW" | "MEDIUM" | "HIGH (ACTIVE TRACE)";
  requiredPort: number;
  requiredToolId: string; // e.g., 'ssh_breaker_v1' or 'corp_exploit_v2'
  adminPassword?: string; // If requires password or clue
  triggersTrace: boolean;
  traceSpeed: number; // % per second
  files: ServerFile[];
}

export interface ShopItem {
  id: string;
  name: string;
  version: string;
  price: number;
  category: "EXPLOIT" | "STEALTH" | "UTILITY";
  description: string;
  iconName: string;
}

export interface MissionObjective {
  id: string;
  description: string;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "client" | "player" | "system";
  senderName: string;
  timestamp: string;
  text: string;
}

export interface Mission {
  id: string;
  chapter: number;
  title: string;
  clientName: string;
  clientHandle: string;
  clientAvatar: string;
  reward: number;
  summary: string;
  initialMessages: ChatMessage[];
  completionMessages: ChatMessage[];
  objectives: {
    id: string;
    description: string;
  }[];
}

export interface BountyContract {
  id: string;
  title: string;
  clientHandle: string;
  clientName: string;
  rewardCrypto: number;
  difficulty: "STANDARD" | "HARD" | "ELITE";
  category: "FINANCIAL" | "INTEL" | "SABOTAGE" | "BLACK_OPS";
  briefing: string;
  targetDetails: {
    targetIp?: string;
    targetEmail?: string;
    organization: string;
  };
  objectives: {
    id: string;
    description: string;
  }[];
}

export type DifficultyPreset = "analyst" | "operative" | "ghost";

export interface SaveSlotProfile {
  id: string; // "slot_1", "slot_2", "slot_3"
  operatorHandle: string;
  difficulty: DifficultyPreset;
  updatedAt: string;
  currentMissionIndex: number;
  crypto: number;
  completedMissionsCount: number;
}

export type UiScaleOption = "100%" | "125%" | "150%";

export interface SystemSettings {
  crtMode: boolean;
  uiScale: UiScaleOption;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  muted: boolean;
}
