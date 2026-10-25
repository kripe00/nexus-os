// Web Audio API Synthesizer & Multi-Track Audio Engine for NEXUS OS
// Zero external asset dependencies - crisp cyberpunk UI feedback & separate SFX/Music channels

class SoundEngine {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;
  public musicMuted: boolean = false;
  public sfxMuted: boolean = false;

  public musicVolume: number = 0.70;
  public sfxVolume: number = 0.80;

  private ambientAudio: HTMLAudioElement | null = null;
  private traceAudio: HTMLAudioElement | null = null;
  private musicStarted: boolean = false;
  private isTraceMusicActive: boolean = false;

  public initMusic() {
    if (typeof window === 'undefined') return;
    if (!this.ambientAudio) {
      this.ambientAudio = new Audio('/audio/ambient_theme.mp3');
      this.ambientAudio.loop = true;
      this.applyMusicVolume();
    }
    if (!this.traceAudio) {
      this.traceAudio = new Audio('/audio/active_trace_theme.mp3');
      this.traceAudio.loop = true;
      this.applyMusicVolume();
    }
  }

  private applyMusicVolume() {
    const effectiveMusicVol = (this.muted || this.musicMuted) ? 0 : this.musicVolume;
    if (this.ambientAudio) {
      this.ambientAudio.volume = Math.max(0, Math.min(1, effectiveMusicVol * 0.40));
    }
    if (this.traceAudio) {
      this.traceAudio.volume = Math.max(0, Math.min(1, effectiveMusicVol * 0.50));
    }
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    this.applyMusicVolume();
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  public startMusic() {
    if (this.muted || this.musicMuted) return;
    this.initMusic();
    this.musicStarted = true;
    if (this.isTraceMusicActive) {
      this.traceAudio?.play().catch(() => {});
    } else {
      this.ambientAudio?.play().catch(() => {});
    }
  }

  public setTraceMusic(active: boolean) {
    this.isTraceMusicActive = active;
    if (!this.musicStarted || this.muted || this.musicMuted) return;
    this.initMusic();

    if (active) {
      this.ambientAudio?.pause();
      if (this.traceAudio) {
        this.traceAudio.currentTime = 0;
        this.traceAudio.play().catch(() => {});
      }
    } else {
      this.traceAudio?.pause();
      this.ambientAudio?.play().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    this.applyMusicVolume();
    if (this.muted) {
      this.ambientAudio?.pause();
      this.traceAudio?.pause();
    } else if (this.musicStarted && !this.musicMuted) {
      if (this.isTraceMusicActive) {
        this.traceAudio?.play().catch(() => {});
      } else {
        this.ambientAudio?.play().catch(() => {});
      }
    }
    return this.muted;
  }

  public toggleMusicMute(): boolean {
    this.musicMuted = !this.musicMuted;
    this.applyMusicVolume();
    if (this.musicMuted) {
      this.ambientAudio?.pause();
      this.traceAudio?.pause();
    } else if (this.musicStarted && !this.muted) {
      if (this.isTraceMusicActive) {
        this.traceAudio?.play().catch(() => {});
      } else {
        this.ambientAudio?.play().catch(() => {});
      }
    }
    return this.musicMuted;
  }

  public toggleSfxMute(): boolean {
    this.sfxMuted = !this.sfxMuted;
    return this.sfxMuted;
  }

  private getContext(): AudioContext | null {
    if (this.muted || this.sfxMuted || this.sfxVolume <= 0.001) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Mechanical keystroke
  playKey() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(680 + Math.random() * 180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.025);

      gain.gain.setValueAtTime(0.04 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.028);
    } catch {}
  }

  // Soft UI click for buttons & tabs
  playClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(920, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.06 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch {}
  }

  // Pneumatic servo / air-lock decompress when opening a window
  playWindowOpen() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.05 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    } catch {}
  }

  // Magnetic seal / lock sound when closing or minimizing a window
  playWindowClose() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.045 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {}
  }

  // Terminal command execution digital crunch
  playTerminalExec() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [440, 880, 1320];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        const start = ctx.currentTime + i * 0.022;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.035 * this.sfxVolume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.045);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.05);
      });
    } catch {}
  }

  // SpearPhishing dispatch modem blip
  playPhishSent() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(850, ctx.currentTime);
      osc.frequency.setValueAtTime(1250, ctx.currentTime + 0.04);
      osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.04 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch {}
  }

  // NetShield electromagnetic arc / high-voltage honeypot trap
  playHoneypotTrap() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1800, ctx.currentTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.22);

      gain.gain.setValueAtTime(0.08 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.23);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.24);
    } catch {}
  }

  // Mechanical tactile digital coin chime for BlackMarket purchases & rewards
  playCryptoCoin() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const freqs = [1318.51, 1760.0]; // E6, A6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const start = ctx.currentTime + idx * 0.075;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.07 * this.sfxVolume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.24);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.26);
      });
    } catch {}
  }

  // Clue discovered chime
  playClueFound() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [587.33, 880, 1174.66]; // D5, A5, D6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const start = ctx.currentTime + idx * 0.055;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.08 * this.sfxVolume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.24);
      });
    } catch {}
  }

  // Mission complete / Password cracked / Port breached
  playSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = ctx.currentTime + idx * 0.065;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.09 * this.sfxVolume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.3);
      });
    } catch {}
  }

  // Error / Access Denied buzz
  playError() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.setValueAtTime(115, ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.08 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.24);
    } catch {}
  }

  // Incoming WhisperChat message ping
  playMessage() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [740, 1108.73]; // F#5, C#6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const start = ctx.currentTime + idx * 0.08;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.07 * this.sfxVolume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.2);
      });
    } catch {}
  }

  // Active Trace warning pulse
  playTraceTick(highUrgency = false) {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(highUrgency ? 880 : 440, ctx.currentTime);

      gain.gain.setValueAtTime(0.035 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {}
  }

  // Network Packet Sniff & Capture chirp
  playPacketChirp() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(2200, ctx.currentTime + 0.03);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.045 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.075);
    } catch {}
  }

  // Tactical Context Menu chirp
  playContextMenuOpen() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.04 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {}
  }
}

export const sound = new SoundEngine();
