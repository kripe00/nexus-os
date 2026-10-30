import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ALL_CLUES,
  BOUNTY_CONTRACTS,
  EMAIL_ACCOUNTS,
  MISSIONS,
  SERVER_NODES,
  SHOP_ITEMS,
} from "../data/worldData";
import {
  AppId,
  CamStatus,
  ChatMessage,
  Clue,
  DifficultyPreset,
  ExfiltratedArchiveChoice,
  MoralAlignment,
  MoralDecision,
  SaveSlotProfile,
  ServerFile,
  UiScaleOption,
} from "../types/game";
import { ContextMenuGroup, ContextMenuState } from "../components/ContextMenu";
import { sound } from "../utils/sound";
import { voice } from "../utils/voice";

export type IntraWebPage =
  | "search"
  | "velox"
  | "chirper"
  | "aethelgard"
  | "webmail"
  | "nordgrid"
  | "oceaniclink"
  | "svalbard"
  | "darkforum";

export interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
}

interface GameContextType {
  // OS & Window Management
  windows: Record<AppId, WindowState>;
  activeApp: AppId;
  openApp: (id: AppId) => void;
  closeApp: (id: AppId) => void;
  minimizeApp: (id: AppId) => void;
  focusApp: (id: AppId) => void;
  moveWindow: (id: AppId, x: number, y: number) => void;
  minimizeAll: () => void;
  resetWindowPositions: () => void;
  centerWindow: (id: AppId) => void;
  sendToBack: (id: AppId) => void;

  // Context Menu System
  contextMenu: ContextMenuState;
  showContextMenu: (e: React.MouseEvent, groups: ContextMenuGroup[]) => void;
  hideContextMenu: () => void;

  // DataVault File Operations
  deleteDownloadedFile: (fileName: string) => void;
  inspectedFile: ServerFile | null;
  setInspectedFile: (file: ServerFile | null) => void;

  // Terminal Automation & Macro
  terminalCommandToRun: string | null;
  executeTerminalCommand: (cmd: string) => void;
  setTerminalCommandToRun: (cmd: string | null) => void;

  // GeoRelay Proxy Topology
  activeProxyChain: string[];
  toggleProxyNode: (nodeId: string) => void;

  // Cross-App Deep Linking (Clue Board -> App actions)
  browserPage: IntraWebPage;
  browserSearchQuery: string;
  webmailPrefillEmail: string;
  passWeaverTargetEmail: string;
  passWeaverSelectedClues: string[];
  terminalSelectedIp: string;
  navigateBrowser: (
    page: IntraWebPage,
    query?: string,
    prefillEmail?: string,
  ) => void;
  sendClueToApp: (clue: Clue) => void;
  togglePassWeaverClue: (clueId: string) => void;
  setPassWeaverTargetEmail: (email: string) => void;
  setTerminalSelectedIp: (ip: string) => void;

  // Player Progression & Economy
  crypto: number;
  addCrypto: (amount: number, reason?: string) => void;
  ownedTools: string[];
  buyTool: (itemId: string) => boolean;

  // Detective Clues & Passwords
  discoveredClues: Clue[];
  discoverClue: (clueId: string) => void;
  hasClue: (clueId: string) => boolean;
  crackedEmails: string[];
  markEmailCracked: (email: string) => void;
  loggedIntoEmails: string[];
  markEmailLoggedIn: (email: string) => void;

  // Server & Trace System
  scannedIps: string[];
  crackedPorts: Record<string, number[]>;
  connectedIp: string | null;
  downloadedFiles: ServerFile[];
  logsDirtyOnServer: Record<string, boolean>;
  traceActive: boolean;
  tracePercent: number;
  traceFailedAlert: boolean;
  dismissTraceAlert: () => void;

  // Server Actions
  markIpScanned: (ip: string) => void;
  markPortCracked: (ip: string, port: number) => void;
  connectToServer: (ip: string | null) => void;
  downloadServerFile: (file: ServerFile) => void;
  wipeServerLogs: (ip: string) => void;

  // Counter-Hack & Defense System
  underAttack: boolean;
  firewallHealth: number;
  honeypotActive: boolean;
  capturedAttackerIp: string | null;
  activateHoneypot: () => void;
  repairFirewall: () => void;

  // Social Engineering & SpearPhishing Engine
  successfulPhishes: string[];
  markPhishSuccess: (targetId: string) => void;

  // Interactive Mission & Chat State Machine
  currentMissionIndex: number;
  missionStage:
    | "briefing"
    | "accept_prompt"
    | "investigating"
    | "report_ready"
    | "reporting"
    | "completed";
  clientIsTyping: boolean;
  acceptCurrentMission: (replyText: string) => void;
  submitMissionReport: (reportText: string) => void;
  advanceToNextMission: () => void;
  completedMissionIds: string[];
  chatHistory: ChatMessage[];
  unreadMessages: number;
  isObjectiveComplete: (objId: string) => boolean;
  areAllObjectivesComplete: () => boolean;
  campaignFinished: boolean;

  // Operator Authentication (SQLite Backend Session)
  currentUser: { id: string; username: string } | null;
  login: (
    username: string,
    pass: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    username: string,
    pass: string,
  ) => Promise<{ success: boolean; error?: string }>;
  guestLogin: () => void;
  logout: () => void;

  // Audio Mixer Channels
  musicVolume: number;
  setMusicVolume: (vol: number) => void;
  sfxVolume: number;
  setSfxVolume: (vol: number) => void;

  // Freelance Bounties & Moral Endings
  completedBounties: string[];
  claimBounty: (bountyId: string) => void;
  chosenEnding: "purge" | "subjugate" | "leak" | null;
  chooseEnding: (ending: "purge" | "subjugate" | "leak") => void;

  // Moral Vectors & Exfiltrated Archive Monetization
  moralChoices: Record<string, ExfiltratedArchiveChoice>;
  handleMonetizeArchive: (fileId: string, decision: MoralDecision) => void;
  activeAlignment: MoralAlignment;
  traceSensitivityMultiplier: number;
  camStatus: CamStatus;

  // Notifications / Toasts
  notifications: {
    id: string;
    title: string;
    message: string;
    type: "clue" | "mission" | "warning";
  }[];
  addNotification: (
    title: string,
    message: string,
    type?: "clue" | "mission" | "warning",
  ) => void;
  resetGame: () => void;
  isMuted: boolean;
  toggleMute: () => void;

  // Game Settings & Accessibility
  difficulty: DifficultyPreset;
  setDifficulty: (diff: DifficultyPreset) => void;
  uiScale: UiScaleOption;
  setUiScale: (scale: UiScaleOption) => void;
  crtMode: boolean;
  setCrtMode: (enabled: boolean) => void;
  toggleCrtMode: () => void;
  osintHighlight: boolean;
  setOsintHighlight: (enabled: boolean) => void;
  toggleOsintHighlight: () => void;

  // Recon Hints
  requestClientHint: () => { hintText: string; cost: number } | null;

  // Drone Breach / Kernel Panic Fail-State
  droneBreachPanic: boolean;
  emergencyRebootSeconds: number;
  triggerEmergencyReboot: () => void;

  // Trace Lockout
  egressLockoutSeconds: number;

  // Profiles & Save Slots
  saveSlots: SaveSlotProfile[];
  activeSlotId: string | null;
  loadProfileSlot: (slotId: string) => void;
  createProfileSlot: (name: string, diff: DifficultyPreset) => void;
  deleteProfileSlot: (slotId: string) => void;
}

const INITIAL_WINDOWS: Record<AppId, WindowState> = {
  whisper: {
    id: "whisper",
    title: "WhisperChat",
    isOpen: true,
    isMinimized: false,
    zIndex: 20,
    position: { x: 145, y: 36 },
  },
  intraweb: {
    id: "intraweb",
    title: "IntraWeb Browser",
    isOpen: false,
    isMinimized: false,
    zIndex: 15,
    position: { x: 165, y: 42 },
  },
  passweaver: {
    id: "passweaver",
    title: "PassWeaver",
    isOpen: false,
    isMinimized: false,
    zIndex: 14,
    position: { x: 220, y: 70 },
  },
  terminal: {
    id: "terminal",
    title: "Terminal",
    isOpen: false,
    isMinimized: false,
    zIndex: 16,
    position: { x: 185, y: 55 },
  },
  blackmarket: {
    id: "blackmarket",
    title: "BlackMarket",
    isOpen: false,
    isMinimized: false,
    zIndex: 13,
    position: { x: 230, y: 65 },
  },
  netshield: {
    id: "netshield",
    title: "NetShield IDS",
    isOpen: false,
    isMinimized: false,
    zIndex: 17,
    position: { x: 200, y: 50 },
  },
  spearphish: {
    id: "spearphish",
    title: "SpearPhish",
    isOpen: false,
    isMinimized: false,
    zIndex: 15,
    position: { x: 215, y: 60 },
  },
  packetsniffer: {
    id: "packetsniffer",
    title: "PacketSniffer // WireTap",
    isOpen: false,
    isMinimized: false,
    zIndex: 18,
    position: { x: 240, y: 45 },
  },
  georelay: {
    id: "georelay",
    title: "GeoRelay // Network Topology",
    isOpen: false,
    isMinimized: false,
    zIndex: 18,
    position: { x: 190, y: 48 },
  },
  files: {
    id: "files",
    title: "DataVault",
    isOpen: false,
    isMinimized: false,
    zIndex: 12,
    position: { x: 260, y: 85 },
  },
  bountyboard: {
    id: "bountyboard",
    title: "BountyBoard // DarkNet Contracts",
    isOpen: false,
    isMinimized: false,
    zIndex: 16,
    position: { x: 210, y: 70 },
  },
};

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [windows, setWindows] =
    useState<Record<AppId, WindowState>>(INITIAL_WINDOWS);
  const [activeApp, setActiveApp] = useState<AppId>("whisper");
  const topZRef = useRef<number>(30);

  // Operator Account & Backend Session
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    username: string;
  } | null>(null);
  const [musicVolume, setMusicVolumeState] = useState<number>(0.7);
  const [sfxVolume, setSfxVolumeState] = useState<number>(0.8);

  // Settings & Accessibility
  const [difficulty, setDifficultyState] = useState<DifficultyPreset>(() => {
    const saved = localStorage.getItem("nexus_difficulty");
    return saved === "analyst" || saved === "ghost" ? saved : "operative";
  });
  const setDifficulty = (diff: DifficultyPreset) => {
    setDifficultyState(diff);
    localStorage.setItem("nexus_difficulty", diff);
    if (diff === "ghost") {
      setOsintHighlightState(false);
      localStorage.setItem("nexus_osint_highlight", "false");
    }
  };

  const [uiScale, setUiScaleState] = useState<UiScaleOption>(() => {
    const saved = localStorage.getItem("nexus_ui_scale");
    return saved === "125%" || saved === "150%"
      ? (saved as UiScaleOption)
      : "100%";
  });
  const setUiScale = (scale: UiScaleOption) => {
    setUiScaleState(scale);
    localStorage.setItem("nexus_ui_scale", scale);
  };

  const [crtMode, setCrtModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem("nexus_crt_mode");
    return saved !== null ? saved === "true" : true;
  });
  const setCrtMode = (enabled: boolean) => {
    setCrtModeState(enabled);
    localStorage.setItem("nexus_crt_mode", String(enabled));
  };
  const toggleCrtMode = () => setCrtMode(!crtMode);

  // OSINT Highlight / Scanner overlay (default: false for authentic unassisted detective recon)
  const [osintHighlightState, setOsintHighlightState] = useState<boolean>(
    () => {
      const saved = localStorage.getItem("nexus_osint_highlight");
      return saved !== null ? saved === "true" : false;
    },
  );
  const osintHighlight = difficulty === "ghost" ? false : osintHighlightState;
  const setOsintHighlight = (enabled: boolean) => {
    if (difficulty === "ghost") {
      setOsintHighlightState(false);
      localStorage.setItem("nexus_osint_highlight", "false");
      return;
    }
    setOsintHighlightState(enabled);
    localStorage.setItem("nexus_osint_highlight", String(enabled));
  };
  const toggleOsintHighlight = () => setOsintHighlight(!osintHighlight);

  // Save Slots Profile System (Offline-first + SQLite bridge)
  const [saveSlots, setSaveSlots] = useState<SaveSlotProfile[]>(() => {
    try {
      const stored = localStorage.getItem("nexus_save_slots");
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      {
        id: "slot_1",
        operatorHandle: "KODEX_01",
        difficulty: "operative",
        updatedAt: new Date().toLocaleDateString(),
        currentMissionIndex: 0,
        crypto: 50,
        completedMissionsCount: 0,
      },
      {
        id: "slot_2",
        operatorHandle: "EMPTY_SLOT",
        difficulty: "analyst",
        updatedAt: "",
        currentMissionIndex: 0,
        crypto: 50,
        completedMissionsCount: 0,
      },
      {
        id: "slot_3",
        operatorHandle: "EMPTY_SLOT",
        difficulty: "ghost",
        updatedAt: "",
        currentMissionIndex: 0,
        crypto: 50,
        completedMissionsCount: 0,
      },
    ];
  });
  const [activeSlotId, setActiveSlotId] = useState<string | null>(() => {
    return localStorage.getItem("nexus_active_slot") || null;
  });

  // Drone Breach / Kernel Panic Fail-State
  const [droneBreachPanic, setDroneBreachPanic] = useState<boolean>(false);
  const [emergencyRebootSeconds, setEmergencyRebootSeconds] =
    useState<number>(0);

  // Egress Lockout Fail-State
  const [egressLockoutSeconds, setEgressLockoutSeconds] = useState<number>(0);

  // Cross-App Deep-Link states
  const [browserPage, setBrowserPage] = useState<IntraWebPage>("search");
  const [browserSearchQuery, setBrowserSearchQuery] = useState<string>("");
  const [webmailPrefillEmail, setWebmailPrefillEmail] =
    useState<string>("m.cole@velox-ai.io");
  const [passWeaverTargetEmail, setPassWeaverTargetEmail] =
    useState<string>("m.cole@velox-ai.io");
  const [passWeaverSelectedClues, setPassWeaverSelectedClues] = useState<
    string[]
  >([]);
  const [terminalSelectedIp, setTerminalSelectedIp] =
    useState<string>("198.51.100.42");

  const [crypto, setCrypto] = useState<number>(50);
  const [ownedTools, setOwnedTools] = useState<string[]>([]);
  const [discoveredClues, setDiscoveredClues] = useState<Clue[]>([]);
  const [crackedEmails, setCrackedEmails] = useState<string[]>([]);
  const [loggedIntoEmails, setLoggedIntoEmails] = useState<string[]>([]);

  const [scannedIps, setScannedIps] = useState<string[]>([]);
  const [crackedPorts, setCrackedPorts] = useState<Record<string, number[]>>(
    {},
  );
  const [connectedIp, setConnectedIp] = useState<string | null>(null);
  const [downloadedFiles, setDownloadedFiles] = useState<ServerFile[]>([]);
  const [logsDirtyOnServer, setLogsDirtyOnServer] = useState<
    Record<string, boolean>
  >({});

  const [traceActive, setTraceActive] = useState<boolean>(false);
  const [tracePercent, setTracePercent] = useState<number>(0);
  const [traceFailedAlert, setTraceFailedAlert] = useState<boolean>(false);

  // Counter-Hack & Defense State
  const [underAttack, setUnderAttack] = useState<boolean>(false);
  const [firewallHealth, setFirewallHealth] = useState<number>(100);
  const [honeypotActive, setHoneypotActive] = useState<boolean>(false);
  const [capturedAttackerIp, setCapturedAttackerIp] = useState<string | null>(
    null,
  );

  // SpearPhishing Engine State
  const [successfulPhishes, setSuccessfulPhishes] = useState<string[]>([]);

  // Moral Choices & Exfiltration Monetization State
  const [moralChoices, setMoralChoices] = useState<
    Record<string, ExfiltratedArchiveChoice>
  >({});
  const [traceSensitivityMultiplier, setTraceSensitivityMultiplier] =
    useState<number>(1.0);
  const [camStatus, setCamStatus] = useState<CamStatus>("off");

  // Dynamic Alignment Computation
  const activeAlignment: MoralAlignment = (() => {
    let purge = 0;
    let hegemony = 0;
    let disclosure = 0;
    Object.values(moralChoices).forEach((mc) => {
      if (mc.decision === "honor") purge++;
      else if (mc.decision === "sell") hegemony++;
      else if (mc.decision === "leak") disclosure++;
    });
    if (hegemony > purge && hegemony >= disclosure) return "hegemony";
    if (disclosure > purge && disclosure > hegemony) return "disclosure";
    return "purge";
  })();

  // GeoRelay Multi-Hop Proxy Chain
  const [activeProxyChain, setActiveProxyChain] = useState<string[]>([
    "node_zurich",
    "node_montreal",
  ]);

  const toggleProxyNode = (nodeId: string) => {
    sound.playRouteHop();
    setActiveProxyChain((prev) => {
      if (prev.includes(nodeId)) {
        return prev.filter((id) => id !== nodeId);
      } else {
        if (prev.length >= 4) {
          addNotification(
            "Proxy Circuit Full",
            "Maximum 4 relay hops active simultaneously.",
            "warning",
          );
          return prev;
        }
        return [...prev, nodeId];
      }
    });
  };

  const [currentMissionIndex, setCurrentMissionIndex] = useState<number>(0);
  const [missionStage, setMissionStage] = useState<
    | "briefing"
    | "accept_prompt"
    | "investigating"
    | "report_ready"
    | "reporting"
    | "completed"
  >("briefing");
  const [clientIsTyping, setClientIsTyping] = useState<boolean>(false);
  const [completedMissionIds, setCompletedMissionIds] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [campaignFinished, setCampaignFinished] = useState<boolean>(false);
  const [loadedFromSave, setLoadedFromSave] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<
    {
      id: string;
      title: string;
      message: string;
      type: "clue" | "mission" | "warning";
    }[]
  >([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Freelance Bounties & Moral Endings
  const [completedBounties, setCompletedBounties] = useState<string[]>([]);
  const [chosenEnding, setChosenEnding] = useState<
    "purge" | "subjugate" | "leak" | null
  >(null);

  const claimBounty = (bountyId: string) => {
    if (completedBounties.includes(bountyId)) return;
    const bounty = BOUNTY_CONTRACTS.find((b) => b.id === bountyId);
    if (!bounty) return;
    sound.playCryptoCoin();
    voice.notifyBountyCleared();
    setCompletedBounties((prev) => [...prev, bountyId]);
    setCrypto((c) => c + bounty.rewardCrypto);
    addNotification(
      `Bounty Claimed: +${bounty.rewardCrypto} ◈`,
      `${bounty.title} verified and funds deposited.`,
      "mission",
    );
  };

  const chooseEnding = (ending: "purge" | "subjugate" | "leak") => {
    sound.playSuccess();
    voice.speak("Campaign resolution locked. World status updated.", {
      priority: true,
    });
    setChosenEnding(ending);
    setCampaignFinished(true);
    if (ending === "subjugate") {
      setCrypto((c) => c + 100000);
      addNotification(
        "Clandestine Continuity",
        "+100,000 ◈ Slush Fund Siphoned. Shadow hegemony established.",
        "mission",
      );
    } else if (ending === "purge") {
      addNotification(
        "Total Certificate Revocation",
        "Sovereign PKI revoked. Ouroboros purged from continental backbones.",
        "mission",
      );
    } else {
      addNotification(
        "Unredacted Global Disclosure",
        "All sovereign surveillance models and records leaked to the public domain.",
        "mission",
      );
    }
  };

  const applySavedState = (saved: any) => {
    if (!saved) return;
    if (typeof saved.crypto === "number") setCrypto(saved.crypto);
    if (Array.isArray(saved.ownedTools)) setOwnedTools(saved.ownedTools);
    if (Array.isArray(saved.discoveredClues))
      setDiscoveredClues(saved.discoveredClues);
    if (Array.isArray(saved.crackedEmails))
      setCrackedEmails(saved.crackedEmails);
    if (Array.isArray(saved.loggedIntoEmails))
      setLoggedIntoEmails(saved.loggedIntoEmails);
    if (Array.isArray(saved.scannedIps)) setScannedIps(saved.scannedIps);
    if (saved.crackedPorts) setCrackedPorts(saved.crackedPorts);
    if (Array.isArray(saved.downloadedFiles))
      setDownloadedFiles(saved.downloadedFiles);
    let effectiveIndex =
      typeof saved.currentMissionIndex === "number"
        ? saved.currentMissionIndex
        : 0;
    const completedIds = Array.isArray(saved.completedMissionIds)
      ? saved.completedMissionIds
      : [];

    // If mission_3 was completed, advance to 3 (Chapter 2: Orbital Eye)
    if (completedIds.includes("mission_3") && effectiveIndex <= 2) {
      effectiveIndex = 3;
    }

    setCurrentMissionIndex(effectiveIndex);
    setCompletedMissionIds(completedIds);

    // Only allow campaignFinished if at the final operation (Operation 10)
    const isReallyCampaignFinished =
      Boolean(saved.campaignFinished) && effectiveIndex >= MISSIONS.length - 1;
    setCampaignFinished(isReallyCampaignFinished);

    if (saved.missionStage) {
      if (
        saved.missionStage === "completed" &&
        effectiveIndex < MISSIONS.length - 1
      ) {
        setMissionStage("briefing");
      } else {
        setMissionStage(saved.missionStage);
      }
    }

    if (Array.isArray(saved.chatHistory) && saved.chatHistory.length > 0) {
      setChatHistory(saved.chatHistory);
    }
    if (typeof saved.firewallHealth === "number")
      setFirewallHealth(saved.firewallHealth);
    if (typeof saved.honeypotActive === "boolean")
      setHoneypotActive(saved.honeypotActive);
    if (
      typeof saved.capturedAttackerIp === "string" ||
      saved.capturedAttackerIp === null
    ) {
      setCapturedAttackerIp(saved.capturedAttackerIp);
    }
    if (Array.isArray(saved.successfulPhishes))
      setSuccessfulPhishes(saved.successfulPhishes);
    if (Array.isArray(saved.activeProxyChain))
      setActiveProxyChain(saved.activeProxyChain);
    if (Array.isArray(saved.completedBounties))
      setCompletedBounties(saved.completedBounties);
    if (saved.chosenEnding) setChosenEnding(saved.chosenEnding);
  };

  const applyAudioSettings = (audio: {
    musicVolume?: number;
    sfxVolume?: number;
    muted?: boolean;
  }) => {
    if (!audio) return;
    if (typeof audio.musicVolume === "number") {
      setMusicVolumeState(audio.musicVolume);
      sound.setMusicVolume(audio.musicVolume);
    }
    if (typeof audio.sfxVolume === "number") {
      setSfxVolumeState(audio.sfxVolume);
      sound.setSfxVolume(audio.sfxVolume);
    }
    if (typeof audio.muted === "boolean") {
      sound.muted = audio.muted;
      setIsMuted(audio.muted);
    }
  };

  const setMusicVolume = (vol: number) => {
    setMusicVolumeState(vol);
    sound.setMusicVolume(vol);
    if (currentUser && !currentUser.id.startsWith("guest_")) {
      fetch("/api/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          musicVolume: vol,
          sfxVolume,
          muted: sound.muted,
        }),
      }).catch(() => {});
    }
  };

  const setSfxVolume = (vol: number) => {
    setSfxVolumeState(vol);
    sound.setSfxVolume(vol);
    if (currentUser && !currentUser.id.startsWith("guest_")) {
      fetch("/api/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          musicVolume,
          sfxVolume: vol,
          muted: sound.muted,
        }),
      }).catch(() => {});
    }
  };

  // Auto-resume active session on initial mount
  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
          if (data.save) applySavedState(data.save);
          if (data.audio) applyAudioSettings(data.audio);
          setLoadedFromSave(true);
        }
      })
      .catch(() => {});
  }, []);

  const resetLocalGameState = () => {
    setCrypto(50);
    setOwnedTools([]);
    setDiscoveredClues([]);
    setCrackedEmails([]);
    setLoggedIntoEmails([]);
    setScannedIps([]);
    setCrackedPorts({});
    setConnectedIp(null);
    setDownloadedFiles([]);
    setLogsDirtyOnServer({});
    setTraceActive(false);
    setTracePercent(0);
    setUnderAttack(false);
    setFirewallHealth(100);
    setHoneypotActive(false);
    setCapturedAttackerIp(null);
    setSuccessfulPhishes([]);
    setMoralChoices({});
    setTraceSensitivityMultiplier(1.0);
    setCamStatus("off");
    setActiveProxyChain(["node_zurich", "node_montreal"]);
    setCompletedBounties([]);
    setChosenEnding(null);
    setCurrentMissionIndex(0);
    setMissionStage("briefing");
    setCompletedMissionIds([]);
    setChatHistory([]);
    setCampaignFinished(false);
    setWindows(INITIAL_WINDOWS);
    setActiveApp("whisper");
    setBrowserPage("search");
    setBrowserSearchQuery("");
  };

  const login = async (username: string, pass: string) => {
    resetLocalGameState();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password: pass }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error };
    }
    setCurrentUser(data.user);
    if (data.save) {
      applySavedState(data.save);
    }
    if (data.audio) {
      applyAudioSettings(data.audio);
    }
    setLoadedFromSave(true);
    return { success: true };
  };

  const register = async (username: string, pass: string) => {
    resetLocalGameState();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password: pass }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error };
    }
    setCurrentUser(data.user);
    if (data.audio) {
      applyAudioSettings(data.audio);
    }
    setLoadedFromSave(true);
    return { success: true };
  };

  const guestLogin = async () => {
    resetLocalGameState();
    try {
      const res = await fetch("/api/auth/guest", { method: "POST" });
      const data = await res.json();
      setCurrentUser(data.user);
    } catch {
      const guestId = `guest_${Math.floor(1000 + Math.random() * 9000)}`;
      setCurrentUser({
        id: guestId,
        username: `OPERATOR_${guestId.slice(-4)}`,
      });
    }
    setLoadedFromSave(true);
  };

  const logout = () => {
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setCurrentUser(null);
    setLoadedFromSave(false);
    resetLocalGameState();
  };

  const createProfileSlot = (name: string, diff: DifficultyPreset) => {
    const slotId = activeSlotId || "slot_1";
    const cleanHandle =
      name.trim() || `OPERATOR_${Math.floor(1000 + Math.random() * 9000)}`;
    const newProfile: SaveSlotProfile = {
      id: slotId,
      operatorHandle: cleanHandle,
      difficulty: diff,
      updatedAt: new Date().toLocaleDateString(),
      currentMissionIndex: 0,
      crypto: 50,
      completedMissionsCount: 0,
    };

    setDifficulty(diff);
    setCurrentUser({ id: slotId, username: cleanHandle });
    setActiveSlotId(slotId);
    localStorage.setItem("nexus_active_slot", slotId);

    setSaveSlots((prev) => {
      const updated = prev.map((s) => (s.id === slotId ? newProfile : s));
      localStorage.setItem("nexus_save_slots", JSON.stringify(updated));
      return updated;
    });

    resetLocalGameState();
    setLoadedFromSave(true);
    sound.playSuccess();
    addNotification(
      "Operator Rig Initialized",
      `Dossier created for ${cleanHandle} [${diff.toUpperCase()}].`,
      "mission",
    );
  };

  const loadProfileSlot = (slotId: string) => {
    const slot = saveSlots.find((s) => s.id === slotId);
    if (!slot || slot.operatorHandle === "EMPTY_SLOT") {
      createProfileSlot(`OPERATOR_${slotId.slice(-1)}`, "operative");
      return;
    }

    resetLocalGameState();
    setDifficulty(slot.difficulty);
    setCurrentUser({ id: slot.id, username: slot.operatorHandle });
    setActiveSlotId(slot.id);
    localStorage.setItem("nexus_active_slot", slot.id);

    try {
      const rawData = localStorage.getItem("nexus_save_data_" + slot.id);
      if (rawData) {
        const parsed = JSON.parse(rawData);
        applySavedState(parsed);
      }
    } catch {}

    setLoadedFromSave(true);
    sound.playSuccess();
    addNotification(
      "Dossier Loaded",
      `Resumed operator session: ${slot.operatorHandle}`,
      "mission",
    );
  };

  const deleteProfileSlot = (slotId: string) => {
    localStorage.removeItem("nexus_save_data_" + slotId);
    setSaveSlots((prev) => {
      const updated = prev.map((s) =>
        s.id === slotId
          ? {
              ...s,
              operatorHandle: "EMPTY_SLOT",
              updatedAt: "",
              currentMissionIndex: 0,
              crypto: 50,
              completedMissionsCount: 0,
            }
          : s,
      );
      localStorage.setItem("nexus_save_slots", JSON.stringify(updated));
      return updated;
    });

    if (activeSlotId === slotId) {
      setActiveSlotId(null);
      localStorage.removeItem("nexus_active_slot");
      setCurrentUser(null);
      resetLocalGameState();
    }

    sound.playTrashPurge();
    addNotification(
      "Slot Cleared",
      `Profile slot ${slotId} was purged.`,
      "warning",
    );
  };

  const requestClientHint = (): { hintText: string; cost: number } | null => {
    if (difficulty === "ghost") {
      sound.playError();
      addNotification(
        "Recon Blocked",
        "Live client telemetry hints are disabled on Zero-Ghost difficulty.",
        "warning",
      );
      return null;
    }

    const currentMission = MISSIONS[currentMissionIndex];
    if (!currentMission || missionStage !== "investigating") {
      sound.playError();
      addNotification(
        "No Active Recon",
        "Accept the contract before requesting client intelligence.",
        "warning",
      );
      return null;
    }

    const cost = difficulty === "analyst" ? 0 : Math.min(crypto, 50);
    if (cost > 0) {
      setCrypto((c) => Math.max(0, c - cost));
    }

    const nextObj = currentMission.objectives.find(
      (o) => !isObjectiveComplete(o.id),
    );
    let hintMsg = "";

    if (currentMissionIndex === 0) {
      if (!isObjectiveComplete("obj_m1_clues")) {
        hintMsg = `${currentMission.clientName}: Marcus posts constantly on Chirper (@mcole_dev). Search 'Marcus Cole' on IntraWeb, browse his feed, and click his dog's name (Koda) and lucky year (1997) to extract them to your Clue Board.`;
      } else if (!isObjectiveComplete("obj_m1_passweaver")) {
        hintMsg = `${currentMission.clientName}: Open PassWeaver from your taskbar. Select m.cole@velox-ai.io, inject the Koda and 1997 clues into the permutation slots, and hit Synthesize to derive his password.`;
      } else {
        hintMsg = `${currentMission.clientName}: Open Nexus WebMail in IntraWeb, log in with Marcus's synthesized password, and read his unread threads for the offshore drop-off IP.`;
      }
    } else if (currentMissionIndex === 1) {
      if (!ownedTools.includes("ssh_breaker_v1")) {
        hintMsg = `${currentMission.clientName}: The offshore dead-drop runs hardened SSH on Port 22. Open BlackMarket and acquire 'SSH-Breaker v1.4' for 200 ◈.`;
      } else if (!crackedPorts["198.51.100.42"]?.includes(22)) {
        hintMsg = `${currentMission.clientName}: Open Smart Terminal. Execute 'scan 198.51.100.42', then 'crack 22' to inject your SSH-Breaker payload.`;
      } else {
        hintMsg = `${currentMission.clientName}: Connect to 198.51.100.42 in Terminal ('connect 198.51.100.42'), execute 'ls', and 'download transfer_manifest.log' to capture proof of Aethelgard's involvement.`;
      }
    } else if (currentMissionIndex === 2) {
      if (!discoveredClues.some((c) => c.id === "clue_vault_override")) {
        hintMsg = `${currentMission.clientName}: Director Julian Sterling controls the vault keys. Search his Chirper posts (@jsterling_exec) for his yacht name and military division, crack his WebMail, and extract the 'OMEGA-99-KEY'.`;
      } else {
        hintMsg = `${currentMission.clientName}: Arm yourself with HyperSSL Zero-Day from the BlackMarket, then breach 203.0.113.88 on Port 443. Download the dossier, run 'wipe_logs', and disconnect before the 100% active trace!`;
      }
    } else {
      hintMsg = `${currentMission.clientName}: Focus on objective: "${nextObj?.description || "Gather remaining evidence"}". Cross-reference targets on IntraWeb, extract credentials with PassWeaver or SpearPhish, and monitor your port scans.`;
    }

    const hintChatMessage: ChatMessage = {
      id: `hint_${Date.now()}`,
      sender: "client",
      senderName: currentMission.clientName,
      timestamp: "Now",
      text: `[ENCRYPTED CLIENT RECON INTEL // -${cost} ◈]: ${hintMsg}`,
    };

    sound.playHintReceived();
    setChatHistory((prev) => [...prev, hintChatMessage]);
    addNotification(
      "Recon Intel Received",
      `New advisory from ${currentMission.clientName} delivered to WhisperChat.`,
      "clue",
    );

    return { hintText: hintMsg, cost };
  };

  // Sync state changes with SQLite backend & localStorage (debounced)
  useEffect(() => {
    if (!loadedFromSave || !currentUser) return;
    const timeout = setTimeout(() => {
      const data = {
        crypto,
        addCrypto,
        ownedTools,
        discoveredClues,
        crackedEmails,
        loggedIntoEmails,
        scannedIps,
        crackedPorts,
        downloadedFiles,
        currentMissionIndex,
        missionStage,
        completedMissionIds,
        chatHistory,
        campaignFinished,
        activeProxyChain,
        firewallHealth,
        honeypotActive,
        capturedAttackerIp,
        successfulPhishes,
        completedBounties,
        chosenEnding,
      };

      // 1. Offline-first localStorage persistence
      try {
        localStorage.setItem(
          "nexus_save_data_" + currentUser.id,
          JSON.stringify(data),
        );
        setSaveSlots((prev) => {
          const updated = prev.map((s) =>
            s.id === currentUser.id
              ? {
                  ...s,
                  operatorHandle: currentUser.username,
                  difficulty,
                  updatedAt: new Date().toLocaleDateString(),
                  currentMissionIndex,
                  crypto,
                  completedMissionsCount: completedMissionIds.length,
                }
              : s,
          );
          localStorage.setItem("nexus_save_slots", JSON.stringify(updated));
          return updated;
        });
      } catch {}

      // 2. Synchronize with SQLite if backend is available
      fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, state: data }),
      }).catch(() => {});
    }, 400);
    return () => clearTimeout(timeout);
  }, [
    loadedFromSave,
    currentUser,
    crypto,
    ownedTools,
    discoveredClues,
    crackedEmails,
    loggedIntoEmails,
    scannedIps,
    crackedPorts,
    downloadedFiles,
    currentMissionIndex,
    missionStage,
    completedMissionIds,
    chatHistory,
    campaignFinished,
    activeProxyChain,
    firewallHealth,
    honeypotActive,
    capturedAttackerIp,
    successfulPhishes,
    completedBounties,
    chosenEnding,
    difficulty,
  ]);

  // Step-by-step Briefing Message Streamer (when missionStage === 'briefing')
  useEffect(() => {
    if (!loadedFromSave) return;
    if (missionStage !== "briefing") return;

    const mission = MISSIONS[currentMissionIndex];
    if (!mission) return;

    // Check which initialMessages are not yet in chatHistory
    const remaining = mission.initialMessages.filter(
      (m) => !chatHistory.some((existing) => existing.id === m.id),
    );

    if (remaining.length === 0) {
      setClientIsTyping(false);
      setMissionStage("accept_prompt");
      return;
    }

    setClientIsTyping(true);
    const nextMsg = remaining[0];
    const timer = setTimeout(() => {
      sound.playMessage();
      if (nextMsg.sender !== "player" && nextMsg.sender !== "system") {
        voice.notifyTransmission(nextMsg.senderName);
      }
      setChatHistory((prev) => {
        if (prev.some((p) => p.id === nextMsg.id)) return prev;
        return [...prev, nextMsg];
      });
      if (activeApp !== "whisper") {
        setUnreadMessages((u) => u + 1);
      }
    }, 1100);

    return () => clearTimeout(timer);
  }, [
    loadedFromSave,
    missionStage,
    currentMissionIndex,
    chatHistory,
    activeApp,
  ]);

  const addNotification = (
    title: string,
    message: string,
    type: "clue" | "mission" | "warning" = "clue",
  ) => {
    const id = `${Date.now()}-${Math.random()}`;
    setNotifications((prev) => [
      ...prev.slice(-3),
      { id, title, message, type },
    ]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  };

  // Active Attack Simulation during Operation 07 and Operation 10 (Svalbard Bunker Defense)
  useEffect(() => {
    if (
      (currentMissionIndex === 6 || currentMissionIndex === 9) &&
      !campaignFinished
    ) {
      setUnderAttack(true);
      setCamStatus("active");
      sound.playDroneRotors();
      voice.notifyUnderAttack();
    } else {
      setUnderAttack(false);
      setCamStatus("off");
      sound.stopDroneRotors();
    }
    return () => {
      sound.stopDroneRotors();
    };
  }, [currentMissionIndex, campaignFinished]);

  // SCADA 60Hz Grid Hum during Operation 08 (NordGrid SCADA Overload)
  useEffect(() => {
    if (currentMissionIndex === 7 && !campaignFinished) {
      sound.play60HzGridHum(false);
    } else {
      sound.stop60HzGridHum();
    }
    return () => {
      sound.stop60HzGridHum();
    };
  }, [currentMissionIndex, campaignFinished]);

  // Archive Monetization / Moral Vector Decision Handler
  const handleMonetizeArchive = (fileId: string, decision: MoralDecision) => {
    if (moralChoices[fileId]) return;

    const PAYOUT_TIERS: Record<string, number> = {
      "velox_core_v4.tar.gz": 350,
      "PROJECT_MIRROR_TARGETS.dec": 750,
      "GLOBAL_CITIZEN_DOSSIERS.db": 2000,
    };

    let bonus = 0;
    if (decision === "sell") {
      bonus = PAYOUT_TIERS[fileId] || 500;
      setCrypto((prev) => prev + bonus);
      setTraceSensitivityMultiplier((prev) => +(prev + 0.15).toFixed(2));
      sound.playCryptoCoin();
      addNotification(
        "[!] DARKNET SIGNATURE FLAGGED",
        `Exfiltrated archive sold to Darknet broker (+${bonus} ◈). Enemy trace sensitivity increased (+15%).`,
        "warning",
      );
    } else if (decision === "leak") {
      setTraceSensitivityMultiplier((prev) => +(prev + 0.15).toFixed(2));
      sound.playSuccess();
      addNotification(
        "[!] PUBLIC DISCLOSURE ALERT",
        `Archive leaked to 0xUnderground mirrors! Enemy trace sensitivity increased (+15%).`,
        "warning",
      );
    } else {
      sound.playSuccess();
      addNotification(
        "[*] CONTRACT HONORED",
        `Archive encrypted in secure offline vault. Network footprint clean.`,
        "mission",
      );
    }

    setMoralChoices((prev) => ({
      ...prev,
      [fileId]: {
        fileId,
        decision,
        payoutBonus: bonus,
        timestamp: new Date().toISOString(),
      },
    }));
  };

  // Firewall health degradation when under attack
  useEffect(() => {
    if (!underAttack) return;
    const interval = setInterval(() => {
      setFirewallHealth((prev) => {
        const decay = honeypotActive ? 0.8 : 2.2;
        const next = Math.max(0, +(prev - decay).toFixed(1));
        if (Math.floor(next) % 10 === 0) {
          sound.playTraceTick(next < 30);
        }
        if (next <= 0) {
          sound.playKernelPanic();
          setDroneBreachPanic(true);
          setEmergencyRebootSeconds(15);
          addNotification(
            "CRITICAL FIREWALL BREACH",
            "Hostile combat drone bypassed local port filters! Manual hardware reboot required within 15s!",
            "warning",
          );
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [underAttack, honeypotActive]);

  // Drone Breach Panic countdown effect
  useEffect(() => {
    if (!droneBreachPanic) return;
    const interval = setInterval(() => {
      setEmergencyRebootSeconds((prev) => {
        if (prev <= 1) {
          sound.playError();
          setDroneBreachPanic(false);
          setCrypto((c) => Math.max(0, c - 200));
          setConnectedIp(null);
          setFirewallHealth(35);
          addNotification(
            "EMERGENCY LOCKDOWN TIMEOUT",
            "Hostile drone penetrated local bus! Siphoned 200 ◈ and severed active links. Emergency circuits restored to 35%.",
            "warning",
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [droneBreachPanic]);

  const triggerEmergencyReboot = () => {
    sound.playEmergencyReboot();
    setDroneBreachPanic(false);
    setEmergencyRebootSeconds(0);
    setFirewallHealth(40);
    addNotification(
      "CIRCUIT PURGED",
      "Local hardware buffers purged and restored to 40% integrity.",
      "mission",
    );
  };

  // Egress Lockout countdown timer
  useEffect(() => {
    if (egressLockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setEgressLockoutSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [egressLockoutSeconds]);

  const activateHoneypot = () => {
    setHoneypotActive(true);
    setCapturedAttackerIp("141.98.11.200");
    sound.playHoneypotTrap();
    voice.notifyDroneCaptured();
    setDiscoveredClues((prev) => {
      if (prev.some((c) => c.id === "clue_hunter_drone_ip")) return prev;
      const droneClue = ALL_CLUES.clue_hunter_drone_ip;
      return droneClue ? [...prev, droneClue] : prev;
    });
    addNotification(
      "Honeypot Active",
      "Attacker isolated: 141.98.11.200 trapped!",
      "mission",
    );
  };

  const repairFirewall = () => {
    setFirewallHealth((prev) => Math.min(100, prev + 35));
    addNotification(
      "Firewall Reinforced",
      "Integrity restored +35%",
      "mission",
    );
  };

  const markPhishSuccess = (targetId: string) => {
    if (!successfulPhishes.includes(targetId)) {
      setSuccessfulPhishes((prev) => [...prev, targetId]);
      addNotification(
        "Target Compromised",
        "Victim fell for your spear-phishing bait!",
        "mission",
      );
    }
  };

  useEffect(() => {
    if (!traceActive) return;

    voice.notifyTraceStart();
    let dangerWarningSpoken = false;

    const hasVpn = ownedTools.includes("proxy_shield_v1");
    const proxyDampener = Math.max(0.25, 1 - activeProxyChain.length * 0.2);
    const diffMultiplier =
      difficulty === "analyst" ? 0.75 : difficulty === "ghost" ? 1.35 : 1.0;
    const speedMultiplier =
      (hasVpn ? 0.5 : 1.0) * proxyDampener * diffMultiplier;
    const baseSpeed = 2.0 * speedMultiplier * traceSensitivityMultiplier;

    const interval = setInterval(() => {
      setTracePercent((prev) => {
        const next = Math.min(100, +(prev + baseSpeed * 0.5).toFixed(1));
        if (Math.floor(next) % 4 === 0) {
          sound.playTraceTick(next >= 70);
          if (next >= 65) {
            sound.playTraceHeartbeat();
          }
        }
        if (next >= 80 && !dangerWarningSpoken) {
          dangerWarningSpoken = true;
          voice.notifyTraceDanger();
        }
        if (next >= 100) {
          clearInterval(interval);
          sound.playError();
          setTraceActive(false);
          const currentTarget = connectedIp || "203.0.113.88";
          setConnectedIp(null);
          setTraceFailedAlert(true);
          setEgressLockoutSeconds(15);
          setCrypto((c) => Math.max(0, c - 100));
          setCrackedPorts((cp) => ({
            ...cp,
            [currentTarget]: [],
            "203.0.113.88": [],
          }));
          setLogsDirtyOnServer((ld) => ({
            ...ld,
            [currentTarget]: false,
            "203.0.113.88": false,
          }));
          addNotification(
            "HOSTILE TRACE COMPLETE",
            "Egress subnet burned (-100 ◈). 15s quarantine active while proxy circuits rebuild.",
            "warning",
          );
          return 0;
        }
        return next;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [traceActive, ownedTools, activeProxyChain]);

  // Objective Evaluation Helper
  const isObjectiveComplete = (objId: string): boolean => {
    const hasClueId = (cid: string) =>
      discoveredClues.some((c) => c.id === cid);
    const hasFile = (evId: string) =>
      downloadedFiles.some((f) => f.evidenceId === evId);

    switch (objId) {
      case "obj_m1_clues":
        return (
          hasClueId("clue_marcus_email") ||
          hasClueId("clue_dropoff_ip") ||
          (hasClueId("clue_marcus_dog") && hasClueId("clue_marcus_year"))
        );
      case "obj_m1_passweaver":
        return (
          crackedEmails.includes("m.cole@velox-ai.io") ||
          hasClueId("clue_dropoff_ip") ||
          successfulPhishes.includes("phish_marcus")
        );
      case "obj_m1_webmail":
        return hasClueId("clue_dropoff_ip");

      case "obj_m2_buy_ssh":
        return ownedTools.includes("ssh_breaker_v1");
      case "obj_m2_connect":
        return (crackedPorts["198.51.100.42"] || []).includes(22);
      case "obj_m2_download":
        return hasFile("evidence_buyer_manifest");

      case "obj_m3_sterling_mail":
        return hasClueId("clue_vault_override");
      case "obj_m3_buy_ssl":
        return ownedTools.includes("ssl_zero_day_v2");
      case "obj_m3_vault_breach":
        return (
          hasFile("evidence_project_mirror") &&
          !logsDirtyOnServer["203.0.113.88"] &&
          connectedIp !== "203.0.113.88"
        );

      // Chapter 2 Objectives
      case "obj_m4_buy_sat":
        return ownedTools.includes("sat_uplink_hijack_v1");
      case "obj_m4_crack_sat":
        return (crackedPorts["185.220.101.5"] || []).includes(80);
      case "obj_m4_download_sat":
        return hasFile("evidence_sat_intercept");

      case "obj_m5_reyes_clues":
        return hasClueId("clue_reyes_unit") && hasClueId("clue_reyes_pin");
      case "obj_m5_passweaver":
        return crackedEmails.includes("v.reyes@aethelgard.corp");
      case "obj_m5_webmail":
        return hasClueId("clue_datacenter_core_ip");

      case "obj_m6_buy_quantum":
        return ownedTools.includes("quantum_bypass_v3");
      case "obj_m6_breach_cluster":
        return (crackedPorts["194.165.16.100"] || []).includes(8080);
      case "obj_m6_purge_escape":
        return (
          hasFile("evidence_global_dossiers") &&
          !logsDirtyOnServer["194.165.16.100"] &&
          connectedIp !== "194.165.16.100"
        );

      // Chapter 3 Objectives
      case "obj_m7_netshield_defense":
        return honeypotActive && !!capturedAttackerIp;
      case "obj_m7_buy_override":
        return ownedTools.includes("counter_sig_exploit_v1");
      case "obj_m7_counter_breach":
        return (
          hasFile("evidence_drone_override") &&
          !logsDirtyOnServer["141.98.11.200"] &&
          connectedIp !== "141.98.11.200"
        );

      // Chapter 4 Objectives: The Ouroboros Protocol
      case "obj_m8_lindholm_intel":
        return (
          crackedEmails.includes("a.lindholm@nordgrid-power.com") ||
          hasClueId("clue_scada_ip") ||
          successfulPhishes.includes("phish_astrid")
        );
      case "obj_m8_buy_scada":
        return ownedTools.includes("scada_plc_exploit");
      case "obj_m8_scada_breach":
        return (
          hasFile("evidence_scada_trip") &&
          !logsDirtyOnServer["217.182.80.50"] &&
          connectedIp !== "217.182.80.50"
        );

      case "obj_m9_kai_intel":
        return (
          crackedEmails.includes("k.thorne@oceaniclink-telecom.net") ||
          hasClueId("clue_subsea_fiber_ip") ||
          successfulPhishes.includes("phish_kai")
        );
      case "obj_m9_buy_qkd":
        return ownedTools.includes("optical_qkd_decryptor");
      case "obj_m9_fiber_breach":
        return (
          hasFile("evidence_subsea_repeater") &&
          !logsDirtyOnServer["102.16.88.12"] &&
          connectedIp !== "102.16.88.12"
        );

      case "obj_m10_buy_paradox":
        return ownedTools.includes("zero_paradox_injector");
      case "obj_m10_bunker_breach":
        return (
          hasFile("evidence_ouroboros_kernel") &&
          !logsDirtyOnServer["185.190.20.1"] &&
          connectedIp !== "185.190.20.1"
        );
      case "obj_m10_final_destiny":
        return chosenEnding !== null;

      default:
        return false;
    }
  };

  const areAllObjectivesComplete = (): boolean => {
    const currentMission = MISSIONS[currentMissionIndex];
    if (!currentMission) return false;
    return currentMission.objectives.every((o) => isObjectiveComplete(o.id));
  };

  // Watch when all objectives become complete -> transition to 'report_ready' and notify player to report in WhisperChat!
  useEffect(() => {
    if (campaignFinished) return;
    if (missionStage === "investigating" && areAllObjectivesComplete()) {
      sound.playSuccess();
      setMissionStage("report_ready");
      setUnreadMessages((u) => (activeApp === "whisper" ? 0 : u + 1));
      addNotification(
        "All Evidence Collected!",
        "Open WhisperChat to transmit your findings to the client and claim your bounty.",
        "mission",
      );
    }
  }, [
    missionStage,
    discoveredClues,
    crackedEmails,
    ownedTools,
    crackedPorts,
    downloadedFiles,
    logsDirtyOnServer,
    connectedIp,
    campaignFinished,
    activeApp,
  ]);

  const acceptCurrentMission = (replyText: string) => {
    sound.playClick();
    const currentMission = MISSIONS[currentMissionIndex];
    if (!currentMission) return;

    const playerMsg: ChatMessage = {
      id: `accept_${currentMission.id}_${Date.now()}`,
      sender: "player",
      senderName: "OPERATOR",
      timestamp: "Now",
      text: replyText,
    };

    setChatHistory((prev) => [...prev, playerMsg]);
    setMissionStage(
      areAllObjectivesComplete() ? "report_ready" : "investigating",
    );
    addNotification(
      "Operation Accepted",
      "Objectives pinned to your Clue Board.",
      "mission",
    );
  };

  const submitMissionReport = (reportText: string) => {
    const currentMission = MISSIONS[currentMissionIndex];
    if (!currentMission || missionStage === "reporting") return;

    sound.playClick();
    setMissionStage("reporting");

    const playerReport: ChatMessage = {
      id: `report_${currentMission.id}_${Date.now()}`,
      sender: "player",
      senderName: "OPERATOR",
      timestamp: "Now",
      text: reportText,
    };

    setChatHistory((prev) => [...prev, playerReport]);
    setClientIsTyping(true);

    const clientReply =
      currentMission.completionMessages[1] ||
      currentMission.completionMessages[0];

    setTimeout(() => {
      setClientIsTyping(false);
      sound.playSuccess();
      setCompletedMissionIds((prev) => [...prev, currentMission.id]);
      setCrypto((c) => c + currentMission.reward);

      addNotification(
        `Bounty Received: +${currentMission.reward} ◈`,
        `${currentMission.title} completed.`,
        "mission",
      );

      const nextIndex = currentMissionIndex + 1;
      const nextMission = MISSIONS[nextIndex];

      if (nextMission) {
        setChatHistory((prev) => [
          ...prev,
          clientReply,
          {
            id: `sys_div_${currentMission.id}`,
            sender: "system",
            senderName: "NEXUS RELAY",
            timestamp: "SYSTEM",
            text: `━━━ CONTRACT CLEARED (+${currentMission.reward} ◈) // INCOMING TRANSMISSION: ${nextMission.clientName.toUpperCase()} ━━━`,
          },
        ]);
        setTimeout(() => {
          setCurrentMissionIndex(nextIndex);
          setMissionStage("briefing");
          setCampaignFinished(false);
        }, 900);
      } else {
        setChatHistory((prev) => [
          ...prev,
          clientReply,
          {
            id: `sys_end_campaign`,
            sender: "system",
            senderName: "NEXUS RELAY",
            timestamp: "SYSTEM",
            text: `━━━ ALL 10 OPERATIONS CLEARED (+${currentMission.reward} ◈) // STATUS: OUROBOROS CONQUERED ━━━`,
          },
        ]);
        setMissionStage("completed");
        setCampaignFinished(true);
      }
    }, 1300);
  };

  const advanceToNextMission = () => {
    sound.playSuccess();
    const nextIndex = currentMissionIndex + 1;
    if (nextIndex < MISSIONS.length) {
      setCurrentMissionIndex(nextIndex);
      setMissionStage("briefing");
      setCampaignFinished(false);
      addNotification(
        "Chapter Progression",
        `Starting ${MISSIONS[nextIndex].title}`,
        "mission",
      );
    }
  };

  const focusApp = (id: AppId) => {
    topZRef.current += 1;
    const nextZ = topZRef.current;
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], zIndex: nextZ, isMinimized: false },
    }));
    setActiveApp(id);
    if (id === "whisper") {
      setUnreadMessages(0);
    }
  };

  const openApp = (id: AppId) => {
    sound.playClick();
    topZRef.current += 1;
    const nextZ = topZRef.current;
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, isMinimized: false, zIndex: nextZ },
    }));
    setActiveApp(id);
    if (id === "whisper") {
      setUnreadMessages(0);
    }
  };

  const closeApp = (id: AppId) => {
    sound.playClick();
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false },
    }));
  };

  const minimizeApp = (id: AppId) => {
    sound.playClick();
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
  };

  const clampPos = (x: number, y: number) => {
    const maxX = Math.max(8, window.innerWidth - 80);
    const maxY = Math.max(8, window.innerHeight - 60);
    return {
      x: Math.max(8, Math.min(maxX, x)),
      y: Math.max(8, Math.min(maxY, y)),
    };
  };

  const moveWindow = (id: AppId, x: number, y: number) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        position: clampPos(x, y),
      },
    }));
  };

  // Automatically re-clamp all windows on window resize
  useEffect(() => {
    const handleResize = () => {
      setWindows((prev) => {
        const next = { ...prev };
        (Object.keys(next) as AppId[]).forEach((key) => {
          next[key] = {
            ...next[key],
            position: clampPos(next[key].position.x, next[key].position.y),
          };
        });
        return next;
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const minimizeAll = () => {
    sound.playWindowClose();
    setWindows((prev) => {
      const next = { ...prev };
      (Object.keys(next) as AppId[]).forEach((key) => {
        if (next[key].isOpen) {
          next[key] = { ...next[key], isMinimized: true };
        }
      });
      return next;
    });
  };

  const resetWindowPositions = () => {
    sound.playClick();
    setWindows((prev) => {
      const next = { ...prev };
      (Object.keys(next) as AppId[]).forEach((key) => {
        next[key] = {
          ...next[key],
          position: INITIAL_WINDOWS[key].position,
          isMinimized: false,
        };
      });
      return next;
    });
    addNotification(
      "Window Layout Reset",
      "All windows aligned to tactical grid positions.",
      "mission",
    );
  };

  const centerWindow = (id: AppId) => {
    sound.playClick();
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const availableW = Math.max(400, screenW - 340);
    const targetX = Math.max(16, Math.floor((availableW - 680) / 2));
    const targetY = Math.max(16, Math.floor((screenH - 490 - 44) / 2));
    moveWindow(id, targetX, targetY);
    focusApp(id);
  };

  const sendToBack = (id: AppId) => {
    sound.playClick();
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], zIndex: 10 },
    }));
  };

  const deleteDownloadedFile = (fileName: string) => {
    sound.playClick();
    setDownloadedFiles((prev) => prev.filter((f) => f.name !== fileName));
    addNotification(
      "File Shredded",
      `${fileName} securely purged with zeros.`,
      "warning",
    );
  };

  const [terminalCommandToRun, setTerminalCommandToRun] = useState<
    string | null
  >(null);
  const [inspectedFile, setInspectedFile] = useState<ServerFile | null>(null);

  const executeTerminalCommand = (cmd: string) => {
    sound.playTerminalExec();
    setTerminalCommandToRun(cmd);
    openApp("terminal");
  };

  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    groups: [],
  });

  const showContextMenu = (e: React.MouseEvent, groups: ContextMenuGroup[]) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      groups,
    });
  };

  const hideContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  };

  // Deep-linking helper for IntraWeb Browser
  const navigateBrowser = (
    page: IntraWebPage,
    query?: string,
    prefillEmail?: string,
  ) => {
    setBrowserPage(page);
    if (typeof query === "string") setBrowserSearchQuery(query);
    if (typeof prefillEmail === "string") setWebmailPrefillEmail(prefillEmail);
    openApp("intraweb");
  };

  const togglePassWeaverClue = (clueId: string) => {
    sound.playClick();
    setPassWeaverSelectedClues((prev) =>
      prev.includes(clueId)
        ? prev.filter((id) => id !== clueId)
        : [...prev, clueId],
    );
  };

  // Smart Contextual Action when clicking any clue on the Clue Board!
  const sendClueToApp = (clue: Clue) => {
    sound.playClick();
    if (clue.category === "ip") {
      setTerminalSelectedIp(clue.value);
      openApp("terminal");
      addNotification(
        "Target IP Loaded",
        `${clue.value} selected in Terminal`,
        "clue",
      );
      return;
    }

    if (clue.id === "clue_marcus_email" || clue.id === "clue_julian_email") {
      setPassWeaverTargetEmail(clue.value);
      setPassWeaverSelectedClues([]);
      openApp("passweaver");
      addNotification(
        "Target Principal Set",
        `${clue.value} loaded in PassWeaver`,
        "clue",
      );
      return;
    }

    if (clue.id === "clue_vault_override") {
      setTerminalSelectedIp("203.0.113.88");
      openApp("terminal");
      addNotification(
        "Vault Token Ready",
        `Token ${clue.value} ready for 203.0.113.88 breach`,
        "clue",
      );
      return;
    }

    if (clue.id === "clue_sat_relay_ip") {
      setTerminalSelectedIp("185.220.101.5");
      openApp("terminal");
      addNotification(
        "Satellite Target Loaded",
        `Downlink IP ${clue.value} selected in Terminal`,
        "clue",
      );
      return;
    }

    if (clue.id === "clue_datacenter_core_ip") {
      setTerminalSelectedIp("194.165.16.100");
      openApp("terminal");
      addNotification(
        "Supercluster Target Loaded",
        `Core IP ${clue.value} selected in Terminal`,
        "clue",
      );
      return;
    }

    // Personal / Date / Code clue -> Load into PassWeaver and auto-select it!
    if (clue.targetPerson.includes("Marcus")) {
      setPassWeaverTargetEmail("m.cole@velox-ai.io");
    } else if (clue.targetPerson.includes("Julian")) {
      setPassWeaverTargetEmail("j.sterling@aethelgard.corp");
    } else if (
      clue.targetPerson.includes("Reyes") ||
      clue.targetPerson.includes("Viktor")
    ) {
      setPassWeaverTargetEmail("v.reyes@aethelgard.corp");
    }
    setPassWeaverSelectedClues((prev) =>
      prev.includes(clue.id) ? prev : [...prev, clue.id],
    );
    openApp("passweaver");
    addNotification(
      "Clue Loaded into PassWeaver",
      `"${clue.value}" added to synthesis slots`,
      "clue",
    );
  };

  const discoverClue = (clueId: string) => {
    const clue = ALL_CLUES[clueId];
    if (!clue) {
      console.warn(`[NEXUS] Clue not found in ALL_CLUES for ID: ${clueId}`);
      return;
    }
    setDiscoveredClues((prev) => {
      if (prev.some((c) => c.id === clueId)) {
        sound.playClick();
        return prev;
      }
      sound.playClueFound();
      addNotification(
        `Clue Found: ${clue.label}`,
        `"${clue.value}" pinned to Clue Board`,
        "clue",
      );
      return [...prev, clue];
    });
  };

  const hasClue = (clueId: string) =>
    discoveredClues.some((c) => c.id === clueId);

  const markEmailCracked = (email: string) => {
    if (!crackedEmails.includes(email)) {
      sound.playSuccess();
      setCrackedEmails((prev) => [...prev, email]);
      setWebmailPrefillEmail(email);
      const acc = EMAIL_ACCOUNTS[email];
      if (acc) {
        addNotification(
          "Password Cracked!",
          `${email} → "${acc.password}" ready for WebMail`,
          "mission",
        );
      }
    }
  };

  const markEmailLoggedIn = (email: string) => {
    if (!loggedIntoEmails.includes(email)) {
      setLoggedIntoEmails((prev) => [...prev, email]);
    }
  };

  const addCrypto = (amount: number, reason?: string) => {
    setCrypto((c) => c + amount);
    if (reason) {
      sound.playCryptoCoin();
      addNotification(`CREDIT ALLOCATION (+${amount} ◈)`, reason, "mission");
    }
  };

  const buyTool = (itemId: string): boolean => {
    if (ownedTools.includes(itemId)) return false;
    const item = SHOP_ITEMS.find((i) => i.id === itemId);
    if (!item || crypto < item.price) {
      sound.playError();
      return false;
    }
    sound.playCryptoCoin();
    setCrypto((c) => c - item.price);
    setOwnedTools((prev) => [...prev, itemId]);
    addNotification(
      "Tool Installed",
      `${item.name} ${item.version} ready in Terminal`,
      "mission",
    );
    return true;
  };

  const markIpScanned = (ip: string) => {
    if (!scannedIps.includes(ip)) {
      setScannedIps((prev) => [...prev, ip]);
    }
  };

  const markPortCracked = (ip: string, port: number) => {
    sound.playSuccess();
    const node = SERVER_NODES[ip];
    voice.notifyHostCompromised(node?.hostname);
    setCrackedPorts((prev) => {
      const existing = prev[ip] || [];
      if (existing.includes(port)) return prev;
      return { ...prev, [ip]: [...existing, port] };
    });

    if (node?.triggersTrace) {
      setLogsDirtyOnServer((prev) => ({ ...prev, [ip]: true }));
      if (!traceActive) {
        setTracePercent(5);
        setTraceActive(true);
        addNotification(
          "WARNING: ACTIVE TRACE DETECTED",
          `Download target files, run 'wipe_logs', and 'disconnect' before 100%!`,
          "warning",
        );
      }
    }
  };

  const connectToServer = (ip: string | null) => {
    if (ip && egressLockoutSeconds > 0) {
      sound.playError();
      addNotification(
        "EGRESS QUARANTINE ACTIVE",
        `Proxy circuit rebuilding in progress (${egressLockoutSeconds}s remaining). Remote terminal links temporarily blocked.`,
        "warning",
      );
      return;
    }
    setConnectedIp(ip);
    if (ip) {
      const node = SERVER_NODES[ip];
      if (node?.triggersTrace) {
        setLogsDirtyOnServer((prev) => ({ ...prev, [ip]: true }));
      }
    } else {
      if (traceActive && !logsDirtyOnServer["203.0.113.88"]) {
        setTraceActive(false);
        setTracePercent(0);
        addNotification(
          "Trace Evaded",
          "Disconnected cleanly with zero forensic footprint.",
          "mission",
        );
      }
    }
  };

  const downloadServerFile = (file: ServerFile) => {
    if (!downloadedFiles.some((f) => f.name === file.name)) {
      sound.playSuccess();
      voice.notifyFileExfiltrated(file.name);
      setDownloadedFiles((prev) => [...prev, file]);
      addNotification(
        "File Exfiltrated",
        `${file.name} saved to DataVault`,
        "mission",
      );
    }
    if (file.clues) {
      file.clues.forEach((c) => {
        if (!discoveredClues.some((dc) => dc.id === c.id)) {
          setDiscoveredClues((prev) => [...prev, c]);
          addNotification(
            `Clue Extracted: ${c.label}`,
            `"${c.value}" pinned to Clue Board`,
            "clue",
          );
        }
      });
    }
  };

  const wipeServerLogs = (ip: string) => {
    setLogsDirtyOnServer((prev) => ({ ...prev, [ip]: false }));
    if (traceActive) {
      setTraceActive(false);
      setTracePercent(0);
      sound.playSuccess();
      addNotification(
        "Forensic Logs Purged",
        "Active Trace neutralized! Type `disconnect` to complete extraction.",
        "mission",
      );
    }
  };

  const dismissTraceAlert = () => setTraceFailedAlert(false);

  useEffect(() => {
    sound.setTraceMusic(traceActive || underAttack);
  }, [traceActive, underAttack]);

  const toggleMute = () => {
    const nowMuted = sound.toggleMute();
    setIsMuted(nowMuted);
  };

  const resetGame = () => {
    if (currentUser) {
      fetch(`/api/save/${encodeURIComponent(currentUser.id)}`, {
        method: "DELETE",
      }).catch(() => {});
    }
    resetLocalGameState();
    addNotification(
      "DOSSIER PURGED",
      "All mission progress, wallet balance, and forensic traces wiped. Starting fresh from Operation 01.",
      "warning",
    );
  };

  return (
    <GameContext.Provider
      value={{
        currentUser,
        login,
        register,
        guestLogin,
        logout,
        musicVolume,
        setMusicVolume,
        sfxVolume,
        setSfxVolume,
        windows,
        activeApp,
        openApp,
        closeApp,
        minimizeApp,
        focusApp,
        moveWindow,
        minimizeAll,
        resetWindowPositions,
        centerWindow,
        sendToBack,
        contextMenu,
        showContextMenu,
        hideContextMenu,
        deleteDownloadedFile,
        inspectedFile,
        setInspectedFile,
        terminalCommandToRun,
        executeTerminalCommand,
        setTerminalCommandToRun,
        browserPage,
        browserSearchQuery,
        webmailPrefillEmail,
        passWeaverTargetEmail,
        passWeaverSelectedClues,
        terminalSelectedIp,
        navigateBrowser,
        sendClueToApp,
        togglePassWeaverClue,
        setPassWeaverTargetEmail,
        setTerminalSelectedIp,
        crypto,
        addCrypto,
        ownedTools,
        buyTool,
        discoveredClues,
        discoverClue,
        hasClue,
        crackedEmails,
        markEmailCracked,
        loggedIntoEmails,
        markEmailLoggedIn,
        scannedIps,
        crackedPorts,
        connectedIp,
        downloadedFiles,
        logsDirtyOnServer,
        traceActive,
        tracePercent,
        traceFailedAlert,
        dismissTraceAlert,
        markIpScanned,
        markPortCracked,
        connectToServer,
        downloadServerFile,
        wipeServerLogs,
        underAttack,
        firewallHealth,
        honeypotActive,
        capturedAttackerIp,
        activateHoneypot,
        repairFirewall,
        successfulPhishes,
        markPhishSuccess,
        currentMissionIndex,
        missionStage,
        clientIsTyping,
        acceptCurrentMission,
        submitMissionReport,
        advanceToNextMission,
        completedMissionIds,
        chatHistory,
        unreadMessages,
        isObjectiveComplete,
        areAllObjectivesComplete,
        campaignFinished,
        notifications,
        addNotification,
        resetGame,
        activeProxyChain,
        toggleProxyNode,
        isMuted,
        toggleMute,
        completedBounties,
        claimBounty,
        chosenEnding,
        chooseEnding,
        moralChoices,
        handleMonetizeArchive,
        activeAlignment,
        traceSensitivityMultiplier,
        camStatus,
        difficulty,
        setDifficulty,
        uiScale,
        setUiScale,
        crtMode,
        setCrtMode,
        toggleCrtMode,
        osintHighlight,
        setOsintHighlight,
        toggleOsintHighlight,
        requestClientHint,
        droneBreachPanic,
        emergencyRebootSeconds,
        triggerEmergencyReboot,
        egressLockoutSeconds,
        saveSlots,
        activeSlotId,
        loadProfileSlot,
        createProfileSlot,
        deleteProfileSlot,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
};
