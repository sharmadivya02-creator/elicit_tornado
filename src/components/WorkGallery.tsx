// src/components/WorkGallery.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playSound } from '../utils/sound';

interface WorkItem {
  id: string;
  title: string;
  category: string;
  image: string;
}

const WORK_ITEMS: WorkItem[] = [
  { id: '1', title: 'Powered to Play All Day', category: 'Film', image: '/about/DSC_0074.jpg' },
  { id: '2', title: 'An All-New Audio Experience', category: 'CGI Production', image: '/about/DSC01089.jpg' },
  { id: '3', title: 'Perfection at Play', category: 'Brand Design', image: '/about/DSC01093.jpg' },
  { id: '4', title: 'OnePlus 12', category: 'Campaign', image: '/about/DSC01123.jpg' },
  { id: '5', title: 'OnePlus Pad Go 2', category: 'Experiential', image: '/about/DSC03579-2.jpg' },
  { id: '6', title: 'LASALLE Show 2023', category: 'Film', image: '/about/DSC05277-Enhanced-NR.jpg' },
  { id: '7', title: 'Year of the Rabbit', category: 'CGI Production', image: '/about/DSC05360-Enhanced-NR.jpg' },
  { id: '8', title: 'Louis Vuitton Series', category: 'Brand Design', image: '/about/DSC09563.jpg' },
  { id: '9', title: 'Oriens Lumina Walks', category: 'Film', image: '/about/DSC09810.jpg' },
  { id: '10', title: 'The Eternal Horse x Marina IFC', category: 'Experiential', image: '/about/DSC09946.jpg' },
  { id: '11', title: '88rising — Head in the Clouds', category: 'Campaign', image: '/about/IMG_0013.jpg' },
  { id: '12', title: 'Ultimune Shiseido', category: 'CGI Production', image: '/about/IMG_0043.jpg' },
  { id: '13', title: 'Cartier Christmas Minisite', category: 'Brand Design', image: '/about/IMG_0465.jpg' },
  { id: '14', title: 'Highlands Coffee', category: 'Campaign', image: '/about/IMG_0651.jpg' },
  { id: '15', title: 'Waiting — Rome in Silver', category: 'Film', image: '/about/IMG_3281.jpg' },
  { id: '16', title: 'Cartier Vision', category: 'CGI Production', image: '/about/IMG_8134.jpg' },
];

const CATEGORIES = [
  { id: 'all', label: 'All projects', count: 16 },
  { id: 'CGI Production', label: 'CGI Production', count: 13 },
  { id: 'Brand Design', label: 'Brand Design', count: 2 },
  { id: 'Film', label: 'Film', count: 9 },
  { id: 'Campaign', label: 'Campaign', count: 9 },
  { id: 'Experiential', label: 'Experiential', count: 5 },
];

interface WorkGalleryProps {
  soundEnabled?: boolean;
}

export const WorkGallery: React.FC<WorkGalleryProps> = ({ soundEnabled = true }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Cookie consent state
  const [showCookieBanner, setShowCookieBanner] = useState(true);

  const filteredItems = activeCategory === 'all' 
    ? WORK_ITEMS 
    : WORK_ITEMS.filter(item => item.category === activeCategory);

  const handleCategoryClick = (categoryId: string) => {
    playSound('click', soundEnabled);
    setActiveCategory(categoryId);
  };

  const handleItemClick = (item: WorkItem) => {
    playSound('click', soundEnabled);
    setSelectedItem(item);
  };

  const handleCookieAccept = () => {
    setShowCookieBanner(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      
      {/* ===== COOKIE BANNER ===== */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-t border-white/10 p-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-mono text-xs text-white/60">
              We use cookies to enhance your experience.
            </p>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleCookieAccept}
                className="font-mono text-xs text-white/40 hover:text-white transition-colors uppercase tracking-wider"
              >
                Deny
              </button>
              <button 
                onClick={handleCookieAccept}
                className="font-mono text-xs text-white hover:text-white/80 transition-colors uppercase tracking-wider border border-white/20 px-6 py-2 hover:bg-white/5"
              >
                Allow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MENU ===== */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="font-mono text-xs text-white/60 hover:text-white transition-colors uppercase tracking-wider"
          >
            {isMenuOpen ? 'Close' : 'Menu'}
          </button>
          
          <div className="flex items-center gap-8">
            <a href="#" className="font-mono text-xs text-white/40 hover:text-white transition-colors uppercase tracking-wider">
              Home
            </a>
            <a href="#" className="font-mono text-xs text-white/40 hover:text-white transition-colors uppercase tracking-wider">
              Work
            </a>
            <a href="#" className="font-mono text-xs text-white/40 hover:text-white transition-colors uppercase tracking-wider">
              Lab
            </a>
          </div>
          
          <button className="font-mono text-xs text-white/60 hover:text-white transition-colors uppercase tracking-wider">
            Let's chat
          </button>
        </div>
      </div>

      {/* ===== MENU OVERLAY ===== */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="text-center" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-6 right-6 font-mono text-xs text-white/40 hover:text-white transition-colors uppercase tracking-wider"
              >
                Close
              </button>
              <nav className="flex flex-col gap-8">
                <a href="#" className="font-mono text-4xl text-white/80 hover:text-white transition-colors">Home</a>
                <a href="#" className="font-mono text-4xl text-white/80 hover:text-white transition-colors">Work</a>
                <a href="#" className="font-mono text-4xl text-white/80 hover:text-white transition-colors">Lab</a>
                <a href="#" className="font-mono text-4xl text-white/80 hover:text-white transition-colors">Contact</a>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MAIN CONTENT ===== */}
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* ===== CATEGORY FILTER ===== */}
          <div className="mb-12">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  onMouseEnter={() => playSound('hover', soundEnabled)}
                  className={`
                    group relative font-mono text-sm uppercase tracking-wider transition-all duration-300
                    ${activeCategory === cat.id 
                      ? 'text-white' 
                      : 'text-white/30 hover:text-white/70'
                    }
                  `}
                >
                  {cat.label}
                  <span className="ml-2 text-[10px] text-white/20">
                    {cat.count}
                  </span>
                  {activeCategory === cat.id && (
                    <motion.span 
                      layoutId="activeCategory"
                      className="absolute -bottom-1 left-0 right-0 h-[1px] bg-white/50"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ===== GRID ===== */}
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="wait">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => handleItemClick(item)}
                  className="group relative aspect-[4/3] overflow-hidden cursor-pointer bg-[#1a1a1a]"
                >
                  {/* Image */}
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Overlay - appears on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="font-mono text-[10px] text-white/50 uppercase tracking-wider mb-1">
                        {item.category}
                      </p>
                      <h3 className="font-mono text-sm text-white font-medium leading-tight">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Category badge - visible always */}
                  <div className="absolute top-4 left-4">
                    <span className="font-mono text-[8px] text-white/20 uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* ===== EMPTY STATE ===== */}
          {filteredItems.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <p className="font-mono text-white/20 uppercase tracking-wider">
                No work yet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="font-mono text-xs text-white/40 uppercase tracking-wider">
                Contact us or <br className="md:hidden" />
                <span className="text-white/60">start a brief</span>
              </p>
              <a 
                href="mailto:firstcontact@fromanother.love"
                className="font-mono text-sm text-white/60 hover:text-white transition-colors block mt-1"
              >
                firstcontact@fromanother.love
              </a>
            </div>
            
            <div className="flex items-center gap-6">
              <span className="font-mono text-xs text-white/20 uppercase tracking-wider">
                Hello, welcome to fromanother!
              </span>
              <span className="font-mono text-xs text-white/20">
                100%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-[#1a1a1a] rounded-lg overflow-hidden cursor-default"
            >
              <img 
                src={selectedItem.image} 
                alt={selectedItem.title}
                className="w-full h-auto max-h-[75vh] object-contain"
                referrerPolicy="no-referrer"
              />
              
              <div className="p-6 md:p-8">
                <p className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
                  {selectedItem.category}
                </p>
                <h2 className="font-mono text-xl md:text-2xl text-white font-medium mt-1">
                  {selectedItem.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors font-mono text-xs uppercase tracking-wider"
              >
                ✕ Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};