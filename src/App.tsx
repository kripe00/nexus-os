import React, { useEffect, useState } from 'react';
import {
  AlertOctagon,
  Coins,
  Cpu,
  FolderLock,
  Globe,
  KeyRound,
  MessageSquare,
  RotateCcw,
  ShieldAlert,
  ShoppingBag,
  Terminal,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { BlackMarketApp } from './apps/BlackMarketApp';
import { DataVaultApp } from './apps/DataVaultApp';
import { IntraWebApp } from './apps/IntraWebApp';
import { NetShieldApp } from './apps/NetShieldApp';
import { PassWeaverApp } from './apps/PassWeaverApp';
import { SmartTerminalApp } from './apps/SmartTerminalApp';
import { WhisperChatApp } from './apps/WhisperChatApp';
import { ClueBoardSidebar } from './components/ClueBoardSidebar';
import { DesktopWallpaper } from './components/DesktopWallpaper';
import { GameProvider, useGame } from './context/GameContext';
import { AppId } from './types/game';

const DesktopEnvironment: React.FC = () => {
  const {
    windows,
    activeApp,
    openApp,
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
  } = useGame();

  const [clock, setClock] = useState<string>('23:42');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const apps: {
    id: AppId;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    {
      id: 'whisper',
      label: 'WhisperChat',
      icon: <MessageSquare className="w-6 h-6" />,
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
    {
      id: 'intraweb',
      label: 'IntraWeb',
      icon: <Globe className="w-6 h-6" />,
    },
    {
      id: 'passweaver',
      label: 'PassWeaver',
      icon: <KeyRound className="w-6 h-6" />,
      badge: discoveredClues.length >= 2 ? discoveredClues.length : undefined,
    },
    {
      id: 'terminal',
      label: 'Terminal',
      icon: <Terminal className="w-6 h-6" />,
    },
    {
      id: 'blackmarket',
      label: 'BlackMarket',
      icon: <ShoppingBag className="w-6 h-6" />,
    },
    {
      id: 'netshield',
      label: 'NetShield IDS',
      icon: <ShieldAlert className={`w-6 h-6 ${underAttack ? 'text-[#ff3b3b] animate-bounce' : ''}`} />,
      badge: underAttack ? Math.round(firewallHealth) : undefined,
    },
    {
      id: 'files',
      label: 'DataVault',
      icon: <FolderLock className="w-6 h-6" />,
      badge: downloadedFiles.length > 0 ? downloadedFiles.length : undefined,
    },
  ];

  // Only apps that are currently open show up in the bottom taskbar!
  const openAppsList = apps.filter((a) => windows[a.id].isOpen);

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden flex flex-col bg-[#060708] ${
        traceActive ? 'trace-danger-frame border-2 border-[#ff3b3b]' : ''
      }`}
    >
      {/* Clean Desktop Wallpaper */}
      <DesktopWallpaper />

      {/* Upper Desktop Area + Right Sidebar */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Main Desktop Surface */}
        <main className="flex-1 h-full relative overflow-hidden">
          {/* Desktop Shortcut Icons (Classic OS Grid on Left) */}
          <div className="p-5 grid grid-cols-1 gap-3 w-28">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => openApp(app.id)}
                className="group flex flex-col items-center gap-1.5 p-2.5 border border-transparent hover:border-[#282f3d] hover:bg-[#11151d]/80 transition-all cursor-pointer relative"
              >
                <div className="w-11 h-11 bg-[#0e1218] border border-[#222834] group-hover:border-[#58a6ff] flex items-center justify-center text-[#79c0ff] transition-colors">
                  {app.icon}
                </div>
                <span className="text-[11px] text-[#c9d1d9] font-medium tracking-tight text-center leading-tight">
                  {app.label}
                </span>
                {app.badge && (
                  <span className="absolute top-1.5 right-3 px-1.5 py-0.2 bg-[#1f6feb] text-white text-[10px] font-bold">
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
          <SmartTerminalApp />
          <BlackMarketApp />
          <NetShieldApp />
          <DataVaultApp />

          {/* Toast Notifications */}
          <div className="fixed bottom-14 left-5 z-50 space-y-2 pointer-events-none">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`px-3.5 py-2.5 border-l-4 bg-[#0d1017] border border-[#282f3d] text-xs shadow-2xl ${
                  n.type === 'warning'
                    ? 'border-l-[#ff3b3b] text-[#ff5555]'
                    : n.type === 'mission'
                    ? 'border-l-[#3fb950] text-[#56d364]'
                    : 'border-l-[#58a6ff] text-[#79c0ff]'
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
        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="px-3 py-1.5 bg-[#151921] border border-[#303947] text-[#e6edf3] font-bold flex items-center gap-2 mr-1">
            <Cpu className="w-4 h-4 text-[#58a6ff]" />
            <span>NEXUS</span>
          </div>

          {openAppsList.map((app) => {
            const win = windows[app.id];
            const isFocused = activeApp === app.id && !win.isMinimized;
            return (
              <button
                key={app.id}
                onClick={() => openApp(app.id)}
                className={`h-8 px-3 border text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                  isFocused
                    ? 'bg-[#171c26] text-white border-[#58a6ff] font-semibold'
                    : 'bg-[#0e1117] text-[#8b949e] border-[#21262d] hover:text-white'
                }`}
              >
                <span className="text-[#58a6ff] [&>svg]:w-4 [&>svg]:h-4">{app.icon}</span>
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
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => openApp('blackmarket')}
            title="Open BlackMarket"
            className="h-8 px-3 bg-[#111620] border border-[#282f3d] text-[#79c0ff] font-bold cursor-pointer hover:border-[#58a6ff] flex items-center gap-1.5"
          >
            <Coins className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span>{crypto} ◈</span>
          </button>

          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="h-8 w-8 bg-[#111620] border border-[#21262d] text-[#8b949e] hover:text-white cursor-pointer flex items-center justify-center"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset campaign progress and start over from Operation 01?')) {
                resetGame();
              }
            }}
            title="Reset Campaign Progress"
            className="h-8 w-8 bg-[#111620] border border-[#21262d] text-[#8b949e] hover:text-[#ff5555] cursor-pointer flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="h-8 px-3 bg-[#111620] border border-[#21262d] text-[#c9d1d9] font-semibold flex items-center">
            {clock}
          </div>
        </div>
      </footer>

      {/* Trace Reached 100% Modal */}
      {traceFailedAlert && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-5 bg-[#0b0d11] border-2 border-[#ff3b3b] space-y-4 text-xs">
            <div className="px-2.5 py-1.5 bg-[#ff3b3b] text-white font-bold uppercase flex items-center gap-2">
              <AlertOctagon className="w-4 h-4" />
              <span>CRITICAL ALERT // TRACE REACHED 100%</span>
            </div>
            <p className="text-[#d4d7dc] leading-relaxed">
              Aethelgard's neural trace triangulated your proxy chain before <span className="text-white font-bold">/var/connection.log</span> was wiped. Emergency circuit breaker severed your session.
            </p>
            <p className="text-[#79c0ff]">
              Re-run `crack 443`, `connect 203.0.113.88`, `download PROJECT_MIRROR_TARGETS.dec`, and immediately execute `wipe_logs` + `disconnect`.
            </p>
            <button
              onClick={dismissTraceAlert}
              className="w-full py-2 bg-[#ff3b3b] hover:bg-[#ff5555] text-white font-bold uppercase tracking-wider cursor-pointer"
            >
              [ RETRY BREACH ]
            </button>
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
