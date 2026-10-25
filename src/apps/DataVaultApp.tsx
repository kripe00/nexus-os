import React, { useState } from 'react';
import { Binary, Copy, FileCode, FolderLock, HardDrive, ShieldCheck, Terminal, Trash2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { WindowFrame } from '../components/WindowFrame';
import { ServerFile } from '../types/game';
import { sound } from '../utils/sound';

export const DataVaultApp: React.FC = () => {
  const {
    downloadedFiles,
    openApp,
    showContextMenu,
    deleteDownloadedFile,
    setInspectedFile,
    executeTerminalCommand,
    addNotification,
  } = useGame();
  const [selectedFile, setSelectedFile] = useState<string | null>(
    downloadedFiles[0]?.name || null
  );

  const active =
    downloadedFiles.find((f) => f.name === selectedFile) || downloadedFiles[0] || null;

  const handleFileContextMenu = (e: React.MouseEvent, file: ServerFile) => {
    showContextMenu(e, [
      {
        header: `// FILE: ${file.name.toUpperCase()}`,
        items: [
          {
            label: 'Inspect Raw Hex & Metadata',
            icon: <Binary className="w-3.5 h-3.5" />,
            shortcut: 'HEX',
            onClick: () => setInspectedFile(file),
          },
          {
            label: 'Copy Payload to Clipboard',
            icon: <Copy className="w-3.5 h-3.5" />,
            shortcut: 'COPY',
            onClick: () => {
              navigator.clipboard.writeText(file.content);
              addNotification('Payload Copied', `${file.name} content copied to clipboard`, 'clue');
            },
          },
          {
            label: `Dump in Terminal (cat)`,
            icon: <Terminal className="w-3.5 h-3.5" />,
            shortcut: 'EXEC',
            onClick: () => executeTerminalCommand(`cat ${file.name}`),
          },
        ],
      },
      {
        items: [
          {
            label: 'Shred & Zero-Fill File',
            icon: <Trash2 className="w-3.5 h-3.5" />,
            danger: true,
            shortcut: 'SHRED',
            onClick: () => {
              deleteDownloadedFile(file.name);
            },
          },
        ],
      },
    ]);
  };

  return (
    <WindowFrame
      id="files"
      icon={<FolderLock className="w-3.5 h-3.5" />}
      width="w-[620px]"
      height="h-[440px]"
    >
      <div className="flex-1 flex overflow-hidden bg-[#060708] text-xs">
        {downloadedFiles.length === 0 ? (
          <div className="flex-1 p-8 flex flex-col items-start justify-center border border-dashed border-[#21262d] m-4">
            <div className="text-[11px] text-[#58a6ff] font-bold uppercase mb-1.5 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4" />
              /mnt/datavault IS EMPTY
            </div>
            <p className="text-xs text-[#8b949e] max-w-md mb-4 leading-relaxed">
              Remote files exfiltrated via the <span className="text-[#56d364] font-bold">download</span> command in SMARTTERM are mounted here for inspection. Right-click files for deep inspection or shredding.
            </p>
            <button
              onClick={() => openApp('terminal')}
              className="px-3 py-1.5 bg-[#1f6feb] hover:bg-[#388bfd] text-white text-[11px] font-bold uppercase cursor-pointer"
            >
              EXEC // SMARTTERM →
            </button>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-12 divide-x divide-[#1e232c]">
            {/* File Index */}
            <div className="col-span-5 bg-[#090b0e] p-3 space-y-1.5 overflow-y-auto">
              <div className="text-[10px] uppercase tracking-wider text-[#6e7681] pb-1.5 border-b border-[#161a22]">
                // EXFILTRATED_BLOBS [{downloadedFiles.length}]
              </div>
              {downloadedFiles.map((file) => {
                const isSelected = active?.name === file.name;
                return (
                  <button
                    key={file.name}
                    onClick={() => {
                      sound.playClick();
                      setSelectedFile(file.name);
                    }}
                    onContextMenu={(e) => handleFileContextMenu(e, file)}
                    className={`w-full p-2.5 text-left border cursor-pointer flex items-start gap-2 transition-colors ${
                      isSelected
                        ? 'bg-[#151921] text-white border-[#58a6ff] font-bold'
                        : 'bg-[#060708] border-[#1e232c] text-[#c9d1d9] hover:border-[#303947]'
                    }`}
                  >
                    <FileCode className="w-4 h-4 text-[#58a6ff] shrink-0 mt-0.5" />
                    <div className="overflow-hidden">
                      <div className="text-xs truncate">{file.name}</div>
                      <div className="text-[10px] text-[#6e7681]">SIZE: {file.size}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* File Hex / Plaintext Dump */}
            <div
              className="col-span-7 p-4 bg-[#050608] overflow-y-auto flex flex-col"
              onContextMenu={(e) => {
                if (active) handleFileContextMenu(e, active);
              }}
            >
              {active && (
                <>
                  <div className="flex items-center justify-between border-b border-[#1e232c] pb-2 mb-3">
                    <div>
                      <div className="text-xs font-bold text-[#79c0ff]">
                        FILE: {active.name}
                      </div>
                      <div className="text-[10px] text-[#6e7681]">
                        BYTES: {active.size} // RIGHT-CLICK FOR ACTIONS
                      </div>
                    </div>
                    {active.isMissionEvidence && (
                      <span className="px-2 py-0.5 bg-[#238636] text-white text-[10px] font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> EVIDENCE
                      </span>
                    )}
                  </div>
                  <pre className="text-xs text-[#d4d7dc] whitespace-pre-wrap leading-relaxed">
                    {active.content}
                  </pre>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </WindowFrame>
  );
};
