// src/components/WorkGallery.tsx
'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playSound } from '../utils/sound';
import RippleDistortion from './RippleDistortion';

interface WorkItem {
    id: string;
    title: string;
    category: string;
    image: string;
    description: string;
}

const WORK_ITEMS: WorkItem[] = [
    {
        id: '1',
        title: 'Powered to Play All Day',
        category: 'Campaign',
        image: '/about/DSC_0074.jpg',
        description: 'The film captures the relentless energy of a generation that moves fast, plays hard, and refuses to be unplugged.'
    },
    {
        id: '2',
        title: 'An All-New Audio Experience',
        category: 'Film',
        image: '/about/DSC01089.jpg',
        description: 'The film introduces an all-new audio experience, redefining the way we listen, move, and feel music.'
    },
    {
        id: '3',
        title: 'Perfection at Play',
        category: 'CGI Production',
        image: '/about/DSC01093.jpg',
        description: 'Campaign presenting the OnePlus Buds Pro 3 as a luxury, high-fashion accessory for audiophiles who value both style and sound.'
    },
    {
        id: '4',
        title: 'OnePlus 12',
        category: 'Campaign',
        image: '/about/DSC01123.jpg',
        description: 'A First Look launch film for the OnePlus 12, themed Inspired by Nature, shot on location in New Zealand.'
    },
    {
        id: '5',
        title: 'OnePlus Pad Go 2',
        category: 'Campaign',
        image: '/about/DSC03579-2.jpg',
        description: 'PAD GO 2 is a next-generation large-screen productivity companion built for today\'s generation of learners, creators, and doers.'
    },
    {
        id: '6',
        title: 'LASALLE Show 2023',
        category: 'Brand Design',
        image: '/about/DSC05277-Enhanced-NR.jpg',
        description: 'Creative identity for LASALLE\'s 2023 graduation show Rise Above, representing eight academic programs through animated CGI objects.'
    },
    {
        id: '7',
        title: 'Year of the Rabbit',
        category: 'Film',
        image: '/about/DSC05360-Enhanced-NR.jpg',
        description: 'A return to one\'s origins, epitomized by the campaign\'s central figure, the rabbit, tracing the water paths that lead to home.'
    },
    {
        id: '8',
        title: 'Louis Vuitton Series',
        category: 'Campaign',
        image: '/about/DSC09563.jpg',
        description: 'A two-year collaboration producing globally-targeted sneaker campaign films and content, made entirely in Shanghai.'
    },
    {
        id: '9',
        title: 'Oriens Lumina Walks',
        category: 'Experiential',
        image: '/about/DSC09810.jpg',
        description: 'The 16th in Moment Factory\'s Lumina night walk series — and its first in China — an immersive multimedia journey through ancient Chinese mythology in Shanghai.'
    },
    {
        id: '10',
        title: 'The Eternal Horse x Marina IFC',
        category: 'Experiential',
        image: '/about/DSC09946.jpg',
        description: 'The project aims to become a signature experience during the Lunar New Year where technology, Vietnamese culture, and contemporary art come together.'
    },
    {
        id: '11',
        title: '88rising — Head in the Clouds',
        category: 'Brand Design',
        image: '/about/IMG_0013.jpg',
        description: 'Design and 3D visual branding for 88rising\'s Heads in the Clouds festival in LA — billboards, festival maps, ad mats, and flyers.'
    },
    {
        id: '12',
        title: 'Ultimune Shiseido',
        category: 'CGI Production',
        image: '/about/IMG_0043.jpg',
        description: 'Immersive 360° visual installation for Shiseido\'s pop-up exhibition in Ginza, Tokyo, centred around the Camellia flower and Japan\'s natural landscapes.'
    },
    {
        id: '13',
        title: 'Cartier Christmas Minisite',
        category: 'Experiential',
        image: '/about/IMG_0465.jpg',
        description: 'The minisite translates Cartier\'s iconic unboxing ritual into a refined digital journey, showcasing a curated selection of nine products.'
    },
    {
        id: '14',
        title: 'Highlands Coffee',
        category: 'Campaign',
        image: '/about/IMG_0651.jpg',
        description: 'A product campaign introducing the refreshed Highlands Coffee ground coffee packaging — where Vietnam\'s highland landscapes are brought to life through bold visual design.'
    },
    {
        id: '15',
        title: 'Waiting — Rome in Silver',
        category: 'Film',
        image: '/about/IMG_3281.jpg',
        description: 'A full-CGI music video for California-based electronic producer Rome in Silver\'s single Waiting, featuring dragonflies journeying through a nocturnal garden.'
    },
    {
        id: '16',
        title: 'Cartier Vision',
        category: 'CGI Production',
        image: '/about/IMG_8134.jpg',
        description: 'A conceptual project reimagining how Cartier could connect with clients through Apple Vision Pro, plus an interactive digital art installation for the Cartier Japan office.'
    },
];

const CATEGORIES = [
    { id: 'all', label: 'All projects', count: 16 },
    { id: 'CGI Production', label: 'CGI Production', count: 4 },
    { id: 'Brand Design', label: 'Brand Design', count: 3 },
    { id: 'Film', label: 'Film', count: 3 },
    { id: 'Campaign', label: 'Campaign', count: 4 },
    { id: 'Experiential', label: 'Experiential', count: 2 },
];

interface WorkGalleryProps {
    soundEnabled?: boolean;
}

export const WorkGallery: React.FC<WorkGalleryProps> = ({ soundEnabled = true }) => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);

    const filteredItems = useMemo(() => {
        return activeCategory === 'all'
            ? WORK_ITEMS
            : WORK_ITEMS.filter((item) => item.category === activeCategory);
    }, [activeCategory]);

    const handleCategoryClick = useCallback((categoryId: string) => {
        playSound('click', soundEnabled);
        setActiveCategory(categoryId);
    }, [soundEnabled]);

    const handleItemClick = useCallback((item: WorkItem) => {
        playSound('click', soundEnabled);
        setSelectedItem(item);
    }, [soundEnabled]);

    return (
        <div className="relative min-h-screen bg-[#0a0a0a] text-white font-sans">
            {/* ===== MAIN CONTENT ===== */}
            <div className="relative z-10 pt-12 pb-12">
                <div className="max-w-7xl mx-auto px-6">

                    {/* ===== CATEGORY FILTER - fromanother style ===== */}
                    <div className="mb-12 overflow-x-auto">
                        <div className="flex flex-nowrap items-center gap-x-8 gap-y-3 min-w-max">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryClick(cat.id)}
                                    onMouseEnter={() => playSound('hover', soundEnabled)}
                                    className={`
                    group relative font-mono text-sm uppercase tracking-wider transition-all duration-300 whitespace-nowrap
                    ${activeCategory === cat.id ? 'text-white' : 'text-white/30 hover:text-white/70'}
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

                    {/* ===== GRID - 2 columns with Ripple Effect ===== */}
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence mode="wait">
                            {filteredItems.map((item, index) => {
                                const isHovered = hoveredId === item.id;

                                return (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -30 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: Math.min(index * 0.05, 0.3),
                                            ease: 'easeOut'
                                        }}
                                        onMouseEnter={() => setHoveredId(item.id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                        onClick={() => handleItemClick(item)}
                                        className="group relative aspect-[4/3] overflow-hidden cursor-pointer bg-[#1a1a1a]"
                                    >
                                        {/* Ripple Distortion Effect on Image */}
                                        <RippleDistortion

                                            color="rgba(168, 85, 247, 0.3)" // Purple tint
                                            intensity={0.3} // How strong the distortion is
                                            speed={2} // How fast the ripples move
                                            className="absolute inset-0 w-full h-full"
                                        >
                                            {/* Put the actual image tag INSIDE the RippleDistortion */}
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </RippleDistortion>

                                        {/* ===== EXACT fromanother HOVER OVERLAY ===== */}
                                        <div
                                            className={`
                        absolute inset-0 
                        bg-gradient-to-t from-black/95 via-black/60 to-transparent 
                        transition-opacity duration-500
                        ${isHovered ? 'opacity-100' : 'opacity-0'}
                      `}
                                        >
                                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                                {/* Category - small, subtle, uppercase like fromanother */}
                                                <p className="font-mono text-[10px] text-white/40 uppercase tracking-wider mb-2">
                                                    {item.category}
                                                </p>

                                                {/* Title - large, bold, white like fromanother */}
                                                <h3 className="font-mono text-2xl md:text-3xl text-white font-medium leading-tight mb-3">
                                                    {item.title}
                                                </h3>

                                                {/* Description - slides up with fade like fromanother */}
                                                <motion.p
                                                    initial={{ opacity: 0, y: 15 }}
                                                    animate={{
                                                        opacity: isHovered ? 1 : 0,
                                                        y: isHovered ? 0 : 15
                                                    }}
                                                    transition={{ duration: 0.4, delay: 0.1 }}
                                                    className="font-mono text-sm text-white/60 leading-relaxed max-w-lg"
                                                >
                                                    {item.description}
                                                </motion.p>
                                            </div>
                                        </div>

                                        {/* Category badge - always visible in corner like fromanother */}
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="font-mono text-[8px] text-white/20 uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded">
                                                {item.category}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>

                    {filteredItems.length === 0 && (
                        <div className="flex items-center justify-center h-64">
                            <p className="font-mono text-white/20 uppercase tracking-wider">No work yet</p>
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
                                <p className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
                                    {selectedItem.category}
                                </p>
                                <h2 className="font-mono text-xl md:text-2xl text-white font-medium mt-1">
                                    {selectedItem.title}
                                </h2>
                                <p className="font-mono text-sm text-white/40 mt-2 leading-relaxed">
                                    {selectedItem.description}
                                </p>
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