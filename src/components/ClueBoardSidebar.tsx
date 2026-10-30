import React, { useState } from "react";
import {
  ArrowUpRight,
  CheckSquare,
  Copy,
  Crosshair,
  Fingerprint,
  Globe,
  KeyRound,
  PanelRightClose,
  PanelRightOpen,
  ScanSearch,
  Send,
  Server,
  Square,
  Terminal,
} from "lucide-react";
import { MISSIONS } from "../data/worldData";
import { useGame } from "../context/GameContext";
import { Clue } from "../types/game";
import { sound } from "../utils/sound";

export const ClueBoardSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    currentMissionIndex,
    missionStage,
    discoveredClues,
    crackedEmails,
    isObjectiveComplete,
    navigateBrowser,
    sendClueToApp,
    openApp,
    campaignFinished,
    showContextMenu,
    executeTerminalCommand,
    addNotification,
    osintHighlight,
    toggleOsintHighlight,
    difficulty,
  } = useGame();

  const handleClueContextMenu = (e: React.MouseEvent, clue: Clue) => {
    if (clue.category === "ip") {
      showContextMenu(e, [
        {
          header: `// TARGET HOST: ${clue.value}`,
          items: [
            {
              label: `Run "scan ${clue.value}" in Terminal`,
              icon: <Terminal className="w-3.5 h-3.5" />,
              shortcut: "SCAN",
              onClick: () => executeTerminalCommand(`scan ${clue.value}`),
            },
            {
              label: `Mount Root Shell (connect ${clue.value})`,
              icon: <Server className="w-3.5 h-3.5" />,
              shortcut: "SSH",
              onClick: () => executeTerminalCommand(`connect ${clue.value}`),
            },
            {
              label: "Copy Host IP",
              icon: <Copy className="w-3.5 h-3.5" />,
              shortcut: "IP",
              onClick: () => {
                navigator.clipboard.writeText(clue.value);
                addNotification(
                  "Target Copied",
                  `${clue.value} copied to clipboard`,
                  "clue",
                );
              },
            },
          ],
        },
      ]);
    } else {
      showContextMenu(e, [
        {
          header: `// INTEL: ${clue.label.toUpperCase()}`,
          items: [
            {
              label: "Load into PassWeaver",
              icon: <KeyRound className="w-3.5 h-3.5" />,
              onClick: () => sendClueToApp(clue),
            },
            {
              label: "Copy Value to Clipboard",
              icon: <Copy className="w-3.5 h-3.5" />,
              onClick: () => {
                navigator.clipboard.writeText(clue.value);
                addNotification(
                  "Clue Copied",
                  `${clue.value} copied to clipboard`,
                  "clue",
                );
              },
            },
          ],
        },
      ]);
    }
  };

  const currentMission =
    MISSIONS[currentMissionIndex] || MISSIONS[MISSIONS.length - 1];

  if (collapsed) {
    return (
      <aside className="w-10 h-[calc(100vh-2.75rem)] border-l border-[#1e232c] bg-[#090b0f]/95 flex flex-col items-center py-3 z-30 select-none text-xs transition-all">
        <button
          onClick={() => {
            sound.playClick();
            setCollapsed(false);
          }}
          title="Expand Objectives & Intel Sidebar"
          className="p-1.5 text-[#79c0ff] hover:text-white bg-[#10151f] hover:bg-[#161c28] border border-[#2b3545] cursor-pointer mb-6"
        >
          <PanelRightOpen className="w-4 h-4 text-[#58a6ff]" />
        </button>
        <div
          onClick={() => {
            sound.playClick();
            setCollapsed(false);
          }}
          className="flex-1 flex flex-col items-center justify-center cursor-pointer hover:text-white text-[#8b949e]"
        >
          <div className="[writing-mode:vertical-rl] rotate-180 whitespace-nowrap text-[10px] font-mono font-bold tracking-widest text-[#58a6ff] flex items-center gap-2">
            <span>OPERATIONAL INTEL</span>
            <Crosshair className="w-3.5 h-3.5" />
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-[320px] max-w-[85vw] h-[calc(100vh-2.75rem)] border-l border-[#1e232c] bg-[#090b0f]/95 flex flex-col z-30 select-none text-xs transition-all">
      {/* Active Operation */}
      <div className="p-4 border-b border-[#1e232c]">
        <div className="flex items-center justify-between text-[11px] text-[#7c8594] mb-1.5">
          <span className="flex items-center gap-1.5 text-[#58a6ff] font-semibold">
            <Crosshair className="w-3.5 h-3.5" />
            {campaignFinished && currentMissionIndex >= MISSIONS.length - 1
              ? "CAMPAIGN COMPLETE"
              : `OPERATION 0${currentMissionIndex + 1}`}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[#3fb950] font-bold">
              +{currentMission.reward} ◈
            </span>
            <button
              onClick={() => {
                sound.playClick();
                setCollapsed(true);
              }}
              title="Collapse Sidebar"
              className="p-1 text-[#8b949e] hover:text-white cursor-pointer hover:bg-[#1a202c]"
            >
              <PanelRightClose className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="text-sm font-bold text-white mb-2">
          {currentMission.title.replace(/^Operation \d+:\s*/, "")}
        </div>

        {missionStage === "briefing" || missionStage === "accept_prompt" ? (
          <div
            onClick={() => openApp("whisper")}
            className="p-3 bg-[#10151f] border border-[#58a6ff] text-[#79c0ff] cursor-pointer space-y-1"
          >
            <div className="font-bold text-white flex items-center justify-between">
              <span>Incoming Contract in WhisperChat</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#58a6ff]" />
            </div>
            <p className="text-[11px] text-[#8b949e]">
              Read {currentMission.clientName}'s messages and reply in
              WhisperChat to unlock objectives.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {currentMission.objectives.map((obj) => {
              const done = isObjectiveComplete(obj.id);
              return (
                <div
                  key={obj.id}
                  className={`p-2 border text-[11px] leading-snug flex items-start gap-2 ${
                    done
                      ? "bg-[#0b140e] border-[#1f3d28] text-[#56d364] line-through"
                      : "bg-[#0d1016] border-[#21262d] text-[#c9d1d9]"
                  }`}
                >
                  {done ? (
                    <CheckSquare className="w-3.5 h-3.5 text-[#3fb950] shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-[#58a6ff] shrink-0 mt-0.5" />
                  )}
                  <span>{obj.description}</span>
                </div>
              );
            })}

            {missionStage === "report_ready" && (
              <button
                onClick={() => openApp("whisper")}
                className="w-full mt-2 p-2.5 bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-xs flex items-center justify-between cursor-pointer transition-colors"
              >
                <span>Report Findings in WhisperChat</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Cracked Passwords */}
      {crackedEmails.length > 0 && (
        <div className="p-3.5 border-b border-[#1e232c] bg-[#0a120e]">
          <div className="flex items-center gap-1.5 text-[11px] text-[#3fb950] font-semibold mb-2">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Cracked Accounts ({crackedEmails.length})</span>
          </div>
          <div className="space-y-1.5">
            {crackedEmails.map((email) => (
              <div
                key={email}
                onClick={() => navigateBrowser("webmail", "", email)}
                className="p-2 bg-[#060708] border border-[#238636] hover:border-[#3fb950] cursor-pointer flex items-center justify-between transition-colors"
              >
                <span className="text-[#56d364] font-bold text-[11px] truncate">
                  {email}
                </span>
                <span className="text-[10px] bg-[#238636] text-white px-2 py-0.5 font-bold shrink-0">
                  Log in →
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OSINT Clues with Direct Contextual App Routing */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] uppercase tracking-wider text-[#8b949e] font-bold flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-[#58a6ff]" />
            Clue Board ({discoveredClues.length})
          </span>
          <button
            disabled={difficulty === "ghost"}
            onClick={() => {
              if (difficulty === "ghost") return;
              sound.playClick();
              toggleOsintHighlight();
            }}
            title={
              difficulty === "ghost"
                ? "OSINT Scanner disabled on Zero-Ghost (Hardcore) difficulty"
                : "Toggle OSINT visual highlights for clues in IntraWeb"
            }
            className={`px-2 py-0.5 text-[10px] border flex items-center gap-1 transition-colors ${
              difficulty === "ghost"
                ? "bg-[#0d1117] text-[#484f58] border-[#161b22] cursor-default opacity-60"
                : osintHighlight
                  ? "bg-[#1f6feb]/20 text-[#58a6ff] border-[#388bfd] font-bold cursor-pointer"
                  : "bg-[#0d1117] text-[#6e7681] border-[#21262d] hover:text-[#8b949e] cursor-pointer"
            }`}
          >
            <ScanSearch className="w-3 h-3" />
            <span>
              Scanner:{" "}
              {difficulty === "ghost" ? "OFF" : osintHighlight ? "ON" : "OFF"}
            </span>
          </button>
        </div>

        {discoveredClues.length === 0 ? (
          <div className="flex-1 border border-dashed border-[#21262d] bg-[#060708]/60 p-4 flex flex-col items-center justify-center text-center">
            <Globe className="w-6 h-6 text-[#58a6ff] mb-2 opacity-75" />
            <p className="text-[11px] text-[#8b949e] leading-relaxed mb-3">
              Search for targets on{" "}
              <span className="text-white font-semibold">IntraWeb</span> and
              inspect records carefully to pin intel here (or activate Scanner).
            </p>
            <button
              onClick={() => navigateBrowser("search", "Marcus Cole")}
              className="px-3 py-1.5 bg-[#151921] border border-[#303947] text-[#e6edf3] hover:border-[#58a6ff] text-[11px] font-semibold cursor-pointer"
            >
              Search on IntraWeb
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {discoveredClues.map((clue) => {
              const isIp = clue.category === "ip";
              const isEmail = clue.id.includes("email");
              const actionLabel = isIp
                ? "Load IP in Terminal →"
                : isEmail
                  ? "Set Target in PassWeaver →"
                  : "Add to PassWeaver →";

              return (
                <div
                  key={clue.id}
                  onClick={() => sendClueToApp(clue)}
                  onContextMenu={(e) => handleClueContextMenu(e, clue)}
                  className="group p-2.5 bg-[#0d1016] border border-[#21262d] hover:border-[#58a6ff] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-[10px] text-[#6e7681] mb-0.5">
                    <span className="text-[#79c0ff] font-semibold uppercase">
                      {clue.label}
                    </span>
                    <span>{clue.targetPerson}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {clue.value}
                    </span>
                    <span className="text-[10px] text-[#58a6ff] group-hover:underline flex items-center gap-1">
                      {isIp ? (
                        <Server className="w-3 h-3" />
                      ) : (
                        <KeyRound className="w-3 h-3" />
                      )}
                      {actionLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
