"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ExplorerState } from '../types';
import { playSound } from '../utils/sound';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Mail } from 'lucide-react';
import {
  DEV_TEAM_MEMBERS,
  DEV_TECH_STACK,
  DEV_ACHIEVEMENTS,
  type DevTeamMember,
  type DevTechItem,
  type DevAchievement,
} from '../devTeamData';

// ─── Inline brand SVG icons ──────────────────────────────────────────────────
const GithubIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface DevTeamProps { state: ExplorerState; }

const MATRIX_CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ><{}[]|/\\=+-_*&#@$%^!~';

// ═══════════════════════════════════════════════════════════════════════════════
// EFFECT 1: WARP SPEED STARFIELD CANVAS — 3D perspective stars with trail effect
// ═══════════════════════════════════════════════════════════════════════════════
const WarpStarfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    const stars = Array.from({ length: 120 }, () => ({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * 1000,
      color: ['#ffffff', '#22d3ee', '#a855f7', '#facc15', '#f472b6'][Math.floor(Math.random() * 5)],
    }));

    const render = () => {
      ctx.fillStyle = 'rgba(7, 1, 20, 0.15)';
      ctx.fillRect(0, 0, w, h);

      stars.forEach((s) => {
        const pz = s.z;
        s.z -= 1.5;
        if (s.z <= 0) { s.z = 1000; s.x = (Math.random() - 0.5) * 2000; s.y = (Math.random() - 0.5) * 2000; }

        const sx = (s.x / s.z) * 200 + w / 2;
        const sy = (s.y / s.z) * 200 + h / 2;
        const px = (s.x / pz) * 200 + w / 2;
        const py = (s.y / pz) * 200 + h / 2;
        const size = (1 - s.z / 1000) * 2;

        ctx.strokeStyle = s.color;
        ctx.lineWidth = size;
        ctx.globalAlpha = (1 - s.z / 1000) * 0.6;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      animId = requestAnimationFrame(render);
    };

    const handleResize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    window.addEventListener('resize', handleResize);
    render();

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', handleResize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" aria-hidden="true" />;
};

// ═══════════════════════════════════════════════════════════════════════════════
// EFFECT 2: SYNTHWAVE RETRO GRID FLOOR — Perspective neon grid scrolling upward
// ═══════════════════════════════════════════════════════════════════════════════
const SynthwaveGrid: React.FC = () => (
  <div className="absolute bottom-0 left-0 right-0 h-[35vh] overflow-hidden pointer-events-none opacity-20" aria-hidden="true">
    <div
      className="absolute inset-0"
      style={{
        perspective: '300px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '-50%',
          width: '200%',
          height: '200%',
          backgroundImage:
            'linear-gradient(to right, rgba(168,85,247,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(168,85,247,0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          transform: 'rotateX(60deg)',
          animation: 'devteam-grid-scroll 4s linear infinite',
        }}
      />
    </div>
    {/* Horizon glow */}
    <div className="absolute top-[38%] left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_30px_rgba(168,85,247,0.5)]" />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// EFFECT 3: SHOOTING STARS — Random meteors streaking across
// ═══════════════════════════════════════════════════════════════════════════════
const ShootingStars: React.FC = () => {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; angle: number; delay: number }[]>([]);

  useEffect(() => {
    const createStar = () => ({
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 40,
      angle: Math.random() * 30 + 15,
      delay: 0,
    });

    const interval = setInterval(() => {
      setStars((prev) => {
        const next = [...prev, createStar()].slice(-5);
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute h-[1px]"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: '80px',
            background: 'linear-gradient(90deg, transparent, #22d3ee, #ffffff)',
            transform: `rotate(${s.angle}deg)`,
          }}
          initial={{ opacity: 0, x: 0, scaleX: 0 }}
          animate={{ opacity: [0, 1, 0], x: 200, scaleX: [0, 1, 0.5] }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          onAnimationComplete={() => setStars((prev) => prev.filter((ss) => ss.id !== s.id))}
        />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EFFECT 4: FLOATING PARTICLES + ENERGY ORBS — Ambient space dust
// ═══════════════════════════════════════════════════════════════════════════════
const FloatingParticles: React.FC = () => {
  const particles = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 0.5,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.1,
      color: ['#a855f7', '#22d3ee', '#facc15', '#f472b6', '#34d399'][Math.floor(Math.random() * 5)],
    })),
    []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.opacity,
            boxShadow: p.size > 2 ? `0 0 ${p.size * 3}px ${p.color}` : 'none',
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() > 0.5 ? 20 : -20, 0],
            opacity: [p.opacity, p.opacity * 1.8, p.opacity],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EFFECT 5: FULL-PAGE SCAN LINE — Moves top to bottom across entire page
// ═══════════════════════════════════════════════════════════════════════════════
const PageScanLine: React.FC = () => (
  <motion.div
    className="absolute left-0 right-0 h-[2px] pointer-events-none z-20"
    style={{
      background: 'linear-gradient(90deg, transparent 5%, rgba(34,211,238,0.15) 20%, rgba(34,211,238,0.3) 50%, rgba(34,211,238,0.15) 80%, transparent 95%)',
      boxShadow: '0 0 20px rgba(34,211,238,0.2)',
    }}
    animate={{ top: ['0%', '100%'] }}
    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
    aria-hidden="true"
  />
);

// ═══════════════════════════════════════════════════════════════════════════════
// EFFECT 6: RADAR SWEEP — Rotating radar effect in background
// ═══════════════════════════════════════════════════════════════════════════════
const RadarSweep: React.FC = () => (
  <div className="absolute top-[15%] right-[5%] w-48 h-48 pointer-events-none opacity-[0.07]" aria-hidden="true">
    {/* Concentric rings */}
    {[1, 2, 3, 4].map((r) => (
      <div
        key={r}
        className="absolute rounded-full border border-cyan-400"
        style={{
          width: r * 48,
          height: r * 48,
          top: '50%',
          left: '50%',
          marginLeft: -(r * 24),
          marginTop: -(r * 24),
        }}
      />
    ))}
    {/* Sweep line */}
    <motion.div
      className="absolute top-0 left-1/2 w-[1px] h-1/2 origin-bottom"
      style={{ background: 'linear-gradient(to top, rgba(34,211,238,0.6), transparent)' }}
      animate={{ rotate: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
    />
    {/* Center dot */}
    <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// EFFECT 7: BINARY DATA STREAMS — Vertical scrolling data columns
// ═══════════════════════════════════════════════════════════════════════════════
const DataStreams: React.FC = () => {
  const columns = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      speed: Math.random() * 20 + 15,
      opacity: Math.random() * 0.06 + 0.02,
      chars: Array.from({ length: 20 }, () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]).join('\n'),
    })),
    []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {columns.map((col) => (
        <motion.div
          key={col.id}
          className="absolute font-mono text-[10px] text-emerald-400 whitespace-pre leading-tight select-none"
          style={{ left: `${col.x}%`, opacity: col.opacity }}
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: col.speed, repeat: Infinity, ease: 'linear' }}
        >
          {col.chars}
        </motion.div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EFFECT 8: GLOWING ENERGY ORB — Large animated orb behind hero section
// ═══════════════════════════════════════════════════════════════════════════════
const EnergyOrb: React.FC = () => (
  <div className="absolute top-[5%] left-1/2 -translate-x-1/2 pointer-events-none" aria-hidden="true">
    <motion.div
      className="w-64 h-64 rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, rgba(34,211,238,0.06) 40%, transparent 70%)',
        filter: 'blur(40px)',
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.6, 1, 0.6],
      }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* Inner bright core */}
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(168,85,247,0.5) 0%, transparent 70%)',
        filter: 'blur(8px)',
      }}
      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// EFFECT 9: HUD FRAME OVERLAY — Corner brackets + data readouts for the page
// ═══════════════════════════════════════════════════════════════════════════════
const HudOverlay: React.FC = () => (
  <div className="absolute inset-4 pointer-events-none z-10" aria-hidden="true">
    {/* Corner brackets */}
    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-800/30" />
    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-800/30" />
    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-800/30" />
    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-800/30" />
    {/* Top-left data readout */}
    <div className="absolute top-10 left-2 flex flex-col gap-1">
      <motion.span
        className="font-mono text-[7px] text-cyan-800/40 tracking-[0.3em]"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        SECTOR_7G
      </motion.span>
      <span className="font-mono text-[7px] text-purple-800/30 tracking-widest">LAT 26.8°N</span>
    </div>
    {/* Top-right data readout */}
    <div className="absolute top-10 right-2 flex flex-col gap-1 items-end">
      <motion.span
        className="font-mono text-[7px] text-cyan-800/40 tracking-[0.3em]"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        CREW_DB_ACTIVE
      </motion.span>
      <span className="font-mono text-[7px] text-purple-800/30 tracking-widest">CONN: SECURE</span>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// EFFECT 10: NEON PULSE RINGS — Expanding rings on section transitions
// ═══════════════════════════════════════════════════════════════════════════════
const NeonPulseRing: React.FC<{ color?: string }> = ({ color = '#a855f7' }) => (
  <div className="relative flex items-center justify-center w-full h-4 my-2" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="absolute w-6 h-6 rounded-full border"
        style={{ borderColor: color }}
        animate={{ scale: [1, 4, 6], opacity: [0.4, 0.1, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: 'easeOut' }}
      />
    ))}
    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// EFFECT 11: GLITCH TEXT COMPONENT — Chromatic aberration on hover
// ═══════════════════════════════════════════════════════════════════════════════
const GlitchText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => (
  <span className={`relative inline-block group/glitch ${className}`}>
    <span className="relative z-10">{text}</span>
    <span className="absolute inset-0 z-0 opacity-0 group-hover/glitch:opacity-60 transition-opacity text-cyan-400" style={{ clipPath: 'inset(15% 0 55% 0)', animation: 'devteam-glitch-1 0.3s infinite linear alternate-reverse' }} aria-hidden="true">{text}</span>
    <span className="absolute inset-0 z-0 opacity-0 group-hover/glitch:opacity-60 transition-opacity text-pink-400" style={{ clipPath: 'inset(55% 0 15% 0)', animation: 'devteam-glitch-2 0.3s infinite linear alternate-reverse' }} aria-hidden="true">{text}</span>
  </span>
);

// ═══════════════════════════════════════════════════════════════════════════════
// EFFECT 12: TYPING TEXT — Character-by-character typing animation
// ═══════════════════════════════════════════════════════════════════════════════
const TypingText: React.FC<{ text: string; className?: string; delay?: number; speed?: number }> = ({
  text, className = '', delay = 0, speed = 40,
}) => {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  return (
    <span className={className}>
      {displayed}
      {started && displayed.length < text.length && (
        <motion.span
          className="inline-block w-[2px] h-[1em] bg-current ml-0.5 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TERMINAL BOOT SEQUENCE (Enhanced)
// ═══════════════════════════════════════════════════════════════════════════════
const BOOT_LINES = [
  { text: 'INITIALIZING SYSTEM CORE...', delay: 0, prefix: 'SYS' },
  { text: 'ACCESSING CREW DATABASE...', delay: 500, prefix: 'DB' },
  { text: 'DECRYPTING PERSONNEL FILES...', delay: 900, prefix: 'SEC' },
  { text: 'AUTHORIZATION SUCCESSFUL...', delay: 1400, prefix: 'AUTH' },
  { text: 'LOADING TEAM DATA...', delay: 1900, prefix: 'DATA' },
  { text: 'COMPILING CREW MANIFEST...', delay: 2300, prefix: 'BUILD' },
  { text: 'ACCESS GRANTED ██████████', delay: 2700, prefix: 'OK' },
];

const BOOT_TOTAL_DURATION = 3600;

const TerminalBootSequence: React.FC<{
  onComplete: () => void;
  soundEnabled: boolean;
}> = ({ onComplete, soundEnabled }) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [matrixChars, setMatrixChars] = useState<string[]>([]);
  const [scrambleText, setScrambleText] = useState('');

  // Matrix rain cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setMatrixChars(Array.from({ length: 80 }, () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]));
      setScrambleText(Array.from({ length: 30 }, () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]).join(''));
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach((line, idx) => {
      timers.push(setTimeout(() => {
        setVisibleLines(idx + 1);
        if (idx < BOOT_LINES.length - 1) playSound('click', soundEnabled);
        else playSound('warp', soundEnabled);
      }, line.delay));
    });
    timers.push(setTimeout(onComplete, BOOT_TOTAL_DURATION));
    return () => timers.forEach(clearTimeout);
  }, [onComplete, soundEnabled]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 relative">
      {/* Warp starfield behind terminal */}
      <WarpStarfield />

      {/* Matrix rain columns */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.04] pointer-events-none font-mono text-emerald-400 text-[10px] leading-tight select-none" aria-hidden="true">
        <div className="flex flex-wrap gap-[2px] p-4" style={{ wordBreak: 'break-all' }}>
          {matrixChars.map((char, i) => (
            <span key={i} style={{ opacity: Math.random() * 0.8 + 0.2, color: i % 7 === 0 ? '#22d3ee' : undefined }}>{char}</span>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#040a0e]/95 border-2 border-emerald-700/50 rounded-lg p-6 sm:p-8 w-full max-w-xl shadow-[0_0_60px_rgba(52,211,153,0.12),inset_0_0_80px_rgba(52,211,153,0.02)] relative overflow-hidden backdrop-blur-sm"
        role="status"
        aria-label="Loading dev team data"
      >
        {/* Animated border glow pulse */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          animate={{
            boxShadow: ['0 0 15px rgba(52,211,153,0.08)', '0 0 35px rgba(52,211,153,0.2)', '0 0 15px rgba(52,211,153,0.08)'],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Horizontal scan line inside terminal */}
        <motion.div
          className="absolute left-0 right-0 h-[1px] bg-emerald-400/20 pointer-events-none"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />

        {/* Terminal header */}
        <div className="flex items-center gap-2 border-b border-emerald-900/40 pb-3 mb-5">
          {['bg-red-500', 'bg-yellow-500', 'bg-emerald-500'].map((c, i) => (
            <motion.div key={c} className={`w-2.5 h-2.5 rounded-full ${c}`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              style={{ boxShadow: `0 0 6px currentColor` }}
            />
          ))}
          <span className="font-pixel text-[7px] text-emerald-600/80 ml-2 tracking-[0.2em]">CREW_DB_TERMINAL_v2.6</span>
          <motion.span className="ml-auto font-mono text-[8px] text-emerald-600/40" animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }}>●</motion.span>
        </div>

        {/* Scrambled data readout at top */}
        <div className="font-mono text-[7px] text-emerald-900/30 tracking-wider mb-3 overflow-hidden h-3 select-none">
          {scrambleText}
        </div>

        {/* Boot sequence */}
        <div className="flex flex-col gap-2">
          {BOOT_LINES.map((line, idx) => (
            <motion.div
              key={line.text}
              initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
              animate={idx < visibleLines ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2.5"
            >
              <span className="font-mono text-[8px] text-emerald-800 tracking-wider min-w-[36px] select-none">[{line.prefix}]</span>
              <span className="font-mono text-[10px] text-emerald-700 select-none">›</span>
              <span className={`font-mono text-xs sm:text-sm font-bold tracking-wider ${idx === BOOT_LINES.length - 1
                  ? 'text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                  : 'text-emerald-500/70'
                }`}>{line.text}</span>
              {idx === visibleLines - 1 && idx < BOOT_LINES.length - 1 && (
                <motion.span className="inline-block w-1.5 h-4 bg-emerald-400 ml-1 shadow-[0_0_8px_rgba(52,211,153,0.5)]" animate={{ opacity: [1, 0] }} transition={{ duration: 0.4, repeat: Infinity }} />
              )}
              {idx < visibleLines - 1 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }} className="text-emerald-400 font-mono text-xs ml-auto">✓</motion.span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Segmented progress */}
        <div className="mt-5 flex gap-1">
          {BOOT_LINES.map((_, idx) => (
            <motion.div key={idx} className="h-1 flex-1 rounded-full overflow-hidden bg-emerald-950/40">
              <motion.div
                className="h-full rounded-full"
                style={{ background: idx === BOOT_LINES.length - 1 ? 'linear-gradient(90deg, #10b981, #34d399, #6ee7b7)' : 'linear-gradient(90deg, #065f46, #10b981)' }}
                initial={{ width: '0%' }}
                animate={{ width: idx < visibleLines ? '100%' : '0%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* System info */}
        <div className="mt-4 flex items-center justify-between font-mono text-[7px] text-emerald-800/50 tracking-wider">
          <span>MEM: 64.2TB FREE</span>
          <span>CPU: ████████░░ 82%</span>
          <span>NET: QUANTUM-LINK</span>
        </div>
      </motion.div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEV CARD (Enhanced with 3D tilt, energy bars, orbit rings, hologram flicker)
// ═══════════════════════════════════════════════════════════════════════════════
const DevCard: React.FC<{
  member: DevTeamMember;
  index: number;
  soundEnabled: boolean;
}> = ({ member, index, soundEnabled }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useTransform(mouseY, [0, 1], [4, -4]);
  const rotateY = useTransform(mouseX, [0, 1], [-4, 4]);
  const spotlightX = useTransform(mouseX, [0, 1], ['0%', '100%']);
  const spotlightY = useTransform(mouseY, [0, 1], ['0%', '100%']);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY]);

  const statusColors = {
    online: { dot: 'bg-emerald-400', label: 'ONLINE' },
    away: { dot: 'bg-yellow-400', label: 'AWAY' },
    offline: { dot: 'bg-red-400', label: 'OFFLINE' },
  };
  const statusInfo = statusColors[member.status];

  // Fake power level for the energy bar
  const powerLevel = useMemo(() => Math.floor(Math.random() * 30 + 70), []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformPerspective: 800,
        borderColor: member.color,
        boxShadow: isHovered
          ? `0 0 30px ${member.shadow}, 0 12px 40px rgba(0,0,0,0.6), inset 0 0 30px ${member.bg}`
          : `0 0 12px ${member.shadow}`,
        background: `linear-gradient(135deg, #0b011d 0%, ${member.bg} 100%)`,
        transition: 'box-shadow 0.3s ease',
      }}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
      onMouseEnter={() => { setIsHovered(true); playSound('hover', soundEnabled); }}
      onMouseLeave={() => { setIsHovered(false); mouseX.set(0.5); mouseY.set(0.5); }}
      onMouseMove={handleMouseMove}
      onClick={() => { setShowDetails(!showDetails); playSound('click', soundEnabled); }}
      className="group/card bg-[#0b011d]/90 border-4 rounded-xl p-4 flex flex-col gap-3 relative cursor-pointer overflow-hidden"
      role="article"
      aria-label={`Developer: ${member.name}. Click to expand.`}
      tabIndex={0}
    >
      {/* Cursor-following spotlight */}
      <motion.div
        className="absolute w-48 h-48 rounded-full pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle, ${member.shadow} 0%, transparent 70%)`,
          left: spotlightX,
          top: spotlightY,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Animated corner brackets */}
      {['top-1 left-1 border-t-2 border-l-2', 'top-1 right-1 border-t-2 border-r-2', 'bottom-1 left-1 border-b-2 border-l-2', 'bottom-1 right-1 border-b-2 border-r-2'].map((pos, i) => (
        <motion.div
          key={i}
          className={`absolute ${pos} transition-all duration-300`}
          style={{ borderColor: member.color }}
          animate={isHovered ? { width: 18, height: 18, opacity: 1 } : { width: 12, height: 12, opacity: 0.3 }}
          transition={{ delay: i * 0.05 }}
        />
      ))}

      {/* Holographic sweep */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 55%, transparent 60%)', backgroundSize: '200% 100%' }}
        animate={isHovered ? { backgroundPosition: ['200% 0', '-200% 0'] } : { backgroundPosition: '200% 0' }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />

      {/* Profile Avatar with orbit rings */}
      <div className="relative w-full aspect-square overflow-hidden rounded-lg border-2 bg-black/40" style={{ borderColor: member.color }}>
        <div className="w-full h-full flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, #0e0422 0%, ${member.bg} 100%)` }}>
          {/* Orbit rings around avatar */}
          {isHovered && [1, 2].map((r) => (
            <motion.div
              key={r}
              className="absolute rounded-full border"
              style={{ borderColor: `${member.color}40`, width: 60 + r * 25, height: 60 + r * 25 }}
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ rotate: 360, opacity: 0.5 }}
              transition={{ duration: 4 + r * 2, repeat: Infinity, ease: 'linear' }}
            />
          ))}

          {/* Animated pixel astronaut */}
          <motion.svg viewBox="0 0 32 32" className="w-16 h-16 sm:w-20 sm:h-20 relative z-10" style={{ imageRendering: 'pixelated' as React.CSSProperties['imageRendering'] }}
            animate={isHovered ? { y: [0, -3, 0], rotate: [0, 3, -3, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <rect x="10" y="4" width="12" height="12" rx="2" fill={member.color} opacity="0.3" />
            <rect x="12" y="6" width="8" height="8" rx="1" fill={member.color} opacity="0.6" />
            <motion.rect x="13" y="7" width="6" height="4" rx="1" fill={member.color} animate={isHovered ? { opacity: [1, 0.5, 1] } : {}} transition={{ duration: 0.8, repeat: Infinity }} />
            <rect x="11" y="17" width="10" height="8" rx="1" fill={member.color} opacity="0.4" />
            <motion.rect x="8" y="18" width="3" height="5" rx="1" fill={member.color} opacity="0.3" animate={isHovered ? { x: [8, 5, 8] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
            <motion.rect x="21" y="18" width="3" height="5" rx="1" fill={member.color} opacity="0.3" animate={isHovered ? { x: [21, 24, 21] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
            <rect x="12" y="25" width="3" height="4" rx="1" fill={member.color} opacity="0.3" />
            <rect x="17" y="25" width="3" height="4" rx="1" fill={member.color} opacity="0.3" />
          </motion.svg>
        </div>

        {/* Scanline overlay */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(18,5,44,0.4) 50%, transparent 50%)', backgroundSize: '100% 4px' }} />

        {/* Moving HUD scanner */}
        <motion.div className="absolute inset-x-0 h-[1px] pointer-events-none" style={{ backgroundColor: member.color, opacity: 0.5, boxShadow: `0 0 10px ${member.color}` }} animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />

        {/* Corner brackets */}
        {['top-1 left-1 border-t border-l', 'top-1 right-1 border-t border-r', 'bottom-1 left-1 border-b border-l', 'bottom-1 right-1 border-b border-r'].map((p) => (
          <div key={p} className={`absolute w-2 h-2 ${p}`} style={{ borderColor: member.color }} />
        ))}

        {/* Hologram flicker overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(transparent, ${member.color}08 50%, transparent)` }}
          animate={{ opacity: [0, 0.3, 0, 0.2, 0] }}
          transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3 }}
        />

        {/* Click hint */}
        <motion.div className="absolute bottom-1.5 right-1.5 font-mono text-[7px] tracking-wider px-1 py-0.5 rounded bg-black/60 border border-purple-800/30" style={{ color: member.color }} animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
          TAP
        </motion.div>
      </div>

      {/* Status + ID row */}
      <div className="flex items-center gap-1.5">
        <motion.div
          className={`w-2 h-2 rounded-full ${statusInfo.dot}`}
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ boxShadow: `0 0 8px ${member.shadow}` }}
        />
        <span className="font-mono text-[9px] text-purple-400 font-bold tracking-wider">{statusInfo.label}</span>
        <span className="font-mono text-[7px] text-purple-700 ml-auto tracking-wider">ID:{member.id.toUpperCase()}</span>
      </div>

      {/* ENERGY BAR — Power level indicator */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[7px] text-purple-600 tracking-wider">PWR</span>
        <div className="flex-1 h-1.5 bg-purple-950/40 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${member.color}88, ${member.color})` }}
            initial={{ width: '0%' }}
            whileInView={{ width: `${powerLevel}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: index * 0.1 + 0.3, ease: 'easeOut' }}
          />
        </div>
        <span className="font-mono text-[7px] font-bold" style={{ color: member.color }}>{powerLevel}%</span>
      </div>

      {/* Name with glitch */}
      <div className="flex flex-col gap-0.5">
        <h3 className="font-pixel text-[11px] sm:text-xs text-white leading-tight font-bold tracking-wide">
          <GlitchText text={member.name} />
        </h3>
        <span className="font-pixel text-[8px] sm:text-[9px] tracking-wider font-bold" style={{ color: member.color }}>{member.role.toUpperCase()}</span>
      </div>

      <p className="font-mono text-[10px] sm:text-xs text-purple-300 font-bold leading-relaxed">{member.description}</p>

      {/* Tech stack pills */}
      <div className="flex flex-wrap gap-1.5">
        {member.techStack.map((tech) => (
          <motion.span key={tech} className="font-mono text-[9px] font-bold px-2 py-0.5 rounded border" style={{ color: member.color, borderColor: `${member.color}44`, backgroundColor: `${member.color}10` }}
            whileHover={{ scale: 1.1, backgroundColor: `${member.color}30`, borderColor: member.color }}
          >{tech}</motion.span>
        ))}
      </div>

      {/* Expandable stats panel */}
      <AnimatePresence>
        {showDetails && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
            <div className="border-t border-purple-950/60 pt-3 mt-1 grid grid-cols-2 gap-2 text-[9px] font-mono font-bold">
              {[{ l: 'COMMITS', v: Math.floor(Math.random() * 500 + 100) }, { l: 'PR REVIEWS', v: Math.floor(Math.random() * 200 + 50) }, { l: 'BUGS FIXED', v: Math.floor(Math.random() * 300 + 80) }, { l: 'UPTIME', v: `${(Math.random() * 2 + 97).toFixed(1)}%` }].map((stat, si) => (
                <motion.div key={stat.l} className="flex flex-col gap-0.5" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: si * 0.1 }}>
                  <span className="text-purple-600 tracking-wider">{stat.l}</span>
                  <span className="text-white">{stat.v}{typeof stat.v === 'number' ? '+' : ''}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social links */}
      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-purple-950/60">
        {[
          { href: member.github, icon: <GithubIcon size={14} />, label: 'GitHub' },
          { href: member.linkedin, icon: <LinkedinIcon size={14} />, label: 'LinkedIn' },
          ...(member.email ? [{ href: `mailto:${member.email}`, icon: <Mail size={14} />, label: 'Email' }] : []),
        ].map((link) => (
          <motion.a key={link.label} href={link.href} target={link.label !== 'Email' ? '_blank' : undefined} rel="noreferrer"
            onClick={(e) => { if (link.label !== 'Email') { e.preventDefault(); window.open(link.href, '_blank'); } playSound('click', soundEnabled); }}
            className="p-1.5 rounded bg-purple-950/30 border border-purple-900/50 text-purple-300 hover:text-white hover:border-purple-500 transition-all"
            whileHover={{ scale: 1.2, y: -3 }} whileTap={{ scale: 0.85 }}
            aria-label={`${member.name} ${link.label}`} title={link.label}
          >{link.icon}</motion.a>
        ))}
        <motion.span className="ml-auto font-mono text-[7px] text-purple-600 tracking-wider" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
          {showDetails ? '▲ CLOSE' : '▼ MORE'}
        </motion.span>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TECH STACK CARD (Enhanced)
// ═══════════════════════════════════════════════════════════════════════════════
const TechCard: React.FC<{ tech: DevTechItem; index: number; soundEnabled: boolean }> = ({ tech, index, soundEnabled }) => {
  const [active, setActive] = useState(false);
  const labels = { frontend: 'FRONTEND', backend: 'BACKEND', devops: 'DEVOPS', language: 'LANGUAGE' };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 30, rotateZ: -3 }}
      whileInView={{ opacity: 1, scale: 1, y: 0, rotateZ: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.08, y: -5 }}
      whileTap={{ scale: 0.92 }}
      onMouseEnter={() => playSound('hover', soundEnabled)}
      onClick={() => { setActive(!active); playSound('click', soundEnabled); }}
      className="bg-[#0b011d]/90 border-4 rounded-lg p-4 flex items-center gap-3 cursor-pointer group/tech relative overflow-hidden"
      style={{
        borderColor: active ? tech.color : `${tech.color}44`,
        boxShadow: active ? `0 0 25px ${tech.color}44, inset 0 0 25px ${tech.color}08` : `0 0 8px ${tech.color}11`,
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      role="listitem"
    >
      {active && <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ background: `radial-gradient(circle, ${tech.color}0a 0%, transparent 70%)` }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />}
      <motion.span className="text-2xl flex-shrink-0 relative z-10" animate={active ? { rotate: [0, -15, 15, 0], scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.6 }}>{tech.icon}</motion.span>
      <div className="flex flex-col gap-0.5 min-w-0 relative z-10">
        <span className="font-pixel text-[10px] sm:text-xs text-white font-bold tracking-wider">{tech.name}</span>
        <span className="font-mono text-[8px] font-bold tracking-widest" style={{ color: tech.color }}>{labels[tech.category]}</span>
      </div>
      <motion.div className="ml-auto w-2.5 h-2.5 rounded-full relative z-10" style={{ backgroundColor: tech.color }}
        animate={active ? { scale: [1, 1.5, 1], boxShadow: [`0 0 4px ${tech.color}`, `0 0 16px ${tech.color}`, `0 0 4px ${tech.color}`] } : { scale: 0.6, opacity: 0.3 }}
        transition={{ duration: 1.5, repeat: active ? Infinity : 0 }}
      />
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ACHIEVEMENT BADGE (Enhanced with unlock mechanic)
// ═══════════════════════════════════════════════════════════════════════════════
const AchievementBadge: React.FC<{ achievement: DevAchievement; index: number; soundEnabled: boolean }> = ({ achievement, index, soundEnabled }) => {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.04, y: -3 }}
      onClick={() => { if (!unlocked) { setUnlocked(true); playSound('coin', soundEnabled); } }}
      className="relative bg-[#0b011d]/90 border-4 rounded-lg p-3 sm:p-4 flex items-center gap-3 cursor-pointer overflow-hidden"
      style={{
        borderColor: unlocked ? achievement.color : `${achievement.color}44`,
        boxShadow: unlocked ? `0 0 25px ${achievement.color}44` : `0 0 6px ${achievement.color}15`,
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      role="listitem"
    >
      {unlocked && (
        <motion.div initial={{ opacity: 0.7, scale: 0 }} animate={{ opacity: 0, scale: 4 }} transition={{ duration: 0.8 }}
          className="absolute inset-0 rounded-lg pointer-events-none" style={{ background: `radial-gradient(circle, ${achievement.color}50 0%, transparent 70%)` }}
        />
      )}
      <motion.span className="text-2xl sm:text-3xl flex-shrink-0" animate={unlocked ? { rotate: [0, -20, 20, 0], scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.6 }} style={{ filter: unlocked ? 'none' : 'grayscale(0.7) brightness(0.6)' }}>
        {achievement.icon}
      </motion.span>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="font-pixel text-[9px] sm:text-[10px] font-bold tracking-wider" style={{ color: unlocked ? achievement.color : `${achievement.color}77` }}>{achievement.title}</span>
        <span className="font-mono text-[10px] sm:text-xs text-purple-300 font-bold leading-relaxed">{achievement.description}</span>
      </div>
      <motion.span className="ml-auto font-mono text-[8px] font-bold tracking-wider flex-shrink-0" style={{ color: unlocked ? achievement.color : '#6b21a8' }}
        animate={unlocked ? {} : { opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}
      >{unlocked ? '🔓' : '🔒 TAP'}</motion.span>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// INLINE KEYFRAMES (page-scoped, no global CSS changes)
// ═══════════════════════════════════════════════════════════════════════════════
const DevTeamStyles: React.FC = () => (
  <style>{`
    @keyframes devteam-glitch-1 {
      0% { transform: translate(0); }
      20% { transform: translate(-2px, 2px); }
      40% { transform: translate(-2px, -2px); }
      60% { transform: translate(2px, 2px); }
      80% { transform: translate(2px, -2px); }
      100% { transform: translate(0); }
    }
    @keyframes devteam-glitch-2 {
      0% { transform: translate(0); }
      20% { transform: translate(2px, -2px); }
      40% { transform: translate(2px, 2px); }
      60% { transform: translate(-2px, -2px); }
      80% { transform: translate(-2px, 2px); }
      100% { transform: translate(0); }
    }
    @keyframes devteam-grid-scroll {
      0% { background-position: 0 0; }
      100% { background-position: 0 50px; }
    }
  `}</style>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN VIEW — Orchestrates all effects
// ═══════════════════════════════════════════════════════════════════════════════
export const DevTeamView: React.FC<DevTeamProps> = ({ state }) => {
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shown = sessionStorage.getItem('devteam_boot_shown');
      if (shown === 'true') setBootComplete(true);
    }
  }, []);

  const handleBootComplete = useCallback(() => {
    setBootComplete(true);
    if (typeof window !== 'undefined') sessionStorage.setItem('devteam_boot_shown', 'true');
  }, []);

  return (
    <div className="w-full relative px-6 py-8 md:py-12 select-none" role="main" aria-label="Dev Team page">
      <DevTeamStyles />

      <AnimatePresence mode="wait">
        {!bootComplete ? (
          <motion.div key="boot" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.05, filter: 'blur(12px)' }} transition={{ duration: 0.6, ease: 'easeIn' }}>
            <TerminalBootSequence onComplete={handleBootComplete} soundEnabled={state.soundEnabled} />
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="max-w-7xl mx-auto flex flex-col gap-12 relative">

            {/* ═══ LAYER 1: BACKGROUND EFFECTS ═══ */}
            <WarpStarfield />
            <FloatingParticles />
            <DataStreams />
            <ShootingStars />
            <SynthwaveGrid />
            <RadarSweep />
            <EnergyOrb />
            <PageScanLine />
            <HudOverlay />

            {/* ═══ HERO SECTION ═══ */}
            <section className="text-center relative z-10 pt-4" aria-label="Dev Team hero">
              <motion.span initial={{ opacity: 0, y: -20, letterSpacing: '0.6em' }} animate={{ opacity: 1, y: 0, letterSpacing: '0.25em' }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="font-pixel text-xs text-cyan-400 block uppercase mb-3">
                ✦ THE ENGINEERS ✦
              </motion.span>

              <motion.h1 initial={{ opacity: 0, y: 40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }} className="font-pixel text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-wider leading-[1.1] relative">
                <GlitchText text="DEV " className="text-white" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 font-extrabold relative">
                  TEAM
                  <motion.span className="absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1, delay: 0.7 }} />
                </span>
              </motion.h1>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-5">
                <TypingText text="The engineers behind the ELICIT'26 experience." className="font-mono text-sm text-purple-300 font-bold" delay={600} speed={30} />
              </motion.div>

              {/* Live status badge */}
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.8, type: 'spring' }} className="inline-flex items-center gap-2.5 mt-6 px-5 py-2.5 rounded-full border border-purple-800/40 bg-purple-950/20 font-mono text-xs text-purple-300 font-bold backdrop-blur-sm">
                <motion.span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                <span>{DEV_TEAM_MEMBERS.length} CREW ACTIVE</span>
                <span className="w-[1px] h-3 bg-purple-700" />
                <span>{DEV_TECH_STACK.length} MODULES</span>
                <span className="w-[1px] h-3 bg-purple-700" />
                <span>{DEV_ACHIEVEMENTS.length} BADGES</span>
              </motion.div>
            </section>

            {/* Divider with pulse ring */}
            <div className="relative z-10">
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="h-[1px] bg-gradient-to-r from-transparent via-purple-700 to-transparent w-full origin-left" />
              <NeonPulseRing color="#a855f7" />
            </div>

            {/* ═══ DEV GRID ═══ */}
            <section className="relative z-10" aria-label="Developer profiles">
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-pixel text-xs text-purple-400 tracking-widest text-center font-bold mb-1">— CREW MANIFEST —</motion.p>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-mono text-[10px] text-purple-600 text-center mb-6 tracking-wider">CLICK CARDS TO REVEAL CREW STATISTICS</motion.p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {DEV_TEAM_MEMBERS.map((member, i) => (
                  <DevCard key={member.id} member={member} index={i} soundEnabled={state.soundEnabled} />
                ))}
              </div>
            </section>

            {/* Divider */}
            <div className="relative z-10">
              <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="h-[1px] bg-gradient-to-r from-transparent via-cyan-700 to-transparent w-full origin-center" />
              <NeonPulseRing color="#22d3ee" />
            </div>

            {/* ═══ TECH STACK ═══ */}
            <section className="relative z-10" aria-label="Tech stack">
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-pixel text-xs text-cyan-400 tracking-widest text-center font-bold mb-1">🔧 TECH STACK INVENTORY</motion.p>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-mono text-[10px] text-purple-600 text-center mb-6 tracking-wider">TAP TO ACTIVATE MODULES</motion.p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4" role="list">
                {DEV_TECH_STACK.map((tech, i) => <TechCard key={tech.name} tech={tech} index={i} soundEnabled={state.soundEnabled} />)}
              </div>
            </section>

            {/* Divider */}
            <div className="relative z-10">
              <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="h-[1px] bg-gradient-to-r from-transparent via-pink-700 to-transparent w-full origin-right" />
              <NeonPulseRing color="#f472b6" />
            </div>

            {/* ═══ ACHIEVEMENTS ═══ */}
            <section className="relative z-10" aria-label="Development achievements">
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-pixel text-xs text-purple-400 tracking-widest text-center font-bold mb-1">🏅 DEV ACHIEVEMENTS</motion.p>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-mono text-[10px] text-purple-600 text-center mb-6 tracking-wider">UNLOCK BADGES BY TAPPING THEM</motion.p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" role="list">
                {DEV_ACHIEVEMENTS.map((a, i) => <AchievementBadge key={a.id} achievement={a} index={i} soundEnabled={state.soundEnabled} />)}
              </div>
            </section>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
