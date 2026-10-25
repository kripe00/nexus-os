import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Crosshair,
  Lock,
  RefreshCw,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ALL_CLUES } from '../data/worldData';
import { useGame } from '../context/GameContext';
import { WindowFrame } from '../components/WindowFrame';
import { sound } from '../utils/sound';

export const NetShieldApp: React.FC = () => {
  const {
    underAttack,
    firewallHealth,
    honeypotActive,
    activateHoneypot,
    repairFirewall,
    capturedAttackerIp,
    discoveredClues,
    discoverClue,
    openApp,
    setTerminalSelectedIp,
  } = useGame();

  const [repairing, setRepairing] = useState(false);
  const [deployingHoneypot, setDeployingHoneypot] = useState(false);

  const handleRepair = () => {
    if (repairing) return;
    setRepairing(true);
    sound.playKey();
    setTimeout(() => {
      repairFirewall();
      setRepairing(false);
      sound.playSuccess();
    }, 800);
  };

  const handleHoneypot = () => {
    if (deployingHoneypot || honeypotActive) return;
    setDeployingHoneypot(true);
    sound.playKey();
    setTimeout(() => {
      activateHoneypot();
      setDeployingHoneypot(false);
      sound.playHoneypotTrap();
      if (!discoveredClues.some((c) => c.id === 'clue_hunter_drone_ip')) {
        discoverClue('clue_hunter_drone_ip');
      }
    }, 1200);
  };

  const routeDroneToTerminal = () => {
    sound.playClick();
    if (capturedAttackerIp) {
      setTerminalSelectedIp(capturedAttackerIp);
      openApp('terminal');
    }
  };

  return (
    <WindowFrame
      id="netshield"
      icon={<Shield className="w-3.5 h-3.5" />}
      width="w-[660px]"
      height="h-[520px]"
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#060708] text-xs">
        {/* Top Header & Alert Banner */}
        <div
          className={`p-3.5 border flex items-center justify-between transition-colors ${
            underAttack
              ? 'bg-[#290808] border-[#ff3b3b] animate-pulse text-[#ff5555]'
              : 'bg-[#0c0e14] border-[#1e232c] text-[#79c0ff]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {underAttack ? (
              <ShieldAlert className="w-5 h-5 text-[#ff3b3b]" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-[#3fb950]" />
            )}
            <div>
              <div className="font-bold text-sm text-white uppercase">
                {underAttack
                  ? 'CRITICAL ALERT: INCOMING HOSTILE BRUTE-FORCE'
                  : 'NETSHIELD IDS // PERIMETER SECURE'}
              </div>
              <div className="text-[11px] opacity-80">
                {underAttack
                  ? 'Autonomous hunter-killer drone transmitting high-frequency TCP SYN floods'
                  : 'Zero unauthorized packets detected on local ports 22, 80, 443, 9000'}
              </div>
            </div>
          </div>

          <div
            className={`px-3 py-1 font-bold text-xs uppercase border ${
              underAttack
                ? 'bg-[#ff3b3b] text-white border-[#ff5555]'
                : 'bg-[#122117] text-[#3fb950] border-[#238636]'
            }`}
          >
            {underAttack ? 'UNDER ATTACK' : 'ARMED & MONITORING'}
          </div>
        </div>

        {/* Tactical Airspace & Intrusion Radar Grid */}
        <div className="p-3.5 bg-[#080b10] border border-[#1e232c] grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Circular Radar Sweep Screen */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-2.5 bg-[#05070a] border border-[#1b222c] relative overflow-hidden">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Range rings */}
              <div className="absolute inset-0 rounded-full border border-[#2a3648]/40" />
              <div className="absolute inset-4 rounded-full border border-[#2a3648]/40" />
              <div className="absolute inset-8 rounded-full border border-[#2a3648]/40" />
              <div className="absolute inset-12 rounded-full border border-[#2a3648]/40" />
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#2a3648]/30" />
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#2a3648]/30" />

              {/* Sweeping radar beam */}
              <div className="absolute inset-0 animate-radar-sweep pointer-events-none">
                <div
                  className="w-1/2 h-1/2 absolute top-0 left-1/2"
                  style={{
                    background:
                      'conic-gradient(from 0deg at 0% 100%, rgba(88, 166, 255, 0.45) 0deg, rgba(88, 166, 255, 0) 50deg)',
                  }}
                />
              </div>

              {/* Threat Contact Blip */}
              {underAttack && (
                <div className="absolute top-6 right-8 flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff3b3b] animate-blip-pulse" />
                  <span className="text-[8px] font-bold text-[#ff5555] font-mono mt-0.5">
                    HOSTILE #07
                  </span>
                </div>
              )}

              {/* Honeypot Trap Lock Indicator */}
              {honeypotActive && (
                <div className="absolute top-5 right-7 border border-[#58a6ff] w-8 h-8 flex items-center justify-center pointer-events-none">
                  <span className="text-[7px] text-[#79c0ff] font-bold uppercase">LOCKED</span>
                </div>
              )}

              {/* Center point */}
              <div className="w-1.5 h-1.5 bg-[#58a6ff] rounded-full z-10" />
            </div>
            <div className="mt-2 text-[10px] text-[#8b949e] font-mono flex items-center justify-between w-full px-1">
              <span>RANGE: 500KM</span>
              <span className={underAttack ? 'text-[#ff5555] font-bold' : 'text-[#3fb950]'}>
                {underAttack ? 'THREAT DETECTED' : 'CLEAR'}
              </span>
            </div>
          </div>

          {/* Right Radar Telemetry Stats */}
          <div className="md:col-span-7 space-y-2 text-[11px]">
            <div className="flex items-center justify-between border-b border-[#181d26] pb-1">
              <span className="text-[#8b949e]">SURVEILLANCE RADAR:</span>
              <span className="text-[#58a6ff] font-mono">PULSE-DOPPLER 9.4 GHz</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#181d26] pb-1">
              <span className="text-[#8b949e]">AIRBORNE THREAT:</span>
              <span
                className={`font-mono font-bold ${
                  underAttack ? 'text-[#ff5555]' : 'text-[#3fb950]'
                }`}
              >
                {underAttack ? 'AETHELGARD STRIKE DRONE' : 'NONE DETECTED'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-[#181d26] pb-1">
              <span className="text-[#8b949e]">PACKET REJECTION RATE:</span>
              <span className="text-white font-mono">99.4% (STATEFUL INSPECTION)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8b949e]">HONEYPOT STATUS:</span>
              <span
                className={`font-mono font-bold ${
                  honeypotActive ? 'text-[#3fb950]' : 'text-[#8b949e]'
                }`}
              >
                {honeypotActive ? 'ARMED // TRAP ACTIVE' : 'STANDBY'}
              </span>
            </div>
          </div>
        </div>

        {/* Firewall Integrity Gauge */}
        <div className="p-4 bg-[#0b0d12] border border-[#1e232c] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white uppercase flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#58a6ff]" />
              Local Firewall Integrity Buffer
            </span>
            <span
              className={`font-bold ${
                firewallHealth < 35
                  ? 'text-[#ff3b3b]'
                  : firewallHealth < 70
                  ? 'text-[#ffb000]'
                  : 'text-[#3fb950]'
              }`}
            >
              {firewallHealth.toFixed(0)}%
            </span>
          </div>

          <div className="w-full h-3 bg-[#060709] border border-[#21262d] overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                firewallHealth < 35
                  ? 'bg-[#ff3b3b]'
                  : firewallHealth < 70
                  ? 'bg-[#ffb000]'
                  : 'bg-[#3fb950]'
              }`}
              style={{ width: `${firewallHealth}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#8b949e]">
              If integrity reaches 0%, system will suffer emergency hardware lock.
            </span>
            <button
              onClick={handleRepair}
              disabled={repairing || firewallHealth >= 100}
              className="px-3 py-1 bg-[#1f6feb] hover:bg-[#388bfd] disabled:opacity-40 text-white font-bold text-[11px] cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${repairing ? 'animate-spin' : ''}`} />
              {repairing ? 'REINFORCING...' : 'REINFORCE FIREWALL (+35%)'}
            </button>
          </div>
        </div>

        {/* Dynamic Honeypot Trap Section */}
        <div className="p-4 bg-[#0b0d12] border border-[#1e232c] space-y-3">
          <div className="flex items-center justify-between border-b border-[#181d26] pb-2">
            <div>
              <div className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#79c0ff]" />
                Dynamic Honeypot Sensor Grid
              </div>
              <div className="text-[11px] text-[#8b949e]">
                Trap incoming unauthorized requests and capture the remote attacker's IP.
              </div>
            </div>

            <button
              onClick={handleHoneypot}
              disabled={honeypotActive || deployingHoneypot}
              className={`px-3 py-1.5 font-bold text-xs uppercase border cursor-pointer transition-colors ${
                honeypotActive
                  ? 'bg-[#122117] text-[#3fb950] border-[#238636]'
                  : 'bg-[#238636] hover:bg-[#2ea043] text-white border-[#3fb950]'
              }`}
            >
              {deployingHoneypot
                ? 'DEPLOYING SENSORS...'
                : honeypotActive
                ? 'HONEYPOT TRAP ACTIVE'
                : 'DEPLOY HONEYPOT TRAP'}
            </button>
          </div>

          {/* Captured Threat Intelligence */}
          {capturedAttackerIp ? (
            <div className="p-3.5 bg-[#141d2a] border border-[#58a6ff] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#79c0ff] uppercase flex items-center gap-1.5">
                  <Crosshair className="w-4 h-4 text-[#58a6ff]" />
                  Attacker IP Triangulated & Trapped:
                </span>
                <span className="px-2 py-0.5 bg-[#ff3b3b] text-white font-bold text-[10px]">
                  HOSTILE DRONE DETECTED
                </span>
              </div>

              <div className="flex items-center justify-between bg-[#0b1019] p-2.5 border border-[#283548]">
                <div>
                  <div className="text-base font-bold text-white font-mono">
                    {capturedAttackerIp}
                  </div>
                  <div className="text-[11px] text-[#8b949e]">
                    Host: hunter-drone-07.aethelgard-blackops.net (Vulnerable Port: 9000)
                  </div>
                </div>

                <button
                  onClick={routeDroneToTerminal}
                  className="px-3 py-1.5 bg-[#58a6ff] hover:bg-[#79c0ff] text-black font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Launch Counter-Attack</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-[11px] text-[#c9d1d9]">
                💡 Tip: Acquire the <span className="text-[#58a6ff] font-semibold">Drone Sig-Override Payload</span> in BlackMarket, run <span className="font-mono text-white">crack 9000</span> in Terminal, and download the drone telemetry to execute the recall override!
              </div>
            </div>
          ) : (
            <div className="p-4 border border-dashed border-[#21262d] text-center text-[#8b949e] space-y-1">
              <Server className="w-5 h-5 mx-auto text-[#6e7681] mb-1" />
              <div>No threat trapped yet.</div>
              <div className="text-[10px]">
                Deploy the honeypot to lure the incoming attack and isolate the drone's true IP.
              </div>
            </div>
          )}
        </div>

        {/* Live Packet Log Stream */}
        <div className="p-3 bg-[#060709] border border-[#1e232c] space-y-1 font-mono text-[11px]">
          <div className="text-[#6e7681] text-[10px] uppercase pb-1 border-b border-[#161a22]">
            LIVE PACKET INSPECTOR [TUN0]:
          </div>
          <div className="text-[#8b949e]">
            [00:34:11] ETH0: 10.88.4.19:443 &lt;-&gt; TOR_RELAY_3 (DUPLEX OK)
          </div>
          {underAttack && (
            <>
              <div className="text-[#ff5555]">
                [00:34:12] ALERT: RAW_SOCK FLOOD FROM 141.98.11.200 -&gt; LOCAL:9000 [SYN_ACK_FAIL]
              </div>
              <div className="text-[#ff5555]">
                [00:34:14] PACKET DROP: FIREWALL BLOCKING REPEATED PROBES (HEALTH AT {firewallHealth.toFixed(0)}%)
              </div>
            </>
          )}
          {honeypotActive && (
            <div className="text-[#56d364]">
              [00:34:15] HONEYPOT: ISOLATED REVERSE ROUTE TO 141.98.11.200 (PORT 9000 UNLOCKED)
            </div>
          )}
        </div>
      </div>
    </WindowFrame>
  );
};
