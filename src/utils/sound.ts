// Web Audio API Synthesizer & Multi-Track Audio Engine for NEXUS OS
// Zero external asset dependencies - crisp cyberpunk UI feedback & separate SFX/Music channels

class SoundEngine {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;
  public musicMuted: boolean = false;
  public sfxMuted: boolean = false;

  public musicVolume: number = 0.7;
  public sfxVolume: number = 0.8;

  private ambientAudio: HTMLAudioElement | null = null;
  private traceAudio: HTMLAudioElement | null = null;
  private musicStarted: boolean = false;
  private isTraceMusicActive: boolean = false;
  private listeners: Set<(playing: boolean) => void> = new Set();
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private gridHumOsc: OscillatorNode | null = null;
  private gridHumGain: GainNode | null = null;

  public subscribe(cb: (playing: boolean) => void): () => void {
    this.listeners.add(cb);
    cb(this.isMusicPlaying());
    return () => this.listeners.delete(cb);
  }

  private notifyState() {
    const playing = this.isMusicPlaying();
    this.listeners.forEach((cb) => {
      try {
        cb(playing);
      } catch {}
    });
  }

  public initMusic() {
    if (typeof window === "undefined") return;
    if (!this.ambientAudio || this.ambientAudio.error) {
      this.ambientAudio = new Audio("/audio/ambient_theme.mp3");
      this.ambientAudio.loop = true;
      this.ambientAudio.preload = "auto";
      this.ambientAudio.addEventListener("play", () => this.notifyState());
      this.ambientAudio.addEventListener("pause", () => this.notifyState());
      this.ambientAudio.addEventListener("playing", () => this.notifyState());
      this.ambientAudio.addEventListener("error", (e) => {
        console.warn("[SoundEngine] ambientAudio error:", e);
        this.notifyState();
      });
      this.applyMusicVolume();
    }
    if (!this.traceAudio || this.traceAudio.error) {
      this.traceAudio = new Audio("/audio/active_trace_theme.mp3");
      this.traceAudio.loop = true;
      this.traceAudio.preload = "auto";
      this.traceAudio.addEventListener("play", () => this.notifyState());
      this.traceAudio.addEventListener("pause", () => this.notifyState());
      this.traceAudio.addEventListener("playing", () => this.notifyState());
      this.traceAudio.addEventListener("error", (e) => {
        console.warn("[SoundEngine] traceAudio error:", e);
        this.notifyState();
      });
      this.applyMusicVolume();
    }
  }

  private applyMusicVolume() {
    const effectiveMusicVol =
      this.muted || this.musicMuted ? 0 : this.musicVolume;
    if (this.ambientAudio) {
      this.ambientAudio.volume = Math.max(
        0,
        Math.min(1, effectiveMusicVol * 0.7),
      );
    }
    if (this.traceAudio) {
      this.traceAudio.volume = Math.max(
        0,
        Math.min(1, effectiveMusicVol * 0.8),
      );
    }
  }

  public isMusicPlaying(): boolean {
    const active = this.isTraceMusicActive ? this.traceAudio : this.ambientAudio;
    return Boolean(active && !active.paused && !active.ended);
  }

  public ensureMusicPlaying() {
    if (this.muted || this.musicMuted) return;
    this.initMusic();
    const active = this.isTraceMusicActive ? this.traceAudio : this.ambientAudio;
    if (active && active.paused) {
      active
        .play()
        .then(() => {
          this.musicStarted = true;
          this.notifyState();
        })
        .catch((err) => {
          console.warn("[SoundEngine] ensureMusicPlaying autoplay wait:", err);
        });
    }
  }

  public toggleMusicPlayback(): boolean {
    this.initMusic();
    const active = this.isTraceMusicActive ? this.traceAudio : this.ambientAudio;
    if (!active) return false;

    if (!active.paused) {
      this.pauseMusic();
      return false;
    } else {
      if (this.muted) this.muted = false;
      if (this.musicMuted) this.musicMuted = false;
      this.applyMusicVolume();
      this.startMusic();
      return true;
    }
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    this.applyMusicVolume();
    if (this.musicVolume > 0 && !this.musicMuted && !this.muted) {
      this.ensureMusicPlaying();
    }
    this.notifyState();
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  public startMusic() {
    if (this.muted || this.musicMuted) return;
    this.initMusic();
    this.musicStarted = true;
    const active = this.isTraceMusicActive ? this.traceAudio : this.ambientAudio;
    if (active) {
      active
        .play()
        .then(() => {
          this.notifyState();
        })
        .catch((err) => {
          console.warn("[SoundEngine] startMusic autoplay prevented:", err);
        });
    }
  }

  public pauseMusic() {
    this.musicStarted = false;
    this.ambientAudio?.pause();
    this.traceAudio?.pause();
    this.notifyState();
  }

  public setTraceMusic(active: boolean) {
    const changed = this.isTraceMusicActive !== active;
    this.isTraceMusicActive = active;
    this.initMusic();

    if (active) {
      this.ambientAudio?.pause();
      if (!this.muted && !this.musicMuted && this.musicStarted) {
        if (this.traceAudio) {
          if (changed) this.traceAudio.currentTime = 0;
          this.traceAudio.play().catch(() => {});
        }
      }
    } else {
      this.traceAudio?.pause();
      if (!this.muted && !this.musicMuted && this.musicStarted) {
        this.ambientAudio?.play().catch(() => {});
      }
    }
    this.notifyState();
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    this.applyMusicVolume();
    if (this.muted) {
      this.ambientAudio?.pause();
      this.traceAudio?.pause();
    } else {
      this.ensureMusicPlaying();
    }
    this.notifyState();
    return this.muted;
  }

  public toggleMusicMute(): boolean {
    this.musicMuted = !this.musicMuted;
    this.applyMusicVolume();
    if (this.musicMuted) {
      this.ambientAudio?.pause();
      this.traceAudio?.pause();
    } else {
      this.ensureMusicPlaying();
    }
    this.notifyState();
    return this.musicMuted;
  }

  public toggleSfxMute(): boolean {
    this.sfxMuted = !this.sfxMuted;
    return this.sfxMuted;
  }

  private getContext(): AudioContext | null {
    if (this.muted || this.sfxMuted || this.sfxVolume <= 0.001) return null;
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
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
      osc.type = "triangle";
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
      osc.type = "sine";
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
      osc.type = "sine";
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
      osc.type = "triangle";
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
        osc.type = "sawtooth";
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
      osc.type = "square";
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
      osc.type = "sawtooth";
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
        osc.type = "sine";
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
        osc.type = "sine";
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
        osc.type = "triangle";
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
      osc.type = "sawtooth";
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

  // Incoming WhisperChat encrypted transmission chime (tactical cyberpunk pager)
  playMessage() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Soft high-tech digital chirps
      const notes = [
        { freq: 880, start: 0, dur: 0.06 },
        { freq: 1320, start: 0.05, dur: 0.09 },
        { freq: 1760, start: 0.11, dur: 0.12 },
      ];
      notes.forEach(({ freq, start, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + start);

        gain.gain.setValueAtTime(0.045 * this.sfxVolume, now + start);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + start);
        osc.stop(now + start + dur + 0.01);
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
      osc.type = "square";
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
      osc.type = "sawtooth";
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
      osc.type = "triangle";
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

  // Tactical Proxy Route Hop chirp
  playRouteHop() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [620, 932.33];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        const start = ctx.currentTime + i * 0.04;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.05 * this.sfxVolume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.07);
      });
    } catch {}
  }

  // Airborne Drone Rotor low-pass pulse
  public playDroneRotors() {
    this.stopDroneRotors();
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(140, ctx.currentTime);

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(42, ctx.currentTime); // 42Hz rotor drone

      gain.gain.setValueAtTime(0.04 * this.sfxVolume, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      this.droneOsc = osc;
      this.droneGain = gain;
    } catch {}
  }

  public stopDroneRotors() {
    try {
      if (this.droneOsc) {
        this.droneOsc.stop();
        this.droneOsc.disconnect();
        this.droneOsc = null;
      }
      if (this.droneGain) {
        this.droneGain.disconnect();
        this.droneGain = null;
      }
    } catch {}
  }

  // 60Hz SCADA Grid Hum & Frequency Drift
  public play60HzGridHum(overload = false) {
    this.stop60HzGridHum();
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const harmonic = ctx.createOscillator();
      const gain = ctx.createGain();

      const baseFreq = overload ? 60.85 : 60.0;
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      harmonic.type = "triangle";
      harmonic.frequency.setValueAtTime(baseFreq * 2, ctx.currentTime);

      gain.gain.setValueAtTime(
        (overload ? 0.05 : 0.03) * this.sfxVolume,
        ctx.currentTime,
      );

      osc.connect(gain);
      harmonic.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      harmonic.start();

      this.gridHumOsc = osc;
      this.gridHumGain = gain;
    } catch {}
  }

  public stop60HzGridHum() {
    try {
      if (this.gridHumOsc) {
        this.gridHumOsc.stop();
        this.gridHumOsc.disconnect();
        this.gridHumOsc = null;
      }
      if (this.gridHumGain) {
        this.gridHumGain.disconnect();
        this.gridHumGain = null;
      }
    } catch {}
  }

  // Heavy Industrial Breaker / Relay Trip Clunk
  public playRelayTrip() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.08 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch {}
  }

  // Sub-bass Double Trace Heartbeat
  public playTraceHeartbeat() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const beats = [0, 0.12];
      beats.forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        const start = ctx.currentTime + delay;
        osc.frequency.setValueAtTime(55, start);
        osc.frequency.exponentialRampToValueAtTime(35, start + 0.1);

        gain.gain.setValueAtTime(0.08 * this.sfxVolume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.11);
      });
    } catch {}
  }
}

export const sound = new SoundEngine();
