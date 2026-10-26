import React, { useEffect, useState } from "react";
import {
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Compass,
  ExternalLink,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";
import { useGame } from "../context/GameContext";
import { sound } from "../utils/sound";
import { voice } from "../utils/voice";

interface OnboardingHUDProps {
  onClose: () => void;
}

export const OnboardingHUD: React.FC<OnboardingHUDProps> = ({ onClose }) => {
  const {
    windows,
    openApp,
    activeApp,
    discoveredClues,
    crackedEmails,
    loggedIntoEmails,
    scannedIps,
    currentMissionIndex,
    addCrypto,
  } = useGame();

  const [minimized, setMinimized] = useState<boolean>(false);
  const [rewardClaimed, setRewardClaimed] = useState<boolean>(false);

  // Evaluate step conditions
  const step1Done = Boolean(windows.whisper?.isOpen || activeApp === "whisper");
  const step2Done = Boolean(windows.intraweb?.isOpen || activeApp === "intraweb");
  const step3Done = Boolean(discoveredClues.length >= 1);
  const step4Done = Boolean(
    windows.passweaver?.isOpen ||
      activeApp === "passweaver" ||
      crackedEmails.length >= 1,
  );
  const step5Done = Boolean(
    loggedIntoEmails.includes("m.cole@velox-ai.io") || scannedIps.length >= 1,
  );

  const steps = [
    {
      id: "step_whisper",
      title: "Review Initial Contract",
      desc: "Open WhisperChat to receive the Velox AI brief from CEO Elena Vance.",
      done: step1Done,
      appToOpen: "whisper" as const,
      actionLabel: "Launch WhisperChat",
    },
    {
      id: "step_intraweb",
      title: "Perform IntraWeb Recon",
      desc: 'Open IntraWeb and search for CTO "Marcus Cole" on Velox AI.',
      done: step2Done,
      appToOpen: "intraweb" as const,
      actionLabel: "Open IntraWeb",
    },
    {
      id: "step_clue",
      title: "Extract OSINT Intel",
      desc: "Click on Marcus Cole's work email or dog name on IntraWeb to pin it to Clue Board.",
      done: step3Done,
      appToOpen: "intraweb" as const,
      actionLabel: "Find Clue",
    },
    {
      id: "step_passweaver",
      title: "Synthesize Password Hashes",
      desc: "Open PassWeaver to weave candidate passwords from discovered clues.",
      done: step4Done,
      appToOpen: "passweaver" as const,
      actionLabel: "Launch PassWeaver",
    },
    {
      id: "step_webmail",
      title: "Compromise Target WebMail",
      desc: "Log into Marcus Cole's WebMail on IntraWeb to extract the dead-drop server IP.",
      done: step5Done,
      appToOpen: "intraweb" as const,
      actionLabel: "Access WebMail",
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const allCompleted = completedCount === steps.length;

  // Award bonus on 100% completion
  useEffect(() => {
    if (allCompleted && !rewardClaimed) {
      setRewardClaimed(true);
      addCrypto(50, "Orientation Protocol Stipend");
      sound.playSuccess();
      voice.speak("Orientation protocol cleared. Operator certified for freelance intrusion.", {
        priority: true,
      });
    }
  }, [allCompleted, rewardClaimed]);

  // Don't show orientation if player is already deep into Chapter 2+ unless manually toggled
  if (currentMissionIndex > 2 && allCompleted) {
    return null;
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`fixed top-12 right-4 z-40 font-mono select-none transition-all duration-200 animate-window-in ${
        minimized ? "w-64" : "w-80"
      }`}
    >
      <div className="bg-[#0b0e14]/95 backdrop-blur-md border border-[#2b3545] shadow-[0_12px_40px_rgba(0,0,0,0.85)] text-xs text-[#d4d7dc]">
        {/* Header Strip */}
        <div className="px-3 py-2 bg-[#121722] border-b border-[#1c232f] flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2 text-white font-bold tracking-wider">
            <Compass className="w-3.5 h-3.5 text-[#58a6ff] animate-spin-slow" />
            <span className="truncate">ORIENTATION PROTOCOL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                allCompleted
                  ? "bg-[#15231a] text-[#3fb950] border border-[#238636]"
                  : "bg-[#182334] text-[#79c0ff] border border-[#1f6feb]"
              }`}
            >
              {allCompleted ? "CERTIFIED" : `${completedCount}/${steps.length}`}
            </span>
            <button
              onClick={() => setMinimized(!minimized)}
              title={minimized ? "Expand Directives" : "Minimize HUD"}
              className="p-1 hover:text-white text-[#8b949e] cursor-pointer"
            >
              {minimized ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={onClose}
              title="Dismiss Orientation HUD"
              className="p-1 hover:text-[#ff5555] text-[#8b949e] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!minimized && (
          <div className="p-3 space-y-3">
            <div className="text-[10px] text-[#8b949e] leading-snug">
              Step-by-step tactical guidance for{" "}
              <span className="text-[#79c0ff] font-bold">
                Operation 01: Velox AI Infiltration
              </span>
              . Complete all steps to claim +50 ◈.
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              {steps.map((step, idx) => (
                <div
                  key={step.id}
                  className={`p-2 border transition-colors ${
                    step.done
                      ? "bg-[#09120c] border-[#1e3a24] text-[#8b949e]"
                      : idx === completedCount
                        ? "bg-[#101726] border-[#388bfd] text-white shadow-[0_0_12px_rgba(56,139,253,0.15)]"
                        : "bg-[#080b10] border-[#181f2b] text-[#6e7681]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      {step.done ? (
                        <CheckCircle2 className="w-4 h-4 text-[#3fb950] shrink-0 mt-0.5" />
                      ) : (
                        <Circle
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            idx === completedCount
                              ? "text-[#58a6ff] animate-pulse"
                              : "text-[#30363d]"
                          }`}
                        />
                      )}
                      <div>
                        <div
                          className={`font-bold text-[11px] leading-tight ${
                            step.done
                              ? "line-through text-[#6e7681]"
                              : idx === completedCount
                                ? "text-[#79c0ff]"
                                : "text-[#c9d1d9]"
                          }`}
                        >
                          {idx + 1}. {step.title}
                        </div>
                        <div className="text-[10px] text-[#8b949e] mt-0.5 leading-relaxed">
                          {step.desc}
                        </div>
                      </div>
                    </div>

                    {!step.done && idx === completedCount && (
                      <button
                        onClick={() => {
                          sound.playClick();
                          openApp(step.appToOpen);
                        }}
                        className="px-2 py-0.5 bg-[#1f6feb] hover:bg-[#388bfd] text-white font-bold text-[9px] uppercase tracking-wider shrink-0 cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <span>GO</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Completion Banner */}
            {allCompleted && (
              <div className="p-2.5 bg-[#122216] border border-[#238636] text-[#3fb950] space-y-1 animate-window-in">
                <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                  <Award className="w-4 h-4 text-[#3fb950]" />
                  <span>ORIENTATION COMPLETE // +50 ◈ CREDITED</span>
                </div>
                <div className="text-[10px] text-[#7ee787]">
                  You are ready for darknet operations. Follow incoming WhisperChat contracts and breach target mainframes!
                </div>
                <button
                  onClick={onClose}
                  className="w-full mt-1.5 py-1 bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-[10px] uppercase cursor-pointer"
                >
                  DISMISS ORIENTATION HUD
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
