import React, { useEffect, useRef } from "react";
import { sound } from "../utils/sound";

export interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export interface ContextMenuGroup {
  header?: string;
  items: ContextMenuItem[];
}

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  groups: ContextMenuGroup[];
}

interface ContextMenuProps {
  menu: ContextMenuState;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ menu, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu.isOpen) return;

    sound.playContextMenuOpen();

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleWindowResize = () => {
      onClose();
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("scroll", handleWindowResize, true);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("scroll", handleWindowResize, true);
    };
  }, [menu.isOpen, onClose]);

  if (!menu.isOpen || menu.groups.length === 0) return null;

  // Smart Viewport clamping so menu is never outside screen
  const menuWidth = 240;
  const menuHeight = menu.groups.reduce(
    (acc, g) => acc + (g.header ? 22 : 0) + g.items.length * 30 + 8,
    16,
  );
  const clampedX = Math.min(
    Math.max(8, menu.x),
    window.innerWidth - menuWidth - 8,
  );
  const clampedY = Math.min(
    Math.max(8, menu.y),
    window.innerHeight - menuHeight - 8,
  );

  return (
    <div
      ref={menuRef}
      style={{ left: clampedX, top: clampedY }}
      className="fixed z-[9999] w-60 bg-[#0c0f16] border border-[#2b3545] p-1 shadow-[0_12px_45px_rgba(0,0,0,0.95)] select-none text-xs font-mono animate-window-in"
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {menu.groups.map((group, gIdx) => (
        <div
          key={gIdx}
          className={gIdx > 0 ? "border-t border-[#1a212d] pt-1 mt-1" : ""}
        >
          {group.header && (
            <div className="px-2.5 py-1 text-[9px] uppercase tracking-wider text-[#6e7681] font-bold">
              {group.header}
            </div>
          )}
          <div className="space-y-0.5">
            {group.items.map((item, iIdx) => (
              <button
                key={iIdx}
                disabled={item.disabled}
                onClick={() => {
                  sound.playClick();
                  item.onClick();
                  onClose();
                }}
                className={`w-full px-2 py-1.5 flex items-center justify-between text-left transition-colors cursor-pointer text-xs ${
                  item.disabled
                    ? "opacity-40 cursor-not-allowed text-[#6e7681]"
                    : item.danger
                      ? "text-[#ff5555] hover:bg-[#ff3b3b]/15 hover:text-[#ff7b72]"
                      : "text-[#c9d1d9] hover:bg-[#161c26] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {item.icon && (
                    <span
                      className={`w-3.5 h-3.5 shrink-0 ${
                        item.danger ? "text-[#ff5555]" : "text-[#58a6ff]"
                      }`}
                    >
                      {item.icon}
                    </span>
                  )}
                  <span className="truncate">{item.label}</span>
                </div>
                {item.shortcut && (
                  <span className="text-[9px] font-mono text-[#6e7681] ml-2 shrink-0">
                    {item.shortcut}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
