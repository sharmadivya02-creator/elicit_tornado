import React from 'react';
import { motion } from 'motion/react';
import { PixelAstronaut, PixelSpaceStation } from './PixelArtwork';

export const CosmicSponsorsBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Concentric orbital path rings - extremely subtle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.12]">
        {/* Ring 1 - inner */}
        <motion.div 
          className="absolute rounded-full border-2 border-dashed border-[#7B5CFF]"
          style={{ width: '400px', height: '400px' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
        />
        {/* Ring 2 - middle */}
        <motion.div 
          className="absolute rounded-full border border-[#FF4DA6]"
          style={{ width: '700px', height: '700px' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 260, repeat: Infinity, ease: 'linear' }}
        />
        {/* Ring 3 - outer */}
        <motion.div 
          className="absolute rounded-full border border-dashed border-[#00E5FF]"
          style={{ width: '1000px', height: '1000px' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 340, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* 2. Soft ambient star twinkling (subtle dust) */}
      <div className="absolute inset-0 opacity-50">
        {[
          { top: '15%', left: '8%', delay: 0, color: 'bg-[#00E5FF]' },
          { top: '35%', left: '85%', delay: 1.5, color: 'bg-[#FF4DA6]' },
          { top: '75%', left: '12%', delay: 2.5, color: 'bg-[#00FFA3]' },
          { top: '80%', left: '78%', delay: 0.8, color: 'bg-[#FFB000]' },
          { top: '50%', left: '5%', delay: 3.2, color: 'bg-[#1677FF]' },
          { top: '22%', left: '92%', delay: 1.9, color: 'bg-[#FFFFFF]' },
        ].map((star, idx) => (
          <motion.div
            key={`dust-${idx}`}
            className={`absolute w-1 h-1 rounded-full ${star.color} shadow-[0_0_8px_currentColor]`}
            style={{ top: star.top, left: star.left }}
            animate={{
              opacity: [0.3, 0.9, 0.3],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 4,
              delay: star.delay,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* 3. Extremely slow-drifting custom pixel satellite/probe across the upper portion */}
      <motion.div
        className="absolute w-12 h-12 opacity-35"
        style={{ top: '8%', left: '-50px' }}
        animate={{
          x: ['-50px', '110vw'],
          y: ['0px', '30px'],
          rotate: [0, 45, 90, 45, 0],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <PixelSpaceStation className="w-full h-full" />
      </motion.div>

      {/* 4. A cute floating chibi astronaut in the lower-right margin */}
      <motion.div
        className="absolute bottom-6 right-8 opacity-40 hover:opacity-80 transition-opacity duration-300 pointer-events-auto cursor-help"
        style={{ width: '48px', height: '48px' }}
        animate={{
          y: [0, -12, 0],
          rotate: [2, -4, 2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        title="Sponsor Support Liaison Astronaut"
      >
        <PixelAstronaut pose="floating" className="w-full h-full" />
      </motion.div>

      {/* 5. A tiny explorer shuttle drifting in the lower-left margin */}
      <motion.div
        className="absolute bottom-[20%] left-[4%] opacity-20"
        style={{ width: '32px', height: '32px' }}
        animate={{
          y: [0, 8, 0],
          x: [0, 5, 0],
          rotate: [-15, -10, -15],
        }}
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Simple inline tiny ship shape to represent explorer shuttle */}
        <svg viewBox="0 0 32 32" className="w-full h-full text-cyan-400 fill-current">
          <polygon points="16,4 24,20 16,16 8,20" />
          <rect x="14" y="16" width="4" height="4" className="text-red-500 fill-current animate-pulse" />
        </svg>
      </motion.div>
    </div>
  );
};
