"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ExplorerState, GalleryAlbum } from '../types';
import { playSound } from '../utils/sound';
import { INITIAL_GALLERY_ALBUMS } from '../data';
import { Lock, ArrowLeft, Image as ImageIcon, Sliders, Database, ShieldCheck } from 'lucide-react';

interface GalleryProps {
  state: ExplorerState;
  addCoins: (amount: number) => void;
  addXp: (amount: number) => void;
  completeMission: (id: string) => void;
  triggerToast: (title: string, desc: string, icon?: string) => void;
  updateState: (partial: Partial<ExplorerState>) => void;
}

const ALBUM_METADATA: Record<string, { date: string; tag: string; banner: string; accent: string }> = {
  'elicit-24': {
    date: '24 – 25 OCT 2024',
    tag: 'COSMIC HACK 2.0',
    banner: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80',
    accent: '#7c3aed',
  },
  'elicit-23': {
    date: '18 OCT 2023',
    tag: 'AI ODYSSEY',
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    accent: '#0ea5e9',
  },
  'workshops': {
    date: '21 OCT 2024',
    tag: 'ROBOTICS ARENA',
    banner: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1200&q=80',
    accent: '#10b981',
  },
  'competitions': {
    date: '22 OCT 2024',
    tag: 'CULTURAL NIGHT',
    banner: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=1200&q=80',
    accent: '#f59e0b',
  },
  'bts': {
    date: 'CREW ARCHIVE',
    tag: 'DESIGN SPRINT',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    accent: '#ec4899',
  },
};

// ─────────────────────────────────────────────
// Lightbox component (unchanged logic, restyled)
// ─────────────────────────────────────────────
const Lightbox: React.FC<{
  album: GalleryAlbum;
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  soundEnabled: boolean;
}> = ({ album, index, onClose, onNext, onPrev, soundEnabled }) => {
  const [filter, setFilter] = useState<'normal' | 'cyberpunk' | 'amber' | 'crt' | 'glitch'>('normal');

  const filterStyle = (): React.CSSProperties => {
    switch (filter) {
      case 'cyberpunk': return { filter: 'hue-rotate(140deg) saturate(2.2) contrast(1.15)' };
      case 'amber':     return { filter: 'sepia(0.85) hue-rotate(335deg) saturate(1.8)' };
      case 'crt':       return { filter: 'brightness(0.7) contrast(1.6) grayscale(0.8) sepia(0.9) hue-rotate(90deg) saturate(6)' };
      case 'glitch':    return { filter: 'invert(1) saturate(1.5) hue-rotate(180deg)' };
      default:          return {};
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center px-4">
      <div className="relative w-full max-w-2xl bg-[#070114] border-4 border-purple-800 rounded-2xl p-5 shadow-[0_0_60px_rgba(139,92,246,0.4)]">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 font-pixel text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 border-2 border-white rounded-lg z-20 font-bold"
        >
          [X] CLOSE
        </button>

        {/* Nav arrows */}
        <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          {[{ fn: onPrev, label: '◀' }, { fn: onNext, label: '▶' }].map(({ fn, label }) => (
            <button
              key={label}
              onClick={fn}
              className="pointer-events-auto w-10 h-10 bg-purple-950/80 border border-purple-700 rounded-full flex items-center justify-center font-bold text-white hover:bg-yellow-400 hover:text-black transition-colors"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="border-4 border-purple-950 bg-black rounded-xl overflow-hidden aspect-[4/3] relative">
          <img
            src={album.images[index]}
            alt={`${album.title} ${index + 1}`}
            className="w-full h-full object-cover"
            style={filterStyle()}
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-3 left-3 bg-[#070114]/95 border border-purple-800 font-mono text-xs text-purple-200 px-2.5 py-1 rounded font-bold uppercase">
            {album.title} • {index + 1}/{album.images.length}
          </div>
        </div>

        {/* Filter toolbar */}
        <div className="bg-[#12052c] border-2 border-purple-950 rounded-xl p-3 mt-4 flex flex-wrap items-center gap-2">
          <span className="font-pixel text-xs text-yellow-400 uppercase font-bold flex items-center gap-1.5 mr-2">
            <Sliders size={12} /> FILTER:
          </span>
          {(['normal', 'cyberpunk', 'amber', 'crt', 'glitch'] as const).map((f) => (
            <button
              key={f}
              onClick={() => { playSound('click', soundEnabled); setFilter(f); }}
              className={`font-pixel text-[10px] px-2.5 py-1.5 rounded-lg border transition-all ${
                filter === f
                  ? 'bg-yellow-500 border-yellow-600 text-black font-extrabold shadow-[0_0_8px_rgba(234,179,8,0.4)]'
                  : 'bg-[#1b0c33] border-purple-900 text-purple-300 hover:text-white'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Scroll-jacked "fromanother" layout
// ─────────────────────────────────────────────
const ScrollGallery: React.FC<{
  albums: GalleryAlbum[];
  state: ExplorerState;
  onOpenPhoto: (albumId: string, idx: number) => void;
  onExit: () => void;
}> = ({ albums, state, onOpenPhoto, onExit }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0–1 within current slide
  const [direction, setDirection] = useState<1 | -1>(1); // scroll direction
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Each album occupies 100vh of scroll space; first and last get a bit extra for enter/exit
  const SLIDE_HEIGHT = typeof window !== 'undefined' ? window.innerHeight : 800;

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const scrollY = containerRef.current.scrollTop;
    const newDir = scrollY > lastScrollY.current ? 1 : -1;
    lastScrollY.current = scrollY;
    setDirection(newDir as 1 | -1);

    const rawIdx = scrollY / SLIDE_HEIGHT;
    const idx = Math.min(Math.floor(rawIdx), albums.length - 1);
    const frac = rawIdx - Math.floor(rawIdx);

    setActiveIndex(idx);
    setProgress(frac);
  }, [albums.length, SLIDE_HEIGHT]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        containerRef.current.scrollBy({ top: SLIDE_HEIGHT, behavior: 'smooth' });
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        containerRef.current.scrollBy({ top: -SLIDE_HEIGHT, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [SLIDE_HEIGHT]);

  const goTo = (idx: number) => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({ top: idx * SLIDE_HEIGHT, behavior: 'smooth' });
  };

  const current = albums[activeIndex];
  const next = albums[Math.min(activeIndex + 1, albums.length - 1)];
  const meta = ALBUM_METADATA[current?.id] ?? { date: '', tag: '', banner: current?.images[0] ?? '', accent: '#7c3aed' };
  const nextMeta = ALBUM_METADATA[next?.id] ?? { date: '', tag: '', banner: next?.images[0] ?? '', accent: '#7c3aed' };

  // Image offsets: current image slides upward as progress→1; next image arrives from below
  const currentY = -progress * 100; // 0 → -100 (slides out upward)
  const nextY = (1 - progress) * 100; // 100 → 0 (slides in from below)

  // Text fades in and then back out
  const textOpacity = progress < 0.15 ? progress / 0.15 : progress > 0.8 ? (1 - progress) / 0.2 : 1;
  const textY = progress < 0.15 ? (1 - progress / 0.15) * 24 : 0;

  return (
    <div className="fixed inset-0 z-[100] bg-[#03010b] flex flex-col">

      {/* ── Back button ── */}
      <button
        onClick={onExit}
        className="absolute top-5 left-5 z-[110] font-pixel text-xs bg-[#12052c] border border-purple-800 text-purple-300 hover:text-white px-3 py-2 rounded-lg flex items-center gap-1.5 hover:bg-purple-950/60 transition-colors"
      >
        <ArrowLeft size={10} /> RETURN TO ORBITS
      </button>

      {/* ── Progress indicator (right side dots) ── */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-[110] flex flex-col gap-3">
        {albums.map((a, i) => (
          <button
            key={a.id}
            onClick={() => goTo(i)}
            className="group flex items-center gap-2"
            title={a.title}
          >
            <span className={`block transition-all duration-300 rounded-full ${
              i === activeIndex
                ? 'w-2.5 h-2.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                : 'w-1.5 h-1.5 bg-white/30 group-hover:bg-white/60'
            }`} />
          </button>
        ))}
      </div>

      {/* ── Album counter ── */}
      <div className="absolute top-5 right-6 z-[110] font-pixel text-xs text-purple-400 tabular-nums">
        {String(activeIndex + 1).padStart(2, '0')} / {String(albums.length).padStart(2, '0')}
      </div>

      {/* ── Scroll container (invisible, drives the scroll position) ── */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-y-scroll"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* One full-height block per album so we get scroll distance */}
        <div style={{ height: `${albums.length * SLIDE_HEIGHT}px` }} />
      </div>

      {/* ── Visual stage (absolutely positioned, does NOT scroll) ── */}
      <div className="absolute inset-0 overflow-hidden flex pointer-events-none">

        {/* LEFT COLUMN – current image */}
        <div className="relative flex-shrink-0 w-[48%] h-full overflow-hidden border-r border-white/5">
          {/* Current image slides UP as we scroll */}
          <div
            className="absolute inset-0 w-full h-full will-change-transform"
            style={{ transform: `translateY(${currentY}%)`, transition: 'transform 0.05s linear' }}
          >
            <img
              src={meta.banner}
              alt={current?.title}
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.65)' }}
            />
            {/* Bottom gradient bleed into bg */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#03010b]/80 via-transparent to-transparent" />
          </div>

          {/* Next image arrives from BELOW */}
          <div
            className="absolute inset-0 w-full h-full will-change-transform"
            style={{ transform: `translateY(${nextY}%)`, transition: 'transform 0.05s linear' }}
          >
            <img
              src={nextMeta.banner}
              alt={next?.title}
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.65)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#03010b]/80 via-transparent to-transparent" />
          </div>

          {/* Accent line at top of left column */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] transition-colors duration-500"
            style={{ background: meta.accent, boxShadow: `0 0 12px ${meta.accent}` }}
          />
        </div>

        {/* RIGHT COLUMN – larger overlapping image */}
        <div className="relative flex-grow h-full overflow-hidden">
          {/* Overlapping big image that shifts slightly on opposite axis */}
          <div
            className="absolute inset-0 w-full h-full will-change-transform"
            style={{ transform: `translateY(${currentY * 0.5}%)`, transition: 'transform 0.05s linear' }}
          >
            <img
              src={current?.images[1] ?? meta.banner}
              alt={current?.title}
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.45) saturate(0.7)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[#03010b]/60 via-[#03010b]/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#03010b]/70 via-transparent to-transparent" />
          </div>

          {/* Next right image from opposite direction */}
          <div
            className="absolute inset-0 w-full h-full will-change-transform"
            style={{ transform: `translateY(${nextY * 0.5}%)`, transition: 'transform 0.05s linear' }}
          >
            <img
              src={next?.images[1] ?? nextMeta.banner}
              alt={next?.title}
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.45) saturate(0.7)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[#03010b]/60 via-[#03010b]/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#03010b]/70 via-transparent to-transparent" />
          </div>

          {/* Text layer — center right */}
          <div
            className="absolute right-0 top-0 bottom-0 w-[300px] flex flex-col justify-center pr-10 pl-4"
            style={{
              opacity: textOpacity,
              transform: `translateY(${textY}px)`,
              transition: 'opacity 0.1s linear, transform 0.1s linear',
            }}
          >
            <span
              className="font-pixel text-[10px] tracking-[0.25em] uppercase mb-3 block"
              style={{ color: meta.accent }}
            >
              {meta.tag}
            </span>
            <h2 className="font-pixel text-2xl text-white font-black leading-tight uppercase">
              {current?.title}
            </h2>
            <p className="font-mono text-xs text-purple-300 font-bold mt-3 leading-relaxed">
              {current?.description}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="font-pixel text-xs text-yellow-500 font-bold">📅 {meta.date}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 font-mono text-[10px] text-purple-400 uppercase font-bold">
              <ImageIcon size={10} />
              <span>{current?.images.length} archives</span>
            </div>

            {/* CTA – pointer-events re-enabled just here */}
            <button
              onClick={() => onOpenPhoto(current?.id, 0)}
              className="mt-6 pointer-events-auto font-pixel text-xs text-white border border-white/30 hover:border-white px-4 py-2.5 rounded-lg hover:bg-white/10 transition-all self-start"
              style={{ boxShadow: `0 0 12px ${meta.accent}40` }}
            >
              OPEN ARCHIVE ↗
            </button>
          </div>
        </div>

      </div>

      {/* ── Central divider rule ── */}
      <div className="absolute inset-y-0 left-[48%] w-px bg-white/10 z-[105] pointer-events-none" />

      {/* ── Bottom HUD bar ── */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#03010b] to-transparent z-[110] flex items-end pb-3 px-6 justify-between pointer-events-none">
        <span className="font-pixel text-[10px] text-purple-500 tracking-widest uppercase">
          ACM ELICIT · GALLERY ARCHIVE
        </span>
        <span className="font-mono text-[10px] text-purple-500 uppercase font-bold">
          ↑↓  SCROLL TO NAVIGATE
        </span>
      </div>

    </div>
  );
};

// ─────────────────────────────────────────────
// Photo grid inside a selected album
// (exactly your existing logic, kept intact)
// ─────────────────────────────────────────────
const AlbumGrid: React.FC<{
  album: GalleryAlbum;
  state: ExplorerState;
  onBack: () => void;
  onOpenPhoto: (idx: number) => void;
  getAlbumViewedCount: (a: GalleryAlbum) => number;
  soundEnabled: boolean;
}> = ({ album, state, onBack, onOpenPhoto, getAlbumViewedCount, soundEnabled }) => (
  <div className="w-full flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-purple-950/80 pb-4 gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="font-pixel text-xs bg-[#12052c] border border-purple-800 text-purple-300 hover:text-white px-3 py-2 rounded-lg flex items-center gap-1.5 hover:bg-purple-950/40 font-bold"
        >
          <ArrowLeft size={10} /> RETURN ORBITS
        </button>
        <div>
          <h3 className="font-pixel text-xl text-yellow-400 font-black">📁 SECTOR: {album.title}</h3>
          <p className="font-mono text-xs text-purple-300 mt-0.5 font-bold leading-normal">{album.description}</p>
        </div>
      </div>
      <div className="bg-[#12052c] border border-purple-950/80 rounded-xl px-4 py-2 flex items-center gap-4 self-start sm:self-center">
        <div className="w-32 h-2.5 bg-purple-950 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-400 transition-all duration-300"
            style={{ width: `${(getAlbumViewedCount(album) / album.images.length) * 100}%` }}
          />
        </div>
        <span className="font-pixel text-xs text-cyan-300 font-bold">
          SCANNED: {getAlbumViewedCount(album)}/{album.images.length}
        </span>
      </div>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {album.images.map((img, idx) => {
        const isUnlocked = state.unlockedMemories.includes(img);
        return (
          <div
            key={idx}
            onClick={() => onOpenPhoto(idx)}
            onMouseEnter={() => playSound('hover', soundEnabled)}
            className="aspect-square rounded-xl overflow-hidden border-2 border-purple-950 hover:border-yellow-400 relative cursor-pointer group shadow-lg transition-all duration-300 hover:scale-105"
          >
            <img src={img} alt={`${album.title} ${idx + 1}`} className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all duration-500" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
            {!isUnlocked ? (
              <div className="absolute inset-0 bg-[#060114]/90 flex flex-col items-center justify-center gap-1">
                <Lock size={16} className="text-yellow-400 animate-pulse" />
                <span className="font-pixel text-[10px] text-yellow-500 tracking-wider font-extrabold uppercase mt-1">LOCKED</span>
              </div>
            ) : (
              <div className="absolute top-2 right-2 bg-cyan-950/80 border border-cyan-500 rounded px-1.5 py-0.5">
                <span className="font-mono text-[10px] text-cyan-400 font-black tracking-widest uppercase">✓ SCANNED</span>
              </div>
            )}
            <div className="absolute bottom-2 left-2">
              <span className="font-pixel text-[10px] text-purple-300 font-bold block uppercase">LOG #{idx + 1}</span>
            </div>
          </div>
        );
      })}
    </div>

    <div className="flex items-center justify-between border-t border-purple-950/60 pt-4 font-mono text-xs text-purple-300 font-bold uppercase select-none">
      <span>[LOG: VERIFIED] · CHRONO CORE RECORDINGS SYNCED</span>
      <button onClick={onBack} className="font-pixel text-xs text-cyan-400 hover:text-white font-bold">
        [CLOSE SECTOR VIEWPORT]
      </button>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Root export
// ─────────────────────────────────────────────
export const GalleryView: React.FC<GalleryProps> = ({
  state,
  addCoins,
  addXp,
  completeMission,
  triggerToast,
  updateState,
}) => {
  const [galleryAlbums] = useState<GalleryAlbum[]>(INITIAL_GALLERY_ALBUMS);
  const [filter, setFilter] = useState<'all' | 'hackathon' | 'workshop' | 'competition' | 'bts'>('all');

  // Three modes: 'browse' = scroll-jacked fromanother view | 'grid' = photo grid | 'lightbox'
  const [mode, setMode] = useState<'browse' | 'grid' | 'lightbox'>('browse');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const selectedAlbum = galleryAlbums.find((a) => a.id === selectedAlbumId) ?? null;
  const filteredAlbums = galleryAlbums.filter(
    (a) => filter === 'all' || a.category === filter
  );

  const getAlbumViewedCount = (album: GalleryAlbum) =>
    album.images.filter((img) => state.unlockedMemories.includes(img)).length;

  const handleOpenPhoto = useCallback(
    (albumId: string, idx: number) => {
      playSound('success', state.soundEnabled);
      setSelectedAlbumId(albumId);
      setLightboxIndex(idx);

      const album = galleryAlbums.find((a) => a.id === albumId);
      if (!album) return;
      const img = album.images[idx];

      if (!state.unlockedMemories.includes(img)) {
        const newMemories = [...state.unlockedMemories, img];
        updateState({ unlockedMemories: newMemories });
        addXp(30);
        addCoins(10);
        if (newMemories.length === 5) {
          completeMission('gallery-mission');
          triggerToast('Memories Unlocked!', 'You unlocked 5 memories! +150 Star Coins!', '📦');
        } else {
          triggerToast('Memory Unlocked', 'Discovered new photograph! +10 Star Coins', '📸');
        }
      }
      setMode('lightbox');
    },
    [galleryAlbums, state.unlockedMemories, state.soundEnabled, addXp, addCoins, completeMission, triggerToast, updateState]
  );

  // ── browse mode: the fromanother-style scroll stage
  if (mode === 'browse') {
    return (
      <>
        {/* Filter bar floats above the scroll stage */}
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[115] flex gap-1.5 bg-[#12052c]/90 backdrop-blur border border-purple-900/60 rounded-xl p-1.5 shadow-lg">
          {[
            { id: 'all', label: 'ALL' },
            { id: 'hackathon', label: 'HACKS' },
            { id: 'workshop', label: 'LABS' },
            { id: 'competition', label: 'COMPS' },
            { id: 'bts', label: 'BTS' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { playSound('click', state.soundEnabled); setFilter(tab.id as any); }}
              className={`font-pixel text-[10px] px-3 py-2 rounded-lg transition-all uppercase tracking-wider ${
                filter === tab.id
                  ? 'bg-purple-900/60 text-yellow-400 border border-yellow-500/50 font-bold'
                  : 'text-purple-300 hover:text-white hover:bg-purple-950/40 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <ScrollGallery
          albums={filteredAlbums}
          state={state}
          onOpenPhoto={(albumId, idx) => {
            setSelectedAlbumId(albumId);
            setMode('grid');
          }}
          onExit={() => {
            // No "exit" since this IS the gallery — goes back to whatever parent manages activeTab
            // You can wire setActiveTab('home') here if needed
          }}
        />
      </>
    );
  }

  // ── grid mode: photo thumbnails for a selected album
  if (mode === 'grid' && selectedAlbum) {
    return (
      <div className="w-full relative px-4 md:px-6 py-6 md:py-10 bg-[#03010b] min-h-screen">
        <div className="max-w-7xl mx-auto bg-[#070216] border-4 border-[#1b0933] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.15)] p-6 md:p-8">
          <AlbumGrid
            album={selectedAlbum}
            state={state}
            onBack={() => setMode('browse')}
            onOpenPhoto={(idx) => handleOpenPhoto(selectedAlbum.id, idx)}
            getAlbumViewedCount={getAlbumViewedCount}
            soundEnabled={state.soundEnabled}
          />
        </div>
      </div>
    );
  }

  // ── lightbox mode
  if (mode === 'lightbox' && selectedAlbum) {
    return (
      <Lightbox
        album={selectedAlbum}
        index={lightboxIndex}
        onClose={() => setMode(selectedAlbumId ? 'grid' : 'browse')}
        onNext={() => setLightboxIndex((i) => (i + 1) % selectedAlbum.images.length)}
        onPrev={() => setLightboxIndex((i) => (i - 1 + selectedAlbum.images.length) % selectedAlbum.images.length)}
        soundEnabled={state.soundEnabled}
      />
    );
  }

  return null;
};