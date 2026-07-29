import React, { useState } from 'react';
import { ExplorerState, ActiveTab } from '../types';
import { playSound } from '../utils/sound';
import { ExternalLink, Mail, ArrowRight, Shield, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CosmicSponsorsBackground } from './CosmicSponsorsBackground';
import { SponsorsHeader } from './SponsorsHeader';

interface SponsorsProps {
  state: ExplorerState;
  completeMission: (id: string) => void;
  setActiveTab?: (tab: ActiveTab) => void;
}

interface PartnerDetail {
  id: string;
  name: string;
  type: string;
  motto?: string;
  desc: string;
  website: string;
  color: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'blue';
}

const PARTNER_DETAILS: Record<string, PartnerDetail> = {
  technova: {
    id: 'technova',
    name: 'TechNova Solutions',
    type: 'Platinum Partner',
    motto: 'INNOVATING TOMORROW',
    desc: 'TechNova Solutions is a global leader in next-generation cloud infrastructure and high-performance quantum computing clusters. They fuel our development sandboxes with state-of-the-art virtual cores and high-speed telemetry nodes.',
    website: 'https://technova.solutions',
    color: 'cyan'
  },
  byteforge: {
    id: 'byteforge',
    name: 'ByteForge Technologies',
    type: 'Gold Partner',
    motto: 'BUILDING THE FUTURE',
    desc: 'ByteForge Technologies is a premier developer-first programming environment and compiler manufacturer. Their specialized toolchains allow rapid chiptune synthesis and embedded compiler optimizations for zero-gravity systems.',
    website: 'https://byteforge.tech',
    color: 'purple'
  },
  cloudsixty: {
    id: 'cloudsixty',
    name: 'CloudSixty Solutions',
    type: 'Silver Partner',
    motto: 'ELEVATE. INNOVATE. INSPIRE.',
    desc: 'CloudSixty Solutions provides automated serverless deployment layers and secure decentralized consensus hubs. They power the real-time synchronization arrays of our event trackers and flight logs.',
    website: 'https://cloudsixty.com',
    color: 'pink'
  },
  codeaxis: {
    id: 'codeaxis',
    name: 'CodeAxis Tech',
    type: 'Bronze Partner',
    desc: 'CodeAxis delivers robust API routing layers and cyber-secure firewall solutions for multi-planet data relays.',
    website: 'https://codeaxis.io',
    color: 'cyan'
  },
  devnest: {
    id: 'devnest',
    name: 'DevNest Labs',
    type: 'Bronze Partner',
    desc: 'DevNest Labs is a hardware accelerator and embedded systems testbed, providing microcontrollers and sensor payloads.',
    website: 'https://devnest.labs',
    color: 'yellow'
  },
  pixelperfect: {
    id: 'pixelperfect',
    name: 'PixelPerfect Designs',
    type: 'Bronze Partner',
    desc: 'PixelPerfect is an interstellar creative agency crafting beautiful user experiences, high-resolution vector assets, and brand assets.',
    website: 'https://pixelperfect.design',
    color: 'pink'
  },
  infralynx: {
    id: 'infralynx',
    name: 'Infralynx Systems',
    type: 'Bronze Partner',
    desc: 'Infralynx maintains high-reliability satellite backbones and wide-area telemetry arrays connecting remote colony nets.',
    website: 'https://infralynx.com',
    color: 'green'
  },
  datawiz: {
    id: 'datawiz',
    name: 'DataWiz Analytics',
    type: 'Bronze Partner',
    desc: 'DataWiz provides deep neural-network processing and semantic pattern parsing for telescope logs and flight metrics.',
    website: 'https://datawiz.ai',
    color: 'blue'
  }
};

export const SponsorsView: React.FC<SponsorsProps> = ({ state, completeMission, setActiveTab }) => {
  const [selectedPartner, setSelectedPartner] = useState<PartnerDetail | null>(null);

  React.useEffect(() => {
    // Complete the sponsor inspection mission
    completeMission('sponsor-mission');
  }, []);

  const handlePartnerClick = (partner: PartnerDetail) => {
    playSound('success', state.soundEnabled);
    setSelectedPartner(partner === selectedPartner ? null : partner);
  };

  const handleGetInTouch = () => {
    playSound('warp', state.soundEnabled);
    if (setActiveTab) {
      setActiveTab('contact');
    }
  };

  return (
    <div className="w-full relative px-4 md:px-6 py-8 md:py-12 select-none animate-[fadeIn_0.5s_ease-out] overflow-hidden min-h-screen bg-transparent">
      {/* Clean, cosmic background layer with orbits and drifting spacecraft */}
      <CosmicSponsorsBackground />

      {/* Retro Wireframe Ambient Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Left Side: Glowing wireframe planet with ring */}
        <div className="absolute -left-16 top-1/4 w-72 h-72 opacity-20 hidden lg:block">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#7B5CFF] fill-none stroke-current" strokeWidth="0.5">
            <circle cx="50" cy="50" r="30" />
            <ellipse cx="50" cy="50" rx="45" ry="12" transform="rotate(-25 50 50)" />
            {/* Grid lines */}
            <path d="M50,20 L50,80" />
            <path d="M20,50 L80,50" />
            <path d="M29,32 Q50,45 71,32" />
            <path d="M29,68 Q50,55 71,68" />
          </svg>
        </div>

        {/* Right Side: Mesh grid sphere */}
        <div className="absolute -right-16 top-1/3 w-72 h-72 opacity-20 hidden lg:block">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#00E5FF] fill-none stroke-current animate-[spin_100s_linear_infinite]" strokeWidth="0.5">
            <circle cx="50" cy="50" r="35" strokeDasharray="3,3" />
            <circle cx="50" cy="50" r="25" />
            <ellipse cx="50" cy="50" rx="35" ry="8" />
            <ellipse cx="50" cy="50" rx="8" ry="35" />
            <ellipse cx="50" cy="50" rx="35" ry="18" />
            <ellipse cx="50" cy="50" rx="18" ry="35" />
          </svg>
        </div>
      </div>

      <div className="w-full max-w-[95%] xl:max-w-[1400px] mx-auto flex flex-col gap-8 relative z-10">
        
        {/* GLITCHY HEADER BANNER */}
        <SponsorsHeader soundEnabled={state.soundEnabled} playSound={playSound} />

        {/* Dynamic Partner details card popup */}
        <AnimatePresence mode="wait">
          {selectedPartner && (
            <motion.div 
              initial={{ opacity: 0, y: -15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              className={`bg-[#0a0418]/95 border-2 p-5 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative z-20 ${
                selectedPartner.color === 'cyan' ? 'border-cyan-500/80 shadow-cyan-500/10' :
                selectedPartner.color === 'purple' ? 'border-purple-500/80 shadow-purple-500/10' :
                selectedPartner.color === 'pink' ? 'border-pink-500/80 shadow-pink-500/10' :
                selectedPartner.color === 'green' ? 'border-emerald-500/80 shadow-emerald-500/10' :
                selectedPartner.color === 'yellow' ? 'border-yellow-500/80 shadow-yellow-500/10' :
                'border-blue-500/80 shadow-blue-500/10'
              }`}
            >
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                <div className={`w-14 h-14 bg-purple-950/40 border-2 rounded-lg flex items-center justify-center font-pixel text-xl ${
                  selectedPartner.color === 'cyan' ? 'border-cyan-500/40 text-cyan-400' :
                  selectedPartner.color === 'purple' ? 'border-purple-500/40 text-purple-400' :
                  selectedPartner.color === 'pink' ? 'border-pink-500/40 text-pink-400' :
                  selectedPartner.color === 'green' ? 'border-emerald-500/40 text-emerald-400' :
                  selectedPartner.color === 'yellow' ? 'border-yellow-500/40 text-yellow-400' :
                  'border-blue-500/40 text-blue-400'
                }`}>
                  ⭐
                </div>
                <div>
                  <span className={`font-pixel text-[10px] uppercase font-bold tracking-widest ${
                    selectedPartner.color === 'cyan' ? 'text-cyan-400' :
                    selectedPartner.color === 'purple' ? 'text-purple-400' :
                    selectedPartner.color === 'pink' ? 'text-pink-400' :
                    selectedPartner.color === 'green' ? 'text-emerald-400' :
                    selectedPartner.color === 'yellow' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`}>
                    {selectedPartner.type}
                  </span>
                  <h3 className="font-pixel text-sm text-white mt-1 uppercase font-bold tracking-wider">{selectedPartner.name}</h3>
                  <p className="font-mono text-xs text-purple-200 mt-1.5 leading-relaxed max-w-2xl font-semibold">
                    {selectedPartner.desc}
                  </p>
                </div>
              </div>

              <a
                href={selectedPartner.website}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => playSound('hover', state.soundEnabled)}
                onClick={() => playSound('click', state.soundEnabled)}
                className={`font-pixel text-[10px] px-4 py-2.5 rounded border-b-4 active:translate-y-0.5 flex items-center gap-1.5 flex-shrink-0 cursor-pointer font-bold tracking-wider transition-all duration-150 ${
                  selectedPartner.color === 'cyan' ? 'bg-cyan-500 text-black hover:bg-cyan-400 border-cyan-700' :
                  selectedPartner.color === 'purple' ? 'bg-purple-600 text-white hover:bg-purple-500 border-purple-850' :
                  selectedPartner.color === 'pink' ? 'bg-pink-500 text-white hover:bg-pink-400 border-pink-700' :
                  selectedPartner.color === 'green' ? 'bg-emerald-500 text-black hover:bg-emerald-400 border-emerald-700' :
                  selectedPartner.color === 'yellow' ? 'bg-yellow-500 text-black hover:bg-yellow-400 border-yellow-700' :
                  'bg-blue-600 text-white hover:bg-blue-500 border-blue-800'
                }`}
              >
                <span>OPEN LOG LINK</span>
                <ExternalLink size={12} />
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECTION 1: TITLE PARTNERS */}
        <div>
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-purple-950/60"></div>
            </div>
            <span className="relative px-4 bg-[#000000] font-pixel text-[10px] md:text-xs text-cyan-400 tracking-[0.25em] font-bold uppercase select-none">
              TITLE PARTNERS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            
            {/* TechNova - Platinum Partner */}
            <div
              onClick={() => handlePartnerClick(PARTNER_DETAILS.technova)}
              onMouseEnter={() => playSound('hover', state.soundEnabled)}
              className={`bg-[#050114]/90 border-2 rounded-lg p-4 sm:p-5 flex flex-col items-center justify-between text-center cursor-pointer transition-all duration-300 group ${
                selectedPartner?.id === 'technova'
                  ? 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] bg-[#0c0525]/90'
                  : 'border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.12)] hover:-translate-y-0.5'
              }`}
            >
              <div className="text-[8px] font-pixel text-cyan-400 tracking-widest mb-3 opacity-80 group-hover:opacity-100 transition-opacity">
                [ PLATINUM PARTNER ]
              </div>

              {/* TechNova Custom Logo */}
              <div className="w-14 h-14 flex items-center justify-center my-2 relative">
                <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-all duration-300"></div>
                <svg viewBox="0 0 100 100" className="w-11 h-11 text-cyan-400 fill-current filter drop-shadow-[0_0_6px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform duration-300">
                  <path d="M15,25 L85,25 L75,42 L55,42 L55,80 L45,80 L45,42 L25,42 Z" />
                  <path d="M30,48 L42,48 L36,58 L24,58 Z" opacity="0.6" />
                </svg>
              </div>

              <div className="mt-3">
                <h3 className="font-pixel text-base text-white font-bold tracking-wider">TechNova</h3>
                <p className="font-mono text-[8px] text-purple-300 tracking-[0.25em] font-bold uppercase mt-0.5">SOLUTIONS</p>
              </div>

              <div className="mt-4 font-mono text-[8px] text-cyan-400 font-bold tracking-widest border border-cyan-500/20 px-2.5 py-0.5 bg-cyan-500/5 rounded">
                INNOVATING TOMORROW
              </div>
            </div>

            {/* ByteForge - Gold Partner */}
            <div
              onClick={() => handlePartnerClick(PARTNER_DETAILS.byteforge)}
              onMouseEnter={() => playSound('hover', state.soundEnabled)}
              className={`bg-[#050114]/90 border-2 rounded-lg p-4 sm:p-5 flex flex-col items-center justify-between text-center cursor-pointer transition-all duration-300 group ${
                selectedPartner?.id === 'byteforge'
                  ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.25)] bg-[#0c0525]/90'
                  : 'border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.12)] hover:-translate-y-0.5'
              }`}
            >
              <div className="text-[8px] font-pixel text-purple-400 tracking-widest mb-3 opacity-80 group-hover:opacity-100 transition-opacity">
                [ GOLD PARTNER ]
              </div>

              {/* ByteForge Custom Logo */}
              <div className="w-14 h-14 flex items-center justify-center my-2 relative">
                <div className="absolute inset-0 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-all duration-300"></div>
                <svg viewBox="0 0 100 100" className="w-11 h-11 text-purple-400 fill-current filter drop-shadow-[0_0_6px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform duration-300">
                  <path d="M50,15 L75,48 L55,48 L65,85 L35,52 L55,52 Z" />
                  <path d="M50,15 L35,52 L45,52 Z" opacity="0.5" />
                </svg>
              </div>

              <div className="mt-3">
                <h3 className="font-pixel text-base text-white font-bold tracking-wider">ByteForge</h3>
                <p className="font-mono text-[8px] text-purple-300 tracking-[0.25em] font-bold uppercase mt-0.5">TECHNOLOGIES</p>
              </div>

              <div className="mt-4 font-mono text-[8px] text-purple-400 font-bold tracking-widest border border-purple-500/20 px-2.5 py-0.5 bg-purple-500/5 rounded">
                BUILDING THE FUTURE
              </div>
            </div>

            {/* CloudSixty - Silver Partner */}
            <div
              onClick={() => handlePartnerClick(PARTNER_DETAILS.cloudsixty)}
              onMouseEnter={() => playSound('hover', state.soundEnabled)}
              className={`bg-[#050114]/90 border-2 rounded-lg p-4 sm:p-5 flex flex-col items-center justify-between text-center cursor-pointer transition-all duration-300 group ${
                selectedPartner?.id === 'cloudsixty'
                  ? 'border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.25)] bg-[#0c0525]/90'
                  : 'border-pink-500/30 hover:border-pink-400 hover:shadow-[0_0_15px_rgba(236,72,153,0.12)] hover:-translate-y-0.5'
              }`}
            >
              <div className="text-[8px] font-pixel text-pink-400 tracking-widest mb-3 opacity-80 group-hover:opacity-100 transition-opacity">
                [ SILVER PARTNER ]
              </div>

              {/* CloudSixty Custom Logo */}
              <div className="w-14 h-14 flex items-center justify-center my-2 relative">
                <div className="absolute inset-0 bg-pink-500/5 rounded-full blur-xl group-hover:bg-pink-500/10 transition-all duration-300"></div>
                <svg viewBox="0 0 100 100" className="w-11 h-11 text-pink-400 fill-current filter drop-shadow-[0_0_6px_rgba(236,72,153,0.4)] group-hover:scale-105 transition-transform duration-300">
                  <path d="M50,18 C32.3,18 18,32.3 18,50 C18,67.7 32.3,82 50,82 C67.7,82 82,67.7 82,50 C82,32.3 67.7,18 50,18 Z M50,70 C39,70 30,61 30,50 C30,39 39,30 50,30 C61,30 70,39 70,50 C70,61 61,70 50,70 Z" />
                  <circle cx="36" cy="36" r="6" />
                  <circle cx="64" cy="64" r="6" />
                  <circle cx="64" cy="36" r="6" />
                  <circle cx="36" cy="64" r="6" />
                </svg>
              </div>

              <div className="mt-3">
                <h3 className="font-pixel text-base text-white font-bold tracking-wider">CloudSixty</h3>
                <p className="font-mono text-[8px] text-purple-300 tracking-[0.25em] font-bold uppercase mt-0.5">SOLUTIONS</p>
              </div>

              <div className="mt-4 font-mono text-[8px] text-pink-400 font-bold tracking-widest border border-pink-500/20 px-2.5 py-0.5 bg-pink-500/5 rounded">
                ELEVATE. INNOVATE. INSPIRE.
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 2: BRONZE PARTNERS */}
        <div>
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-purple-950/60"></div>
            </div>
            <span className="relative px-4 bg-[#000000] font-pixel text-[10px] md:text-xs text-cyan-400 tracking-[0.25em] font-bold uppercase select-none">
              BRONZE PARTNERS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            
            {/* CodeAxis */}
            <div
              onClick={() => handlePartnerClick(PARTNER_DETAILS.codeaxis)}
              onMouseEnter={() => playSound('hover', state.soundEnabled)}
              className={`bg-[#050114]/90 border-2 rounded-lg p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 cursor-pointer transition-all duration-350 group ${
                selectedPartner?.id === 'codeaxis'
                  ? 'border-cyan-400 bg-[#0c0525]/90 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'border-purple-900/40 hover:border-cyan-500/50 hover:shadow-[0_0_12px_rgba(6,182,212,0.1)]'
              }`}
            >
              <div className="w-14 h-14 bg-cyan-500/5 border border-cyan-500/20 rounded-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 100 100" className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="8">
                  <polygon points="50,15 85,35 85,75 50,95 15,75 15,35" fill="rgba(6,182,212,0.05)" />
                  <path d="M62,40 A15,15 0 1,0 62,60" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-center sm:text-left min-w-0">
                <h4 className="font-pixel text-xs sm:text-sm text-white truncate font-bold uppercase group-hover:text-cyan-300">CodeAxis</h4>
                <p className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider mt-1">TECH</p>
              </div>
            </div>

            {/* DevNest */}
            <div
              onClick={() => handlePartnerClick(PARTNER_DETAILS.devnest)}
              onMouseEnter={() => playSound('hover', state.soundEnabled)}
              className={`bg-[#050114]/90 border-2 rounded-lg p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 cursor-pointer transition-all duration-350 group ${
                selectedPartner?.id === 'devnest'
                  ? 'border-yellow-400 bg-[#0c0525]/90 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                  : 'border-purple-900/40 hover:border-yellow-500/50 hover:shadow-[0_0_12px_rgba(234,179,8,0.1)]'
              }`}
            >
              <div className="w-14 h-14 bg-yellow-500/5 border border-yellow-500/20 rounded-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 100 100" className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="8">
                  <path d="M35,35 L20,50 L35,65" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M65,35 L80,50 L65,65" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M55,30 L45,70" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-center sm:text-left min-w-0">
                <h4 className="font-pixel text-xs sm:text-sm text-white truncate font-bold uppercase group-hover:text-yellow-300">DevNest</h4>
                <p className="font-mono text-[10px] text-yellow-400 font-bold uppercase tracking-wider mt-1">LABS</p>
              </div>
            </div>

            {/* PixelPerfect */}
            <div
              onClick={() => handlePartnerClick(PARTNER_DETAILS.pixelperfect)}
              onMouseEnter={() => playSound('hover', state.soundEnabled)}
              className={`bg-[#050114]/90 border-2 rounded-lg p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 cursor-pointer transition-all duration-350 group ${
                selectedPartner?.id === 'pixelperfect'
                  ? 'border-pink-500 bg-[#0c0525]/90 shadow-[0_0_15px_rgba(236,72,153,0.2)]'
                  : 'border-purple-900/40 hover:border-pink-500/50 hover:shadow-[0_0_12px_rgba(236,72,153,0.1)]'
              }`}
            >
              <div className="w-14 h-14 bg-pink-500/5 border border-pink-500/20 rounded-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 100 100" className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" strokeWidth="8">
                  <path d="M28,25 L65,25 A18,18 0 0,1 65,61 L28,61 L28,85" strokeLinecap="round" strokeLinejoin="round" fill="rgba(236,72,153,0.05)" />
                  <path d="M28,43 L48,43" />
                </svg>
              </div>
              <div className="text-center sm:text-left min-w-0">
                <h4 className="font-pixel text-xs sm:text-sm text-white truncate font-bold uppercase group-hover:text-pink-300">PixelPerfect</h4>
                <p className="font-mono text-[10px] text-pink-400 font-bold uppercase tracking-wider mt-1">DESIGNS</p>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 3: COMMUNITY PARTNERS */}
        <div>
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-purple-950/60"></div>
            </div>
            <span className="relative px-4 bg-[#000000] font-pixel text-[10px] md:text-xs text-cyan-400 tracking-[0.25em] font-bold uppercase select-none">
              COMMUNITY PARTNERS
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 w-full">
            
            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => playSound('hover', state.soundEnabled)}
              onClick={() => playSound('click', state.soundEnabled)}
              className="bg-[#050114]/90 border border-cyan-500/20 hover:border-cyan-400 rounded-lg p-5 flex items-center justify-center gap-3.5 transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] group hover:-translate-y-1 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-cyan-400 fill-current group-hover:scale-110 transition-transform shrink-0">
                <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
              </svg>
              <span className="font-pixel text-xs sm:text-sm text-white tracking-wider group-hover:text-cyan-300">GitHub</span>
            </a>

            {/* acm */}
            <div
              onMouseEnter={() => playSound('hover', state.soundEnabled)}
              onClick={() => {
                playSound('success', state.soundEnabled);
                triggerToast?.('ACM MUJ', 'Association for Computing Machinery Student Chapter.', '🛸');
              }}
              className="bg-[#050114]/90 border border-purple-500/20 hover:border-purple-400 rounded-lg p-5 flex items-center justify-center gap-3.5 transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] group hover:-translate-y-1 cursor-pointer"
            >
              <div className="w-8 h-8 bg-purple-500/10 border border-purple-500/40 rounded-full flex items-center justify-center text-[10px] font-pixel text-purple-400 group-hover:scale-110 transition-transform shrink-0">
                acm
              </div>
              <div className="flex flex-col items-start min-w-0">
                <span className="font-pixel text-xs sm:text-sm text-white tracking-wider group-hover:text-purple-300 truncate w-full">acm</span>
                <span className="font-mono text-[8px] text-purple-400 truncate w-full font-bold mt-0.5">MUJ ACM CHAPTER</span>
              </div>
            </div>

            {/* MLH */}
            <a
              href="https://mlh.io"
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => playSound('hover', state.soundEnabled)}
              onClick={() => playSound('click', state.soundEnabled)}
              className="bg-[#050114]/90 border border-amber-500/20 hover:border-amber-400 rounded-lg p-5 flex items-center justify-center gap-3.5 transition-all hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] group hover:-translate-y-1 cursor-pointer"
            >
              <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/40 rounded flex items-center justify-center text-[9px] font-pixel text-amber-400 font-bold group-hover:scale-110 transition-transform shrink-0">
                MLH
              </div>
              <div className="flex flex-col items-start min-w-0">
                <span className="font-pixel text-xs sm:text-sm text-white tracking-wider group-hover:text-amber-300 truncate w-full">MLH</span>
                <span className="font-mono text-[8px] text-amber-400 truncate w-full font-bold mt-0.5">MAJOR LEAGUE HACKING</span>
              </div>
            </a>

            {/* and more */}
            <div
              onMouseEnter={() => playSound('hover', state.soundEnabled)}
              onClick={() => {
                playSound('success', state.soundEnabled);
                triggerToast?.('COSMIC COMMUNITY', 'Special thanks to our media and campus outreach partners!', '🛰️');
              }}
              className="bg-[#050114]/90 border border-blue-500/20 hover:border-blue-400 rounded-lg p-5 flex items-center justify-center gap-3.5 transition-all hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] group hover:-translate-y-1 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-400 fill-current group-hover:scale-115 transition-transform shrink-0">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span className="font-pixel text-xs text-blue-300 font-semibold uppercase tracking-wider">and more...</span>
            </div>

          </div>
        </div>

        {/* FOOTER CALL-TO-ACTION CARD */}
        <div className="mt-6">
          <div className="relative bg-[#050114]/95 border-2 border-purple-900/60 rounded-xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
            {/* Background glowing line */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>
            
            <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
              <div className="w-14 h-14 bg-purple-500/10 border-2 border-purple-500/30 rounded-xl flex items-center justify-center text-purple-400 shrink-0">
                <Mail size={26} className="animate-bounce" />
              </div>
              <div>
                <h3 className="font-pixel text-xs sm:text-sm text-cyan-400 tracking-wider font-bold">
                  INTERESTED IN SPONSORING?
                </h3>
                <p className="font-mono text-[11px] text-purple-300 mt-2 font-semibold">
                  Let's build something incredible together. Let's launch your brand into the digital star maps!
                </p>
              </div>
            </div>

            <button
              onClick={handleGetInTouch}
              onMouseEnter={() => playSound('hover', state.soundEnabled)}
              className="px-6 py-3.5 bg-cyan-500/10 hover:bg-cyan-500/25 border-2 border-cyan-400 hover:border-cyan-300 text-cyan-300 hover:text-white rounded-lg font-pixel text-[10px] cursor-pointer flex items-center gap-2 transition-all duration-200 uppercase font-bold shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.15)] active:translate-y-0.5"
            >
              <span>GET IN TOUCH</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper toast trigger fallback if not passed directly through state
function triggerToast(title: string, desc: string, icon?: string) {
  const customEvent = new CustomEvent('starfleet-toast', { detail: { title, desc, icon } });
  window.dispatchEvent(customEvent);
}
