import React, { useState } from 'react';
import { Cpu, Fingerprint, KeyRound, Lock, Unlock } from 'lucide-react';
import { EMAIL_ACCOUNTS } from '../data/worldData';
import { useGame } from '../context/GameContext';
import { WindowFrame } from '../components/WindowFrame';
import { sound } from '../utils/sound';

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
  } = useGame();

  const [crackingProgress, setCrackingProgress] = useState<number | null>(null);
  const [candidatePreview, setCandidatePreview] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{
    type: 'idle' | 'error' | 'success';
    text: string;
  }>({
    type: 'idle',
    text: 'Select 2 personal OSINT clues belonging to the target to synthesize their password.',
  });

  const targetAccount = EMAIL_ACCOUNTS[passWeaverTargetEmail];
  const isAlreadyCracked = crackedEmails.includes(passWeaverTargetEmail);

  const handleSynthesize = () => {
    if (!targetAccount || crackingProgress !== null) return;

    const req = targetAccount.requiredClueIds;
    const hasAllRequired =
      req.every((r) => passWeaverSelectedClues.includes(r)) &&
      passWeaverSelectedClues.length === req.length;

    const selectedValues = discoveredClues
      .filter((c) => passWeaverSelectedClues.includes(c.id))
      .map((c) => c.value);

    const a = selectedValues[0] || 'admin';
    const b = selectedValues[1] || '1234';
    const permutations = [
      `${a}_${b}`,
      `${b}${a}!`,
      `${a.toLowerCase()}${b}`,
      `${a}#${b}`,
      `${b}_${a}`,
      `${a}${b}`,
    ];

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

        if (hasAllRequired) {
          markEmailCracked(passWeaverTargetEmail);
          setCandidatePreview(targetAccount.password);
          setStatusMessage({
            type: 'success',
            text: `MATCH CONFIRMED! Password for ${passWeaverTargetEmail} is "${targetAccount.password}".`,
          });
        } else {
          sound.playError();
          setStatusMessage({
            type: 'error',
            text: `Synthesis failed: Selected clues do not match ${targetAccount.ownerName}'s password pattern (${targetAccount.hint}).`,
          });
        }
      }
    }, 240);
  };

  return (
    <WindowFrame
      id="passweaver"
      icon={<KeyRound className="w-3.5 h-3.5" />}
      width="w-[620px]"
      height="h-[500px]"
    >
      <div className="p-4 space-y-4 flex-1 overflow-y-auto bg-[#060708] text-xs">
        {/* Step 1: Target Account */}
        <div className="p-3.5 bg-[#0b0d11] border border-[#1e232c] space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#161a22] pb-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#79c0ff] font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#58a6ff]" />
              1. Select Target Account
            </span>
            {isAlreadyCracked && (
              <span className="px-2 py-0.5 bg-[#238636] text-white text-[10px] font-bold">
                CRACKED: {targetAccount.password}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.values(EMAIL_ACCOUNTS).map((acc) => {
              const cracked = crackedEmails.includes(acc.email);
              const active = passWeaverTargetEmail === acc.email;
              return (
                <button
                  key={acc.email}
                  onClick={() => {
                    sound.playClick();
                    setPassWeaverTargetEmail(acc.email);
                    setStatusMessage({
                      type: 'idle',
                      text: `Pattern Hint: ${acc.hint}`,
                    });
                  }}
                  className={`p-3 border text-left cursor-pointer transition-colors ${
                    active
                      ? 'bg-[#151921] border-[#58a6ff] text-white'
                      : 'bg-[#07080a] border-[#1e232c] text-[#8b949e] hover:border-[#303947]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-0.5">
                    <span className="truncate">{acc.email}</span>
                    {cracked ? (
                      <Unlock className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-[#6e7681] shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] text-[#8b949e] truncate">{acc.ownerName}</div>
                  <div className="text-[10px] text-[#79c0ff] mt-1">Hint: {acc.hint}</div>
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
                No OSINT clues collected yet! Search for the target on IntraWeb first.
              </p>
              <button
                onClick={() => navigateBrowser('search', 'Marcus Cole')}
                className="px-3 py-1.5 bg-[#1f6feb] hover:bg-[#388bfd] text-white text-[11px] font-bold uppercase cursor-pointer"
              >
                Search on IntraWeb →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {discoveredClues.map((clue) => {
                const selected = passWeaverSelectedClues.includes(clue.id);
                return (
                  <button
                    key={clue.id}
                    onClick={() => togglePassWeaverClue(clue.id)}
                    className={`p-2.5 border text-left cursor-pointer transition-colors ${
                      selected
                        ? 'bg-[#1f6feb] text-white border-[#58a6ff] font-bold'
                        : 'bg-[#07080a] border-[#21262d] text-[#d4d7dc] hover:border-[#3b4659]'
                    }`}
                  >
                    <div
                      className={`text-[9px] uppercase ${
                        selected ? 'text-white/80' : 'text-[#79c0ff]'
                      }`}
                    >
                      {clue.label}
                    </div>
                    <div className="text-xs font-bold truncate">"{clue.value}"</div>
                    <div
                      className={`text-[9px] truncate ${
                        selected ? 'text-white/75' : 'text-[#6e7681]'
                      }`}
                    >
                      {clue.targetPerson}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Synthesis Animation Bar */}
        {crackingProgress !== null && (
          <div className="p-3 bg-[#0d121c] border border-[#58a6ff] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#79c0ff] font-bold">
                TESTING CANDIDATE: <span className="text-white">{candidatePreview}</span>
              </span>
              <span className="text-[#58a6ff] font-bold">{crackingProgress}%</span>
            </div>
            <div className="w-full h-2 bg-[#060708] border border-[#282f3d]">
              <div
                className="h-full bg-[#58a6ff] transition-all duration-150"
                style={{ width: `${crackingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Status & Execute */}
        <div className="space-y-2.5">
          <div
            className={`p-3 border text-xs flex items-center justify-between ${
              statusMessage.type === 'success'
                ? 'bg-[#0b140e] border-[#238636] text-[#56d364] font-bold'
                : statusMessage.type === 'error'
                ? 'bg-[#210909] border-[#ff3b3b] text-[#ff5555]'
                : 'bg-[#0b0d11] border-[#1e232c] text-[#8b949e]'
            }`}
          >
            <span>{statusMessage.text}</span>
            {(statusMessage.type === 'success' || isAlreadyCracked) && (
              <button
                onClick={() => navigateBrowser('webmail', '', passWeaverTargetEmail)}
                className="px-2.5 py-1 bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-[11px] uppercase cursor-pointer shrink-0 ml-2"
              >
                Log into WebMail →
              </button>
            )}
          </div>

          <button
            onClick={handleSynthesize}
            disabled={passWeaverSelectedClues.length === 0 || crackingProgress !== null}
            className="w-full py-2.5 bg-[#1f6feb] hover:bg-[#388bfd] disabled:opacity-30 text-white font-bold text-xs uppercase tracking-widest cursor-pointer transition-colors flex items-center justify-center gap-2"
          >
            <KeyRound className="w-3.5 h-3.5" />
            {crackingProgress !== null
              ? 'SYNTHESIZING PERMUTATIONS...'
              : 'SYNTHESIZE & CRACK PASSWORD'}
          </button>
        </div>
      </div>
    </WindowFrame>
  );
};
