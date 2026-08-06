// src/components/dom/Overlay.tsx
'use client';

import Hero from './Hero';
import Loader from './Loader';
import EndingFade from './EndingFade';

export default function Overlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 w-full">
      <Loader />
      <Hero />

      <div className="pointer-events-none absolute bottom-8 inset-x-0 flex flex-col items-center gap-2">
        <p className="max-w-xl text-center font-mono text-[11px] md:text-sm leading-relaxed text-gray-300/90 tracking-wide bg-black/40 backdrop-blur-sm rounded-lg px-4 py-3 border border-cyan-500/10 mx-6">
          A fest that blends creativity with innovation. Explore the possibilities
          of design, tech, and imagination coming together in harmony. This is
          ELICIT '26 — the biggest techfest of MUJ. A must-have experience. We
          celebrate 10 years of ACM as well as ELICIT.
        </p>
        <span className="font-mono text-[10px] tracking-[0.3em] text-cyan-400/70 animate-pulse">
          SCROLL TO EXPLORE
        </span>
      </div>
    </div>
  );
}