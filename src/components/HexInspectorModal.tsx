import React, { useMemo } from 'react';
import { Binary, Check, Copy, FileText, Hash, ShieldCheck, X } from 'lucide-react';
import { ServerFile } from '../types/game';
import { sound } from '../utils/sound';

interface HexInspectorModalProps {
  file: ServerFile;
  onClose: () => void;
}

function computeHexDump(str: string): string {
  const bytes = new TextEncoder().encode(str);
  const rows: string[] = [];
  for (let i = 0; i < bytes.length; i += 16) {
    const chunk = bytes.slice(i, i + 16);
    const offset = i.toString(16).padStart(8, '0');
    const hex = Array.from(chunk)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(' ')
      .padEnd(48, ' ');
    const ascii = Array.from(chunk)
      .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.'))
      .join('');
    rows.push(`${offset}  ${hex} |${ascii}|`);
  }
  return rows.join('\n');
}

// Deterministic mock SHA-256 string for the file
function getPseudoSha256(content: string, name: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  const str = content + name;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const p1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const p2 = (h2 >>> 0).toString(16).padStart(8, '0');
  const p3 = ((h1 ^ h2) >>> 0).toString(16).padStart(8, '0');
  const p4 = ((h1 + h2) >>> 0).toString(16).padStart(8, '0');
  return `${p1}${p2}${p3}${p4}${p1.split('').reverse().join('')}${p2.split('').reverse().join('')}${p3}${p4}`.slice(0, 64);
}

export const HexInspectorModal: React.FC<HexInspectorModalProps> = ({ file, onClose }) => {
  const [copied, setCopied] = React.useState<boolean>(false);
  const hexDump = useMemo(() => computeHexDump(file.content), [file.content]);
  const sha256 = useMemo(() => getPseudoSha256(file.content, file.name), [file.content, file.name]);

  const handleCopyHex = () => {
    sound.playClick();
    navigator.clipboard.writeText(hexDump);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9998] bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs font-mono"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#0a0d13] border-2 border-[#303947] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.95)] space-y-3.5 text-xs animate-window-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1f2633] pb-2.5">
          <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider">
            <Binary className="w-4 h-4 text-[#58a6ff]" />
            <span>RAW HEX & METADATA INSPECTOR // {file.name}</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#8b949e] hover:text-white cursor-pointer p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#05070b] border border-[#1a202c] text-[11px]">
          <div>
            <span className="text-[#6e7681] uppercase">File Name: </span>
            <span className="text-[#e6edf3] font-bold">{file.name}</span>
          </div>
          <div>
            <span className="text-[#6e7681] uppercase">Allocated Size: </span>
            <span className="text-[#58a6ff] font-bold">{file.size}</span>
          </div>
          <div>
            <span className="text-[#6e7681] uppercase">MIME / Encoding: </span>
            <span className="text-[#79c0ff]">application/octet-stream (UTF-8)</span>
          </div>
          <div>
            <span className="text-[#6e7681] uppercase">Security Classification: </span>
            <span className={file.isMissionEvidence ? 'text-[#3fb950] font-bold' : 'text-[#8b949e]'}>
              {file.isMissionEvidence ? 'RESTRICTED EVIDENCE' : 'ROUTINE BLOB'}
            </span>
          </div>
          <div className="col-span-2 flex items-center gap-1.5 pt-1 border-t border-[#141a24] truncate">
            <Hash className="w-3.5 h-3.5 text-[#58a6ff] shrink-0" />
            <span className="text-[#6e7681] uppercase shrink-0">SHA-256: </span>
            <span className="text-[#8b949e] font-mono truncate">{sha256}</span>
          </div>
        </div>

        {/* Hex Dump Viewer */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-[#6e7681] uppercase font-bold tracking-wider">
            <span>OFFSET (HEX) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F &nbsp;&nbsp; ASCII DECODE</span>
            <button
              onClick={handleCopyHex}
              className="text-[#58a6ff] hover:text-white cursor-pointer flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-[#3fb950]" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'COPIED HEX' : 'COPY HEX DUMP'}</span>
            </button>
          </div>
          <div className="h-56 overflow-y-auto bg-[#040507] border border-[#1b222d] p-2.5 font-mono text-[11px] leading-5 text-[#39d353] select-text">
            <pre className="whitespace-pre">{hexDump}</pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-1 text-[11px]">
          <span className="text-[#6e7681]">Press [ESC] or click outside to dismiss inspector.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1f6feb] hover:bg-[#388bfd] text-white font-bold uppercase cursor-pointer"
          >
            [ CLOSE INSPECTOR ]
          </button>
        </div>
      </div>
    </div>
  );
};
