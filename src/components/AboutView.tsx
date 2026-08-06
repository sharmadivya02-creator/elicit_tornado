// src/components/AboutView.tsx

"use client";

import React from 'react';
import { ActiveTab, ExplorerState } from '../types';
import { playSound } from '../utils/sound';
import { motion } from 'motion/react';
import { CosmicTornado3D } from './CosmicTornado3D';

interface AboutProps {
  state: ExplorerState;
  addXp: (amount: number) => void;
  completeMission: (id: string) => void;
  setActiveTab?: (tab: ActiveTab) => void;
}

const STATS = [
  { v: '4+', l: 'YEARS ACTIVE', c: '#ec09ce' },
  { v: '200+', l: 'MEMBERS', c: '#24dffc' },
  { v: '30+', l: 'EVENTS', c: '#ffd700' },
  { v: '1000+', l: 'LIVES IMPACTED', c: '#b343fd' },
];

export const AboutView: React.FC<AboutProps> = ({ state, addXp, completeMission, setActiveTab }) => {
  React.useEffect(() => {
    completeMission('base-mission');
  }, []);

  return (
    <div className="w-full relative min-h-screen">
      
      <div className="fixed inset-0 z-0">
        <CosmicTornado3D />
      </div>

      
      <div className="relative z-10 px-6 py-8 md:py-12 select-none animate-[fadeIn_0.5s_ease-out] min-h-screen">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          
          {/* ================= ELICIT '26 WEBGL SEQUENCE (already rendered as background) ================= */}
          
          {/* ================= STATS SECTION ================= */}
          <div className="w-full px-4 sm:px-10 mt-32 flex flex-col items-center justify-center text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-10 sm:gap-x-16 w-full max-w-5xl">
              {STATS.map((s, i) => (
                <motion.div 
                  key={s.l} 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.04, ease: "easeOut" }}
                  onMouseEnter={() => playSound('hover', state.soundEnabled)}
                  className="transition-all duration-200 hover:-translate-y-1 bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20" 
                >
                  <div 
                    className="font-pixel text-3xl md:text-4xl font-bold mb-2 leading-none" 
                    style={{ 
                      color: s.c, 
                      textShadow: `0 0 8px ${s.c}, 0 0 25px ${s.c}aa, 0 0 50px ${s.c}44` 
                    }}
                  >
                    {s.v}
                  </div>
                  <div className="font-pixel text-xs md:text-sm text-purple-300 tracking-wider leading-relaxed font-semibold">
                    {s.l}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

         
          <div className="h-screen flex items-center justify-center">
            
          </div>

          <div className="h-screen flex items-center justify-center">
           
          </div>
          <div className="h-screen flex items-center justify-center">
           
          </div><div className="h-screen flex items-center justify-center">
           
          </div><div className="h-screen flex items-center justify-center">
           
          </div><div className="h-screen flex items-center justify-center">
           
          </div><div className="h-screen flex items-center justify-center">
           
          </div><div className="h-screen flex items-center justify-center">
           
          </div><div className="h-screen flex items-center justify-center">
           
          </div><div className="h-screen flex items-center justify-center">
           
          </div><div className="h-screen flex items-center justify-center">
           
          </div>
          <div className="h-screen flex items-center justify-center">
           
          </div>
          <div className="h-screen flex items-center justify-center">
           
          </div>
          <div className="h-screen flex items-center justify-center">
           
          </div>
          <div className="h-screen flex items-center justify-center">
           
          </div>
          <div className="h-screen flex items-center justify-center">
           
          </div>
          <div className="h-screen flex items-center justify-center">
           
          </div>
          <div className="h-screen flex items-center justify-center">
           
          </div>
          <div className="h-screen flex items-center justify-center">
           
          </div>
          <div className="h-screen flex items-center justify-center">
           
          </div>
          <div className="h-screen flex items-center justify-center">
           
          </div>
          <div className="h-screen flex items-center justify-center">
           
          </div>
          <div className="h-screen flex items-center justify-center">
           
          </div>
          <div className="h-screen flex items-center justify-center">
           
          </div>
          <div className="h-screen flex items-center justify-center">
           
          </div>
          <div className="h-screen flex items-center justify-center">
           
          </div>
          <div className="h-screen flex items-center justify-center">
           
          </div>
          <div className="h-screen flex items-center justify-center">
           
          </div>
          <div className="h-screen flex items-center justify-center">
           
          </div>


        </div>
      </div>
    </div>
  );
};