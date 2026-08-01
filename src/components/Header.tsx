import React from 'react';
import { ActiveTab, ExplorerState } from '../types';
import { playSound } from '../utils/sound';
import { Volume2, VolumeX, Music2, UserPlus } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  state: ExplorerState;
  toggleSound: () => void;
  toggleMusic: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  state,
  toggleSound,
  toggleMusic,
  onOpenProfile,
}) => {
  const tabs: { id: ActiveTab; label: string }[] = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'events', label: 'EVENTS' },
    { id: 'team', label: 'TEAM' },
    { id: 'contact', label: 'CONTACT' },
    { id: 'sponsors', label: 'SPONSORS' },
    { id: 'dev-team', label: 'DEV TEAM' },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    playSound('click', state.soundEnabled);
    setActiveTab(tabId);
  };

  return (
    <header className="w-full bg-[#050110]/90 backdrop-blur-md sticky top-0 z-50 px-4 py-4 select-none border-b border-purple-950/40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo and Brand */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleTabClick('home')}
        >
          {/* Planet Icon matching the logo */}
          <div className="relative w-10 h-10 flex-shrink-0">
            <svg viewBox="0 0 64 64" className="w-full h-full filter drop-shadow-[0_0_8px_#a78bfa]">
              <circle cx="32" cy="32" r="16" fill="#6d28d9" />
              <circle cx="32" cy="32" r="13" fill="#8b5cf6" />
              <path d="M 6,32 Q 32,12 58,32" stroke="#a78bfa" strokeWidth="3" fill="none" />
              <path d="M 12,38 Q 32,54 52,38" stroke="#a78bfa" strokeWidth="2" fill="none" opacity="0.7" />
              {/* Star sparkles */}
              <circle cx="24" cy="22" r="1.5" fill="#ffffff" />
              <circle cx="42" cy="26" r="1" fill="#ffffff" />
            </svg>
          </div>
          <div>
            <h1 className="font-pixel text-xl sm:text-2xl text-[#facc15] tracking-widest leading-none">
              ELICIT'26
            </h1>
            <p className="font-mono text-[9px] text-[#8b5cf6] font-bold tracking-widest mt-1">
              MUJ ACM STUDENT CHAPTER
            </p>
          </div>
        </div>

        {/* Central Retro Navigation */}
        <nav className="flex items-center gap-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                onMouseEnter={() => playSound('hover', state.soundEnabled)}
                className={`font-pixel text-[11px] sm:text-xs transition-all duration-150 relative cursor-pointer ${
                  isActive
                    ? 'text-[#facc15] px-3 py-1.5 border border-[#eab308] bg-yellow-500/5 shadow-[0_0_10px_rgba(234,179,8,0.2)]'
                    : 'text-purple-300 hover:text-white px-3 py-1.5'
                }`}
                style={{
                  clipPath: isActive ? 'polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)' : undefined
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right side primary CTA & Sound settings */}
        <div className="flex items-center gap-4">
          
          {/* Audio controls */}
          <div className="flex items-center gap-1 bg-purple-950/30 border border-purple-900/50 rounded p-1">
            <button
              onClick={() => {
                toggleSound();
                playSound('click', !state.soundEnabled);
              }}
              className={`p-1.5 rounded hover:bg-purple-900/30 transition-colors cursor-pointer ${
                state.soundEnabled ? 'text-yellow-400' : 'text-purple-600'
              }`}
              title={state.soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            >
              <Volume2 size={14} />
            </button>
          </div>

          {/* Primary CTA button: Join Us */}
          <button
            onClick={() => handleTabClick('contact')}
            onMouseEnter={() => playSound('hover', state.soundEnabled)}
            className="font-pixel text-xs text-[#22d3ee] hover:text-white border-2 border-[#22d3ee] bg-cyan-950/10 hover:bg-[#22d3ee]/20 px-5 py-2.5 transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(34,211,238,0.15)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
            style={{
              clipPath: 'polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px)'
            }}
          >
            <UserPlus size={12} />
            <span>JOIN US</span>
          </button>

        </div>

      </div>
    </header>
  );
};
