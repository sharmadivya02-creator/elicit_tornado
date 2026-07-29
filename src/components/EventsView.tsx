"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ActiveTab, ExplorerState, EventItem } from '../types';
import { PixelRocket, PixelStar, PixelStarCoin } from './PixelArtwork';
import { ChooseYourMissionCard } from './AnimatedCosmicVessel';
import { CosmicEventsBackground } from './CosmicEventsBackground';
import { playSound } from '../utils/sound';
import { INITIAL_EVENTS } from '../data';
import { RefreshCw, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CardProps {
  event: EventItem;
  onClick: () => void;
  delay: number;
  soundEnabled: boolean;
  isRegistered: boolean;
}

const EventCard: React.FC<CardProps> = ({
  event,
  onClick,
  delay,
  soundEnabled,
  isRegistered,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [shimmer, setShimmer] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const glitchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2;
    const cy = r.height / 2;
    setTilt({ rx: -((y - cy) / cy) * 11, ry: ((x - cx) / cx) * 11 });
    setShimmer({ x: (x / r.width) * 100, y: (y / r.height) * 100 });
  }, []);

  const onMouseEnter = useCallback(() => {
    setHovered(true);
    setGlitch(true);
    playSound('hover', soundEnabled);
    if (glitchTimer.current) clearTimeout(glitchTimer.current);
    glitchTimer.current = setTimeout(() => setGlitch(false), 380);
  }, [soundEnabled]);

  const onMouseLeave = useCallback(() => {
    setHovered(false);
    setTilt({ rx: 0, ry: 0 });
  }, []);

  useEffect(() => {
    return () => {
      if (glitchTimer.current) clearTimeout(glitchTimer.current);
    };
  }, []);

  // Map category to color and accent color
  let colorClass = 'cyan';
  let accentHex = '#00e5ff';
  if (event.category === 'hackathon') {
    colorClass = 'orange';
    accentHex = '#ff6600';
  } else if (event.category === 'workshop') {
    colorClass = 'yellow';
    accentHex = '#ffd700';
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ 
        type: 'spring', 
        stiffness: 120, 
        damping: 18,
        delay: delay * 0.001 
      }}
      className="event-card-scene"
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div
        ref={cardRef}
        className={`event-card ${colorClass}`}
        style={{
          transform: hovered
            ? `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(8px) scale(1.03)`
            : 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
          transition: hovered
            ? 'box-shadow 0.3s ease'
            : 'transform 0.5s ease-out, box-shadow 0.3s ease',
        }}
      >
        <div
          className="card-shimmer"
          style={{ background: `radial-gradient(circle at ${shimmer.x}% ${shimmer.y}%, ${accentHex}22 0%, ${accentHex}00 65%)` }}
        />
        <div className="scan-line" style={{ background: `linear-gradient(90deg, transparent, ${accentHex}bb, transparent)` }} />
        {(['tl','tr','bl','br'] as const).map((pos) => (
          <div key={pos} className={`corner corner-${pos}`} style={{ borderColor: accentHex }} />
        ))}

        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span className="cat-tag" style={{ borderColor: accentHex, color: accentHex }}>{event.category.toUpperCase()}</span>
            <span style={{ color: '#555577', fontSize: 10, fontFamily: 'Share Tech Mono, monospace' }}>{event.date}</span>
          </div>

          <h3
            className={`pixel-font card-title${glitch ? ' glitch' : ''}`}
            data-text={event.title}
            style={{ fontSize: '10px', color: '#e0e0ff', lineHeight: 1.55, marginBottom: 12, wordBreak: 'break-word' }}
          >
            {event.title}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'auto' }}>
            <span style={{ color: '#445566', fontSize: 9, fontFamily: 'Share Tech Mono, monospace' }}>DIFFICULTY:</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: 5 }).map((_, sIdx) => (
                <PixelStar key={sIdx} filled={sIdx < event.difficulty} className="w-3.5 h-3.5" />
              ))}
            </div>
          </div>

          <p className="font-mono text-xs text-purple-200 line-clamp-2 leading-relaxed mt-4" style={{ pointerEvents: 'none' }}>
            {event.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="launch-text">{isRegistered ? '✔ MISSION ENGAGED' : '▶ LAUNCH MISSION'}</span>
            <div
              className="arrow-btn"
              style={{ borderColor: accentHex, background: hovered ? `${accentHex}22` : 'transparent', boxShadow: hovered ? `0 0 12px ${accentHex}66` : 'none' }}
            >
              <ChevronRight size={14} color={accentHex} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface EventsProps {
  state: ExplorerState;
  addCoins: (amount: number) => void;
  addXp: (amount: number) => void;
  completeMission: (id: string) => void;
  triggerToast: (title: string, desc: string, icon?: string) => void;
  updateState: (partial: Partial<ExplorerState>) => void;
}

export const EventsView: React.FC<EventsProps> = ({
  state,
  addCoins,
  addXp,
  completeMission,
  triggerToast,
  updateState,
}) => {
  const [filter, setFilter] = useState<'all' | 'hackathon' | 'workshop' | 'competition'>('all');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  
  // Interactive Quiz States for Quiz Nexus
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);

  const quizQuestions = [
    {
      q: "What does ACM stand for?",
      options: [
        "Associated Computer Machinery",
        "Association for Computing Machinery",
        "Autonomous Computer Networks",
        "Advanced Coding Matrix"
      ],
      correct: 1
    },
    {
      q: "Which protocol operates on Port 80?",
      options: ["FTP", "SSH", "HTTP", "HTTPS"],
      correct: 2
    },
    {
      q: "What is the speed of light in deep space?",
      options: ["~300,000 km/s", "~150,000 km/s", "~1,000,000 km/s", "Instantaneous"],
      correct: 0
    }
  ];

  React.useEffect(() => {
    // Complete simple event viewing mission
    completeMission('event-mission');
  }, []);

  const handleFilterClick = (cat: typeof filter) => {
    playSound('click', state.soundEnabled);
    setFilter(cat);
  };

  const handleCardClick = (event: EventItem) => {
    playSound('click', state.soundEnabled);
    setSelectedEvent(event);
    
    // Reset quiz state when selecting another event
    setQuizActive(false);
    setQuizFinished(false);
    setCurrentQuizQuestion(0);
    setQuizAnswers([]);
  };

  const handleRegister = (eventId: string) => {
    playSound('success', state.soundEnabled);
    if (!state.registeredEvents.includes(eventId)) {
      updateState({ registeredEvents: [...state.registeredEvents, eventId] });
      addXp(100);
      addCoins(50);
      triggerToast('Registration Confirmed', `You have registered for ${eventId.replace('-', ' ').toUpperCase()}!`, '🚀');
      
      if (eventId === 'cosmic-hack') {
        completeMission('hackathon-mission');
      }
    } else {
      triggerToast('Already Registered', 'Your starship is already registered for this coordinate.', '🛡️');
    }
    setSelectedEvent(null);
  };

  const startQuiz = () => {
    playSound('warp', state.soundEnabled);
    setQuizActive(true);
    setQuizFinished(false);
    setCurrentQuizQuestion(0);
    setQuizAnswers([]);
  };

  const handleQuizAnswer = (optionIndex: number) => {
    playSound('click', state.soundEnabled);
    const newAnswers = [...quizAnswers, optionIndex];
    setQuizAnswers(newAnswers);

    if (currentQuizQuestion < quizQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      // Calculate score
      let score = 0;
      newAnswers.forEach((ans, idx) => {
        if (ans === quizQuestions[idx].correct) score++;
      });

      setQuizFinished(true);
      updateState({ quizCompleted: true, quizScore: score });
      
      if (score === quizQuestions.length) {
        playSound('success', state.soundEnabled);
        addCoins(200);
        addXp(250);
        completeMission('quiz-mission');
        triggerToast('Perfect Score!', 'You got 3/3 on the Quiz Nexus! +200 coins', '🧠');
      } else {
        playSound('laser', state.soundEnabled);
        addCoins(score * 30);
        addXp(score * 50);
        triggerToast('Quiz Completed', `You scored ${score}/3 on the Quiz Nexus. Try again for a perfect score!`, '⭐');
      }
    }
  };

  const filteredEvents = filter === 'all' 
    ? INITIAL_EVENTS 
    : INITIAL_EVENTS.filter(e => e.category === filter);

  return (
    <div className="w-full relative px-6 py-8 md:py-12 select-none animate-[fadeIn_0.5s_ease-out] overflow-hidden">
      {/* Background layer */}
      <CosmicEventsBackground />

      <div className="max-w-7xl mx-auto flex flex-col gap-10 relative z-10">
        
        {/* Elegant Header */}
        <div className="text-center mb-6">
          <span className="font-pixel text-xs text-cyan-400 tracking-[0.25em] block mb-2 uppercase animate-pulse">
            ✦ STARDATE LOGS & OPERATIONS ✦
          </span>
          <h2 className="font-pixel text-2xl md:text-3xl text-white tracking-wider">
            COSMIC <span className="text-yellow-400 animate-pulse">EVENTS</span>
          </h2>
          <p className="font-mono text-xs sm:text-sm text-purple-200 mt-4 max-w-2xl mx-auto leading-relaxed font-bold">
            Participate in hackathons, workshops, and coding challenges to earn coins, unlock XP, and upgrade your level.
          </p>
        </div>

        {/* Main Content Layout with Sticky Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Mission Control Panel (with high-fidelity rocket/UFO) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-6">
            <ChooseYourMissionCard state={state} />
          </div>

          {/* Right Column: Events and Filters */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Categories Tab Row */}
            <div className="flex flex-wrap items-center justify-start gap-3 mb-4">
              {[
                { id: 'all', label: 'ALL EVENTS' },
                { id: 'hackathon', label: 'HACKATHONS' },
                { id: 'workshop', label: 'WORKSHOPS' },
                { id: 'competition', label: 'COMPETITIONS' },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleFilterClick(tab.id as any)}
                  className={`font-pixel text-xs px-4 py-2.5 rounded transition-all cursor-pointer relative overflow-hidden ${
                    filter === tab.id
                      ? 'bg-purple-950 text-yellow-400 border border-yellow-500 font-bold shadow-[0_0_10px_rgba(250,204,21,0.25)]'
                      : 'text-purple-300 hover:text-white hover:bg-purple-950/40 border border-purple-950'
                  }`}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Symmetrical Events Grid */}
            <div 
              key={filter} 
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {filteredEvents.map((ev, i) => {
                const isRegistered = state.registeredEvents.includes(ev.id);
                return (
                  <EventCard
                    key={ev.id}
                    event={ev}
                    delay={i * 70}
                    soundEnabled={state.soundEnabled}
                    isRegistered={isRegistered}
                    onClick={() => handleCardClick(ev)}
                  />
                );
              })}
            </div>

          </div>
        </div>

      </div>

      {/* Interactive Detail Modal & Challenge Room */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[110] px-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 25, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 25, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 26 }}
              className="bg-[#0b011d] border-4 border-purple-700 rounded p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto relative shadow-[0_0_45px_rgba(124,58,237,0.5)]"
            >
              {/* Close Button */}
              <button
                onClick={() => { playSound('click', state.soundEnabled); setSelectedEvent(null); }}
                className="absolute top-4 right-4 font-pixel text-xs text-purple-300 hover:text-white px-2.5 py-1.5 bg-[#12052c] border border-purple-800 rounded hover:border-purple-400 cursor-pointer transition-colors"
              >
                [X] CLOSE
              </button>

              {/* Event Content inside Modal */}
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-xs bg-purple-900 border-2 border-purple-600 text-purple-300 px-2.5 py-1 rounded">
                    {selectedEvent.category.toUpperCase()}
                  </span>
                  <span className="font-mono text-xs text-purple-400 font-bold bg-[#12052c] px-2.5 py-0.5 border border-purple-950 rounded">
                    {selectedEvent.date}
                  </span>
                </div>

                <h2 className="font-pixel text-sm md:text-base text-yellow-400 tracking-wider">
                  {selectedEvent.title}
                </h2>

                <p className="font-mono text-xs text-purple-200 leading-relaxed font-bold border-l-4 border-yellow-500 pl-3 py-1">
                  {selectedEvent.description}
                </p>

                {/* Tags list */}
                <div className="flex flex-wrap gap-1.5 my-1">
                  {selectedEvent.tags.map((tg, idx) => (
                    <span key={idx} className="font-mono text-xs text-cyan-400 bg-cyan-950/30 border border-cyan-800/60 px-2 py-0.5 rounded">
                      #{tg}
                    </span>
                  ))}
                </div>

                {/* Reward Block */}
                <div className="bg-[#12052c] border-2 border-purple-900 p-3 rounded flex items-center gap-3">
                  <PixelStarCoin className="w-8 h-8 animate-bounce" />
                  <div>
                    <span className="font-pixel text-xs text-yellow-400 leading-none block font-bold">MISSION REWARD</span>
                    <span className="font-mono text-xs text-white font-bold block mt-1">100 XP / 50 Coins</span>
                  </div>
                </div>

                {/* SPECIAL INTERACTIVE QUIZ FOR QUIZ NEXUS! */}
                {selectedEvent.id === 'quiz-nexus' && (
                  <div className="mt-4 pt-4 border-t border-purple-950/50">
                    <span className="font-pixel text-xs text-cyan-400 block mb-2 tracking-wider font-bold">ACADEMY CO-PILOT APTITUDE TEST</span>
                    
                    {!quizActive ? (
                      <button
                        onClick={startQuiz}
                        className="w-full font-pixel text-xs bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 px-4 border-b-4 border-r-4 border-cyan-800 hover:border-cyan-600 rounded flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-0.5"
                      >
                        <span>START CHALLENGE</span>
                        <span>▶</span>
                      </button>
                    ) : quizFinished ? (
                      <div className="text-center p-4 bg-[#12052c] border-4 border-purple-900 rounded relative overflow-hidden">
                        <span className="text-4xl block animate-bounce">
                          {state.quizScore === 3 ? '🥇' : state.quizScore === 2 ? '🥈' : '🥉'}
                        </span>
                        <span className="font-pixel text-xs text-yellow-400 block mt-2 font-bold">TEST RECONSTRUCTION COMPLETE</span>
                        
                        <div className="my-3 font-mono text-xs text-purple-200 font-bold max-w-xs mx-auto">
                          <div className="flex justify-between py-1 border-b border-purple-950">
                            <span>ANSWERS SUBMITTED:</span>
                            <span className="text-white">3 / 3</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-purple-950">
                            <span>CORRECT PROCESSORS:</span>
                            <span className="text-cyan-400">{state.quizScore} / 3</span>
                          </div>
                          <div className="flex justify-between py-1 text-yellow-400">
                            <span>REWARDS ALLOCATED:</span>
                            <span>+{state.quizScore === 3 ? '250 XP & 200 Coins' : `${state.quizScore * 50} XP`}</span>
                          </div>
                        </div>

                        <button
                          onClick={startQuiz}
                          className="mt-3 font-pixel text-xs bg-purple-950 text-purple-200 hover:text-white hover:bg-purple-800 border-2 border-purple-600 px-4 py-2 rounded flex items-center gap-1 mx-auto cursor-pointer transition-all font-bold"
                        >
                          <RefreshCw size={10} />
                          <span>RETRY TEST TERMINAL</span>
                        </button>
                      </div>
                    ) : (
                      <div className="bg-[#12052c] border border-purple-950 rounded p-4">
                        {/* Quest progress tracker */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-pixel text-xs text-purple-300 font-bold">QUESTION {currentQuizQuestion + 1} OF 3</span>
                          <div className="flex gap-1">
                            {Array.from({ length: 3 }).map((_, qIdx) => (
                              <div 
                                key={qIdx}
                                className={`w-6 h-1.5 rounded-sm ${
                                  qIdx < currentQuizQuestion 
                                    ? 'bg-cyan-400' 
                                    : qIdx === currentQuizQuestion 
                                    ? 'bg-yellow-400 animate-pulse' 
                                    : 'bg-purple-950'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>

                        {/* Question Text */}
                        <p className="font-mono text-xs text-white font-bold leading-relaxed mb-4">
                          {quizQuestions[currentQuizQuestion].q}
                        </p>

                        {/* Options Grid */}
                        <div className="flex flex-col gap-2">
                          {quizQuestions[currentQuizQuestion].options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => handleQuizAnswer(oIdx)}
                              className="w-full text-left font-mono text-xs text-purple-200 bg-purple-950/40 hover:bg-purple-950 hover:text-white border border-purple-900/60 rounded p-2.5 transition-colors cursor-pointer"
                            >
                              [{String.fromCharCode(65 + oIdx)}] {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Register / Sign log button */}
                {selectedEvent.id !== 'quiz-nexus' && (
                  <div className="mt-4 pt-4 border-t border-purple-950/50">
                    <button
                      onClick={() => handleRegister(selectedEvent.id)}
                      className={`w-full font-pixel text-xs font-bold py-3 px-6 border-b-4 border-r-4 rounded flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        state.registeredEvents.includes(selectedEvent.id)
                          ? 'bg-purple-950 border-purple-800 text-purple-400 cursor-default'
                          : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black border-orange-800 hover:border-orange-600 active:translate-y-0.5'
                      }`}
                    >
                      <span>{state.registeredEvents.includes(selectedEvent.id) ? 'ALREADY REGISTERED ✔' : 'REGISTER FOR EVENT ▶'}</span>
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};