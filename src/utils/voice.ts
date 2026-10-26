// Tactical Neural Voice Synthesizer for NEXUS OS
// Utilizing Web Speech API with zero external dependencies

class VoiceSynthesizer {
  private synth: SpeechSynthesis | null = null;
  public enabled: boolean = false; // Default disabled to maintain crisp soundtrack & avoid robotic TTS interruption
  public volume: number = 0.7;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private lastSpokenText: string = "";
  private lastSpokenTime: number = 0;
  private listeners: Set<(state: { enabled: boolean; volume: number }) => void> = new Set();

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      try {
        this.synth.cancel();
      } catch {}
      this.initVoice();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoice();
      }
    }
  }

  public subscribe(cb: (state: { enabled: boolean; volume: number }) => void): () => void {
    this.listeners.add(cb);
    cb({ enabled: this.enabled, volume: this.volume });
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb({ enabled: this.enabled, volume: this.volume });
      } catch {}
    });
  }

  private initVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return;

    // Prioritize clean, crisp English robotic / assistant voices
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Natural") ||
          v.name.includes("UK English") ||
          v.name.includes("Samantha") ||
          v.name.includes("Daniel") ||
          v.name.includes("Google UK") ||
          v.name.includes("Google US")),
    );

    this.selectedVoice =
      preferred || voices.find((v) => v.lang.startsWith("en")) || voices[0];
  }

  public setEnabled(enable: boolean) {
    this.enabled = enable;
    if (!enable && this.synth) {
      this.synth.cancel();
    }
    this.notify();
  }

  public toggleEnabled(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.notify();
  }

  public speak(
    text: string,
    options?: { priority?: boolean; rate?: number; pitch?: number },
  ) {
    if (!this.synth || !this.enabled || this.volume <= 0.05) return;

    // Avoid repeating identical cues within 3 seconds
    const now = Date.now();
    if (this.lastSpokenText === text && now - this.lastSpokenTime < 3000) {
      return;
    }
    this.lastSpokenText = text;
    this.lastSpokenTime = now;

    if (options?.priority) {
      this.synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (!this.selectedVoice) {
      this.initVoice();
    }
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    utterance.volume = this.volume;
    utterance.rate = options?.rate ?? 1.05; // Snappy tactical delivery
    utterance.pitch = options?.pitch ?? 0.88; // Deep, calm AI demeanor

    this.synth.speak(utterance);
  }

  // Tactical situational alerts
  public notifyTraceStart() {
    this.speak("Warning: Neural trace initiated. Disconnect before triangulation.", {
      priority: true,
      rate: 1.1,
      pitch: 0.85,
    });
  }

  public notifyTraceDanger() {
    this.speak("Critical alert: Trace lock at eighty percent. Wipe logs immediately.", {
      priority: true,
      rate: 1.15,
      pitch: 0.9,
    });
  }

  public notifyHostCompromised(hostname?: string) {
    const target = hostname ? hostname.replace(/[-_.]/g, " ") : "target";
    this.speak(`Access granted. ${target} breached.`);
  }

  public notifyFileExfiltrated(filename?: string) {
    this.speak("Data packet exfiltrated to vault.");
  }

  public notifyUnderAttack() {
    this.speak("Perimeter alarm. Hostile hunter drone detected. Deploy honeypot countermeasures.", {
      priority: true,
      rate: 1.1,
    });
  }

  public notifyDroneCaptured() {
    this.speak("Hostile drone trapped in honeypot containment.");
  }

  public notifyTransmission(_sender: string) {
    // Disabled: chat transmissions rely on synthesizer pager SFX rather than jarring TTS
  }

  public notifyBountyCleared() {
    this.speak("Freelance bounty cleared. Crypto reward transferred.");
  }

  public notifyChapterComplete(chapterName: string) {
    this.speak(`Operation complete. ${chapterName} secured.`);
  }
}

export const voice = new VoiceSynthesizer();
