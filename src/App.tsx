import React, { useEffect, useState } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  Coins,
  Compass,
  Cpu,
  Fish,
  FolderLock,
  Globe,
  KeyRound,
  LogOut,
  Maximize2,
  MessageSquare,
  Minimize2,
  Music,
  Network,
  Radio,
  RotateCcw,
  ShieldAlert,
  ShoppingBag,
  Sliders,
  Terminal,
  Trash2,
  Tv,
  User,
  Volume2,
  VolumeX,
} from "lucide-react";
import { BlackMarketApp } from "./apps/BlackMarketApp";
import { BountyBoardApp } from "./apps/BountyBoardApp";
import { DataVaultApp } from "./apps/DataVaultApp";
import { GeoRelayApp } from "./apps/GeoRelayApp";
import { IntraWebApp } from "./apps/IntraWebApp";
import { NetShieldApp } from "./apps/NetShieldApp";
import { PacketSnifferApp } from "./apps/PacketSnifferApp";
import { PassWeaverApp } from "./apps/PassWeaverApp";
import { SmartTerminalApp } from "./apps/SmartTerminalApp";
import { SpearPhishApp } from "./apps/SpearPhishApp";
import { WhisperChatApp } from "./apps/WhisperChatApp";
import { AudioMixerPopover } from "./components/AudioMixerPopover";
import { ClueBoardSidebar } from "./components/ClueBoardSidebar";
import { ContextMenu } from "./components/ContextMenu";
import { DesktopWallpaper } from "./components/DesktopWallpaper";
import { HexInspectorModal } from "./components/HexInspectorModal";
import { NexusStartMenu } from "./components/NexusStartMenu";
import { OnboardingHUD } from "./components/OnboardingHUD";
import { OperatorLoginScreen } from "./components/OperatorLoginScreen";
import { GameProvider, useGame } from "./context/GameContext";
import { AppId } from "./types/game";
import { sound } from "./utils/sound";

const DesktopEnvironment: React.FC = () => {
  const {
    windows,
    activeApp,
    openApp,
    minimizeApp,
    crypto,
    unreadMessages,
    traceActive,
    tracePercent,
    traceFailedAlert,
    dismissTraceAlert,
    notifications,
    resetGame,
    isMuted,
    toggleMute,
    discoveredClues,
    downloadedFiles,
    underAttack,
    firewallHealth,
    currentUser,
    login,
    register,
    guestLogin,
    logout,
    minimizeAll,
    resetWindowPositions,
    contextMenu,
    showContextMenu,
    hideContextMenu,
    inspectedFile,
    setInspectedFile,
    connectToServer,
    activeProxyChain,
    camStatus,
    difficulty,
    uiScale,
    setUiScale,
    crtMode,
    toggleCrtMode,
    droneBreachPanic,
    emergencyRebootSeconds,
    triggerEmergencyReboot,
    egressLockoutSeconds,
  } = useGame();

  const [clock, setClock] = useState<string>("23:42");
  const [startMenuOpen, setStartMenuOpen] = useState<boolean>(false);
  const [audioMixerOpen, setAudioMixerOpen] = useState<boolean>(false);
  const [wipeModalOpen, setWipeModalOpen] = useState<boolean>(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(() =>
    sound.isMusicPlaying(),
  );
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(
    () => localStorage.getItem("nexus_tutorial_dismissed_v1") !== "true",
  );
  const [isFullscreen, setIsFullscreen] = useState<boolean>(
    () => typeof document !== "undefined" && !!document.fullscreenElement,
  );

  const handleDismissOnboarding = () => {
    setOnboardingOpen(false);
    localStorage.setItem("nexus_tutorial_dismissed_v1", "true");
  };

  const handleToggleOnboarding = () => {
    setOnboardingOpen((prev) => {
      const next = !prev;
      if (!next) localStorage.setItem("nexus_tutorial_dismissed_v1", "true");
      else localStorage.removeItem("nexus_tutorial_dismissed_v1");
      return next;
    });
  };

  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  };

  useEffect(() => {
    return sound.subscribe((playing) => {
      setIsMusicPlaying(playing);
    });
  }, []);

  // Global Keyboard Shortcuts (ESC, Ctrl+1..9, Ctrl+D, Ctrl+M)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement;

      if (e.key === "Escape") {
        if (inspectedFile) {
          setInspectedFile(null);
          return;
        }
        if (audioMixerOpen) {
          setAudioMixerOpen(false);
          return;
        }
        if (wipeModalOpen) {
          setWipeModalOpen(false);
          return;
        }
        if (startMenuOpen) {
          setStartMenuOpen(false);
          return;
        }
        if (
          activeApp &&
          windows[activeApp]?.isOpen &&
          !windows[activeApp]?.isMinimized
        ) {
          minimizeApp(activeApp);
        }
      }

      if (!isInput && e.ctrlKey) {
        if (e.key === "d" || e.key === "D") {
          e.preventDefault();
          minimizeAll();
        } else if (e.key === "m" || e.key === "M") {
          e.preventDefault();
          toggleMute();
        } else if (e.key === "0") {
          e.preventDefault();
          sound.playClick();
          setUiScale("100%");
        } else if (e.key >= "1" && e.key <= "9") {
          e.preventDefault();
          const appMap: Record<string, AppId> = {
            "1": "whisper",
            "2": "intraweb",
            "3": "passweaver",
            "4": "terminal",
            "5": "blackmarket",
            "6": "netshield",
            "7": "spearphish",
            "8": "packetsniffer",
            "9": "files",
          };
          const target = appMap[e.key];
          if (target) openApp(target);
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [
    inspectedFile,
    audioMixerOpen,
    wipeModalOpen,
    startMenuOpen,
    activeApp,
    windows,
    minimizeApp,
    minimizeAll,
    toggleMute,
    openApp,
    setInspectedFile,
    setUiScale,
  ]);

  // Apply UI scale to root document so the taskbar and desktop layout never clip off-screen
  useEffect(() => {
    const factor =
      uiScale === "150%" ? "1.25" : uiScale === "125%" ? "1.12" : "1.0";
    document.documentElement.style.zoom = factor;
    return () => {
      document.documentElement.style.zoom = "1.0";
    };
  }, [uiScale]);

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    showContextMenu(e, [
      {
        header: "// SYSTEM OPERATIONS",
        items: [
          {
            label: "Launch Terminal",
            icon: <Terminal className="w-3.5 h-3.5" />,
            shortcut: "CTRL+4",
            onClick: () => openApp("terminal"),
          },
          {
            label: `${onboardingOpen ? "Hide" : "Show"} Orientation HUD`,
            icon: <Compass className="w-3.5 h-3.5" />,
            shortcut: "TUTOR",
            onClick: handleToggleOnboarding,
          },
          {
            label: "Minimize All Windows",
            icon: <Minimize2 className="w-3.5 h-3.5" />,
            shortcut: "CTRL+D",
            onClick: minimizeAll,
          },
          {
            label: "Reset Window Grid",
            icon: <RotateCcw className="w-3.5 h-3.5" />,
            shortcut: "RESET",
            onClick: resetWindowPositions,
          },
          {
            label: isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen",
            icon: <Maximize2 className="w-3.5 h-3.5" />,
            shortcut: "F11",
            onClick: toggleFullscreen,
          },
        ],
      },
      {
        header: "// DISPLAY & AUDIO",
        items: [
          {
            label: crtMode ? "Disable CRT Scanlines" : "Enable CRT Scanlines",
            icon: <Tv className="w-3.5 h-3.5" />,
            shortcut: "CRT",
            onClick: toggleCrtMode,
          },
          {
            label: `UI Scaling: ${uiScale}`,
            icon: <Sliders className="w-3.5 h-3.5" />,
            shortcut: "SCALE",
            onClick: () => {
              const nextScale =
                uiScale === "100%"
                  ? "125%"
                  : uiScale === "125%"
                    ? "150%"
                    : "100%";
              setUiScale(nextScale);
            },
          },
          {
            label: "Tactical Audio Mixer",
            icon: <Sliders className="w-3.5 h-3.5" />,
            shortcut: "MIXER",
            onClick: () => setAudioMixerOpen(true),
          },
        ],
      },
      {
        header: "// OPERATOR SESSION",
        items: [
          {
            label: `Log Out (${currentUser?.username || "Operator"})`,
            icon: <LogOut className="w-3.5 h-3.5" />,
            onClick: () => {
              if (
                window.confirm(
                  `Log out operator session (${currentUser?.username || "Operator"})?`,
                )
              ) {
                logout();
              }
            },
          },
          {
            label: "Wipe Progress / Restart Campaign",
            icon: <Trash2 className="w-3.5 h-3.5" />,
            danger: true,
            onClick: () => setWipeModalOpen(true),
          },
        ],
      },
      {
        header: "// EMERGENCY OVERRIDE",
        items: [
          {
            label: "Emergency Disconnect / Killswitch",
            icon: <ShieldAlert className="w-3.5 h-3.5" />,
            danger: true,
            onClick: () => connectToServer(null),
          },
        ],
      },
    ]);
  };

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Seamlessly unlock and ensure ambient music is playing on user interaction
  useEffect(() => {
    const handleInteraction = () => {
      sound.ensureMusicPlaying();
    };
    window.addEventListener("pointerdown", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    return () => {
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  const apps: {
    id: AppId;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    {
      id: "whisper",
      label: "WhisperChat",
      icon: <MessageSquare className="w-6 h-6" />,
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
    {
      id: "intraweb",
      label: "IntraWeb",
      icon: <Globe className="w-6 h-6" />,
    },
    {
      id: "passweaver",
      label: "PassWeaver",
      icon: <KeyRound className="w-6 h-6" />,
      badge: discoveredClues.length >= 2 ? discoveredClues.length : undefined,
    },
    {
      id: "spearphish",
      label: "SpearPhish",
      icon: <Fish className="w-6 h-6" />,
    },
    {
      id: "terminal",
      label: "Terminal",
      icon: <Terminal className="w-6 h-6" />,
    },
    {
      id: "blackmarket",
      label: "BlackMarket",
      icon: <ShoppingBag className="w-6 h-6" />,
    },
    {
      id: "netshield",
      label: "NetShield IDS",
      icon: (
        <ShieldAlert
          className={`w-6 h-6 ${underAttack ? "text-[#ff3b3b] animate-bounce" : ""}`}
        />
      ),
      badge: underAttack ? Math.round(firewallHealth) : undefined,
    },
    {
      id: "packetsniffer",
      label: "PacketSniffer",
      icon: <Radio className="w-6 h-6 text-[#58a6ff]" />,
    },
    {
      id: "georelay",
      label: "GeoRelay",
      icon: <Network className="w-6 h-6 text-[#58a6ff]" />,
      badge: activeProxyChain.length > 0 ? activeProxyChain.length : undefined,
    },
    {
      id: "files",
      label: "DataVault",
      icon: <FolderLock className="w-6 h-6" />,
      badge: downloadedFiles.length > 0 ? downloadedFiles.length : undefined,
    },
    {
      id: "bountyboard",
      label: "BountyBoard",
      icon: <Briefcase className="w-6 h-6 text-[#e3b341]" />,
    },
  ];

  // Only apps that are currently open show up in the bottom taskbar!
  const openAppsList = apps.filter((a) => windows[a.id].isOpen);

  if (!currentUser) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-[#060708]">
        {crtMode && (
          <div className="crt-overlay absolute inset-0 z-40 pointer-events-none" />
        )}
        <OperatorLoginScreen
          onLogin={login}
          onRegister={register}
          onGuest={guestLogin}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full min-h-screen overflow-hidden flex flex-col bg-[#060708] ${
        traceActive ? "trace-danger-frame border-2 border-[#ff3b3b]" : ""
      } ${underAttack && firewallHealth < 50 ? "screen-glitch-shake" : ""}`}
    >
      {/* Optional CRT Monitor Phosphor & Scanlines Overlay */}
      {crtMode && (
        <div className="crt-overlay absolute inset-0 z-40 pointer-events-none" />
      )}

      {/* Top Threat Banner when Active Trace is live */}
      {traceActive && (
        <div className="h-6 bg-[#ff3b3b] text-white font-mono font-bold text-[10px] tracking-widest uppercase flex items-center justify-center gap-3 animate-pulse z-50 shrink-0">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>
            CRITICAL ALERT // COUNTER-INTRUSION TRACE AT{" "}
            {tracePercent.toFixed(0)}% // DISCONNECT OR RUN 'wipe_logs'
          </span>
          <ShieldAlert className="w-3.5 h-3.5" />
        </div>
      )}

      {/* Clean Desktop Wallpaper */}
      <DesktopWallpaper />

      {/* Upper Desktop Area + Right Sidebar */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Main Desktop Surface */}
        <main
          onContextMenu={handleDesktopContextMenu}
          className="flex-1 h-full relative overflow-hidden"
        >
          {/* Desktop Shortcut Icons: Responsive multi-column grid that flows downwards then across */}
          <div className="p-4 grid grid-flow-col grid-rows-6 auto-cols-[88px] gap-2 max-h-[calc(100vh-64px)] relative z-20 select-none">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => openApp(app.id)}
                className="group w-[88px] flex flex-col items-center gap-1 p-2 border border-transparent hover:border-[#282f3d] hover:bg-[#11151d]/90 transition-all cursor-pointer relative"
              >
                <div className="w-10 h-10 bg-[#0e1218] border border-[#222834] group-hover:border-[#58a6ff] flex items-center justify-center text-[#79c0ff] transition-colors shadow-sm">
                  {app.icon}
                </div>
                <span className="text-[10px] text-[#c9d1d9] font-medium tracking-tight text-center leading-tight truncate w-full px-0.5">
                  {app.label}
                </span>
                {app.badge && (
                  <span className="absolute top-1 right-2 px-1.5 py-0.2 bg-[#1f6feb] text-white text-[9px] font-bold">
                    {app.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Floating Windows */}
          <WhisperChatApp />
          <IntraWebApp />
          <PassWeaverApp />
          <SpearPhishApp />
          <SmartTerminalApp />
          <BlackMarketApp />
          <NetShieldApp />
          <PacketSnifferApp />
          <GeoRelayApp />
          <DataVaultApp />
          <BountyBoardApp />

          {/* Toast Notifications */}
          <div className="fixed bottom-14 left-5 z-50 space-y-2 pointer-events-none">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`px-3.5 py-2.5 border-l-4 bg-[#0d1017] border border-[#282f3d] text-xs shadow-2xl ${
                  n.type === "warning"
                    ? "border-l-[#ff3b3b] text-[#ff5555]"
                    : n.type === "mission"
                      ? "border-l-[#3fb950] text-[#56d364]"
                      : "border-l-[#58a6ff] text-[#79c0ff]"
                }`}
              >
                <div className="font-bold text-[11px]">{n.title}</div>
                <div className="text-[11px] text-[#d4d7dc]">{n.message}</div>
              </div>
            ))}
          </div>
        </main>

        {/* Right-Hand Mission & Clue Board */}
        <ClueBoardSidebar />
      </div>

      {/* Single Unified Bottom OS Taskbar (Full Width) */}
      <footer className="h-11 px-3 bg-[#0b0e14] border-t border-[#1e232c] flex items-center justify-between z-40 select-none text-xs">
        {/* Left: OS Brand Button + Open Windows */}
        <div className="flex items-center gap-2 overflow-x-auto relative">
          <button
            onClick={() => setStartMenuOpen((prev) => !prev)}
            title="Start / System Applications (Ctrl+Esc)"
            className={`h-8 px-3 border font-bold flex items-center gap-2 mr-1 cursor-pointer transition-colors shadow-sm ${
              startMenuOpen
                ? "bg-[#1f6feb] border-[#58a6ff] text-white shadow-[0_0_12px_rgba(31,111,235,0.6)]"
                : "bg-[#161d28] border-[#303947] text-[#e6edf3] hover:border-[#58a6ff] hover:bg-[#1c2533]"
            }`}
          >
            <div className="w-4 h-4 bg-[#1f6feb]/30 border border-[#58a6ff] flex items-center justify-center text-[#58a6ff]">
              <Cpu className="w-3 h-3" />
            </div>
            <span className="font-mono tracking-wider text-[11px]">NEXUS</span>
          </button>

          {openAppsList.map((app) => {
            const win = windows[app.id];
            const isFocused = activeApp === app.id && !win.isMinimized;
            return (
              <button
                key={app.id}
                onClick={() => openApp(app.id)}
                className={`h-8 px-3 border text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                  isFocused
                    ? "bg-[#171c26] text-white border-[#58a6ff] font-semibold"
                    : "bg-[#0e1117] text-[#8b949e] border-[#21262d] hover:text-white"
                }`}
              >
                <span className="text-[#58a6ff] [&>svg]:w-4 [&>svg]:h-4">
                  {app.icon}
                </span>
                <span>{app.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center: Active Trace Alert (Only when active) */}
        {traceActive && (
          <div className="px-3 py-1 bg-[#ff3b3b] text-white font-bold uppercase flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>ACTIVE TRACE: {tracePercent.toFixed(0)}%</span>
          </div>
        )}

        {/* Right: System Tray (Wallet, Audio, Reset, Clock) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="hidden xl:flex h-8 px-2 bg-[#111620] border border-[#21262d] text-[10px] font-mono text-[#d29922] items-center font-bold">
            [{difficulty.toUpperCase()}]
          </div>

          <button
            onClick={() => {
              sound.playClick();
              const nextScale =
                uiScale === "100%"
                  ? "125%"
                  : uiScale === "125%"
                    ? "150%"
                    : "100%";
              setUiScale(nextScale);
            }}
            title="Toggle UI Scaling (100% / 125% / 150%) - Press Ctrl+0 to reset"
            className="flex h-8 px-2 bg-[#111620] border border-[#21262d] text-[#8b949e] hover:text-white cursor-pointer text-[10px] font-mono items-center shrink-0"
          >
            SCALE: {uiScale}
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen (F11)"}
            className="h-8 w-8 sm:w-auto sm:px-2 bg-[#111620] border border-[#21262d] text-[#8b949e] hover:text-[#58a6ff] hover:border-[#58a6ff] cursor-pointer flex items-center justify-center transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={() => openApp("blackmarket")}
            title="Open BlackMarket"
            className="h-8 px-2.5 bg-[#111620] border border-[#282f3d] text-[#79c0ff] font-bold cursor-pointer hover:border-[#58a6ff] flex items-center gap-1"
          >
            <Coins className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span className="text-[11px]">{crypto} ◈</span>
          </button>

          <button
            onClick={toggleCrtMode}
            title={crtMode ? "Disable CRT Scanlines" : "Enable CRT Scanlines"}
            className={`hidden sm:flex h-8 px-2 bg-[#111620] border text-xs cursor-pointer items-center gap-1 transition-colors ${
              crtMode
                ? "border-[#58a6ff] text-[#58a6ff] font-bold"
                : "border-[#21262d] text-[#8b949e] hover:text-white"
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="text-[10px]">CRT</span>
          </button>

          {/* One-Click OST Play/Pause Button */}
          <button
            onClick={() => {
              sound.toggleMusicPlayback();
              sound.playClick();
            }}
            title={
              isMusicPlaying
                ? "Pause Ambient Soundtrack"
                : "Play Ambient Soundtrack"
            }
            className={`h-8 px-2 sm:px-2.5 bg-[#111620] border text-[10px] font-mono flex items-center gap-1.5 cursor-pointer transition-colors ${
              isMusicPlaying
                ? "border-[#3fb950] text-[#3fb950] bg-[#122217]"
                : "border-[#e3b341] text-[#e3b341] hover:border-[#f0883e] bg-[#1c180d]"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isMusicPlaying
                  ? "bg-[#3fb950] shadow-[0_0_8px_#3fb950] animate-pulse"
                  : "bg-[#e3b341]"
              }`}
            />
            <span className="font-bold tracking-wider hidden md:inline">
              {isMusicPlaying
                ? traceActive || underAttack
                  ? "OST: COMBAT [❚❚]"
                  : "OST: PLAYING [❚❚]"
                : "OST: PAUSED [▶]"}
            </span>
            <span className="font-bold md:hidden">
              {isMusicPlaying ? "[❚❚]" : "[▶]"}
            </span>
          </button>

          {/* Tactical Audio Mixer Popover Toggle */}
          <button
            onClick={() => {
              setAudioMixerOpen(!audioMixerOpen);
              sound.ensureMusicPlaying();
            }}
            title="Tactical Audio Mixer (Music & SFX Volume)"
            className={`h-8 px-2 sm:px-2.5 bg-[#111620] border text-[10px] font-mono flex items-center gap-1.5 cursor-pointer transition-colors ${
              audioMixerOpen
                ? "border-[#58a6ff] text-white bg-[#171c26]"
                : "border-[#21262d] text-[#79c0ff] hover:border-[#58a6ff]"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span className="hidden xl:inline truncate max-w-[120px]">
              {isMuted
                ? "OST: MUTED"
                : traceActive || underAttack
                  ? "BEFORE THE LOCK"
                  : "SILENT PERIMETER"}
            </span>
          </button>

          <button
            onClick={toggleMute}
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
            className="h-8 w-8 bg-[#111620] border border-[#21262d] text-[#8b949e] hover:text-white cursor-pointer flex items-center justify-center shrink-0"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* Hardware Surveillance Indicator */}
          {camStatus === "active" ? (
            <div className="h-8 px-2 bg-[#290808] border border-[#ff3b3b] text-[10px] font-mono text-[#ff5555] font-bold flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#ff3b3b] animate-ping" />
              <span className="hidden sm:inline">[CAM: ON]</span>
            </div>
          ) : (
            <div className="hidden lg:flex h-8 px-2 bg-[#111620] border border-[#21262d] text-[10px] font-mono text-[#6e7681] items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#30363d]" />
              <span>[CAM: OFF]</span>
            </div>
          )}

          {/* Operator Badge & Logout */}
          <div className="h-8 px-2 sm:px-2.5 bg-[#111620] border border-[#21262d] text-[11px] font-mono text-[#c9d1d9] flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
            <span className="text-[#3fb950] font-bold truncate max-w-[70px] hidden sm:inline">
              {currentUser.username}
            </span>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    `Log out operator session (${currentUser.username})?`,
                  )
                ) {
                  logout();
                }
              }}
              title="Log Out Operator Session"
              className="text-[#8b949e] hover:text-[#ff5555] cursor-pointer flex items-center gap-1 bg-[#1a1416] px-1.5 py-0.5 border border-[#3b2329] hover:border-[#ff5555] transition-colors"
            >
              <LogOut className="w-3 h-3 text-[#ff7b72]" />
              <span className="text-[9px] uppercase font-bold text-[#ff7b72]">
                Exit
              </span>
            </button>
          </div>

          <button
            onClick={() => setWipeModalOpen(true)}
            title="Wipe Progress / Restart Campaign"
            className="h-8 px-2 bg-[#111620] border border-[#21262d] text-[#8b949e] hover:text-[#ff5555] hover:border-[#ff5555] cursor-pointer flex items-center gap-1 transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#ff7b72]" />
            <span className="hidden md:inline text-[10px] font-mono text-[#ff7b72] font-bold">
              WIPE
            </span>
          </button>

          <div className="h-8 px-2 sm:px-3 bg-[#111620] border border-[#21262d] text-[#c9d1d9] font-semibold flex items-center text-[11px] font-mono shrink-0">
            {clock}
          </div>
        </div>
      </footer>

      {/* Classic Windows-Style Diegetic Start Menu */}
      <NexusStartMenu
        isOpen={startMenuOpen}
        onClose={() => setStartMenuOpen(false)}
        onOpenApp={openApp}
        windows={windows}
        currentUser={currentUser}
        crypto={crypto}
        difficulty={difficulty}
        uiScale={uiScale}
        onToggleUiScale={() => {
          const nextScale =
            uiScale === "100%"
              ? "125%"
              : uiScale === "125%"
                ? "150%"
                : "100%";
          setUiScale(nextScale);
        }}
        crtMode={crtMode}
        onToggleCrt={toggleCrtMode}
        onOpenMixer={() => setAudioMixerOpen(true)}
        onOpenWipeModal={() => setWipeModalOpen(true)}
        onToggleOnboarding={handleToggleOnboarding}
        onboardingOpen={onboardingOpen}
        onLogout={logout}
      />

      {/* Tactical Orientation HUD */}
      {onboardingOpen && (
        <OnboardingHUD onClose={handleDismissOnboarding} />
      )}

      {/* Audio Mixer Popover */}
      {audioMixerOpen && (
        <AudioMixerPopover onClose={() => setAudioMixerOpen(false)} />
      )}

      {/* Global Tactical Context Menu */}
      <ContextMenu menu={contextMenu} onClose={hideContextMenu} />

      {/* Raw Hex & Metadata Inspector */}
      {inspectedFile && (
        <HexInspectorModal
          file={inspectedFile}
          onClose={() => setInspectedFile(null)}
        />
      )}

      {/* Drone Breach Kernel Panic Overlay */}
      {droneBreachPanic && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md font-mono select-none animate-pulse">
          <div className="max-w-md w-full bg-[#1b0808] border-2 border-[#ff3b3b] p-6 shadow-[0_0_80px_rgba(255,59,59,0.8)] space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 text-[#ff5555] font-black text-base uppercase tracking-widest">
              <AlertOctagon className="w-6 h-6 animate-ping text-[#ff3b3b]" />
              <span>KERNEL PANIC // DRONE BREACH</span>
            </div>
            <p className="text-xs text-[#ffaaaa] leading-relaxed">
              Hostile autonomous combat drone penetrated workstation perimeter!
              Local firewall collapsed. Emergency circuit breaker destruction
              in:
            </p>
            <div className="p-3 bg-[#0c0202] border border-[#ff3b3b] space-y-1">
              <div className="text-[10px] text-[#ff7b72] uppercase font-bold">
                SYSTEM PURGE COUNTDOWN:
              </div>
              <div className="text-3xl font-black text-[#ff3b3b] font-mono">
                00:
                {emergencyRebootSeconds < 10
                  ? `0${emergencyRebootSeconds}`
                  : emergencyRebootSeconds}
              </div>
            </div>
            <button
              onClick={triggerEmergencyReboot}
              className="w-full py-3 bg-[#ff3b3b] hover:bg-[#ff5555] text-black font-black text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-[0_0_20px_rgba(255,59,59,0.6)]"
            >
              [ PURGE INTERFACE BUFFER & RESTORE HARDWARE CIRCUIT ]
            </button>
          </div>
        </div>
      )}

      {/* Trace Reached 100% Modal */}
      {traceFailedAlert && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-5 bg-[#0b0d11] border-2 border-[#ff3b3b] space-y-4 text-xs font-mono shadow-[0_0_40px_rgba(255,59,59,0.5)]">
            <div className="px-2.5 py-1.5 bg-[#ff3b3b] text-black font-black uppercase flex items-center gap-2 tracking-wider">
              <AlertOctagon className="w-4 h-4 text-black" />
              <span>CRITICAL ALERT // TRACE REACHED 100%</span>
            </div>
            <div className="text-[#d4d7dc] leading-relaxed space-y-2">
              <p>
                Aethelgard's neural counter-trace isolated your egress node
                before forensic trails were purged!
              </p>
              <div className="p-2.5 bg-[#1b0a0a] border border-[#ff3b3b]/40 text-[#ff7b72] text-[11px] space-y-1">
                <div>• Cracked ports revoked on target host.</div>
                <div>• Offshore proxy circuit burned (-100 ◈).</div>
                <div>
                  • Quarantine active: {egressLockoutSeconds}s cooldown on
                  remote links.
                </div>
              </div>
            </div>
            <button
              onClick={dismissTraceAlert}
              className="w-full py-2.5 bg-[#ff3b3b] hover:bg-[#ff5555] text-black font-black uppercase tracking-wider cursor-pointer transition-colors"
            >
              [ ACKNOWLEDGE & RECONSTRUCT PROXY MESH ]
            </button>
          </div>
        </div>
      )}

      {/* Wipe Progress Confirmation Modal */}
      {wipeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 select-none">
          <div className="max-w-md w-full p-5 bg-[#0e090a] border-2 border-[#ff3b3b] space-y-4 text-xs font-mono shadow-[0_0_50px_rgba(255,59,59,0.3)] animate-window-in">
            <div className="px-2.5 py-1.5 bg-[#ff3b3b] text-white font-bold uppercase flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                CONFIRM DOSSIER PURGE // ZERO-FILL
              </span>
              <span className="text-[10px] bg-black/40 px-1.5 py-0.5">
                IRREVERSIBLE
              </span>
            </div>
            <p className="text-[#d4d7dc] leading-relaxed">
              Er du sikker på at du vil slette all fremgang for operatør{" "}
              <span className="text-white font-bold">
                {currentUser?.username || "GUEST"}
              </span>
              ?
            </p>
            <div className="p-3 bg-[#180a0c] border border-[#ff3b3b]/40 text-[#ff7b72] text-[11px] space-y-1">
              <div>
                • Tilbakestiller kampanjen til{" "}
                <span className="font-bold text-white">
                  Operasjon 01: Velox AI Infiltration
                </span>
              </div>
              <div>
                • Nullstiller saldo til{" "}
                <span className="font-bold text-white">50 ◈</span>
              </div>
              <div>• Sletter alle kjøpte exploits og stjålne arkiver</div>
              <div>
                • Fjerner alle innsamlede OSINT-ledetråder og knekte passord
              </div>
              <div>• Sletter lagret spilltilstand fra databasen</div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setWipeModalOpen(false)}
                className="py-2.5 bg-[#151921] hover:bg-[#202735] border border-[#303947] text-white font-bold text-xs uppercase cursor-pointer transition-colors"
              >
                AVBRYT / BEHOLD
              </button>
              <button
                onClick={() => {
                  setWipeModalOpen(false);
                  resetGame();
                }}
                className="py-2.5 bg-[#ff3b3b] hover:bg-[#ff5555] text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                SLETT ALL FREMGANG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <GameProvider>
      <DesktopEnvironment />
    </GameProvider>
  );
}

export default App;
