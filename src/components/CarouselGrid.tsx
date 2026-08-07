'use client';

import React from 'react';

interface CarouselGridProps {
  images: string[];
  title: string;
  category: string;
  description: string;
}

export const CarouselGrid: React.FC<CarouselGridProps> = ({ images, title, category, description }) => {
  const displayImages = images.slice(0, 4); // Take first 4 images

  return (
    <div className="relative w-full">
      <style>{`
        @keyframes moveUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
        @keyframes moveDown {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        .carousel-image-up {
          animation: moveUp 8s linear infinite;
          will-change: transform;
        }
        .carousel-image-down {
          animation: moveDown 8s linear infinite;
          will-change: transform;
        }
      `}</style>

      <div className="grid grid-cols-2 gap-4 h-96">
        {/* Top Left - Move UP */}
        <div className="overflow-hidden rounded-lg bg-black border border-white/10">
          <img
            src={displayImages[0] || '/placeholder.jpg'}
            alt="Carousel 1"
            className="carousel-image-up w-full h-full object-cover"
          />
        </div>

        {/* Top Right - Move DOWN */}
        <div className="overflow-hidden rounded-lg bg-black border border-white/10">
          <img
            src={displayImages[1] || '/placeholder.jpg'}
            alt="Carousel 2"
            className="carousel-image-down w-full h-full object-cover"
          />
        </div>

        {/* Bottom Left - Move DOWN */}
        <div className="overflow-hidden rounded-lg bg-black border border-white/10">
          <img
            src={displayImages[2] || '/placeholder.jpg'}
            alt="Carousel 3"
            className="carousel-image-down w-full h-full object-cover"
          />
        </div>

        {/* Bottom Right - Move UP */}
        <div className="overflow-hidden rounded-lg bg-black border border-white/10">
          <img
            src={displayImages[3] || '/placeholder.jpg'}
            alt="Carousel 4"
            className="carousel-image-up w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right Column Text */}
      <div className="mt-8 space-y-4">
        <p className="font-mono text-xs text-cyan-400 uppercase tracking-wider">{category}</p>
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <p className="text-white/60 text-sm leading-relaxed">{description}</p>
        <a href="#" className="inline-block text-cyan-400 hover:text-cyan-300 text-sm uppercase tracking-wider transition-colors">
          VIEW IMAGE →
        </a>
      </div>
    </div>
  );
};