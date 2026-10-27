---
name: nexus-audio-synth
description: >-
  Design, implement, and tune procedural Web Audio synthesizers, cyber-retro sound effects,
  ambient background hums, and alarm telemetry in NexusOS.
  Use when adding new audio cues in sound.ts, adjusting volume channels (Music, SFX, Master),
  or creating procedural hacker audio effects without external heavy assets.
---

# NexusOS Web Audio Synthesizer Guide

Use this skill when modifying or expanding procedural audio effects and synthesizer routines in:
- `src/utils/sound.ts`
- `src/components/AudioMixerPopover.tsx`

---

## 1. Web Audio Architecture

NexusOS uses the native **Web Audio API** (`AudioContext`) to generate all sound procedurally:
- **Zero Heavy Audio Assets:** Instant loading without large `.wav`/`.mp3` bundle sizes.
- **Dynamic Modulation:** Pitch and rhythm shift dynamically (e.g., drone pitch increases as firewall decays, trace tick rate escalates as trace percentage rises).

```text
AudioContext
     ├── Master Gain Node (isMuted toggle)
     │        ├── Music Gain Node (musicVolume 0.0 – 1.0)
     │        │        ├── Ambient Dark Drone Oscillator
     │        │        └── Tactical Trace Arpeggiator
     │        └── SFX Gain Node (sfxVolume 0.0 – 1.0)
     │                 ├── Keystrokes & Click Pulses
     │                 ├── Modem / Packet Handshakes
     │                 ├── Alarm & Siren Oscillators
     │                 └── Exploit Payload Hum
```

---

## 2. Recipe Book for Procedural Hacker SFX

### A. Terminal Keystroke (Short High-Passed Click)
```ts
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.type = 'triangle';
osc.frequency.setValueAtTime(1200 + Math.random() * 400, ctx.currentTime);
gain.gain.setValueAtTime(0.04 * sfxVolume, ctx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
osc.connect(gain);
gain.connect(sfxGain);
osc.start();
osc.stop(ctx.currentTime + 0.03);
```

### B. High-Priority Alarm / Siren (Drone Alert / System Lockdown)
```ts
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.type = 'sawtooth';
osc.frequency.setValueAtTime(440, ctx.currentTime);
osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.25);
osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.5);
gain.gain.setValueAtTime(0.12 * sfxVolume, ctx.currentTime);
gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.5);
```

### C. Steganography / Data Carver Decoding Chirp
```ts
// Rapid burst of pseudo-random frequency sweeps
for (let i = 0; i < 4; i++) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(2000 + i * 500, ctx.currentTime + i * 0.04);
  gain.gain.setValueAtTime(0.03 * sfxVolume, ctx.currentTime + i * 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.04 + 0.03);
  osc.connect(gain);
  gain.connect(sfxGain);
  osc.start(ctx.currentTime + i * 0.04);
  osc.stop(ctx.currentTime + i * 0.04 + 0.03);
}
```

---

## 3. Best Practices
1. **Safety First:** Always ramp gains to `0.0001` before calling `stop()` to eliminate popping and clicking.
2. **User Gesture Requirement:** Browsers block audio until the first user interaction. `sound.ensureMusicPlaying()` must be triggered from user clicks/taps.
3. **Mute Discipline:** Always honor `isMuted` and the respective volume slider channels.
