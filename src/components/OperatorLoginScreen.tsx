import React, { useState } from 'react';
import {
  Cpu,
  KeyRound,
  Lock,
  Radio,
  ShieldAlert,
  Terminal,
  User,
  UserPlus,
  Zap,
} from 'lucide-react';
import { sound } from '../utils/sound';

interface OperatorLoginScreenProps {
  onLogin: (username: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  onRegister: (username: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  onGuest: () => void;
}

export const OperatorLoginScreen: React.FC<OperatorLoginScreenProps> = ({
  onLogin,
  onRegister,
  onGuest,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password.trim()) {
      sound.playError();
      setError('Please provide an Operator Handle and Passphrase.');
      return;
    }

    setLoading(true);
    sound.playKey();

    try {
      if (mode === 'login') {
        const res = await onLogin(username, password);
        if (!res.success) {
          sound.playError();
          setError(res.error || 'Authentication rejected. Invalid credentials.');
        } else {
          sound.playSuccess();
          sound.ensureMusicPlaying();
        }
      } else {
        const res = await onRegister(username, password);
        if (!res.success) {
          sound.playError();
          setError(res.error || 'Operator registration failed.');
        } else {
          sound.playSuccess();
          sound.ensureMusicPlaying();
        }
      }
    } catch (err: unknown) {
      sound.playError();
      setError('Could not connect to Nexus backend server (port 3001).');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestClick = () => {
    sound.playClick();
    sound.ensureMusicPlaying();
    onGuest();
  };

  return (
    <div className="fixed inset-0 bg-[#040608] flex items-center justify-center p-4 select-none z-50 tactical-scanlines font-mono">
      {/* Background Matrix Ambient Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#313d52 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-md w-full bg-[#080b11] border border-[#2b3548] p-6 space-y-5 shadow-[0_24px_80px_rgba(0,0,0,0.95)] relative z-10 animate-window-in">
        {/* Terminal Header */}
        <div className="border-b border-[#1b2332] pb-4 text-center space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#58a6ff] tracking-widest uppercase">
            <Cpu className="w-4 h-4 text-[#58a6ff]" />
            <span>NEXUS OS // KERNEL 6.11.0</span>
          </div>
          <h1 className="text-sm font-bold text-white tracking-tight uppercase">
            CLANDESTINE OPERATOR TERMINAL
          </h1>
          <p className="text-[10px] text-[#8b949e]">
            Persistent database storage enabled on SQLite. Enter credentials to load dossier.
          </p>
        </div>

        {/* Tab Toggle: Login vs Register */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#05070a] border border-[#1a202c]">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setMode('login');
              setError(null);
            }}
            className={`py-1.5 text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-[#151921] border border-[#58a6ff] text-white'
                : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>LOGIN</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setMode('register');
              setError(null);
            }}
            className={`py-1.5 text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-[#151921] border border-[#58a6ff] text-white'
                : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>REGISTER</span>
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-2.5 bg-[#210909] border border-[#ff3b3b] text-[#ff5555] text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold text-[#8b949e]">
              OPERATOR HANDLE:
            </label>
            <div className="flex items-center bg-[#05070a] border border-[#212836] px-3 py-2 focus-within:border-[#58a6ff]">
              <User className="w-4 h-4 text-[#6e7681] mr-2 shrink-0" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. GhostOperator"
                className="w-full bg-transparent text-xs text-white placeholder-[#505a68] focus:outline-none font-mono"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold text-[#8b949e]">
              SECRET PASSPHRASE:
            </label>
            <div className="flex items-center bg-[#05070a] border border-[#212836] px-3 py-2 focus-within:border-[#58a6ff]">
              <KeyRound className="w-4 h-4 text-[#6e7681] mr-2 shrink-0" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-transparent text-xs text-white placeholder-[#505a68] focus:outline-none font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#1f6feb] hover:bg-[#388bfd] disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-center gap-2"
          >
            <Terminal className="w-4 h-4" />
            <span>{loading ? 'AUTHENTICATING...' : mode === 'login' ? 'BOOT NEXUS OS →' : 'REGISTER & BOOT →'}</span>
          </button>
        </form>

        {/* Quick Guest Access */}
        <div className="pt-3 border-t border-[#1b2332] text-center space-y-2">
          <div className="text-[10px] text-[#6e7681]">OR TEST IN ANONYMOUS GUEST SESSION:</div>
          <button
            type="button"
            onClick={handleGuestClick}
            className="w-full py-2 bg-[#10141d] hover:bg-[#161c28] border border-[#212836] text-[#79c0ff] font-bold text-xs uppercase cursor-pointer transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span>[ GUEST OPERATOR // QUICK BOOT ]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
