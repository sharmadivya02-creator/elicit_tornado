'use client';

import React from 'react';
import { ActiveTab, ExplorerState } from '../types';
import SplashCursor from './SplashCursor';
import LetterGlitch from './LetterGlitch';
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
    <div className="w-full min-h-screen bg-black overflow-hidden">

      {/* SplashCursor — full fluid WebGL sim, fixed canvas, pointer-events none */}
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
        TRANSPARENT={true}
      />

      {/* LetterGlitch — full character rain canvas, fills its container */}
      {/* Carousels: 75vh */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16" style={{ height: '75vh' }}>
        <CarouselGrid
          images={ELICIT_IMAGES}
          title="Opening Ceremony"
          category="Ceremony"
          description="The grand inauguration of ELICIT '26 — a celebration of technology, innovation, and community spirit."
        />
      </div>

      {/* About text + LetterGlitch background — separate section below carousels */}
      <div className="relative z-10" style={{ minHeight: '300px' }}>
        {/* LetterGlitch fills this block */}
        <div className="absolute inset-0">
          <LetterGlitch
            glitchColors={['#5227FF', '#7cff67', '#ff6b6b']}
            glitchSpeed={50}
            centerVignette={false}
            outerVignette={false}
            smooth
          />
        </div>
        {/* About text centered over LetterGlitch */}
        <div className="relative z-10 flex items-center justify-center px-8 py-20">
          <div className="max-w-2xl text-center">
            <h3 className="text-2xl font-bold text-white mb-4">About ELICIT '26</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              The biggest techfest of MUJ, celebrating 10 years of ACM and the spirit of innovation.
              A fest that blends creativity with imagination, bringing together builders, dreamers,
              and explorers pushing the edges of code, design, and technology.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};