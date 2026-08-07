// src/components/AboutView.tsx - Updated to use WorkGallery
"use client";

import React from 'react';
import { ActiveTab, ExplorerState } from '../types';
import { playSound } from '../utils/sound';
import { motion } from 'motion/react';
import { WorkGallery } from './WorkGallery';

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
    <div className="w-full relative min-h-screen bg-[#0a0a0a]">
      {/* Work Gallery - Full page experience */}
      <WorkGallery soundEnabled={state.soundEnabled} />
    </div>
  );
};