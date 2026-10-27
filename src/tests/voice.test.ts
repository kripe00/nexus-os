import { describe, it, expect, beforeEach, vi } from "vitest";
import { VoiceSynthesizer } from "../utils/voice";

describe("VoiceSynthesizer Default & Platform Fallback Logic", () => {
  let mockStore: Record<string, string> = {};

  const localStorageMock = {
    getItem: vi.fn((key: string) => mockStore[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      mockStore[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete mockStore[key];
    }),
    clear: vi.fn(() => {
      mockStore = {};
    }),
  };

  beforeEach(() => {
    mockStore = {};
    vi.stubGlobal("localStorage", localStorageMock);
    vi.restoreAllMocks();
  });

  const createMockVoice = (name: string, lang: string): SpeechSynthesisVoice => ({
    name,
    lang,
    default: false,
    localService: true,
    voiceURI: name,
  });

  it("selects Rocko by default when available (e.g. on macOS)", () => {
    const mockVoices: SpeechSynthesisVoice[] = [
      createMockVoice("Nora (Enhanced)", "nb-NO"),
      createMockVoice("Rocko", "en-US"),
      createMockVoice("Daniel", "en-GB"),
      createMockVoice("Microsoft David Desktop", "en-US"),
    ];

    const mockSynth = {
      getVoices: vi.fn(() => mockVoices),
      cancel: vi.fn(),
      speak: vi.fn(),
      onvoiceschanged: null,
    };

    vi.stubGlobal("window", {
      speechSynthesis: mockSynth,
      localStorage: localStorageMock,
    });

    const synth = new VoiceSynthesizer();
    synth.resolveEnglishVoice();

    expect(synth.selectedVoiceName).toBe("Rocko");
    // Fallback or default resolution must NOT pollute localStorage
    expect(localStorage.getItem("nexus_voice_user_chosen")).toBeNull();
  });

  it("falls back to Daniel / Google UK English when Rocko is missing (e.g. Windows/Linux)", () => {
    const mockVoices: SpeechSynthesisVoice[] = [
      createMockVoice("Microsoft David Desktop", "en-US"),
      createMockVoice("Google UK English Male", "en-GB"),
      createMockVoice("Nora", "nb-NO"),
    ];

    const mockSynth = {
      getVoices: vi.fn(() => mockVoices),
      cancel: vi.fn(),
      speak: vi.fn(),
      onvoiceschanged: null,
    };

    vi.stubGlobal("window", {
      speechSynthesis: mockSynth,
      localStorage: localStorageMock,
    });

    const synth = new VoiceSynthesizer();
    synth.resolveEnglishVoice();

    // Rocko & Daniel not present, Google UK English Male should be chosen
    expect(synth.selectedVoiceName).toBe("Google UK English Male");
    // Should NOT write auto-fallback to localStorage
    expect(localStorage.getItem("nexus_voice_name")).toBeNull();
  });

  it("falls back to Microsoft David on Windows if UK voices are missing, with correct filtering", () => {
    const mockVoices: SpeechSynthesisVoice[] = [
      createMockVoice("Nora", "nb-NO"),
      createMockVoice("Henrik", "nb-NO"),
      createMockVoice("Microsoft David Desktop", "en-US"),
    ];

    const mockSynth = {
      getVoices: vi.fn(() => mockVoices),
      cancel: vi.fn(),
      speak: vi.fn(),
      onvoiceschanged: null,
    };

    vi.stubGlobal("window", {
      speechSynthesis: mockSynth,
      localStorage: localStorageMock,
    });

    const synth = new VoiceSynthesizer();
    synth.resolveEnglishVoice();

    expect(synth.selectedVoiceName).toBe("Microsoft David Desktop");
    // Norwegian voices must be completely excluded from available voices
    const available = synth.getAvailableVoices();
    expect(available.every((v) => v.lang.startsWith("en"))).toBe(true);
    expect(available.some((v) => v.name === "Nora")).toBe(false);
  });

  it("respects user explicit choice and saves to localStorage only on user action", () => {
    const mockVoices: SpeechSynthesisVoice[] = [
      createMockVoice("Rocko", "en-US"),
      createMockVoice("Samantha", "en-US"),
    ];

    const mockSynth = {
      getVoices: vi.fn(() => mockVoices),
      cancel: vi.fn(),
      speak: vi.fn(),
      onvoiceschanged: null,
    };

    vi.stubGlobal("window", {
      speechSynthesis: mockSynth,
      localStorage: localStorageMock,
    });

    const synth = new VoiceSynthesizer();
    expect(synth.selectedVoiceName).toBe("Rocko");

    // User explicitly sets Samantha
    synth.setVoice("Samantha");
    expect(synth.selectedVoiceName).toBe("Samantha");
    expect(localStorage.getItem("nexus_voice_name")).toBe("Samantha");
    expect(localStorage.getItem("nexus_voice_user_chosen")).toBe("true");

    // Resetting to default clears explicit choice
    synth.resetToDefaultVoice();
    expect(synth.selectedVoiceName).toBe("Rocko");
    expect(localStorage.getItem("nexus_voice_user_chosen")).toBeNull();
  });
});
