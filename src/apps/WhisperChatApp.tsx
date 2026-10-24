import React, { useEffect, useRef } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Lock,
  MessageSquare,
  Radio,
  Send,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { MISSIONS } from '../data/worldData';
import { useGame } from '../context/GameContext';
import { WindowFrame } from '../components/WindowFrame';

export const WhisperChatApp: React.FC = () => {
  const {
    chatHistory,
    currentMissionIndex,
    missionStage,
    clientIsTyping,
    acceptCurrentMission,
    submitMissionReport,
    isObjectiveComplete,
    navigateBrowser,
    openApp,
    campaignFinished,
  } = useGame();

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const currentMission = MISSIONS[currentMissionIndex] || MISSIONS[MISSIONS.length - 1];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, clientIsTyping, missionStage]);

  const acceptOptions: Record<number, { label: string; reply: string }[]> = {
    0: [
      {
        label: 'Accept Contract: "I\'m on it. I\'ll look up Marcus Cole on IntraWeb."',
        reply: `I'm on it, Elena. I'll search for "Velox AI" and "Marcus Cole" on IntraWeb, harvest his personal details, and crack his WebMail.`,
      },
      {
        label: 'Ask about payment: "250 ◈ upon proof of leak? Deal."',
        reply: `250 ◈ upon proof of where he's sending the code? Deal. Starting OSINT recon on Marcus Cole now.`,
      },
    ],
    1: [
      {
        label: 'Accept Contract: "I\'ll buy SSH-Breaker and breach 198.51.100.42."',
        reply: `Received the 250 ◈. Heading to BlackMarket to grab SSH-Breaker v1.4 now—I'll pull the buyer manifest off 198.51.100.42.`,
      },
    ],
    2: [
      {
        label: 'Accept Contract: "Let\'s expose Aethelgard Corp and Project Mirror."',
        reply: `Understood, ZERO. I'll investigate Director Julian Sterling on IntraWeb, grab his Vault token, and breach 203.0.113.88 under trace.`,
      },
    ],
  };

  const reportOptions: Record<number, { label: string; report: string }> = {
    0: {
      label: 'Transmit Proof: Dead-Drop IP (198.51.100.42) & Escrow Agreement (+250 ◈)',
      report:
        currentMission.completionMessages[0]?.text ||
        'I cracked Marcus Cole\'s WebMail. He is selling your core engine via a dead-drop server at 198.51.100.42.',
    },
    1: {
      label: 'Transmit Buyer Manifest: Expose Aethelgard Corp Division 0451 (+500 ◈)',
      report:
        currentMission.completionMessages[0]?.text ||
        'Got the manifest off 198.51.100.42. The buyer is Aethelgard Corp (Division 0451), led by Director Julian Sterling.',
    },
    2: {
      label: 'Transmit Decrypted File: PROJECT_MIRROR_TARGETS.dec (+1500 ◈)',
      report:
        currentMission.completionMessages[0]?.text ||
        'Extracted PROJECT_MIRROR_TARGETS.dec and wiped all connection logs. My own handle is Target #002 on their watchlist!',
    },
  };

  return (
    <WindowFrame
      id="whisper"
      icon={<MessageSquare className="w-3.5 h-3.5" />}
      width="w-[640px]"
      height="h-[520px]"
    >
      {/* Header */}
      <div className="px-3.5 py-2.5 bg-[#0c0e13] border-b border-[#1e232c] flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1.5 bg-[#151921] border border-[#303947] text-[#e6edf3] font-bold text-xs">
            [{currentMission.clientAvatar}]
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white uppercase">{currentMission.clientName}</span>
              <span className="text-[11px] text-[#7c8594]">{currentMission.clientHandle}</span>
            </div>
            <div className="text-[10px] text-[#3fb950] flex items-center gap-1">
              <Lock className="w-3 h-3" />
              E2EE RELAY // PGP VERIFIED
            </div>
          </div>
        </div>

        <div className="px-2.5 py-1 bg-[#0b140e] border border-[#238636] text-[#56d364] text-[11px] font-bold flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5" />
          BOUNTY: {currentMission.reward} ◈
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-[#060708] text-xs">
        <div className="text-[10px] text-[#565e6c] border-b border-[#161a22] pb-2 mb-3">
          --- ENCRYPTED SESSION ESTABLISHED WITH {currentMission.clientHandle.toUpperCase()} ---
        </div>

        {chatHistory.map((msg) => {
          if (msg.sender === 'system') {
            return (
              <div
                key={msg.id}
                className="my-3 py-1.5 px-3 bg-[#10151f] border-l-2 border-[#58a6ff] text-[11px] text-[#79c0ff] font-bold"
              >
                {msg.text}
              </div>
            );
          }

          const isPlayer = msg.sender === 'player';

          return (
            <div
              key={msg.id}
              className={`p-3 border-l-2 ${
                isPlayer
                  ? 'bg-[#0b130e] border-[#3fb950]'
                  : 'bg-[#0b0d12] border-[#58a6ff]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span
                  className={`font-bold uppercase ${
                    isPlayer ? 'text-[#56d364]' : 'text-[#79c0ff]'
                  }`}
                >
                  {msg.senderName}
                </span>
                <span className="text-[#565e6c]">{msg.timestamp}</span>
              </div>
              <div className="text-[#d4d7dc] leading-relaxed">{msg.text}</div>
            </div>
          );
        })}

        {/* Live Typing Indicator */}
        {clientIsTyping && (
          <div className="p-2.5 bg-[#0b0d12] border-l-2 border-[#58a6ff] text-[11px] text-[#79c0ff] flex items-center gap-2">
            <span className="w-2 h-2 bg-[#58a6ff] animate-ping" />
            <span>{currentMission.clientName} is typing an encrypted message...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Interactive Response & Action Dock */}
      <div className="p-3 bg-[#0c0e13] border-t border-[#1e232c] text-xs">
        {campaignFinished ? (
          <div className="flex items-center justify-between">
            <span className="text-[#56d364] font-bold text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              CHAPTER 1 COMPLETE // ALL BOUNTIES CLAIMED
            </span>
            <button
              onClick={() => openApp('files')}
              className="px-3 py-1.5 bg-[#1f6feb] hover:bg-[#388bfd] text-white font-bold text-[11px] uppercase cursor-pointer"
            >
              Inspect Exfiltrated Files →
            </button>
          </div>
        ) : missionStage === 'briefing' ? (
          <div className="text-[11px] text-[#8b949e] flex items-center gap-2 py-1">
            <span className="w-2 h-2 bg-[#58a6ff] animate-pulse" />
            <span>Receiving incoming briefing from {currentMission.clientName}...</span>
          </div>
        ) : missionStage === 'accept_prompt' ? (
          <div className="space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-[#79c0ff] font-bold">
              Choose your response to start the operation:
            </div>
            <div className="flex flex-col gap-1.5">
              {(acceptOptions[currentMissionIndex] || acceptOptions[0]).map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => acceptCurrentMission(opt.reply)}
                  className="w-full p-2.5 bg-[#141a24] hover:bg-[#1f6feb] border border-[#303947] hover:border-[#58a6ff] text-left text-white font-semibold text-xs flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span>{opt.label}</span>
                  <Send className="w-3.5 h-3.5 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        ) : missionStage === 'report_ready' ? (
          <div className="space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-[#56d364] font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              All Evidence Collected! Transmit your findings to claim bounty:
            </div>
            <button
              onClick={() =>
                submitMissionReport(reportOptions[currentMissionIndex].report)
              }
              className="w-full p-2.5 bg-[#238636] hover:bg-[#2ea043] border border-[#3fb950] text-white font-bold text-xs flex items-center justify-between cursor-pointer transition-colors"
            >
              <span>{reportOptions[currentMissionIndex].label}</span>
              <Send className="w-4 h-4 shrink-0 ml-2" />
            </button>
          </div>
        ) : missionStage === 'reporting' ? (
          <div className="text-[11px] text-[#56d364] py-1">
            Transmitting cryptographic proof & verifying escrow payout...
          </div>
        ) : (
          /* Investigating State: Show helpful contextual next-step launcher */
          <div className="flex items-center justify-between gap-2">
            <div className="text-[11px] text-[#8b949e]">
              Operation in progress. Complete the checklist on the right to report back.
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {currentMissionIndex === 0 && !isObjectiveComplete('obj_m1_clues') && (
                <button
                  onClick={() => navigateBrowser('search', 'Marcus Cole')}
                  className="px-3 py-1.5 bg-[#1f6feb] hover:bg-[#388bfd] text-white font-bold text-[11px] cursor-pointer flex items-center gap-1"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Search "Marcus Cole" on IntraWeb
                </button>
              )}
              {currentMissionIndex === 0 &&
                isObjectiveComplete('obj_m1_clues') &&
                !isObjectiveComplete('obj_m1_passweaver') && (
                  <button
                    onClick={() => openApp('passweaver')}
                    className="px-3 py-1.5 bg-[#1f6feb] hover:bg-[#388bfd] text-white font-bold text-[11px] cursor-pointer flex items-center gap-1"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    Crack Password in PassWeaver
                  </button>
                )}
              {currentMissionIndex === 0 &&
                isObjectiveComplete('obj_m1_passweaver') &&
                !isObjectiveComplete('obj_m1_webmail') && (
                  <button
                    onClick={() => navigateBrowser('webmail', '', 'm.cole@velox-ai.io')}
                    className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-[11px] cursor-pointer flex items-center gap-1"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    Log into WebMail
                  </button>
                )}
              {currentMissionIndex >= 1 && (
                <button
                  onClick={() => openApp('terminal')}
                  className="px-3 py-1.5 bg-[#151921] border border-[#303947] hover:border-[#58a6ff] text-white font-bold text-[11px] cursor-pointer flex items-center gap-1"
                >
                  <Terminal className="w-3.5 h-3.5 text-[#3fb950]" />
                  Open Terminal
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </WindowFrame>
  );
};
