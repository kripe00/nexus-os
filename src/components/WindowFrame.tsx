import React, { useEffect, useRef, useState } from 'react';
import { Minus, X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { AppId } from '../types/game';
import { sound } from '../utils/sound';

interface WindowFrameProps {
  id: AppId;
  icon?: React.ReactNode;
  width?: string;
  height?: string;
  accentColor?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  id,
  icon,
  width = 'w-[680px]',
  height = 'h-[490px]',
  children,
}) => {
  const { windows, activeApp, focusApp, closeApp, minimizeApp, moveWindow } = useGame();
  const win = windows[id];
  const isActive = activeApp === id;
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  if (!win.isOpen || win.isMinimized) return null;

  useEffect(() => {
    sound.playWindowOpen();
  }, []);

  const handleClose = () => {
    sound.playWindowClose();
    closeApp(id);
  };

  const handleMinimize = () => {
    sound.playWindowClose();
    minimizeApp(id);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    focusApp(id);
    setDragging(true);
    dragOffset.current = {
      x: e.clientX - win.position.x,
      y: e.clientY - win.position.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveWindow(
        id,
        moveEvent.clientX - dragOffset.current.x,
        moveEvent.clientY - dragOffset.current.y
      );
    };

    const handleMouseUp = () => {
      setDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      onMouseDown={() => focusApp(id)}
      style={{
        left: win.position.x,
        top: win.position.y,
        zIndex: win.zIndex,
      }}
      className={`fixed ${width} ${height} max-w-[calc(100vw-340px)] max-h-[calc(100vh-64px)] bg-[#0b0d12] border animate-window-in ${
        isActive
          ? 'border-[#4a5870] shadow-[0_24px_70px_rgba(0,0,0,0.95)]'
          : 'border-[#1e232c] opacity-95'
      } flex flex-col overflow-hidden transition-colors`}
    >
      {/* Active Tactical HUD Corner Brackets */}
      {isActive && (
        <>
          <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#58a6ff] pointer-events-none z-30" />
          <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#58a6ff] pointer-events-none z-30" />
          <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#58a6ff] pointer-events-none z-30" />
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#58a6ff] pointer-events-none z-30" />
        </>
      )}

      {/* Clean Window Header */}
      <div
        onMouseDown={handleMouseDown}
        className={`h-9 px-3.5 flex items-center justify-between border-b select-none text-xs ${
          dragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${
          isActive
            ? 'bg-[#141820] text-[#e6edf3] border-[#282f3d] font-semibold'
            : 'bg-[#0e1116] text-[#6e7681] border-[#1e232c]'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {icon && (
            <span className={isActive ? 'text-[#58a6ff]' : 'text-[#6e7681]'}>{icon}</span>
          )}
          <span className="truncate">{win.title}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0" onMouseDown={(e) => e.stopPropagation()}>
          <button
            onClick={handleMinimize}
            title="Minimize"
            className="w-6 h-6 flex items-center justify-center text-[#8b949e] hover:text-white hover:bg-[#21262d] cursor-pointer transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleClose}
            title="Close"
            className="w-6 h-6 flex items-center justify-center text-[#8b949e] hover:bg-[#ff3b3b] hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* App Content */}
      <div className="flex-1 overflow-hidden flex flex-col bg-[#08090c] text-[#d4d7dc]">
        {children}
      </div>
    </div>
  );
};
