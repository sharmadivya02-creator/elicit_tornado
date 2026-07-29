"use client";

import React from 'react';
import { motion } from 'motion/react';

export const CosmicEventsBackground: React.FC = () => {
  // Define constellation stars with percentage coordinates and slightly offset pulse animations
  const constellationStars = [
    { id: 'star-1', cx: 15, cy: 20, pulseDelay: 0, size: 2 },
    { id: 'star-2', cx: 35, cy: 15, pulseDelay: 0.4, size: 2.5 },
    { id: 'star-3', cx: 45, cy: 40, pulseDelay: 0.8, size: 3 },
    { id: 'star-4', cx: 25, cy: 60, pulseDelay: 1.2, size: 2 },
    { id: 'star-5', cx: 60, cy: 50, pulseDelay: 0.2, size: 3 },
    { id: 'star-6', cx: 80, cy: 30, pulseDelay: 0.6, size: 2.5 },
    { id: 'star-7', cx: 85, cy: 65, pulseDelay: 1.0, size: 2 },
    { id: 'star-8', cx: 70, cy: 80, pulseDelay: 1.4, size: 2.5 },
  ];

  // Connection lines between star indices
  const constellationLines = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 0 },
    { from: 2, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 6 },
    { from: 6, to: 7 },
    { from: 4, to: 7 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Delicate Constellation Vector Grid */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-30" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        {/* Connection Lines with slow dash array drawing animation */}
        {constellationLines.map((line, idx) => {
          const fromStar = constellationStars[line.from];
          const toStar = constellationStars[line.to];
          return (
            <motion.line
              key={`line-${idx}`}
              x1={`${fromStar.cx}%`}
              y1={`${fromStar.cy}%`}
              x2={`${toStar.cx}%`}
              y2={`${toStar.cy}%`}
              stroke="url(#constellation-grad)"
              strokeWidth="0.15"
              strokeDasharray="1 2"
              initial={{ opacity: 0.1 }}
              animate={{ opacity: [0.15, 0.4, 0.15] }}
              transition={{
                duration: 4 + (idx % 3) * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Linear Gradients definitions */}
        <defs>
          <linearGradient id="constellation-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>

      {/* Pulsing Intersections (Stars) */}
      {constellationStars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white flex items-center justify-center"
          style={{
            left: `${star.cx}%`,
            top: `${star.cy}%`,
            width: `${star.size * 2}px`,
            height: `${star.size * 2}px`,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 10px rgba(34, 211, 238, 0.8), 0 0 20px rgba(139, 92, 246, 0.4)',
          }}
        >
          {/* Sparkle core with motion */}
          <motion.div
            className="w-full h-full rounded-full bg-cyan-200"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              delay: star.pulseDelay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      ))}

      {/* Gentle, Slow Shooting Stars */}
      {/* Shooting Star 1 - Cyan/Cyan-glow, slow diagonal travel */}
      <motion.div
        className="absolute w-[140px] h-[2px] rounded-full rotate-[135deg] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(34,211,238,0) 0%, rgba(34,211,238,0.7) 60%, rgba(255,255,255,1) 100%)',
          boxShadow: '0 0 8px rgba(34,211,238,0.6), 0 0 16px rgba(34,211,238,0.3)',
          top: '10%',
          left: '20%',
        }}
        animate={{
          x: ['-100px', '500px'],
          y: ['-100px', '500px'],
          opacity: [0, 0, 0.9, 0.9, 0, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          repeatDelay: 9,
          ease: "easeInOut",
        }}
      />

      {/* Shooting Star 2 - Purple/Pink glow, staggered path & slower */}
      <motion.div
        className="absolute w-[110px] h-[1.5px] rounded-full rotate-[135deg] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(168,85,247,0) 0%, rgba(236,72,153,0.8) 70%, rgba(255,255,255,1) 100%)',
          boxShadow: '0 0 10px rgba(236,72,153,0.5), 0 0 18px rgba(168,85,247,0.3)',
          top: '25%',
          left: '60%',
        }}
        animate={{
          x: ['-50px', '450px'],
          y: ['-50px', '450px'],
          opacity: [0, 0, 1, 1, 0, 0],
        }}
        transition={{
          duration: 4.2,
          delay: 4.5,
          repeat: Infinity,
          repeatDelay: 12,
          ease: "easeInOut",
        }}
      />

      {/* Shooting Star 3 - Gold spark, subtle and very high/short route */}
      <motion.div
        className="absolute w-[80px] h-[1.5px] rounded-full rotate-[135deg] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(234,179,8,0) 0%, rgba(234,179,8,0.8) 70%, rgba(255,255,255,1) 100%)',
          boxShadow: '0 0 6px rgba(234,179,8,0.6)',
          top: '5%',
          left: '75%',
        }}
        animate={{
          x: ['-50px', '250px'],
          y: ['-50px', '250px'],
          opacity: [0, 0.8, 0.8, 0, 0],
        }}
        transition={{
          duration: 3.0,
          delay: 8.0,
          repeat: Infinity,
          repeatDelay: 15,
          ease: "easeOut",
        }}
      />
    </div>
  );
};
