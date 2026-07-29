"use client";

import React, { useState, useEffect } from 'react';
import { ActiveTab, ExplorerState, Mission } from './types';
import { INITIAL_MISSIONS } from './data';
import { playSound, startBackgroundMusic, stopBackgroundMusic } from './utils/sound';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { GlobalCosmicBackground } from './components/GlobalCosmicBackground';
import { AboutView } from './components/AboutView';
import { EventsView } from './components/EventsView';
import { GalleryView } from './components/GalleryView';
import { SponsorsView } from './components/SponsorsView';
import { ContactView } from './components/ContactView';
import { ProfileView } from './components/ProfileView';
import { TeamView } from './components/TeamView';
import { DevTeamView } from './components/DevTeamView';
import { PixelAstronaut, PixelTrophy, PixelStarCoin } from './components/PixelArtwork';
import { 
  Trophy, 
  Settings as SettingsIcon, 
  User, 
  Award, 
  Compass, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  ListTodo,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSidebarSub, setActiveSidebarSub] = useState<'missions' | 'leaderboard' | 'rewards' | 'profile' | 'settings' | null>(null);

  // Load state from localStorage or default
  const [state, setState] = useState<ExplorerState>(() => {
    if (typeof window === 'undefined') {
      return {
        level: 1,
        xp: 0,
        coins: 0,
        completedMissions: [],
        unlockedMemories: [],
        registeredEvents: [],
        achievements: [],
        quizCompleted: false,
        quizScore: 0,
        soundEnabled: true,
        bgMusicEnabled: false
      };
    }
    const saved = localStorage.getItem('elicit26_explorer_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse local state', e);
      }
    }
    return {
      level: 1,
      xp: 0,
      coins: 0,
      completedMissions: [],
      unlockedMemories: [],
      registeredEvents: [],
      achievements: [],
      quizCompleted: false,
      quizScore: 0,
      soundEnabled: true,
      bgMusicEnabled: false
    };
  });

  const [explorerName, setExplorerName] = useState(() => {
    if (typeof window === 'undefined') return 'GALAXY EXPLORER';
    return localStorage.getItem('elicit26_explorer_name') || 'GALAXY EXPLORER';
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const updateState = (newState: Partial<ExplorerState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const [toasts, setToasts] = useState<{ id: string; title: string; desc: string; icon?: string }[]>([]);

  // Synchronize state and music
  useEffect(() => {
    localStorage.setItem('elicit26_explorer_state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem('elicit26_explorer_name', explorerName);
  }, [explorerName]);

  useEffect(() => {
    if (state.bgMusicEnabled) {
      startBackgroundMusic(true);
    } else {
      stopBackgroundMusic();
    }
    return () => stopBackgroundMusic();
  }, [state.bgMusicEnabled]);

  const [lastLevel, setLastLevel] = useState(state.level);

  // Monitor Level up transitions safely
  useEffect(() => {
    if (state.level > lastLevel) {
      playSound('levelup', state.soundEnabled);
      triggerToast('LEVEL UP!', `Congratulations Scout! You reached Level ${state.level}!`, '🎉');
      setLastLevel(state.level);
    } else if (state.level < lastLevel) {
      setLastLevel(state.level); // Reset
    }
  }, [state.level, lastLevel, state.soundEnabled]);

  // Achievement unlock evaluation
  useEffect(() => {
    const evaluateAchievements = () => {
      const unlocked = [...state.achievements];
      let changed = false;
      let coinsEarned = 0;
      const newToasts: (() => void)[] = [];

      // Achievement: First Steps
      if (!unlocked.includes('first-steps') && state.completedMissions.length >= 3) {
        unlocked.push('first-steps');
        changed = true;
        coinsEarned += 100;
        newToasts.push(() => triggerToast('ACHIEVEMENT UNLOCKED', 'First Steps: Visited 3 planet systems! +100 Star Coins', '🚀'));
      }

      // Achievement: Star Collector
      if (!unlocked.includes('star-collector') && state.coins >= 1500) {
        unlocked.push('star-collector');
        changed = true;
        coinsEarned += 200;
        newToasts.push(() => triggerToast('ACHIEVEMENT UNLOCKED', 'Star Collector: Amassed 1,500 Star Coins! +200 Star Coins', '⭐'));
      }

      // Achievement: Event Explorer
      if (!unlocked.includes('event-explorer') && state.registeredEvents.includes('cosmic-hack')) {
        unlocked.push('event-explorer');
        changed = true;
        coinsEarned += 150;
        newToasts.push(() => triggerToast('ACHIEVEMENT UNLOCKED', 'Event Explorer: Team registered for Cosmic Hack 2.0! +150 Star Coins', '🏆'));
      }

      // Achievement: Quiz Master
      if (!unlocked.includes('quiz-master') && state.quizCompleted && state.quizScore === 3) {
        unlocked.push('quiz-master');
        changed = true;
        coinsEarned += 150;
        newToasts.push(() => triggerToast('ACHIEVEMENT UNLOCKED', 'Quiz Master: Completed Quiz Nexus with 3/3 score! +150 Star Coins', '🧠'));
      }

      // Achievement: Comms Officer
      if (!unlocked.includes('comms-officer') && state.completedMissions.includes('comms-mission')) {
        unlocked.push('comms-officer');
        changed = true;
        coinsEarned += 100;
        newToasts.push(() => triggerToast('ACHIEVEMENT UNLOCKED', 'Comms Officer: Subspace radio link established! +100 Star Coins', '📡'));
      }

      // Achievement: Galaxy Legend (all 7 missions completed)
      if (!unlocked.includes('master-explorer') && state.completedMissions.length === 7) {
        unlocked.push('master-explorer');
        changed = true;
        coinsEarned += 300;
        newToasts.push(() => triggerToast('ACHIEVEMENT UNLOCKED', 'Galaxy Legend: Completed all 7 Elicit missions! +300 Star Coins', '👑'));
      }

      if (changed) {
        setState(prev => ({ 
          ...prev, 
          achievements: unlocked,
          coins: prev.coins + coinsEarned
        }));

        if (coinsEarned > 0) {
          playSound('coin', state.soundEnabled);
        }

        newToasts.forEach((trigger, idx) => {
          setTimeout(() => {
            trigger();
          }, idx * 150);
        });
      }
    };

    evaluateAchievements();
  }, [state.completedMissions, state.coins, state.registeredEvents, state.quizCompleted, state.achievements]);

  // Toast trigger - Capped at max 3 simultaneous notifications to prevent clutter
  const triggerToast = (title: string, desc: string, icon?: string) => {
    const id = String(Date.now() + Math.random());
    setToasts(prev => {
      const next = [...prev, { id, title, desc, icon }];
      if (next.length > 3) {
        return next.slice(-3); // Keep only the latest 3 notifications active
      }
      return next;
    });
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  // Adding Coin rewards
  const addCoins = (amount: number) => {
    playSound('coin', state.soundEnabled);
    setState(prev => ({ ...prev, coins: prev.coins + amount }));
  };

  // Adding XP rewards and handle dynamic Level Ups
  const addXp = (amount: number) => {
    setState(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let needed = newLevel * 200;

      while (newXp >= needed) {
        newXp -= needed;
        newLevel++;
        needed = newLevel * 200;
      }

      return {
        ...prev,
        level: newLevel,
        xp: newXp
      };
    });
  };

  // Claiming / Completing specific Elicit Missions atomically
  const completeMission = (missionId: string) => {
    if (!state.completedMissions.includes(missionId)) {
      const mission = INITIAL_MISSIONS.find(m => m.id === missionId);
      if (mission) {
        setState(prev => {
          if (prev.completedMissions.includes(missionId)) return prev;

          let newXp = prev.xp + mission.rewardXp;
          let newLevel = prev.level;
          let needed = newLevel * 200;

          while (newXp >= needed) {
            newXp -= needed;
            newLevel++;
            needed = newLevel * 200;
          }

          return {
            ...prev,
            completedMissions: [...prev.completedMissions, missionId],
            coins: prev.coins + mission.rewardCoins,
            level: newLevel,
            xp: newXp
          };
        });

        playSound('coin', state.soundEnabled);
        triggerToast('MISSION ACCOMPLISHED', `${mission.title}: Completed successfully! +${mission.rewardCoins} coins`, '🛰️');
      }
    }
  };

  const toggleSound = () => {
    setState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const toggleMusic = () => {
    setState(prev => {
      const nextMusic = !prev.bgMusicEnabled;
      if (nextMusic) {
        playSound('click', prev.soundEnabled);
      }
      return { ...prev, bgMusicEnabled: nextMusic };
    });
  };

  const handleReset = () => {
    playSound('laser', state.soundEnabled);
    if (typeof window !== 'undefined' && window.confirm('Wipe navigation records? This will delete all completed missions, star coins, and levels.')) {
      localStorage.removeItem('elicit26_explorer_state');
      localStorage.removeItem('elicit26_explorer_name');
      localStorage.removeItem('subspace_transmissions');
      setState({
        level: 1,
        xp: 0,
        coins: 0,
        completedMissions: [],
        unlockedMemories: [],
        registeredEvents: [],
        achievements: [],
        quizCompleted: false,
        quizScore: 0,
        soundEnabled: true,
        bgMusicEnabled: false
      });
      setExplorerName('GALAXY EXPLORER');
      setActiveTab('home');
      setActiveSidebarSub(null);
      setSidebarOpen(false);
      triggerToast('DATABASE WIPED', 'Explorer state reset to initial conditions.', '☣️');
    }
  };

  const toggleSidebarSub = (sub: typeof activeSidebarSub) => {
    playSound('click', state.soundEnabled);
    if (activeSidebarSub === sub) {
      setActiveSidebarSub(null);
    } else {
      setActiveSidebarSub(sub);
      setSidebarOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#070114] text-white flex flex-col relative overflow-x-hidden crt-overlay font-sans pb-4">
      {/* Layered Cosmic Space Background with floating rocks and planets */}
      <GlobalCosmicBackground activeTab={activeTab} />

      {/* Top Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        state={state} 
        toggleSound={toggleSound}
        toggleMusic={toggleMusic}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Core Layout wrapping floating menu and active coordinates stage */}
      <div className="w-full flex-grow flex relative z-10">
        
        {/* Left Drawer Control Panel from second picture */}
        <div className="fixed left-0 top-1/4 z-40 flex flex-col items-start gap-1">
          {/* Main expand toggle button */}
          <button
            onClick={() => { playSound('click', state.soundEnabled); setSidebarOpen(!sidebarOpen); }}
            className="bg-[#12052c] border-2 border-purple-800 text-yellow-400 p-2.5 rounded-r hover:bg-purple-950 transition-colors cursor-pointer shadow-[0_0_10px_rgba(124,58,237,0.3)] flex items-center justify-center"
            title="Toggle Control Drawer"
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>

          {sidebarOpen && (
            <div className="bg-[#0b011d]/95 border-2 border-purple-800 rounded-r-lg p-2 flex flex-col gap-1.5 shadow-[5px_5px_15px_rgba(0,0,0,0.5)] animate-[slideRight_0.2s_steps(4)]">
              {[
                { id: 'missions', label: 'MISSIONS', icon: <ListTodo size={14} /> },
                { id: 'leaderboard', label: 'LEADERBOARD', icon: <Trophy size={14} /> },
                { id: 'rewards', label: 'REWARDS', icon: <Award size={14} /> },
                { id: 'profile', label: 'PROFILE', icon: <User size={14} /> },
                { id: 'settings', label: 'SETTINGS', icon: <SettingsIcon size={14} /> },
              ].map((sub) => {
                const isActive = activeSidebarSub === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      if (sub.id === 'profile') {
                        playSound('click', state.soundEnabled);
                        setIsProfileOpen(true);
                      } else {
                        toggleSidebarSub(sub.id as any);
                      }
                    }}
                    onMouseEnter={() => playSound('hover', state.soundEnabled)}
                    className={`font-pixel text-[8px] flex items-center gap-2 px-3 py-2.5 rounded w-36 text-left transition-colors cursor-pointer ${
                      isActive 
                        ? 'bg-purple-950 text-yellow-400 border border-yellow-500' 
                        : 'text-purple-300 hover:text-white border border-transparent'
                    }`}
                  >
                    {sub.icon}
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Dynamic Sidebar Overlay Box displaying sub-details */}
        {sidebarOpen && activeSidebarSub && (
          <div className="fixed left-44 top-24 bottom-16 z-40 w-80 bg-[#070114]/95 border-4 border-purple-900 rounded p-5 shadow-2xl flex flex-col justify-between overflow-y-auto animate-[fadeIn_0.25s_ease-out]">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-purple-950 pb-2.5 mb-4">
                <h3 className="font-pixel text-[10px] text-yellow-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span>●</span> {activeSidebarSub} PANEL
                </h3>
                <button 
                  onClick={() => { playSound('click', state.soundEnabled); setActiveSidebarSub(null); }}
                  className="font-pixel text-[8px] text-purple-500 hover:text-white"
                >
                  [X]
                </button>
              </div>

              {/* Dynamic Content based on active sidebar tab */}
              {activeSidebarSub === 'missions' && (
                <div className="flex flex-col gap-3">
                  <p className="font-mono text-xs text-purple-400 leading-snug font-bold">
                    Complete tasks to gain Star Coins & unlock higher navigation ranks!
                  </p>
                  <div className="flex flex-col gap-2.5 mt-2">
                    {INITIAL_MISSIONS.map((m) => {
                      const isCompleted = state.completedMissions.includes(m.id);
                      return (
                        <div 
                          key={m.id} 
                          onClick={() => { playSound('click', state.soundEnabled); setActiveTab(m.targetTab); }}
                          className={`border p-2.5 rounded flex flex-col gap-1 cursor-pointer transition-colors ${
                            isCompleted 
                              ? 'border-emerald-800 bg-emerald-950/20 text-emerald-300' 
                              : 'border-purple-900 bg-purple-950/10 hover:border-purple-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-pixel text-[8px] tracking-wide truncate max-w-[150px]">
                              {m.title}
                            </span>
                            <span className="font-mono text-[9px] font-bold">
                              {isCompleted ? '✅ DONE' : '▶ WARP'}
                            </span>
                          </div>
                          <p className="font-mono text-[10px] text-purple-300 leading-normal">
                            {m.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1 font-mono text-[9px] text-yellow-400 font-bold">
                            <span>🪙 +{m.rewardCoins}</span>
                            <span>⭐ +{m.rewardXp} XP</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeSidebarSub === 'leaderboard' && (
                <div className="flex flex-col gap-3">
                  <p className="font-mono text-xs text-purple-400 font-bold">
                    Rankings of the top Elicit Chapter pilots calculated by Starfleet logs.
                  </p>
                  <div className="flex flex-col gap-2 mt-2">
                    {[
                      { rank: 1, name: 'Alpha_Scout_99', lvl: 9, coins: 4500, self: false },
                      { rank: 2, name: 'ACM_Commander', lvl: 7, coins: 3400, self: false },
                      { rank: 3, name: 'NeonWarp_X', lvl: 6, coins: 2100, self: false },
                      { rank: 4, name: `${explorerName} (YOU)`, lvl: state.level, coins: state.coins, self: true },
                      { rank: 5, name: 'QuantumFiler', lvl: 4, coins: 800, self: false },
                    ].map((user, idx) => (
                      <div 
                        key={idx}
                        className={`p-2 border rounded flex items-center justify-between text-xs font-mono font-bold ${
                          user.self 
                            ? 'border-yellow-500 bg-yellow-950/20 text-yellow-400' 
                            : 'border-purple-950 bg-purple-955/20 text-purple-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`font-pixel text-[8px] ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-purple-300' : 'text-purple-500'}`}>
                            #{user.rank}
                          </span>
                          <span className="truncate max-w-[120px]">{user.name}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[10px]">
                          <span className="text-cyan-400">LVL {user.lvl}</span>
                          <span>🪙 {user.coins}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSidebarSub === 'rewards' && (
                <div className="flex flex-col gap-3">
                  <p className="font-mono text-xs text-purple-400 font-bold">
                    Amass Star Coins to unlock planetary title rewards.
                  </p>
                  <div className="flex flex-col gap-3.5 mt-2">
                    {[
                      { req: 100, title: 'NEON SCOUT PERMIT', icon: '🎫', desc: 'Valid across star system' },
                      { req: 500, title: 'WARP ENGINE LICENSE', icon: '🔋', desc: 'Allows hyperspeed orbits' },
                      { req: 1000, title: 'GALAXY PILOT TITLE', icon: '👑', desc: 'Elite high ranking scout' },
                      { req: 1500, title: 'ACM STARFLEET CADET', icon: '🛡️', desc: 'Officially endorsed by chapter' },
                    ].map((rew, rIdx) => {
                      const isUnlocked = state.coins >= rew.req;
                      return (
                        <div 
                          key={rIdx}
                          className={`border p-2.5 rounded flex items-center gap-3 ${
                            isUnlocked 
                              ? 'border-yellow-600 bg-yellow-950/10 text-yellow-400' 
                              : 'border-purple-950 opacity-40'
                          }`}
                        >
                          <span className="text-2xl">{rew.icon}</span>
                          <div>
                            <span className="font-pixel text-[8px] block">{rew.title}</span>
                            <span className="font-mono text-[10px] text-purple-300 block font-bold leading-none mt-1">
                              {rew.desc}
                            </span>
                            <span className="font-mono text-[9px] text-purple-400 block font-semibold leading-none mt-1.5">
                              {isUnlocked ? '🔓 UNLOCKED' : `🔒 REQ: ${rew.req} Coins`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeSidebarSub === 'profile' && (
                <div className="flex flex-col gap-4">
                  <div className="w-16 h-16 mx-auto relative mb-2">
                    <PixelAstronaut pose="standing" className="w-20 h-20 -left-2" />
                  </div>
                  <div>
                    <label className="font-pixel text-[8px] text-purple-400 block mb-1.5">EXPLORER IDENTIFIER</label>
                    <input
                      type="text"
                      value={explorerName}
                      onChange={(e) => {
                        setExplorerName(e.target.value.slice(0, 15).toUpperCase());
                      }}
                      className="w-full font-mono text-xs text-white bg-purple-950/40 border border-purple-800 rounded p-2 focus:border-yellow-400 outline-none uppercase font-bold"
                    />
                  </div>
                  <div className="flex flex-col gap-2 border-t border-purple-950/60 pt-3 text-xs font-mono font-bold text-purple-200">
                    <div className="flex items-center justify-between">
                      <span>CURRENT LEVEL:</span>
                      <span className="text-yellow-400">{state.level}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>COSMIC COINS:</span>
                      <span className="text-yellow-400">{state.coins} 🪙</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>MEMORIES RECONSTRUCTED:</span>
                      <span className="text-yellow-400">{state.unlockedMemories.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>UNLOCKED ACHIEVEMENTS:</span>
                      <span className="text-yellow-400">{state.achievements.length}/6</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSidebarSub === 'settings' && (
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-xs text-purple-400 font-bold leading-normal">
                    Adjust Starfleet terminal and communication array parameters.
                  </p>
                  
                  <div className="flex flex-col gap-3.5 border-t border-purple-950/60 pt-3">
                    <button
                      onClick={toggleSound}
                      className="w-full font-pixel text-[9px] bg-purple-950 hover:bg-purple-900 border border-purple-700 p-2.5 rounded text-left flex items-center justify-between cursor-pointer"
                    >
                      <span>SOUND EFFECTS</span>
                      <span>{state.soundEnabled ? '● ENABLED' : '○ MUTED'}</span>
                    </button>

                    <button
                      onClick={toggleMusic}
                      className="w-full font-pixel text-[9px] bg-purple-950 hover:bg-purple-900 border border-purple-700 p-2.5 rounded text-left flex items-center justify-between cursor-pointer"
                    >
                      <span>CHIPTUNE AMBIENCE</span>
                      <span>{state.bgMusicEnabled ? '● ENABLED' : '○ MUTED'}</span>
                    </button>

                    <button
                      onClick={handleReset}
                      className="w-full font-pixel text-[9px] bg-red-950/40 border border-red-900 text-red-400 hover:bg-red-900 hover:text-white p-2.5 rounded text-left flex items-center gap-2 cursor-pointer"
                    >
                      <RefreshCw size={12} />
                      <span>WIPE SAVED RECORDS</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Claim Reward status banner */}
            <div className="mt-4 pt-3.5 border-t border-purple-950">
              <div className="bg-[#12052c] p-2 rounded text-center text-[10px] font-mono text-purple-300">
                STARFLEET ID: ACM-MUJ-PILOT-{state.level * 100}
              </div>
            </div>
          </div>
        )}

        {/* Core Stage view container */}
        <main className="flex-grow w-full max-w-7xl mx-auto relative z-10">
          {activeTab === 'home' && (
            <HomeView 
              setActiveTab={setActiveTab} 
              state={state} 
              missions={INITIAL_MISSIONS}
              completeMission={completeMission}
              addXp={addXp}
              addCoins={addCoins}
              triggerToast={triggerToast}
            />
          )}

          {activeTab === 'about' && (
            <AboutView 
              state={state} 
              addXp={addXp} 
              completeMission={completeMission} 
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'events' && (
            <EventsView 
              state={state} 
              addCoins={addCoins} 
              addXp={addXp} 
              completeMission={completeMission} 
              triggerToast={triggerToast}
              updateState={updateState}
            />
          )}

          {activeTab === 'gallery' && (
            <GalleryView 
              state={state} 
              addCoins={addCoins} 
              addXp={addXp} 
              completeMission={completeMission} 
              triggerToast={triggerToast}
              updateState={updateState}
            />
          )}

          {activeTab === 'sponsors' && (
            <SponsorsView 
              state={state} 
              completeMission={completeMission} 
            />
          )}

          {activeTab === 'team' && (
            <TeamView 
              state={state} 
              addXp={addXp} 
              completeMission={completeMission} 
            />
          )}

          {activeTab === 'dev-team' && (
            <DevTeamView state={state} />
          )}

          {activeTab === 'contact' && (
            <ContactView 
              state={state} 
              addCoins={addCoins} 
              addXp={addXp} 
              completeMission={completeMission} 
              triggerToast={triggerToast}
            />)}
        </main>

      </div>

      {/* Universal Sticky Footer */}
      <Footer setActiveTab={setActiveTab} state={state} />

      {/* Astronaut Profile View Overlay Modal */}
      {isProfileOpen && (
        <ProfileView
          state={state}
          explorerName={explorerName}
          setExplorerName={setExplorerName}
          updateState={updateState}
          onClose={() => setIsProfileOpen(false)}
          addCoins={addCoins}
          addXp={addXp}
          triggerToast={triggerToast}
        />
      )}

      {/* Toast notifications portal */}
      <div className="fixed bottom-6 right-6 z-[120] flex flex-col gap-3 max-w-sm select-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-[#0b011d] border-4 border-yellow-500 rounded p-4 shadow-[0_0_20px_rgba(250,204,21,0.4)] flex items-start gap-3.5 relative animate-[slideLeft_0.25s_steps(4)]"
            style={{ imageRendering: 'pixelated' as any }}
          >
            {toast.icon && <span className="text-2xl flex-shrink-0">{toast.icon}</span>}
            <div>
              <h4 className="font-pixel text-[9px] text-yellow-400 tracking-wider">
                {toast.title}
              </h4>
              <p className="font-mono text-xs text-purple-200 mt-1 font-bold leading-normal">
                {toast.desc}
              </p>
            </div>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="absolute top-1 right-2 font-mono text-[9px] text-purple-500 hover:text-white"
            >
              x
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
