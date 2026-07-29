"use client";

import React from 'react';

// Common classes for pixel-art SVGs
const svgProps = {
  viewBox: "0 0 64 64",
  className: "w-full h-full",
  style: { imageRendering: 'pixelated' as any }
};

export const PixelEarth: React.FC = () => (
  <svg {...svgProps}>
    {/* Shadow layer */}
    <circle cx="32" cy="32" r="28" fill="#1d153a" />
    {/* Base blue planet */}
    <circle cx="30" cy="30" r="26" fill="#1b5cb8" />
    {/* Shadow overlay on blue */}
    <path d="M 30,4 C 44,4 56,16 56,30 C 56,36 53,42 49,46 C 42,32 28,15 14,14 C 18,8 24,4 30,4 Z" fill="#12408a" />
    {/* Continents - Green pixel shapes */}
    {/* North America / Greenland */}
    <rect x="14" y="10" width="8" height="6" fill="#2da144" />
    <rect x="18" y="14" width="10" height="8" fill="#2da144" />
    <rect x="24" y="18" width="6" height="4" fill="#36c253" />
    {/* South America */}
    <rect x="12" y="32" width="6" height="12" fill="#2da144" />
    <rect x="16" y="36" width="6" height="10" fill="#2da144" />
    <rect x="14" y="44" width="4" height="6" fill="#1d6e2c" />
    {/* Africa / Europe */}
    <rect x="36" y="14" width="12" height="10" fill="#2da144" />
    <rect x="34" y="20" width="14" height="14" fill="#2da144" />
    <rect x="32" y="24" width="6" height="10" fill="#36c253" />
    <rect x="38" y="32" width="8" height="14" fill="#1d6e2c" />
    {/* Asia / Australia */}
    <rect x="46" y="10" width="8" height="8" fill="#2da144" />
    <rect x="50" y="28" width="6" height="8" fill="#2da144" />
    {/* Atmosphere glow edge */}
    <circle cx="30" cy="30" r="26" stroke="#4da2ff" strokeWidth="2" fill="none" opacity="0.6" />
  </svg>
);

export const PixelOrange: React.FC = () => (
  <svg {...svgProps}>
    {/* Ring Back */}
    <path d="M 4,32 C 4,28 60,28 60,32" stroke="#d97706" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
    {/* Base orange body */}
    <circle cx="32" cy="32" r="22" fill="#d9540b" />
    {/* Dark orange stripe */}
    <rect x="12" y="20" width="40" height="4" fill="#ad3a02" />
    <rect x="10" y="24" width="44" height="4" fill="#ad3a02" />
    {/* Light yellow/orange stripes */}
    <rect x="14" y="38" width="36" height="4" fill="#f59e0b" />
    <rect x="18" y="14" width="28" height="3" fill="#f59e0b" />
    <rect x="22" y="44" width="20" height="3" fill="#ad3a02" />
    {/* Shadow overlay */}
    <path d="M 32,10 C 44,10 54,20 54,32 C 54,44 44,54 32,54 C 32,54 44,42 44,32 C 44,22 32,10 32,10 Z" fill="#913000" opacity="0.4" />
    {/* Ring Front */}
    <path d="M 2,32 C 2,38 62,38 62,32" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M 12,34 C 12,36 52,36 52,34" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.5" />
  </svg>
);

export const PixelTeal: React.FC = () => (
  <svg {...svgProps}>
    {/* Base cyan/teal body */}
    <circle cx="32" cy="32" r="24" fill="#0d9488" />
    {/* Light cyan swirly pattern */}
    <path d="M 16,24 C 24,18 40,18 48,24" stroke="#2dd4bf" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M 12,34 C 20,28 44,28 52,34" stroke="#2dd4bf" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M 18,44 C 24,40 38,40 46,44" stroke="#115e59" strokeWidth="3" fill="none" strokeLinecap="round" />
    {/* Shadow overlay */}
    <path d="M 32,8 C 45,8 56,19 56,32 C 56,45 45,56 32,56 C 32,56 46,44 46,32 C 46,20 32,8 32,8 Z" fill="#0f172a" opacity="0.4" />
    {/* Sparkles */}
    <rect x="22" y="16" width="2" height="2" fill="#ffffff" />
    <rect x="42" y="38" width="3" height="3" fill="#ffffff" />
  </svg>
);

export const PixelBlue: React.FC = () => (
  <svg {...svgProps}>
    <circle cx="32" cy="32" r="24" fill="#0284c7" />
    <path d="M 14,22 Q 32,12 50,22" stroke="#38bdf8" strokeWidth="3" fill="none" />
    <path d="M 10,32 Q 32,22 54,32" stroke="#38bdf8" strokeWidth="4" fill="none" />
    <path d="M 14,42 Q 32,32 50,42" stroke="#0369a1" strokeWidth="3" fill="none" />
    {/* Craters */}
    <circle cx="24" cy="20" r="3" fill="#0369a1" />
    <circle cx="42" cy="28" r="4" fill="#0369a1" />
    <circle cx="28" cy="40" r="3" fill="#0369a1" />
    {/* Crater rims */}
    <path d="M 22,21 A 3,3 0 0 1 25,18" stroke="#38bdf8" strokeWidth="1" fill="none" />
    <path d="M 39,29 A 4,4 0 0 1 43,25" stroke="#38bdf8" strokeWidth="1" fill="none" />
    {/* Shadow overlay */}
    <path d="M 32,8 C 45,8 56,19 56,32 C 56,45 45,56 32,56 Q 44,44 44,32 Q 44,20 32,8 Z" fill="#0f172a" opacity="0.45" />
  </svg>
);

export const PixelPurple: React.FC = () => (
  <svg {...svgProps}>
    {/* Planetary ring back */}
    <path d="M 2,36 Q 32,16 62,36" stroke="#c084fc" strokeWidth="5" fill="none" opacity="0.7" />
    {/* Base violet body */}
    <circle cx="32" cy="32" r="23" fill="#7c3aed" />
    {/* Star spots */}
    <rect x="20" y="20" width="4" height="4" fill="#a78bfa" />
    <rect x="40" y="24" width="6" height="4" fill="#a78bfa" />
    <rect x="22" y="38" width="8" height="4" fill="#6d28d9" />
    <rect x="36" y="42" width="6" height="3" fill="#6d28d9" />
    {/* Shadow overlay */}
    <path d="M 32,9 C 45,9 55,19 55,32 C 55,45 45,55 32,55 C 32,55 45,43 45,32 C 45,21 32,9 32,9 Z" fill="#2e1065" opacity="0.5" />
    {/* Planetary ring front */}
    <path d="M 0,34 Q 32,54 64,34" stroke="#a78bfa" strokeWidth="5" fill="none" />
    <path d="M 8,35 Q 32,51 56,35" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.6" />
  </svg>
);

// Animated flying/standing cartoon vector chibi astronaut, matching the cute Etsy reference image
export const PixelAstronaut: React.FC<{ pose?: 'standing' | 'floating' | 'holding-flag', className?: string }> = ({ pose = 'standing', className }) => {
  return (
    <div className={`relative ${className || 'w-24 h-24'} select-none`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(147,51,234,0.35)]">
        {/* Animation container */}
        <g className={pose !== 'standing' ? 'animate-bounce' : 'animate-[pulse_4s_infinite]'}>
          {/* Base shadow (only if standing) */}
          {pose === 'standing' && (
            <ellipse cx="50" cy="90" rx="22" ry="4" fill="#0c041c" opacity="0.6" />
          )}

          {/* Backpack (Jetpack tank) on the left back */}
          <rect x="28" y="46" width="12" height="24" rx="4" fill="#2563eb" stroke="#1e293b" strokeWidth="2.5" />
          <rect x="28" y="50" width="12" height="4" fill="#fbbf24" />
          <rect x="28" y="58" width="12" height="4" fill="#38bdf8" />
          
          {/* Flame effects if floating/flying */}
          {pose !== 'standing' && (
            <g className="animate-pulse">
              <path d="M 30,70 L 25,82 L 34,76 Z" fill="#f97316" stroke="#1e293b" strokeWidth="1.5" />
              <path d="M 31,70 L 29,86 L 36,78 Z" fill="#ef4444" />
            </g>
          )}

          {/* Left Arm (can be holding flag or normal) */}
          {pose === 'holding-flag' ? (
            <g>
              {/* Arm reaching to flag */}
              <path d="M 38,58 Q 28,54 22,46" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
              <path d="M 38,58 Q 28,54 22,46" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
              {/* Gold/Yellow shoulder band */}
              <path d="M 34,56 C 32,54 30,52 29,49" fill="none" stroke="#facc15" strokeWidth="5" />
              {/* Blue glove */}
              <circle cx="21" cy="45" r="4.5" fill="#2563eb" stroke="#1e293b" strokeWidth="2" />
            </g>
          ) : (
            <g>
              {/* Left Arm resting */}
              <path d="M 38,58 Q 30,62 33,70" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
              <path d="M 38,58 Q 30,62 33,70" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
              {/* Gold/Yellow shoulder band */}
              <path d="M 35,61 Q 32,63 33,66" fill="none" stroke="#facc15" strokeWidth="5" />
              {/* Blue glove */}
              <circle cx="34" cy="71" r="4.5" fill="#2563eb" stroke="#1e293b" strokeWidth="2" />
            </g>
          )}

          {/* Right Arm */}
          <g>
            {/* Right Arm resting */}
            <path d="M 62,58 Q 70,62 67,70" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
            <path d="M 62,58 Q 70,62 67,70" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
            {/* Gold/Yellow shoulder band */}
            <path d="M 65,61 Q 68,63 67,66" fill="none" stroke="#facc15" strokeWidth="5" />
            {/* Blue glove */}
            <circle cx="66" cy="71" r="4.5" fill="#2563eb" stroke="#1e293b" strokeWidth="2" />
          </g>

          {/* Short Chubby Legs & Feet */}
          {/* Left Leg */}
          <rect x="37" y="70" width="10" height="13" rx="3" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
          <rect x="35" y="79" width="13" height="8" rx="3" fill="#2563eb" stroke="#1e293b" strokeWidth="2.5" />
          <rect x="35" y="84" width="13" height="3" rx="1" fill="#38bdf8" />
          <ellipse cx="38" cy="82" rx="2" ry="1" fill="#ffffff" opacity="0.8" />

          {/* Right Leg */}
          <rect x="53" y="70" width="10" height="13" rx="3" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
          <rect x="52" y="79" width="13" height="8" rx="3" fill="#2563eb" stroke="#1e293b" strokeWidth="2.5" />
          <rect x="52" y="84" width="13" height="3" rx="1" fill="#38bdf8" />
          <ellipse cx="55" cy="82" rx="2" ry="1" fill="#ffffff" opacity="0.8" />

          {/* Torso Suit Body */}
          <rect x="38" y="52" width="24" height="22" rx="6" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
          
          {/* Chest plate control box (Cyan/Blue interior, gold button) */}
          <rect x="44" y="58" width="12" height="10" rx="2" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
          <rect x="46" y="60" width="8" height="6" rx="1.5" fill="#2563eb" />
          <circle cx="50" cy="63" r="1.5" fill="#facc15" stroke="#1e293b" strokeWidth="1" />

          {/* Helmet Head (Large, round, cute chibi proportions!) */}
          <circle cx="50" cy="33" r="24" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
          
          {/* Subtle lower helmet shadow */}
          <path d="M 27.5,39 A 24,24 0 0 0 72.5,39 Z" fill="#cbd5e1" opacity="0.3" />

          {/* Blue circular Ear Pieces on the side of helmet */}
          {/* Left Ear Piece */}
          <circle cx="25" cy="33" r="5" fill="#2563eb" stroke="#1e293b" strokeWidth="2.5" />
          <circle cx="25" cy="33" r="2" fill="#38bdf8" />
          {/* Right Ear Piece */}
          <circle cx="75" cy="33" r="5" fill="#2563eb" stroke="#1e293b" strokeWidth="2.5" />
          <circle cx="75" cy="33" r="2" fill="#38bdf8" />

          {/* Helmet Collar Neck Joint Rim */}
          <rect x="40" y="52" width="20" height="4" rx="2" fill="#cbd5e1" stroke="#1e293b" strokeWidth="2.5" />
          <rect x="44" y="53" width="12" height="2" fill="#facc15" />

          {/* Visor (Clean, beautifully curved) */}
          {/* Visor Outer Rim Border (Gold/Yellow) */}
          <rect x="31" y="21" width="38" height="24" rx="12" fill="#facc15" stroke="#1e293b" strokeWidth="2.5" />
          {/* Dark Shiny Inner Visor */}
          <rect x="34" y="23" width="32" height="20" rx="10" fill="#18181b" stroke="#1e293b" strokeWidth="2" />

          {/* Visor Glossy Reflections */}
          <ellipse cx="42" cy="28" rx="5" ry="3" fill="#ffffff" transform="rotate(-15 42 28)" />
          <circle cx="58" cy="35" r="1.5" fill="#38bdf8" opacity="0.8" />
          <circle cx="61" cy="33" r="0.8" fill="#ffffff" />
          <path d="M 38,25 C 44,24 56,24 62,25" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
        </g>

        {/* Flag Pole and ACM/ELICIT Flag if requested */}
        {pose === 'holding-flag' && (
          <g className="animate-bounce">
            {/* Pole */}
            <rect x="7" y="4" width="2" height="54" fill="#111827" rx="1" />
            <rect x="7" y="6" width="2" height="52" fill="#9ca3af" />
            <circle cx="8" cy="4" r="2" fill="#facc15" stroke="#111827" strokeWidth="1.5" />
            
            {/* Flag cloth */}
            <path d="M 9,6 L 33,6 L 29,13 L 33,20 L 9,20 Z" fill="#7c3aed" stroke="#111827" strokeWidth="2" />
            {/* Gold crown or star on flag */}
            <polygon points="17,10 19,14 23,14 20,16 21,20 17,18 13,20 14,16 11,14 15,14" fill="#facc15" />
          </g>
        )}
      </svg>
    </div>
  );
};

// Animated Space Station / Base
export const PixelSpaceStation: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`relative ${className || 'w-48 h-48'} select-none animate-[pulse_6s_infinite]`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">
        {/* Space Station floating up and down */}
        <g className="animate-[bounce_5s_infinite]">
          {/* Connecting trusses */}
          <rect x="25" y="47" width="50" height="6" fill="#4b5563" stroke="#111827" strokeWidth="2" />
          <rect x="47" y="20" width="6" height="60" fill="#4b5563" stroke="#111827" strokeWidth="2" />

          {/* Left Solar Panels */}
          <g>
            <rect x="10" y="32" width="12" height="36" fill="#1e293b" stroke="#111827" strokeWidth="2" />
            <line x1="10" y1="41" x2="22" y2="41" stroke="#06b6d4" strokeWidth="1.5" />
            <line x1="10" y1="50" x2="22" y2="50" stroke="#06b6d4" strokeWidth="1.5" />
            <line x1="10" y1="59" x2="22" y2="59" stroke="#06b6d4" strokeWidth="1.5" />
            <rect x="8" y="44" width="2" height="12" fill="#d97706" />
          </g>

          {/* Right Solar Panels */}
          <g>
            <rect x="78" y="32" width="12" height="36" fill="#1e293b" stroke="#111827" strokeWidth="2" />
            <line x1="78" y1="41" x2="90" y2="41" stroke="#06b6d4" strokeWidth="1.5" />
            <line x1="78" y1="50" x2="90" y2="50" stroke="#06b6d4" strokeWidth="1.5" />
            <line x1="78" y1="59" x2="90" y2="59" stroke="#06b6d4" strokeWidth="1.5" />
            <rect x="90" y="44" width="2" height="12" fill="#d97706" />
          </g>

          {/* Central Sphere / Core */}
          <circle cx="50" cy="50" r="14" fill="#f3f4f6" stroke="#111827" strokeWidth="2.5" />
          {/* Reactor ring window */}
          <circle cx="50" cy="50" r="8" fill="#06b6d4" stroke="#0891b2" strokeWidth="1.5" className="animate-pulse" />
          <circle cx="50" cy="50" r="4" fill="#ffffff" />

          {/* Top Observatory Dome */}
          <path d="M 40,24 C 40,15 60,15 60,24 Z" fill="#e5e7eb" stroke="#111827" strokeWidth="2" />
          <rect x="47" y="16" width="6" height="4" fill="#3b82f6" />
          {/* Rotating antenna array on top */}
          <line x1="50" y1="14" x2="50" y2="4" stroke="#9ca3af" strokeWidth="1.5" />
          <path d="M 44,6 Q 50,2 56,6" fill="none" stroke="#d97706" strokeWidth="2" />
          <circle cx="50" cy="2" r="1.5" fill="#ef4444" className="animate-pulse" />

          {/* Bottom Module */}
          <rect x="42" y="70" width="16" height="12" rx="2" fill="#e5e7eb" stroke="#111827" strokeWidth="2" />
          <circle cx="46" cy="76" r="1.5" fill="#10b981" />
          <circle cx="50" cy="76" r="1.5" fill="#f59e0b" />
          <circle cx="54" cy="76" r="1.5" fill="#ef4444" />
          {/* Communication dish */}
          <path d="M 38,82 Q 50,94 62,82" fill="none" stroke="#6b7280" strokeWidth="2.5" />
          <line x1="50" y1="80" x2="50" y2="88" stroke="#3b82f6" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
};

// Retro animated Rocket
export const PixelRocket: React.FC<{ className?: string, isLaunching?: boolean }> = ({ className, isLaunching = false }) => {
  return (
    <div className={`relative ${className || 'w-24 h-24'} select-none`}>
      <svg viewBox="0 0 64 64" className={`w-full h-full drop-shadow-[0_0_15px_rgba(239,68,68,0.4)] ${isLaunching ? 'animate-[bounce_0.2s_infinite]' : 'animate-[bounce_3s_infinite]'}`}>
        <g transform={isLaunching ? "translate(0, -5)" : "translate(0,0)"}>
          {/* Booster Thruster Fire */}
          <g className="animate-pulse">
            <polygon points="32,60 26,46 38,46" fill="#f97316" />
            <polygon points="32,64 28,46 36,46" fill="#ef4444" />
            <polygon points="32,54 29,46 35,46" fill="#facc15" />
          </g>

          {/* Rocket Fins */}
          {/* Left Fin */}
          <path d="M 22,36 L 12,46 L 22,46 Z" fill="#dc2626" stroke="#111827" strokeWidth="2" strokeLinejoin="miter" />
          {/* Right Fin */}
          <path d="M 42,36 L 52,46 L 42,46 Z" fill="#dc2626" stroke="#111827" strokeWidth="2" strokeLinejoin="miter" />

          {/* Rocket Body */}
          <rect x="22" y="16" width="20" height="30" rx="2" fill="#ffffff" stroke="#111827" strokeWidth="2.5" />
          {/* Nose cone */}
          <path d="M 22,17 C 22,4 42,4 42,17 Z" fill="#ef4444" stroke="#111827" strokeWidth="2.5" />

          {/* Window */}
          <circle cx="32" cy="24" r="5" fill="#38bdf8" stroke="#111827" strokeWidth="2" />
          <circle cx="30" cy="22" r="1.5" fill="#ffffff" />

          {/* Stripe detail */}
          <rect x="22" y="34" width="20" height="3" fill="#dc2626" />

          {/* Thruster Base */}
          <rect x="27" y="46" width="10" height="3" fill="#4b5563" stroke="#111827" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};

// Retro Trophy Asset
export const PixelTrophy: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" className={className || "w-8 h-8"}>
    <g stroke="#000000" strokeWidth="1.5" strokeLinejoin="miter">
      {/* Base */}
      <rect x="8" y="26" width="16" height="4" fill="#b45309" />
      <rect x="12" y="22" width="8" height="4" fill="#d97706" />
      {/* Stem */}
      <rect x="14" y="16" width="4" height="6" fill="#fbbf24" />
      {/* Cup Body */}
      <path d="M 8,6 L 24,6 L 22,16 L 10,16 Z" fill="#facc15" />
      {/* Handles */}
      <path d="M 8,8 L 4,8 L 4,12 L 10,12" fill="none" strokeWidth="2" />
      <path d="M 24,8 L 28,8 L 28,12 L 22,12" fill="none" strokeWidth="2" />
      {/* Star emboss on trophy */}
      <polygon points="16,9 17,11 19,11 17.5,12 18,14 16,13 14,14 14.5,12 13,11 15,11" fill="#ffffff" stroke="none" />
    </g>
  </svg>
);

// Retro Star Coin Asset
export const PixelStarCoin: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" className={className || "w-8 h-8 animate-[spin_4s_linear_infinite]"}>
    <circle cx="16" cy="16" r="14" fill="#fbbf24" stroke="#78350f" strokeWidth="2" />
    <circle cx="16" cy="16" r="11" fill="#f59e0b" stroke="none" />
    <polygon points="16,7 19,13 25,13 20,17 22,23 16,19 10,23 12,17 7,13 13,13" fill="#ffffff" stroke="#78350f" strokeWidth="1" />
  </svg>
);

// Retro Star Asset
export const PixelStar: React.FC<{ className?: string, filled?: boolean }> = ({ className, filled = true }) => (
  <svg viewBox="0 0 32 32" className={className || "w-6 h-6"}>
    <polygon
      points="16,3 20,11 29,11 22,16 25,25 16,20 7,25 10,16 3,11 12,11"
      fill={filled ? "#fbbf24" : "none"}
      stroke="#78350f"
      strokeWidth="2.5"
      strokeLinejoin="miter"
    />
    {filled && (
      <polygon
        points="16,6 18.5,12 25,12 20,15.5 22,22 16,18 10,22 12,15.5 7,12 13.5,12"
        fill="#fef08a"
        stroke="none"
      />
    )}
  </svg>
);

// Retro Treasure Chest
export const PixelChest: React.FC<{ className?: string, isOpen?: boolean }> = ({ className, isOpen = false }) => (
  <svg viewBox="0 0 32 32" className={className || "w-12 h-12 hover:scale-105 transition-transform"}>
    <g stroke="#1f2937" strokeWidth="1.5" strokeLinejoin="miter">
      {/* Bottom Wood box */}
      <rect x="4" y="14" width="24" height="14" fill="#78350f" />
      <rect x="6" y="14" width="20" height="2" fill="#92400e" />
      {/* Metal Corners */}
      <rect x="4" y="16" width="3" height="12" fill="#d97706" />
      <rect x="25" y="16" width="3" height="12" fill="#d97706" />

      {isOpen ? (
        // Opened Lid
        <g>
          <rect x="4" y="2" width="24" height="10" fill="#92400e" />
          <rect x="4" y="2" width="3" height="10" fill="#fbbf24" />
          <rect x="25" y="2" width="3" height="10" fill="#fbbf24" />
          {/* Glow/Treasure Inside */}
          <rect x="6" y="12" width="20" height="2" fill="#fef08a" className="animate-pulse" />
          <circle cx="10" cy="11" r="2" fill="#3b82f6" className="animate-bounce" />
          <circle cx="16" cy="10" r="1.5" fill="#fbbf24" className="animate-pulse" />
          <circle cx="22" cy="11" r="2.5" fill="#22c55e" className="animate-bounce" />
        </g>
      ) : (
        // Closed Lid
        <g>
          <path d="M 4,14 C 4,6 28,6 28,14 Z" fill="#92400e" />
          {/* Lock plate */}
          <rect x="14" y="12" width="4" height="6" fill="#f59e0b" />
          <circle cx="16" cy="15" r="1" fill="#111827" />
          {/* Lid metal straps */}
          <path d="M 7,14 C 7,8 7,8 7,8" stroke="#f59e0b" strokeWidth="1.5" />
          <path d="M 25,14 C 25,8 25,8 25,8" stroke="#f59e0b" strokeWidth="1.5" />
        </g>
      )}
    </g>
  </svg>
);

export const PixelAsteroid: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" className={className || "w-8 h-8"} style={{ imageRendering: 'pixelated' as any }}>
    <g stroke="#000000" strokeWidth="1" strokeLinejoin="miter">
      {/* Base jagged rocky shape */}
      <path d="M 10,4 L 22,4 L 28,10 L 28,20 L 22,28 L 10,28 L 4,20 L 4,10 Z" fill="#584570" />
      {/* Darker shadow areas */}
      <path d="M 16,28 L 22,28 L 28,20 L 28,14 L 18,10 L 14,18 Z" fill="#312244" />
      {/* Highlight ridge */}
      <path d="M 10,4 L 4,10 L 4,16 L 10,12 L 14,4 Z" fill="#7d679b" />
      {/* Crater 1 */}
      <circle cx="10" cy="10" r="2.5" fill="#1b1226" />
      <circle cx="11" cy="11" r="1" fill="#000000" />
      {/* Crater 2 */}
      <circle cx="20" cy="18" r="3" fill="#1b1226" />
      <circle cx="21" cy="19" r="1.5" fill="#000000" />
      {/* Small dot crater */}
      <rect x="12" y="20" width="2" height="2" fill="#1b1226" />
    </g>
  </svg>
);

export const PixelAsteroidAlt: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" className={className || "w-8 h-8"} style={{ imageRendering: 'pixelated' as any }}>
    <g stroke="#000000" strokeWidth="1.2" strokeLinejoin="miter">
      {/* Different jagged shape */}
      <path d="M 14,2 L 24,6 L 28,16 L 20,28 L 8,26 L 2,16 L 4,8 Z" fill="#4d445c" />
      {/* Shadows */}
      <path d="M 14,12 L 24,6 L 28,16 L 20,28 L 14,24 Z" fill="#282233" />
      {/* Highlights */}
      <path d="M 14,2 L 4,8 L 2,16 L 8,14 Z" fill="#6d6182" />
      {/* Craters */}
      <circle cx="10" cy="10" r="2" fill="#15111c" />
      <circle cx="18" cy="20" r="2.5" fill="#15111c" />
    </g>
  </svg>
);

// High-fidelity back-view pixel astronaut
export const PixelAstronautBehind: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`relative ${className || 'w-24 h-24'} select-none animate-[float-medium_4s_infinite]`}>
    <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_0_15px_rgba(147,51,234,0.35)]">
      {/* Shadow under feet */}
      <ellipse cx="32" cy="56" rx="14" ry="3" fill="#000" opacity="0.3" />

      <g stroke="#000000" strokeWidth="2" strokeLinejoin="miter" strokeLinecap="square">
        {/* Legs / Boots (Symmetric standing position) */}
        <rect x="22" y="44" width="8" height="10" fill="#f3f4f6" />
        <rect x="34" y="44" width="8" height="10" fill="#e5e7eb" />
        
        {/* Leg armor cuffs */}
        <rect x="22" y="42" width="8" height="2" fill="#9ca3af" />
        <rect x="34" y="42" width="8" height="2" fill="#9ca3af" />

        {/* Heavy blue/grey boots */}
        <path d="M 20,52 L 30,52 L 30,55 L 20,55 Z" fill="#1d4ed8" />
        <path d="M 34,52 L 44,52 L 44,55 L 34,55 Z" fill="#1d4ed8" />
        
        <path d="M 20,54 L 28,54 L 28,55 L 20,55 Z" fill="#1e3a8a" />
        <path d="M 34,54 L 42,54 L 42,55 L 34,55 Z" fill="#1e3a8a" />

        {/* Torso Base suit */}
        <rect x="20" y="22" width="24" height="23" rx="4" fill="#ffffff" />
        
        {/* Arm Outlines (Drawn behind the backpack but visible) */}
        <path d="M 16,24 Q 12,32 16,40" stroke="#000000" strokeWidth="6" fill="none" />
        <path d="M 48,24 Q 52,32 48,40" stroke="#000000" strokeWidth="6" fill="none" />
        
        {/* Arms (White suit) */}
        <path d="M 16,24 Q 12,32 16,40" stroke="#f3f4f6" strokeWidth="4" fill="none" />
        <path d="M 48,24 Q 52,32 48,40" stroke="#e5e7eb" strokeWidth="4" fill="none" />

        {/* Heavy Blue Gloves */}
        <circle cx="17" cy="41" r="3.5" fill="#1d4ed8" />
        <circle cx="47" cy="41" r="3.5" fill="#1d4ed8" />

        {/* Giant Oxygen Life-Support Backpack (The primary detail of back-view) */}
        <rect x="18" y="20" width="28" height="23" rx="3" fill="#e5e7eb" />
        {/* Core panel block */}
        <rect x="21" y="23" width="22" height="17" fill="#cbd5e1" />
        
        {/* Panel lines / divisions */}
        <line x1="21" y1="31" x2="43" y2="31" stroke="#94a3b8" strokeWidth="1" />
        <line x1="32" y1="23" x2="32" y2="31" stroke="#94a3b8" strokeWidth="1" />
        
        {/* Status indicator lights (twinkling/glowing) */}
        <rect x="24" y="26" width="3" height="3" fill="#22c55e" className="animate-pulse" />
        <rect x="28" y="26" width="3" height="3" fill="#ef4444" />
        <rect x="35" y="26" width="5" height="3" fill="#0284c7" />

        {/* Subspace transceiver antenna on the backpack */}
        <line x1="42" y1="20" x2="42" y2="10" stroke="#475569" strokeWidth="1.5" />
        <circle cx="42" cy="9" r="1.5" fill="#ef4444" className="animate-ping" />
        <circle cx="42" cy="9" r="1.5" fill="#ef4444" />

        {/* Ribbed gray hoses connecting backpack to helmet/shoulders */}
        <path d="M 18,32 Q 13,34 16,21" fill="none" stroke="#64748b" strokeWidth="2.5" />
        <path d="M 46,32 Q 51,34 48,21" fill="none" stroke="#64748b" strokeWidth="2.5" />

        {/* Helmet - Round white structure with back shading */}
        <circle cx="32" cy="13" r="10.5" fill="#ffffff" />
        {/* Outer helmet curve shadow */}
        <path d="M 21.5,13 A 10.5,10.5 0 0 1 42.5,13" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />
        
        {/* Neck ring mount */}
        <rect x="26" y="21" width="12" height="2" fill="#475569" />

        {/* Subspace comm-badge on back of helmet */}
        <rect x="30" y="10" width="4" height="4" fill="#1d4ed8" rx="0.5" />
        <circle cx="32" cy="12" r="1" fill="#fbbf24" />
      </g>
    </svg>
  </div>
);

// High-fidelity swirling spiral galaxy background decoration
export const PixelSpiralGalaxy: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`relative ${className || 'w-24 h-24'} animate-[spin_120s_linear_infinite]`}>
    <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_0_25px_rgba(147,51,234,0.4)]">
      {/* Central glow */}
      <circle cx="32" cy="32" r="8" fill="#ffffff" />
      <circle cx="32" cy="32" r="15" fill="#818cf8" opacity="0.4" />
      <circle cx="32" cy="32" r="24" fill="#a78bfa" opacity="0.15" />
      
      {/* Spiral arms */}
      <path d="M 32,32 C 38,20 54,20 58,32 C 60,42 48,54 38,50 C 30,46 28,34 32,32" fill="none" stroke="#a78bfa" strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />
      <path d="M 32,32 C 26,44 10,44 6,32 C 4,22 16,10 26,14 C 34,18 36,30 32,32" fill="none" stroke="#6366f1" strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />
      
      {/* Sparkles / ambient stars inside the arms */}
      <circle cx="48" cy="24" r="1.5" fill="#ffffff" />
      <circle cx="16" cy="40" r="1.5" fill="#ffffff" />
      <rect x="38" y="16" width="2" height="2" fill="#67e8f9" />
      <rect x="24" y="46" width="2" height="2" fill="#f472b6" />
      <circle cx="54" cy="36" r="1" fill="#ffffff" />
      <circle cx="8" cy="28" r="1" fill="#ffffff" />
    </svg>
  </div>
);

// Pixel Flag for Level Node Islands
export const PixelFlag: React.FC<{ className?: string; color?: string }> = ({ className, color = '#3b82f6' }) => (
  <svg viewBox="0 0 16 16" className={className || "w-6 h-6"} style={{ imageRendering: 'pixelated' as any }}>
    {/* Flag pole */}
    <rect x="4" y="1" width="1.5" height="14" fill="#94a3b8" />
    <rect x="3" y="14" width="3" height="1" fill="#475569" />
    <circle cx="4.7" cy="1" r="1" fill="#fbbf24" />
    
    {/* Flag canvas (pixelated wind-blown look) */}
    <path d="M 5,2 L 13,2 L 11,5 L 13,8 L 5,8 Z" fill={color} stroke="#000000" strokeWidth="1" strokeLinejoin="miter" />
    {/* Inside shade */}
    <path d="M 5,2 L 9,2 L 8,5 L 11,5 L 10,8 L 5,8 Z" fill={color} />
  </svg>
);

// High-fidelity standing Pixel Astronaut holding a walkie talkie transceiver
export const PixelAstronautWithTransceiver: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`relative ${className || 'w-48 h-48'} select-none animate-float-medium`}>
    <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_0_20px_rgba(139,92,246,0.4)]" style={{ imageRendering: 'pixelated' as any }}>
      {/* Soft ground shadow */}
      <ellipse cx="32" cy="58" rx="15" ry="3.5" fill="#000" opacity="0.3" />

      {/* Jetpack on back */}
      <rect x="15" y="24" width="8" height="23" rx="2" fill="#d1d5db" stroke="#000" strokeWidth="2" />
      <rect x="15" y="29" width="8" height="3" fill="#ef4444" />
      
      {/* Helmet Head */}
      <circle cx="32" cy="19" r="12" fill="#ffffff" stroke="#000" strokeWidth="2" />
      {/* Visor */}
      <path d="M 23,19 C 23,12 41,12 41,19 C 41,26 23,26 23,19 Z" fill="#131024" stroke="#312e81" strokeWidth="2" />
      {/* Visor Glare / Reflections */}
      <path d="M 25,17 Q 32,13 39,17" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="28" cy="21" r="1.5" fill="#ffffff" />
      <circle cx="30" cy="22" r="1" fill="#ffffff" />
      
      {/* Collar neck */}
      <rect x="26" y="29" width="12" height="2" fill="#9ca3af" stroke="#000" strokeWidth="1.5" />

      {/* Body Torso */}
      <rect x="21" y="31" width="22" height="19" rx="3" fill="#ffffff" stroke="#000" strokeWidth="2" />

      {/* Chest Control Panel */}
      <rect x="25" y="34" width="14" height="7" fill="#1f2937" rx="1" />
      <circle cx="28" cy="37.5" r="1.2" fill="#ef4444" className="animate-pulse" />
      <circle cx="31" cy="37.5" r="1.2" fill="#3b82f6" />
      <rect x="34" y="36.5" width="3" height="2.2" fill="#eab308" />

      {/* Left arm (holding transceiver walkie-talkie) */}
      {/* Hand outline */}
      <path d="M 22,35 L 14,35 L 14,31" stroke="#000" strokeWidth="6" strokeLinecap="square" fill="none" />
      {/* Hand fill */}
      <path d="M 22,35 L 14,35 L 14,31" stroke="#f3f4f6" strokeWidth="3" strokeLinecap="square" fill="none" />
      {/* Blue Glove */}
      <circle cx="14" cy="30" r="3.2" fill="#3b82f6" stroke="#000" strokeWidth="1.5" />

      {/* Transceiver Box */}
      <rect x="7" y="21" width="8" height="12" rx="1" fill="#1e293b" stroke="#000" strokeWidth="1.5" />
      {/* Screen */}
      <rect x="9" y="23" width="4" height="2.5" fill="#10b981" />
      {/* Radio Antenna */}
      <line x1="9" y1="21" x2="7" y2="7" stroke="#475569" strokeWidth="1.8" />
      {/* Glowing antenna signal light */}
      <circle cx="7" cy="6" r="1.5" fill="#ef4444" className="animate-pulse" />

      {/* Right arm waving/resting */}
      <rect x="43" y="32" width="6" height="13" rx="1.5" fill="#e5e7eb" stroke="#000" strokeWidth="1.5" />
      <circle cx="46" cy="45" r="3.2" fill="#3b82f6" stroke="#000" strokeWidth="1.5" />

      {/* Legs */}
      <rect x="24" y="50" width="6" height="7" fill="#f3f4f6" stroke="#000" strokeWidth="2" />
      <rect x="32" y="50" width="6" height="7" fill="#e5e7eb" stroke="#000" strokeWidth="2" />

      {/* Blue boots */}
      <rect x="22" y="55" width="8" height="3.5" rx="1" fill="#1d4ed8" stroke="#000" strokeWidth="1.5" />
      <rect x="32" y="55" width="8" height="3.5" rx="1" fill="#1d4ed8" stroke="#000" strokeWidth="1.5" />
    </svg>
  </div>
);


// High-fidelity front-facing Astronaut Hero standing on a beautiful glowing lunar ridge, with NO flag
export const PixelAstronautHero: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`relative ${className || 'w-64 h-64'} select-none animate-[float-medium_4s_ease-in-out_infinite]`}>
    <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-[0_0_25px_rgba(139,92,246,0.4)]">
      
      {/* Dynamic Cosmic Back Glow (Smooth glow) */}
      <ellipse cx="60" cy="50" rx="35" ry="35" fill="#a855f7" opacity="0.12" className="animate-pulse" />
      
      {/* 1. Ground Horizon (Smooth vector lunar ridge) */}
      <g fill="#1b0c33" stroke="#4c1d95" strokeWidth="2.5">
        <path d="M -10,86 Q 60,78 130,86 L 130,110 L -10,110 Z" />
      </g>
      
      {/* Craters on ground */}
      <ellipse cx="25" cy="91" rx="8" ry="3" fill="#0c041c" />
      <ellipse cx="95" cy="93" rx="10" ry="3.5" fill="#0c041c" />
      <ellipse cx="60" cy="94" rx="6" ry="2" fill="#0c041c" />

      {/* 2. Vector Chibi Astronaut Standing, centered */}
      <g transform="translate(10, 0)">
        {/* Base shadow (only if standing) */}
        <ellipse cx="50" cy="90" rx="22" ry="4" fill="#0c041c" opacity="0.6" />

        {/* Backpack (Jetpack tank) on the left back */}
        <rect x="28" y="46" width="12" height="24" rx="4" fill="#2563eb" stroke="#1e293b" strokeWidth="2.5" />
        <rect x="28" y="50" width="12" height="4" fill="#fbbf24" />
        <rect x="28" y="58" width="12" height="4" fill="#38bdf8" />
        
        {/* Left Arm resting */}
        <g>
          <path d="M 38,58 Q 30,62 33,70" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
          <path d="M 38,58 Q 30,62 33,70" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
          {/* Gold/Yellow shoulder band */}
          <path d="M 35,61 Q 32,63 33,66" fill="none" stroke="#facc15" strokeWidth="5" />
          {/* Blue glove */}
          <circle cx="34" cy="71" r="4.5" fill="#2563eb" stroke="#1e293b" strokeWidth="2" />
        </g>

        {/* Right Arm */}
        <g>
          {/* Right Arm resting */}
          <path d="M 62,58 Q 70,62 67,70" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
          <path d="M 62,58 Q 70,62 67,70" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
          {/* Gold/Yellow shoulder band */}
          <path d="M 65,61 Q 68,63 67,66" fill="none" stroke="#facc15" strokeWidth="5" />
          {/* Blue glove */}
          <circle cx="66" cy="71" r="4.5" fill="#2563eb" stroke="#1e293b" strokeWidth="2" />
        </g>

        {/* Short Chubby Legs & Feet */}
        {/* Left Leg */}
        <rect x="37" y="70" width="10" height="13" rx="3" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
        <rect x="35" y="79" width="13" height="8" rx="3" fill="#2563eb" stroke="#1e293b" strokeWidth="2.5" />
        <rect x="35" y="84" width="13" height="3" rx="1" fill="#38bdf8" />
        <ellipse cx="38" cy="82" rx="2" ry="1" fill="#ffffff" opacity="0.8" />

        {/* Right Leg */}
        <rect x="53" y="70" width="10" height="13" rx="3" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
        <rect x="52" y="79" width="13" height="8" rx="3" fill="#2563eb" stroke="#1e293b" strokeWidth="2.5" />
        <rect x="52" y="84" width="13" height="3" rx="1" fill="#38bdf8" />
        <ellipse cx="55" cy="82" rx="2" ry="1" fill="#ffffff" opacity="0.8" />

        {/* Torso Suit Body */}
        <rect x="38" y="52" width="24" height="22" rx="6" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
        
        {/* Chest plate control box (Cyan/Blue interior, gold button) */}
        <rect x="44" y="58" width="12" height="10" rx="2" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
        <rect x="46" y="60" width="8" height="6" rx="1.5" fill="#2563eb" />
        <circle cx="50" cy="63" r="1.5" fill="#facc15" stroke="#1e293b" strokeWidth="1" />

        {/* Helmet Head (Large, round, cute chibi proportions!) */}
        <circle cx="50" cy="33" r="24" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
        
        {/* Subtle lower helmet shadow */}
        <path d="M 27.5,39 A 24,24 0 0 0 72.5,39 Z" fill="#cbd5e1" opacity="0.3" />

        {/* Blue circular Ear Pieces on the side of helmet */}
        {/* Left Ear Piece */}
        <circle cx="25" cy="33" r="5" fill="#2563eb" stroke="#1e293b" strokeWidth="2.5" />
        <circle cx="25" cy="33" r="2" fill="#38bdf8" />
        {/* Right Ear Piece */}
        <circle cx="75" cy="33" r="5" fill="#2563eb" stroke="#1e293b" strokeWidth="2.5" />
        <circle cx="75" cy="33" r="2" fill="#38bdf8" />

        {/* Helmet Collar Neck Joint Rim */}
        <rect x="40" y="52" width="20" height="4" rx="2" fill="#cbd5e1" stroke="#1e293b" strokeWidth="2.5" />
        <rect x="44" y="53" width="12" height="2" fill="#facc15" />

        {/* Visor (Clean, beautifully curved) */}
        {/* Visor Outer Rim Border (Gold/Yellow) */}
        <rect x="31" y="21" width="38" height="24" rx="12" fill="#facc15" stroke="#1e293b" strokeWidth="2.5" />
        {/* Dark Shiny Inner Visor */}
        <rect x="34" y="23" width="32" height="20" rx="10" fill="#18181b" stroke="#1e293b" strokeWidth="2" />

        {/* Visor Glossy Reflections */}
        <ellipse cx="42" cy="28" rx="5" ry="3" fill="#ffffff" transform="rotate(-15 42 28)" />
        <circle cx="58" cy="35" r="1.5" fill="#38bdf8" opacity="0.8" />
        <circle cx="61" cy="33" r="0.8" fill="#ffffff" />
        <path d="M 38,25 C 44,24 56,24 62,25" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
      </g>
    </svg>
  </div>
);

// High-fidelity Pixel Astronaut with custom ELICIT '26 Flag, matching the user's uploaded reference image
export const PixelAstronautWithFlag: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`relative ${className || 'w-64 h-64'} select-none animate-[float-medium_4s_ease-in-out_infinite]`}>
    <svg viewBox="0 0 160 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(139,92,246,0.35)]">
      
      {/* Dynamic Cosmic Back Glow (behind everything) */}
      <ellipse cx="70" cy="50" rx="40" ry="40" fill="#a855f7" opacity="0.1" className="animate-pulse" />
      
      {/* 1. Ground Horizon (Smooth vector purple craters) */}
      <g stroke="#4c1d95" strokeWidth="2" strokeLinejoin="miter">
        <path d="M -10,90 Q 80,82 170,90 L 170,110 L -10,110 Z" fill="#1c0e35" />
      </g>
      
      {/* Horizon craters */}
      <ellipse cx="25" cy="94" rx="8" ry="2.5" fill="#110722" />
      <ellipse cx="125" cy="95" rx="10" ry="3" fill="#110722" />
      <ellipse cx="85" cy="96" rx="5" ry="1.5" fill="#110722" />

      {/* 2. Flag Pole */}
      <g stroke="#111827" strokeWidth="1.5">
        <rect x="98.5" y="8" width="3" height="82" fill="#9ca3af" />
        {/* Gold top sphere */}
        <circle cx="100" cy="6" r="2.5" fill="#fbbf24" stroke="#111827" strokeWidth="1.5" />
      </g>

      {/* 3. Waving Flag with "ELICIT '26" */}
      <g stroke="#111827" strokeWidth="2" strokeLinejoin="miter">
        {/* Flag fabric backing shadow */}
        <path d="M 101.5,12 C 113.5,10 123.5,14 135.5,12 C 145.5,10 155.5,14 157.5,12 L 157.5,45 C 147.5,47 137.5,43 125.5,45 C 113.5,47 105.5,43 101.5,45 Z" fill="#111827" />
        {/* Flag fabric front face */}
        <path d="M 101.5,10 C 113.5,8 123.5,12 135.5,10 C 145.5,8 155.5,12 157.5,10 L 157.5,43 C 147.5,45 137.5,41 125.5,43 C 113.5,45 105.5,41 101.5,43 Z" fill="#7c3aed" />
      </g>

      {/* Flag lettering - Rendered perfectly */}
      <g style={{ userSelect: 'none' }}>
        <text x="130" y="23.5" fontFamily="'Space Grotesk', sans-serif" fontSize="8" fontWeight="900" fill="#facc15" textAnchor="middle" letterSpacing="0.8">ELICIT</text>
        <text x="130" y="35.5" fontFamily="'JetBrains Mono', monospace" fontSize="9.5" fontWeight="900" fill="#ffffff" textAnchor="middle" letterSpacing="1">'26</text>
      </g>

      {/* 4. Cute Chibi Vector Astronaut (Standing and holding the flag pole) */}
      <g transform="translate(5, 0)">
        {/* Base shadow (only if standing) */}
        <ellipse cx="50" cy="90" rx="22" ry="4" fill="#0c041c" opacity="0.6" />

        {/* Backpack (Jetpack tank) on the left back */}
        <rect x="28" y="46" width="12" height="24" rx="4" fill="#2563eb" stroke="#1e293b" strokeWidth="2.5" />
        <rect x="28" y="50" width="12" height="4" fill="#fbbf24" />
        <rect x="28" y="58" width="12" height="4" fill="#38bdf8" />

        {/* Left Arm resting */}
        <g>
          <path d="M 38,58 Q 30,62 33,70" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
          <path d="M 38,58 Q 30,62 33,70" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
          {/* Gold/Yellow shoulder band */}
          <path d="M 35,61 Q 32,63 33,66" fill="none" stroke="#facc15" strokeWidth="5" />
          {/* Blue glove */}
          <circle cx="34" cy="71" r="4.5" fill="#2563eb" stroke="#1e293b" strokeWidth="2" />
        </g>

        {/* Right Arm reaching out horizontally to hold flag pole */}
        <g>
          <path d="M 62,58 Q 78,57 93,57" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
          <path d="M 62,58 Q 78,57 93,57" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
          {/* Gold/Yellow shoulder band */}
          <path d="M 65,58 Q 72,58 75,58" fill="none" stroke="#facc15" strokeWidth="5" />
          {/* Blue glove holding pole */}
          <circle cx="93" cy="57" r="4.5" fill="#2563eb" stroke="#1e293b" strokeWidth="2" />
        </g>

        {/* Short Chubby Legs & Feet */}
        {/* Left Leg */}
        <rect x="37" y="70" width="10" height="13" rx="3" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
        <rect x="35" y="79" width="13" height="8" rx="3" fill="#2563eb" stroke="#1e293b" strokeWidth="2.5" />
        <rect x="35" y="84" width="13" height="3" rx="1" fill="#38bdf8" />
        <ellipse cx="38" cy="82" rx="2" ry="1" fill="#ffffff" opacity="0.8" />

        {/* Right Leg */}
        <rect x="53" y="70" width="10" height="13" rx="3" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
        <rect x="52" y="79" width="13" height="8" rx="3" fill="#2563eb" stroke="#1e293b" strokeWidth="2.5" />
        <rect x="52" y="84" width="13" height="3" rx="1" fill="#38bdf8" />
        <ellipse cx="55" cy="82" rx="2" ry="1" fill="#ffffff" opacity="0.8" />

        {/* Torso Suit Body */}
        <rect x="38" y="52" width="24" height="22" rx="6" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
        
        {/* Chest plate control box (Cyan/Blue interior, gold button) */}
        <rect x="44" y="58" width="12" height="10" rx="2" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
        <rect x="46" y="60" width="8" height="6" rx="1.5" fill="#2563eb" />
        <circle cx="50" cy="63" r="1.5" fill="#facc15" stroke="#1e293b" strokeWidth="1" />

        {/* Helmet Head (Large, round, cute chibi proportions!) */}
        <circle cx="50" cy="33" r="24" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
        
        {/* Subtle lower helmet shadow */}
        <path d="M 27.5,39 A 24,24 0 0 0 72.5,39 Z" fill="#cbd5e1" opacity="0.3" />

        {/* Blue circular Ear Pieces on the side of helmet */}
        {/* Left Ear Piece */}
        <circle cx="25" cy="33" r="5" fill="#2563eb" stroke="#1e293b" strokeWidth="2.5" />
        <circle cx="25" cy="33" r="2" fill="#38bdf8" />
        {/* Right Ear Piece */}
        <circle cx="75" cy="33" r="5" fill="#2563eb" stroke="#1e293b" strokeWidth="2.5" />
        <circle cx="75" cy="33" r="2" fill="#38bdf8" />

        {/* Helmet Collar Neck Joint Rim */}
        <rect x="40" y="52" width="20" height="4" rx="2" fill="#cbd5e1" stroke="#1e293b" strokeWidth="2.5" />
        <rect x="44" y="53" width="12" height="2" fill="#facc15" />

        {/* Visor (Clean, beautifully curved) */}
        {/* Visor Outer Rim Border (Gold/Yellow) */}
        <rect x="31" y="21" width="38" height="24" rx="12" fill="#facc15" stroke="#1e293b" strokeWidth="2.5" />
        {/* Dark Shiny Inner Visor */}
        <rect x="34" y="23" width="32" height="20" rx="10" fill="#18181b" stroke="#1e293b" strokeWidth="2" />

        {/* Visor Glossy Reflections */}
        <ellipse cx="42" cy="28" rx="5" ry="3" fill="#ffffff" transform="rotate(-15 42 28)" />
        <circle cx="58" cy="35" r="1.5" fill="#38bdf8" opacity="0.8" />
        <circle cx="61" cy="33" r="0.8" fill="#ffffff" />
        <path d="M 38,25 C 44,24 56,24 62,25" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
      </g>
    </svg>
  </div>
);



