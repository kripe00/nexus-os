import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Compass,
  Cpu,
  Globe,
  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  Network,
  Radio,
  Server,
  Shield,
  ShieldAlert,
  Terminal,
  Zap,
} from 'lucide-react';
import { GEO_RELAY_NODES, SERVER_NODES } from '../data/worldData';
import { useGame } from '../context/GameContext';
import { WindowFrame } from '../components/WindowFrame';
import { GeoRelayNode } from '../types/game';
import { sound } from '../utils/sound';

// Mercator / Equirectangular projection math (1000 x 500 SVG grid)
const MAP_WIDTH = 1000;
const MAP_HEIGHT = 500;

function lngToX(lng: number): number {
  return ((lng + 180) / 360) * MAP_WIDTH;
}

function latToY(lat: number): number {
  return ((90 - lat) / 180) * MAP_HEIGHT;
}

// Low-poly simplified tactical landmass coordinates (major continent shapes)
const TACTICAL_LANDMASSES = [
  // North America
  'M 120,70 L 260,65 L 290,110 L 250,190 L 190,260 L 160,250 L 130,170 L 90,120 Z',
  // South America
  'M 260,270 L 330,290 L 350,350 L 290,460 L 250,420 L 240,320 Z',
  // Europe
  'M 470,80 L 580,75 L 590,140 L 530,180 L 460,170 L 450,110 Z',
  // Africa
  'M 470,185 L 590,185 L 610,290 L 560,410 L 490,400 L 460,270 Z',
  // Asia
  'M 590,75 L 850,75 L 870,170 L 800,260 L 710,270 L 630,220 L 590,140 Z',
  // Australia
  'M 770,330 L 880,320 L 890,390 L 830,430 L 760,400 Z',
  // Scandinavia / UK / Iceland
  'M 450,50 L 520,50 L 530,100 L 470,100 Z',
  'M 390,75 L 430,75 L 420,100 L 390,95 Z', // Iceland
  'M 440,110 L 470,110 L 460,150 L 440,140 Z', // UK
];

export const GeoRelayApp: React.FC = () => {
  const {
    activeProxyChain,
    toggleProxyNode,
    scannedIps,
    crackedPorts,
    connectedIp,
    traceActive,
    tracePercent,
    executeTerminalCommand,
    showContextMenu,
    addNotification,
  } = useGame();

  const [selectedNodeId, setSelectedNodeId] = useState<string>('node_oslo');

  const selectedNode =
    GEO_RELAY_NODES.find((n) => n.id === selectedNodeId) || GEO_RELAY_NODES[0];

  const homeNode = GEO_RELAY_NODES.find((n) => n.role === 'home') || GEO_RELAY_NODES[0];

  // Active target node (if connected or selected target)
  const targetNode =
    GEO_RELAY_NODES.find((n) => n.ip === connectedIp) ||
    (selectedNode.role === 'target' ? selectedNode : null);

  // Compile active circuit node list: [HOME] -> [HOP 1] -> [HOP 2] ... -> [TARGET (if active)]
  const activeCircuitNodes: GeoRelayNode[] = useMemo(() => {
    const list: GeoRelayNode[] = [homeNode];
    activeProxyChain.forEach((id) => {
      const node = GEO_RELAY_NODES.find((n) => n.id === id);
      if (node && !list.some((existing) => existing.id === node.id)) {
        list.push(node);
      }
    });
    if (targetNode && !list.some((existing) => existing.id === targetNode.id)) {
      list.push(targetNode);
    }
    return list;
  }, [homeNode, activeProxyChain, targetNode]);

  // Compute total circuit ping latency
  const totalCircuitLatency = useMemo(() => {
    return activeCircuitNodes.reduce((acc, n) => acc + n.pingMs, 0);
  }, [activeCircuitNodes]);

  // Handle right click on map node
  const handleNodeContextMenu = (e: React.MouseEvent, node: GeoRelayNode) => {
    const isHop = activeProxyChain.includes(node.id);
    const isTarget = node.role === 'target';

    showContextMenu(e, [
      {
        header: `// NODE: ${node.city.toUpperCase()} (${node.ip})`,
        items: [
          ...(node.role !== 'home'
            ? [
                {
                  label: isHop ? 'Remove from Proxy Circuit' : 'Add to Proxy Circuit',
                  icon: <Network className="w-3.5 h-3.5" />,
                  shortcut: 'CIRCUIT',
                  onClick: () => toggleProxyNode(node.id),
                },
              ]
            : []),
          {
            label: `Scan ${node.ip} in Terminal`,
            icon: <Terminal className="w-3.5 h-3.5" />,
            shortcut: 'SCAN',
            onClick: () => executeTerminalCommand(`scan ${node.ip}`),
          },
          ...(isTarget
            ? [
                {
                  label: `Connect to ${node.ip}`,
                  icon: <Server className="w-3.5 h-3.5" />,
                  shortcut: 'SSH',
                  onClick: () => executeTerminalCommand(`connect ${node.ip}`),
                },
              ]
            : []),
          {
            label: 'Copy IP Address',
            icon: <Globe className="w-3.5 h-3.5" />,
            shortcut: 'COPY',
            onClick: () => {
              navigator.clipboard.writeText(node.ip);
              addNotification('Node IP Copied', `${node.ip} copied to clipboard`, 'clue');
            },
          },
        ],
      },
    ]);
  };

  const handleAutoOptimize = () => {
    sound.playSuccess();
    // Pick the 3 lowest latency relays
    const bestRelays = GEO_RELAY_NODES.filter((n) => n.role === 'relay')
      .sort((a, b) => a.pingMs - b.pingMs)
      .slice(0, 3)
      .map((n) => n.id);
    bestRelays.forEach((id) => {
      if (!activeProxyChain.includes(id)) {
        toggleProxyNode(id);
      }
    });
    addNotification('Route Optimized', 'Low-latency multi-hop proxy chain compiled.', 'mission');
  };

  const handleFlushCircuit = () => {
    sound.playClick();
    activeProxyChain.forEach((id) => toggleProxyNode(id));
    addNotification('Circuit Flushed', 'All intermediate proxy hops cleared.', 'warning');
  };

  return (
    <WindowFrame
      id="georelay"
      icon={<Network className="w-3.5 h-3.5 text-[#58a6ff]" />}
      width="w-[780px]"
      height="h-[550px]"
    >
      <div className="flex-1 flex flex-col overflow-hidden bg-[#05070a] text-xs font-mono select-none">
        {/* Top Tactical Telemetry Strip */}
        <div className="p-2.5 bg-[#090c12] border-b border-[#1b2330] flex items-center justify-between gap-3 text-[11px] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center gap-1.5 text-white font-bold tracking-wider uppercase shrink-0">
              <Compass className="w-4 h-4 text-[#58a6ff] animate-spin" />
              <span>GEORELAY // TOPOLOGY</span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-[#79c0ff] truncate bg-[#06080e] px-2 py-0.5 border border-[#1b2536]">
              {activeCircuitNodes.map((n, idx) => (
                <React.Fragment key={n.id}>
                  <span
                    className={
                      n.id === 'node_oslo'
                        ? 'text-[#3fb950] font-bold'
                        : n.role === 'target'
                        ? 'text-[#ff7b72] font-bold'
                        : 'text-[#58a6ff]'
                    }
                  >
                    {n.city.toUpperCase()}
                  </span>
                  {idx < activeCircuitNodes.length - 1 && (
                    <ArrowRight className="w-2.5 h-2.5 text-[#6e7681]" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-[10px]">
            <div className="px-2 py-0.5 bg-[#06080e] border border-[#1b2536] text-[#8b949e]">
              HOPS:{' '}
              <span className="text-white font-bold">{activeProxyChain.length}/4</span>
            </div>
            <div className="px-2 py-0.5 bg-[#06080e] border border-[#238636] text-[#3fb950]">
              TRACE DAMPENER:{' '}
              <span className="font-bold">-{activeProxyChain.length * 20}%</span>
            </div>
            <div className="px-2 py-0.5 bg-[#06080e] border border-[#1b2536] text-[#79c0ff]">
              RTT: <span className="font-bold">{totalCircuitLatency}ms</span>
            </div>
          </div>
        </div>

        {/* Counter-Intrusion Alert Strip when trace is live */}
        {traceActive && (
          <div className="h-6 bg-[#ff3b3b]/20 border-b border-[#ff3b3b] text-[#ff7b72] text-[10px] font-bold uppercase tracking-wider flex items-center justify-between px-3 animate-pulse shrink-0">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-[#ff3b3b]" />
              <span>
                ACTIVE TRACE IN PROGRESS // COUNTER-PULSE BACK-PROPAGATING TOWARD LOCAL GATEWAY
              </span>
            </div>
            <span>
              SPEED DAMPENED BY {activeProxyChain.length * 20}% VIA {activeProxyChain.length} HOPS
            </span>
          </div>
        )}

        {/* Central Vector World Map Area */}
        <div className="flex-1 relative overflow-hidden bg-[#040609]">
          {/* Subtle Grid Coordinates */}
          <div className="absolute top-2 left-2 text-[9px] text-[#6e7681] opacity-60 pointer-events-none z-10">
            PROJECTION: EQUIRECTANGULAR WGS84 // GRID: 30° INTERVALS
          </div>

          <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
            <button
              onClick={handleAutoOptimize}
              title="Auto-select lowest latency relays"
              className="px-2 py-1 bg-[#10151f] hover:bg-[#1a2333] border border-[#283547] text-[#79c0ff] text-[10px] cursor-pointer"
            >
              [ AUTO-OPTIMIZE ]
            </button>
            <button
              onClick={handleFlushCircuit}
              title="Flush proxy hops"
              className="px-2 py-1 bg-[#10151f] hover:bg-[#201515] border border-[#283547] hover:border-[#ff3b3b] text-[#ff7b72] text-[10px] cursor-pointer"
            >
              [ FLUSH ]
            </button>
          </div>

          {/* SVG Map Canvas */}
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="w-full h-full object-cover select-none"
          >
            <defs>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#58a6ff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#58a6ff" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="homeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3fb950" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#3fb950" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="targetGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff3b3b" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ff3b3b" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Latitude / Longitude lines */}
            {[100, 200, 300, 400].map((y) => (
              <line
                key={`lat_${y}`}
                x1={0}
                y1={y}
                x2={MAP_WIDTH}
                y2={y}
                stroke="#151d29"
                strokeWidth={0.8}
                strokeDasharray="4 6"
              />
            ))}
            {[200, 400, 600, 800].map((x) => (
              <line
                key={`lng_${x}`}
                x1={x}
                y1={0}
                x2={x}
                y2={MAP_HEIGHT}
                stroke="#151d29"
                strokeWidth={0.8}
                strokeDasharray="4 6"
              />
            ))}

            {/* Equator & Prime Meridian */}
            <line
              x1={0}
              y1={250}
              x2={MAP_WIDTH}
              y2={250}
              stroke="#1e293b"
              strokeWidth={1}
            />
            <line
              x1={500}
              y1={0}
              x2={500}
              y2={MAP_HEIGHT}
              stroke="#1e293b"
              strokeWidth={1}
            />

            {/* Continent Vector Silhouettes */}
            {TACTICAL_LANDMASSES.map((d, idx) => (
              <path
                key={idx}
                d={d}
                fill="#0a0f17"
                stroke="#151f2e"
                strokeWidth={1.2}
                opacity={0.85}
              />
            ))}

            {/* Active Circuit Bezier Connection Lines */}
            {activeCircuitNodes.map((fromNode, idx) => {
              if (idx === activeCircuitNodes.length - 1) return null;
              const toNode = activeCircuitNodes[idx + 1];
              const x1 = lngToX(fromNode.lng);
              const y1 = latToY(fromNode.lat);
              const x2 = lngToX(toNode.lng);
              const y2 = latToY(toNode.lat);
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2 - 35; // Curve curvature upwards

              const isConnectedTarget =
                toNode.role === 'target' && connectedIp === toNode.ip;

              return (
                <g key={`link_${fromNode.id}_${toNode.id}`}>
                  {/* Background shadow curve */}
                  <path
                    d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                    fill="none"
                    stroke={traceActive ? '#ff3b3b' : isConnectedTarget ? '#ff5555' : '#58a6ff'}
                    strokeWidth={traceActive ? 2.5 : 1.5}
                    strokeDasharray="5 5"
                    opacity={traceActive ? 0.9 : 0.7}
                  />
                  {/* Moving data packets along wire */}
                  <circle r={3} fill={traceActive ? '#ff3b3b' : '#79c0ff'}>
                    <animateMotion
                      path={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                      dur={traceActive ? '1s' : '2.5s'}
                      repeatCount="indefinite"
                      keyPoints={traceActive ? '1;0' : '0;1'} // Reversed counter-trace when active!
                      keyTimes="0;1"
                    />
                  </circle>
                </g>
              );
            })}

            {/* Render Map Nodes */}
            {GEO_RELAY_NODES.map((node) => {
              const cx = lngToX(node.lng);
              const cy = latToY(node.lat);
              const isSelected = selectedNodeId === node.id;
              const isHop = activeProxyChain.includes(node.id);
              const isHome = node.role === 'home';
              const isTarget = node.role === 'target';
              const isConnected = connectedIp === node.ip;
              const isCracked = (crackedPorts[node.ip] || []).length > 0;
              const isScanned = scannedIps.includes(node.ip);

              let fillColor = '#58a6ff';
              let ringColor = '#1f6feb';
              let glowId = 'nodeGlow';

              if (isHome) {
                fillColor = '#3fb950';
                ringColor = '#238636';
                glowId = 'homeGlow';
              } else if (isConnected) {
                fillColor = '#ff3b3b';
                ringColor = '#ff5555';
                glowId = 'targetGlow';
              } else if (isTarget) {
                if (isCracked) {
                  fillColor = '#a371f7';
                  ringColor = '#8957e5';
                } else if (isScanned) {
                  fillColor = '#d29922';
                  ringColor = '#bb8009';
                } else {
                  fillColor = '#8b949e';
                  ringColor = '#484f58';
                }
              } else if (isHop) {
                fillColor = '#58a6ff';
                ringColor = '#388bfd';
              }

              return (
                <g
                  key={node.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedNodeId(node.id);
                  }}
                  onContextMenu={(e) => handleNodeContextMenu(e, node)}
                  className="cursor-pointer group"
                >
                  {/* Pulsing ring for active hops and home */}
                  {(isHome || isHop || isConnected) && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={14}
                      fill={`url(#${glowId})`}
                      className="animate-ping opacity-60 pointer-events-none"
                    />
                  )}

                  {/* Outer selection boundary ring */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 10 : 7}
                    fill="#040609"
                    stroke={isSelected ? '#ffffff' : ringColor}
                    strokeWidth={isSelected ? 2 : 1.2}
                    className="transition-all"
                  />

                  {/* Inner core node circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 5 : 3.5}
                    fill={fillColor}
                    className="transition-all"
                  />

                  {/* Node City Label text */}
                  <text
                    x={cx + 10}
                    y={cy + 3}
                    fill={isSelected ? '#ffffff' : isHome ? '#3fb950' : '#8b949e'}
                    fontSize={9}
                    fontWeight={isSelected || isHome ? 'bold' : 'normal'}
                    className="pointer-events-none select-none font-mono"
                  >
                    {node.city.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Bottom Node Inspector & Actions Drawer */}
        <div className="p-3 bg-[#080b11] border-t border-[#1b2330] grid grid-cols-12 gap-3 shrink-0">
          {/* Node Metadata (Left 7 cols) */}
          <div className="col-span-7 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#58a6ff]" />
                <span className="font-bold text-white text-xs">
                  {selectedNode.city.toUpperCase()}, {selectedNode.country.toUpperCase()}
                </span>
                <span
                  className={`px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                    selectedNode.role === 'home'
                      ? 'bg-[#122417] text-[#3fb950] border border-[#238636]'
                      : selectedNode.role === 'target'
                      ? 'bg-[#291414] text-[#ff7b72] border border-[#ff3b3b]'
                      : 'bg-[#101b2a] text-[#79c0ff] border border-[#1f6feb]'
                  }`}
                >
                  {selectedNode.role === 'home'
                    ? 'HOME GATEWAY'
                    : selectedNode.role === 'target'
                    ? 'TARGET HOST'
                    : 'DARKNET RELAY'}
                </span>
              </div>
              <span className="text-[10px] text-[#6e7681]">
                LAT: {selectedNode.lat.toFixed(2)}° | LNG: {selectedNode.lng.toFixed(2)}°
              </span>
            </div>

            <div className="text-[11px] text-[#8b949e] truncate">
              ORG: <span className="text-[#c9d1d9]">{selectedNode.organization}</span>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-[#6e7681] pt-0.5">
              <span>
                IP: <span className="text-white font-mono">{selectedNode.ip}</span>
              </span>
              <span>
                PING: <span className="text-[#3fb950] font-mono">{selectedNode.pingMs}ms</span>
              </span>
              <span>
                STATUS:{' '}
                <span
                  className={
                    connectedIp === selectedNode.ip
                      ? 'text-[#ff5555] font-bold'
                      : (crackedPorts[selectedNode.ip] || []).length > 0
                      ? 'text-[#a371f7] font-bold'
                      : 'text-[#3fb950]'
                  }
                >
                  {connectedIp === selectedNode.ip
                    ? 'ROOT SESSION ACTIVE'
                    : (crackedPorts[selectedNode.ip] || []).length > 0
                    ? 'COMPROMISED (ROOT READY)'
                    : 'ONLINE'}
                </span>
              </span>
            </div>
          </div>

          {/* Tactical Action Buttons (Right 5 cols) */}
          <div className="col-span-5 flex flex-col justify-center gap-1.5">
            {selectedNode.role !== 'home' && (
              <button
                onClick={() => toggleProxyNode(selectedNode.id)}
                className={`py-1.5 px-2.5 border text-[11px] font-bold uppercase cursor-pointer flex items-center justify-between transition-colors ${
                  activeProxyChain.includes(selectedNode.id)
                    ? 'bg-[#1f293b] text-[#58a6ff] border-[#58a6ff]'
                    : 'bg-[#0f141f] text-white border-[#273347] hover:border-[#58a6ff]'
                }`}
              >
                <span>
                  {activeProxyChain.includes(selectedNode.id)
                    ? '[-] REMOVE FROM CIRCUIT'
                    : '[+] ROUTE THROUGH HOP'}
                </span>
                <Network className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => executeTerminalCommand(`scan ${selectedNode.ip}`)}
                className="py-1 px-2 bg-[#0c1017] hover:bg-[#161d2b] border border-[#232c3d] text-[#79c0ff] text-[10px] cursor-pointer flex items-center justify-center gap-1"
              >
                <Terminal className="w-3 h-3" />
                <span>SCAN NODE</span>
              </button>

              {selectedNode.role === 'target' ? (
                <button
                  onClick={() => executeTerminalCommand(`connect ${selectedNode.ip}`)}
                  className="py-1 px-2 bg-[#0c1017] hover:bg-[#161d2b] border border-[#232c3d] text-[#ff7b72] text-[10px] cursor-pointer flex items-center justify-center gap-1"
                >
                  <Server className="w-3 h-3" />
                  <span>SSH SHELL</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedNode.ip);
                    addNotification('Node IP Copied', `${selectedNode.ip} copied to clipboard`, 'clue');
                  }}
                  className="py-1 px-2 bg-[#0c1017] hover:bg-[#161d2b] border border-[#232c3d] text-[#8b949e] hover:text-white text-[10px] cursor-pointer flex items-center justify-center gap-1"
                >
                  <Globe className="w-3 h-3" />
                  <span>COPY IP</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
};
