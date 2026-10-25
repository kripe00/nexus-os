import React, { useEffect, useState } from 'react';
import {
  Activity,
  Binary,
  Check,
  Copy,
  Cpu,
  Filter,
  Fingerprint,
  Globe,
  KeyRound,
  Radio,
  Search,
  ShieldAlert,
  Terminal,
  Wifi,
} from 'lucide-react';
import { CapturedPacket, SnifferSubnet } from '../types/game';
import { SNIFFER_SUBNETS } from '../data/worldData';
import { useGame } from '../context/GameContext';
import { WindowFrame } from '../components/WindowFrame';
import { sound } from '../utils/sound';

export const PacketSnifferApp: React.FC = () => {
  const {
    discoveredClues,
    discoverClue,
    openApp,
    showContextMenu,
    executeTerminalCommand,
    addNotification,
  } = useGame();

  const [selectedSubnetId, setSelectedSubnetId] = useState<string>('velox_subnet');
  const [protocolFilter, setProtocolFilter] = useState<string>('ALL');
  const [selectedPacketId, setSelectedPacketId] = useState<string>('pkt_v_1');
  const [livePacketCount, setLivePacketCount] = useState<number>(142);
  const [isCapturing, setIsCapturing] = useState<boolean>(true);

  const activeSubnet =
    SNIFFER_SUBNETS.find((s) => s.id === selectedSubnetId) || SNIFFER_SUBNETS[0];

  // Filtered packets
  const filteredPackets = activeSubnet.packets.filter((p) => {
    if (protocolFilter === 'ALL') return true;
    return p.protocol === protocolFilter;
  });

  const activePacket =
    filteredPackets.find((p) => p.id === selectedPacketId) || filteredPackets[0] || null;

  // Simulate live packet rate counter
  useEffect(() => {
    if (!isCapturing) return;
    const interval = setInterval(() => {
      setLivePacketCount((prev) => prev + Math.floor(Math.random() * 4) + 1);
    }, 1800);
    return () => clearInterval(interval);
  }, [isCapturing]);

  const handleSelectSubnet = (subId: string) => {
    sound.playClick();
    setSelectedSubnetId(subId);
    const firstPkt = SNIFFER_SUBNETS.find((s) => s.id === subId)?.packets[0];
    if (firstPkt) setSelectedPacketId(firstPkt.id);
  };

  const handleSelectPacket = (pkt: CapturedPacket) => {
    sound.playPacketChirp();
    setSelectedPacketId(pkt.id);
  };

  const handleExtractClue = (clueId?: string) => {
    if (!clueId) return;
    sound.playClueFound();
    discoverClue(clueId);
  };

  const handlePacketContextMenu = (e: React.MouseEvent, pkt: CapturedPacket) => {
    showContextMenu(e, [
      {
        header: `// TARGET RECON: ${pkt.destIp}`,
        items: [
          {
            label: `Scan ${pkt.destIp} in Terminal`,
            icon: <Terminal className="w-3.5 h-3.5" />,
            shortcut: 'SCAN',
            onClick: () => executeTerminalCommand(`scan ${pkt.destIp}`),
          },
          {
            label: `Connect to ${pkt.destIp}`,
            icon: <Globe className="w-3.5 h-3.5" />,
            shortcut: 'SSH',
            onClick: () => executeTerminalCommand(`connect ${pkt.destIp}`),
          },
          {
            label: 'Copy Destination IP',
            icon: <Copy className="w-3.5 h-3.5" />,
            shortcut: 'IP',
            onClick: () => {
              navigator.clipboard.writeText(pkt.destIp);
              addNotification('IP Copied', `${pkt.destIp} copied to clipboard`, 'clue');
            },
          },
        ],
      },
      {
        header: '// PACKET PAYLOAD',
        items: [
          {
            label: 'Copy Payload Hex',
            icon: <Binary className="w-3.5 h-3.5" />,
            onClick: () => {
              navigator.clipboard.writeText(pkt.rawHex);
              addNotification('Hex Copied', `Hex payload of ${pkt.id} copied`, 'clue');
            },
          },
          ...(pkt.containsCredential && pkt.extractedClueId
            ? [
                {
                  label: 'Extract Credential to Clue Board',
                  icon: <KeyRound className="w-3.5 h-3.5" />,
                  onClick: () => handleExtractClue(pkt.extractedClueId),
                },
              ]
            : []),
        ],
      },
    ]);
  };

  return (
    <WindowFrame
      id="packetsniffer"
      icon={<Radio className="w-3.5 h-3.5 text-[#58a6ff]" />}
      width="w-[740px]"
      height="h-[530px]"
    >
      <div className="flex-1 flex flex-col overflow-hidden bg-[#060708] text-xs">
        {/* Top Control Bar: Subnet selector & capture status */}
        <div className="p-2.5 bg-[#0b0e14] border-b border-[#1e232c] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#58a6ff] animate-pulse" />
              <span className="font-bold text-white text-xs uppercase tracking-wider">
                PACKETSNIFFER // PROMISCUOUS WIRESTREAM INTERCEPTOR
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px]">
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#06080c] border border-[#238636] text-[#56d364]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-ping" />
                <span>INTERFACE: eth0 [PROMISC]</span>
              </div>
              <div className="px-2 py-0.5 bg-[#151921] border border-[#303947] text-[#79c0ff]">
                CAPTURED: {livePacketCount} PKTS
              </div>
            </div>
          </div>

          {/* Subnet Tab Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {SNIFFER_SUBNETS.map((sub) => {
              const active = selectedSubnetId === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSelectSubnet(sub.id)}
                  className={`px-2.5 py-1 text-[11px] font-mono border cursor-pointer whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-[#151921] text-white border-[#58a6ff] font-bold'
                      : 'bg-[#08090d] text-[#8b949e] border-[#21262d] hover:text-white'
                  }`}
                >
                  <span className={active ? 'text-[#58a6ff]' : 'text-[#6e7681]'}>
                    [{sub.subnetCidr}]
                  </span>{' '}
                  <span>{sub.name.replace(/ Subnet| LAN| Telemetry| Mesh/i, '')}</span>
                </button>
              );
            })}
          </div>

          {/* Protocol Filters */}
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1">
              <span className="text-[#6e7681] mr-1 uppercase flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              {['ALL', 'HTTP', 'SMTP', 'TELNET', 'DNS', 'RF_RAW'].map((proto) => (
                <button
                  key={proto}
                  onClick={() => {
                    sound.playClick();
                    setProtocolFilter(proto);
                  }}
                  className={`px-2 py-0.5 border cursor-pointer transition-colors ${
                    protocolFilter === proto
                      ? 'bg-[#1f6feb] text-white border-[#58a6ff] font-bold'
                      : 'bg-[#06070a] text-[#8b949e] border-[#1e232c] hover:text-white'
                  }`}
                >
                  {proto}
                </button>
              ))}
            </div>

            <span className="text-[#6e7681] font-mono truncate max-w-xs">
              {activeSubnet.description}
            </span>
          </div>
        </div>

        {/* Main Split Body: Packet List + Packet Inspector */}
        <div className="flex-1 grid grid-cols-12 divide-x divide-[#1e232c] overflow-hidden">
          {/* Packet Table (Left 5 cols) */}
          <div className="col-span-5 flex flex-col bg-[#07080c] overflow-hidden">
            <div className="px-3 py-1.5 bg-[#0b0e14] border-b border-[#181d26] text-[10px] font-mono text-[#6e7681] grid grid-cols-12 gap-1 uppercase">
              <span className="col-span-3">Time</span>
              <span className="col-span-3">Proto</span>
              <span className="col-span-6">Destination</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#151922]">
              {filteredPackets.map((pkt) => {
                const isSelected = activePacket?.id === pkt.id;
                const hasClue =
                  pkt.containsCredential &&
                  pkt.extractedClueId &&
                  discoveredClues.some((c) => c.id === pkt.extractedClueId);

                const protoColor =
                  pkt.protocol === 'HTTP'
                    ? 'text-[#58a6ff]'
                    : pkt.protocol === 'SMTP'
                    ? 'text-[#a371f7]'
                    : pkt.protocol === 'TELNET'
                    ? 'text-[#ff5555]'
                    : pkt.protocol === 'DNS'
                    ? 'text-[#3fb950]'
                    : 'text-[#d29922]';

                return (
                  <div
                    key={pkt.id}
                    onClick={() => handleSelectPacket(pkt)}
                    onContextMenu={(e) => handlePacketContextMenu(e, pkt)}
                    className={`p-2 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#141b26] border-l-2 border-[#58a6ff]'
                        : 'hover:bg-[#0c0e14]'
                    }`}
                  >
                    <div className="grid grid-cols-12 gap-1 font-mono text-[10px] items-center mb-0.5">
                      <span className="col-span-3 text-[#6e7681]">{pkt.timestamp}</span>
                      <span className={`col-span-3 font-bold ${protoColor}`}>
                        {pkt.protocol}
                      </span>
                      <span className="col-span-6 text-white truncate">{pkt.destIp}</span>
                    </div>

                    <div className="text-[11px] text-[#8b949e] truncate flex items-center justify-between">
                      <span className="truncate">{pkt.summary}</span>
                      {pkt.containsCredential && (
                        <span
                          className={`px-1 text-[9px] font-bold shrink-0 ml-1 ${
                            hasClue
                              ? 'bg-[#122117] text-[#3fb950] border border-[#238636]'
                              : 'bg-[#ff3b3b] text-white animate-pulse'
                          }`}
                        >
                          {hasClue ? 'LOGGED' : 'AUTH'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Packet Inspector (Right 7 cols) */}
          <div className="col-span-7 flex flex-col bg-[#050608] overflow-y-auto p-4 space-y-3.5">
            {activePacket ? (
              <>
                {/* Header Information */}
                <div className="p-3 bg-[#0a0d14] border border-[#1e232c] space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between border-b border-[#161c26] pb-1">
                    <span className="text-[#8b949e]">FRAME #{activePacket.id}</span>
                    <span className="text-[#58a6ff] font-bold">
                      {activePacket.protocol} INTERCEPT
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-[#6e7681]">SRC_IP: </span>
                      <span className="text-white">{activePacket.sourceIp}</span>
                    </div>
                    <div>
                      <span className="text-[#6e7681]">DST_IP: </span>
                      <span className="text-white">{activePacket.destIp}</span>
                    </div>
                  </div>
                </div>

                {/* Credential Action Banner */}
                {activePacket.containsCredential && activePacket.extractedClueId && (
                  <div className="p-3 bg-[#131d2a] border border-[#58a6ff] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-[#79c0ff] flex items-center gap-1.5">
                        <Fingerprint className="w-4 h-4 text-[#58a6ff]" />
                        <span>UNENCRYPTED CREDENTIAL / IP LEAK IDENTIFIED</span>
                      </div>
                    </div>

                    <div className="p-2 bg-[#06080d] border border-[#1f293a] font-mono text-xs text-white">
                      {activePacket.credentialSnippet}
                    </div>

                    {discoveredClues.some((c) => c.id === activePacket.extractedClueId) ? (
                      <div className="text-[11px] text-[#56d364] flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" />
                        <span>Intelligence pinned to OSINT Clue Board!</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleExtractClue(activePacket.extractedClueId)}
                        className="w-full py-1.5 bg-[#1f6feb] hover:bg-[#388bfd] text-white font-bold text-xs uppercase cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Fingerprint className="w-3.5 h-3.5" />
                        [ PIN EXTRACTED CLUE TO CLUE BOARD ]
                      </button>
                    )}
                  </div>
                )}

                {/* Cleartext Payload View */}
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-[#6e7681] flex items-center justify-between">
                    <span>REASSEMBLED TCP PAYLOAD (ASCII):</span>
                    <span className="font-mono text-[9px] text-[#8b949e]">STREAM 0</span>
                  </div>
                  <pre className="p-3 bg-[#080a0f] border border-[#1b212c] font-mono text-[11px] text-[#d4d7dc] leading-relaxed whitespace-pre-wrap break-all select-text">
                    {activePacket.payloadPreview}
                  </pre>
                </div>

                {/* Hex Dump View */}
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-[#6e7681]">
                    HEXADECIMAL DUMP:
                  </div>
                  <pre className="p-2.5 bg-[#040507] border border-[#161a22] font-mono text-[10px] text-[#58a6ff]/80 leading-snug whitespace-pre-wrap break-all">
                    {activePacket.rawHex}
                  </pre>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[#6e7681]">
                <Radio className="w-8 h-8 mb-2 opacity-50" />
                <p>No packets captured on this protocol filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </WindowFrame>
  );
};
