import React, { useEffect, useState } from 'react';

export const DesktopWallpaper: React.FC = () => {
  const [telemetryTick, setTelemetryTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryTick((t) => (t + 1) % 1000);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0">
      {/* Deep, calm architectural dark wallpaper */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 45% 45%, #101622 0%, #080b10 50%, #040507 100%)
          `,
        }}
      />

      {/* Subtle precision dot matrix */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(#313d52 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Coordinate HUD lines */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-1/4 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#58a6ff]/30 to-transparent" />
        <div className="absolute top-3/4 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#58a6ff]/20 to-transparent" />
        <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#58a6ff]/20 to-transparent" />
      </div>

      {/* Ambient Tactical Coordinate Readouts */}
      <div className="absolute top-6 left-32 font-mono text-[9px] text-[#58a6ff]/30 tracking-widest uppercase flex flex-col gap-1">
        <span>LOC // 59.9139° N, 10.7522° E [SEC_GRID_ALPHA]</span>
        <span>GATEWAY // 10.88.4.19 :: MTU 1500 :: ENCRYPTED</span>
      </div>

      <div className="absolute bottom-16 left-32 font-mono text-[9px] text-[#8b949e]/25 tracking-widest uppercase flex items-center gap-3">
        <span className="w-1.5 h-1.5 bg-[#3fb950]/50 animate-ping" />
        <span>NEXUS ARCHITECTURE v6.4 // NODE_HEARTBEAT [{1420 + telemetryTick}]</span>
      </div>

      {/* Minimalist Geometric OS Emblem in center of desktop */}
      <div className="absolute left-[calc(50%-160px)] top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center opacity-25">
        <svg width="150" height="150" viewBox="0 0 140 140" fill="none">
          <circle cx="70" cy="70" r="62" stroke="#58a6ff" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.4" />
          <rect x="20" y="20" width="100" height="100" stroke="#58a6ff" strokeWidth="1" />
          <rect
            x="35"
            y="35"
            width="70"
            height="70"
            stroke="#58a6ff"
            strokeWidth="1"
            transform="rotate(45 70 70)"
          />
          <line x1="0" y1="70" x2="140" y2="70" stroke="#58a6ff" strokeWidth="0.75" />
          <line x1="70" y1="0" x2="70" y2="140" stroke="#58a6ff" strokeWidth="0.75" />
          <circle cx="70" cy="70" r="4.5" fill="#58a6ff" />
          <circle cx="70" cy="70" r="8" stroke="#58a6ff" strokeWidth="0.75" opacity="0.6" />
        </svg>
        <div className="mt-4 text-xs font-bold tracking-[0.45em] text-[#8b949e] uppercase">
          NEXUS OS
        </div>
      </div>
    </div>
  );
};
