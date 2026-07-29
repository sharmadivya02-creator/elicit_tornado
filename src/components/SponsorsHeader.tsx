import React from 'react';
import { motion } from 'motion/react';

interface SponsorsHeaderProps {
  soundEnabled: boolean;
  playSound: (type: string, enabled: boolean) => void;
}

export const SponsorsHeader: React.FC<SponsorsHeaderProps> = ({ soundEnabled, playSound }) => {
  // Stars positions
  const stars = [
    { x: '12%', y: '25%', size: 'text-[10px]', delay: 0 },
    { x: '8%', y: '70%', size: 'text-[6px]', delay: 1.5 },
    { x: '25%', y: '20%', size: 'text-[12px]', delay: 0.5 },
    { x: '22%', y: '80%', size: 'text-[8px]', delay: 2.3 },
    { x: '75%', y: '15%', size: 'text-[10px]', delay: 1.1 },
    { x: '78%', y: '75%', size: 'text-[6px]', delay: 0.8 },
    { x: '92%', y: '30%', size: 'text-[12px]', delay: 1.7 },
    { x: '95%', y: '65%', size: 'text-[8px]', delay: 2.1 },
    { x: '45%', y: '15%', size: 'text-[6px]', delay: 1.3 },
    { x: '55%', y: '85%', size: 'text-[6px]', delay: 0.4 },
  ];

  // Glitch bars positions
  const glitchBars = [
    { top: '25%', left: '15%', width: '120px', color: 'bg-[#7B5CFF]', delay: 0 },
    { top: '48%', left: '5%', width: '160px', color: 'bg-[#FF4DA6]', delay: 1.2 },
    { top: '40%', left: '78%', width: '130px', color: 'bg-[#00E5FF]', delay: 0.6 },
    { top: '65%', left: '82%', width: '110px', color: 'bg-[#7B5CFF]', delay: 1.8 },
    { top: '55%', left: '22%', width: '80px', color: 'bg-[#00FFA3]', delay: 2.4 },
  ];

  return (
    <div 
      className="w-full relative py-12 md:py-16 px-4 md:px-8 rounded-xl overflow-hidden border border-[#7B5CFF]/20 bg-[#0D0D0D] shadow-[0_0_30px_rgba(123,92,255,0.15)] flex flex-col items-center justify-center select-none"
      onMouseEnter={() => playSound('hover', soundEnabled)}
    >
      {/* CRT scanline overlay effect */}
      <div className="absolute inset-0 crt-scanlines opacity-15 pointer-events-none z-0" />

      {/* Horizontal static/animated scanlines for glitch atmosphere */}
      <div className="absolute inset-x-0 top-0 h-full w-full pointer-events-none z-0 opacity-40">
        <div className="absolute w-full h-[1px] bg-[#00E5FF]/20 top-[15%]" />
        <div className="absolute w-full h-[1px] bg-[#FF4DA6]/20 top-[42%]" />
        <div className="absolute w-full h-[1px] bg-[#7B5CFF]/20 top-[68%]" />
        <div className="absolute w-full h-[1px] bg-[#00FFA3]/10 top-[85%]" />
      </div>

      {/* Background Star Field */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {stars.map((star, i) => (
          <motion.div
            key={`header-star-${i}`}
            className={`absolute font-pixel text-white/50 ${star.size}`}
            style={{ left: star.x, top: star.y }}
            animate={{
              opacity: [0.15, 0.75, 0.15],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 3 + (i % 3),
              delay: star.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {i % 3 === 0 ? '+' : '✦'}
          </motion.div>
        ))}
      </div>

      {/* Horizontal Glitch Bars cutting through background */}
      {glitchBars.map((bar, i) => (
        <motion.div
          key={`glitch-bar-${i}`}
          className={`absolute h-[1.5px] ${bar.color} opacity-30 z-0`}
          style={{ top: bar.top, left: bar.left, width: bar.width }}
          animate={{
            x: [-5, 5, -2, 3, -5],
            opacity: [0.1, 0.4, 0.15, 0.5, 0.1],
          }}
          transition={{
            duration: 0.15,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: bar.delay,
            ease: 'linear',
          }}
        />
      ))}

      {/* Main Row layout containing Left Planet - Center Title - Right Planet */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left Planet: Shaded purple planet with tilted rings & glitch lines */}
        <div className="w-28 h-28 md:w-36 md:h-36 flex items-center justify-center shrink-0 relative group">
          {/* Ambient Purple glow behind planet */}
          <div className="absolute inset-4 bg-[#7B5CFF]/15 blur-2xl rounded-full group-hover:bg-[#7B5CFF]/25 transition-all duration-300" />
          
          <motion.div
            className="w-full h-full"
            animate={{
              y: [-3, 3, -3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <defs>
                <radialGradient id="purplePlanetGrad" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#7B5CFF" />
                  <stop offset="35%" stopColor="#5E3CD2" />
                  <stop offset="75%" stopColor="#25126B" />
                  <stop offset="100%" stopColor="#080018" />
                </radialGradient>
                <linearGradient id="purpleRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF4DA6" />
                  <stop offset="50%" stopColor="#7B5CFF" />
                  <stop offset="100%" stopColor="#00E5FF" />
                </linearGradient>
                <filter id="neonPurpleGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. Back half of Ring (drawn behind planet) */}
              <g transform="rotate(-15 60 60)">
                <path 
                  d="M12,60 A48,13 0 0,1 108,60" 
                  fill="none" 
                  stroke="url(#purpleRingGrad)" 
                  strokeWidth="5" 
                  strokeLinecap="round" 
                  opacity="0.75" 
                />
              </g>

              {/* 2. Shaded Planet Sphere */}
              <circle 
                cx="60" 
                cy="60" 
                r="33" 
                fill="url(#purplePlanetGrad)" 
                filter="url(#neonPurpleGlow)" 
              />
              
              {/* Highlight Overlay for 3D sphere feel */}
              <circle cx="60" cy="60" r="33" fill="none" stroke="#FF4DA6" strokeWidth="1" opacity="0.3" />
              <path d="M31,46 A33,33 0 0,1 74,32 A29,29 0 0,0 31,46" fill="#FFFFFF" opacity="0.1" />

              {/* 3. Front half of Ring (drawn in front of planet) */}
              <g transform="rotate(-15 60 60)">
                <path 
                  d="M108,60 A48,13 0 0,1 12,60" 
                  fill="none" 
                  stroke="url(#purpleRingGrad)" 
                  strokeWidth="5" 
                  strokeLinecap="round" 
                />
                {/* Thin bright accent on front ring */}
                <path 
                  d="M102,60 A42,10 0 0,1 18,60" 
                  fill="none" 
                  stroke="#FFFFFF" 
                  strokeWidth="1.2" 
                  strokeLinecap="round" 
                  opacity="0.5" 
                />
              </g>
            </svg>
          </motion.div>

          {/* Glitch Overlay lines slice */}
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-[#FF4DA6] opacity-40 mix-blend-screen pointer-events-none"
            style={{ top: '48%' }}
            animate={{
              x: [-12, 10, -5, 8, -12],
              opacity: [0, 0.6, 0.1, 0.7, 0],
            }}
            transition={{
              duration: 0.18,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: 0.3,
            }}
          />
          <motion.div
            className="absolute left-2 right-2 h-[1px] bg-[#00E5FF] opacity-30 mix-blend-screen pointer-events-none"
            style={{ top: '56%' }}
            animate={{
              x: [8, -8, 4, -5, 8],
              opacity: [0, 0.4, 0, 0.5, 0],
            }}
            transition={{
              duration: 0.22,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: 0.7,
            }}
          />
        </div>

        {/* Center Section: "SPONSORS" with horizontal glitching, and brackets around subtitle */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          
          {/* GLITCHY TITLE */}
          <div className="relative mb-3 flex items-center justify-center">
            {/* Layer 1: Cyan shift behind */}
            <span 
              className="absolute font-pixel text-4xl md:text-5xl text-[#00E5FF] tracking-[0.15em] font-bold select-none pointer-events-none mix-blend-screen animate-glitch-1"
              style={{ left: '2.5px', top: '1px' }}
            >
              SPONSORS
            </span>
            
            {/* Layer 2: Pink shift behind */}
            <span 
              className="absolute font-pixel text-4xl md:text-5xl text-[#FF4DA6] tracking-[0.15em] font-bold select-none pointer-events-none mix-blend-screen animate-glitch-2"
              style={{ left: '-2.5px', top: '-1px' }}
            >
              SPONSORS
            </span>

            {/* Layer 3: Main Yellow/Orange Text */}
            <span className="relative z-10 font-pixel text-4xl md:text-5xl text-[#FFB000] tracking-[0.15em] font-bold drop-shadow-[0_0_15px_rgba(255,176,0,0.5)]">
              SPONSORS
            </span>
          </div>

          {/* SUBTITLE WITH CORNER BRACKETS */}
          <div className="flex items-center gap-3 px-4 py-1 mt-4">
            {/* Left corner bracket */}
            <svg className="w-8 h-4 text-[#00E5FF] drop-shadow-[0_0_6px_rgba(0,229,255,0.6)] shrink-0" viewBox="0 0 32 16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4,2 L4,12 L28,12 L28,7" strokeLinecap="square" />
            </svg>

            {/* Middle text */}
            <span className="font-mono text-xs sm:text-[13px] text-white tracking-wide font-semibold text-purple-200">
              Powering innovation. Building the future together.
            </span>

            {/* Right corner bracket */}
            <svg className="w-8 h-4 text-[#00E5FF] drop-shadow-[0_0_6px_rgba(0,229,255,0.6)] shrink-0" viewBox="0 0 32 16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M28,2 L28,12 L4,12 L4,7" strokeLinecap="square" />
            </svg>
          </div>
        </div>

        {/* Right Planet: Dark sphere with crescent cyan highlight & horizontal blue laser */}
        <div className="w-28 h-28 md:w-36 md:h-36 flex items-center justify-center shrink-0 relative group">
          {/* Ambient Cyan glow behind planet */}
          <div className="absolute inset-4 bg-[#00E5FF]/10 blur-2xl rounded-full group-hover:bg-[#00E5FF]/20 transition-all duration-300" />

          <motion.div
            className="w-full h-full"
            animate={{
              y: [3, -3, 3],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <defs>
                <radialGradient id="darkPlanetGrad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#120c32" />
                  <stop offset="55%" stopColor="#0a0520" />
                  <stop offset="100%" stopColor="#020108" />
                </radialGradient>
                <linearGradient id="cyanCrescentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1677FF" />
                  <stop offset="60%" stopColor="#00E5FF" />
                  <stop offset="100%" stopColor="#00FFA3" />
                </linearGradient>
                <filter id="neonCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. Dark Sphere base */}
              <circle 
                cx="60" 
                cy="60" 
                r="32" 
                fill="url(#darkPlanetGrad)" 
              />

              {/* 2. Glowing Crescent Highlight on the right rim */}
              {/* Radius 32, offset crescent mask or clean overlay path */}
              <path 
                d="M60,28 A32,32 0 0,1 92,60 A32,32 0 0,1 60,92 A29,29 0 0,0 84,60 A29,29 0 0,0 60,28 Z" 
                fill="url(#cyanCrescentGrad)" 
                filter="url(#neonCyanGlow)" 
              />

              {/* 3. Extremely thin light cyan outer stroke on right arc to pop */}
              <path 
                d="M60,28 A32,32 0 0,1 92,60 A32,32 0 0,1 60,92" 
                fill="none" 
                stroke="#FFFFFF" 
                strokeWidth="1.2" 
                opacity="0.8" 
                filter="url(#neonCyanGlow)" 
              />

              {/* Tiny inner reflections */}
              <circle cx="48" cy="48" r="1.2" fill="#FFFFFF" opacity="0.25" />
            </svg>
          </motion.div>

          {/* Glitched cyan laser/lines passing through planet */}
          <motion.div
            className="absolute left-[-20px] right-[-20px] h-[1.5px] bg-[#00E5FF] opacity-60 mix-blend-screen pointer-events-none shadow-[0_0_6px_#00E5FF]"
            style={{ top: '50%' }}
            animate={{
              y: [0, -3, 2, 0],
              opacity: [0.3, 0.8, 0.4, 0.9, 0.3],
            }}
            transition={{
              duration: 0.12,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: 0.1,
            }}
          />
          <motion.div
            className="absolute left-[-10px] right-2 h-[1px] bg-[#FF4DA6] opacity-30 mix-blend-screen pointer-events-none"
            style={{ top: '58%' }}
            animate={{
              x: [-4, 6, -2, 2, -4],
              opacity: [0.1, 0.5, 0.1, 0.6, 0.1],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: 0.5,
            }}
          />
        </div>

      </div>
    </div>
  );
};
