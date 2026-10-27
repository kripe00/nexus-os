import React, { useEffect, useRef, useState } from "react";
import {
  Briefcase,
  ChevronRight,
  Compass,
  Cpu,
  Fish,
  Folder,
  FolderLock,
  Globe,
  KeyRound,
  LogOut,
  MessageSquare,
  Network,
  Radio,
  RotateCcw,
  Shield,
  ShoppingBag,
  Sliders,
  Terminal,
  Trash2,
  Tv,
  User,
  Zap,
} from "lucide-react";
import { AppId } from "../types/game";
import { WindowState } from "../context/GameContext";
import { sound } from "../utils/sound";

interface NexusStartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appId: AppId) => void;
  windows: Record<AppId, WindowState>;
  currentUser: { id: string; username: string } | null;
  crypto: number;
  difficulty: string;
  uiScale: string;
  onToggleUiScale: () => void;
  crtMode: boolean;
  onToggleCrt: () => void;
  onOpenMixer: () => void;
  onOpenWipeModal: () => void;
  onToggleOnboarding: () => void;
  onboardingOpen: boolean;
  onLogout: () => void;
}

type SubmenuCategory = "tactical" | "osint" | "crypto" | "settings" | null;

export const NexusStartMenu: React.FC<NexusStartMenuProps> = ({
  isOpen,
  onClose,
  onOpenApp,
  windows,
  currentUser,
  crypto,
  difficulty,
  uiScale,
  onToggleUiScale,
  crtMode,
  onToggleCrt,
  onOpenMixer,
  onOpenWipeModal,
  onToggleOnboarding,
  onboardingOpen,
  onLogout,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<SubmenuCategory>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Play opening sound
  useEffect(() => {
    if (isOpen) {
      sound.playClick();
      setActiveSubmenu(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLaunch = (appId: AppId) => {
    sound.playClick();
    onOpenApp(appId);
    onClose();
  };

  return (
    <>
      {/* Invisible Backdrop to trap stray clicks */}
      <div
        className="fixed inset-0 z-[9998]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={menuRef}
        onClick={(e) => e.stopPropagation()}
        className="fixed bottom-11 left-2 sm:left-3 z-[9999] flex shadow-[0_20px_60px_rgba(0,0,0,0.95)] animate-window-in font-mono select-none"
        style={{
          borderTop: "2px solid #3b4659",
          borderLeft: "2px solid #3b4659",
          borderRight: "2px solid #080a0e",
          borderBottom: "2px solid #080a0e",
        }}
      >
        {/* Classic Windows 95/98 Style Vertical Side Banner */}
        <div className="w-10 bg-gradient-to-t from-[#050811] via-[#0d1627] to-[#1a2f52] border-r border-[#1e2736] flex flex-col items-center justify-between py-3 relative overflow-hidden">
          <div className="w-6 h-6 rounded bg-[#1f6feb]/30 border border-[#58a6ff]/60 flex items-center justify-center text-[#58a6ff] mb-2 shadow-[0_0_10px_rgba(88,166,255,0.4)]">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>

          <div className="[writing-mode:vertical-rl] rotate-180 flex items-center gap-2 text-white font-black tracking-widest text-xs">
            <span className="text-[#58a6ff]">NEXUS</span>
            <span className="text-[#8b949e] font-normal">//</span>
            <span className="text-[#e6edf3]">OS 98</span>
            <span className="text-[9px] text-[#3fb950] font-mono font-normal">
              KERNEL 6.11
            </span>
          </div>

          <div className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-ping mt-2" />
        </div>

        {/* Main Menu Body */}
        <div className="w-72 bg-[#0c1017] flex flex-col text-xs text-[#d4d7dc] border-r border-[#1c2330]">
          {/* Operator Profile Header Card */}
          <div className="p-3 bg-gradient-to-r from-[#111722] to-[#151f30] border-b border-[#212c3d] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#090d14] border border-[#2b394f] flex items-center justify-center text-[#3fb950]">
                <User className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="text-white font-bold text-xs truncate max-w-[130px]">
                  {currentUser?.username || "GUEST_OPERATOR"}
                </div>
                <div className="text-[10px] text-[#79c0ff] uppercase">
                  [{difficulty}] // CLR-3
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[9px] text-[#8b949e] uppercase font-bold">
                BALANCE
              </div>
              <div className="text-xs font-bold text-[#3fb950] font-mono">
                {crypto} ◈
              </div>
            </div>
          </div>

          {/* Cascading Category Folders & Fast Apps */}
          <div className="p-1.5 space-y-0.5 flex-1 overflow-y-auto max-h-[380px]">
            {/* 1. Tactical Intrusion Suite */}
            <div
              className="relative"
              onMouseEnter={() => setActiveSubmenu("tactical")}
            >
              <button
                className={`w-full px-2.5 py-1.5 flex items-center justify-between cursor-pointer transition-colors ${
                  activeSubmenu === "tactical"
                    ? "bg-[#1f6feb] text-white"
                    : "hover:bg-[#161d29] text-[#c9d1d9]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-3.5 h-3.5 text-[#58a6ff]" />
                  <span className="font-semibold text-[11px]">
                    Tactical Intrusion Suite
                  </span>
                </div>
                <ChevronRight className="w-3 h-3 text-[#8b949e]" />
              </button>

              {/* Flyout Submenu: Tactical */}
              {activeSubmenu === "tactical" && (
                <div
                  className="absolute left-full top-0 ml-0.5 w-60 bg-[#0c1017] border border-[#303947] p-1 shadow-[0_12px_40px_rgba(0,0,0,0.95)] z-60 space-y-0.5"
                  style={{
                    borderTop: "2px solid #3b4659",
                    borderLeft: "2px solid #3b4659",
                    borderRight: "2px solid #080a0e",
                    borderBottom: "2px solid #080a0e",
                  }}
                >
                  <button
                    onClick={() => handleLaunch("terminal")}
                    className="w-full px-2 py-1.5 flex items-center justify-between hover:bg-[#1f6feb] hover:text-white text-[#c9d1d9] cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-[#58a6ff]" />
                      <span>Smart Terminal</span>
                    </div>
                    {windows.terminal?.isOpen && (
                      <span className="text-[9px] text-[#3fb950] font-bold">
                        OPEN
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => handleLaunch("netshield")}
                    className="w-full px-2 py-1.5 flex items-center justify-between hover:bg-[#1f6feb] hover:text-white text-[#c9d1d9] cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-[#3fb950]" />
                      <span>NetShield IDS</span>
                    </div>
                    {windows.netshield?.isOpen && (
                      <span className="text-[9px] text-[#3fb950] font-bold">
                        OPEN
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => handleLaunch("packetsniffer")}
                    className="w-full px-2 py-1.5 flex items-center justify-between hover:bg-[#1f6feb] hover:text-white text-[#c9d1d9] cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5 text-[#e3b341]" />
                      <span>Packet Sniffer</span>
                    </div>
                    {windows.packetsniffer?.isOpen && (
                      <span className="text-[9px] text-[#3fb950] font-bold">
                        OPEN
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => handleLaunch("georelay")}
                    className="w-full px-2 py-1.5 flex items-center justify-between hover:bg-[#1f6feb] hover:text-white text-[#c9d1d9] cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Network className="w-3.5 h-3.5 text-[#bc8cff]" />
                      <span>GeoRelay Network</span>
                    </div>
                    {windows.georelay?.isOpen && (
                      <span className="text-[9px] text-[#3fb950] font-bold">
                        OPEN
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* 2. OSINT & Social Recon */}
            <div
              className="relative"
              onMouseEnter={() => setActiveSubmenu("osint")}
            >
              <button
                className={`w-full px-2.5 py-1.5 flex items-center justify-between cursor-pointer transition-colors ${
                  activeSubmenu === "osint"
                    ? "bg-[#1f6feb] text-white"
                    : "hover:bg-[#161d29] text-[#c9d1d9]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-3.5 h-3.5 text-[#58a6ff]" />
                  <span className="font-semibold text-[11px]">
                    OSINT & Social Recon
                  </span>
                </div>
                <ChevronRight className="w-3 h-3 text-[#8b949e]" />
              </button>

              {/* Flyout Submenu: OSINT */}
              {activeSubmenu === "osint" && (
                <div
                  className="absolute left-full top-0 ml-0.5 w-60 bg-[#0c1017] border border-[#303947] p-1 shadow-[0_12px_40px_rgba(0,0,0,0.95)] z-60 space-y-0.5"
                  style={{
                    borderTop: "2px solid #3b4659",
                    borderLeft: "2px solid #3b4659",
                    borderRight: "2px solid #080a0e",
                    borderBottom: "2px solid #080a0e",
                  }}
                >
                  <button
                    onClick={() => handleLaunch("whisper")}
                    className="w-full px-2 py-1.5 flex items-center justify-between hover:bg-[#1f6feb] hover:text-white text-[#c9d1d9] cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-[#58a6ff]" />
                      <span>WhisperChat (Contracts)</span>
                    </div>
                    {windows.whisper?.isOpen && (
                      <span className="text-[9px] text-[#3fb950] font-bold">
                        OPEN
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => handleLaunch("intraweb")}
                    className="w-full px-2 py-1.5 flex items-center justify-between hover:bg-[#1f6feb] hover:text-white text-[#c9d1d9] cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-[#58a6ff]" />
                      <span>IntraWeb Browser</span>
                    </div>
                    {windows.intraweb?.isOpen && (
                      <span className="text-[9px] text-[#3fb950] font-bold">
                        OPEN
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => handleLaunch("spearphish")}
                    className="w-full px-2 py-1.5 flex items-center justify-between hover:bg-[#1f6feb] hover:text-white text-[#c9d1d9] cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Fish className="w-3.5 h-3.5 text-[#ff7b72]" />
                      <span>SpearPhish Studio</span>
                    </div>
                    {windows.spearphish?.isOpen && (
                      <span className="text-[9px] text-[#3fb950] font-bold">
                        OPEN
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* 3. Exploits & Cryptanalysis */}
            <div
              className="relative"
              onMouseEnter={() => setActiveSubmenu("crypto")}
            >
              <button
                className={`w-full px-2.5 py-1.5 flex items-center justify-between cursor-pointer transition-colors ${
                  activeSubmenu === "crypto"
                    ? "bg-[#1f6feb] text-white"
                    : "hover:bg-[#161d29] text-[#c9d1d9]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-3.5 h-3.5 text-[#58a6ff]" />
                  <span className="font-semibold text-[11px]">
                    Exploits & Cryptanalysis
                  </span>
                </div>
                <ChevronRight className="w-3 h-3 text-[#8b949e]" />
              </button>

              {/* Flyout Submenu: Crypto */}
              {activeSubmenu === "crypto" && (
                <div
                  className="absolute left-full top-0 ml-0.5 w-60 bg-[#0c1017] border border-[#303947] p-1 shadow-[0_12px_40px_rgba(0,0,0,0.95)] z-60 space-y-0.5"
                  style={{
                    borderTop: "2px solid #3b4659",
                    borderLeft: "2px solid #3b4659",
                    borderRight: "2px solid #080a0e",
                    borderBottom: "2px solid #080a0e",
                  }}
                >
                  <button
                    onClick={() => handleLaunch("passweaver")}
                    className="w-full px-2 py-1.5 flex items-center justify-between hover:bg-[#1f6feb] hover:text-white text-[#c9d1d9] cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-3.5 h-3.5 text-[#e3b341]" />
                      <span>PassWeaver Synthesizer</span>
                    </div>
                    {windows.passweaver?.isOpen && (
                      <span className="text-[9px] text-[#3fb950] font-bold">
                        OPEN
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => handleLaunch("blackmarket")}
                    className="w-full px-2 py-1.5 flex items-center justify-between hover:bg-[#1f6feb] hover:text-white text-[#c9d1d9] cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#ff7b72]" />
                      <span>BlackMarket Bazaar</span>
                    </div>
                    {windows.blackmarket?.isOpen && (
                      <span className="text-[9px] text-[#3fb950] font-bold">
                        OPEN
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => handleLaunch("files")}
                    className="w-full px-2 py-1.5 flex items-center justify-between hover:bg-[#1f6feb] hover:text-white text-[#c9d1d9] cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <FolderLock className="w-3.5 h-3.5 text-[#58a6ff]" />
                      <span>DataVault Explorer</span>
                    </div>
                    {windows.files?.isOpen && (
                      <span className="text-[9px] text-[#3fb950] font-bold">
                        OPEN
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => handleLaunch("bountyboard")}
                    className="w-full px-2 py-1.5 flex items-center justify-between hover:bg-[#1f6feb] hover:text-white text-[#c9d1d9] cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-[#e3b341]" />
                      <span>Bounty Dispatch Board</span>
                    </div>
                    {windows.bountyboard?.isOpen && (
                      <span className="text-[9px] text-[#3fb950] font-bold">
                        OPEN
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="border-t border-[#1c2330] my-1" />

            {/* 4. Settings & Station Tuning */}
            <div
              className="relative"
              onMouseEnter={() => setActiveSubmenu("settings")}
            >
              <button
                className={`w-full px-2.5 py-1.5 flex items-center justify-between cursor-pointer transition-colors ${
                  activeSubmenu === "settings"
                    ? "bg-[#1f6feb] text-white"
                    : "hover:bg-[#161d29] text-[#c9d1d9]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-[#58a6ff]" />
                  <span className="font-semibold text-[11px]">
                    Settings & Hardware
                  </span>
                </div>
                <ChevronRight className="w-3 h-3 text-[#8b949e]" />
              </button>

              {/* Flyout Submenu: Settings */}
              {activeSubmenu === "settings" && (
                <div
                  className="absolute left-full top-0 ml-0.5 w-60 bg-[#0c1017] border border-[#303947] p-1 shadow-[0_12px_40px_rgba(0,0,0,0.95)] z-60 space-y-0.5"
                  style={{
                    borderTop: "2px solid #3b4659",
                    borderLeft: "2px solid #3b4659",
                    borderRight: "2px solid #080a0e",
                    borderBottom: "2px solid #080a0e",
                  }}
                >
                  <button
                    onClick={() => {
                      sound.playClick();
                      onOpenMixer();
                      onClose();
                    }}
                    className="w-full px-2 py-1.5 flex items-center justify-between hover:bg-[#1f6feb] hover:text-white text-[#c9d1d9] cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5 text-[#58a6ff]" />
                      <span>Audio Mixer & Volumes</span>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onToggleCrt();
                    }}
                    className="w-full px-2 py-1.5 flex items-center justify-between hover:bg-[#1f6feb] hover:text-white text-[#c9d1d9] cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Tv className="w-3.5 h-3.5 text-[#58a6ff]" />
                      <span>CRT Scanlines</span>
                    </div>
                    <span className="text-[10px] text-[#58a6ff] font-bold">
                      {crtMode ? "ENABLED" : "OFF"}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onToggleUiScale();
                    }}
                    className="w-full px-2 py-1.5 flex items-center justify-between hover:bg-[#1f6feb] hover:text-white text-[#c9d1d9] cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-[#e3b341]" />
                      <span>UI Scaling Factor</span>
                    </div>
                    <span className="text-[10px] text-[#e3b341] font-bold">
                      {uiScale}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* 5. Orientation Protocol Guide */}
            <button
              onMouseEnter={() => setActiveSubmenu(null)}
              onClick={() => {
                sound.playClick();
                onToggleOnboarding();
                onClose();
              }}
              className="w-full px-2.5 py-1.5 flex items-center justify-between hover:bg-[#161d29] text-[#c9d1d9] hover:text-white cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-[#58a6ff]" />
                <span className="text-[11px]">Orientation Protocol HUD</span>
              </div>
              <span className="text-[9px] text-[#58a6ff] font-bold">
                {onboardingOpen ? "HIDE" : "SHOW"}
              </span>
            </button>

            {/* 6. Run / Shell */}
            <button
              onMouseEnter={() => setActiveSubmenu(null)}
              onClick={() => handleLaunch("terminal")}
              className="w-full px-2.5 py-1.5 flex items-center justify-between hover:bg-[#161d29] text-[#c9d1d9] hover:text-white cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#3fb950]" />
                <span className="text-[11px]">Run Command Prompt...</span>
              </div>
              <span className="text-[9px] text-[#6e7681]">`shell`</span>
            </button>
          </div>

          {/* Classic Start Menu Bottom Action Strip */}
          <div className="p-2 bg-[#080b0f] border-t border-[#1c2330] space-y-1">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
                onOpenWipeModal();
              }}
              className="w-full px-2.5 py-1.5 bg-[#170a0c] hover:bg-[#2b1014] border border-[#ff3b3b]/30 text-[#ff7b72] flex items-center justify-between cursor-pointer transition-colors text-[11px] font-bold"
            >
              <span className="flex items-center gap-2">
                <Trash2 className="w-3.5 h-3.5 text-[#ff5555]" />
                Zero-Fill / Restart Dossier...
              </span>
              <span className="text-[9px] text-[#ff7b72]/60">[PURGE]</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
                if (
                  window.confirm(
                    `Log off operator session (${currentUser?.username || "GUEST"})?`,
                  )
                ) {
                  onLogout();
                }
              }}
              className="w-full px-2.5 py-1.5 bg-[#121620] hover:bg-[#1a2233] border border-[#263347] text-[#c9d1d9] hover:text-white flex items-center justify-between cursor-pointer transition-colors text-[11px] font-bold"
            >
              <span className="flex items-center gap-2">
                <LogOut className="w-3.5 h-3.5 text-[#8b949e]" />
                Log Off {currentUser?.username || "Operator"}...
              </span>
              <span className="text-[9px] text-[#8b949e]">[EXIT]</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
