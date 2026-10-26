import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Play,
  Server,
  ShieldAlert,
  Terminal as TerminalIcon,
  Zap,
} from 'lucide-react';
import { SERVER_NODES, SHOP_ITEMS } from '../data/worldData';
import { useGame } from '../context/GameContext';
import { WindowFrame } from '../components/WindowFrame';
import { sound } from '../utils/sound';

interface LogLine {
  id: string;
  type: 'cmd' | 'info' | 'success' | 'error' | 'warn';
  text: string;
}

export const SmartTerminalApp: React.FC = () => {
  const {
    discoveredClues,
    crackedEmails,
    ownedTools,
    scannedIps,
    crackedPorts,
    connectedIp,
    logsDirtyOnServer,
    traceActive,
    tracePercent,
    terminalSelectedIp,
    setTerminalSelectedIp,
    markIpScanned,
    markPortCracked,
    connectToServer,
    downloadServerFile,
    wipeServerLogs,
    openApp,
    terminalCommandToRun,
    setTerminalCommandToRun,
  } = useGame();

  const [input, setInput] = useState('');
  const [busyTask, setBusyTask] = useState<{ label: string; progress: number } | null>(
    null
  );
  const [logs, setLogs] = useState<LogLine[]>([
    {
      id: 'init_1',
      type: 'info',
      text: [
        'NEXUS TACTICAL SHELL // KERNEL 6.11.0-x86_64',
        'TYPE "help" FOR MANUAL COMMANDS OR CLICK TACTICAL MACRO KEYS BELOW.',
        '-------------------------------------------------------------------',
      ].join('\n'),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, busyTask]);

  const knownIps = Array.from(
    new Set([
      ...discoveredClues.filter((c) => c.category === 'ip').map((c) => c.value),
      ...(scannedIps.length > 0 ? scannedIps : []),
    ])
  );

  useEffect(() => {
    if (knownIps.length > 0 && !knownIps.includes(terminalSelectedIp)) {
      setTerminalSelectedIp(knownIps[knownIps.length - 1]);
    }
  }, [knownIps.length]);

  const appendLog = (type: LogLine['type'], text: string) => {
    setLogs((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, type, text }]);
  };

  const runWithProgress = (
    label: string,
    durationMs: number,
    onDone: () => void
  ) => {
    setBusyTask({ label, progress: 5 });
    let step = 0;
    const totalSteps = 8;
    const interval = setInterval(() => {
      step += 1;
      sound.playKey();
      const pct = Math.min(100, Math.round((step / totalSteps) * 100));
      setBusyTask({ label, progress: pct });
      if (step >= totalSteps) {
        clearInterval(interval);
        setBusyTask(null);
        onDone();
      }
    }, durationMs / totalSteps);
  };

  const executeCommand = (rawCmd: string) => {
    if (busyTask) return;
    const cmdLine = rawCmd.trim();
    if (!cmdLine) return;

    sound.playTerminalExec();
    const promptPrefix = connectedIp ? `root@${connectedIp}:~#` : `operator@nexus:~#`;
    appendLog('cmd', `${promptPrefix} ${cmdLine}`);

    const parts = cmdLine.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts[1];

    switch (cmd) {
      case 'help': {
        appendLog(
          'info',
          [
            'CORE INTRUSION COMMANDS:',
            '  scan <ip>          - SYN port scan & security fingerprint',
            '  crack <port>       - Execute binary exploit against port (22 / 443)',
            '  connect <ip>       - Mount remote root shell on compromised host',
            '  ls                 - List directory contents on remote filesystem',
            '  cat <filename>     - Dump plaintext file to stdout',
            '  download <file>    - Exfiltrate remote file to local DataVault',
            '  wipe_logs          - Zero out /var/connection.log & halt Active Trace',
            '  disconnect         - Terminate remote SSH tunnel',
            '  clear              - Flush stdout buffer',
          ].join('\n')
        );
        break;
      }

      case 'clear': {
        setLogs([]);
        break;
      }

      case 'scan': {
        const targetIp = arg || terminalSelectedIp;
        const node = SERVER_NODES[targetIp];
        if (!node) {
          sound.playError();
          appendLog('error', `ERR_HOST_UNREACHABLE: "${targetIp}" did not respond to SYN probe.`);
          break;
        }
        setTerminalSelectedIp(targetIp);
        runWithProgress(`SYN-SCANNING ${targetIp} PORTS...`, 1200, () => {
          markIpScanned(targetIp);
          sound.playSuccess();
          appendLog(
            'success',
            [
              `[+] NMAP_REPORT FOR ${node.ip} (${node.hostname})`,
              `    ORG_ENTITY   : ${node.organization}`,
              `    THREAT_LEVEL : ${node.securityLevel}`,
              `    PORT_STATE   : ${node.requiredPort}/tcp [LOCKED // REQUIRES ${
                SHOP_ITEMS.find((t) => t.id === node.requiredToolId)?.name || 'EXPLOIT'
              } (crack ${node.requiredPort})]`,
            ].join('\n')
          );
        });
        break;
      }

      case 'crack': {
        const targetIp = connectedIp || terminalSelectedIp;
        const node = SERVER_NODES[targetIp];
        if (!node) {
          sound.playError();
          appendLog('error', `ERR_NO_TARGET: Select or scan a target IP first.`);
          break;
        }
        const portNum = parseInt(arg || String(node.requiredPort), 10);
        if (portNum !== node.requiredPort) {
          sound.playError();
          appendLog(
            'error',
            `ERR_PORT_CLOSED: Port ${portNum} not listening on ${targetIp}. Target port is ${node.requiredPort}.`
          );
          break;
        }

        if (!ownedTools.includes(node.requiredToolId)) {
          sound.playError();
          const reqTool = SHOP_ITEMS.find((t) => t.id === node.requiredToolId);
          const reqName = reqTool ? `${reqTool.name} ${reqTool.version}` : node.requiredToolId;
          appendLog(
            'error',
            `ERR_MISSING_BINARY: Port ${portNum} requires "${reqName}". Acquire it in BLACKMARKET.`
          );
          break;
        }

        if (
          targetIp === '203.0.113.88' &&
          !discoveredClues.some((c) => c.id === 'clue_vault_override')
        ) {
          sound.playError();
          appendLog(
            'error',
            `ERR_2FA_TOKEN_MISSING: Aethelgard Vault 203.0.113.88 requires Director Julian Sterling's Vault Auth Token ("OMEGA-99-KEY"). Compromise his WebMail (j.sterling@aethelgard.corp) first.`
          );
          break;
        }

        if (
          targetIp === '194.165.16.100' &&
          !discoveredClues.some((c) => c.id === 'clue_datacenter_core_ip')
        ) {
          sound.playError();
          appendLog(
            'error',
            `ERR_FACILITY_ROUTING_LOCKED: 194.165.16.100 supercluster requires routing clearance from Chief Viktor Reyes. Crack his WebMail (v.reyes@aethelgard.corp) first.`
          );
          break;
        }

        if (
          targetIp === '217.182.80.50' &&
          !discoveredClues.some((c) => c.id === 'clue_scada_ip') &&
          !crackedEmails.includes('a.lindholm@nordgrid-power.com')
        ) {
          sound.playError();
          appendLog(
            'error',
            `ERR_SCADA_GATEWAY_LOCKED: NordGrid 217.182.80.50 requires SCADA authorization from Dr. Astrid Lindholm. Investigate her mail or Chirper (@dr_astrid_power) first.`
          );
          break;
        }

        if (
          targetIp === '102.16.88.12' &&
          !discoveredClues.some((c) => c.id === 'clue_subsea_fiber_ip') &&
          !crackedEmails.includes('k.thorne@oceaniclink-telecom.net')
        ) {
          sound.playError();
          appendLog(
            'error',
            `ERR_QKD_OPTICAL_LOCKED: Transatlantic Repeater 102.16.88.12 requires QKD session keys from Kai Thorne. Compromise his OceanicLink mail (k.thorne@oceaniclink-telecom.net) first.`
          );
          break;
        }

        if (
          targetIp === '185.190.20.1' &&
          !discoveredClues.some((c) => c.id === 'clue_ouroboros_root_paradox')
        ) {
          sound.playError();
          appendLog(
            'error',
            `ERR_SINGULARITY_SHIELD_ACTIVE: Svalbard Deep Core 185.190.20.1 requires the Gödel Paradox Override Token ("GODEL-ZERO-SELF-TERMINATE"). Check the research thread on 0xUnderground DarkNet Forum first.`
          );
          break;
        }

        runWithProgress(
          `INJECTING EXPLOIT PAYLOAD ON ${targetIp}:${portNum}...`,
          1800,
          () => {
            markPortCracked(targetIp, portNum);
            appendLog(
              'success',
              `[+] PAYLOAD_INJECTED // Port ${portNum} bypassed on ${targetIp}. Execute "connect ${targetIp}" to spawn root shell.`
            );
            if (node.triggersTrace) {
              appendLog(
                'warn',
                `[!!!] ALERT: AETHELGARD IC-GRID TRACE INITIATED! Download target file, run "wipe_logs", and "disconnect" before 100%!`
              );
            }
          }
        );
        break;
      }

      case 'connect': {
        const targetIp = arg || terminalSelectedIp;
        const node = SERVER_NODES[targetIp];
        if (!node) {
          sound.playError();
          appendLog('error', `ERR_INVALID_HOST: "${targetIp}"`);
          break;
        }
        const cracked = (crackedPorts[targetIp] || []).includes(node.requiredPort);
        if (!cracked) {
          sound.playError();
          appendLog(
            'error',
            `ERR_CONNECTION_REFUSED: Port ${node.requiredPort} on ${targetIp} is locked. Run "crack ${node.requiredPort}" first.`
          );
          break;
        }
        connectToServer(targetIp);
        sound.playSuccess();
        appendLog(
          'success',
          `[+] ROOT SHELL SPAWNED ON ${node.ip} (${node.hostname}). Execute "ls" to inspect filesystem.`
        );
        break;
      }

      case 'ls': {
        if (!connectedIp) {
          sound.playError();
          appendLog('error', `ERR_NOT_CONNECTED: Run "connect <ip>" first.`);
          break;
        }
        const node = SERVER_NODES[connectedIp];
        const fileList = node.files
          .map(
            (f) =>
              `  -r--------  root  ${f.size.padEnd(10)}  ${f.name}${
                f.isMissionEvidence ? '   <-- [PRIMARY_EVIDENCE]' : ''
              }`
          )
          .join('\n');
        appendLog('info', `INDEX OF /root@${connectedIp}:\n${fileList}`);
        break;
      }

      case 'cat': {
        if (!connectedIp) {
          sound.playError();
          appendLog('error', `ERR_NOT_CONNECTED.`);
          break;
        }
        const node = SERVER_NODES[connectedIp];
        const file = node.files.find((f) => f.name.toLowerCase() === (arg || '').toLowerCase());
        if (!file) {
          sound.playError();
          appendLog('error', `ERR_FILE_NOT_FOUND: "${arg || ''}"`);
          break;
        }
        appendLog('info', `===SOF: ${file.name}===\n${file.content}\n===EOF===`);
        break;
      }

      case 'download': {
        if (!connectedIp) {
          sound.playError();
          appendLog('error', `ERR_NOT_CONNECTED.`);
          break;
        }
        const node = SERVER_NODES[connectedIp];
        const file = node.files.find((f) => f.name.toLowerCase() === (arg || '').toLowerCase());
        if (!file) {
          sound.playError();
          appendLog('error', `ERR_FILE_NOT_FOUND: "${arg || ''}"`);
          break;
        }
        runWithProgress(`EXFILTRATING ${file.name} (${file.size})...`, 1200, () => {
          downloadServerFile(file);
          appendLog(
            'success',
            `[+] EXFIL_OK: "${file.name}" (${file.size}) written to local DataVault.`
          );
        });
        break;
      }

      case 'wipe_logs': {
        if (!connectedIp) {
          sound.playError();
          appendLog(
            'error',
            `ERR_NOT_CONNECTED: Must be inside remote host to purge /var/connection.log.`
          );
          break;
        }
        const target = connectedIp;
        runWithProgress(`SHREDDING /var/connection.log ON ${target}...`, 900, () => {
          wipeServerLogs(target);
          appendLog(
            'success',
            `[+] SHRED_COMPLETE: /var/connection.log overwritten (3 passes) on ${target}. Active Trace killed.`
          );
        });
        break;
      }

      case 'disconnect': {
        if (!connectedIp) {
          appendLog('info', `TTY already bound to local host.`);
          break;
        }
        const oldIp = connectedIp;
        connectToServer(null);
        sound.playClick();
        appendLog('info', `[-] TUNNEL_CLOSED: Disconnected from ${oldIp}.`);
        break;
      }

      default: {
        sound.playError();
        appendLog('error', `sh: command not found: "${cmd}". Type "help".`);
      }
    }
    setInput('');
  };

  useEffect(() => {
    if (terminalCommandToRun) {
      executeCommand(terminalCommandToRun);
      setTerminalCommandToRun(null);
    }
  }, [terminalCommandToRun]);

  const activeNode = SERVER_NODES[connectedIp || terminalSelectedIp];
  const isSelectedPortCracked =
    activeNode && (crackedPorts[activeNode.ip] || []).includes(activeNode.requiredPort);

  return (
    <WindowFrame
      id="terminal"
      icon={<TerminalIcon className="w-3.5 h-3.5" />}
      width="w-[710px]"
      height="h-[520px]"
    >
      {/* Active Trace Danger Strip */}
      {traceActive && (
        <div className="px-3.5 py-1.5 bg-[#290808] border-b border-[#ff3b3b] flex items-center justify-between">
          <span className="text-xs font-bold text-[#ff5555] flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-[#ff3b3b]" />
            IC_TRACE_ACTIVE: {tracePercent.toFixed(0)}% // RUN wipe_logs BEFORE 100%
          </span>
          <div className="w-48 h-2 bg-black border border-[#ff3b3b]">
            <div
              className="h-full bg-[#ff3b3b] transition-all duration-300"
              style={{ width: `${tracePercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Target Host Header */}
      <div className="px-3.5 py-1.5 bg-[#0c0e13] border-b border-[#1e232c] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Server className="w-3.5 h-3.5 text-[#58a6ff]" />
          <span className="text-[#8b949e]">RHOST:</span>
          {knownIps.length === 0 ? (
            <span className="text-[#79c0ff]">
              [NO RHOST IP IN BUFFER — INSPECT MARCUS WEBMAIL FIRST]
            </span>
          ) : (
            <div className="flex items-center gap-1">
              {knownIps.map((ip) => (
                <button
                  key={ip}
                  onClick={() => {
                    sound.playClick();
                    setTerminalSelectedIp(ip);
                  }}
                  className={`px-2 py-0.5 border text-[11px] cursor-pointer transition-colors ${
                    (connectedIp || terminalSelectedIp) === ip
                      ? 'bg-[#1f6feb] text-white border-[#58a6ff] font-bold'
                      : 'bg-[#060708] text-[#8b949e] border-[#21262d] hover:text-white'
                  }`}
                >
                  {ip}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className={connectedIp ? 'text-[#56d364] font-bold' : 'text-[#6e7681]'}>
          {connectedIp ? `SESSION: root@${connectedIp}` : 'SESSION: LOCAL_TTY'}
        </span>
      </div>

      {/* Raw Terminal Output */}
      <div className="flex-1 overflow-y-auto p-3.5 text-xs space-y-1.5 bg-[#040506] tactical-scanlines">
        {logs.map((line) => {
          const colorMap: Record<LogLine['type'], string> = {
            cmd: 'text-white font-bold',
            info: 'text-[#8b949e]',
            success: 'text-[#56d364]',
            warn: 'text-[#ff7b72] font-bold',
            error: 'text-[#ff5555]',
          };
          return (
            <pre
              key={line.id}
              className={`whitespace-pre-wrap leading-relaxed ${colorMap[line.type]}`}
            >
              {line.text}
            </pre>
          );
        })}

        {/* Live Progress Bar for Scan / Crack / Download */}
        {busyTask && (
          <div className="p-2.5 bg-[#0b1018] border border-[#58a6ff] space-y-1.5 my-2">
            <div className="flex justify-between text-[11px] text-[#79c0ff] font-bold">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#58a6ff] animate-ping" />
                <span>{busyTask.label}</span>
              </span>
              <span className="font-mono">{busyTask.progress}%</span>
            </div>
            <div className="font-mono text-[9px] text-[#8b949e] flex justify-between">
              <span>OFFSET 0x{(busyTask.progress * 420).toString(16).padStart(4, '0')}</span>
              <span className="text-[#56d364]">[PAYLOAD BUFFER INJECTED]</span>
            </div>
            <div className="w-full h-1.5 bg-black border border-[#282f3d]">
              <div
                className="h-full bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] transition-all duration-150"
                style={{ width: `${busyTask.progress}%` }}
              />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Tactical Macro Bar */}
      <div className="p-2.5 bg-[#0b0d11] border-t border-[#1e232c] space-y-2">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#6e7681]">
          <span className="flex items-center gap-1 text-[#79c0ff]">
            <Zap className="w-3 h-3 text-[#58a6ff]" />
            TACTICAL_MACROS (CLICK OR TYPE IN STDIN):
          </span>
          {activeNode && !ownedTools.includes(activeNode.requiredToolId) && (
            <button
              onClick={() => openApp('blackmarket')}
              className="text-[#79c0ff] font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <ShieldAlert className="w-3 h-3 text-[#58a6ff]" />
              MISSING EXPLOIT BINARY → OPEN BLACKMARKET
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {!connectedIp && activeNode && (
            <>
              <button
                disabled={!!busyTask}
                onClick={() => executeCommand(`scan ${terminalSelectedIp}`)}
                className="px-2.5 py-1 bg-[#151921] hover:border-[#58a6ff] border border-[#282f3d] text-[11px] text-white cursor-pointer flex items-center gap-1 disabled:opacity-40"
              >
                <Play className="w-3 h-3 text-[#58a6ff]" /> scan {terminalSelectedIp}
              </button>

              <button
                disabled={!!busyTask}
                onClick={() => executeCommand(`crack ${activeNode.requiredPort}`)}
                className="px-2.5 py-1 bg-[#151921] hover:border-[#58a6ff] border border-[#303947] text-[11px] text-[#79c0ff] font-bold cursor-pointer flex items-center gap-1 disabled:opacity-40"
              >
                <Play className="w-3 h-3 text-[#58a6ff]" /> crack {activeNode.requiredPort}
              </button>

              <button
                disabled={!!busyTask}
                onClick={() => executeCommand(`connect ${terminalSelectedIp}`)}
                className={`px-2.5 py-1 border text-[11px] cursor-pointer flex items-center gap-1 disabled:opacity-40 ${
                  isSelectedPortCracked
                    ? 'bg-[#238636] text-white border-[#3fb950] font-bold'
                    : 'bg-[#12161f] border-[#21262d] text-[#6e7681]'
                }`}
              >
                <Play className="w-3 h-3" /> connect {terminalSelectedIp}
              </button>
            </>
          )}

          {connectedIp && activeNode && (
            <>
              <button
                disabled={!!busyTask}
                onClick={() => executeCommand('ls')}
                className="px-2.5 py-1 bg-[#151921] hover:border-[#58a6ff] border border-[#282f3d] text-[11px] text-white cursor-pointer disabled:opacity-40"
              >
                $ ls
              </button>

              {activeNode.files.map((f) => (
                <button
                  key={f.name}
                  disabled={!!busyTask}
                  onClick={() => executeCommand(`download ${f.name}`)}
                  className={`px-2.5 py-1 border text-[11px] cursor-pointer disabled:opacity-40 ${
                    f.isMissionEvidence
                      ? 'bg-[#1f6feb] text-white border-[#58a6ff] font-bold'
                      : 'bg-[#151921] border-[#282f3d] text-[#d4d7dc] hover:border-white'
                  }`}
                >
                  $ download {f.name}
                </button>
              ))}

              <button
                disabled={!!busyTask}
                onClick={() => executeCommand('wipe_logs')}
                className={`px-2.5 py-1 border text-[11px] cursor-pointer disabled:opacity-40 ${
                  logsDirtyOnServer[connectedIp]
                    ? 'bg-[#ff3b3b] text-white border-[#ff5555] font-bold'
                    : 'bg-[#151921] border-[#282f3d] text-[#56d364]'
                }`}
              >
                $ wipe_logs
              </button>

              <button
                disabled={!!busyTask}
                onClick={() => executeCommand('disconnect')}
                className="px-2.5 py-1 bg-[#151921] hover:border-white border border-[#282f3d] text-[11px] text-[#8b949e] cursor-pointer disabled:opacity-40"
              >
                $ disconnect
              </button>
            </>
          )}
        </div>
      </div>

      {/* STDIN Prompt */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          executeCommand(input);
        }}
        className="px-3.5 py-2 bg-[#040506] border-t border-[#1e232c] flex items-center gap-2 text-xs"
      >
        <span className="text-[#56d364] font-bold shrink-0">
          {connectedIp ? `root@${connectedIp}:~#` : `operator@nexus:~#`}
        </span>
        <input
          type="text"
          value={input}
          disabled={!!busyTask}
          onChange={(e) => {
            sound.playKey();
            setInput(e.target.value);
          }}
          placeholder="stdin..."
          className="flex-1 bg-transparent text-white focus:outline-none"
        />
        <button
          type="submit"
          disabled={!!busyTask}
          className="px-3 py-0.5 bg-[#1f6feb] hover:bg-[#388bfd] text-white font-bold text-[11px] cursor-pointer disabled:opacity-40"
        >
          EXEC
        </button>
      </form>
    </WindowFrame>
  );
};
