'use client';

import React from 'react';
import { ActiveTab, ExplorerState } from '../types';
import { SplashCursor } from './SplashCursor';
import { LetterGlitch } from './LetterGlitch';
import { CarouselGrid } from './CarouselGrid';

interface AboutProps {
  state: ExplorerState;
  addXp: (amount: number) => void;
  completeMission: (id: string) => void;
  setActiveTab?: (tab: ActiveTab) => void;
}

const ELICIT_IMAGES = [
  '/about/DSC_0074.jpg',
  '/about/DSC01089.jpg',
  '/about/DSC01093.jpg',
  '/about/DSC01123.jpg',
  '/about/DSC03579-2.jpg',
  '/about/DSC05277-Enhanced-NR.jpg',
  '/about/DSC05360-Enhanced-NR.jpg',
  '/about/DSC09563.jpg',
];

export const AboutView: React.FC<AboutProps> = ({ state, addXp, completeMission, setActiveTab }) => {
  React.useEffect(() => {
    completeMission('base-mission');
  }, []);

  return (
    <div className="w-full relative min-h-screen bg-black overflow-hidden">
      {/* Background Effects */}
      <LetterGlitch
        glitchColors={['#5227FF', '#7cff67', '#ff6b6b']}
        glitchSpeed={50}
        centerVignette
        outerVignette={false}
        smooth
      />
      <SplashCursor
        SIM_RESOLUTION={128}
        DYE_RESOLUTION={1440}
        DENSITY_DISSIPATION={3.5}
        VELOCITY_DISSIPATION={2}
        PRESSURE={0.1}
        CURL={3}
        SPLAT_RADIUS={0.2}
        SPLAT_FORCE={6000}
        COLOR_UPDATE_SPEED={10}
      />

      {/* Content Layer */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 gap-16 items-start">
          {/* Left: Carousel */}
          <div>
            <CarouselGrid
              images={ELICIT_IMAGES}
              title="Opening Ceremony"
              category="Ceremony"
              description="The grand inauguration of ELICIT '26 — a celebration of technology, innovation, and community spirit."
            />
          </div>

          {/* Right: Additional Content */}
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">About ELICIT '26</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                The biggest techfest of MUJ, celebrating 10 years of ACM and the spirit of innovation. 
                A fest that blends creativity with imagination, bringing together builders, dreamers, 
                and explorers pushing the edges of code, design, and technology.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};