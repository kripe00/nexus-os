import React from 'react';

export const DesktopWallpaper: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0">
      {/* Deep, calm architectural dark wallpaper */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 42% 45%, #111824 0%, #090c12 52%, #050608 100%)
          `,
        }}
      />

      {/* Subtle precision dot matrix */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `radial-gradient(#2c3648 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Minimalist Geometric OS Emblem in center of desktop */}
      <div className="absolute left-[calc(50%-160px)] top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center opacity-20">
        <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
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
          <circle cx="70" cy="70" r="4" fill="#58a6ff" />
        </svg>
        <div className="mt-4 text-xs font-bold tracking-[0.45em] text-[#8b949e] uppercase">
          NEXUS OS
        </div>
      </div>
    </div>
  );
};
