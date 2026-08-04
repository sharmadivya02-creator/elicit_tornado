'use client';

import { useEffect, useRef } from 'react';
import { revealTextStagger } from '@/utils/Animations';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const words = containerRef.current.querySelectorAll('.hero-word');
    const tween = revealTextStagger(words);
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-x-0 top-10 flex flex-col items-center text-center px-6"
    >
      <h2 className="font-display text-4xl md:text-6xl font-black tracking-[0.15em] flex flex-wrap justify-center gap-x-4">
        {["ELICIT", "'26"].map((word) => (
          <span key={word} className="overflow-hidden inline-block">
            <span className="hero-word inline-block bg-gradient-to-r from-cyan-300 via-white to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(124,58,237,0.5)]">
              {word}
            </span>
          </span>
        ))}
      </h2>
      <span className="overflow-hidden inline-block mt-3">
        <span className="hero-word inline-block font-mono text-[10px] md:text-xs tracking-[0.4em] text-cyan-300/80 uppercase">
          Powered by OnePlus
        </span>
      </span>
    </div>
  );
}