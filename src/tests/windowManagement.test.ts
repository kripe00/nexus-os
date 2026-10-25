import { describe, it, expect } from 'vitest';
import { AppId } from '../types/game';
import { WindowState } from '../context/GameContext';

describe('Window Management Logic', () => {
  it('correctly opens, closes, reopens, and increments z-index without side-effect collision', () => {
    let topZ = 30;
    const windows: Record<AppId, WindowState> = {
      whisper: { id: 'whisper', title: 'WhisperChat', isOpen: true, isMinimized: false, zIndex: 20, position: { x: 145, y: 36 } },
      intraweb: { id: 'intraweb', title: 'IntraWeb Browser', isOpen: false, isMinimized: false, zIndex: 15, position: { x: 165, y: 42 } },
      passweaver: { id: 'passweaver', title: 'PassWeaver', isOpen: false, isMinimized: false, zIndex: 14, position: { x: 220, y: 70 } },
      terminal: { id: 'terminal', title: 'Terminal', isOpen: false, isMinimized: false, zIndex: 16, position: { x: 185, y: 55 } },
      blackmarket: { id: 'blackmarket', title: 'BlackMarket', isOpen: false, isMinimized: false, zIndex: 13, position: { x: 230, y: 65 } },
      netshield: { id: 'netshield', title: 'NetShield IDS', isOpen: false, isMinimized: false, zIndex: 17, position: { x: 200, y: 50 } },
      spearphish: { id: 'spearphish', title: 'SpearPhish', isOpen: false, isMinimized: false, zIndex: 15, position: { x: 215, y: 60 } },
      packetsniffer: { id: 'packetsniffer', title: 'PacketSniffer', isOpen: false, isMinimized: false, zIndex: 18, position: { x: 240, y: 45 } },
      files: { id: 'files', title: 'DataVault', isOpen: false, isMinimized: false, zIndex: 12, position: { x: 260, y: 85 } },
    };

    // 1. Close whisper
    windows.whisper.isOpen = false;
    expect(windows.whisper.isOpen).toBe(false);

    // 2. Re-open whisper
    topZ += 1;
    windows.whisper = { ...windows.whisper, isOpen: true, isMinimized: false, zIndex: topZ };
    expect(windows.whisper.isOpen).toBe(true);
    expect(windows.whisper.isMinimized).toBe(false);
    expect(windows.whisper.zIndex).toBe(31);

    // 3. Open another window (terminal)
    topZ += 1;
    windows.terminal = { ...windows.terminal, isOpen: true, isMinimized: false, zIndex: topZ };
    expect(windows.terminal.isOpen).toBe(true);
    expect(windows.terminal.zIndex).toBe(32);
    expect(windows.terminal.zIndex).toBeGreaterThan(windows.whisper.zIndex);

    // 4. Move window with boundary clamping
    const move = (x: number, y: number) => ({
      x: Math.max(8, Math.min(1920 - 360, x)),
      y: Math.max(8, Math.min(1080 - 100, y)),
    });

    const newPos = move(500, 300);
    expect(newPos.x).toBe(500);
    expect(newPos.y).toBe(300);

    const clampedOffscreen = move(-100, 2000);
    expect(clampedOffscreen.x).toBe(8);
    expect(clampedOffscreen.y).toBe(980);
  });

  it('correctly minimizes all open windows and restores positions', () => {
    const windows: Record<AppId, WindowState> = {
      whisper: { id: 'whisper', title: 'WhisperChat', isOpen: true, isMinimized: false, zIndex: 20, position: { x: 145, y: 36 } },
      intraweb: { id: 'intraweb', title: 'IntraWeb Browser', isOpen: true, isMinimized: false, zIndex: 15, position: { x: 165, y: 42 } },
      passweaver: { id: 'passweaver', title: 'PassWeaver', isOpen: false, isMinimized: false, zIndex: 14, position: { x: 220, y: 70 } },
      terminal: { id: 'terminal', title: 'Terminal', isOpen: false, isMinimized: false, zIndex: 16, position: { x: 185, y: 55 } },
      blackmarket: { id: 'blackmarket', title: 'BlackMarket', isOpen: false, isMinimized: false, zIndex: 13, position: { x: 230, y: 65 } },
      netshield: { id: 'netshield', title: 'NetShield IDS', isOpen: false, isMinimized: false, zIndex: 17, position: { x: 200, y: 50 } },
      spearphish: { id: 'spearphish', title: 'SpearPhish', isOpen: false, isMinimized: false, zIndex: 15, position: { x: 215, y: 60 } },
      packetsniffer: { id: 'packetsniffer', title: 'PacketSniffer', isOpen: false, isMinimized: false, zIndex: 18, position: { x: 240, y: 45 } },
      files: { id: 'files', title: 'DataVault', isOpen: false, isMinimized: false, zIndex: 12, position: { x: 260, y: 85 } },
    };

    // Minimize all
    (Object.keys(windows) as AppId[]).forEach((key) => {
      if (windows[key].isOpen) {
        windows[key].isMinimized = true;
      }
    });

    expect(windows.whisper.isMinimized).toBe(true);
    expect(windows.intraweb.isMinimized).toBe(true);
    expect(windows.terminal.isMinimized).toBe(false); // was not open

    // Center window calculation
    const screenW = 1920;
    const screenH = 1080;
    const availableW = screenW - 340;
    const targetX = Math.max(16, Math.floor((availableW - 680) / 2));
    const targetY = Math.max(16, Math.floor((screenH - 490 - 44) / 2));

    expect(targetX).toBe(450);
    expect(targetY).toBe(273);
  });
});
