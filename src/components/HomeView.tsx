import React, { useState } from 'react';
import { ActiveTab, ExplorerState, Mission } from '../types';
import { 
  PixelPurple, 
  PixelAstronautHero,
  PixelStar,
  PixelEarth,
  PixelOrange,
  PixelTeal,
  PixelBlue
} from './PixelArtwork';
import { playSound } from '../utils/sound';
import { PixelAstronautHero3D, AstronautTheme } from './PixelAstronautHero3D';
import { FlightSimulator } from './FlightSimulator';
import { 
  Gamepad2, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface HomeProps {
  setActiveTab: (tab: ActiveTab) => void;
  state: ExplorerState;
  missions: Mission[];
  completeMission: (id: string) => void;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  triggerToast: (title: string, desc: string, icon?: string) => void;
}

// Highly stylized HUD Panel with custom clipped-corners, segmented borders, scanlines, and glowing lines
const HudFrame: React.FC<{
  color?: 'cyan' | 'purple' | 'yellow' | 'pink' | 'green';
  children: React.ReactNode;
  className?: string;
  childrenClassName?: string;
  title?: string;
  titleIcon?: React.ReactNode;
  badgeText?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  isLarge?: boolean;
}> = ({ color = 'purple', children, className = '', childrenClassName = '', title, titleIcon, badgeText, onClick, onMouseEnter, isLarge = false }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    updateSize();
    const observer = new ResizeObserver(() => updateSize());
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const strokeColor = 
    color === 'cyan' ? '#00f0ff' : 
    color === 'yellow' ? '#facc15' : 
    color === 'pink' ? '#ff007f' : 
    color === 'green' ? '#39ff14' : 
    '#a855f7';

  const innerStrokeColor = 
    color === 'cyan' ? 'rgba(0,240,255,0.25)' : 
    color === 'yellow' ? 'rgba(250,204,21,0.25)' : 
    color === 'pink' ? 'rgba(255,0,127,0.25)' : 
    color === 'green' ? 'rgba(57,255,20,0.25)' : 
    'rgba(168,85,247,0.25)';
  
  const colorMap = {
    cyan: {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      badgeBg: 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20',
      glow: 'shadow-[0_0_25px_rgba(0,240,255,0.22),inset_0_0_20px_rgba(0,240,255,0.08)]',
      hoverClass: 'hover-card-glitch-cyan',
      accent: 'bg-[#00f0ff]',
      accentAlt: 'bg-[#a855f7]'
    },
    purple: {
      text: 'text-purple-400',
      bg: 'bg-purple-600/10',
      badgeBg: 'bg-purple-500/10 text-purple-300 border border-purple-500/20',
      glow: 'shadow-[0_0_25px_rgba(168,85,247,0.22),inset_0_0_20px_rgba(168,85,247,0.08)]',
      hoverClass: 'hover-card-glitch-purple',
      accent: 'bg-[#a855f7]',
      accentAlt: 'bg-[#00f0ff]'
    },
    yellow: {
      text: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      badgeBg: 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20',
      glow: 'shadow-[0_0_25px_rgba(250,204,21,0.22),inset_0_0_20px_rgba(250,204,21,0.08)]',
      hoverClass: 'hover-card-glitch-yellow',
      accent: 'bg-[#facc15]',
      accentAlt: 'bg-[#00f0ff]'
    },
    pink: {
      text: 'text-pink-400',
      bg: 'bg-pink-500/10',
      badgeBg: 'bg-pink-500/10 text-pink-300 border border-pink-500/20',
      glow: 'shadow-[0_0_25px_rgba(255,0,127,0.25),inset_0_0_20px_rgba(255,0,127,0.09)]',
      hoverClass: 'hover-card-glitch-pink',
      accent: 'bg-[#ff007f]',
      accentAlt: 'bg-[#39ff14]'
    },
    green: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      badgeBg: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
      glow: 'shadow-[0_0_25px_rgba(57,255,20,0.25),inset_0_0_20px_rgba(57,255,20,0.09)]',
      hoverClass: 'hover-card-glitch-green',
      accent: 'bg-[#39ff14]',
      accentAlt: 'bg-[#ff007f]'
    }
  };

  const active = colorMap[color];
  const w = dimensions.width;
  const h = dimensions.height;

  const altStrokeColor = 
    color === 'cyan' ? '#a855f7' : 
    color === 'purple' ? '#00f0ff' : 
    color === 'yellow' ? '#00f0ff' : 
    color === 'pink' ? '#39ff14' : 
    '#ff007f';

  // Asymmetric clip-path corners
  const outerPath = w && h 
    ? `M 16 0.5 ` +
      `L ${w - 16} 0.5 ` +
      `L ${w - 0.5} 16 ` +
      `L ${w - 0.5} ${h * 0.25} ` +
      `L ${w + 3.5} ${h * 0.25} L ${w + 3.5} ${h * 0.25 + 16} L ${w - 0.5} ${h * 0.25 + 16} ` +
      `L ${w - 0.5} ${h * 0.65} ` +
      `L ${w - 4} ${h * 0.65} L ${w - 4} ${h * 0.65 + 12} L ${w - 0.5} ${h * 0.65 + 12} ` +
      `L ${w - 0.5} ${h - 16} ` +
      `L ${w - 16} ${h - 0.5} ` +
      `L 16 ${h - 0.5} ` +
      `L 0.5 ${h - 16} ` +
      `L 0.5 ${h * 0.75} ` +
      `L -3 ${h * 0.75} L -3 ${h * 0.75 + 16} L 0.5 ${h * 0.75 + 16} ` +
      `L 0.5 ${h * 0.35} ` +
      `L 4 ${h * 0.35} L 4 ${h * 0.35 + 12} L 0.5 ${h * 0.35 + 12} ` +
      `L 0.5 16 Z`
    : '';

  const innerPath = w && h 
    ? `M 18 3.5 ` +
      `L ${w - 18} 3.5 ` +
      `L ${w - 3.5} 18 ` +
      `L ${w - 3.5} ${h * 0.25 + 2} ` +
      `L ${w + 1.5} ${h * 0.25 + 2} L ${w + 1.5} ${h * 0.25 + 14} L ${w - 3.5} ${h * 0.25 + 14} ` +
      `L ${w - 3.5} ${h * 0.65 + 2} ` +
      `L ${w - 6} ${h * 0.65 + 2} L ${w - 6} ${h * 0.65 + 10} L ${w - 3.5} ${h * 0.65 + 10} ` +
      `L ${w - 3.5} ${h - 18} ` +
      `L ${w - 18} ${h - 3.5} ` +
      `L 18 ${h - 3.5} ` +
      `L 3.5 ${h - 18} ` +
      `L 3.5 ${h * 0.75 + 2} ` +
      `L -1.5 ${h * 0.75 + 2} L -1.5 ${h * 0.75 + 14} L 3.5 ${h * 0.75 + 14} ` +
      `L 3.5 ${h * 0.35 + 2} ` +
      `L 6 ${h * 0.35 + 2} L 6 ${h * 0.35 + 10} L 3.5 ${h * 0.35 + 10} ` +
      `L 3.5 18 Z`
    : '';

  const glitchPath = w && h 
    ? `M 16.5 1.5 ` +
      `L ${w - 15.5} 1.5 ` +
      `L ${w + 0.5} 17 ` +
      `L ${w + 0.5} ${h * 0.25 + 1} ` +
      `L ${w + 4.5} ${h * 0.25 + 1} L ${w + 4.5} ${h * 0.25 + 17} L ${w + 0.5} ${h * 0.25 + 17} ` +
      `L ${w + 0.5} ${h * 0.65 + 1} ` +
      `L ${w - 3} ${h * 0.65 + 1} L ${w - 3} ${h * 0.65 + 13} L ${w + 0.5} ${h * 0.65 + 13} ` +
      `L ${w + 0.5} ${h - 15} ` +
      `L ${w - 15.5} ${h + 0.5} ` +
      `L 16.5 ${h + 0.5} ` +
      `L 1.5 ${h - 15} ` +
      `L 1.5 ${h * 0.75 + 1} ` +
      `L -2 ${h * 0.75 + 1} L -2 ${h * 0.75 + 17} L 1.5 ${h * 0.75 + 17} ` +
      `L 1.5 ${h * 0.35 + 1} ` +
      `L 5 ${h * 0.35 + 1} L 5 ${h * 0.35 + 13} L 1.5 ${h * 0.35 + 13} ` +
      `L 1.5 17 Z`
    : '';

  return (
    <div 
      ref={containerRef}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`relative bg-[#04010e]/95 transition-all duration-300 ${active.hoverClass} ${active.glow} ${onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:brightness-110' : ''} group ${className || 'p-6 flex flex-col'}`}
      style={{
        clipPath: 'polygon(16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%, 0% 16px)'
      }}
    >
      {/* Dynamic Non-scaling Pixel-Perfect Glitch Borders */}
      {w > 0 && h > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible" fill="none">
          <path 
            d={glitchPath} 
            stroke={altStrokeColor} 
            strokeWidth="1.0" 
            className="opacity-45 animate-border-glitch pointer-events-none mix-blend-screen" 
          />
          <path 
            d={outerPath} 
            stroke={strokeColor} 
            strokeWidth="1.2" 
            className="opacity-75 group-hover:opacity-100 transition-opacity duration-300" 
          />
          <path 
            d={innerPath} 
            stroke={innerStrokeColor} 
            strokeWidth="0.8" 
          />
          <path 
            d={`M 30 0.5 L 65 0.5`} 
            stroke={altStrokeColor} 
            strokeWidth="2.2" 
            className="animate-[pulse_1.5s_infinite]" 
          />
          <path 
            d={`M ${w - 45} ${h - 0.5} L ${w - 15} ${h - 0.5}`} 
            stroke={altStrokeColor} 
            strokeWidth="2.2" 
            className="animate-pulse" 
          />
          <path d={`M -6 20 L 4 20`} stroke={strokeColor} strokeWidth="1.5" className="opacity-80" />
          <path d={`M ${w - 4} ${h - 40} L ${w + 6} ${h - 40}`} stroke={strokeColor} strokeWidth="1.5" className="opacity-80" />
          <path 
            d="M -3 10 L -3 -3 L 10 -3" 
            stroke={strokeColor} 
            strokeWidth="1.5" 
            className="opacity-90 group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] transition-transform duration-300" 
          />
          <path 
            d={`M ${w - 10} ${h + 3} L ${w + 3} ${h + 3} L ${w + 3} ${h - 10}`} 
            stroke={strokeColor} 
            strokeWidth="1.5" 
            className="opacity-90 group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-transform duration-300" 
          />
        </svg>
      )}

      <div 
        className="absolute left-[-4px] top-[28%] w-[8px] h-[3px] z-30 pointer-events-none animate-[pulse_1.2s_infinite]" 
        style={{
          backgroundColor: strokeColor,
          boxShadow: `0 0 8px ${strokeColor}`
        }}
      />
      <div 
        className="absolute right-[-4px] top-[18%] w-[8px] h-[3px] z-30 pointer-events-none animate-[pulse_1.8s_infinite]" 
        style={{
          backgroundColor: altStrokeColor,
          boxShadow: `0 0 8px ${altStrokeColor}`
        }}
      />
      <div 
        className="absolute left-[-2px] bottom-[35%] w-[4px] h-[12px] opacity-80 z-30 pointer-events-none" 
        style={{ backgroundColor: altStrokeColor }}
      />
      <div 
        className="absolute right-[-2px] bottom-[22%] w-[4px] h-[12px] opacity-80 z-30 pointer-events-none" 
        style={{ backgroundColor: strokeColor }}
      />

      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/0 via-purple-500/0 to-yellow-500/0 group-hover:from-cyan-500/5 group-hover:via-purple-500/5 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-0" />

      <div 
        className="absolute top-2 left-6 right-6 h-[1px] opacity-0 group-hover:opacity-100 group-hover:animate-[pulse_0.15s_infinite] pointer-events-none z-10" 
        style={{ backgroundColor: strokeColor }}
      />
      <div 
        className="absolute bottom-2 left-6 right-6 h-[1px] opacity-0 group-hover:opacity-100 group-hover:animate-[pulse_0.25s_infinite] pointer-events-none z-10" 
        style={{ backgroundColor: altStrokeColor }}
      />
      
      <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#00f0ff]/40 opacity-0 group-hover:opacity-100 group-hover:animate-ping pointer-events-none" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-purple-500/40 opacity-0 group-hover:opacity-100 group-hover:animate-ping pointer-events-none" />
      
      <div className="absolute bottom-1 right-2 text-[8px] font-mono opacity-5 group-hover:opacity-15 group-hover:text-cyan-400 transition-all duration-300 pointer-events-none select-none">
        0110 1001 0101
      </div>

      <div className="absolute inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent shadow-[0_0_6px_rgba(0,240,255,0.4)] pointer-events-none z-10 animate-cyber-scan" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,28,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(18,16,28,0.45)_1px,transparent_1px)] bg-[size:10px_10px] opacity-15 pointer-events-none" />

      {/* Header Panel Title - Scales appropriately with isLarge */}
      {title && (
        <div className={`flex items-center justify-between relative z-10 select-none w-full overflow-hidden ${isLarge ? 'mb-6 pb-4 border-b border-purple-950/40' : 'mb-5 pb-3 border-b border-purple-950/30'}`}>
          <div className="flex items-center gap-2 max-w-[88%]">
            {titleIcon && <span className={`${active.text} filter drop-shadow-[0_0_5px_currentColor] animate-pulse shrink-0 ${isLarge ? 'scale-125 mr-1' : ''}`}>{titleIcon}</span>}
            <h4 className={`font-pixel tracking-[0.1em] text-[#00f0ff] font-black uppercase whitespace-nowrap overflow-hidden text-ellipsis ${isLarge ? 'text-[10px] sm:text-xs md:text-sm' : 'text-[9px] sm:text-[10px]'}`}>
              {title}
            </h4>
          </div>
          {badgeText && (
            <span className={`font-pixel ${active.badgeBg} font-bold tracking-wider rounded-sm shrink-0 ml-1.5 ${isLarge ? 'text-[8px] sm:text-[9px] md:text-[10px] px-2 py-0.5' : 'text-[7.5px] sm:text-[8px] px-1.5 py-0.5'}`}>
              {badgeText}
            </span>
          )}
        </div>
      )}

      <div className={`relative z-10 flex-1 ${childrenClassName || 'flex flex-col justify-between h-full'}`}>
        {children}
      </div>
    </div>
  );
};

export const HomeView: React.FC<HomeProps> = ({
  setActiveTab,
  state,
  completeMission,
  addXp,
  addCoins,
  triggerToast,
}) => {
  const [showSimulator, setShowSimulator] = useState(false);
  const [isLaunchingNext, setIsLaunchingNext] = useState(false);
  const [activeTheme, setActiveTheme] = useState<AstronautTheme>('retro');

  const themesList: {
    id: AstronautTheme;
    label: string;
    shortName: string;
    badge: string;
    desc: string;
  }[] = [
    { id: 'neon_grid', label: 'NEON GRID ARENA', shortName: 'GRID', badge: '01', desc: 'Concentric purple loop platforms with receding vector grids' },
    { id: 'nebula', label: 'DEEP SPACE NEBULA', shortName: 'NEBULA', badge: '02', desc: 'Floating weightlessly above a craggy crater landscape' },
    { id: 'hologram', label: 'HOLOGRAPHIC PLATFORM', shortName: 'HOLOPAD', badge: '03', desc: 'Rising vertical cyan scanner cylinders and laser points' },
    { id: 'retro', label: 'RETRO WIREFRAME', shortName: 'RETRO', badge: '04', desc: '80s Outrun mountainous grid valley with striped synth sunset' },
    { id: 'floating', label: 'FLOATING IN SPACE', shortName: 'FLOAT', badge: '05', desc: 'Zero-G drifting posture surrounded by rotating detailed rocks' },
    { id: 'terminal', label: 'TERMINAL HUD', shortName: 'HUD', badge: '06', desc: 'Tactical system targeting matrices and rotating radar sweep loops' },
  ];

  const destinations: { id: ActiveTab; label: string; planet: React.ReactNode; difficulty: number; color: 'cyan' | 'pink' | 'green' | 'yellow' | 'purple' }[] = [
    { id: 'about', label: 'ABOUT MISSION', planet: <PixelEarth />, difficulty: 1, color: 'cyan' },
    { id: 'events', label: 'EVENTS ORBIT', planet: <PixelOrange />, difficulty: 4, color: 'pink' },
    { id: 'gallery', label: 'ARCHIVE CLOUD', planet: <PixelTeal />, difficulty: 3, color: 'green' },
    { id: 'sponsors', label: 'SPONSOR BELT', planet: <PixelBlue />, difficulty: 2, color: 'yellow' },
    { id: 'contact', label: 'BEACON FEED', planet: <PixelPurple />, difficulty: 5, color: 'purple' }
  ];

  const handlePressStart = () => {
    playSound('warp', state.soundEnabled);
    addXp(50);
    setActiveTab('about');
  };

  const handleLaunchNext = () => {
    playSound('laser', state.soundEnabled);
    setIsLaunchingNext(true);
    setTimeout(() => {
      setActiveTab('events');
      setIsLaunchingNext(false);
    }, 1200);
  };

  const handleDestinationClick = (tabId: ActiveTab) => {
    playSound('warp', state.soundEnabled);
    setActiveTab(tabId);
  };

  return (
    <div className="w-full relative px-4 py-6 md:py-10 pb-20 md:pb-32 lg:pb-44 select-none animate-[fadeIn_0.5s_ease-out] overflow-visible">
      
      {/* Scanner grid line effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.4) 50%, transparent 50%), linear-gradient(90deg, rgba(34, 211, 238, 0.4) 50%, transparent 50%)', backgroundSize: '6px 6px' }} />

      {/* Main 3-Column HUD Grid - beautifully expanded side boxes with fixed widths and fluid center to prevent clipping */}
      <div className="w-full max-w-[1460px] mx-auto grid grid-cols-1 lg:grid-cols-[290px_1fr_290px] xl:grid-cols-[325px_1fr_325px] 2xl:grid-cols-[365px_1fr_365px] gap-4 relative z-10 items-start justify-center px-2">

        {/* 1. Left Side Panel: MISSION STATUS */}
        <div className="w-full flex flex-col lg:mt-[220px] xl:mt-[260px] 2xl:mt-[310px] lg:translate-x-[75px] xl:translate-x-[110px] 2xl:translate-x-[150px] transition-all duration-500">
          <HudFrame 
            color="purple" 
            title="MISSION STATUS" 
            isLarge={true}
            titleIcon={
              <svg className="w-4 h-4 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <line x1="12" y1="1" x2="12" y2="23" />
                <line x1="1" y1="12" x2="23" y2="12" />
              </svg>
            }
            badgeText="SECURE"
            className="p-5 sm:p-6 flex flex-col lg:h-[480px] xl:h-[500px] 2xl:h-[530px] justify-between"
            childrenClassName="flex flex-col gap-4 h-full justify-between"
          >
            {/* PROGRESS SECTION */}
            <div className="mb-4">
              <div className="flex items-center justify-between font-pixel text-[13px] sm:text-[14px] text-purple-300 font-bold mb-2.5">
                <span className="tracking-wider">PROGRESS</span>
                <span className="text-cyan-400 font-black text-sm sm:text-base">5/7</span>
              </div>
              
              {/* Progress bar grid matching mockup precisely */}
              <div className="flex items-center gap-2">
                {Array.from({ length: 7 }).map((_, idx) => {
                  const isCompleted = idx < 5;
                  return (
                    <div 
                      key={idx}
                      className={`h-6.5 flex-1 transition-all duration-300 rounded-sm ${
                        isCompleted 
                          ? 'bg-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.75)]' 
                          : 'bg-[#060113] border border-purple-900/55'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* STAR COINS HUD BOX (High Fidelity Replication, Doubled Size) */}
            <div 
              className="mb-4 bg-[#050111]/90 p-4 sm:p-5 border border-purple-500/20 hover:border-cyan-400/40 rounded-lg flex items-center gap-3.5 sm:gap-4.5 relative overflow-hidden shadow-[inset_0_0_12px_rgba(168,85,247,0.12)] group/starbox transition-all duration-300"
            >
              <div className="absolute left-0 top-[25%] w-[2px] h-[35%] bg-cyan-400 opacity-70" />
              <div className="absolute right-0 top-[25%] w-[2px] h-[35%] bg-purple-500 opacity-70" />

              {/* Gold Star Circle */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-yellow-500/10 border border-yellow-500/40 flex items-center justify-center shadow-[0_0_16px_rgba(250,204,21,0.3)] shrink-0 z-10">
                <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400 fill-yellow-400">
                  <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
                </svg>
              </div>
              <div className="z-10 min-w-0">
                <span className="font-pixel text-[11px] sm:text-[12px] text-yellow-400 tracking-[0.05em] block font-black truncate">STAR COINS</span>
                <span className="font-pixel text-3xl sm:text-4xl text-yellow-400 font-black block leading-none mt-1.5 drop-shadow-[0_0_10px_rgba(250,204,21,0.55)]">
                  777
                </span>
              </div>
              <span className="absolute bottom-1 right-2.5 font-mono text-[8px] sm:text-[9px] text-purple-600/60 uppercase">SYS_COIN</span>
            </div>

            {/* RANK HUD BOX (High Fidelity Replication, Doubled Size) */}
            <div 
              className="mb-4 bg-[#050111]/90 p-4 sm:p-5 border border-purple-500/20 hover:border-cyan-400/40 rounded-lg flex items-center gap-3.5 sm:gap-4.5 relative overflow-hidden shadow-[inset_0_0_12px_rgba(168,85,247,0.12)] group/rankbox transition-all duration-300"
            >
              <div className="absolute left-0 top-[25%] w-[2px] h-[35%] bg-purple-400 opacity-70" />
              <div className="absolute right-0 top-[25%] w-[2px] h-[35%] bg-cyan-500 opacity-70" />

              {/* Shield with Star Icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_16px_rgba(34,211,238,0.3)] shrink-0 z-10">
                <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400 fill-none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polygon points="12,7 13.5,10.5 17,10.5 14,12.5 15,16 12,14 9,16 10,12.5 7,10.5 10.5,10.5" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <div className="z-10 min-w-0">
                <span className="font-pixel text-[11px] sm:text-[12px] text-cyan-400 tracking-[0.05em] block font-black truncate">RANK</span>
                <span className="font-pixel text-lg sm:text-xl text-cyan-400 font-bold block mt-1 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.45)] truncate">
                  EXPLORER
                </span>
              </div>
              <span className="absolute bottom-1 right-2.5 font-mono text-[8px] sm:text-[9px] text-purple-600/60 uppercase">SYS_RANK</span>
            </div>

            {/* Low-profile tech footer */}
            <div className="mt-auto pt-4.5 border-t border-purple-950/30 flex items-center justify-between font-mono text-[11px] sm:text-[12.5px] text-purple-500/70">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping inline-block" />
                SECURE_CONN: ON
              </span>
              <span>L_INDEX: 12.04</span>
            </div>
          </HudFrame>
        </div>

        {/* 2. Center Column: HERO HUD */}
        <div className="w-full flex flex-col items-center justify-start gap-5 md:gap-7 min-h-[480px] relative px-1 py-5">
          
          {showSimulator ? (
            <div className="w-full flex flex-col items-center gap-4 animate-[fadeIn_0.3s_ease-out] relative z-20">
              <div className="w-full flex items-center justify-between bg-[#04010d] border border-purple-900/60 rounded p-3 mb-1">
                <span className="font-pixel text-[9px] text-purple-300 font-bold tracking-wider">ACM STARFLEET SIMULATOR</span>
                <button
                  onClick={() => {
                    playSound('click', state.soundEnabled);
                    setShowSimulator(false);
                  }}
                  className="font-pixel text-[9px] bg-red-950/40 hover:bg-red-900/60 border border-red-700/60 text-red-400 hover:text-white px-3.5 py-2 rounded cursor-pointer transition-all font-bold tracking-widest"
                >
                  ◀ COCKPIT EXIT
                </button>
              </div>

              <FlightSimulator 
                state={state}
                addCoins={addCoins}
                addXp={addXp}
                triggerToast={triggerToast}
              />
            </div>
          ) : (
            <>
              {/* Hero Title & Slogan */}
              <div className="text-center w-full mt-6 relative z-10">
                <h1 className="font-pixel text-6xl sm:text-7xl md:text-8xl lg:text-7xl xl:text-8xl 2xl:text-9xl text-yellow-400 select-none tracking-[0.05em] font-black leading-none relative inline-block drop-shadow-[0_0_30px_rgba(250,204,21,0.9)]">
                  <span className="relative z-10">ELICIT'26</span>
                  
                  {/* Glitch Slices Layer 1 */}
                  <span className="absolute inset-0 text-red-500 opacity-70 -z-10 select-none pointer-events-none animate-glitch-1" style={{ clipPath: 'inset(40% 0 30% 0)' }}>
                    ELICIT'26
                  </span>
                  {/* Glitch Slices Layer 2 */}
                  <span className="absolute inset-0 text-cyan-400 opacity-70 -z-10 select-none pointer-events-none animate-glitch-2" style={{ clipPath: 'inset(10% 0 80% 0)' }}>
                    ELICIT'26
                  </span>
                </h1>
                
                {/* Slogan with clean, neon teal glow */}
                <p className="font-pixel text-[9px] sm:text-xs text-[#00f0ff] tracking-[0.25em] mt-5 font-black uppercase drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">
                  EXPLORE. INNOVATE. ELEVATE.
                </p>
              </div>
 
              {/* Action Buttons Centered */}
              <div className="z-10 w-full flex flex-col items-center gap-4 my-2">
                
                {/* Primary Button: PRESS START (Yellow chamfered border with glitch bars) */}
                <button
                  onClick={handlePressStart}
                  className="group/start font-pixel text-xs sm:text-sm text-yellow-400 hover:text-black border border-yellow-400 bg-yellow-500/5 hover:bg-yellow-400 transition-all duration-350 px-14 py-4 cursor-pointer relative shadow-[0_0_12px_rgba(250,204,21,0.15)] hover:shadow-[0_0_25px_rgba(250,204,21,0.6)]"
                  style={{
                    clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)'
                  }}
                >
                  <span className="flex items-center gap-2.5 tracking-[0.2em] font-black">
                    PRESS START <ChevronRight size={14} className="group-hover/start:translate-x-1.5 transition-transform" />
                  </span>
                  
                  {/* Genuine Retro HUD Border Glitch Accent Lines extending out left & right */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-[-16px] w-4 h-[1px] bg-yellow-400 opacity-80 group-hover/start:w-6 transition-all" />
                  <div className="absolute top-1/2 -translate-y-1/2 right-[-16px] w-4 h-[1px] bg-yellow-400 opacity-80 group-hover/start:w-6 transition-all" />
                </button>

                {/* Secondary Button: GAME DRILL */}
                <button
                  onClick={() => {
                    playSound('warp', state.soundEnabled);
                    setShowSimulator(true);
                  }}
                  className="font-pixel text-[10px] text-cyan-400 hover:text-white border border-purple-800/80 hover:border-cyan-400 bg-purple-950/15 hover:bg-cyan-500/10 px-8 py-3 rounded-full cursor-pointer transition-all duration-300 flex items-center gap-2.5 font-bold tracking-[0.2em] shadow-[0_0_10px_rgba(168,85,247,0.1)] hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                >
                  <Gamepad2 size={13} className="animate-pulse text-cyan-400" />
                  <span>GAME DRILL</span>
                </button>
              </div>

              {/* Floating Astronaut with theme-specific backdrop gradients */}
              <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[480px] flex flex-col items-center justify-center overflow-visible z-10 -mt-4 sm:-mt-6 mb-2">
                {activeTheme === 'nebula' && (
                  <div className="absolute w-[240px] h-[240px] bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.18)_0%,rgba(139,92,246,0.18)_45%,transparent_70%)] animate-pulse pointer-events-none blur-xl z-0" />
                )}
                {activeTheme === 'retro' && (
                  <div className="absolute w-[280px] h-[200px] bg-gradient-to-t from-orange-500/10 via-fuchsia-500/15 to-transparent pointer-events-none blur-md z-0" />
                )}
                {activeTheme === 'hologram' && (
                  <div className="absolute w-[240px] h-[240px] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.18)_0%,transparent_70%)] pointer-events-none blur-lg z-0" />
                )}
                {activeTheme === 'terminal' && (
                  <div className="absolute w-[240px] h-[240px] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.12)_0%,transparent_75%)] pointer-events-none blur-lg z-0" />
                )}

                {/* Micro Terminal HUD overlays pinned to outer sides of the center container */}
                {activeTheme === 'terminal' && (
                  <>
                    <div className="absolute left-[-20px] sm:left-[-10px] xl:left-[10px] top-[15%] font-mono text-[7px] text-green-500/80 tracking-widest flex flex-col gap-1 pointer-events-none select-none z-30 bg-black/80 px-2.5 py-1.5 border border-green-500/20 rounded">
                      <span>&gt; X-TRACK: 40.09</span>
                      <span>&gt; Y-PITCH: ACTIVE</span>
                      <span>&gt; RADAR_SWEEP_HZ: 42</span>
                      <span>&gt; COCKPIT_LOCK: TRUE</span>
                    </div>
                    <div className="absolute right-[-20px] sm:right-[-10px] xl:right-[10px] bottom-[18%] font-mono text-[7px] text-green-500/80 tracking-widest flex flex-col gap-1 pointer-events-none select-none text-right z-30 bg-black/80 px-2.5 py-1.5 border border-green-500/20 rounded">
                      <span>&gt; SYS_LAT: 0.12ms</span>
                      <span>&gt; RESOLUTION: 4K</span>
                      <span>&gt; GRAPHICS: SHADER_V2</span>
                      <span>&gt; AREA: GREEN_ZONE</span>
                    </div>
                  </>
                )}

                {activeTheme === 'hologram' && (
                  <>
                    <div className="absolute left-6 top-[20%] w-[1px] h-[55%] bg-cyan-400/30 animate-pulse pointer-events-none z-30" />
                    <div className="absolute right-6 top-[20%] w-[1px] h-[55%] bg-cyan-400/30 animate-pulse pointer-events-none z-30" />
                  </>
                )}

                <div className="absolute z-20">
                  <PixelAstronautHero3D 
                    className="w-80 h-80 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] lg:w-[460px] lg:h-[460px]" 
                    theme={activeTheme}
                  />
                </div>
              </div>
            </>
          )}

        </div>

        {/* 3. Right Side Panel: NEXT MISSION (Doubled Sizing) */}
        <div className="w-full flex flex-col lg:mt-[220px] xl:mt-[260px] 2xl:mt-[310px] lg:-translate-x-[75px] xl:-translate-x-[110px] 2xl:-translate-x-[150px] transition-all duration-500">
          <HudFrame 
            color="cyan" 
            title="NEXT MISSION" 
            isLarge={true}
            titleIcon={<Sparkles size={16} className="animate-pulse" />}
            badgeText="EVENT_0x2"
            className="p-5 sm:p-6 flex flex-col lg:h-[480px] xl:h-[500px] 2xl:h-[530px] justify-between"
            childrenClassName="flex flex-col gap-4 h-full justify-between"
          >
            <div className="absolute top-4 right-16 w-5 h-5 pointer-events-none opacity-80 scale-75">
              <PixelPurple />
            </div>

            {/* Ringed Planet with Ring glow */}
            <div className="w-28 h-28 mx-auto my-2 flex items-center justify-center animate-[spin_20s_linear_infinite] relative group shrink-0">
              <PixelPurple />
              <div className="absolute inset-0 border border-cyan-500/20 rounded-full animate-ping pointer-events-none" />
              <div className="absolute -inset-2 border border-purple-500/10 rounded-full pointer-events-none" />
            </div>

            <div className="text-center px-1">
              <span className="font-pixel text-[11px] sm:text-[12px] text-yellow-400 block tracking-[0.12em] font-black uppercase">UPCOMING CHALLENGES</span>
              <p className="font-mono text-xs sm:text-[12.5px] text-purple-300 font-medium mt-1.5 leading-relaxed">
                Discover upcoming coding challenges
              </p>
            </div>

            {/* EVENT SPECIFICATIONS BOX (High Fidelity Replication to balance the left side) */}
            <div 
              className="bg-[#050111]/90 p-3.5 sm:p-4 border border-cyan-500/20 hover:border-yellow-400/40 rounded-lg flex flex-col gap-2 relative overflow-hidden shadow-[inset_0_0_12px_rgba(6,182,212,0.12)] group/specbox transition-all duration-300"
            >
              <div className="absolute left-0 top-[25%] w-[2px] h-[35%] bg-yellow-400 opacity-70" />
              <div className="absolute right-0 top-[25%] w-[2px] h-[35%] bg-cyan-400 opacity-70" />

              <div className="flex items-center justify-between border-b border-cyan-950/40 pb-1.5">
                <span className="font-pixel text-[9px] sm:text-[10px] text-cyan-400 font-bold tracking-wider">SECTOR SCAN</span>
                <span className="font-mono text-[8px] sm:text-[9px] text-purple-400 font-semibold">0x26_MUJ_ACM</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-left pt-0.5">
                <div>
                  <span className="font-pixel text-[7.5px] sm:text-[8px] text-purple-400 block">DESTINATION</span>
                  <span className="font-mono text-[9px] sm:text-[10px] text-yellow-400 font-bold break-all">GRID_ARENA_26</span>
                </div>
                <div>
                  <span className="font-pixel text-[7.5px] sm:text-[8px] text-purple-400 block">SECTOR RANK</span>
                  <span className="font-mono text-[9px] sm:text-[10px] text-cyan-400 font-bold break-all">CLASS_A_ELITE</span>
                </div>
              </div>
              <span className="absolute bottom-1 right-2.5 font-mono text-[7px] text-cyan-600/60 uppercase">SYS_TELEMETRY</span>
            </div>

            <div className="pt-2 border-t border-cyan-950/30 w-full">
              <button
                onClick={handleLaunchNext}
                disabled={isLaunchingNext}
                className="w-full font-pixel text-[11px] sm:text-[12px] text-[#00f0ff] hover:text-white border border-[#00f0ff] bg-cyan-950/10 hover:bg-cyan-400/15 transition-all duration-200 py-2.5 px-3 flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.15)] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] font-black uppercase tracking-[0.1em]"
                style={{
                  clipPath: 'polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)'
                }}
              >
                <span>{isLaunchingNext ? 'LAUNCHING...' : 'VIEW EVENTS'}</span>
                <ChevronRight size={14} className="text-cyan-400" />
              </button>
            </div>
          </HudFrame>
        </div>

      </div>

      {/* Bottom Panel: CHOOSE YOUR DESTINATION Row */}
      <div className="max-w-[1300px] mx-auto mt-12 relative z-10 bg-[#070114]/60 border-4 border-purple-900 rounded p-6 sm:p-8 shadow-2xl">
        <h2 className="font-pixel text-center text-sm sm:text-base text-cyan-400 tracking-[0.2em] mb-6 flex items-center justify-center gap-2 uppercase">
          🚀 CHOOSE YOUR DESTINATION 🚀
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {destinations.map((dest, index) => {
            return (
              <HudFrame
                key={dest.id}
                color={dest.color}
                onClick={() => handleDestinationClick(dest.id)}
                onMouseEnter={() => playSound('hover', state.soundEnabled)}
                className="cursor-pointer relative overflow-hidden h-full flex flex-col group p-0"
                childrenClassName="flex flex-col items-center justify-between text-center p-4 h-full w-full"
              >
                <div className={`w-18 h-18 sm:w-20 sm:h-20 my-2 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center animate-planet-${(index % 5) + 1}`}>
                  {dest.planet}
                </div>

                <span className="font-pixel text-[11px] sm:text-[12px] md:text-[13px] text-purple-200 group-hover:text-yellow-400 tracking-wider font-semibold uppercase transition-colors duration-150 mt-1">
                  {dest.label}
                </span>

                <div className="flex items-center gap-0.5 mt-2">
                  {Array.from({ length: 5 }).map((_, sIdx) => (
                    <PixelStar 
                      key={sIdx} 
                      filled={sIdx < dest.difficulty} 
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    />
                  ))}
                </div>

                <div className="mt-3.5 w-8 h-8 sm:w-9 sm:h-9 bg-purple-950/60 border border-purple-700 hover:border-yellow-400 hover:bg-yellow-400 hover:text-black rounded flex items-center justify-center text-xs text-purple-300 font-bold transition-all duration-200">
                  ▶
                </div>
              </HudFrame>
            );
          })}
        </div>
      </div>

    </div>
  );
};