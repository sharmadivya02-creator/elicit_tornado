'use client';

import { useStore } from '@/store/useStore';

export default function EndingFade() {
  const progress = useStore((state) => state.scrollProgress);

  const fadeStart = 0.9;
  const opacity =
    progress > fadeStart ? Math.min((progress - fadeStart) / (1 - fadeStart), 1) : 0;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black"
      style={{ opacity, transition: 'opacity 0.2s linear' }}
    >
      <div className="text-center px-6" style={{ opacity: Math.max((opacity - 0.4) / 0.6, 0) }}>
        <h3 className="font-display text-3xl md:text-5xl font-black tracking-[0.15em] bg-gradient-to-r from-cyan-300 via-white to-purple-400 bg-clip-text text-transparent">
          SEE YOU AT ELICIT&nbsp;'26
        </h3>
        <p className="mt-3 font-mono text-[10px] md:text-xs tracking-[0.4em] text-cyan-300/70 uppercase">
          Powered by OnePlus
        </p>
      </div>
    </div>
  );
}