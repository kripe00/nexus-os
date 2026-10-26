// Tactical Neural Voice Synthesizer for NEXUS OS
// Utilizing Web Speech API with strict English studio voices (guaranteeing no Norwegian/local system voice fallback)

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
  "nora",
  "henrik",
  "stine",
]);

class VoiceSynthesizer {
  private synth: SpeechSynthesis | null = null;
  public enabled: boolean = true;
  public volume: number = 0.85;
  public selectedVoiceName: string = "Daniel";
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

      const savedVoice = localStorage.getItem("nexus_voice_name");
      if (savedVoice) {
        this.selectedVoiceName = savedVoice;
      }

      this.resolveEnglishVoice();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.resolveEnglishVoice();
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

  // Strictly filter for English voices (ignoring Nora, Henrik, or other non-English system voices)
  private getEnglishVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    const all = this.synth.getVoices();
    if (!all || all.length === 0) return [];

    return all.filter((v) => {
      const lowerName = v.name.toLowerCase();
      const lowerLang = (v.lang || "").toLowerCase().replace("_", "-");
      const isEnglish = lowerLang.startsWith("en");
      return isEnglish && !NOVELTY_VOICES.has(lowerName);
    });
  }

  public getAvailableVoices(): VoiceOption[] {
    const english = this.getEnglishVoices();
    return english.map((v) => ({
      name: v.name,
      lang: v.lang,
      label: `${v.name} (${v.lang.replace("_", "-")})`,
    }));
  }

  private resolveEnglishVoice() {
    const english = this.getEnglishVoices();
    if (english.length === 0) return;

    // Check if user's saved preference exists in English voices
    if (this.selectedVoiceName) {
      const match = english.find((v) => v.name === this.selectedVoiceName);
      if (match) {
        this.selectedVoice = match;
        this.notify();
        return;
      }
    }

    // Top tactical AI voices on macOS / Chrome:
    // 1. Daniel (British JARVIS - calm, masculine, authentic UK accent)
    // 2. Samantha (US Command Siri - clean, crisp American accent)
    // 3. Serena / Karen / Google UK
    const preferred =
      english.find((v) => v.name.includes("Daniel")) ||
      english.find((v) => v.name.includes("Samantha")) ||
      english.find((v) => v.name.includes("Google UK English")) ||
      english.find((v) => v.name.includes("Serena")) ||
      english.find((v) => v.name.includes("Karen")) ||
      english.find((v) => v.name.includes("Moira")) ||
      english[0];

    if (preferred) {
      this.selectedVoice = preferred;
      this.selectedVoiceName = preferred.name;
      try {
        localStorage.setItem("nexus_voice_name", preferred.name);
      } catch {}
      this.notify();
    }
  }

  public setVoice(voiceName: string) {
    const english = this.getEnglishVoices();
    const found = english.find((v) => v.name === voiceName);
    if (found) {
      this.selectedVoice = found;
      this.selectedVoiceName = found.name;
      try {
        localStorage.setItem("nexus_voice_name", found.name);
      } catch {}
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

    // Avoid duplicate cues within 2.5 seconds
    const now = Date.now();
    if (this.lastSpokenText === text && now - this.lastSpokenTime < 2500) {
      return;
    }
    this.lastSpokenText = text;
    this.lastSpokenTime = now;

    if (options?.priority) {
      this.synth.cancel();
    }

    // Always guarantee an authentic English voice is bound
    if (
      !this.selectedVoice ||
      !this.selectedVoice.lang.toLowerCase().startsWith("en")
    ) {
      this.resolveEnglishVoice();
    }

    // If voices are still loading from the browser, skip to prevent Nora/Norwegian fallback
    if (!this.selectedVoice) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.selectedVoice;
    // Explicit English language tag:
    utterance.lang = this.selectedVoice.lang || "en-GB";

    utterance.volume = this.volume;
    // Studio-clean pitch and rate (1.0 = clean, un-distorted human delivery)
    utterance.rate = options?.rate ?? 1.0;
    utterance.pitch = options?.pitch ?? 1.0;

    this.synth.speak(utterance);
  }

  // Snappy, military tactical callouts
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
    if (now - this.lastTransmissionTime > 8000) {
      this.lastTransmissionTime = now;
      this.speak("Incoming transmission.");
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
