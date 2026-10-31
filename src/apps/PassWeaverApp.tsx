import React, { useState, useEffect } from "react";
import {
  Cpu,
  Fingerprint,
  KeyRound,
  Lock,
  Unlock,
  AlertTriangle,
  Sliders,
  ShieldAlert,
  Binary,
  CheckCircle2,
} from "lucide-react";
import { EMAIL_ACCOUNTS, PASSWORD_PATTERN_SCHEMAS } from "../data/worldData";
import { useGame } from "../context/GameContext";
import { WindowFrame } from "../components/WindowFrame";
import {
  SurveillanceAvatar,
  SurveillanceSubject,
} from "../components/SurveillanceAvatar";
import { sound } from "../utils/sound";

export const PassWeaverApp: React.FC = () => {
  const {
    discoveredClues,
    crackedEmails,
    markEmailCracked,
    passWeaverTargetEmail,
    setPassWeaverTargetEmail,
    passWeaverSelectedClues,
    togglePassWeaverClue,
    navigateBrowser,
    difficulty,
    addNotification,
  } = useGame();

  const targetAccount = EMAIL_ACCOUNTS[passWeaverTargetEmail];
  const isAlreadyCracked = crackedEmails.includes(passWeaverTargetEmail);

  const [selectedSchemaId, setSelectedSchemaId] = useState<string>(
    targetAccount?.patternSchemaId || "noun_year",
  );
  const [crackingProgress, setCrackingProgress] = useState<number | null>(null);
  const [candidatePreview, setCandidatePreview] = useState<string>("");
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<{
    type: "idle" | "error" | "success";
    text: string;
  }>({
    type: "idle",
    text:
      difficulty === "analyst"
        ? "Select 2 personal OSINT clues belonging to the target to synthesize their password."
        : "Select target account, isolate matching OSINT clues, and derive password policy schema.",
  });

  // Calculate difficulty-based thresholds
  const maxAttempts = difficulty === "ghost" ? 2 : difficulty === "operative" ? 3 : 5;
  const baseLockoutSeconds = difficulty === "ghost" ? 35 : difficulty === "operative" ? 20 : 5;

  // Sync schema automatically when switching accounts on Analyst difficulty
  useEffect(() => {
    if (targetAccount && difficulty === "analyst" && targetAccount.patternSchemaId) {
      setSelectedSchemaId(targetAccount.patternSchemaId);
    }
  }, [passWeaverTargetEmail, difficulty, targetAccount]);

  // Lockout countdown
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const timer = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          setFailedAttempts(0);
          setStatusMessage({
            type: "idle",
            text: "Lockout expired. Heuristic synthesis engine restored.",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  const handleSynthesize = () => {
    if (!targetAccount || crackingProgress !== null || lockoutRemaining > 0)
      return;

    // Hardened military hardware token check for Viktor Reyes
    if (passWeaverTargetEmail === "v.reyes@aethelgard.corp") {
      sound.playError();
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= maxAttempts) {
        setLockoutRemaining(baseLockoutSeconds);
        if (difficulty === "ghost") sound.playAlarm();
        setStatusMessage({
          type: "error",
          text: `SECURITY LOCKOUT (${baseLockoutSeconds}s): ${maxAttempts} failed attempts. ERR_SALTED_HARDWARE_KEY: Chief Reyes utilizes a 64-char military hardware token. Heuristic synthesis impossible. Deploy SpearPhish campaign.`,
        });
      } else {
        setStatusMessage({
          type: "error",
          text: `ERR_SALTED_HARDWARE_KEY: Chief Reyes utilizes a 64-character military hardware token. Heuristic password synthesis impossible. Deploy SpearPhish campaign. (${newAttempts}/${maxAttempts} attempts before lockout)`,
        });
      }
      return;
    }

    const req = targetAccount.requiredClueIds;
    const hasAllRequired =
      req.every((r) => passWeaverSelectedClues.includes(r)) &&
      passWeaverSelectedClues.length === req.length;

    // Schema matching logic: On Analyst, auto-matches. On Operative/Ghost, must match target's pattern schema!
    const targetExpectedSchema = targetAccount.patternSchemaId || "noun_year";
    const hasMatchingSchema =
      difficulty === "analyst" || selectedSchemaId === targetExpectedSchema;

    const selectedValues = discoveredClues
      .filter((c) => passWeaverSelectedClues.includes(c.id))
      .map((c) => c.value);

    const a = selectedValues[0] || "admin";
    const b = selectedValues[1] || "1234";

    // Build permutations reflecting the selected schema
    let permutations: string[] = [];
    if (selectedSchemaId === "noun_year") {
      permutations = [
        `${a}${b}`,
        `${a.toLowerCase()}${b}`,
        `${a}_${b}`,
        `${b}${a}!`,
        `${a.toUpperCase()}${b}`,
        `${a}${b}#`,
      ];
    } else if (selectedSchemaId === "project_pin") {
      permutations = [
        `${a}${b}`,
        `${a}-${b}`,
        `${a.toUpperCase()}${b}`,
        `${a}_${b}!`,
        `${b}${a}`,
        `${a}${b}#`,
      ];
    } else if (selectedSchemaId === "unit_shift") {
      permutations = [
        `${a}${b}`,
        `${a}_${b}`,
        `${a.toUpperCase()}${b}`,
        `${b}-${a}`,
        `${a}#${b}`,
      ];
    } else if (selectedSchemaId === "unix_delim") {
      permutations = [
        `${a}_${b}`,
        `${a.toLowerCase()}_${b}`,
        `${a}_${b}_sys`,
        `${b}_${a}`,
      ];
    } else {
      // pin_prefix or default
      permutations = [
        `${b}${a}`,
        `${b}_${a}`,
        `${b}${a}!`,
        `${a}${b}`,
      ];
    }

    setCrackingProgress(0);
    let step = 0;

    const timer = setInterval(() => {
      step += 1;
      const pct = Math.min(100, step * 16);
      setCrackingProgress(pct);
      setCandidatePreview(permutations[step % permutations.length]);
      sound.playKey();

      if (pct >= 100) {
        clearInterval(timer);
        setCrackingProgress(null);

        if (hasAllRequired && hasMatchingSchema) {
          setFailedAttempts(0);
          markEmailCracked(passWeaverTargetEmail);
          setCandidatePreview(targetAccount.password);
          sound.playClueFound();
          setStatusMessage({
            type: "success",
            text: `MATCH CONFIRMED! Password for ${passWeaverTargetEmail} is "${targetAccount.password}".`,
          });
        } else if (hasAllRequired && !hasMatchingSchema) {
          // Right clues, but incorrect pattern policy
          sound.playError();
          const newAttempts = failedAttempts + 1;
          setFailedAttempts(newAttempts);
          if (newAttempts >= maxAttempts) {
            setLockoutRemaining(baseLockoutSeconds);
            if (difficulty === "ghost") {
              sound.playAlarm();
              addNotification(
                "GATEWAY IDS ALERT",
                "Repeated policy violation detected on target identity provider!",
                "warning",
              );
            }
            setStatusMessage({
              type: "error",
              text: `SECURITY LOCKOUT (${baseLockoutSeconds}s): ${maxAttempts} failed attempts. Pattern schema mismatch triggered host PAM lockout.`,
            });
          } else {
            const schemaObj = PASSWORD_PATTERN_SCHEMAS[selectedSchemaId];
            setStatusMessage({
              type: "error",
              text: `POLICY REJECTED: Selected intel clues are valid, but candidate hash violates ${targetAccount.ownerName}'s corporate password policy (tried ${schemaObj?.name || selectedSchemaId}). (${newAttempts}/${maxAttempts} attempts)`,
            });
          }
        } else {
          sound.playError();
          const newAttempts = failedAttempts + 1;
          setFailedAttempts(newAttempts);
          if (newAttempts >= maxAttempts) {
            setLockoutRemaining(baseLockoutSeconds);
            if (difficulty === "ghost") {
              sound.playAlarm();
              addNotification(
                "GATEWAY IDS ALERT",
                "Heuristic brute-force threshold exceeded! Target IP throttled.",
                "warning",
              );
            }
            setStatusMessage({
              type: "error",
              text: `SECURITY LOCKOUT (${baseLockoutSeconds}s): ${maxAttempts} failed heuristic permutations. Heuristic engine throttled.`,
            });
          } else {
            const hintText =
              difficulty === "analyst"
                ? `Pattern: ${targetAccount.hint}`
                : difficulty === "operative"
                  ? "Check target personal records and division tags"
                  : "Authentication rejected by target PAM";
            setStatusMessage({
              type: "error",
              text: `Synthesis failed: Selected clues failed entropy verification against ${targetAccount.ownerName} (${hintText}). (${newAttempts}/${maxAttempts} attempts before lockout)`,
            });
          }
        }
      }
    }, 240);
  };

  return (
    <WindowFrame
      id="passweaver"
      icon={<KeyRound className="w-3.5 h-3.5" />}
      width="w-[680px]"
      height="h-[560px]"
    >
      <div className="p-4 space-y-4 flex-1 overflow-y-auto bg-[#060708] text-xs">
        {/* Protocol Protocol Header */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#0b0f17] border border-[#1b2536] text-[11px] font-mono">
          <span className="text-[#8b949e] flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span>SYNTHESIS PROTOCOL:</span>
            <span
              className={
                difficulty === "analyst"
                  ? "text-[#58a6ff] font-bold"
                  : difficulty === "operative"
                    ? "text-[#d29922] font-bold"
                    : "text-[#ff7b72] font-bold"
              }
            >
              {difficulty === "analyst"
                ? "ANALYST (ASSISTED)"
                : difficulty === "operative"
                  ? "OPERATIVE (SCHEMA VERIFICATION)"
                  : "ZERO-GHOST (HARDENED IDS)"}
            </span>
          </span>
          <span className="text-[#6e7681]">
            THRESHOLD: {maxAttempts - failedAttempts}/{maxAttempts} TRIES
          </span>
        </div>

        {/* Step 1: Target Account */}
        <div className="p-3.5 bg-[#0b0d11] border border-[#1e232c] space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#161a22] pb-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#79c0ff] font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#58a6ff]" />
              1. Select Target Account
            </span>
            {isAlreadyCracked && (
              <span className="px-2 py-0.5 bg-[#238636] text-white text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                CRACKED: {targetAccount.password}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {Object.values(EMAIL_ACCOUNTS).map((acc) => {
              const cracked = crackedEmails.includes(acc.email);
              const active = passWeaverTargetEmail === acc.email;
              const subjectMap: Record<string, SurveillanceSubject> = {
                "m.cole@velox-ai.io": "marcus",
                "j.sterling@aethelgard.corp": "sterling",
                "v.reyes@aethelgard.corp": "reyes",
              };
              const subj = subjectMap[acc.email] || "operator";

              // Display hint based on difficulty
              const displayHint =
                difficulty === "analyst"
                  ? acc.hint
                  : difficulty === "operative"
                    ? acc.hint.split("+")[0]
                      ? `${acc.hint.split("+")[0].trim()} + [...]`
                      : acc.hint
                    : "[RESTRICTED // EXAMINE INTRANET IT MEMOS]";

              return (
                <button
                  key={acc.email}
                  onClick={() => {
                    sound.playClick();
                    setPassWeaverTargetEmail(acc.email);
                    if (difficulty === "analyst" && acc.patternSchemaId) {
                      setSelectedSchemaId(acc.patternSchemaId);
                    }
                    setStatusMessage({
                      type: "idle",
                      text:
                        difficulty === "analyst"
                          ? `Pattern Hint: ${acc.hint}`
                          : `Target set to ${acc.ownerName}. Match intel clues and policy schema.`,
                    });
                  }}
                  className={`p-2.5 border text-left cursor-pointer transition-colors flex items-center gap-2.5 ${
                    active
                      ? "bg-[#151921] border-[#58a6ff] text-white"
                      : "bg-[#07080a] border-[#1e232c] text-[#8b949e] hover:border-[#303947]"
                  }`}
                >
                  <SurveillanceAvatar subject={subj} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs font-bold mb-0.5">
                      <span className="truncate">{acc.email}</span>
                      {cracked ? (
                        <Unlock className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-[#6e7681] shrink-0" />
                      )}
                    </div>
                    <div className="text-[10px] text-[#8b949e] truncate">
                      {acc.ownerName.split("(")[0].trim()}
                    </div>
                    <div
                      className={`text-[9px] mt-0.5 truncate ${
                        difficulty === "analyst"
                          ? "text-[#79c0ff]"
                          : difficulty === "operative"
                            ? "text-[#d29922]"
                            : "text-[#6e7681] font-mono"
                      }`}
                      title={displayHint}
                    >
                      {displayHint}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Clues */}
        <div className="p-3.5 bg-[#0b0d11] border border-[#1e232c] space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#161a22] pb-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#79c0ff] font-bold flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-[#58a6ff]" />
              2. Select OSINT Clues ({passWeaverSelectedClues.length} Selected)
            </span>
          </div>

          {discoveredClues.length === 0 ? (
            <div className="p-4 border border-dashed border-[#21262d] text-left space-y-2">
              <p className="text-xs text-[#8b949e]">
                No OSINT clues collected yet! Search for the target on IntraWeb
                first.
              </p>
              <button
                onClick={() => navigateBrowser("search", "Marcus Cole")}
                className="px-3 py-1.5 bg-[#1f6feb] hover:bg-[#388bfd] text-white text-[11px] font-bold uppercase cursor-pointer"
              >
                Search on IntraWeb →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {discoveredClues.map((clue) => {
                const selected = passWeaverSelectedClues.includes(clue.id);
                // On Operative / Ghost, do NOT reveal target person! Show category/source instead
                const targetTag =
                  difficulty === "analyst"
                    ? clue.targetPerson
                    : `[${clue.category.toUpperCase()}] ${clue.source ? clue.source.slice(0, 18) : "INTEL"}`;

                return (
                  <button
                    key={clue.id}
                    onClick={() => togglePassWeaverClue(clue.id)}
                    className={`p-2.5 border text-left cursor-pointer transition-colors ${
                      selected
                        ? "bg-[#1f6feb] text-white border-[#58a6ff] font-bold"
                        : "bg-[#07080a] border-[#21262d] text-[#d4d7dc] hover:border-[#3b4659]"
                    }`}
                  >
                    <div
                      className={`text-[9px] uppercase ${
                        selected ? "text-white/80" : "text-[#79c0ff]"
                      }`}
                    >
                      {clue.label}
                    </div>
                    <div className="text-xs font-bold truncate">
                      "{clue.value}"
                    </div>
                    <div
                      className={`text-[9px] truncate ${
                        selected
                          ? "text-white/75"
                          : difficulty === "analyst"
                            ? "text-[#6e7681]"
                            : "text-[#d29922] font-mono"
                      }`}
                    >
                      {targetTag}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Step 3: Password Complexity Rule / Schema Selector */}
        <div className="p-3.5 bg-[#0b0d11] border border-[#1e232c] space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#161a22] pb-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#79c0ff] font-bold flex items-center gap-1.5">
              <Binary className="w-3.5 h-3.5 text-[#58a6ff]" />
              3. Password Policy Rule / Schema
            </span>
            {difficulty === "analyst" && (
              <span className="text-[10px] text-[#58a6ff] font-mono">
                [AUTO-POLICY MATCHING]
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {Object.values(PASSWORD_PATTERN_SCHEMAS).map((schema) => {
              const active = selectedSchemaId === schema.id;
              const isSuggested =
                difficulty === "analyst" &&
                targetAccount?.patternSchemaId === schema.id;

              return (
                <button
                  key={schema.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedSchemaId(schema.id);
                  }}
                  className={`p-2.5 border text-left cursor-pointer transition-colors relative ${
                    active
                      ? "bg-[#151921] border-[#58a6ff] text-white"
                      : "bg-[#07080a] border-[#1e232c] text-[#8b949e] hover:border-[#303947]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                    <span className="truncate">{schema.name}</span>
                    {isSuggested && (
                      <span className="text-[8px] bg-[#1f6feb] text-white px-1.5 py-0.2 uppercase font-mono">
                        SUGGESTED
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-[10px] text-[#58a6ff] mb-1">
                    {schema.template}
                  </div>
                  <div className="text-[9px] text-[#6e7681] leading-tight line-clamp-2">
                    {schema.description}
                  </div>
                  <div className="text-[9px] text-[#484f58] mt-1 font-mono">
                    Ex: {schema.example}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Synthesis Animation Bar */}
        {crackingProgress !== null && (
          <div className="p-3.5 bg-[#0b1019] border border-[#58a6ff] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#79c0ff] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#58a6ff] animate-ping" />
                <span>FORGING HASH PERMUTATION:</span>
                <span className="text-white font-mono bg-[#141b26] px-2 py-0.5 border border-[#2b3a4e]">
                  {candidatePreview}
                </span>
              </span>
              <span className="text-[#58a6ff] font-mono font-bold">
                {crackingProgress}%
              </span>
            </div>

            {/* Cipher Tumbler Sub-stream */}
            <div className="font-mono text-[10px] text-[#8b949e] bg-[#06080d] p-2 border border-[#1b2330] flex items-center justify-between overflow-hidden">
              <span className="text-[#79c0ff] animate-pulse">
                [PBKDF2-HMAC-SHA256] :: SALT 0x
                {(crackingProgress * 1337).toString(16).toUpperCase()}
              </span>
              <span className="text-[#56d364]">
                RULE: {PASSWORD_PATTERN_SCHEMAS[selectedSchemaId]?.template || selectedSchemaId}
              </span>
            </div>

            <div className="w-full h-2.5 bg-[#060708] border border-[#282f3d] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] transition-all duration-150"
                style={{ width: `${crackingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Status & Execute */}
        <div className="space-y-2.5">
          <div
            className={`p-3 border text-xs flex items-center justify-between ${
              statusMessage.type === "success"
                ? "bg-[#0b140e] border-[#238636] text-[#56d364] font-bold"
                : statusMessage.type === "error"
                  ? "bg-[#210909] border-[#ff3b3b] text-[#ff5555]"
                  : "bg-[#0b0d11] border-[#1e232c] text-[#8b949e]"
            }`}
          >
            <span>{statusMessage.text}</span>
            {(statusMessage.type === "success" || isAlreadyCracked) && (
              <button
                onClick={() =>
                  navigateBrowser("webmail", "", passWeaverTargetEmail)
                }
                className="px-2.5 py-1 bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-[11px] uppercase cursor-pointer shrink-0 ml-2"
              >
                Log into WebMail →
              </button>
            )}
          </div>

          {lockoutRemaining > 0 && (
            <div className="p-2.5 bg-[#260e0e] border border-[#ff3b3b] text-[#ff7b72] flex items-center gap-2 text-xs font-mono font-bold">
              <AlertTriangle className="w-4 h-4 text-[#ff5555] animate-pulse shrink-0" />
              <span>
                LOCKOUT ACTIVE: Synthesis engine throttled. Wait{" "}
                {lockoutRemaining}s before re-attempting authentication.
              </span>
            </div>
          )}

          <button
            onClick={handleSynthesize}
            disabled={
              passWeaverSelectedClues.length === 0 ||
              crackingProgress !== null ||
              lockoutRemaining > 0
            }
            className={`w-full py-2.5 disabled:opacity-30 text-white font-bold text-xs uppercase tracking-widest cursor-pointer transition-colors flex items-center justify-center gap-2 ${
              lockoutRemaining > 0
                ? "bg-[#481a1d] border border-[#ff3b3b] text-[#ff7b72]"
                : "bg-[#1f6feb] hover:bg-[#388bfd]"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            {lockoutRemaining > 0
              ? `LOCKOUT ACTIVE (${lockoutRemaining}s)`
              : crackingProgress !== null
                ? "SYNTHESIZING PERMUTATIONS..."
                : `SYNTHESIZE & CRACK PASSWORD (${passWeaverSelectedClues.length} CLUES)`}
          </button>
        </div>
      </div>
    </WindowFrame>
  );
};
