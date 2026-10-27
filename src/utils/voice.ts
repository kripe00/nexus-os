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

export class VoiceSynthesizer {
  private synth: SpeechSynthesis | null = null;
  public enabled: boolean = true;
  public volume: number = 0.85;
  public selectedVoiceName: string = "Rocko";
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

      const userChosen =
        typeof localStorage !== "undefined" &&
        localStorage.getItem("nexus_voice_user_chosen") === "true";
      const savedVoice =
        typeof localStorage !== "undefined"
          ? localStorage.getItem("nexus_voice_name")
          : null;

      if (userChosen && savedVoice) {
        this.selectedVoiceName = savedVoice;
      } else {
        this.selectedVoiceName = "Rocko";
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
  public getEnglishVoices(): SpeechSynthesisVoice[] {
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

  public resolveEnglishVoice() {
    const english = this.getEnglishVoices();
    if (english.length === 0) return;

    // 1. If user explicitly chose a voice in the UI, check if it exists in available English voices
    const userChosen =
      typeof localStorage !== "undefined" &&
      localStorage.getItem("nexus_voice_user_chosen") === "true";

    if (userChosen && this.selectedVoiceName) {
      const match =
        english.find((v) => v.name === this.selectedVoiceName) ||
        english.find((v) =>
          v.name.toLowerCase().includes(this.selectedVoiceName.toLowerCase()),
        );
      if (match) {
        this.selectedVoice = match;
        this.selectedVoiceName = match.name;
        this.notify();
        return;
      }
    }

    // 2. Tactical Platform Fallback Sequence:
    // Priority 1: Rocko (macOS studio cyberpunk default)
    // Priority 2: Daniel (British JARVIS)
    // Priority 3: Google UK English Male / Google UK English (Chrome natural studio voice)
    // Priority 4: George (Windows UK voice)
    // Priority 5: Microsoft David / David (Windows default, military tuned)
    // Priority 6: Samantha (US Command)
    // Priority 7: Google US English
    // Priority 8: Serena / Karen / Moira
    // Priority 9: Any verified English voice
    const preferred =
      english.find((v) => v.name.toLowerCase().includes("rocko")) ||
      english.find((v) => v.name.toLowerCase().includes("daniel")) ||
      english.find((v) => v.name.toLowerCase().includes("google uk english male")) ||
      english.find((v) => v.name.toLowerCase().includes("google uk english")) ||
      english.find((v) => v.name.toLowerCase().includes("george")) ||
      english.find((v) => v.name.toLowerCase().includes("david")) ||
      english.find((v) => v.name.toLowerCase().includes("samantha")) ||
      english.find((v) => v.name.toLowerCase().includes("google us english")) ||
      english.find((v) => v.name.toLowerCase().includes("serena")) ||
      english.find((v) => v.name.toLowerCase().includes("karen")) ||
      english.find((v) => v.name.toLowerCase().includes("moira")) ||
      english[0];

    if (preferred) {
      this.selectedVoice = preferred;
      this.selectedVoiceName = preferred.name;
      // Do NOT overwrite localStorage with auto-fallback to preserve user standard across platforms
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
        localStorage.setItem("nexus_voice_user_chosen", "true");
      } catch {}
      this.notify();
    }
  }

  public resetToDefaultVoice() {
    try {
      localStorage.removeItem("nexus_voice_name");
      localStorage.removeItem("nexus_voice_user_chosen");
    } catch {}
    this.selectedVoiceName = "Rocko";
    this.resolveEnglishVoice();
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

    // Platform tactical tuning:
    // If fallback is Microsoft David or Windows desktop voice, default pitch/rate slightly lowered for military radio feel
    const voiceLower = (this.selectedVoice.name || "").toLowerCase();
    const isWindowsDesktopVoice =
      voiceLower.includes("david") ||
      voiceLower.includes("zira") ||
      voiceLower.includes("mark");

    const defaultRate = isWindowsDesktopVoice ? 0.98 : 1.0;
    const defaultPitch = isWindowsDesktopVoice ? 0.92 : 1.0;

    utterance.rate = options?.rate ?? defaultRate;
    utterance.pitch = options?.pitch ?? defaultPitch;

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
