// src/components/WorkGallery.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playSound } from '../utils/sound';
import Portal from './3d/Portal';
import { Canvas } from '@react-three/fiber';

interface WorkItem {
  id: string;
  title: string;
  category: string;
  image: string;
}

// Genuine ELICIT '26 content — replaces the previously copied third-party
// client list. Titles/categories describe MUJ ACM's own event highlights.
const WORK_ITEMS: WorkItem[] = [
  { id: '1', title: 'Opening Ceremony', category: 'Ceremony', image: '/about/DSC_0074.jpg' },
  { id: '2', title: 'Hack the Night', category: 'Hackathon', image: '/about/DSC01089.jpg' },
  { id: '3', title: 'Build Sprint', category: 'Hackathon', image: '/about/DSC01093.jpg' },
  { id: '4', title: 'Robotics Arena', category: 'Competition', image: '/about/DSC01123.jpg' },
  { id: '5', title: 'Design Jam', category: 'Workshop', image: '/about/DSC03579-2.jpg' },
  { id: '6', title: 'AI/ML Bootcamp', category: 'Workshop', image: '/about/DSC05277-Enhanced-NR.jpg' },
  { id: '7', title: 'Gaming Grid Arena', category: 'Gaming', image: '/about/DSC05360-Enhanced-NR.jpg' },
  { id: '8', title: 'CTF Championship', category: 'Competition', image: '/about/DSC09563.jpg' },
  { id: '9', title: 'Speaker Session', category: 'Talk', image: '/about/DSC09810.jpg' },
  { id: '10', title: 'Team Huddle', category: 'Behind the Scenes', image: '/about/DSC09946.jpg' },
  { id: '11', title: 'Crowd at Main Stage', category: 'Ceremony', image: '/about/IMG_0013.jpg' },
  { id: '12', title: 'Cloud Workshop', category: 'Workshop', image: '/about/IMG_0043.jpg' },
  { id: '13', title: 'Esports Finals', category: 'Gaming', image: '/about/IMG_0465.jpg' },
  { id: '14', title: 'Prize Distribution', category: 'Ceremony', image: '/about/IMG_0651.jpg' },
  { id: '15', title: 'Late Night Debugging', category: 'Hackathon', image: '/about/IMG_3281.jpg' },
  { id: '16', title: 'Closing Night', category: 'Ceremony', image: '/about/IMG_8134.jpg' },
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'Hackathon', label: 'Hackathon' },
  { id: 'Workshop', label: 'Workshop' },
  { id: 'Competition', label: 'Competition' },
  { id: 'Gaming', label: 'Gaming' },
  { id: 'Ceremony', label: 'Ceremony' },
  { id: 'Talk', label: 'Talks' },
  { id: 'Behind the Scenes', label: 'Behind the Scenes' },
];

interface WorkGalleryProps {
  soundEnabled?: boolean;
}

export const WorkGallery: React.FC<WorkGalleryProps> = ({ soundEnabled = true }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);

  const filteredItems =
    activeCategory === 'all' ? WORK_ITEMS : WORK_ITEMS.filter((item) => item.category === activeCategory);

  const handleCategoryClick = (categoryId: string) => {
    playSound('click', soundEnabled);
    setActiveCategory(categoryId);
  };

  const handleItemClick = (item: WorkItem) => {
    playSound('click', soundEnabled);
    setSelectedItem(item);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
      {/* ===== BACKGROUND: gold dust helix (3D, behind everything) ===== */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
          <Portal />
        </Canvas>
      </div>

      {/* ===== MAIN CONTENT (above the 3D background) ===== */}
      <div className="relative z-10 pt-16 pb-12">
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
                    ${activeCategory === cat.id ? 'text-white' : 'text-white/30 hover:text-white/70'}
                  `}
                >
                  {cat.label}
                  {activeCategory === cat.id && (
                    <motion.span
                      layoutId="activeCategory"
                      className="absolute -bottom-1 left-0 right-0 h-[1px] bg-cyan-400/70"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ===== GRID ===== */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="group relative aspect-[4/3] overflow-hidden cursor-pointer bg-[#1a1a1a] border border-white/5"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="font-mono text-[10px] text-cyan-300/70 uppercase tracking-wider mb-1">
                        {item.category}
                      </p>
                      <h3 className="font-mono text-sm text-white font-medium leading-tight">{item.title}</h3>
                    </div>
                  </div>

                  <div className="absolute top-4 left-4">
                    <span className="font-mono text-[8px] text-white/20 uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredItems.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <p className="font-mono text-white/20 uppercase tracking-wider">No items in this category yet</p>
            </div>
          )}
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
                <p className="font-mono text-[10px] text-cyan-300/60 uppercase tracking-wider">
                  {selectedItem.category}
                </p>
                <h2 className="font-mono text-xl md:text-2xl text-white font-medium mt-1">{selectedItem.title}</h2>
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
