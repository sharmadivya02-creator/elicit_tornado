"use client";

import React from 'react';
import { ActiveTab, ExplorerState } from '../types';
import { playSound } from '../utils/sound';
import { PixelSpaceStation } from './PixelArtwork';
import { motion } from 'motion/react';
import RotatingText from './RotatingText';
import { RocketMarquee } from "./RocketMarquee";
import GradientText from './GlitchText';

interface AboutProps {
  state: ExplorerState;
  addXp: (amount: number) => void;
  completeMission: (id: string) => void;
  setActiveTab?: (tab: ActiveTab) => void;
}

const VALUES = [
  { icon: '⚡', label: 'INNOVATE', desc: 'Pushing boundaries with new ideas and technology.', color: '#ffd700', bg: 'rgba(250, 204, 21, 0.05)', shadow: 'rgba(250, 204, 21, 0.3)' },
  { icon: '🤝', label: 'COLLABORATE', desc: 'Stronger together, building the future.', color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.05)', shadow: 'rgba(34, 211, 238, 0.3)' },
  { icon: '📚', label: 'LEARN', desc: 'Continuous learning fuels our growth.', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.05)', shadow: 'rgba(168, 85, 247, 0.3)' },
  { icon: '🌍', label: 'IMPACT', desc: 'Creating real impact through technology.', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.05)', shadow: 'rgba(34, 197, 94, 0.3)' },
];

const MILESTONES = [
  { year: '2019', label: 'Chapter Founded', icon: '🚀', color: '#22d3ee' },
  { year: '2021', label: "ELICIT'21 — 200+ participants", icon: '⭐', color: '#ffd700' },
  { year: '2023', label: "ELICIT'23 — 400+ participants", icon: '🪐', color: '#a855f7' },
  { year: '2024', label: '15+ Sponsors onboarded', icon: '🏆', color: '#f97316' },
  { year: '2025', label: 'ACM Best Chapter Award', icon: '👑', color: '#ffd700' },
  { year: '2026', label: "ELICIT'26 — The Cosmic Edition", icon: '🌌', color: '#22d3ee' },
];

const STATS = [
  { v: '4+', l: 'YEARS ACTIVE', c: '#ec09ce' },
  { v: '200+', l: 'MEMBERS', c: '#24dffc' },
  { v: '30+', l: 'EVENTS', c: '#ffd700' },
  { v: '1000+', l: 'LIVES IMPACTED', c: '#b343fd' },
];



export const AboutView: React.FC<AboutProps> = ({ state, addXp, completeMission, setActiveTab }) => {
  React.useEffect(() => {
    // Completes the 'base-mission' when user views the About page
    completeMission('base-mission');
  }, []);

  const handleWarpTab = (tab: ActiveTab) => {
    playSound('warp', state.soundEnabled);
    addXp(20);
    if (setActiveTab) {
      setActiveTab(tab);
    }
  };

  const handleScrollToJourney = () => {
    playSound('click', state.soundEnabled);
    const element = document.getElementById('journey-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full relative px-6 py-8 md:py-12 select-none animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Page Hero */}
          <div className="flex flex-col items-center text-center">



            
          
        {/* Centered text content */}
        <div className="flex max-w-4xl flex-col items-center gap-6 text-center">
          <div className="flex flex-col gap-1">
            <span className="font-pixel text-xs text-cyan-400 tracking-[0.25em] block uppercase">
              ✦ ABOUT US ✦
            </span>

            <h2 className="font-pixel flex flex-col items-center text-3xl sm:text-4xl lg:text-[40px] font-black text-white tracking-wider leading-[1.1]">
              <span>OUR</span>

              <RotatingText
                texts={['MISSION', 'UNIVERSE', 'ACM']}
                mainClassName="px-2 overflow-hidden justify-center text-[#f531ba] [text-shadow:0_0_10px_rgba(168,85,247,0.9),0_0_30px_rgba(168,85,247,0.8)]"

                staggerFrom="last"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-120%' }}
                staggerDuration={0.020}
                splitLevelClassName="overflow-hidden"
                transition={{
                  type: 'spring',
                  damping: 30,
                  stiffness: 400,
                }}
                rotationInterval={1200}
                auto
                loop={false}
              />
            </h2>
          </div>





          <div className="flex max-w-5xl flex-col gap-4 font-mono text-md sm:text-md text-purple-200 leading-relaxed font-bold pt-9">
            <p>
              ACM MUJ is a student chapter driven by{' '}
              <strong className="text-yellow-400">innovation</strong>,{' '}
              <strong className="text-cyan-400">collaboration</strong>, and a passion
              for technology. We build, we learn, we elevate.
            </p>
            <p></p>

            <p>
              As a galactic node of technology and code, our mission is to foster
              continuous development, technical literacy, and state-of-the-art
              hacks. Together we journey into deep-space heights of computer science
              and technical mastery.
            </p>
          </div>
        </div>




          {/* Full-width marquee */}
          <div className="mt-14 w-screen">
            <RocketMarquee />
          </div>

          



          {/* Stats & Info Split Section */}
          <div className="w-full px-4 sm:px-10 md:px-16 lg:px-38 mt-9 flex flex-col lg:flex-row items-start justify-between gap-12 text-left">
            
            {/* Left Column: About Stats Section */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-30 sm:gap-x-16 max-w-md shrink-0">
              {STATS.map((s, i) => (
                <motion.div 
                  key={s.l} 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.04, ease: "easeOut" }}
                  onMouseEnter={() => playSound('hover', state.soundEnabled)}
                  className="transition-all duration-200 hover:-translate-y-1" 
                >
                  <div 
                    className="font-pixel text-2xl md:text-3xl font-bold mb-2 leading-none" 
                    style={{ 
                      color: s.c, 
                      textShadow: `0 0 8px ${s.c}, 0 0 25px ${s.c}aa, 0 0 50px ${s.c}44` 
                    }}
                  >
                    {s.v}
                  </div>
                  <div className="font-pixel text-xs text-purple-300 tracking-wider leading-relaxed font-semibold">
                    {s.l}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Column: Title + Paragraph Description */} 
            <div className="flex flex-col gap-14 max-w-lg text-center"> 
              
              {/* 1. Title Element (Enters First) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: 0.0, ease: "easeOut" }}
                className="transition-all duration-200 "
              >
                <GradientText 
                  colors={["#f4fc11","#f19605","#f6dd41"]} 
                  animationSpeed={4} 
                  className="custom-class px-4 font-pixel text-3xl sm:text-4xl lg:text-[40px] filter drop-shadow-[0_0_20px_rgba(247,159,19,1)]" 
                > 
                  ELICIT 
                </GradientText> 
              </motion.div>

              {/* 2. Paragraph Element (Enters second with a slight stagger delay) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: 0.55, ease: "easeOut" }} // Staggered by 0.15s
                className="transition-all duration-200 "
              > 
                <p className="font-mono max-w-sm text-sm sm:text-sm text-purple-200 leading-relaxed mx-auto"> 
                  Our metrics reflect a continuous trajectory through the tech landscape. By organizing large-scale hackathons, specialized developer bootcamps, and open-source contribution drives, we actively map new coordinates for student innovation and technical excellence. 
                </p> 
              </motion.div> 

            </div>


          </div>




            {/* Action Buttons */}
            <div className="mt-24 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => handleWarpTab('events')}
                onMouseEnter={() => playSound('hover', state.soundEnabled)}
                className="font-pixel text-xs tracking-wider bg-cyan-950/20 hover:bg-cyan-900/40 border-4 border-cyan-700 hover:border-cyan-400 text-purple-200 hover:text-white px-5 py-3 rounded cursor-pointer transition-all font-bold"
              >
                EXPLORE EVENTS ▶
              </button>
              <button
                onClick={() => handleWarpTab('team')}
                onMouseEnter={() => playSound('hover', state.soundEnabled)}
                className="font-pixel text-xs tracking-wider bg-purple-950/20 hover:bg-purple-900/40 border-4 border-purple-700 hover:border-purple-400 text-purple-200 hover:text-white px-5 py-3 rounded cursor-pointer transition-all font-bold"
              >
                MEET THE TEAM
              </button>
            </div>
          </div>

        </div>

      </div>
   
  );
};

