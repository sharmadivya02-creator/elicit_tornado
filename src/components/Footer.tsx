"use client";

import React from 'react';
import { ActiveTab, ExplorerState } from '../types';
import { playSound } from '../utils/sound';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  state: ExplorerState;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, state }) => {
  const handleJoinClick = () => {
    playSound('warp', state.soundEnabled);
    setActiveTab('contact');
  };

  return (
    <footer className="w-full bg-[#050110] border-t-4 border-purple-900 py-6 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left column */}
        <div className="text-center md:text-left">
          <p className="font-pixel text-[10px] md:text-xs text-purple-400 tracking-wider">
            READY TO BEGIN YOUR JOURNEY?
          </p>
          <p className="font-mono text-sm text-purple-200 mt-1">
            Connect with MUJ ACM Student Chapter to elevate your skills.
          </p>
        </div>

        {/* Center Button */}
        <button
          onClick={handleJoinClick}
          onMouseEnter={() => playSound('hover', state.soundEnabled)}
          className="font-pixel text-xs sm:text-sm bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold px-6 py-3 border-b-4 border-r-4 border-orange-800 hover:border-orange-600 rounded active:translate-x-0.5 active:translate-y-0.5 shadow-[0_0_12px_rgba(234,179,8,0.3)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>JOIN THE MISSION</span>
          <span>▶</span>
        </button>

        {/* Right column - Follow Us social icons */}
        <div className="flex flex-col items-center md:items-end gap-2.5">
          <span className="font-pixel text-[10px] text-purple-400 tracking-widest">FOLLOW US</span>
          <div className="flex items-center gap-3">
            {[
              { id: 'discord', icon: '👾', url: 'https://discord.gg', label: 'Discord' },
              { id: 'instagram', icon: '📸', url: 'https://instagram.com', label: 'Instagram' },
              { id: 'twitter', icon: '🐦', url: 'https://twitter.com', label: 'Twitter' },
              { id: 'youtube', icon: '📺', url: 'https://youtube.com', label: 'YouTube' },
            ].map((soc) => (
              <a
                key={soc.id}
                href={soc.url}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => playSound('hover', state.soundEnabled)}
                onClick={() => playSound('click', state.soundEnabled)}
                className="w-10 h-10 bg-[#12052c] border-2 border-purple-800 rounded flex items-center justify-center text-lg hover:border-yellow-400 hover:shadow-[0_0_10px_rgba(234,179,8,0.5)] transition-all group duration-150"
                title={soc.label}
              >
                <span className="group-hover:scale-125 transition-transform">{soc.icon}</span>
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* MUJ Copyright / Credits */}
      <div className="max-w-7xl mx-auto text-center mt-6 pt-4 border-t border-purple-950">
        <p className="font-mono text-xs text-purple-600 font-medium">
          &copy; {new Date().getFullYear()} MUJ ACM Student Chapter. All rights reserved. Made for Elicit'26.
        </p>
      </div>
    </footer>
  );
};
