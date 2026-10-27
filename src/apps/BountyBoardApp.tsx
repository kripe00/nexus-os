import React, { useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Coins,
  Crosshair,
  ExternalLink,
  Flame,
  Globe,
  Lock,
  Mail,
  ShieldAlert,
  Terminal as TerminalIcon,
  Zap,
} from "lucide-react";
import { useGame } from "../context/GameContext";
import { WindowFrame } from "../components/WindowFrame";
import { BOUNTY_CONTRACTS } from "../data/worldData";
import { BountyContract } from "../types/game";
import { sound } from "../utils/sound";

export const BountyBoardApp: React.FC = () => {
  const {
    crypto,
    completedBounties,
    claimBounty,
    crackedPorts,
    downloadedFiles,
    loggedIntoEmails,
    openApp,
    setTerminalSelectedIp,
    setPassWeaverTargetEmail,
    navigateBrowser,
  } = useGame();

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Check objective completion dynamically
  const isContractReadyToClaim = (contract: BountyContract): boolean => {
    switch (contract.id) {
      case "bounty_crypto_siphon":
        return downloadedFiles.some((f) => f.name === "wallet_seed_keys.dat");
      case "bounty_corrupt_commissioner":
        return loggedIntoEmails.includes("commissioner.vance@metro-police.gov");
      case "bounty_blacksite_medical":
        return downloadedFiles.some(
          (f) => f.name === "illegal_human_trials.pdf.dec",
        );
      case "bounty_ghost_yacht":
        return downloadedFiles.some(
          (f) => f.name === "arms_smuggling_manifest.log",
        );
      default:
        return false;
    }
  };

  const isContractObjectiveDone = (
    contractId: string,
    objIndex: number,
  ): boolean => {
    switch (contractId) {
      case "bounty_crypto_siphon":
        if (objIndex === 0)
          return (crackedPorts["172.16.55.101"] || []).includes(22);
        if (objIndex === 1)
          return downloadedFiles.some((f) => f.name === "wallet_seed_keys.dat");
        return false;
      case "bounty_corrupt_commissioner":
        if (objIndex === 0)
          return loggedIntoEmails.includes(
            "commissioner.vance@metro-police.gov",
          );
        if (objIndex === 1)
          return loggedIntoEmails.includes(
            "commissioner.vance@metro-police.gov",
          );
        return false;
      case "bounty_blacksite_medical":
        if (objIndex === 0)
          return (crackedPorts["193.42.110.15"] || []).includes(443);
        if (objIndex === 1)
          return downloadedFiles.some(
            (f) => f.name === "illegal_human_trials.pdf.dec",
          );
        return false;
      case "bounty_ghost_yacht":
        if (objIndex === 0)
          return (crackedPorts["151.101.44.88"] || []).includes(80);
        if (objIndex === 1)
          return downloadedFiles.some(
            (f) => f.name === "arms_smuggling_manifest.log",
          );
        return false;
      default:
        return false;
    }
  };

  const handleRouteTarget = (contract: BountyContract) => {
    sound.playClick();
    if (contract.targetDetails.targetIp) {
      setTerminalSelectedIp(contract.targetDetails.targetIp);
      openApp("terminal");
    } else if (contract.targetDetails.targetEmail) {
      setPassWeaverTargetEmail(contract.targetDetails.targetEmail);
      openApp("passweaver");
    }
  };

  const filteredContracts =
    selectedCategory === "ALL"
      ? BOUNTY_CONTRACTS
      : BOUNTY_CONTRACTS.filter((b) => b.category === selectedCategory);

  const totalClaimed = completedBounties.length;
  const totalAvailable = BOUNTY_CONTRACTS.length;

  return (
    <WindowFrame
      id="bountyboard"
      icon={<Briefcase className="w-3.5 h-3.5 text-[#e3b341]" />}
      width="w-[720px]"
      height="h-[540px]"
    >
      <div className="flex-1 flex flex-col bg-[#060708] text-xs font-mono overflow-hidden">
        {/* Top Header */}
        <div className="p-3.5 bg-[#0a0d14] border-b border-[#1b2230] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#1c1808] border border-[#d29922] text-[#e3b341]">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white uppercase text-sm tracking-wider flex items-center gap-2">
                DARKNET BOUNTY BOARD // FREELANCE CONTRACTS
              </div>
              <div className="text-[11px] text-[#8b949e]">
                Decentralized hit-list & black-ops contracts posted by verified
                anonymous clients.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-[#12161f] border border-[#232d3f] text-[#79c0ff] text-[11px] flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-[#e3b341]" />
              <span>WALLET:</span>
              <span className="font-bold text-white">{crypto} ◈</span>
            </div>
            <div className="px-3 py-1 bg-[#0e1f14] border border-[#238636] text-[#3fb950] text-[11px] font-bold">
              CLEARED: {totalClaimed} / {totalAvailable}
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 px-3.5 py-2 bg-[#080a0f] border-b border-[#181e2b] text-[11px]">
          <span className="text-[#8b949e] mr-2 text-[10px] uppercase font-bold tracking-wider">
            FILTER:
          </span>
          {["ALL", "FINANCIAL", "INTEL", "BLACK_OPS", "SABOTAGE"].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-2.5 py-1 uppercase text-[10px] font-bold cursor-pointer transition-colors border ${
                selectedCategory === cat
                  ? "bg-[#1f293b] text-[#79c0ff] border-[#388bfd]"
                  : "bg-transparent text-[#8b949e] border-transparent hover:text-white hover:bg-[#121620]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Contract List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {filteredContracts.map((contract) => {
            const claimed = completedBounties.includes(contract.id);
            const readyToClaim = !claimed && isContractReadyToClaim(contract);

            return (
              <div
                key={contract.id}
                className={`p-3.5 border transition-all ${
                  claimed
                    ? "bg-[#09110d] border-[#1b3a24] opacity-85"
                    : readyToClaim
                      ? "bg-[#0c1624] border-[#388bfd] shadow-[0_0_15px_rgba(56,139,253,0.15)]"
                      : "bg-[#0b0e14] border-[#1e2535] hover:border-[#2d384e]"
                }`}
              >
                <div className="flex items-start justify-between gap-3 border-b border-[#18202d] pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {contract.title}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 text-[9px] font-bold uppercase border ${
                          contract.difficulty === "ELITE"
                            ? "bg-[#2a0e0e] text-[#ff7b72] border-[#f85149]"
                            : contract.difficulty === "HARD"
                              ? "bg-[#2b1e09] text-[#e3b341] border-[#d29922]"
                              : "bg-[#0f2416] text-[#3fb950] border-[#238636]"
                        }`}
                      >
                        {contract.difficulty}
                      </span>
                      <span className="px-1.5 py-0.5 text-[9px] font-mono bg-[#161b22] text-[#8b949e] border border-[#30363d]">
                        {contract.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#79c0ff] mt-0.5">
                      Client:{" "}
                      <span className="font-mono text-white">
                        {contract.clientName}
                      </span>{" "}
                      <span className="opacity-60">
                        ({contract.clientHandle})
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-[#e3b341] flex items-center justify-end gap-1">
                      <Coins className="w-3.5 h-3.5" />
                      <span>+{contract.rewardCrypto} ◈</span>
                    </div>
                    <div className="text-[10px] text-[#8b949e]">
                      BOUNTY REWARD
                    </div>
                  </div>
                </div>

                {/* Briefing Text */}
                <p className="text-[11px] text-[#c9d1d9] leading-relaxed my-2.5">
                  {contract.briefing}
                </p>

                {/* Target Information & Objectives */}
                <div className="grid grid-cols-2 gap-3 bg-[#07090e] p-2.5 border border-[#161c28] my-2">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#8b949e] mb-1">
                      TARGET INTEL:
                    </div>
                    <div className="text-[11px] text-white">
                      {contract.targetDetails.organization}
                    </div>
                    {contract.targetDetails.targetIp && (
                      <div className="text-[11px] text-[#58a6ff] font-mono mt-0.5 flex items-center gap-1.5">
                        <TerminalIcon className="w-3 h-3" />
                        Host IP: {contract.targetDetails.targetIp}
                      </div>
                    )}
                    {contract.targetDetails.targetEmail && (
                      <div className="text-[11px] text-[#7ee787] font-mono mt-0.5 flex items-center gap-1.5">
                        <Mail className="w-3 h-3" />
                        Target: {contract.targetDetails.targetEmail}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#8b949e] mb-1">
                      CONTRACT OBJECTIVES:
                    </div>
                    <div className="space-y-1">
                      {contract.objectives.map((obj, i) => {
                        const done =
                          claimed || isContractObjectiveDone(contract.id, i);
                        return (
                          <div
                            key={obj.id}
                            className={`flex items-start gap-1.5 text-[11px] ${
                              done ? "text-[#3fb950]" : "text-[#8b949e]"
                            }`}
                          >
                            <span className="shrink-0 mt-0.5">
                              {done ? (
                                <CheckCircle2 className="w-3 h-3 text-[#3fb950]" />
                              ) : (
                                <Clock className="w-3 h-3 text-[#58a6ff]" />
                              )}
                            </span>
                            <span
                              className={done ? "line-through opacity-80" : ""}
                            >
                              {obj.description}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handleRouteTarget(contract)}
                    className="px-2.5 py-1 bg-[#121824] hover:bg-[#1a2334] text-[#79c0ff] border border-[#26354d] text-[10px] font-bold uppercase cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    {contract.targetDetails.targetIp ? (
                      <>
                        <TerminalIcon className="w-3 h-3" />
                        <span>Route Target to Terminal</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3 h-3" />
                        <span>Route Target to PassWeaver</span>
                      </>
                    )}
                  </button>

                  {claimed ? (
                    <div className="px-3 py-1 bg-[#0f2416] text-[#3fb950] border border-[#238636] font-bold text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>BOUNTY COLLECTED (+{contract.rewardCrypto} ◈)</span>
                    </div>
                  ) : readyToClaim ? (
                    <button
                      onClick={() => claimBounty(contract.id)}
                      className="px-3.5 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-xs uppercase cursor-pointer border border-[#3fb950] flex items-center gap-1.5 shadow-[0_0_12px_rgba(63,185,80,0.5)] animate-pulse"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>CLAIM BOUNTY (+{contract.rewardCrypto} ◈)</span>
                    </button>
                  ) : (
                    <div className="px-2.5 py-1 bg-[#13161c] text-[#8b949e] border border-[#242b38] text-[10px] flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>INCOMPLETE (PENDING OBJECTIVES)</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </WindowFrame>
  );
};
