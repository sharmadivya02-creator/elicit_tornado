"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ExplorerState } from '../types';
import { playSound } from '../utils/sound';
import { PixelAsteroid, PixelAsteroidAlt, PixelRocket, PixelStarCoin } from './PixelArtwork';
import { Shield, Trophy, Play, RotateCcw, AlertTriangle, Crosshair } from 'lucide-react';

interface FlightSimulatorProps {
  state: ExplorerState;
  addCoins: (amount: number) => void;
  addXp: (amount: number) => void;
  triggerToast: (title: string, desc: string, icon?: string) => void;
}

interface Asteroid {
  id: number;
  x: number; // percentage (0 - 100)
  y: number; // pixels from top (0 - 320)
  speed: number;
  alt: boolean;
  size: number; // scale multiplier
}

interface Laser {
  id: number;
  x: number; // percentage
  y: number; // pixels from top
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number; // 0 to 1
}

export const FlightSimulator: React.FC<FlightSimulatorProps> = ({
  state,
  addCoins,
  addXp,
  triggerToast,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [shield, setShield] = useState(100);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return Number(localStorage.getItem('elicit26_simulator_highscore')) || 0;
  });

  const [shipX, setShipX] = useState(50); // percentage (0 - 100)
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [lasers, setLasers] = useState<Laser[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Track coins/xp earned in the CURRENT run to prevent infinite farming exploit
  const [coinsEarnedThisRun, setCoinsEarnedThisRun] = useState(0);
  const maxCoinsPerRun = 50;

  const containerRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(Date.now());
  const lastShootRef = useRef<number>(Date.now());
  const nextIdRef = useRef<number>(1);

  // Sound helper wrapper
  const triggerSound = (type: any) => {
    playSound(type, state.soundEnabled);
  };

  // Start the flight simulator
  const startGame = () => {
    triggerSound('warp');
    setScore(0);
    setShield(100);
    setShipX(50);
    setAsteroids([]);
    setLasers([]);
    setParticles([]);
    setCoinsEarnedThisRun(0);
    setIsGameOver(false);
    setIsPlaying(true);
    lastSpawnRef.current = Date.now();
    lastShootRef.current = Date.now();
  };

  // Stop/reset game loop on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  // Handle ship movement using mouse position within the container bounds
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlaying || isGameOver || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (mouseX / rect.width) * 100));
    setShipX(percentage);
  };

  // Tap buttons for mobile friendliness
  const moveLeft = () => {
    setShipX((prev) => Math.max(5, prev - 10));
    triggerSound('hover');
  };

  const moveRight = () => {
    setShipX((prev) => Math.min(95, prev + 10));
    triggerSound('hover');
  };

  // Game tick logic loop
  useEffect(() => {
    if (!isPlaying || isGameOver) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const gameTick = () => {
      const now = Date.now();

      // 1. Spawning Asteroids
      // Spawns faster as the score increases
      const spawnInterval = Math.max(600, 1600 - score * 5);
      if (now - lastSpawnRef.current > spawnInterval) {
        const newAsteroid: Asteroid = {
          id: nextIdRef.current++,
          x: Math.random() * 90 + 5,
          y: -20,
          speed: Math.random() * 1.5 + 1.2 + (score / 300),
          alt: Math.random() > 0.5,
          size: Math.random() * 0.4 + 0.8,
        };
        setAsteroids((prev) => [...prev, newAsteroid]);
        lastSpawnRef.current = now;
      }

      // 2. Auto-firing Lasers
      const shootInterval = 320;
      if (now - lastShootRef.current > shootInterval) {
        const newLaser: Laser = {
          id: nextIdRef.current++,
          x: shipX,
          y: 270, // spawned near ship position
        };
        setLasers((prev) => [...prev, newLaser]);
        triggerSound('laser');
        lastShootRef.current = now;
      }

      // Update positions & collisions
      setLasers((prevLasers) => {
        // Move lasers upwards
        return prevLasers
          .map((l) => ({ ...l, y: l.y - 6 }))
          .filter((l) => l.y > 0);
      });

      setAsteroids((prevAsteroids) => {
        let shieldHit = false;
        const remainingAsteroids = prevAsteroids
          .map((ast) => ({ ...ast, y: ast.y + ast.speed }))
          .filter((ast) => {
            // Check if asteroid hits bottom (the ship shield range)
            if (ast.y >= 285) {
              // If it's close horizontally to the ship, it's a collision
              const distance = Math.abs(ast.x - shipX);
              if (distance < 12) {
                shieldHit = true;
                // Create explosion particles at bottom shield
                spawnParticles(ast.x, 280, '#ef4444', 8);
                return false; // remove asteroid
              }
              // Hits planet horizon shield
              if (ast.y >= 310) {
                shieldHit = true;
                spawnParticles(ast.x, 305, '#3b82f6', 4);
                return false;
              }
            }
            return true;
          });

        if (shieldHit) {
          triggerSound('click');
          setShield((prev) => {
            const nextShield = Math.max(0, prev - 20);
            if (nextShield <= 0) {
              setIsGameOver(true);
            }
            return nextShield;
          });
        }

        return remainingAsteroids;
      });

      // Update particles
      setParticles((prevParticles) => {
        return prevParticles
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.05,
          }))
          .filter((p) => p.life > 0);
      });

      // Check laser vs asteroid collisions — done in a single pass to avoid nested setState
      const collidedAsteroidIds = new Set<number>();
      const collidedLaserIds = new Set<number>();

      setAsteroids((currentAsteroids) => {
        setLasers((currentLasers) => {
          let scoreGain = 0;
          currentAsteroids.forEach((ast) => {
            if (collidedAsteroidIds.has(ast.id)) return;
            const hit = currentLasers.find(
              (las) =>
                !collidedLaserIds.has(las.id) &&
                Math.abs(ast.x - las.x) < 7 &&
                Math.abs(ast.y - las.y) < 15
            );
            if (hit) {
              collidedLaserIds.add(hit.id);
              collidedAsteroidIds.add(ast.id);
              scoreGain += 10;
              triggerSound('explosion');
              spawnParticles(ast.x, ast.y, ast.alt ? '#a78bfa' : '#38bdf8', 12);
            }
          });

          if (scoreGain > 0) {
            setScore((prev) => prev + scoreGain);
            setCoinsEarnedThisRun((prev) => {
              const canEarn = Math.min(scoreGain / 10, maxCoinsPerRun - prev);
              if (canEarn > 0) {
                addCoins(canEarn);
                addXp(canEarn * 2);
                return prev + canEarn;
              }
              return prev;
            });
          }

          return currentLasers.filter((las) => !collidedLaserIds.has(las.id));
        });

        return currentAsteroids.filter((ast) => !collidedAsteroidIds.has(ast.id));
      });

      gameLoopRef.current = requestAnimationFrame(gameTick);
    };

    gameLoopRef.current = requestAnimationFrame(gameTick);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPlaying, isGameOver, shipX]);

  // Handle high score updates
  useEffect(() => {
    if (isGameOver) {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('elicit26_simulator_highscore', String(score));
        triggerSound('levelup');
        triggerToast('NEW HIGHSCORE!', `You set a new flight record of ${score} pts!`, '🏆');
      } else {
        triggerSound('click');
      }
    }
  }, [isGameOver]);

  // Helper to spawn pixel debris particles
  const spawnParticles = (x: number, y: number, color: string, count: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      newParticles.push({
        id: nextIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        life: 1.0,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };

  return (
    <div className="w-full bg-[#0b011d]/90 border-4 border-purple-800 rounded-lg p-4 shadow-[0_0_20px_rgba(124,58,237,0.3)] relative overflow-hidden select-none">
      
      {/* Title Header with blinking insert coin */}
      <div className="flex items-center justify-between border-b border-purple-950 pb-2 mb-3">
        <h3 className="font-pixel text-[10px] text-cyan-400 tracking-wider flex items-center gap-1.5 font-bold">
          <Crosshair size={12} className="animate-pulse" />
          <span>SQUADRON FLIGHT TRAINER v1.2</span>
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[8px] text-yellow-500 animate-pulse">
            {isPlaying ? '● SIMULATION RUNNING' : '🕹️ INSERT COIN'}
          </span>
        </div>
      </div>

      {/* Arcade Screen Container */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="w-full h-[320px] bg-black/90 border-4 border-purple-950 rounded relative overflow-hidden cursor-crosshair flex flex-col justify-between p-3"
      >
        {/* Soft scanlines overlay for retro cathode ray tube look */}
        <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-10 z-20" />

        {/* Dynamic game HUD if playing */}
        {isPlaying && !isGameOver && (
          <div className="flex items-center justify-between w-full relative z-10 font-mono text-[10px] font-bold text-purple-200">
            {/* Score */}
            <div className="bg-[#0b011d]/85 px-2 py-1 border border-purple-900 rounded flex items-center gap-1.5">
              <span>SCORE:</span>
              <span className="text-yellow-400">{score}</span>
            </div>

            {/* Coins Earned Limit Indicator */}
            <div className="bg-[#0b011d]/85 px-2 py-1 border border-purple-900 rounded flex items-center gap-1">
              <span>COINS:</span>
              <span className="text-yellow-400 flex items-center gap-0.5">
                {coinsEarnedThisRun}/{maxCoinsPerRun}
                <PixelStarCoin className="w-3.5 h-3.5 animate-none inline" />
              </span>
            </div>

            {/* Shield health bar */}
            <div className="bg-[#0b011d]/85 px-2.5 py-1 border border-purple-900 rounded flex items-center gap-2">
              <Shield size={10} className="text-red-400" />
              <div className="w-16 h-2 bg-purple-950 border border-purple-900 rounded overflow-hidden">
                <div 
                  className={`h-full transition-all duration-100 ${
                    shield > 40 ? 'bg-cyan-400' : 'bg-red-500 animate-pulse'
                  }`}
                  style={{ width: `${shield}%` }}
                />
              </div>
              <span className={shield <= 40 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}>
                {shield}%
              </span>
            </div>
          </div>
        )}

        {/* 1. START STATE OVERLAY */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-[#070114]/90 flex flex-col items-center justify-center text-center p-6 z-10 animate-[fadeIn_0.2s_ease-out]">
            <h4 className="font-pixel text-yellow-400 text-sm tracking-widest mb-2 uppercase">
              🛸 ASTEROID DESTRUCTION DRILL
            </h4>
            <p className="font-mono text-xs text-purple-300 max-w-[340px] leading-relaxed mb-5 font-bold">
              Command your starfighter! Hover or move your cursor horizontally to steer. Your blasters will auto-fire. Blast incoming asteroids for coins & XP!
            </p>

            {/* Instructions list */}
            <div className="grid grid-cols-2 gap-3 text-left font-mono text-[10px] font-bold text-purple-400 mb-6 bg-purple-950/25 border border-purple-900/60 p-3 rounded max-w-[340px]">
              <div>🖱️ Mouse: Move left/right</div>
              <div>💥 Auto-Fire: Blast meteors</div>
              <div>🪙 Star Coins: +1 per blast</div>
              <div>🏆 Highscore: Saved locally</div>
            </div>

            {/* Start Button */}
            <button
              onClick={startGame}
              className="font-pixel text-[10px] bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold px-6 py-3 border-b-4 border-r-4 border-yellow-700 active:translate-y-0.5 rounded flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Play size={12} fill="currentColor" />
              <span>START DRILL SEQUENCE</span>
            </button>

            {highScore > 0 && (
              <div className="mt-4 font-pixel text-[8px] text-purple-500 tracking-wider flex items-center gap-1.5 uppercase font-bold">
                <Trophy size={10} className="text-yellow-600" />
                <span>FLIGHT PATH HIGHSCORE: {highScore} PTS</span>
              </div>
            )}
          </div>
        )}

        {/* 2. GAME OVER OVERLAY */}
        {isGameOver && (
          <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center text-center p-6 z-10 animate-[scaleUp_0.2s_steps(4)]">
            <AlertTriangle className="text-red-400 animate-bounce mb-2" size={32} />
            <h4 className="font-pixel text-red-500 text-sm tracking-widest mb-1 font-bold uppercase">
              SHIELD COLLAPSE
            </h4>
            <span className="font-pixel text-[8px] text-red-400 tracking-wider block mb-4 uppercase">
              SIMULATOR TERMINATED
            </span>

            <div className="bg-[#0b011d] border-2 border-red-900 p-4 rounded mb-5 max-w-[260px] w-full font-mono text-xs font-bold text-purple-300">
              <div className="flex justify-between mb-2">
                <span>FINAL SCORE:</span>
                <span className="text-yellow-400">{score} PTS</span>
              </div>
              <div className="flex justify-between">
                <span>COINS AMASSED:</span>
                <span className="text-yellow-400 flex items-center gap-1">
                  +{coinsEarnedThisRun} 🪙
                </span>
              </div>
            </div>

            <button
              onClick={startGame}
              className="font-pixel text-[10px] bg-red-500 hover:bg-red-400 text-white font-extrabold px-6 py-3 border-b-4 border-r-4 border-red-800 active:translate-y-0.5 rounded flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw size={12} />
              <span>RE-LAUNCH DRILL</span>
            </button>
          </div>
        )}

        {/* 3. ACTIVE GAME OBJECTS */}
        {isPlaying && !isGameOver && (
          <>
            {/* Lasers rendering */}
            {lasers.map((las) => (
              <div
                key={las.id}
                className="absolute w-1 h-3 bg-cyan-400 shadow-[0_0_6px_#22d3ee] rounded-full animate-pulse"
                style={{
                  left: `${las.x}%`,
                  top: `${las.y}px`,
                  transform: 'translateX(-50%)',
                }}
              />
            ))}

            {/* Asteroids rendering */}
            {asteroids.map((ast) => (
              <div
                key={ast.id}
                className="absolute"
                style={{
                  left: `${ast.x}%`,
                  top: `${ast.y}px`,
                  transform: `translate(-50%, -50%) scale(${ast.size})`,
                  width: '28px',
                  height: '28px',
                }}
              >
                {ast.alt ? <PixelAsteroidAlt /> : <PixelAsteroid />}
              </div>
            ))}

            {/* Particles explosion debris rendering */}
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute w-1.5 h-1.5 rounded-sm"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}px`,
                  backgroundColor: p.color,
                  opacity: p.life,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}

            {/* Player's Starfighter Spacecraft */}
            <div
              className="absolute transition-all duration-75"
              style={{
                left: `${shipX}%`,
                top: '270px',
                width: '42px',
                height: '42px',
                transform: 'translateX(-50%)',
              }}
            >
              <PixelRocket isLaunching={true} />
            </div>

            {/* Mobile Touch Controller Rails */}
            <div className="absolute bottom-1 inset-x-2 md:hidden flex justify-between z-30 pointer-events-none">
              <button
                onClick={moveLeft}
                className="pointer-events-auto bg-purple-950/80 border border-purple-700 text-cyan-400 font-bold p-3 rounded active:scale-95 text-xs font-mono"
              >
                ◀ LEFT
              </button>
              <button
                onClick={moveRight}
                className="pointer-events-auto bg-purple-950/80 border border-purple-700 text-cyan-400 font-bold p-3 rounded active:scale-95 text-xs font-mono"
              >
                RIGHT ▶
              </button>
            </div>
          </>
        )}
      </div>

      {/* Info Status footer of the console */}
      <div className="font-mono text-[8px] sm:text-[9px] text-cyan-500/80 font-bold mt-2.5 flex items-center gap-1 border-t border-purple-950 pt-2 relative z-10 select-none uppercase">
        <span className="animate-pulse">●</span>
        <span>TELEMETRY: CORE THERMALS NOMINAL • BLOCKED COLLISION SECTORS AUTOMATICALLY DEFEATED</span>
      </div>

    </div>
  );
};
