import React from "react";

export type SurveillanceSubject =
  "elena" | "marcus" | "sterling" | "reyes" | "zero" | "operator";

interface SurveillanceAvatarProps {
  subject: SurveillanceSubject;
  size?: "sm" | "md" | "lg";
  className?: string;
  showScanlines?: boolean;
}

export const SurveillanceAvatar: React.FC<SurveillanceAvatarProps> = ({
  subject,
  size = "md",
  className = "",
  showScanlines = true,
}) => {
  const sizeMap = {
    sm: "w-7 h-7",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  // Distinct monochrome palette per faction/personality
  const metaMap: Record<
    SurveillanceSubject,
    {
      code: string;
      tint: string; // Stroke/accent color
      bg: string;
      status: string;
      features: React.ReactNode;
    }
  > = {
    elena: {
      code: "SUB_01-EV",
      tint: "#58a6ff", // Corporate/Tech blue
      bg: "#0a1018",
      status: "VERIFIED",
      features: (
        <>
          {/* Female corporate silhouette: sharp bob haircut, glasses silhouette */}
          <path
            d="M12 28 C12 22, 16 19, 20 19 C24 19, 28 22, 28 28 Z"
            fill="#21334d"
          />
          <circle cx="20" cy="14" r="5.5" fill="#58a6ff" opacity="0.8" />
          {/* Hair silhouette */}
          <path
            d="M13 14 C13 8, 27 8, 27 14 C27 18, 25 20, 24 20 C23 16, 17 16, 16 20 C15 20, 13 18, 13 14 Z"
            fill="#0d1827"
          />
          {/* Cryptography spectacles */}
          <rect
            x="16"
            y="13"
            width="3"
            height="2"
            stroke="#e6edf3"
            strokeWidth="0.75"
            fill="none"
          />
          <rect
            x="21"
            y="13"
            width="3"
            height="2"
            stroke="#e6edf3"
            strokeWidth="0.75"
            fill="none"
          />
          <line
            x1="19"
            y1="14"
            x2="21"
            y2="14"
            stroke="#e6edf3"
            strokeWidth="0.75"
          />
        </>
      ),
    },
    marcus: {
      code: "SUB_02-MC",
      tint: "#79c0ff", // Developer casual cyan
      bg: "#080d14",
      status: "SUSPECT",
      features: (
        <>
          {/* Casual developer silhouette: hoodie, messy hair */}
          <path
            d="M11 29 C11 23, 15 20, 20 20 C25 20, 29 23, 29 29 Z"
            fill="#1b2a3d"
          />
          <circle cx="20" cy="14" r="5.5" fill="#79c0ff" opacity="0.8" />
          {/* Hoodie / messy hair contour */}
          <path
            d="M13 13 C14 7, 26 7, 27 13 C26 10, 22 9, 20 9 C17 9, 14 10, 13 13 Z"
            fill="#0b121c"
          />
          <path
            d="M14 21 L16 29 M26 21 L24 29"
            stroke="#79c0ff"
            strokeWidth="0.75"
          />
        </>
      ),
    },
    sterling: {
      code: "SUB_03-JS",
      tint: "#ff5555", // Hostile / Defense red
      bg: "#140808",
      status: "PRIORITY_1",
      features: (
        <>
          {/* High-ranking exec / military suit silhouette: slicked-back hair, earpiece */}
          <path d="M10 29 L16 20 L20 23 L24 20 L30 29 Z" fill="#381515" />
          <polygon
            points="17,21 20,27 23,21 20,23"
            fill="#ff5555"
            opacity="0.7"
          />
          <circle cx="20" cy="13.5" r="5" fill="#ff7b72" opacity="0.8" />
          {/* Slick hair */}
          <path
            d="M14 13 C14 8, 26 8, 26 12 C24 10, 22 9, 20 9 C18 9, 15 10, 14 13 Z"
            fill="#1c0707"
          />
          {/* Surveillance target box on face */}
          <rect
            x="17"
            y="11"
            width="6"
            height="5"
            stroke="#ff3b3b"
            strokeWidth="0.5"
            strokeDasharray="1 1"
            fill="none"
          />
        </>
      ),
    },
    reyes: {
      code: "SUB_04-VR",
      tint: "#58a6ff", // Military tactical steel
      bg: "#0a1016",
      status: "ARMED",
      features: (
        <>
          {/* Tactical combat vest, crew cut military jawline */}
          <path d="M9 29 L13 21 L27 21 L31 29 Z" fill="#1a2b38" />
          <rect x="15" y="22" width="10" height="7" fill="#273e52" />
          <rect
            x="18"
            y="14"
            width="4"
            height="6"
            fill="#58a6ff"
            opacity="0.8"
          />
          <circle cx="20" cy="13" r="5" fill="#58a6ff" opacity="0.8" />
          {/* Military flat-top / buzzcut */}
          <path d="M14 11 L26 11 L26 13 L14 13 Z" fill="#0d1722" />
          {/* Facial scar silhouette */}
          <line
            x1="22"
            y1="12"
            x2="24"
            y2="16"
            stroke="#ff3b3b"
            strokeWidth="0.75"
          />
        </>
      ),
    },
    zero: {
      code: "SUB_00-ZR",
      tint: "#3fb950", // Ghost green / Resistance
      bg: "#07120a",
      status: "ROGUE_ARCH",
      features: (
        <>
          {/* Heavily encrypted / hooded glitch ghost */}
          <path
            d="M11 29 C11 20, 14 17, 20 17 C26 17, 29 20, 29 29 Z"
            fill="#132a19"
          />
          <path
            d="M13 18 C13 9, 27 9, 27 18 C25 21, 15 21, 13 18 Z"
            fill="#0a1a0f"
          />
          {/* Glowing visor / terminal eye slits */}
          <rect x="16" y="15" width="8" height="2" fill="#56d364" />
          <line
            x1="12"
            y1="21"
            x2="28"
            y2="21"
            stroke="#3fb950"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
        </>
      ),
    },
    operator: {
      code: "OPERATOR",
      tint: "#58a6ff",
      bg: "#0b121e",
      status: "LOCAL_TTY",
      features: (
        <>
          <circle cx="20" cy="14" r="5.5" fill="#58a6ff" opacity="0.6" />
          <path
            d="M12 28 C12 22, 16 20, 20 20 C24 20, 28 22, 28 28 Z"
            fill="#1a293d"
          />
          {/* Crosshair reticle overlay */}
          <line
            x1="10"
            y1="14"
            x2="30"
            y2="14"
            stroke="#58a6ff"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
          <line
            x1="20"
            y1="6"
            x2="20"
            y2="22"
            stroke="#58a6ff"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
        </>
      ),
    },
  };

  const current = metaMap[subject] || metaMap.operator;

  return (
    <div
      className={`relative select-none shrink-0 overflow-hidden border border-[#21262d] ${sizeMap[size]} ${className}`}
      style={{ backgroundColor: current.bg }}
    >
      {/* 1. Vector Monochromatic Thermal Silhouette SVG */}
      <svg viewBox="0 0 40 40" className="w-full h-full block">
        {/* Subtle coordinate crosshair in corner */}
        <line
          x1="2"
          y1="5"
          x2="6"
          y2="5"
          stroke={current.tint}
          strokeWidth="0.75"
        />
        <line
          x1="4"
          y1="3"
          x2="4"
          y2="7"
          stroke={current.tint}
          strokeWidth="0.75"
        />

        {/* Character Features */}
        {current.features}

        {/* Small corner status tick */}
        <polygon points="36,4 40,4 40,8" fill={current.tint} />
      </svg>

      {/* 2. Tactical Scanlines & Grain Overlay */}
      {showScanlines && (
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.8) 2px, rgba(0,0,0,0.8) 4px)`,
          }}
        />
      )}

      {/* 3. Small Subject Code Watermark in corner for larger sizes */}
      {size === "lg" && (
        <div className="absolute bottom-0.5 right-1 text-[8px] font-mono tracking-tighter text-[#8b949e] opacity-80">
          {current.code}
        </div>
      )}
    </div>
  );
};
