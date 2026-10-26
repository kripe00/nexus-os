// Tactical Neural Voice Synthesizer for NEXUS OS
// Utilizing Web Speech API with natural, unwarped studio voices

export interface VoiceOption {
  name: string;
  lang: string;
  label: string;
}

const NOVELTY_VOICES = new Set([
  "albert",
  "bad news",
  "bahh",
  "bells",
  "boing",
  "bubbles",
  "cellos",
  "deranged",
  "fred",
  "good news",
  "hysterical",
  "junior",
  "kathy",
  "pipe organ",
  "ralph",
  "trinoids",
  "whisper",
  "zarvox",
]);

class VoiceSynthesizer {
  private synth: SpeechSynthesis | null = null;
  public enabled: boolean = true; // Enabled by default with high-quality voices
  public volume: number = 0.75;
  public selectedVoiceName: string = "";
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private lastSpokenText: string = "";
  private lastSpokenTime: number = 0;
  private lastTransmissionTime: number = 0;
  private listeners: Set<
    (state: { enabled: boolean; volume: number; voiceName: string }) => void
  > = new Set();

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

  public subscribe(
    cb: (state: { enabled: boolean; volume: number; voiceName: string }) => void,
  ): () => void {
    this.listeners.add(cb);
    cb({
      enabled: this.enabled,
      volume: this.volume,
      voiceName: this.selectedVoiceName,
    });
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb({
          enabled: this.enabled,
          volume: this.volume,
          voiceName: this.selectedVoiceName,
        });
      } catch {}
    });
  }

  public getAvailableVoices(): VoiceOption[] {
    if (!this.synth) return [];
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return [];

    return voices
      .filter((v) => {
        const lower = v.name.toLowerCase();
        return (
          v.lang.startsWith("en") &&
          !NOVELTY_VOICES.has(lower) &&
          !lower.includes("whisper")
        );
      })
      .map((v) => ({
        name: v.name,
        lang: v.lang,
        label: `${v.name} (${v.lang})`,
      }));
  }

  private initVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return;

    // Filter out joke / novelty voices
    const naturalEnglish = voices.filter((v) => {
      const lower = v.name.toLowerCase();
      return (
        v.lang.startsWith("en") &&
        !NOVELTY_VOICES.has(lower) &&
        !lower.includes("whisper")
      );
    });

    if (naturalEnglish.length === 0) {
      this.selectedVoice = voices[0];
      this.selectedVoiceName = voices[0]?.name || "";
      this.notify();
      return;
    }

    // If user previously selected a voice that exists, retain it
    if (this.selectedVoiceName) {
      const existing = naturalEnglish.find((v) => v.name === this.selectedVoiceName);
      if (existing) {
        this.selectedVoice = existing;
        return;
      }
    }

    // Top choices on macOS / Chrome for tactical AI:
    // 1. Daniel (British JARVIS-style, smooth and composed)
    // 2. Samantha (US Siri / Tactical AI)
    // 3. Serena / Karen / Google UK
    const preferred =
      naturalEnglish.find((v) => v.name.includes("Daniel")) ||
      naturalEnglish.find((v) => v.name.includes("Samantha")) ||
      naturalEnglish.find((v) => v.name.includes("Google UK English")) ||
      naturalEnglish.find((v) => v.name.includes("Serena")) ||
      naturalEnglish.find((v) => v.name.includes("Karen")) ||
      naturalEnglish[0];

    this.selectedVoice = preferred;
    this.selectedVoiceName = preferred.name;
    this.notify();
  }

  public setVoice(voiceName: string) {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    const found = voices.find((v) => v.name === voiceName);
    if (found) {
      this.selectedVoice = found;
      this.selectedVoiceName = found.name;
      this.notify();
    }
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

    // Avoid repeating identical cues within 2 seconds
    const now = Date.now();
    if (this.lastSpokenText === text && now - this.lastSpokenTime < 2000) {
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
      utterance.lang = this.selectedVoice.lang || "en-US";
    }

    utterance.volume = this.volume;
    // CRUCIAL: Pitch must be 1.0 (unwarped) to prevent metallic, distorted artifacts in browser TTS engines!
    utterance.rate = options?.rate ?? 1.0;
    utterance.pitch = options?.pitch ?? 1.0;

    this.synth.speak(utterance);
  }

  // Snappy, punchy military tactical callouts (2-3 words)
  public notifyTraceStart() {
    this.speak("Warning: Active trace.", { priority: true, rate: 1.05 });
  }

  public notifyTraceDanger() {
    this.speak("Critical: Trace lock imminent.", { priority: true, rate: 1.1 });
  }

  public notifyHostCompromised(_hostname?: string) {
    this.speak("Target compromised.");
  }

  public notifyFileExfiltrated(_filename?: string) {
    this.speak("Data exfiltrated.");
  }

  public notifyUnderAttack() {
    this.speak("Perimeter alert: Drone detected.", { priority: true, rate: 1.05 });
  }

  public notifyDroneCaptured() {
    this.speak("Target trapped in honeypot.");
  }

  public notifyTransmission(_sender?: string) {
    const now = Date.now();
    // Only speak once every 10 seconds so rapid messages don't spam
    if (now - this.lastTransmissionTime > 10000) {
      this.lastTransmissionTime = now;
      this.speak("Incoming transmission.", { rate: 1.0 });
    }
  }

  public notifyBountyCleared() {
    this.speak("Bounty secured.");
  }

  public notifyChapterComplete(_chapterName?: string) {
    this.speak("Operation secured.");
  }
}

export const voice = new VoiceSynthesizer();
