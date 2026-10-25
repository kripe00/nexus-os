import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ALL_CLUES, EMAIL_ACCOUNTS, MISSIONS, SERVER_NODES, SHOP_ITEMS } from '../data/worldData';
import { AppId, ChatMessage, Clue, ServerFile } from '../types/game';
import { sound } from '../utils/sound';

export type IntraWebPage = 'search' | 'velox' | 'chirper' | 'aethelgard' | 'webmail';

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

  // Cross-App Deep Linking (Clue Board -> App actions)
  browserPage: IntraWebPage;
  browserSearchQuery: string;
  webmailPrefillEmail: string;
  passWeaverTargetEmail: string;
  passWeaverSelectedClues: string[];
  terminalSelectedIp: string;
  navigateBrowser: (page: IntraWebPage, query?: string, prefillEmail?: string) => void;
  sendClueToApp: (clue: Clue) => void;
  togglePassWeaverClue: (clueId: string) => void;
  setPassWeaverTargetEmail: (email: string) => void;
  setTerminalSelectedIp: (ip: string) => void;

  // Player Progression & Economy
  crypto: number;
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
  missionStage: 'briefing' | 'accept_prompt' | 'investigating' | 'report_ready' | 'reporting' | 'completed';
  clientIsTyping: boolean;
  acceptCurrentMission: (replyText: string) => void;
  submitMissionReport: (reportText: string) => void;
  completedMissionIds: string[];
  chatHistory: ChatMessage[];
  unreadMessages: number;
  isObjectiveComplete: (objId: string) => boolean;
  areAllObjectivesComplete: () => boolean;
  campaignFinished: boolean;

  // Notifications / Toasts
  notifications: { id: string; title: string; message: string; type: 'clue' | 'mission' | 'warning' }[];
  addNotification: (title: string, message: string, type?: 'clue' | 'mission' | 'warning') => void;
  resetGame: () => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const INITIAL_WINDOWS: Record<AppId, WindowState> = {
  whisper: {
    id: 'whisper',
    title: 'WhisperChat',
    isOpen: true,
    isMinimized: false,
    zIndex: 20,
    position: { x: 145, y: 36 },
  },
  intraweb: {
    id: 'intraweb',
    title: 'IntraWeb Browser',
    isOpen: false,
    isMinimized: false,
    zIndex: 15,
    position: { x: 165, y: 42 },
  },
  passweaver: {
    id: 'passweaver',
    title: 'PassWeaver',
    isOpen: false,
    isMinimized: false,
    zIndex: 14,
    position: { x: 220, y: 70 },
  },
  terminal: {
    id: 'terminal',
    title: 'Terminal',
    isOpen: false,
    isMinimized: false,
    zIndex: 16,
    position: { x: 185, y: 55 },
  },
  blackmarket: {
    id: 'blackmarket',
    title: 'BlackMarket',
    isOpen: false,
    isMinimized: false,
    zIndex: 13,
    position: { x: 230, y: 65 },
  },
  netshield: {
    id: 'netshield',
    title: 'NetShield IDS',
    isOpen: false,
    isMinimized: false,
    zIndex: 17,
    position: { x: 200, y: 50 },
  },
  spearphish: {
    id: 'spearphish',
    title: 'SpearPhish',
    isOpen: false,
    isMinimized: false,
    zIndex: 15,
    position: { x: 215, y: 60 },
  },
  files: {
    id: 'files',
    title: 'DataVault',
    isOpen: false,
    isMinimized: false,
    zIndex: 12,
    position: { x: 260, y: 85 },
  },
};

const STORAGE_KEY = 'nexus_os_save_v2';

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<Record<AppId, WindowState>>(INITIAL_WINDOWS);
  const [activeApp, setActiveApp] = useState<AppId>('whisper');
  const topZRef = useRef<number>(30);

  // Cross-App Deep-Link states
  const [browserPage, setBrowserPage] = useState<IntraWebPage>('search');
  const [browserSearchQuery, setBrowserSearchQuery] = useState<string>('');
  const [webmailPrefillEmail, setWebmailPrefillEmail] = useState<string>('m.cole@velox-ai.io');
  const [passWeaverTargetEmail, setPassWeaverTargetEmail] = useState<string>('m.cole@velox-ai.io');
  const [passWeaverSelectedClues, setPassWeaverSelectedClues] = useState<string[]>([]);
  const [terminalSelectedIp, setTerminalSelectedIp] = useState<string>('198.51.100.42');

  const [crypto, setCrypto] = useState<number>(50);
  const [ownedTools, setOwnedTools] = useState<string[]>([]);
  const [discoveredClues, setDiscoveredClues] = useState<Clue[]>([]);
  const [crackedEmails, setCrackedEmails] = useState<string[]>([]);
  const [loggedIntoEmails, setLoggedIntoEmails] = useState<string[]>([]);

  const [scannedIps, setScannedIps] = useState<string[]>([]);
  const [crackedPorts, setCrackedPorts] = useState<Record<string, number[]>>({});
  const [connectedIp, setConnectedIp] = useState<string | null>(null);
  const [downloadedFiles, setDownloadedFiles] = useState<ServerFile[]>([]);
  const [logsDirtyOnServer, setLogsDirtyOnServer] = useState<Record<string, boolean>>({});

  const [traceActive, setTraceActive] = useState<boolean>(false);
  const [tracePercent, setTracePercent] = useState<number>(0);
  const [traceFailedAlert, setTraceFailedAlert] = useState<boolean>(false);

  // Counter-Hack & Defense State
  const [underAttack, setUnderAttack] = useState<boolean>(false);
  const [firewallHealth, setFirewallHealth] = useState<number>(100);
  const [honeypotActive, setHoneypotActive] = useState<boolean>(false);
  const [capturedAttackerIp, setCapturedAttackerIp] = useState<string | null>(null);

  // SpearPhishing Engine State
  const [successfulPhishes, setSuccessfulPhishes] = useState<string[]>([]);

  const [currentMissionIndex, setCurrentMissionIndex] = useState<number>(0);
  const [missionStage, setMissionStage] = useState<
    'briefing' | 'accept_prompt' | 'investigating' | 'report_ready' | 'reporting' | 'completed'
  >('briefing');
  const [clientIsTyping, setClientIsTyping] = useState<boolean>(false);
  const [completedMissionIds, setCompletedMissionIds] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [campaignFinished, setCampaignFinished] = useState<boolean>(false);
  const [loadedFromSave, setLoadedFromSave] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<
    { id: string; title: string; message: string; type: 'clue' | 'mission' | 'warning' }[]
  >([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Load saved state on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (typeof saved.crypto === 'number') setCrypto(saved.crypto);
        if (Array.isArray(saved.ownedTools)) setOwnedTools(saved.ownedTools);
        if (Array.isArray(saved.discoveredClues)) setDiscoveredClues(saved.discoveredClues);
        if (Array.isArray(saved.crackedEmails)) setCrackedEmails(saved.crackedEmails);
        if (Array.isArray(saved.loggedIntoEmails)) setLoggedIntoEmails(saved.loggedIntoEmails);
        if (Array.isArray(saved.scannedIps)) setScannedIps(saved.scannedIps);
        if (saved.crackedPorts) setCrackedPorts(saved.crackedPorts);
        if (Array.isArray(saved.downloadedFiles)) setDownloadedFiles(saved.downloadedFiles);
        if (typeof saved.currentMissionIndex === 'number') setCurrentMissionIndex(saved.currentMissionIndex);
        if (saved.missionStage) setMissionStage(saved.missionStage);
        if (Array.isArray(saved.completedMissionIds)) setCompletedMissionIds(saved.completedMissionIds);
        if (Array.isArray(saved.chatHistory) && saved.chatHistory.length > 0) {
          setChatHistory(saved.chatHistory);
        }
        if (typeof saved.campaignFinished === 'boolean') setCampaignFinished(saved.campaignFinished);
      }
    } catch {}
    setLoadedFromSave(true);
  }, []);

  // Save state on change
  useEffect(() => {
    if (!loadedFromSave) return;
    try {
      const data = {
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
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [
    loadedFromSave,
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
  ]);

  // Step-by-step Briefing Message Streamer (when missionStage === 'briefing')
  useEffect(() => {
    if (!loadedFromSave) return;
    if (missionStage !== 'briefing') return;

    const mission = MISSIONS[currentMissionIndex];
    if (!mission) return;

    // Check which initialMessages are not yet in chatHistory
    const remaining = mission.initialMessages.filter(
      (m) => !chatHistory.some((existing) => existing.id === m.id)
    );

    if (remaining.length === 0) {
      setClientIsTyping(false);
      setMissionStage('accept_prompt');
      return;
    }

    setClientIsTyping(true);
    const nextMsg = remaining[0];
    const timer = setTimeout(() => {
      sound.playMessage();
      setChatHistory((prev) => {
        if (prev.some((p) => p.id === nextMsg.id)) return prev;
        return [...prev, nextMsg];
      });
      if (activeApp !== 'whisper') {
        setUnreadMessages((u) => u + 1);
      }
    }, 1100);

    return () => clearTimeout(timer);
  }, [loadedFromSave, missionStage, currentMissionIndex, chatHistory, activeApp]);

  const addNotification = (
    title: string,
    message: string,
    type: 'clue' | 'mission' | 'warning' = 'clue'
  ) => {
    const id = `${Date.now()}-${Math.random()}`;
    setNotifications((prev) => [...prev.slice(-3), { id, title, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  };

  // Active Attack Simulation during Operation 07 (or post-Operation 06)
  useEffect(() => {
    if (currentMissionIndex === 6 && !campaignFinished) {
      setUnderAttack(true);
    } else {
      setUnderAttack(false);
    }
  }, [currentMissionIndex, campaignFinished]);

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
          sound.playError();
          addNotification('FIREWALL BREACHED', 'Hostile drone penetrated local ports! Reinforcing emergency circuit.', 'warning');
          return 50; // Emergency recovery
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [underAttack, honeypotActive]);

  const activateHoneypot = () => {
    setHoneypotActive(true);
    setCapturedAttackerIp('141.98.11.200');
    addNotification('Honeypot Active', 'Attacker isolated: 141.98.11.200 trapped!', 'mission');
  };

  const repairFirewall = () => {
    setFirewallHealth((prev) => Math.min(100, prev + 35));
    addNotification('Firewall Reinforced', 'Integrity restored +35%', 'mission');
  };

  const markPhishSuccess = (targetId: string) => {
    if (!successfulPhishes.includes(targetId)) {
      setSuccessfulPhishes((prev) => [...prev, targetId]);
      addNotification('Target Compromised', 'Victim fell for your spear-phishing bait!', 'mission');
    }
  };
  useEffect(() => {
    if (!traceActive) return;

    const hasVpn = ownedTools.includes('proxy_shield_v1');
    const speedMultiplier = hasVpn ? 0.5 : 1.0;
    const baseSpeed = 2.0 * speedMultiplier;

    const interval = setInterval(() => {
      setTracePercent((prev) => {
        const next = Math.min(100, +(prev + baseSpeed * 0.5).toFixed(1));
        if (Math.floor(next) % 4 === 0) {
          sound.playTraceTick(next >= 70);
        }
        if (next >= 100) {
          clearInterval(interval);
          sound.playError();
          setTraceActive(false);
          setConnectedIp(null);
          setTraceFailedAlert(true);
          setCrackedPorts((cp) => ({
            ...cp,
            '203.0.113.88': [],
          }));
          setLogsDirtyOnServer((ld) => ({
            ...ld,
            '203.0.113.88': false,
          }));
          return 0;
        }
        return next;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [traceActive, ownedTools]);

  // Objective Evaluation Helper
  const isObjectiveComplete = (objId: string): boolean => {
    const hasClueId = (cid: string) => discoveredClues.some((c) => c.id === cid);
    const hasFile = (evId: string) => downloadedFiles.some((f) => f.evidenceId === evId);

    switch (objId) {
      case 'obj_m1_clues':
        return (
          hasClueId('clue_marcus_email') &&
          hasClueId('clue_marcus_dog') &&
          hasClueId('clue_marcus_year')
        );
      case 'obj_m1_passweaver':
        return crackedEmails.includes('m.cole@velox-ai.io');
      case 'obj_m1_webmail':
        return hasClueId('clue_dropoff_ip');

      case 'obj_m2_buy_ssh':
        return ownedTools.includes('ssh_breaker_v1');
      case 'obj_m2_connect':
        return (crackedPorts['198.51.100.42'] || []).includes(22);
      case 'obj_m2_download':
        return hasFile('evidence_buyer_manifest');

      case 'obj_m3_sterling_mail':
        return hasClueId('clue_vault_override');
      case 'obj_m3_buy_ssl':
        return ownedTools.includes('ssl_zero_day_v2');
      case 'obj_m3_vault_breach':
        return (
          hasFile('evidence_project_mirror') &&
          !logsDirtyOnServer['203.0.113.88'] &&
          connectedIp !== '203.0.113.88'
        );

      // Chapter 2 Objectives
      case 'obj_m4_buy_sat':
        return ownedTools.includes('sat_uplink_hijack_v1');
      case 'obj_m4_crack_sat':
        return (crackedPorts['185.220.101.5'] || []).includes(80);
      case 'obj_m4_download_sat':
        return hasFile('evidence_sat_intercept');

      case 'obj_m5_reyes_clues':
        return hasClueId('clue_reyes_unit') && hasClueId('clue_reyes_pin');
      case 'obj_m5_passweaver':
        return crackedEmails.includes('v.reyes@aethelgard.corp');
      case 'obj_m5_webmail':
        return hasClueId('clue_datacenter_core_ip');

      case 'obj_m6_buy_quantum':
        return ownedTools.includes('quantum_bypass_v3');
      case 'obj_m6_breach_cluster':
        return (crackedPorts['194.165.16.100'] || []).includes(8080);
      case 'obj_m6_purge_escape':
        return (
          hasFile('evidence_global_dossiers') &&
          !logsDirtyOnServer['194.165.16.100'] &&
          connectedIp !== '194.165.16.100'
        );

      // Chapter 3 Objectives
      case 'obj_m7_netshield_defense':
        return honeypotActive && !!capturedAttackerIp;
      case 'obj_m7_buy_override':
        return ownedTools.includes('counter_sig_exploit_v1');
      case 'obj_m7_counter_breach':
        return (
          hasFile('evidence_drone_override') &&
          !logsDirtyOnServer['141.98.11.200'] &&
          connectedIp !== '141.98.11.200'
        );

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
    if (missionStage === 'investigating' && areAllObjectivesComplete()) {
      sound.playSuccess();
      setMissionStage('report_ready');
      setUnreadMessages((u) => (activeApp === 'whisper' ? 0 : u + 1));
      addNotification(
        'All Evidence Collected!',
        'Open WhisperChat to transmit your findings to the client and claim your bounty.',
        'mission'
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
      sender: 'player',
      senderName: 'OPERATOR',
      timestamp: 'Now',
      text: replyText,
    };

    setChatHistory((prev) => [...prev, playerMsg]);
    setMissionStage(areAllObjectivesComplete() ? 'report_ready' : 'investigating');
    addNotification('Operation Accepted', 'Objectives pinned to your Clue Board.', 'mission');
  };

  const submitMissionReport = (reportText: string) => {
    const currentMission = MISSIONS[currentMissionIndex];
    if (!currentMission || missionStage === 'reporting') return;

    sound.playClick();
    setMissionStage('reporting');

    const playerReport: ChatMessage = {
      id: `report_${currentMission.id}_${Date.now()}`,
      sender: 'player',
      senderName: 'OPERATOR',
      timestamp: 'Now',
      text: reportText,
    };

    setChatHistory((prev) => [...prev, playerReport]);
    setClientIsTyping(true);

    const clientReply = currentMission.completionMessages[1] || currentMission.completionMessages[0];

    setTimeout(() => {
      setClientIsTyping(false);
      sound.playSuccess();
      setCompletedMissionIds((prev) => [...prev, currentMission.id]);
      setCrypto((c) => c + currentMission.reward);

      addNotification(
        `Bounty Received: +${currentMission.reward} ◈`,
        `${currentMission.title} completed.`,
        'mission'
      );

      const nextIndex = currentMissionIndex + 1;
      const nextMission = MISSIONS[nextIndex];

      if (nextMission) {
        setChatHistory((prev) => [
          ...prev,
          clientReply,
          {
            id: `sys_div_${currentMission.id}`,
            sender: 'system',
            senderName: 'NEXUS RELAY',
            timestamp: 'SYSTEM',
            text: `━━━ CONTRACT CLEARED (+${currentMission.reward} ◈) // INCOMING TRANSMISSION: ${nextMission.clientName.toUpperCase()} ━━━`,
          },
        ]);
        setTimeout(() => {
          setCurrentMissionIndex(nextIndex);
          setMissionStage('briefing');
        }, 900);
      } else {
        setChatHistory((prev) => [
          ...prev,
          clientReply,
          {
            id: `sys_end_ch1`,
            sender: 'system',
            senderName: 'NEXUS RELAY',
            timestamp: 'SYSTEM',
            text: `━━━ CHAPTER 1 COMPLETE (+${currentMission.reward} ◈) // STATUS: TARGET #002 ON AETHELGARD WATCHLIST ━━━`,
          },
        ]);
        setMissionStage('completed');
        setCampaignFinished(true);
      }
    }, 1300);
  };

  const focusApp = (id: AppId) => {
    topZRef.current += 1;
    const nextZ = topZRef.current;
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], zIndex: nextZ, isMinimized: false },
    }));
    setActiveApp(id);
    if (id === 'whisper') {
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
    if (id === 'whisper') {
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

  const moveWindow = (id: AppId, x: number, y: number) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        position: {
          x: Math.max(8, Math.min(window.innerWidth - 360, x)),
          y: Math.max(8, Math.min(window.innerHeight - 100, y)),
        },
      },
    }));
  };

  // Deep-linking helper for IntraWeb Browser
  const navigateBrowser = (page: IntraWebPage, query?: string, prefillEmail?: string) => {
    setBrowserPage(page);
    if (typeof query === 'string') setBrowserSearchQuery(query);
    if (typeof prefillEmail === 'string') setWebmailPrefillEmail(prefillEmail);
    openApp('intraweb');
  };

  const togglePassWeaverClue = (clueId: string) => {
    sound.playClick();
    setPassWeaverSelectedClues((prev) =>
      prev.includes(clueId) ? prev.filter((id) => id !== clueId) : [...prev, clueId]
    );
  };

  // Smart Contextual Action when clicking any clue on the Clue Board!
  const sendClueToApp = (clue: Clue) => {
    sound.playClick();
    if (clue.category === 'ip') {
      setTerminalSelectedIp(clue.value);
      openApp('terminal');
      addNotification('Target IP Loaded', `${clue.value} selected in Terminal`, 'clue');
      return;
    }

    if (clue.id === 'clue_marcus_email' || clue.id === 'clue_julian_email') {
      setPassWeaverTargetEmail(clue.value);
      setPassWeaverSelectedClues([]);
      openApp('passweaver');
      addNotification('Target Principal Set', `${clue.value} loaded in PassWeaver`, 'clue');
      return;
    }

    if (clue.id === 'clue_vault_override') {
      setTerminalSelectedIp('203.0.113.88');
      openApp('terminal');
      addNotification('Vault Token Ready', `Token ${clue.value} ready for 203.0.113.88 breach`, 'clue');
      return;
    }

    if (clue.id === 'clue_sat_relay_ip') {
      setTerminalSelectedIp('185.220.101.5');
      openApp('terminal');
      addNotification('Satellite Target Loaded', `Downlink IP ${clue.value} selected in Terminal`, 'clue');
      return;
    }

    if (clue.id === 'clue_datacenter_core_ip') {
      setTerminalSelectedIp('194.165.16.100');
      openApp('terminal');
      addNotification('Supercluster Target Loaded', `Core IP ${clue.value} selected in Terminal`, 'clue');
      return;
    }

    // Personal / Date / Code clue -> Load into PassWeaver and auto-select it!
    if (clue.targetPerson.includes('Marcus')) {
      setPassWeaverTargetEmail('m.cole@velox-ai.io');
    } else if (clue.targetPerson.includes('Julian')) {
      setPassWeaverTargetEmail('j.sterling@aethelgard.corp');
    } else if (clue.targetPerson.includes('Reyes') || clue.targetPerson.includes('Viktor')) {
      setPassWeaverTargetEmail('v.reyes@aethelgard.corp');
    }
    setPassWeaverSelectedClues((prev) =>
      prev.includes(clue.id) ? prev : [...prev, clue.id]
    );
    openApp('passweaver');
    addNotification('Clue Loaded into PassWeaver', `"${clue.value}" added to synthesis slots`, 'clue');
  };

  const discoverClue = (clueId: string) => {
    const clue = ALL_CLUES[clueId];
    if (!clue) return;
    if (discoveredClues.some((c) => c.id === clueId)) {
      sound.playClick();
      return;
    }
    sound.playClueFound();
    setDiscoveredClues((prev) => [...prev, clue]);
    addNotification(`Clue Found: ${clue.label}`, `"${clue.value}" pinned to Clue Board`, 'clue');
  };

  const hasClue = (clueId: string) => discoveredClues.some((c) => c.id === clueId);

  const markEmailCracked = (email: string) => {
    if (!crackedEmails.includes(email)) {
      sound.playSuccess();
      setCrackedEmails((prev) => [...prev, email]);
      setWebmailPrefillEmail(email);
      const acc = EMAIL_ACCOUNTS[email];
      if (acc) {
        addNotification(
          'Password Cracked!',
          `${email} → "${acc.password}" ready for WebMail`,
          'mission'
        );
      }
    }
  };

  const markEmailLoggedIn = (email: string) => {
    if (!loggedIntoEmails.includes(email)) {
      setLoggedIntoEmails((prev) => [...prev, email]);
    }
  };

  const buyTool = (itemId: string): boolean => {
    if (ownedTools.includes(itemId)) return false;
    const item = SHOP_ITEMS.find((i) => i.id === itemId);
    if (!item || crypto < item.price) {
      sound.playError();
      return false;
    }
    sound.playSuccess();
    setCrypto((c) => c - item.price);
    setOwnedTools((prev) => [...prev, itemId]);
    addNotification('Tool Installed', `${item.name} ${item.version} ready in Terminal`, 'mission');
    return true;
  };

  const markIpScanned = (ip: string) => {
    if (!scannedIps.includes(ip)) {
      setScannedIps((prev) => [...prev, ip]);
    }
  };

  const markPortCracked = (ip: string, port: number) => {
    sound.playSuccess();
    setCrackedPorts((prev) => {
      const existing = prev[ip] || [];
      if (existing.includes(port)) return prev;
      return { ...prev, [ip]: [...existing, port] };
    });

    const node = SERVER_NODES[ip];
    if (node?.triggersTrace) {
      setLogsDirtyOnServer((prev) => ({ ...prev, [ip]: true }));
      if (!traceActive) {
        setTracePercent(5);
        setTraceActive(true);
        addNotification(
          'WARNING: ACTIVE TRACE DETECTED',
          `Download target files, run 'wipe_logs', and 'disconnect' before 100%!`,
          'warning'
        );
      }
    }
  };

  const connectToServer = (ip: string | null) => {
    setConnectedIp(ip);
    if (ip) {
      const node = SERVER_NODES[ip];
      if (node?.triggersTrace) {
        setLogsDirtyOnServer((prev) => ({ ...prev, [ip]: true }));
      }
    } else {
      if (traceActive && !logsDirtyOnServer['203.0.113.88']) {
        setTraceActive(false);
        setTracePercent(0);
        addNotification('Trace Evaded', 'Disconnected cleanly with zero forensic footprint.', 'mission');
      }
    }
  };

  const downloadServerFile = (file: ServerFile) => {
    if (!downloadedFiles.some((f) => f.name === file.name)) {
      sound.playSuccess();
      setDownloadedFiles((prev) => [...prev, file]);
      addNotification('File Exfiltrated', `${file.name} saved to DataVault`, 'mission');
    }
    if (file.clues) {
      file.clues.forEach((c) => {
        if (!discoveredClues.some((dc) => dc.id === c.id)) {
          setDiscoveredClues((prev) => [...prev, c]);
          addNotification(`Clue Extracted: ${c.label}`, `"${c.value}" pinned to Clue Board`, 'clue');
        }
      });
    }
  };

  const wipeServerLogs = (ip: string) => {
    setLogsDirtyOnServer((prev) => ({ ...prev, [ip]: false }));
    if (traceActive && ip === '203.0.113.88') {
      setTraceActive(false);
      setTracePercent(0);
      sound.playSuccess();
      addNotification('Forensic Logs Purged', 'Active Trace neutralized! Type `disconnect` to complete extraction.', 'mission');
    }
  };

  const dismissTraceAlert = () => setTraceFailedAlert(false);

  const toggleMute = () => {
    sound.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const resetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
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
    setCurrentMissionIndex(0);
    setMissionStage('briefing');
    setCompletedMissionIds([]);
    setChatHistory([]);
    setCampaignFinished(false);
    setWindows(INITIAL_WINDOWS);
    setActiveApp('whisper');
    setBrowserPage('search');
    setBrowserSearchQuery('');
  };

  return (
    <GameContext.Provider
      value={{
        windows,
        activeApp,
        openApp,
        closeApp,
        minimizeApp,
        focusApp,
        moveWindow,
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
        completedMissionIds,
        chatHistory,
        unreadMessages,
        isObjectiveComplete,
        areAllObjectivesComplete,
        campaignFinished,
        notifications,
        addNotification,
        resetGame,
        isMuted,
        toggleMute,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
};
