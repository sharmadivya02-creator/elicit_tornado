"use client";

import React, { useState } from 'react';
import { ExplorerState } from '../types';
import { playSound } from '../utils/sound';
import { PixelStarCoin, PixelTrophy, PixelStar } from './PixelArtwork';
import { Award, Shield, Cpu, RefreshCw, Sparkles, User, Orbit, Star, Check } from 'lucide-react';

interface ProfileViewProps {
  state: ExplorerState;
  explorerName: string;
  setExplorerName: (name: string) => void;
  updateState: (newState: Partial<ExplorerState>) => void;
  onClose: () => void;
  addCoins: (amount: number) => void;
  addXp: (amount: number) => void;
  triggerToast: (title: string, desc: string, icon?: string) => void;
}


const VISOR_COLORS = [
  { id: 'gold', name: 'Solar Gold', color: '#facc15', glow: 'rgba(250,204,21,0.6)' },
  { id: 'cyan', name: 'Cyber Cyan', color: '#22d3ee', glow: 'rgba(34,211,238,0.6)' },
  { id: 'violet', name: 'Stellar Violet', color: '#c084fc', glow: 'rgba(192,132,252,0.6)' },
  { id: 'emerald', name: 'Matrix Green', color: '#34d399', glow: 'rgba(52,211,153,0.6)' },
  { id: 'rose', name: 'Nova Rose', color: '#f43f5e', glow: 'rgba(244,63,94,0.6)' },
  { id: 'sapphire', name: 'Hyper Blue', color: '#3b82f6', glow: 'rgba(59,130,246,0.6)' }
];

const BADGE_ICONS = [
  { id: 'star' as const, name: 'Stardust Star', icon: '⭐' },
  { id: 'rocket' as const, name: 'Warp Rocket', icon: '🚀' },
  { id: 'atom' as const, name: 'Quantum Atom', icon: '⚛️' },
  { id: 'shield' as const, name: 'Fleet Shield', icon: '🛡️' }
];

const FUTURISTIC_PREFIXES = ['COSMO', 'MAJOR', 'SAGAN', 'CYPHER', 'ZENITH', 'VEGA', 'ORION', 'TITAN', 'NOVA', 'ECHO', 'ATLAS', 'APOLLO', 'VALKYRIE', 'HYDRA'];
const FUTURISTIC_SUFFIXES = ['PRIME', 'QUANTUM', 'ZERO', 'WARP', 'PIONEER', 'SCOUT', 'APEX', 'MATRIX', 'ROVER', 'VANGUARD', 'PHOENIX', 'INFINITY', 'VOYAGER', 'FLUX'];

export const ProfileView: React.FC<ProfileViewProps> = ({
  state,
  explorerName,
  setExplorerName,
  updateState,
  onClose,
  addCoins,
  addXp,
  triggerToast
}) => {
  const currentVisorColor = state.visorColor || '#22d3ee';
  const currentBadge = state.badgeIcon || 'star';

  const handleSelectVisor = (colorValue: string) => {
    playSound('click', state.soundEnabled);
    updateState({ visorColor: colorValue });
  };

  const handleSelectBadge = (badgeId: typeof BADGE_ICONS[number]['id']) => {
    playSound('click', state.soundEnabled);
    updateState({ badgeIcon: badgeId });
  };

  const randomizeName = () => {
    playSound('warp', state.soundEnabled);
    const pref = FUTURISTIC_PREFIXES[Math.floor(Math.random() * FUTURISTIC_PREFIXES.length)];
    const suff = FUTURISTIC_SUFFIXES[Math.floor(Math.random() * FUTURISTIC_SUFFIXES.length)];
    const number = Math.floor(10 + Math.random() * 90);
    const newName = `${pref}_${suff}_${number}`;
    setExplorerName(newName);
    triggerToast('Designation Updated', `Astronaut registered as ${newName}!`, '📟');
  };

  // Get active rank name based on level
  const getRankName = (lvl: number) => {
    if (lvl >= 10) return 'GALAXY LEGEND 👑';
    if (lvl >= 7) return 'FLEET ADMIRAL 🛡️';
    if (lvl >= 5) return 'STARSHIP COMMANDER 🚀';
    if (lvl >= 3) return 'VOYAGER OFFICER 🪐';
    return 'CADET RECRUIT 🛰️';
  };

  const activeVisorDetails = VISOR_COLORS.find(c => c.color === currentVisorColor) || VISOR_COLORS[1];

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[150] px-4 py-6 md:py-12 overflow-y-auto backdrop-blur-md select-none animate-[fadeIn_0.35s_ease-out]">
      <div className="relative w-full max-w-5xl bg-[#09021a] border-4 border-purple-700 rounded-lg p-5 md:p-8 shadow-[0_0_50px_rgba(124,58,237,0.5)] my-auto max-h-[95vh] overflow-y-auto">
        
        {/* Retro Yellow Corners */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-yellow-400" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-yellow-400" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-cyan-400" />

        {/* Close Button */}
        <button
          onClick={() => { playSound('click', state.soundEnabled); onClose(); }}
          className="absolute top-4 right-4 font-pixel text-[10px] text-purple-400 hover:text-white px-3 py-2 bg-[#12052c] border-2 border-purple-800 rounded hover:border-purple-400 cursor-pointer transition-all active:translate-y-0.5"
        >
          [X] CLOSE TERMINAL
        </button>

        {/* Title */}
        <div className="text-center mb-8 mt-4 md:mt-0">
          <span className="font-pixel text-[9px] text-cyan-400 tracking-[0.3em] block mb-2 uppercase animate-pulse">
            ✦ STARFLEET PERSONNEL SYSTEM v2.6 ✦
          </span>
          <h2 className="font-pixel text-2xl md:text-3xl text-white tracking-wider uppercase">
            ASTRONAUT <span className="text-yellow-400">REGISTRATION</span>
          </h2>
          <div className="h-[2px] bg-purple-900/50 w-2/3 mx-auto mt-4 border-b border-purple-950" />
        </div>

        {/* Two-Column Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Visual customization stage and High-Fidelity Interactive Space Suit */}
          <div className="lg:col-span-5 flex flex-col items-center gap-6 bg-purple-955/20 border-2 border-purple-900/40 p-5 rounded-lg relative overflow-hidden">
            {/* Background cyber grid */}
            <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(124,58,237,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.2)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            
            <div className="text-center z-10 w-full">
              <span className="font-pixel text-[8px] text-purple-400 block mb-1">ASTRONAUT DESIGNATOR PREVIEW</span>
              <div className="font-pixel text-xs text-yellow-400 tracking-wide truncate max-w-full">
                {explorerName}
              </div>
            </div>

            {/* HIGH FIDELITY INTERACTIVE SUIT SVG DISPLAY */}
            <div className="relative w-64 h-64 flex items-center justify-center bg-purple-950/20 border border-purple-900/40 rounded p-4 shadow-inner">
              
              {/* Dynamic decorative backdrop circles */}
              <div className="absolute w-44 h-44 rounded-full border-2 border-purple-900/20 animate-[spin_20s_linear_infinite]" />
              <div className="absolute w-48 h-48 rounded-full border border-dashed border-cyan-800/20 animate-[spin_40s_linear_infinite_reverse]" />

              {/* HIGH FIDELITY SUIT HELMET & VISOR */}
              <svg 
                viewBox="0 0 200 200" 
                className="w-full h-full z-10 drop-shadow-[0_0_20px_rgba(147,51,234,0.3)] animate-[rocketHover_4s_ease-in-out_infinite]"
              >
                <defs>
                  {/* Suit White/Gray gradient */}
                  <linearGradient id="suitBase" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="60%" stopColor="#e5e7eb" />
                    <stop offset="100%" stopColor="#9ca3af" />
                  </linearGradient>

                  <linearGradient id="suitDark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4b5563" />
                    <stop offset="100%" stopColor="#111827" />
                  </linearGradient>

                  {/* Dynamic Visor reflection */}
                  <linearGradient id="visorReflect" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                    <stop offset="40%" stopColor="#ffffff" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Visor Color Glow */}
                  <radialGradient id="visorInnerGlow" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
                    <stop offset="70%" stopColor={currentVisorColor} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={currentVisorColor} stopOpacity="1" />
                  </radialGradient>
                </defs>

                {/* --- ASTRONAUT SUIT CHEST & COLLAR --- */}
                {/* Back shoulders */}
                <path d="M 40,165 Q 100,140 160,165 L 175,200 L 25,200 Z" fill="url(#suitDark)" stroke="#111827" strokeWidth="3" />
                
                {/* Main shoulders */}
                <path d="M 45,170 Q 100,145 155,170 L 165,200 L 35,200 Z" fill="url(#suitBase)" stroke="#1f2937" strokeWidth="3.5" />
                
                {/* Red/cyan trim shoulder pads */}
                <path d="M 45,170 Q 70,158 90,174" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                <path d="M 155,170 Q 130,158 110,174" fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />

                {/* --- COLLAR PORT --- */}
                <ellipse cx="100" cy="154" rx="42" ry="12" fill="#1f2937" stroke="#111827" strokeWidth="3" />
                <ellipse cx="100" cy="154" rx="38" ry="9" fill="#0f172a" />

                {/* --- EMBROIDERED BADGE ON SUIT --- */}
                <g transform="translate(100, 178) scale(0.9)">
                  {/* Embroidered background */}
                  <circle cx="0" cy="0" r="10" fill="#050110" stroke="#facc15" strokeWidth="1.5" />
                  {/* Emblem rendering */}
                  {currentBadge === 'star' && <path d="M 0,-6 L 2,-2 L 6,-2 L 3,1 L 4.5,5 L 0,3 L -4.5,5 L -3,1 L -6,-2 L -2,-2 Z" fill="#facc15" />}
                  {currentBadge === 'rocket' && <path d="M -2,4 L -2,-4 Q 0,-8 2,-4 L 2,4 L 4,6 L -4,6 Z M -4,6 L -6,8 L -4,8 Z M 4,6 L 6,8 L 4,8 Z" fill="#38bdf8" />}
                  {currentBadge === 'atom' && (
                    <g stroke="#a855f7" strokeWidth="1" fill="none">
                      <ellipse cx="0" cy="0" rx="6" ry="1.8" transform="rotate(30)" />
                      <ellipse cx="0" cy="0" rx="6" ry="1.8" transform="rotate(-30)" />
                      <circle cx="0" cy="0" r="1.5" fill="#facc15" stroke="none" />
                    </g>
                  )}
                  {currentBadge === 'shield' && <path d="M -5,-5 L 5,-5 L 5,0 C 5,4 0,7 0,7 C 0,7 -5,4 -5,0 Z" fill="#f43f5e" />}
                </g>

                {/* --- SIDE BACKPACKS / REGULATORS --- */}
                <rect x="26" y="80" width="14" height="40" rx="4" fill="#374151" stroke="#111827" strokeWidth="2.5" />
                <rect x="160" y="80" width="14" height="40" rx="4" fill="#374151" stroke="#111827" strokeWidth="2.5" />

                {/* --- HELMET BASICS --- */}
                {/* Main large helmet sphere */}
                <circle cx="100" cy="94" r="54" fill="url(#suitBase)" stroke="#111827" strokeWidth="4.5" />
                
                {/* White highlight side curve */}
                <path d="M 52,94 A 48,48 0 0 1 148,94" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.4" />

                {/* Side Ear Antennas / Comms Dials */}
                <rect x="40" y="84" width="8" height="20" rx="2" fill="#1f2937" stroke="#111827" strokeWidth="2" />
                <rect x="152" y="84" width="8" height="20" rx="2" fill="#1f2937" stroke="#111827" strokeWidth="2" />
                <line x1="44" y1="84" x2="44" y2="64" stroke="#111827" strokeWidth="2.5" />
                <circle cx="44" cy="62" r="3.5" fill="#f43f5e" className="animate-ping" style={{ transformOrigin: '44px 62px' }} />
                <circle cx="44" cy="62" r="3" fill="#f43f5e" />

                {/* --- CHROME SHIELD FRAME --- */}
                <ellipse cx="100" cy="94" rx="43" ry="34" fill="#111827" />

                {/* --- GLOWING NEON VISOR GLASS --- */}
                <ellipse cx="100" cy="94" rx="39" ry="30" fill="url(#visorInnerGlow)" />
                
                {/* Glass reflection gradient */}
                <ellipse cx="100" cy="94" rx="39" ry="30" fill="url(#visorReflect)" opacity="0.3" />

                {/* Visor internal horizon line */}
                <path d="M 62,94 Q 100,104 138,94" fill="none" stroke={currentVisorColor} strokeWidth="1.5" opacity="0.5" />

                {/* Cyber HUD elements reflected in visor (small details) */}
                <path d="M 72,82 L 80,82 L 80,86" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.65" />
                <circle cx="124" cy="84" r="1.5" fill="#22c55e" opacity="0.8" className="animate-pulse" />
                <circle cx="120" cy="84" r="1" fill="#ef4444" opacity="0.8" />
                
                {/* Sleek diagonal reflection highlights */}
                <path d="M 75,76 Q 100,68 125,76" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.45" strokeLinecap="round" />
              </svg>

              {/* Visor color name badge overlay */}
              <span className="absolute bottom-3 font-pixel text-[8px] px-2 py-1 bg-black/80 border border-purple-900 rounded text-purple-300">
                VISOR FIELD: <span style={{ color: currentVisorColor }}>{activeVisorDetails.name}</span>
              </span>
            </div>

            {/* Customizer Instructions */}
            <div className="w-full bg-[#12052c] border border-purple-900 p-3 rounded text-center">
              <p className="font-mono text-[10.5px] text-purple-300">
                Design details are saved locally to your starship console.
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: Name Registry, Visor, Badges, Class selection, and Stats */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* 1. NAME REGISTRATION & RANDOMIZER */}
            <div className="bg-[#12052c] border-2 border-purple-900 p-4 rounded-lg flex flex-col gap-3">
              <span className="font-pixel text-[8px] text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <User size={12} /> Astronaut Designation
              </span>
              
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={explorerName}
                  onChange={(e) => {
                    const cleanVal = e.target.value.replace(/[^A-Za-z0-9_ -]/g, '');
                    setExplorerName(cleanVal.slice(0, 18).toUpperCase());
                  }}
                  placeholder="ENTER DESIGNATION..."
                  className="flex-grow font-mono text-sm text-white bg-[#070114] border-2 border-purple-800 rounded p-3 focus:border-yellow-400 outline-none uppercase font-bold tracking-wider"
                />
                
                <button
                  onClick={randomizeName}
                  className="font-pixel text-[9px] bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-3 rounded hover:scale-102 border-b-4 border-cyan-800 font-bold active:translate-y-0.5 flex items-center justify-center gap-1.5 cursor-pointer transition-all flex-shrink-0"
                >
                  <RefreshCw size={12} />
                  <span>RANDOMIZE</span>
                </button>
              </div>
              <span className="font-mono text-[9px] text-purple-400 font-medium">
                * Starfleet guidelines recommend uppercase letters, underscores, and telemetry numbers.
              </span>
            </div>

            {/* 2. VISOR FIELD & SUIT BADGE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Visor selection */}
              <div className="bg-[#12052c] border border-purple-900 p-4 rounded-lg flex flex-col gap-3">
                <span className="font-pixel text-[8px] text-cyan-400 uppercase tracking-wider block">
                  ⚙️ Visor Shield Color
                </span>
                
                <div className="grid grid-cols-6 gap-2">
                  {VISOR_COLORS.map((c) => {
                    const isSelected = currentVisorColor === c.color;
                    return (
                      <button
                        key={c.id}
                        onClick={() => handleSelectVisor(c.color)}
                        className={`w-10 h-10 rounded-full border-3 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95`}
                        style={{ 
                          backgroundColor: c.color, 
                          borderColor: isSelected ? '#ffffff' : '#12052c',
                          boxShadow: isSelected ? `0 0 10px ${c.glow}` : 'none'
                        }}
                        title={c.name}
                      >
                        {isSelected && <Check size={16} className="text-black stroke-[3.5]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Suit badge selection */}
              <div className="bg-[#12052c] border border-purple-900 p-4 rounded-lg flex flex-col gap-3">
                <span className="font-pixel text-[8px] text-cyan-400 uppercase tracking-wider block">
                  🛡️ Embroidered Suit Crest
                </span>
                
                <div className="grid grid-cols-4 gap-2.5">
                  {BADGE_ICONS.map((badge) => {
                    const isSelected = currentBadge === badge.id;
                    return (
                      <button
                        key={badge.id}
                        onClick={() => handleSelectBadge(badge.id)}
                        className={`py-2 rounded-md border-2 font-pixel text-xs transition-all cursor-pointer flex flex-col items-center gap-1 hover:scale-105 ${
                          isSelected 
                            ? 'bg-purple-950 border-yellow-500 text-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.25)]' 
                            : 'bg-[#070114]/60 border-purple-950 text-purple-300 hover:border-purple-800'
                        }`}
                        title={badge.name}
                      >
                        <span className="text-lg leading-none">{badge.icon}</span>
                        <span className="text-[7px] leading-none uppercase tracking-tight">{badge.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* 3. EXP & CADET ACHIEVEMENT RECORDS */}
            <div className="bg-[#0b011d] border-2 border-purple-900 rounded-lg p-5">
              <span className="font-pixel text-[9px] text-yellow-400 uppercase tracking-widest block mb-4">
                🏆 OFFICIAL STARFLEET MISSION MATRIX
              </span>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 text-center">
                <div className="bg-[#12052c] border border-purple-950 p-3 rounded">
                  <span className="font-pixel text-[8px] text-purple-400 block uppercase mb-1">Rank Title</span>
                  <span className="font-mono text-xs text-white font-bold block truncate" title={getRankName(state.level)}>
                    {getRankName(state.level).split(' ')[0]}
                  </span>
                </div>

                <div className="bg-[#12052c] border border-purple-950 p-3 rounded">
                  <span className="font-pixel text-[8px] text-purple-400 block uppercase mb-1">Missions Clear</span>
                  <span className="font-mono text-sm text-cyan-400 font-extrabold block">
                    {state.completedMissions.length} / 7
                  </span>
                </div>

                <div className="bg-[#12052c] border border-purple-950 p-3 rounded">
                  <span className="font-pixel text-[8px] text-purple-400 block uppercase mb-1">Cosmic Coins</span>
                  <span className="font-mono text-sm text-yellow-400 font-extrabold block">
                    {state.coins} 🪙
                  </span>
                </div>

                <div className="bg-[#12052c] border border-purple-950 p-3 rounded">
                  <span className="font-pixel text-[8px] text-purple-400 block uppercase mb-1">Achievements</span>
                  <span className="font-mono text-sm text-purple-300 font-extrabold block">
                    {state.achievements.length} / 6
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
