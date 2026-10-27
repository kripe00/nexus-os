import React from "react";
import {
  CheckCircle2,
  Coins,
  Cpu,
  Radio,
  ShieldAlert,
  ShoppingBag,
  Terminal,
  Wifi,
  Zap,
} from "lucide-react";
import { SHOP_ITEMS } from "../data/worldData";
import { useGame } from "../context/GameContext";
import { WindowFrame } from "../components/WindowFrame";

export const BlackMarketApp: React.FC = () => {
  const { crypto, ownedTools, buyTool, openApp } = useGame();

  const getItemIcon = (id: string, category: string) => {
    if (category === "STEALTH") return <Wifi className="w-4 h-4" />;
    if (id === "ssl_zero_day_v2") return <ShieldAlert className="w-4 h-4" />;
    if (id === "sat_uplink_hijack_v1" || id === "zero_paradox_injector")
      return <Radio className="w-4 h-4" />;
    if (id === "quantum_bypass_v3" || id === "optical_qkd_decryptor")
      return <Cpu className="w-4 h-4" />;
    if (id === "scada_plc_exploit")
      return <Zap className="w-4 h-4 text-[#e3b341]" />;
    return <Terminal className="w-4 h-4" />;
  };

  return (
    <WindowFrame
      id="blackmarket"
      icon={<ShoppingBag className="w-3.5 h-3.5" />}
      width="w-[640px]"
      height="h-[520px]"
    >
      {/* Header */}
      <div className="px-4 py-3 bg-[#0c0e13] border-b border-[#1e232c] flex items-center justify-between text-xs">
        <div>
          <div className="text-[10px] text-[#58a6ff] uppercase tracking-widest">
            // TOR_HIDDEN_SERVICE: 0x99A_EXPLOIT_DEPOT
          </div>
          <h2 className="text-sm font-bold text-white uppercase">
            ZERO-DAY BINARY REPOSITORY
          </h2>
        </div>

        <div className="px-3 py-1 bg-[#10151f] border border-[#303947] text-[#79c0ff] font-bold text-xs flex items-center gap-1.5">
          <Coins className="w-3.5 h-3.5 text-[#58a6ff]" />
          BALANCE: {crypto} ◈
        </div>
      </div>

      {/* Packages Table */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#060708] text-xs">
        {SHOP_ITEMS.map((item, idx) => {
          const owned = ownedTools.includes(item.id);
          const canAfford = crypto >= item.price;

          return (
            <div
              key={item.id}
              className={`p-3.5 border flex items-center justify-between gap-4 transition-colors ${
                owned
                  ? "bg-[#0b140e] border-[#238636]"
                  : "bg-[#0b0d11] border-[#1e232c] hover:border-[#3b4659]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 border shrink-0 mt-0.5 ${
                    owned
                      ? "bg-[#122117] border-[#238636] text-[#3fb950]"
                      : "bg-[#151921] border-[#303947] text-[#58a6ff]"
                  }`}
                >
                  {getItemIcon(item.id, item.category)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#6e7681]">[PKG_0{idx + 1}]</span>
                    <span className="text-xs font-bold text-white uppercase">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-[#79c0ff] font-bold">
                      {item.version}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-[#151921] border border-[#282f3d] text-[#8b949e]">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8b949e] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                {owned ? (
                  <button
                    onClick={() => openApp("terminal")}
                    className="px-3 py-1.5 bg-[#238636] text-white font-bold text-[11px] uppercase cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    MOUNTED
                  </button>
                ) : (
                  <button
                    onClick={() => buyTool(item.id)}
                    disabled={!canAfford}
                    className={`px-3.5 py-1.5 font-bold text-[11px] uppercase border cursor-pointer transition-colors ${
                      canAfford
                        ? "bg-[#1f6feb] hover:bg-[#388bfd] text-white border-[#58a6ff]"
                        : "bg-[#090b0e] text-[#454c59] border-[#1e232c] cursor-not-allowed"
                    }`}
                  >
                    ACQUIRE [{item.price} ◈]
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </WindowFrame>
  );
};
