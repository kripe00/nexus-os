import React, { useMemo, useState } from "react";
import {
  Binary,
  Check,
  Copy,
  Cpu,
  FileText,
  Hash,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useGame } from "../context/GameContext";
import { ServerFile } from "../types/game";
import { sound } from "../utils/sound";

interface HexInspectorModalProps {
  file: ServerFile;
  onClose: () => void;
}

function computeHexDump(str: string): string {
  const bytes = new TextEncoder().encode(str);
  const rows: string[] = [];
  for (let i = 0; i < bytes.length; i += 16) {
    const chunk = bytes.slice(i, i + 16);
    const offset = i.toString(16).padStart(8, "0");
    const hex = Array.from(chunk)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" ")
      .padEnd(48, " ");
    const ascii = Array.from(chunk)
      .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : "."))
      .join("");
    rows.push(`${offset}  ${hex} |${ascii}|`);
  }
  return rows.join("\n");
}

function getPseudoSha256(content: string, name: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  const str = content + name;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const p1 = (h1 >>> 0).toString(16).padStart(8, "0");
  const p2 = (h2 >>> 0).toString(16).padStart(8, "0");
  const p3 = ((h1 ^ h2) >>> 0).toString(16).padStart(8, "0");
  const p4 = ((h1 + h2) >>> 0).toString(16).padStart(8, "0");
  return `${p1}${p2}${p3}${p4}${p1.split("").reverse().join("")}${p2.split("").reverse().join("")}${p3}${p4}`.slice(
    0,
    64,
  );
}

export const HexInspectorModal: React.FC<HexInspectorModalProps> = ({
  file,
  onClose,
}) => {
  const { addNotification } = useGame();
  const [activeTab, setActiveTab] = useState<"hex" | "stegano">("hex");
  const [copied, setCopied] = useState<boolean>(false);
  const [carvingState, setCarvingState] = useState<
    "idle" | "scanning" | "completed"
  >("idle");
  const [carveProgress, setCarveProgress] = useState<number>(0);

  const hexDump = useMemo(() => computeHexDump(file.content), [file.content]);
  const sha256 = useMemo(
    () => getPseudoSha256(file.content, file.name),
    [file.content, file.name],
  );

  const handleCopyHex = () => {
    sound.playClick();
    navigator.clipboard.writeText(hexDump);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleRunCarver = () => {
    sound.playClick();
    setCarvingState("scanning");
    setCarveProgress(10);
    sound.playCarverChirp();

    let p = 10;
    const interval = setInterval(() => {
      p += 18;
      setCarveProgress(Math.min(100, p));
      if (p >= 100) {
        clearInterval(interval);
        setCarvingState("completed");
        sound.playSuccess();
        addNotification(
          "Steganography Analyzed",
          `Forensic parsing of ${file.name} completed.`,
          "clue",
        );
      }
    }, 140);
  };

  const steganoPayload = useMemo(() => {
    const fn = file.name.toLowerCase();
    if (fn.includes("transfer_manifest")) {
      return {
        detected: true,
        type: "EMBEDDED EXIF GEOLOCATION & CIPHER SALTS",
        payload:
          "CLASSIFIED PROCUREMENT ROUTING SALTS // GPS: 36.1408° N, 5.3536° W // RECIPIENT_HASH: 0x0451-AETHELGARD-VAULT // AIR-GAPPED VAULT IP: 203.0.113.88",
        notes:
          "Forensic carver isolated hidden carrier comments in the procurement buffer identifying Aethelgard's sovereign air-gapped vault.",
      };
    }
    if (fn.includes("mirror_targets")) {
      return {
        detected: true,
        type: "ROOT CERTIFICATE OVERRIDE CARVE",
        payload:
          "SOVEREIGN BYPASS TOKEN: TITAN-ZERO-PURGE // TARGET #002 SUB-ALLOCATION: WEST-EUROPE EGRESS MESH // ROOT RECOVERY SEED: [whisper neon galaxy phantom pulse]",
        notes:
          "Unredacted security manifest containing the administrative firmware purge token for the central Ouroboros supercluster.",
      };
    }
    if (fn.includes("uplink_intercept") || fn.includes("deadman")) {
      return {
        detected: true,
        type: "QKD ORBITAL TELEMETRY INTERCEPT",
        payload:
          "SATELLITE VALKYRIE-7 TRANSPONDER: 185.220.101.5:80 -> RELAY TARGET: FACILITY DELTA // SUPERCLUSTER IP: 194.165.16.100:8080",
        notes:
          "Embedded memory fragment confirming direct telemetry bridge into Project Mirror central supercluster.",
      };
    }
    return {
      detected: false,
      type: "NULL EMBEDDED BUFFER",
      payload: "NO STEGANOGRAPHIC ARTIFACTS DETECTED",
      notes:
        "Shannon Entropy: 7.82 bits/byte. High entropy byte distribution consistent with standard compressed binary blobs.",
    };
  }, [file.name]);

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
            <span>RAW HEX & FORENSIC CARVER // {file.name}</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#8b949e] hover:text-white cursor-pointer p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#05070a] border border-[#1a202c]">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab("hex");
            }}
            className={`py-1 text-center font-bold text-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "hex"
                ? "bg-[#151921] border border-[#58a6ff] text-white"
                : "text-[#8b949e] hover:text-white"
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>RAW HEX BYTE DUMP</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab("stegano");
            }}
            className={`py-1 text-center font-bold text-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "stegano"
                ? "bg-[#151921] border border-[#a371f7] text-[#d2a8ff]"
                : "text-[#8b949e] hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#a371f7]" />
            <span>STEGANOGRAPHIC FORENSIC CARVER</span>
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
            <span className="text-[#79c0ff]">
              application/octet-stream (UTF-8)
            </span>
          </div>
          <div>
            <span className="text-[#6e7681] uppercase">
              Security Classification:{" "}
            </span>
            <span
              className={
                file.isMissionEvidence
                  ? "text-[#3fb950] font-bold"
                  : "text-[#8b949e]"
              }
            >
              {file.isMissionEvidence ? "RESTRICTED EVIDENCE" : "ROUTINE BLOB"}
            </span>
          </div>
          <div className="col-span-2 flex items-center gap-1.5 pt-1 border-t border-[#141a24] truncate">
            <Hash className="w-3.5 h-3.5 text-[#58a6ff] shrink-0" />
            <span className="text-[#6e7681] uppercase shrink-0">SHA-256: </span>
            <span className="text-[#8b949e] font-mono truncate">{sha256}</span>
          </div>
        </div>

        {/* View 1: Raw Hex Dump */}
        {activeTab === "hex" && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-[#6e7681] uppercase font-bold tracking-wider">
              <span>
                OFFSET (HEX) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 00 01 02 03 04 05 06
                07 08 09 0A 0B 0C 0D 0E 0F &nbsp;&nbsp; ASCII DECODE
              </span>
              <button
                onClick={handleCopyHex}
                className="text-[#58a6ff] hover:text-white cursor-pointer flex items-center gap-1"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-[#3fb950]" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copied ? "COPIED HEX" : "COPY HEX DUMP"}</span>
              </button>
            </div>
            <div className="h-56 overflow-y-auto bg-[#040507] border border-[#1b222d] p-2.5 font-mono text-[11px] leading-5 text-[#39d353] select-text">
              <pre className="whitespace-pre">{hexDump}</pre>
            </div>
          </div>
        )}

        {/* View 2: Steganography / Forensic Carver */}
        {activeTab === "stegano" && (
          <div className="h-56 overflow-y-auto bg-[#040507] border border-[#1b222d] p-3 space-y-3 font-mono">
            {carvingState === "idle" && (
              <div className="h-full flex flex-col items-center justify-center space-y-2 text-center p-4">
                <Sparkles className="w-8 h-8 text-[#a371f7] animate-pulse" />
                <div className="text-white font-bold text-xs uppercase">
                  FORENSIC STEGANOGRAPHIC CARVER READY
                </div>
                <p className="text-[11px] text-[#8b949e] max-w-sm">
                  Deep-scans unallocated file sectors, EXIF metadata, and
                  trailing byte buffers for concealed coordinates and
                  cryptographic keys.
                </p>
                <button
                  onClick={handleRunCarver}
                  className="px-4 py-2 bg-[#8957e5] hover:bg-[#a371f7] text-white font-bold text-xs uppercase cursor-pointer transition-colors flex items-center gap-1.5 shadow-[0_0_12px_rgba(163,113,247,0.4)]"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>EXECUTE FORENSIC CARVE SCAN →</span>
                </button>
              </div>
            )}

            {carvingState === "scanning" && (
              <div className="h-full flex flex-col items-center justify-center space-y-3 p-4">
                <div className="flex items-center gap-2 text-[#d2a8ff] text-xs font-bold uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#a371f7] animate-ping" />
                  <span>
                    CARVING SLACK SPACE & EXIF MARKERS ({carveProgress}%)
                  </span>
                </div>
                <div className="w-64 h-2 bg-black border border-[#2e1d4d] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#6e40c9] to-[#a371f7] transition-all duration-100"
                    style={{ width: `${carveProgress}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#8b949e]">
                  PARSING BYTE OFFSETS 0x0000 → 0x0FFF...
                </span>
              </div>
            )}

            {carvingState === "completed" && (
              <div className="space-y-2.5">
                <div className="p-2.5 bg-[#120a1c] border border-[#582987] flex items-center justify-between">
                  <span className="text-[#d2a8ff] font-bold text-xs uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#3fb950]" />
                    {steganoPayload.detected
                      ? "CONCEALED STEGANOGRAPHIC DATA RECOVERED"
                      : "EXHAUSTIVE BYTE SCAN COMPLETE"}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                      steganoPayload.detected
                        ? "bg-[#238636] text-white"
                        : "bg-[#21262d] text-[#8b949e]"
                    }`}
                  >
                    {steganoPayload.detected
                      ? "PAYLOAD EXTRACTED"
                      : "NO PAYLOAD"}
                  </span>
                </div>

                <div className="p-2.5 bg-[#08050e] border border-[#221636] space-y-1.5 text-xs">
                  <div className="text-[10px] text-[#8b949e] uppercase font-bold">
                    ARTIFACT CLASSIFICATION: {steganoPayload.type}
                  </div>
                  <pre className="p-2 bg-black border border-[#2b1c44] text-[#39d353] font-bold whitespace-pre-wrap leading-relaxed select-text">
                    {steganoPayload.payload}
                  </pre>
                  <p className="text-[10px] text-[#8b949e]">
                    {steganoPayload.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-1 text-[11px]">
          <span className="text-[#6e7681]">
            Press [ESC] or click outside to dismiss inspector.
          </span>
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
