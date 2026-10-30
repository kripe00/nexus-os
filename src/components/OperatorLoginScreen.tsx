import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Eye,
  KeyRound,
  Lock,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Shield,
  ShieldAlert,
  Sliders,
  Terminal,
  Trash2,
  Tv,
  User,
  UserPlus,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useGame } from "../context/GameContext";
import { DifficultyPreset, UiScaleOption } from "../types/game";
import { sound } from "../utils/sound";

interface OperatorLoginScreenProps {
  onLogin: (
    username: string,
    pass: string,
  ) => Promise<{ success: boolean; error?: string }>;
  onRegister: (
    username: string,
    pass: string,
  ) => Promise<{ success: boolean; error?: string }>;
  onGuest: () => void;
}

type MenuTab =
  "resume" | "new_game" | "slots" | "settings" | "guest" | "db_auth";

export const OperatorLoginScreen: React.FC<OperatorLoginScreenProps> = ({
  onLogin,
  onRegister,
  onGuest,
}) => {
  const {
    saveSlots,
    activeSlotId,
    loadProfileSlot,
    createProfileSlot,
    deleteProfileSlot,
    difficulty,
    setDifficulty,
    uiScale,
    setUiScale,
    crtMode,
    setCrtMode,
    toggleCrtMode,
    musicVolume,
    setMusicVolume,
    sfxVolume,
    setSfxVolume,
    isMuted,
    toggleMute,
  } = useGame();

  const activeSlot =
    saveSlots.find((s) => s.id === activeSlotId) ||
    saveSlots.find((s) => s.operatorHandle !== "EMPTY_SLOT") ||
    null;

  const [activeTab, setActiveTab] = useState<MenuTab>(
    activeSlot && activeSlot.operatorHandle !== "EMPTY_SLOT"
      ? "resume"
      : "new_game",
  );

  // New Operation Form State
  const [newCodename, setNewCodename] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyPreset>(difficulty);
  const [targetSlotId, setTargetSlotId] = useState("slot_1");

  // Advanced Database Auth Form State
  const [dbMode, setDbMode] = useState<"login" | "register">("login");
  const [dbUsername, setDbUsername] = useState("");
  const [dbPassword, setDbPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fullscreen helper
  const [isFullscreen, setIsFullscreen] = useState(
    () => typeof document !== "undefined" && !!document.fullscreenElement,
  );

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

  const handleResumeActiveSlot = () => {
    sound.playClick();
    sound.ensureMusicPlaying();
    if (activeSlot && activeSlot.operatorHandle !== "EMPTY_SLOT") {
      loadProfileSlot(activeSlot.id);
    } else {
      loadProfileSlot("slot_1");
    }
  };

  const handleStartNewOperation = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    sound.ensureMusicPlaying();
    const handle =
      newCodename.trim() || `GHOST_${Math.floor(100 + Math.random() * 900)}`;
    createProfileSlot(handle, selectedDifficulty, targetSlotId);
  };

  const handleDbSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!dbUsername.trim() || !dbPassword.trim()) {
      sound.playError();
      setError("Please provide an Operator Handle and Passphrase.");
      return;
    }

    setLoading(true);
    sound.playKey();

    try {
      if (dbMode === "login") {
        const res = await onLogin(dbUsername, dbPassword);
        if (!res.success) {
          sound.playError();
          setError(
            res.error || "Authentication rejected. Invalid credentials.",
          );
        } else {
          sound.playSuccess();
          sound.ensureMusicPlaying();
        }
      } else {
        const res = await onRegister(dbUsername, dbPassword);
        if (!res.success) {
          sound.playError();
          setError(res.error || "Operator registration failed.");
        } else {
          sound.playSuccess();
          sound.ensureMusicPlaying();
        }
      }
    } catch {
      sound.playError();
      setError(
        "Could not connect to backend server. Fallback to offline slots.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#040608] flex items-center justify-center p-4 select-none z-50 tactical-scanlines font-mono">
      {/* Background Matrix Ambient Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#313d52 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-2xl w-full bg-[#080b11] border border-[#2b3548] p-6 space-y-5 shadow-[0_24px_80px_rgba(0,0,0,0.95)] relative z-10 animate-window-in">
        {/* Terminal Header */}
        <div className="border-b border-[#1b2332] pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#58a6ff] tracking-widest uppercase">
              <Cpu className="w-4 h-4 text-[#58a6ff]" />
              <span>NEXUS // OS • KERNEL 6.11.0</span>
            </div>
            <h1 className="text-base font-black text-white tracking-tight uppercase">
              TACTICAL OPERATOR DISPATCH & LAUNCHER
            </h1>
            <p className="text-[10px] text-[#8b949e]">
              Offline-first dossier persistence active. Choose operational
              profile or configure workstation.
            </p>
          </div>
          <div className="text-right space-y-1">
            <span className="px-2 py-0.5 bg-[#0f2416] border border-[#238636] text-[#3fb950] text-[9px] font-bold tracking-widest uppercase inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse" />
              SYSTEM_READY
            </span>
            <div className="text-[10px] text-[#6e7681]">
              BUILD v1.0.4-RELEASE
            </div>
          </div>
        </div>

        {/* Tactical Navigation Tabs */}
        <div className="grid grid-cols-5 gap-1 p-1 bg-[#05070a] border border-[#1a202c] text-xs">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab("resume");
            }}
            className={`py-1.5 px-2 text-center font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "resume"
                ? "bg-[#151921] border border-[#58a6ff] text-white"
                : "text-[#8b949e] hover:text-white"
            }`}
          >
            <Play className="w-3.5 h-3.5 text-[#3fb950]" />
            <span>RESUME</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab("new_game");
            }}
            className={`py-1.5 px-2 text-center font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "new_game"
                ? "bg-[#151921] border border-[#58a6ff] text-white"
                : "text-[#8b949e] hover:text-white"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span>NEW RIG</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab("slots");
            }}
            className={`py-1.5 px-2 text-center font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "slots"
                ? "bg-[#151921] border border-[#58a6ff] text-white"
                : "text-[#8b949e] hover:text-white"
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#d29922]" />
            <span>DOSSIERS</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab("settings");
            }}
            className={`py-1.5 px-2 text-center font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "settings"
                ? "bg-[#151921] border border-[#58a6ff] text-white"
                : "text-[#8b949e] hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-[#a371f7]" />
            <span>SETTINGS</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab("db_auth");
            }}
            className={`py-1.5 px-2 text-center font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "db_auth"
                ? "bg-[#151921] border border-[#58a6ff] text-white"
                : "text-[#8b949e] hover:text-white"
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-[#6e7681]" />
            <span>DB_AUTH</span>
          </button>
        </div>

        {/* Tab 1: Resume Dossier */}
        {activeTab === "resume" && (
          <div className="space-y-4 py-1">
            <div className="p-4 bg-[#0a0f18] border border-[#1f2d42] space-y-3">
              <div className="flex items-center justify-between border-b border-[#162233] pb-2">
                <div className="text-xs font-bold text-[#79c0ff] uppercase flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3fb950]" />
                  <span>ACTIVE OPERATIONAL DOSSIER DETECTED</span>
                </div>
                <span className="px-2 py-0.5 bg-[#121d2f] text-[#58a6ff] text-[10px] font-bold uppercase border border-[#1f375e]">
                  {activeSlot?.difficulty.toUpperCase() || "OPERATIVE"} MODE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#6e7681] block text-[10px] uppercase font-bold">
                    OPERATOR HANDLE:
                  </span>
                  <span className="text-white font-bold text-sm">
                    {activeSlot?.operatorHandle || "KODEX_01"}
                  </span>
                </div>
                <div>
                  <span className="text-[#6e7681] block text-[10px] uppercase font-bold">
                    CRYPTO ESCROW:
                  </span>
                  <span className="text-[#e3b341] font-bold text-sm">
                    {activeSlot?.crypto || 50} ◈
                  </span>
                </div>
                <div>
                  <span className="text-[#6e7681] block text-[10px] uppercase font-bold">
                    CURRENT CHAPTER / PROGRESS:
                  </span>
                  <span className="text-[#3fb950] font-bold">
                    Operation 0{(activeSlot?.currentMissionIndex || 0) + 1} //{" "}
                    {activeSlot?.completedMissionsCount || 0} Cleared
                  </span>
                </div>
                <div>
                  <span className="text-[#6e7681] block text-[10px] uppercase font-bold">
                    LAST RECORDED STAMP:
                  </span>
                  <span className="text-[#8b949e]">
                    {activeSlot?.updatedAt || "Active Today"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleResumeActiveSlot}
              className="w-full py-3 bg-[#238636] hover:bg-[#2ea043] text-white font-black text-sm uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(35,134,54,0.4)]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>[ RESUME MISSION DOSSIER → ]</span>
            </button>
          </div>
        )}

        {/* Tab 2: New Operation Rig */}
        {activeTab === "new_game" && (
          <form onSubmit={handleStartNewOperation} className="space-y-4 py-1">
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-[#8b949e]">
                ENTER OPERATOR CODENAME / HANDLE:
              </label>
              <div className="flex items-center bg-[#05070a] border border-[#212836] px-3 py-2 focus-within:border-[#58a6ff]">
                <User className="w-4 h-4 text-[#58a6ff] mr-2 shrink-0" />
                <input
                  type="text"
                  value={newCodename}
                  onChange={(e) => setNewCodename(e.target.value)}
                  placeholder="e.g. PHANTOM_77, CYBER_SPECTRE"
                  className="w-full bg-transparent text-xs text-white placeholder-[#505a68] focus:outline-none font-mono"
                  autoFocus
                />
              </div>
            </div>

            {/* Target Save Slot Picker */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-[#8b949e]">
                TARGET DOSSIER STORAGE SLOT:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {saveSlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setTargetSlotId(slot.id);
                    }}
                    className={`p-2 text-left border cursor-pointer transition-colors ${
                      targetSlotId === slot.id
                        ? "bg-[#141b27] border-[#58a6ff] text-white"
                        : "bg-[#05070a] border-[#1e2430] text-[#8b949e] hover:text-white"
                    }`}
                  >
                    <div className="font-bold text-[11px] uppercase">
                      {slot.id.replace("_", " ")}
                    </div>
                    <div className="text-[10px] text-[#6e7681] truncate">
                      {slot.operatorHandle === "EMPTY_SLOT"
                        ? "[AVAILABLE SLOT]"
                        : slot.operatorHandle}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Preset Picker */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-[#8b949e]">
                SELECT OPERATIONAL DIFFICULTY:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedDifficulty("analyst");
                  }}
                  className={`p-2.5 text-left border cursor-pointer transition-colors ${
                    selectedDifficulty === "analyst"
                      ? "bg-[#0b1c13] border-[#3fb950] text-white"
                      : "bg-[#05070a] border-[#1e2430] text-[#8b949e] hover:text-white"
                  }`}
                >
                  <div className="font-bold text-[#3fb950] text-xs uppercase">
                    ANALYST (STORY)
                  </div>
                  <div className="text-[10px] text-[#8b949e] mt-1 leading-snug">
                    • Trace speed: -25%
                    <br />
                    • Free client hints
                    <br />• Standard fail recovery
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedDifficulty("operative");
                  }}
                  className={`p-2.5 text-left border cursor-pointer transition-colors ${
                    selectedDifficulty === "operative"
                      ? "bg-[#181a0b] border-[#d29922] text-white"
                      : "bg-[#05070a] border-[#1e2430] text-[#8b949e] hover:text-white"
                  }`}
                >
                  <div className="font-bold text-[#d29922] text-xs uppercase">
                    OPERATIVE (NORMAL)
                  </div>
                  <div className="text-[10px] text-[#8b949e] mt-1 leading-snug">
                    • Authentic trace timing
                    <br />
                    • 50 ◈ per client hint
                    <br />• High-stakes fail states
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedDifficulty("ghost");
                  }}
                  className={`p-2.5 text-left border cursor-pointer transition-colors ${
                    selectedDifficulty === "ghost"
                      ? "bg-[#210909] border-[#ff3b3b] text-white"
                      : "bg-[#05070a] border-[#1e2430] text-[#8b949e] hover:text-white"
                  }`}
                >
                  <div className="font-bold text-[#ff5555] text-xs uppercase">
                    ZERO-GHOST (HARDCORE)
                  </div>
                  <div className="text-[10px] text-[#8b949e] mt-1 leading-snug">
                    • Trace speed: +35%
                    <br />
                    • No client hints allowed
                    <br />• Severe quarantine penalties
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1f6feb] hover:bg-[#388bfd] text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              <span>[ INITIALIZE RIG & LAUNCH OPERATION 01 → ]</span>
            </button>
          </form>
        )}

        {/* Tab 3: Save Slots Management */}
        {activeTab === "slots" && (
          <div className="space-y-3 py-1">
            <div className="text-[10px] uppercase font-bold text-[#8b949e]">
              SAVED OPERATOR PROFILES (LOCAL STORAGE PERSISTED):
            </div>
            <div className="space-y-2">
              {saveSlots.map((slot) => {
                const isEmpty = slot.operatorHandle === "EMPTY_SLOT";
                return (
                  <div
                    key={slot.id}
                    className="p-3 bg-[#0a0d14] border border-[#1e2636] flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">
                          {slot.id.toUpperCase()}:
                        </span>
                        <span
                          className={
                            isEmpty
                              ? "text-[#6e7681]"
                              : "text-[#58a6ff] font-bold"
                          }
                        >
                          {slot.operatorHandle}
                        </span>
                        {!isEmpty && (
                          <span className="px-1.5 py-0.2 bg-[#121f33] text-[#79c0ff] text-[9px] font-mono uppercase">
                            {slot.difficulty}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#8b949e]">
                        {isEmpty
                          ? "Empty slot. Create a new rig to write dossier here."
                          : `Op 0${slot.currentMissionIndex + 1} • ${slot.crypto} ◈ • Last played: ${slot.updatedAt}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!isEmpty ? (
                        <>
                          <button
                            onClick={() => {
                              sound.playClick();
                              sound.ensureMusicPlaying();
                              loadProfileSlot(slot.id);
                            }}
                            className="px-3 py-1 bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-[11px] uppercase cursor-pointer"
                          >
                            LOAD
                          </button>
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  `Purge profile slot ${slot.id} (${slot.operatorHandle})?`,
                                )
                              ) {
                                deleteProfileSlot(slot.id);
                              }
                            }}
                            className="p-1 bg-[#1a0f0f] hover:bg-[#ff3b3b] text-[#ff7b72] hover:text-white border border-[#3f1818] cursor-pointer transition-colors"
                            title="Purge profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            sound.playClick();
                            setTargetSlotId(slot.id);
                            setActiveTab("new_game");
                          }}
                          className="px-3 py-1 bg-[#161c28] hover:bg-[#1f6feb] border border-[#232f44] text-[#8b949e] hover:text-white font-bold text-[11px] uppercase cursor-pointer"
                        >
                          + NEW RIG
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Workstation Settings */}
        {activeTab === "settings" && (
          <div className="space-y-4 py-1 text-xs">
            {/* Audio Settings */}
            <div className="p-3 bg-[#0a0d14] border border-[#1e2636] space-y-3">
              <div className="font-bold text-white text-[11px] uppercase flex items-center justify-between border-b border-[#1b2332] pb-1.5">
                <span className="flex items-center gap-1.5 text-[#58a6ff]">
                  <Volume2 className="w-3.5 h-3.5" />
                  AUDIO CHANNELS & SYNTHESIS
                </span>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="text-[10px] text-[#79c0ff] hover:underline cursor-pointer flex items-center gap-1"
                >
                  {isMuted ? (
                    <VolumeX className="w-3 h-3 text-[#ff5555]" />
                  ) : (
                    <Volume2 className="w-3 h-3 text-[#3fb950]" />
                  )}
                  {isMuted ? "UNMUTE ALL" : "MUTE MASTER"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-[#8b949e]">
                    <span>AMBIENT SYNTH MUSIC:</span>
                    <span>{Math.round(musicVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                    className="w-full accent-[#58a6ff] cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-[#8b949e]">
                    <span>TACTICAL SFX / KEYSTROKES:</span>
                    <span>{Math.round(sfxVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={sfxVolume}
                    onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                    className="w-full accent-[#58a6ff] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Display & Accessibility Settings */}
            <div className="p-3 bg-[#0a0d14] border border-[#1e2636] space-y-3">
              <div className="font-bold text-white text-[11px] uppercase flex items-center gap-1.5 border-b border-[#1b2332] pb-1.5 text-[#a371f7]">
                <Tv className="w-3.5 h-3.5" />
                DISPLAY & ACCESSIBILITY
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* CRT Toggle */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[#8b949e] uppercase block font-bold">
                    CRT SCANLINES & FLICKER:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      toggleCrtMode();
                    }}
                    className={`w-full py-2 px-3 border text-left font-bold text-[11px] cursor-pointer flex items-center justify-between ${
                      crtMode
                        ? "bg-[#182319] border-[#3fb950] text-[#3fb950]"
                        : "bg-[#141822] border-[#2b3548] text-[#8b949e]"
                    }`}
                  >
                    <span>
                      {crtMode ? "ENABLED (TACTICAL)" : "DISABLED (CLEAN LCD)"}
                    </span>
                    <span className="text-[9px] uppercase">
                      {crtMode ? "ON" : "OFF"}
                    </span>
                  </button>
                  <p className="text-[9px] text-[#6e7681]">
                    [Photosensitivity note: Disabling turns off all scanline
                    flicker].
                  </p>
                </div>

                {/* UI Scaling */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[#8b949e] uppercase block font-bold">
                    UI & TEXT SCALING:
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    {(["100%", "125%", "150%"] as UiScaleOption[]).map(
                      (scale) => (
                        <button
                          key={scale}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setUiScale(scale);
                          }}
                          className={`py-1.5 text-center font-bold text-[11px] border cursor-pointer ${
                            uiScale === scale
                              ? "bg-[#1f6feb] border-[#58a6ff] text-white"
                              : "bg-[#05070a] border-[#212836] text-[#8b949e] hover:text-white"
                          }`}
                        >
                          {scale}
                        </button>
                      ),
                    )}
                  </div>
                  <p className="text-[9px] text-[#6e7681]">
                    Adjusts font and element scale for larger monitors or
                    readability.
                  </p>
                </div>
              </div>

              {/* Fullscreen Button */}
              <div className="pt-2 border-t border-[#161c28] flex items-center justify-between">
                <span className="text-[10px] text-[#8b949e] uppercase font-bold">
                  FULLSCREEN WORKSTATION MODE:
                </span>
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="px-3 py-1.5 bg-[#151921] hover:bg-[#1f2633] border border-[#2b3548] text-white text-[11px] font-bold cursor-pointer flex items-center gap-1.5"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-3.5 h-3.5 text-[#58a6ff]" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5 text-[#58a6ff]" />
                  )}
                  <span>
                    {isFullscreen
                      ? "EXIT FULLSCREEN"
                      : "ENTER FULLSCREEN (F11)"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Traditional Database Auth */}
        {activeTab === "db_auth" && (
          <form onSubmit={handleDbSubmit} className="space-y-3.5 py-1">
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#05070a] border border-[#1a202c]">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setDbMode("login");
                  setError(null);
                }}
                className={`py-1 text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 ${
                  dbMode === "login"
                    ? "bg-[#151921] border border-[#58a6ff] text-white"
                    : "text-[#8b949e] hover:text-white"
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>SQLITE LOGIN</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setDbMode("register");
                  setError(null);
                }}
                className={`py-1 text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 ${
                  dbMode === "register"
                    ? "bg-[#151921] border border-[#58a6ff] text-white"
                    : "text-[#8b949e] hover:text-white"
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>SQLITE REGISTER</span>
              </button>
            </div>

            {error && (
              <div className="p-2.5 bg-[#210909] border border-[#ff3b3b] text-[#ff5555] text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-[#8b949e]">
                SQLITE OPERATOR HANDLE:
              </label>
              <div className="flex items-center bg-[#05070a] border border-[#212836] px-3 py-2 focus-within:border-[#58a6ff]">
                <User className="w-4 h-4 text-[#6e7681] mr-2 shrink-0" />
                <input
                  type="text"
                  value={dbUsername}
                  onChange={(e) => setDbUsername(e.target.value)}
                  placeholder="e.g. ServerOperator"
                  className="w-full bg-transparent text-xs text-white placeholder-[#505a68] focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-[#8b949e]">
                SECRET PASSPHRASE:
              </label>
              <div className="flex items-center bg-[#05070a] border border-[#212836] px-3 py-2 focus-within:border-[#58a6ff]">
                <KeyRound className="w-4 h-4 text-[#6e7681] mr-2 shrink-0" />
                <input
                  type="password"
                  value={dbPassword}
                  onChange={(e) => setDbPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-transparent text-xs text-white placeholder-[#505a68] focus:outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#1f6feb] hover:bg-[#388bfd] disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              <span>
                {loading
                  ? "AUTHENTICATING..."
                  : dbMode === "login"
                    ? "SQLITE BOOT NEXUS OS →"
                    : "REGISTER & BOOT →"}
              </span>
            </button>
          </form>
        )}

        {/* Instant Guest / Casual Launch Footer */}
        <div className="pt-3 border-t border-[#1b2332] flex items-center justify-between text-xs">
          <span className="text-[10px] text-[#6e7681]">
            OR IMMEDIATE PLAYTEST:
          </span>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              sound.ensureMusicPlaying();
              onGuest();
            }}
            className="px-4 py-1.5 bg-[#10141d] hover:bg-[#161c28] border border-[#212836] hover:border-[#58a6ff] text-[#79c0ff] font-bold text-[11px] uppercase cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span>[ QUICK GUEST LAUNCH (ZERO SETUP) ]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
