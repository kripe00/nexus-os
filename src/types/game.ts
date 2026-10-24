export type AppId =
  | 'whisper'
  | 'intraweb'
  | 'passweaver'
  | 'terminal'
  | 'blackmarket'
  | 'files';

export interface Clue {
  id: string;
  label: string;       // e.g. "Pet Name"
  value: string;       // e.g. "Koda"
  targetPerson: string;// e.g. "Marcus Cole"
  category: 'personal' | 'date' | 'code' | 'ip' | 'credential';
  source: string;      // e.g. "Chirper @mcole_dev"
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
  securityLevel: 'LOW' | 'MEDIUM' | 'HIGH (ACTIVE TRACE)';
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
  category: 'EXPLOIT' | 'STEALTH' | 'UTILITY';
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
  sender: 'client' | 'player' | 'system';
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
