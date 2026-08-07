'use client';

import React from 'react';

interface CarouselGridProps {
  images: string[];
  title: string;
  category: string;
  description: string;
}

export const CarouselGrid: React.FC<CarouselGridProps> = ({ images, title, category, description }) => {
  // Duplicate images for seamless infinite scroll
  const loopedImages = [...images, ...images];

  return (
    <div className="relative w-full" style={{ height: '75vh' }}>
      <style>{`
        @keyframes scrollUp {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          0%   { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .strip-up {
          animation: scrollUp 18s linear infinite;
          will-change: transform;
        }
        .strip-down {
          animation: scrollDown 18s linear infinite;
          will-change: transform;
        }
      `}</style>

      <div className="grid grid-cols-2 gap-3 h-full">

        {/* ── LEFT STRIP: scrolls UP only ── */}
        <div className="overflow-hidden rounded-xl h-full">
          <div className="strip-up flex flex-col" style={{ height: '200%' }}>
            {loopedImages.map((src, i) => (
              <div
                key={i}
                className="flex-shrink-0"
                style={{ height: `${100 / loopedImages.length}%` }}
              >
                <img
                  src={src}
                  alt={`left-${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT STRIP: scrolls DOWN only + text overlay pinned ── */}
        <div className="overflow-hidden rounded-xl h-full relative">
          <div className="strip-down flex flex-col" style={{ height: '200%' }}>
            {loopedImages.map((src, i) => (
              <div
                key={i}
                className="flex-shrink-0"
                style={{ height: `${100 / loopedImages.length}%` }}
              >
                <img
                  src={src}
                  alt={`right-${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Text pinned over the right strip */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none flex flex-col justify-end p-6">
            <p className="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-2">{category}</p>
            <h2 className="text-2xl font-bold text-white leading-tight mb-2">{title}</h2>
            <p className="text-white/75 text-sm leading-relaxed mb-3">{description}</p>
            <a href="#" className="pointer-events-auto inline-block text-cyan-400 hover:text-cyan-300 text-xs uppercase tracking-widest transition-colors">
              VIEW GALLERY →
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};