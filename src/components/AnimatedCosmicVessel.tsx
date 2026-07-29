"use client";

import React, { useState } from 'react';
import { ExplorerState } from '../types';
import { playSound } from '../utils/sound';

interface HighFidelityRocketProps {
  isWarping: boolean;
  onClick: () => void;
}

export const HighFidelityRocket: React.FC<HighFidelityRocketProps> = ({ isWarping, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative w-40 h-40 cursor-pointer select-none transition-all duration-300 ${
        isWarping 
          ? 'animate-[warpDrive_0.8s_ease-in-out]' 
          : 'animate-[rocketHover_3.5s_ease-in-out_infinite] hover:scale-105'
      }`}
    >
      <svg 
        viewBox="0 0 160 160" 
        className="w-full h-full overflow-visible drop-shadow-[0_0_20px_rgba(239,68,68,0.55)]"
      >
        <defs>
          {/* Metallic body gradient */}
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#d1d5db" />
            <stop offset="65%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#4b5563" />
          </linearGradient>
          
          {/* Shading overlay for 3D sphere look */}
          <radialGradient id="3dShadow" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#000000" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.75" />
          </radialGradient>

          {/* Glass window reflection */}
          <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>

          {/* Engine exhaust glow */}
          <radialGradient id="exhaustGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#f97316" />
            <stop offset="70%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
          </radialGradient>

          {/* Gas smoke blur filter */}
          <filter id="smokeBlur" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="4.5" />
          </filter>

          {/* Fire glow filter for smooth feathered spikes */}
          <filter id="fireGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
        </defs>

        {/* --- ENGINE FIRE/EXHAUST --- */}
        <g className="animate-[exhaustFlicker_0.25s_ease-in-out_infinite]" style={{ transformOrigin: '74px 112px' }} filter="url(#fireGlow)">
          {/* Outer yellow-red flame spikes */}
          <path 
            d="M 68,112 L 45,145 L 71,124 L 68,168 L 77,124 L 92,140 L 80,112 Z" 
            fill="url(#exhaustGlow)" 
          />
          {/* Core high-intensity inner yellow spikes */}
          <path 
            d="M 70,112 L 52,136 L 72,122 L 71,152 L 76,122 L 85,132 L 78,112 Z" 
            fill="#fef08a" 
          />
        </g>

        {/* --- GASEOUS EXHAUST SMOKE (GAS NOT BUBBLES) --- */}
        <g filter="url(#smokeBlur)" opacity="0.65">
          {/* Center puff */}
          <circle cx="74" cy="120" r="10" fill="#cbd5e1" className="smoke-particle animate-[smokeDriftCenter_1.3s_infinite]" />
          {/* Left puff */}
          <circle cx="68" cy="120" r="8" fill="#94a3b8" className="smoke-particle animate-[smokeDriftLeft_1.1s_infinite_0.4s]" />
          {/* Right puff */}
          <circle cx="80" cy="120" r="8" fill="#94a3b8" className="smoke-particle animate-[smokeDriftRight_1.1s_infinite_0.8s]" />
        </g>

        {/* --- SHADOW OF THE ROCKET (FOR DEPTH) --- */}
        <ellipse cx="78" cy="120" rx="14" ry="4" fill="#000000" opacity="0.3" />

        {/* --- SIDE WINGS/FINS --- */}
        {/* Left red wing with custom shading */}
        <path 
          d="M 58,95 L 34,124 L 46,126 L 56,112 Z" 
          fill="#dc2626" 
          stroke="#7f1d1d" 
          strokeWidth="2.5" 
          strokeLinejoin="round" 
        />
        <path d="M 58,95 L 34,124 L 42,125 Z" fill="#ef4444" /> {/* Highlights */}

        {/* Right red wing with custom shading */}
        <path 
          d="M 90,95 L 114,124 L 102,126 L 92,112 Z" 
          fill="#dc2626" 
          stroke="#7f1d1d" 
          strokeWidth="2.5" 
          strokeLinejoin="round" 
        />
        <path d="M 90,95 L 114,124 L 106,125 Z" fill="#b91c1c" /> {/* Shadows */}

        {/* --- CENTRAL TAIL FIN --- */}
        <path 
          d="M 72,102 L 74,130 L 76,130 L 76,102 Z" 
          fill="#dc2626" 
          stroke="#7f1d1d" 
          strokeWidth="2" 
        />

        {/* --- ROCKET FUSELAGE / BODY --- */}
        {/* Curved steel rocket container */}
        <path 
          d="M 58,48 C 58,48 58,108 60,112 L 88,112 C 90,108 90,48 90,48" 
          fill="url(#bodyGrad)" 
          stroke="#1f2937" 
          strokeWidth="3.5" 
          strokeLinejoin="round" 
        />
        
        {/* 3D cylindrical shadow overlay */}
        <path 
          d="M 58,48 C 58,48 58,108 60,112 L 88,112 C 90,108 90,48 90,48" 
          fill="url(#3dShadow)" 
          style={{ mixBlendMode: 'multiply' as any }}
        />

        {/* Metallic chrome highlight strip down the side */}
        <path 
          d="M 64,48 Q 66,80 66,112" 
          fill="none" 
          stroke="#ffffff" 
          strokeWidth="2" 
          opacity="0.55" 
          strokeLinecap="round" 
        />

        {/* Segment Panel Lines */}
        <path d="M 59,68 L 89,68" stroke="#1f2937" strokeWidth="2" opacity="0.8" />
        <path d="M 59,92 L 89,92" stroke="#1f2937" strokeWidth="2" opacity="0.8" />

        {/* --- NOSE CONE --- */}
        {/* Sleek retro bullet head */}
        <path 
          d="M 58,48 C 58,48 60,20 74,12 C 88,20 90,48 90,48 Z" 
          fill="#dc2626" 
          stroke="#1f2937" 
          strokeWidth="3.5" 
          strokeLinejoin="round" 
        />
        {/* Nose cone shading */}
        <path 
          d="M 58,48 C 58,48 60,20 74,12 C 88,20 90,48 90,48 Z" 
          fill="url(#3dShadow)" 
          style={{ mixBlendMode: 'multiply' as any }}
        />
        <path 
          d="M 58.5,47 C 62,40 68,26 74,14" 
          fill="none" 
          stroke="#ef4444" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />

        {/* --- PORT WINDOW --- */}
        {/* Bold outer frame */}
        <circle cx="74" cy="78" r="14" fill="#dc2626" stroke="#1f2937" strokeWidth="3" />
        {/* Window Inner Glass */}
        <circle cx="74" cy="78" r="10.5" fill="url(#glassGrad)" stroke="#111827" strokeWidth="1.5" />
        {/* Highlight Reflection on Glass */}
        <path 
          d="M 67.5,74 A 8,8 0 0 1 79.5,71.5" 
          fill="none" 
          stroke="#ffffff" 
          strokeWidth="2" 
          strokeLinecap="round" 
          opacity="0.7" 
        />
        <circle cx="79.5" cy="81.5" r="1.5" fill="#38bdf8" />

        {/* --- DETAILS & BOLTS --- */}
        {/* Small rivets on steel panels */}
        <circle cx="62" cy="58" r="1" fill="#1f2937" />
        <circle cx="86" cy="58" r="1" fill="#1f2937" />
        <circle cx="62" cy="102" r="1" fill="#1f2937" />
        <circle cx="86" cy="102" r="1" fill="#1f2937" />

        {/* Nozzle Joint Ring */}
        <path d="M 66,112 L 82,112 L 80,118 L 68,118 Z" fill="#374151" stroke="#1f2937" strokeWidth="2" />
      </svg>
    </div>
  );
};

interface HighFidelityUfoProps {
  isWarping: boolean;
  onClick: () => void;
}

export const HighFidelityUfo: React.FC<HighFidelityUfoProps> = ({ isWarping, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative w-40 h-40 cursor-pointer select-none transition-all duration-300 ${
        isWarping 
          ? 'animate-[warpDrive_0.8s_ease-in-out]' 
          : 'animate-[ufoHover_4s_ease-in-out_infinite] hover:scale-105'
      }`}
    >
      <svg 
        viewBox="0 0 160 160" 
        className="w-full h-full drop-shadow-[0_0_22px_rgba(34,197,94,0.55)]"
      >
        <defs>
          <linearGradient id="ufoMetal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="40%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <linearGradient id="tractorBeam" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#22c55e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#15803d" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="glassDome" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#22d3ee" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0891b2" stopOpacity="0.9" />
          </radialGradient>
        </defs>

        {/* --- FLICKERING TRACTOR BEAM --- */}
        <polygon 
          points="74,86 86,86 112,154 48,154" 
          fill="url(#tractorBeam)" 
          className="animate-[pulse_0.2s_infinite]"
          opacity="0.8"
        />

        {/* --- SHADOW --- */}
        <ellipse cx="80" cy="148" rx="20" ry="4" fill="#22c55e" opacity="0.35" className="animate-pulse" />

        {/* --- DOME CABIN GLASS --- */}
        <path 
          d="M 52,56 C 52,32 108,32 108,56 Z" 
          fill="url(#glassDome)" 
          stroke="#0f172a" 
          strokeWidth="3.5" 
        />

        {/* --- INSIDE COCKPIT ALIEN --- */}
        <g transform="translate(68, 38)">
          {/* Alien head */}
          <ellipse cx="12" cy="11" rx="8" ry="6.5" fill="#22c55e" />
          {/* Alien eyes */}
          <ellipse cx="8" cy="10" rx="2.5" ry="3.5" fill="#000000" transform="rotate(-15 8 10)" />
          <ellipse cx="16" cy="10" rx="2.5" ry="3.5" fill="#000000" transform="rotate(15 16 10)" />
          {/* Eye shines */}
          <circle cx="8.5" cy="8.5" r="0.6" fill="#ffffff" />
          <circle cx="15.5" cy="8.5" r="0.6" fill="#ffffff" />
          {/* Antenna */}
          <line x1="12" y1="5" x2="12" y2="1.5" stroke="#22c55e" strokeWidth="1.8" />
          <circle cx="12" cy="1" r="1.5" fill="#facc15" className="animate-ping" />
          <circle cx="12" cy="1" r="1.5" fill="#facc15" />
          {/* Cute Smile */}
          <path d="M 10,13.5 Q 12,15.5 14,13.5" stroke="#14532d" strokeWidth="1" fill="none" strokeLinecap="round" />
        </g>

        {/* --- MAIN DISK BODY --- */}
        {/* Silver saucer rim */}
        <ellipse cx="80" cy="68" rx="54" ry="16" fill="url(#ufoMetal)" stroke="#0f172a" strokeWidth="4" />
        
        {/* Secondary inner contour ring for depth */}
        <ellipse cx="80" cy="68" rx="46" ry="11" fill="none" stroke="#475569" strokeWidth="1.5" opacity="0.6" />

        {/* --- REVOLVING NEON LIGHTS --- */}
        {/* Glowing cyber dots flashing in sequence */}
        <circle cx="38" cy="68" r="3" fill="#22c55e" stroke="#14532d" strokeWidth="1" className="ufo-light animate-[flashSlow_1.4s_infinite]" />
        <circle cx="52" cy="74" r="3" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="1" className="ufo-light animate-[flashSlow_1.4s_infinite]" style={{ animationDelay: '0.2s' }} />
        <circle cx="68" cy="77" r="3.5" fill="#eab308" stroke="#713f12" strokeWidth="1" className="ufo-light animate-[flashSlow_1.4s_infinite]" style={{ animationDelay: '0.4s' }} />
        <circle cx="80" cy="78" r="4.2" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" className="ufo-light animate-[flashSlow_1.4s_infinite]" style={{ animationDelay: '0.6s' }} />
        <circle cx="92" cy="77" r="3.5" fill="#eab308" stroke="#713f12" strokeWidth="1" className="ufo-light animate-[flashSlow_1.4s_infinite]" style={{ animationDelay: '0.8s' }} />
        <circle cx="108" cy="74" r="3" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="1" className="ufo-light animate-[flashSlow_1.4s_infinite]" style={{ animationDelay: '1.0s' }} />
        <circle cx="122" cy="68" r="3" fill="#22c55e" stroke="#14532d" strokeWidth="1" className="ufo-light animate-[flashSlow_1.4s_infinite]" style={{ animationDelay: '1.2s' }} />

        {/* --- BOTTOM PROPULSION HUB --- */}
        <path d="M 62,80 C 62,80 64,88 80,88 C 96,88 98,80 98,80 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
        <ellipse cx="80" cy="85" rx="10" ry="3.5" fill="#4ade80" className="animate-pulse" />
      </svg>
    </div>
  );
};

interface ChooseYourMissionCardProps {
  state: ExplorerState;
}

export const ChooseYourMissionCard: React.FC<ChooseYourMissionCardProps> = ({ state }) => {
  const [vehicle, setVehicle] = useState<'rocket' | 'ufo'>('rocket');
  const [isWarping, setIsWarping] = useState(false);

  // Total available missions from data.ts is 7
  const totalMissions = 7;
  const completedCount = state.completedMissions.length;
  const percentComplete = Math.round((completedCount / totalMissions) * 100);

  const handleVesselClick = () => {
    if (isWarping) return;
    setIsWarping(true);
    playSound('warp', state.soundEnabled);
    setTimeout(() => {
      setIsWarping(false);
    }, 8000);
  };

  const handleToggle = () => {
    playSound('click', state.soundEnabled);
    setVehicle(prev => (prev === 'rocket' ? 'ufo' : 'rocket'));
  };

  return (
    <div className="w-full bg-[#0e0422]/95 border-4 border-purple-700/80 rounded-lg p-5 relative shadow-[0_0_20px_rgba(124,58,237,0.3)] select-none">
      
      {/* Decorative Custom Corners (Yellow retro neon brackets) */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-yellow-400" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-yellow-400" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-cyan-400" />

      {/* Header Titles */}
      <div className="text-center mt-1">
        <h3 className="font-pixel text-xs text-cyan-400 tracking-wider font-bold animate-pulse">
          CHOOSE YOUR MISSION
        </h3>
        <div className="h-[2px] bg-purple-900/60 w-5/6 mx-auto my-3 border-b border-purple-950" />
        <p className="font-mono text-[11px] text-purple-200 px-2 leading-relaxed">
          Exciting events, challenges and experiences await you.
        </p>
      </div>

      {/* Animated Center Display Stage */}
      <div className="flex flex-col items-center justify-center py-4 my-2 relative overflow-hidden bg-purple-950/20 border border-purple-900/30 rounded min-h-[170px]">
        {/* Ambient grid lines behind spaceship */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(124,58,237,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.2)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
        
        {vehicle === 'rocket' ? (
          <HighFidelityRocket isWarping={isWarping} onClick={handleVesselClick} />
        ) : (
          <HighFidelityUfo isWarping={isWarping} onClick={handleVesselClick} />
        )}

        {/* Warp field visual effect overlay */}
        {isWarping && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center bg-cyan-950/20 animate-fade">
            <div className="font-pixel text-[8px] text-cyan-300 animate-pulse bg-black/70 border border-cyan-800 px-2 py-1 rounded">
              WARP DRIVE ENGAGED (8.0c)
            </div>
          </div>
        )}
      </div>

      {/* Toggle button to switch between rocket and UFO */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleToggle}
          className="font-pixel text-[8px] bg-purple-950/80 hover:bg-purple-900 text-purple-300 hover:text-white px-3 py-1.5 rounded border border-purple-800 hover:border-purple-500 cursor-pointer transition-all flex items-center gap-1.5 active:translate-y-0.5"
        >
          <span>SWITCH VESSEL TO:</span>
          <span className="text-yellow-400 font-bold uppercase">{vehicle === 'rocket' ? 'UFO' : 'Rocket'}</span>
        </button>
      </div>

      {/* Progress Section */}
      <div className="pt-3 border-t border-purple-950">
        <div className="text-center">
          <h4 className="font-pixel text-[10px] text-cyan-400 tracking-wider uppercase">
            MISSION PROGRESS
          </h4>
          
          {/* Progress stats centered */}
          <div className="font-pixel text-[11px] text-white my-2.5">
            {completedCount.toString().padStart(2, '0')} <span className="text-purple-400">/</span> {totalMissions.toString().padStart(2, '0')}
          </div>

          {/* Progress Bar with neon gradient styling */}
          <div className="w-full h-4 bg-[#0a0216] border-2 border-purple-900 rounded-sm overflow-hidden p-[2px] shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500 shadow-[0_0_8px_rgba(6,182,212,0.6)] transition-all duration-500 ease-out"
              style={{ width: `${Math.max(5, percentComplete)}%` }}
            />
          </div>

          <div className="mt-3.5 font-mono text-[9.5px] text-purple-300 leading-snug">
            Complete missions to earn Star Coins and unlock rewards!
          </div>
        </div>
      </div>

      {/* Styled inline keyframes to keep the components standalone and beautiful */}
      <style>{`
        @keyframes rocketHover {
          0%, 100% { transform: translateY(0px) rotate(42deg); }
          50% { transform: translateY(-8px) rotate(45deg); }
        }
        @keyframes ufoHover {
          0%, 100% { transform: translateY(0px) scale(0.95); }
          50% { transform: translateY(-10px) scale(1); }
        }
        @keyframes exhaustFlicker {
          0%, 100% { transform: scaleY(1) scaleX(1); opacity: 0.85; }
          50% { transform: scaleY(1.28) scaleX(0.92); opacity: 1; }
        }
        .ufo-light {
          filter: drop-shadow(0 0 3px currentColor);
        }
        @keyframes flashSlow {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1; }
        }
        .smoke-particle {
          transform-box: fill-box;
          transform-origin: center;
        }
        @keyframes smokeDriftLeft {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          15% { opacity: 0.7; }
          100% { transform: translate(-15px, 28px) scale(2.2); opacity: 0; }
        }
        @keyframes smokeDriftRight {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          15% { opacity: 0.7; }
          100% { transform: translate(15px, 28px) scale(2.2); opacity: 0; }
        }
        @keyframes smokeDriftCenter {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          15% { opacity: 0.8; }
          100% { transform: translate(0, 34px) scale(2.5); opacity: 0; }
        }
        @keyframes warpDrive {
          0% { transform: scale(1) translateY(0) rotate(42deg); filter: blur(0); opacity: 1; }
          20% { transform: scale(0.9) translateY(15px) rotate(42deg); filter: blur(1px); opacity: 0.9; }
          50% { transform: scale(0.2, 2.5) translateY(-250px) rotate(42deg); filter: blur(12px); opacity: 0.15; }
          51% { transform: scale(0.1, 3.5) translateY(250px) rotate(42deg); opacity: 0; }
          80% { transform: scale(1.2, 0.7) translateY(-10px) rotate(42deg); filter: blur(2px); opacity: 0.8; }
          100% { transform: scale(1) translateY(0) rotate(42deg); filter: blur(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};