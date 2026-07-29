"use client";

import React, { useState } from 'react';
import { ExplorerState, GalleryAlbum } from '../types';
import { playSound } from '../utils/sound';
import { INITIAL_GALLERY_ALBUMS } from '../data';
import { 
  PixelChest, 
  PixelStar
} from './PixelArtwork';
import { 
  Lock, 
  ArrowLeft,
  Image as ImageIcon, 
  Sliders, 
  Database, 
  ShieldCheck,
} from 'lucide-react';

interface GalleryProps {
  state: ExplorerState;
  addCoins: (amount: number) => void;
  addXp: (amount: number) => void;
  completeMission: (id: string) => void;
  triggerToast: (title: string, desc: string, icon?: string) => void;
  updateState: (partial: Partial<ExplorerState>) => void;
}

// Custom dates and visuals to match the high-end reference images
const ALBUM_METADATA: Record<string, { date: string; tag: string; banner: string }> = {
  'elicit-24': {
    date: '24 - 25 OCT 2024',
    tag: 'COSMIC HACK 2.0',
    banner: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80'
  },
  'elicit-23': {
    date: '18 OCT 2023',
    tag: 'AI ODYSSEY',
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
  },
  'workshops': {
    date: '21 OCT 2024',
    tag: 'ROBOTICS ARENA',
    banner: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=800&q=80'
  },
  'competitions': {
    date: '22 OCT 2024',
    tag: 'CULTURAL NIGHT',
    banner: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80'
  },
  'bts': {
    date: 'CREW ARCHIVE',
    tag: 'DESIGN SPRINT',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
  }
};

export const GalleryView: React.FC<GalleryProps> = ({
  state,
  addCoins,
  addXp,
  completeMission,
  triggerToast,
  updateState,
}) => {
  const [filter, setFilter] = useState<'all' | 'hackathon' | 'workshop' | 'competition' | 'bts'>('all');
  const [galleryAlbums] = useState<GalleryAlbum[]>(INITIAL_GALLERY_ALBUMS);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const decryptIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const hasOpenedChestRef = React.useRef(false);
  
  const selectedAlbum = galleryAlbums.find((a) => a.id === selectedAlbumId) || null;
  const filteredAlbums = galleryAlbums.filter(album => filter === 'all' || album.category === filter);

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [chestOpen, setChestOpen] = useState(false);

  // Creative interactive states
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptProgress, setDecryptProgress] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<'normal' | 'cyberpunk' | 'amber' | 'crt' | 'glitch'>('normal');
  const [radarSpeed, setRadarSpeed] = useState<number>(10); // rotation duration in seconds
  const [radarLocked, setRadarLocked] = useState<boolean>(false);

  const handleFilterClick = (cat: typeof filter) => {
    playSound('click', state.soundEnabled);
    setFilter(cat);
  };

  const handleAlbumSelect = (id: string) => {
    playSound('success', state.soundEnabled);
    setSelectedAlbumId(id);
    setCurrentPhotoIndex(0);
  };

  const handleViewPhoto = (photoUrl: string, idx: number) => {
    playSound('success', state.soundEnabled);
    setCurrentPhotoIndex(idx);
    
    // Clear any previous decrypt interval to prevent concurrent intervals
    if (decryptIntervalRef.current) clearInterval(decryptIntervalRef.current);

    // Trigger holographic decrypter scanner animation
    setIsDecrypting(true);
    setDecryptProgress(12);
    
    decryptIntervalRef.current = setInterval(() => {
      setDecryptProgress((p) => {
        if (p >= 100) {
          clearInterval(decryptIntervalRef.current!);
          decryptIntervalRef.current = null;
          setIsDecrypting(false);
          return 100;
        }
        return p + 22;
      });
    }, 90);

    if (!state.unlockedMemories.includes(photoUrl)) {
      const newMemories = [...state.unlockedMemories, photoUrl];
      updateState({ unlockedMemories: newMemories });
      addXp(30);
      addCoins(10);
      
      if (newMemories.length === 5) {
        completeMission('gallery-mission');
        triggerToast('Memories Unlocked!', 'You have unlocked 5 memories! +150 Star Coins!', '📦');
      } else {
        triggerToast('Memory Unlocked', 'Discovered new galactic photograph! +10 Star Coins', '📸');
      }
    }
    setLightboxOpen(true);
  };

  const handleNextPhoto = () => {
    if (selectedAlbum) {
      playSound('hover', state.soundEnabled);
      setCurrentPhotoIndex((currentPhotoIndex + 1) % selectedAlbum.images.length);
    }
  };

  const handlePrevPhoto = () => {
    if (selectedAlbum) {
      playSound('hover', state.soundEnabled);
      setCurrentPhotoIndex((currentPhotoIndex - 1 + selectedAlbum.images.length) % selectedAlbum.images.length);
    }
  };

  const handleChestClick = () => {
    if (state.unlockedMemories.length >= 5) {
      playSound('success', state.soundEnabled);
      setChestOpen(!chestOpen);
      // Only award coins once — on first open
      if (!chestOpen && !hasOpenedChestRef.current) {
        hasOpenedChestRef.current = true;
        addCoins(150);
        addXp(100);
        triggerToast('Loot Unlocked!', 'Opened the Elicit Chest! Received +150 Star Coins & +100 XP!', '🎁');
      }
    } else {
      playSound('laser', state.soundEnabled);
      triggerToast('Chest Locked', 'View at least 5 different memories to unlock the Elicit Loot Chest!', '🔒');
    }
  };

  // Fun interactive triggers on cockpit dashboard
  const handleRecalibrate = () => {
    playSound('warp', state.soundEnabled);
    setRadarSpeed(prev => (prev === 10 ? 3 : 10));
    triggerToast('Radar Recalibrated', 'Modulating wave receiver frequency scanners! Senses enhanced.', '📡');
  };

  const handleToggleRadarLock = () => {
    playSound('click', state.soundEnabled);
    setRadarLocked(!radarLocked);
    triggerToast(radarLocked ? 'Radar Released' : 'Vector Lock Engaged', radarLocked ? 'Radar searching galactic sectors freely.' : 'Locked wave beam onto local orbit memories.', '🎯');
  };

  const getFilterStyle = () => {
    switch (selectedFilter) {
      case 'cyberpunk':
        return { filter: 'hue-rotate(140deg) saturate(2.2) contrast(1.15) brightness(1.05)' };
      case 'amber':
        return { filter: 'sepia(0.85) hue-rotate(335deg) saturate(1.8) contrast(1.1)' };
      case 'crt':
        return { filter: 'brightness(0.7) contrast(1.6) grayscale(0.8) sepia(0.9) hue-rotate(90deg) saturate(6)' };
      case 'glitch':
        return { filter: 'invert(1) saturate(1.5) hue-rotate(180deg)' };
      case 'normal':
      default:
        return { filter: 'none' };
    }
  };

  const getAlbumViewedCount = (album: GalleryAlbum) => {
    return album.images.filter(img => state.unlockedMemories.includes(img)).length;
  };

  return (
    <div id="gallery-container" className="w-full relative px-4 md:px-6 py-6 md:py-10 select-none animate-[fadeIn_0.5s_ease-out] bg-[#03010b] overflow-hidden">
      
      {/* 1. Spaceship Outer Window Panel Frame & Cockpit Viewport */}
      <div id="cockpit-viewport" className="max-w-7xl mx-auto bg-[#070216] border-4 border-[#1b0933] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.15)] flex flex-col relative">
        
        {/* Widescreen Cockpit Arch Glass Shadow reflection & scanlines */}
        <div className="absolute inset-0 bg-scanlines opacity-5 pointer-events-none z-10" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-purple-500/5 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-purple-500/5 to-transparent pointer-events-none z-10" />
        
        {/* Cockpit corner bolts and brackets */}
        <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-[#1b0933] border border-purple-800 pointer-events-none z-20" />
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-[#1b0933] border border-purple-800 pointer-events-none z-20" />
        <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-[#1b0933] border border-purple-800 pointer-events-none z-20" />
        <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-[#1b0933] border border-purple-800 pointer-events-none z-20" />

        {/* Viewport Content Header */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-purple-950/60 z-10 bg-[#09031c]/80 backdrop-blur-md">
          
          {/* Cockpit Title & Status HUD */}
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-pixel text-xs text-cyan-400 tracking-[0.2em] uppercase font-bold">
                ✦ ACM COCKPIT VIEWPORT: ARCHIVE DECK ✦
              </span>
            </div>
            <h2 className="font-pixel text-3xl md:text-4xl text-white font-black leading-none mt-2 uppercase tracking-tight">
              GALLERY <span className="text-purple-400 font-black">MEMORIES</span>
            </h2>
            <p className="font-mono text-xs text-purple-300 font-medium mt-1.5 max-w-xl">
              Navigate through our universe of memories. Reconstruct historical tech-fest files to earn coins and level up!
            </p>
          </div>

          {/* Glowing Pill Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-[#12052c] border border-purple-900/60 rounded-xl p-1.5 self-start md:self-center">
            {[
              { id: 'all', label: 'ALL FIELDS' },
              { id: 'hackathon', label: 'HACKATHONS' },
              { id: 'workshop', label: 'WORKSHOPS' },
              { id: 'competition', label: 'COMPETITIONS' },
              { id: 'bts', label: 'CREW logs' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleFilterClick(tab.id as any)}
                className={`font-pixel text-xs px-3.5 py-2.5 transition-all cursor-pointer rounded-lg uppercase tracking-wider ${
                  filter === tab.id
                    ? 'bg-purple-900/60 text-yellow-400 border border-yellow-500/50 shadow-[0_0_12px_rgba(234,179,8,0.25)] font-bold'
                    : 'text-purple-300 hover:text-white hover:bg-purple-950/40 border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Viewport Main Stage */}
        <div className="p-6 md:p-8 min-h-[460px] flex flex-col justify-center relative z-10">
          
          {/* Space Horizon Atmosphere Graphics */}
          <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
            <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-t from-cyan-500 to-transparent rounded-full blur-3xl" />
            <div className="absolute top-10 right-20 w-[120px] h-[120px] rounded-full border border-dashed border-purple-600/30 animate-[spin_50s_linear_infinite]" />
          </div>

          {!selectedAlbum ? (
            /* ================= MODE 1: UNIVERSE VIEW (GORGEOUS FLOATING COCKPIT GLASS CARDS) ================= */
            <div className="flex flex-wrap gap-6 md:gap-8 justify-center items-center py-4">
              {filteredAlbums.map((album) => {
                const meta = ALBUM_METADATA[album.id];
                const viewedCount = getAlbumViewedCount(album);
                const complete = viewedCount === album.images.length;
                
                return (
                  <div
                    key={album.id}
                    id={`album-card-${album.id}`}
                    onClick={() => handleAlbumSelect(album.id)}
                    onMouseEnter={() => playSound('hover', state.soundEnabled)}
                    className="group relative w-full sm:w-[260px] md:w-[280px] h-[350px] bg-[#0c051f]/40 hover:bg-[#12082e]/60 border-2 border-purple-950 hover:border-purple-500 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:-translate-y-3"
                  >
                    {/* Light sweep hover element */}
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 group-hover:animate-shine" />

                    {/* Image Preview (Top block) with curved frame */}
                    <div className="h-[180px] w-full relative overflow-hidden border-b-2 border-purple-950 bg-[#09021a]">
                      <img 
                        src={meta?.banner || album.images[0]} 
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-115 transition-all duration-700 brightness-75 group-hover:brightness-95"
                        referrerPolicy="no-referrer"
                      />
                      {/* Gradient card tint */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c051f] via-[#0c051f]/20 to-transparent" />
                      
                      {/* Completed / Active Badge */}
                      <span className={`absolute top-3 right-3 font-pixel text-[6px] tracking-widest px-2 py-1 rounded border ${
                        complete 
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400' 
                          : viewedCount > 0 
                            ? 'bg-yellow-950/80 border-yellow-500 text-yellow-400'
                            : 'bg-purple-950/80 border-purple-800 text-purple-300'
                      }`}>
                        {complete ? 'SCAN COMPLETE' : viewedCount > 0 ? 'PARTIAL SCAN' : 'UNEXPLORED'}
                      </span>

                      {/* Photo files count overlay */}
                      <div className="absolute bottom-3 left-3 bg-black/80 border border-purple-800 rounded px-2 py-0.5 flex items-center gap-1">
                        <ImageIcon size={10} className="text-purple-400" />
                        <span className="font-mono text-xs text-purple-200 font-bold">
                          {album.images.length} ARCHIVES
                        </span>
                      </div>
                    </div>

                    {/* Card Description and metadata (Bottom block) */}
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <span className="font-pixel text-xs text-purple-300 block tracking-widest font-bold">
                          {meta?.tag || album.category.toUpperCase()}
                        </span>
                        <h3 className="font-pixel text-lg text-white font-black group-hover:text-yellow-400 transition-colors mt-1">
                          {album.title}
                        </h3>
                        <p className="font-mono text-xs text-purple-200 font-bold mt-1 line-clamp-2 leading-relaxed">
                          {album.description}
                        </p>
                      </div>

                      {/* Launch Deck Trigger Footer */}
                      <div className="flex items-center justify-between border-t border-purple-950/60 pt-3 mt-3">
                        <span className="font-pixel text-xs text-yellow-500 font-bold">
                          📅 {meta?.date || 'OCTOBER FEST'}
                        </span>
                        <div className="flex items-center gap-1.5 text-purple-400 group-hover:text-cyan-400 font-pixel text-xs font-extrabold transition-colors">
                          <span>ORBIT DECK</span>
                          <span className="transform group-hover:translate-x-1.5 transition-transform">↗</span>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            /* ================= MODE 2: SECTOR CORE MEDIA RECONSTRUCTION (SLICK PHOTO GRID WITHIN VIEWPORT) ================= */
            <div className="w-full flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]">
              
              {/* Active Sector Core Info Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-purple-950/80 pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { playSound('click', state.soundEnabled); setSelectedAlbumId(null); }}
                    className="font-pixel text-xs bg-[#12052c] border border-purple-800 text-purple-300 hover:text-white px-3 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 hover:bg-purple-950/40 font-bold"
                  >
                    <ArrowLeft size={10} />
                    <span>RETURN ORBITS</span>
                  </button>
                  <div>
                    <h3 className="font-pixel text-xl text-yellow-400 font-black flex items-center gap-1.5">
                      📁 SECTOR: {selectedAlbum.title}
                    </h3>
                    <p className="font-mono text-xs text-purple-300 mt-0.5 font-bold leading-normal">
                      {selectedAlbum.description}
                    </p>
                  </div>
                </div>

                {/* Progress bar in active viewport */}
                <div className="bg-[#12052c] border border-purple-950/80 rounded-xl px-4 py-2 flex items-center gap-4 self-start sm:self-center">
                  <div className="w-32 h-2.5 bg-purple-950 rounded-full overflow-hidden relative">
                    <div 
                      className="h-full bg-cyan-400 transition-all duration-300" 
                      style={{ width: `${(getAlbumViewedCount(selectedAlbum) / selectedAlbum.images.length) * 100}%` }}
                    />
                  </div>
                  <span className="font-pixel text-xs text-cyan-300 font-bold leading-none">
                    SCANNED: {getAlbumViewedCount(selectedAlbum)}/{selectedAlbum.images.length}
                  </span>
                </div>
              </div>

              {/* Main Photo Grid (High-Tech Photo Cells) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {selectedAlbum.images.map((img, idx) => {
                  const isUnlocked = state.unlockedMemories.includes(img);
                  return (
                    <div
                      key={idx}
                      id={`photo-cell-${idx}`}
                      onClick={() => handleViewPhoto(img, idx)}
                      onMouseEnter={() => playSound('hover', state.soundEnabled)}
                      className="aspect-square rounded-xl overflow-hidden border-2 border-purple-950 hover:border-yellow-400 relative cursor-pointer group shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <img
                        src={img}
                        alt={`${selectedAlbum.title} Core ${idx + 1}`}
                        className="w-full h-full object-cover filter brightness-75 group-hover:brightness-100 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                      {/* Grid light glare */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

                      {!isUnlocked ? (
                        /* Core Locked HUD block */
                        <div className="absolute inset-0 bg-[#060114]/90 flex flex-col items-center justify-center text-yellow-400 p-2 text-center gap-1 transition-all">
                          <Lock size={16} className="animate-pulse" />
                          <span className="font-pixel text-[10px] text-yellow-500 tracking-wider font-extrabold uppercase mt-1">LOCKED WAVE</span>
                        </div>
                      ) : (
                        /* Decrypted Scanner HUD overlay */
                        <div className="absolute top-2 right-2 bg-cyan-950/80 border border-cyan-500 rounded px-1.5 py-0.5 flex items-center justify-center pointer-events-none">
                          <span className="font-mono text-[10px] text-cyan-400 font-black tracking-widest uppercase">SCAN COMPLETE</span>
                        </div>
                      )}

                      {/* Bottom Image Label */}
                      <div className="absolute bottom-2 left-2 pointer-events-none">
                        <span className="font-pixel text-[10px] text-purple-300 font-bold block uppercase leading-none">
                          LOG #{idx + 1}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Grid HUD System Log Footer */}
              <div className="flex items-center justify-between border-t border-purple-950/60 pt-4 font-mono text-xs text-purple-300 font-bold uppercase select-none">
                <span>[LOG: VERIFIED] • CHRONO CORE RECORDINGS SYNCED</span>
                <button
                  onClick={() => { playSound('click', state.soundEnabled); setSelectedAlbumId(null); }}
                  className="font-pixel text-xs text-cyan-400 hover:text-white font-bold"
                >
                  [CLOSE SECTOR VIEWPORT]
                </button>
              </div>

            </div>
          )}

        </div>

        {/* 2. Cockpit Dashboard Console Controls Panel (Option 1 & 2 Cockpit Control interface) */}
        <div id="cockpit-dashboard" className="bg-[#0b041c] border-t-4 border-[#1b0933] px-6 py-6 flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Dashboard Arch shadow accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-b from-black to-transparent pointer-events-none" />

          {/* MODULE A: High-Tech Circular Radar Navigation System (Option 1 radar central screen style) */}
          <div className="flex items-center gap-4 bg-[#070114]/80 border border-purple-950 rounded-2xl p-4 w-full lg:w-auto">
            
            {/* Interactive Glowing Radar Screen */}
            <div className="relative w-16 h-16 rounded-full border border-purple-800 bg-black overflow-hidden flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(147,51,234,0.15)]">
              {/* Radar Grid Concentric circles */}
              <div className="absolute w-12 h-12 rounded-full border border-dashed border-purple-950" />
              <div className="absolute w-8 h-8 rounded-full border border-purple-950" />
              <div className="absolute w-4 h-4 rounded-full border border-dashed border-purple-950" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-purple-950/60" />
              <div className="absolute inset-x-0 top-1/2 h-px bg-purple-950/60" />

              {/* Dynamic Target Vector Blips */}
              <div className="absolute top-3 left-4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
              <div className="absolute bottom-5 right-3 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
              <div className="absolute top-8 right-6 w-1 h-1 bg-purple-500 rounded-full" />

              {/* Rotating Sweep Beam */}
              <div 
                className="absolute inset-0 origin-center bg-gradient-to-tr from-transparent via-cyan-500/15 to-transparent rounded-full"
                style={{ 
                  animation: `spin ${radarSpeed}s linear infinite`,
                  animationPlayState: radarLocked ? 'paused' : 'running'
                }}
              />
            </div>

            {/* Radar status diagnostic logs */}
            <div className="flex-grow">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${radarLocked ? 'bg-amber-400' : 'bg-cyan-400'} animate-pulse`} />
                <span className="font-pixel text-xs text-cyan-400 tracking-wider block font-bold">
                  {radarLocked ? 'VECTOR LOCK: ACTIVE' : 'RADAR SCANNERS: SWEEPING'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={handleRecalibrate}
                  className="font-pixel text-[10px] bg-[#12052c] hover:bg-cyan-950/60 text-purple-300 hover:text-cyan-400 px-2 py-1 border border-purple-800 hover:border-cyan-500 rounded transition-colors uppercase leading-none cursor-pointer font-bold"
                >
                  MODULATE SCAN
                </button>
                <button
                  onClick={handleToggleRadarLock}
                  className="font-pixel text-[10px] bg-[#12052c] hover:bg-yellow-950/60 text-purple-300 hover:text-yellow-400 px-2 py-1 border border-purple-800 hover:border-yellow-500 rounded transition-colors uppercase leading-none cursor-pointer font-bold"
                >
                  {radarLocked ? 'FREE SWEEP' : 'LOCK TARGET'}
                </button>
              </div>

              <span className="font-mono text-xs text-purple-300 block mt-1.5 leading-none font-bold uppercase">
                GRID MATRIX: SECURE • FREQ: {radarSpeed === 3 ? '184.2' : '48.9'} GHz
              </span>
            </div>

          </div>

          {/* MODULE B: Cargo Bay Locker (The Reward Loot Chest) */}
          <div className="flex items-center gap-4 bg-[#070114]/80 border border-purple-950 rounded-2xl p-4 w-full lg:w-auto">
            
            {/* Loot Chest Graphic */}
            <div 
              onClick={handleChestClick}
              className="cursor-pointer hover:scale-110 transition-transform flex-shrink-0"
            >
              <PixelChest isOpen={chestOpen} className="w-12 h-12" />
            </div>

            {/* Reward Progress Status text */}
            <div className="flex-grow">
              <span className="font-pixel text-xs text-yellow-500 block font-bold uppercase tracking-wider">
                🎁 STELLAR CORE LOOT CARGO
              </span>
              
              {/* Progress Bar slider */}
              <div className="w-40 h-2 bg-purple-950 border border-purple-900 rounded-full overflow-hidden mt-1 relative">
                <div
                  className="h-full bg-yellow-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, (state.unlockedMemories.length / 5) * 100)}%` }}
                />
              </div>

              <span className="font-mono text-xs text-purple-300 block mt-1.5 font-bold leading-none uppercase">
                {state.unlockedMemories.length}/5 UNIQUE RECORDS SCANNED
              </span>
            </div>

          </div>

          {/* MODULE C: Diagnostic & Navigation Status indicators */}
          <div className="bg-[#070114]/80 border border-purple-950 rounded-2xl p-4 w-full lg:w-auto flex flex-col justify-between h-20 min-w-[210px]">
            <div className="flex items-center justify-between border-b border-purple-950/40 pb-1.5">
              <span className="font-pixel text-xs text-purple-300 uppercase tracking-widest block font-bold">SYSTEM STATS</span>
              <span className="font-mono text-xs text-emerald-400 font-bold uppercase flex items-center gap-1 leading-none">
                <ShieldCheck size={10} />
                <span>ONLINE</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-xs text-purple-300 font-bold uppercase leading-none">
              <div className="flex items-center justify-between">
                <span>FUEL</span>
                <span className="text-cyan-400">98.4%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>SHIELD</span>
                <span className="text-cyan-400">100%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>LEVEL</span>
                <span className="text-yellow-400">XP {state.level}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>COINS</span>
                <span className="text-yellow-400">{state.coins}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Retro Picture Lightbox Viewer Modal with Holographic Decrypter Filters */}
      {selectedAlbum && lightboxOpen && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[110] px-4">
          <div className="bg-[#070114] border-4 border-purple-800 p-5 rounded-2xl max-w-2xl w-full relative shadow-[0_0_40px_rgba(139,92,246,0.5)] animate-[scaleUp_0.2s_steps(4)]">
            
            {/* Close Button */}
            <button
              onClick={() => { playSound('click', state.soundEnabled); setLightboxOpen(false); }}
              className="absolute -top-3 -right-3 font-pixel text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 border-2 border-white rounded-lg cursor-pointer z-20 font-bold"
            >
              [X] CLOSE
            </button>

            {/* Navigation buttons */}
            <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
              <button
                onClick={handlePrevPhoto}
                className="pointer-events-auto w-10 h-10 bg-purple-950/80 border border-purple-700 rounded-full flex items-center justify-center font-bold text-white hover:bg-yellow-400 hover:text-black cursor-pointer shadow-lg transition-colors"
              >
                ◀
              </button>
              <button
                onClick={handleNextPhoto}
                className="pointer-events-auto w-10 h-10 bg-purple-950/80 border border-purple-700 rounded-full flex items-center justify-center font-bold text-white hover:bg-yellow-400 hover:text-black cursor-pointer shadow-lg transition-colors"
              >
                ▶
              </button>
            </div>

            {/* Photo frame with scanner line & decrypter */}
            <div className="border-4 border-purple-950 bg-black rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center relative">
              
              {isDecrypting ? (
                /* Holographic decryption layout screen */
                <div className="absolute inset-0 bg-[#09021a] flex flex-col items-center justify-center p-6 text-center z-10">
                  <div className="absolute inset-0 bg-scanlines opacity-20" />
                  <div className="absolute top-0 inset-x-0 h-1 bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-[scan_1.5s_linear_infinite]" />
                  
                  <Database className="text-cyan-400 animate-bounce mb-3" size={32} />
                  <span className="font-pixel text-xs text-cyan-400 tracking-wider block mb-1 uppercase font-bold">
                    ESTABLISHING SUBSPACE ARCHIVE LOGS...
                  </span>
                  
                  <div className="w-48 h-3 bg-purple-950 border border-purple-800 rounded overflow-hidden mt-2 relative">
                    <div 
                      className="h-full bg-cyan-400 transition-all duration-75"
                      style={{ width: `${decryptProgress}%` }}
                    />
                  </div>
                  
                  <span className="font-mono text-xs text-purple-300 block mt-2 font-bold uppercase">
                    DECRYPTING CORE CELL: <span className="text-yellow-400">{decryptProgress}%</span>
                  </span>
                </div>
              ) : (
                /* Display decrypted image with active creative filters */
                <>
                  <img 
                    src={selectedAlbum.images[currentPhotoIndex]} 
                    alt="Active Decrypted Memory"
                    className="max-w-full max-h-full object-contain transition-all duration-300"
                    style={getFilterStyle()}
                    referrerPolicy="no-referrer"
                  />
                  {selectedFilter === 'crt' && (
                    <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-40" />
                  )}
                </>
              )}

              {/* Status overlay label inside image */}
              <div className="absolute bottom-3 left-3 bg-[#070114]/95 border border-purple-800 text-purple-200 font-mono text-xs px-2.5 py-1 rounded select-none z-10 font-bold uppercase">
                ACTIVE SECTOR: {selectedAlbum.title} • PHOTO {currentPhotoIndex + 1}/{selectedAlbum.images.length}
              </div>
            </div>

            {/* Creative Filters Dashboard Toolbar under Photo */}
            <div className="bg-[#12052c] border-2 border-purple-950 rounded-xl p-3 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
              <span className="font-pixel text-xs text-yellow-400 tracking-wider flex items-center gap-1.5 uppercase font-bold">
                <Sliders size={12} className="text-yellow-400" />
                <span>IMAGE RESTORATION MATRIX:</span>
              </span>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'normal', name: 'NORMAL' },
                  { id: 'cyberpunk', name: 'CYBERPUNK' },
                  { id: 'amber', name: 'AMBER' },
                  { id: 'crt', name: 'CRT MATRIX' },
                  { id: 'glitch', name: 'GLITCH' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      playSound('click', state.soundEnabled);
                      setSelectedFilter(item.id as any);
                    }}
                    className={`font-pixel text-[10px] px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all ${
                      selectedFilter === item.id 
                        ? 'bg-yellow-500 border-yellow-600 text-black font-extrabold shadow-[0_0_8px_rgba(234,179,8,0.4)]'
                        : 'bg-[#1b0c33] border-purple-900 text-purple-300 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
