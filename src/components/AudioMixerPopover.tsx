import React, { useEffect, useState } from "react";
import {
  Bell,
  Check,
  Disc3,
  Headphones,
  Mic,
  Music,
  Pause,
  Play,
  Sliders,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useGame } from "../context/GameContext";
import { sound } from "../utils/sound";
import { voice } from "../utils/voice";

interface AudioMixerPopoverProps {
  onClose: () => void;
}

export const AudioMixerPopover: React.FC<AudioMixerPopoverProps> = ({
  onClose,
}) => {
  const {
    musicVolume,
    setMusicVolume,
    sfxVolume,
    setSfxVolume,
    isMuted,
    toggleMute,
    traceActive,
    underAttack,
  } = useGame();

  const [isPlaying, setIsPlaying] = useState<boolean>(() =>
    sound.isMusicPlaying(),
  );
  const [voiceState, setVoiceState] = useState<{
    enabled: boolean;
    volume: number;
    voiceName: string;
  }>({
    enabled: voice.enabled,
    volume: voice.volume,
    voiceName: voice.selectedVoiceName,
  });
  const [availableVoices, setAvailableVoices] = useState(() =>
    voice.getAvailableVoices(),
  );

  useEffect(() => {
    const unsubSound = sound.subscribe((playing) => {
      setIsPlaying(playing);
    });
    const unsubVoice = voice.subscribe((vs) => {
      setVoiceState(vs);
      setAvailableVoices(voice.getAvailableVoices());
    });
    return () => {
      unsubSound();
      unsubVoice();
    };
  }, []);

  const handleTestSfx = () => {
    sound.playCryptoCoin();
  };

  const handleTestVoice = () => {
    voice.speak('Voice active. Transmission ready.', { priority: true });
  };

  const handleToggleMusicMute = () => {
    sound.toggleMusicMute();
    sound.playClick();
  };

  const handleToggleSfxMute = () => {
    sound.toggleSfxMute();
    sound.playClick();
  };

  const handleToggleVoice = () => {
    voice.toggleEnabled();
    sound.playClick();
  };

  const handlePlayPause = () => {
    sound.toggleMusicPlayback();
    sound.playClick();
  };

  const activeTrackName =
    traceActive || underAttack ? "BEFORE THE LOCK" : "THE SILENT PERIMETER";

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute bottom-12 right-4 w-72 bg-[#0c0f16] border border-[#2b3545] p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.95)] z-50 space-y-3 text-xs select-none animate-window-in font-mono"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#1c232f] pb-2 text-[11px]">
        <div className="flex items-center gap-2 text-white font-bold uppercase">
          <Sliders className="w-3.5 h-3.5 text-[#58a6ff]" />
          <span>AUDIO MIXER // NEXUS SOUND ENGINE</span>
        </div>
        <button
          onClick={onClose}
          className="text-[#8b949e] hover:text-white cursor-pointer p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Currently Playing Track */}
      <div className="p-2.5 bg-[#07090e] border border-[#18202c] space-y-1">
        <div className="text-[9px] uppercase tracking-wider text-[#6e7681] flex items-center justify-between">
          <span>NOW PLAYING:</span>
          <span
            className={
              traceActive || underAttack ? "text-[#ff5555]" : "text-[#3fb950]"
            }
          >
            {traceActive || underAttack ? "THREAT OST" : "AMBIENT OST"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-1 pt-0.5">
          <div className="text-xs font-bold text-[#79c0ff] truncate flex items-center gap-1.5 flex-1">
            <Disc3
              className={`w-3.5 h-3.5 text-[#58a6ff] ${isPlaying ? "animate-spin" : ""}`}
            />
            <span className="truncate">{activeTrackName}</span>
          </div>
          <button
            onClick={handlePlayPause}
            className={`px-2 py-0.5 border text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
              isPlaying
                ? "bg-[#15231c] border-[#3fb950] text-[#3fb950]"
                : "bg-[#1f2838] border-[#58a6ff] text-[#79c0ff] hover:text-white"
            }`}
          >
            {isPlaying ? (
              <Pause className="w-3 h-3" />
            ) : (
              <Play className="w-3 h-3" />
            )}
            <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
          </button>
        </div>
      </div>

      {/* Channel 1: Soundtrack / Music Volume */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-white font-bold flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span>MUSIC CHANNEL</span>
          </span>
          <span className="text-[#58a6ff] font-bold">
            {Math.round(musicVolume * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={musicVolume}
            onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
            className="flex-1 h-1.5 bg-[#181e28] accent-[#58a6ff] cursor-pointer"
          />
          <button
            onClick={handleToggleMusicMute}
            title="Mute Music Channel"
            className={`p-1 border cursor-pointer ${
              sound.musicMuted
                ? "bg-[#260e0e] border-[#ff3b3b] text-[#ff5555]"
                : "bg-[#151921] border-[#2b3545] text-[#8b949e] hover:text-white"
            }`}
          >
            {sound.musicMuted ? (
              <VolumeX className="w-3 h-3" />
            ) : (
              <Volume2 className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {/* Channel 2: SFX / Tactical Sounds Volume */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-white font-bold flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5 text-[#3fb950]" />
            <span>SFX CHANNEL</span>
          </span>
          <span className="text-[#3fb950] font-bold">
            {Math.round(sfxVolume * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={sfxVolume}
            onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
            className="flex-1 h-1.5 bg-[#181e28] accent-[#3fb950] cursor-pointer"
          />
          <button
            onClick={handleToggleSfxMute}
            title="Mute SFX Channel"
            className={`p-1 border cursor-pointer ${
              sound.sfxMuted
                ? "bg-[#260e0e] border-[#ff3b3b] text-[#ff5555]"
                : "bg-[#151921] border-[#2b3545] text-[#8b949e] hover:text-white"
            }`}
          >
            {sound.sfxMuted ? (
              <VolumeX className="w-3 h-3" />
            ) : (
              <Volume2 className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {/* Channel 3: AI Neural Voice Synthesizer */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-white font-bold flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-[#d29922]" />
            <span>NEURAL AI VOICE (TTS)</span>
          </span>
          <span className="text-[#d29922] font-bold">
            {voiceState.enabled ? `${Math.round(voiceState.volume * 100)}%` : 'MUTED'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            disabled={!voiceState.enabled}
            value={voiceState.volume}
            onChange={(e) => voice.setVolume(parseFloat(e.target.value))}
            className="flex-1 h-1.5 bg-[#181e28] accent-[#d29922] cursor-pointer disabled:opacity-40"
          />
          <button
            onClick={handleToggleVoice}
            title={voiceState.enabled ? 'Mute AI Voice' : 'Enable AI Voice'}
            className={`p-1 border cursor-pointer ${
              !voiceState.enabled
                ? 'bg-[#260e0e] border-[#ff3b3b] text-[#ff5555]'
                : 'bg-[#221c12] border-[#d29922] text-[#e3b341]'
            }`}
          >
            {!voiceState.enabled ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
          </button>
        </div>

        {voiceState.enabled && availableVoices.length > 0 && (
          <div className="pt-0.5">
            <select
              value={voiceState.voiceName}
              onChange={(e) => {
                voice.setVoice(e.target.value);
                sound.playClick();
                voice.speak('Voice profile updated.', { priority: true });
              }}
              className="w-full py-1 px-1.5 bg-[#07090e] border border-[#261f14] text-[#e3b341] text-[10px] focus:outline-none focus:border-[#d29922] font-mono cursor-pointer"
            >
              {availableVoices.map((v) => (
                <option key={v.name} value={v.name} className="bg-[#0c0f16] text-[#d4d7dc]">
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Footer controls: Test beep, Test Voice & Master mute */}
      <div className="pt-2 border-t border-[#1c232f] flex items-center justify-between gap-1 text-[10px]">
        <div className="flex items-center gap-1">
          <button
            onClick={handleTestSfx}
            className="px-1.5 py-1 bg-[#151921] hover:bg-[#202735] border border-[#2b3545] text-[#8b949e] hover:text-white cursor-pointer flex items-center gap-1"
          >
            <Bell className="w-3 h-3 text-[#58a6ff]" />
            <span>SFX</span>
          </button>
          <button
            onClick={handleTestVoice}
            className="px-1.5 py-1 bg-[#151921] hover:bg-[#202735] border border-[#2b3545] text-[#8b949e] hover:text-white cursor-pointer flex items-center gap-1"
          >
            <Mic className="w-3 h-3 text-[#d29922]" />
            <span>VOICE</span>
          </button>
        </div>

        <button
          onClick={toggleMute}
          className={`px-2 py-1 border font-bold cursor-pointer transition-colors ${
            isMuted
              ? "bg-[#ff3b3b] text-white border-[#ff5555]"
              : "bg-[#122117] text-[#3fb950] border-[#238636]"
          }`}
        >
          {isMuted ? "MASTER MUTED" : "MASTER UNMUTED"}
        </button>
      </div>
    </div>
  );
};
