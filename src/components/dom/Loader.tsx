'use client';

import { useProgress } from '@react-three/drei';

export default function Loader() {
  const { active, progress } = useProgress();

  if (!active) return null;

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black pointer-events-none">
      <div className="text-cyan-400 font-mono text-xs md:text-sm tracking-[0.3em] mb-4 animate-pulse">
        LOADING SHOWCASE... {Math.round(progress)}%
      </div>
      <div className="w-56 h-1 bg-cyan-950 rounded-full overflow-hidden border border-cyan-500/30">
        <div
          className="h-full bg-cyan-400 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}