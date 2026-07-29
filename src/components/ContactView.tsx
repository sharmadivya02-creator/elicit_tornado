"use client";

import React, { useState } from 'react';
import { ExplorerState } from '../types';
import { playSound } from '../utils/sound';
import { 
  Send, 
  Database, 
  Mail, 
  MessageSquare,
  Radio,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Inline brand SVGs (removed from lucide-react v1)
const InstagramIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.01" fill="currentColor" strokeWidth="3"/>
  </svg>
);

const LinkedinIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

interface ContactProps {
  state: ExplorerState;
  addCoins: (amount: number) => void;
  addXp: (amount: number) => void;
  completeMission: (id: string) => void;
  triggerToast: (title: string, desc: string, icon?: string) => void;
}

interface MessageLog {
  id: string;
  name: string;
  email: string;
  content: string;
  timestamp: string;
}

export const ContactView: React.FC<ContactProps> = ({
  state,
  addCoins,
  addXp,
  completeMission,
  triggerToast,
}) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [messages, setMessages] = useState<MessageLog[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('subspace_transmissions');
    return saved ? JSON.parse(saved) : [];
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      playSound('laser', state.soundEnabled);
      triggerToast('Error', 'Please fill in all subspace fields', '⚠️');
      return;
    }

    playSound('warp', state.soundEnabled);
    setIsSending(true);
    
    setTimeout(() => {
      const newMessage: MessageLog = {
        id: String(Date.now()),
        name: formData.name,
        email: formData.email,
        content: formData.message,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => {
        const updated = [newMessage, ...prev];
        localStorage.setItem('subspace_transmissions', JSON.stringify(updated));
        return updated;
      });

      setIsSending(false);
      setFormData({ name: '', email: '', message: '' });
      playSound('success', state.soundEnabled);
      
      addCoins(150);
      addXp(150);
      // Only complete mission and give bonus once
      if (!state.completedMissions.includes('comms-mission')) {
        completeMission('comms-mission');
        triggerToast('Transmission Dispatched', 'Deep space comms link established! +150 Coins & Mission Complete!', '🛰️');
      } else {
        triggerToast('Transmission Dispatched', 'Signal sent to ACM command! +150 Star Coins', '📡');
      }
    }, 2000);
  };

  const handleSocialClick = (url: string) => {
    playSound('warp', state.soundEnabled);
    window.open(url, '_blank');
  };

  return (
    <div className="w-full relative px-4 py-8 select-none animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-7xl mx-auto">
        
        {/* Title Block */}
        <div className="text-center mb-10">
          <span className="font-pixel text-xs text-cyan-400 tracking-widest block mb-1 font-bold">✦ SUB-WAVE TRANSMISSION NEXUS ✦</span>
          <h2 className="font-pixel text-2xl md:text-3xl text-white">
            CONTACT <span className="text-yellow-400">TERMINAL</span>
          </h2>
          <p className="font-mono text-sm text-purple-300 font-bold mt-2 max-w-xl mx-auto">
            Establish a comms sub-wave relay with the ACM flight squadron command.
          </p>
        </div>

        {/* 2-Column Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Left Column: Comms form */}
          <div className="lg:col-span-7 bg-[#0b011d]/90 border-4 border-purple-900 rounded p-6 shadow-[0_0_15px_rgba(124,58,237,0.2)]">
            <h3 className="font-pixel text-xs text-cyan-400 tracking-wider mb-5 border-b-2 border-purple-950 pb-2 flex items-center gap-1.5">
              <span>●</span> ESTABLISH COMMS LINK
            </h3>

            <form onSubmit={handleSend} className="flex flex-col gap-4">
              <div>
                <label className="font-pixel text-xs text-purple-300 block mb-1.5 tracking-wider font-bold">YOUR CALLSIGN / NAME</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="E.G. COMMANDER SMITH"
                  className="w-full bg-[#110526] border border-purple-950 hover:border-purple-850 focus:border-yellow-500 outline-none rounded p-3 font-mono text-xs text-white placeholder-purple-600/60 uppercase"
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="font-pixel text-xs text-purple-300 block mb-1.5 tracking-wider font-bold">TRANSMISSION FREQUENCY / EMAIL</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="COORDS@GALAXY.COM"
                  className="w-full bg-[#110526] border border-purple-950 hover:border-purple-855 focus:border-yellow-500 outline-none rounded p-3 font-mono text-xs text-white placeholder-purple-600/60 uppercase"
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="font-pixel text-xs text-purple-300 block mb-1.5 tracking-wider font-bold">SECURE MESSAGE DATAFRAME</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="TYPE DEEP SPACE SUBWAVE SIGNAL HERE..."
                  rows={4}
                  className="w-full bg-[#110526] border border-purple-950 hover:border-purple-860 focus:border-yellow-500 outline-none rounded p-3 font-mono text-xs text-white placeholder-purple-600/60 uppercase resize-none h-28"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                onMouseEnter={() => playSound('hover', state.soundEnabled)}
              className={`font-pixel text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-3.5 px-6 border-b-4 border-r-4 border-orange-800 hover:border-orange-600 rounded flex items-center justify-center gap-2 mt-2 tracking-wider transition-opacity ${isSending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:brightness-110'}`}
              >
                <span>{isSending ? 'DISPATCHING TRANSMISSION...' : 'LAUNCH TRANSMISSION'}</span>
                <Send size={12} />
              </button>
            </form>
          </div>

          {/* Right Column: RELAY CHANNELS and Social keys */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Squad Coordinates Card */}
            <div className="bg-[#0b011d]/90 border-4 border-purple-900 rounded p-6 shadow-[0_0_15px_rgba(124,58,237,0.2)]">
              <h3 className="font-pixel text-xs text-cyan-400 tracking-wider mb-4 border-b-2 border-purple-950 pb-2 flex items-center gap-1.5">
                <span>●</span> SQUAD COORDINATES
              </h3>
              
              <div className="flex flex-col gap-3 font-mono text-xs font-bold text-purple-200">
                <p>
                  <span className="text-purple-300 font-pixel text-xs block mb-1 font-bold">BASE STATION EMAIL:</span>
                  acm.muj@manipal.edu
                </p>
                <p>
                  <span className="text-purple-300 font-pixel text-xs block mb-1 font-bold">SECTOR ADDRESS:</span>
                  Manipal University Jaipur, Dahmi Kalan, Jaipur-Ajmer Expressway, Rajasthan, India
                </p>
              </div>

              {/* Social Grid */}
              <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-purple-950">
                <span className="font-pixel text-xs text-purple-300 block tracking-wider uppercase font-bold">RELAY CHANNELS</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSocialClick('https://discord.gg/muj-acm')}
                    onMouseEnter={() => playSound('hover', state.soundEnabled)}
                    className="flex-1 min-w-[100px] font-pixel text-xs bg-indigo-950 hover:bg-indigo-900 border border-indigo-700 text-indigo-200 py-2.5 px-3 rounded flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                  >
                    <MessageSquare size={12} />
                    <span>DISCORD</span>
                  </button>
                  <button
                    onClick={() => handleSocialClick('https://instagram.com/muj.acm')}
                    onMouseEnter={() => playSound('hover', state.soundEnabled)}
                    className="flex-1 min-w-[100px] font-pixel text-xs bg-pink-950 hover:bg-pink-900 border border-pink-700 text-pink-200 py-2.5 px-3 rounded flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                  >
                    <InstagramIcon size={12} />
                    <span>INSTAGRAM</span>
                  </button>
                  <button
                    onClick={() => handleSocialClick('https://linkedin.com/company/muj-acm')}
                    onMouseEnter={() => playSound('hover', state.soundEnabled)}
                    className="flex-1 min-w-[100px] font-pixel text-xs bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-200 py-2.5 px-3 rounded flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                  >
                    <LinkedinIcon size={12} />
                    <span>LINKEDIN</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Transmitter Logger Drawer trigger */}
            <div className="bg-[#0b011d]/90 border-4 border-purple-900 rounded p-4 flex items-center justify-between shadow-[0_0_15px_rgba(124,58,237,0.15)]">
              <div>
                <span className="font-pixel text-xs text-purple-300 block uppercase font-bold">TRANSMISSION LOGGER</span>
                <span className="font-mono text-xs text-white font-bold block mt-1">{messages.length} ARCHIVED SIGNALS</span>
              </div>
              <button
                onClick={() => { playSound('click', state.soundEnabled); setShowLogs(!showLogs); }}
                className="font-pixel text-xs bg-[#12052c] border border-purple-800 text-cyan-400 hover:text-white hover:bg-purple-950 px-3 py-2 rounded cursor-pointer transition-colors flex items-center gap-1.5 font-bold"
              >
                <span>{showLogs ? 'HIDE' : 'VIEW LOGS'}</span>
                {showLogs ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              </button>
            </div>

          </div>

        </div>

        {/* Collapsible logs terminal drawer */}
        {showLogs && (
          <div className="bg-[#0b011d]/90 border-4 border-purple-900 rounded p-5 shadow-2xl animate-[slideDown_0.25s_steps(4)] mb-8">
            <h3 className="font-pixel text-xs text-cyan-400 tracking-widest mb-4 flex items-center gap-2 border-b border-purple-950 pb-2 font-bold">
              <Database size={12} /> ARCHIVED COMMS DATABASE
            </h3>

            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center text-purple-500 font-mono text-xs font-bold">
                <Radio size={20} className="animate-pulse mb-2 text-purple-600" />
                <span>NO TRANSMITTED DATA RECORDED IN STORAGE CORES</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[220px] overflow-y-auto pr-2">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-[#110526] border border-purple-950 p-4 rounded flex flex-col gap-2 shadow-inner">
                    <div className="flex items-center justify-between font-pixel text-xs border-b border-purple-950 pb-1.5 font-bold">
                      <span className="text-yellow-400">{msg.name.toUpperCase()}</span>
                      <span className="text-purple-500">{msg.timestamp}</span>
                    </div>
                    <p className="font-mono text-xs text-purple-200 leading-relaxed break-all font-semibold">
                      {msg.content}
                    </p>
                    <span className="font-mono text-xs text-cyan-500/70 block mt-1 font-bold">
                      FREQUENCY: {msg.email}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
