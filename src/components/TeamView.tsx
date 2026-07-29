"use client";

import React from 'react';
import { ExplorerState } from '../types';
import { playSound } from '../utils/sound';
import { motion } from 'motion/react';
import { CLUB_MEMBERS, EXECUTIVE_MEMBERS, TEAM_ORBIT_LABELS } from '../teamData';

const GithubIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface TeamProps {
  state: ExplorerState;
  addXp?: (amount: number) => void;
  completeMission?: (id: string) => void;
}

export const TeamView: React.FC<TeamProps> = ({ state, addXp, completeMission }) => {
  const [introStage, setIntroStage] = React.useState<'fast' | 'stabilizing' | 'ready'>('fast');
  const [loaderVisible, setLoaderVisible] = React.useState(true);
  const introReady = introStage === 'ready';
  const orbitDuration = introStage === 'fast' ? '0.6s' : introStage === 'stabilizing' ? '3.2s' : '28s';
  const reverseOrbitDuration = introStage === 'fast' ? '0.6s' : introStage === 'stabilizing' ? '3.2s' : '28s';
  const innerOrbitDuration = introStage === 'fast' ? '0.48s' : introStage === 'stabilizing' ? '2.4s' : '22s';

  React.useEffect(() => {
    if (completeMission) {
      completeMission('base-mission');
    }
    if (addXp) {
      addXp(10);
    }
  }, []);

  React.useEffect(() => {
    const stabilizeTimer = window.setTimeout(() => setIntroStage('stabilizing'), 1350);
    const readyTimer = window.setTimeout(() => setIntroStage('ready'), 3400);
    const hideLoaderTimer = window.setTimeout(() => setLoaderVisible(false), 4300);
    return () => {
      window.clearTimeout(stabilizeTimer);
      window.clearTimeout(readyTimer);
      window.clearTimeout(hideLoaderTimer);
    };
  }, []);

  const stars = React.useMemo(
    () =>
      Array.from({ length: 54 }, (_, index) => ({
        id: index,
        left: `${(index * 37) % 100}%`,
        top: `${(index * 53) % 100}%`,
        size: `${(index % 3) + 1}px`,
        delay: `${(index % 9) * 0.35}s`,
        opacity: 0.18 + (index % 5) * 0.11,
      })),
    []
  );

  const handleSocialClick = (url: string) => {
    playSound('warp', state.soundEnabled);
    window.open(url, '_blank');
  };

  return (
    <div className="w-full relative px-4 sm:px-6 py-8 md:py-12 select-none animate-[fadeIn_0.5s_ease-out]">
      <style>
        {`
          @keyframes team-orbit {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes team-orbit-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          @keyframes team-scan {
            0% { transform: translateY(-110%); opacity: 0; }
            18% { opacity: 0.9; }
            100% { transform: translateY(110%); opacity: 0; }
          }
          @keyframes team-star {
            0%, 100% { transform: scale(0.75); opacity: 0.25; }
            50% { transform: scale(1.35); opacity: 1; }
          }
          @keyframes team-signal {
            0%, 100% { opacity: 0.35; transform: translateX(-12%); }
            50% { opacity: 1; transform: translateX(12%); }
          }
          @keyframes team-card-aura {
            0%, 100% { opacity: 0.25; transform: translate3d(-18%, -12%, 0) rotate(0deg); }
            50% { opacity: 0.75; transform: translate3d(18%, 12%, 0) rotate(7deg); }
          }
          @keyframes team-border-sweep {
            0% { transform: translateX(-120%); opacity: 0; }
            35% { opacity: 1; }
            100% { transform: translateX(120%); opacity: 0; }
          }
          @keyframes team-corner-blink {
            0%, 100% { opacity: 0.35; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.05); }
          }
          @keyframes team-dock-flow {
            0% { transform: translateY(-18px) scaleY(0.72); opacity: 0.15; }
            45% { opacity: 0.95; }
            100% { transform: translateY(18px) scaleY(1); opacity: 0.15; }
          }
          @keyframes team-dock-core {
            0%, 100% { transform: scaleX(0.36); opacity: 0.35; }
            50% { transform: scaleX(1); opacity: 1; }
          }
          @keyframes team-loader-bar {
            0% { transform: translateX(-110%); opacity: 0; }
            25% { opacity: 1; }
            100% { transform: translateX(110%); opacity: 0; }
          }
          @keyframes team-loader-ring {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes team-loader-dot {
            0%, 18%, 100% { opacity: 0.2; transform: translateY(0); }
            45% { opacity: 1; transform: translateY(-2px); }
          }
          @keyframes team-loader-square {
            0%, 100% { opacity: 0.22; transform: scale(0.72); }
            38%, 70% { opacity: 1; transform: scale(1); }
          }
          @media (prefers-reduced-motion: reduce) {
            .team-motion { animation: none !important; transition: none !important; }
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-10">
        <section className="relative min-h-[520px] overflow-hidden border-y border-purple-800/50 bg-[#03000b]/70 shadow-[0_0_45px_rgba(124,58,237,0.18)]">
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: 'linear-gradient(to right, rgba(34,211,238,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(168,85,247,0.10) 1px, transparent 1px)',
            backgroundSize: '46px 46px',
          }} />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cyan-400/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-purple-950/60 to-transparent" />

          {stars.map((star) => (
            <span
              key={star.id}
              className="team-motion absolute rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
              style={{
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
                animation: `team-star ${2.8 + (star.id % 5) * 0.4}s ease-in-out ${star.delay} infinite`,
              }}
            />
          ))}

          <div className="absolute left-1/2 top-1/2 hidden h-[410px] w-[410px] -translate-x-1/2 -translate-y-1/2 md:block">
            <div className="team-motion absolute inset-0 rounded-full border border-cyan-400/20 transition-[filter,opacity] duration-500" style={{ animation: `team-orbit ${orbitDuration} linear infinite`, filter: introReady ? 'none' : 'drop-shadow(0 0 18px rgba(34,211,238,0.45))' }}>
              {TEAM_ORBIT_LABELS.map((label, index) => {
                const angle = (360 / TEAM_ORBIT_LABELS.length) * index;
                return (
                  <div
                    key={label}
                    className="absolute left-1/2 top-1/2"
                    style={{ transform: `rotate(${angle}deg) translateX(205px) rotate(-${angle}deg)` }}
                  >
                    <span className="team-motion block -translate-x-1/2 -translate-y-1/2 border border-cyan-400/40 bg-[#050110]/90 px-3 py-1 font-pixel text-[8px] text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.22)]" style={{ animation: `team-orbit-reverse ${reverseOrbitDuration} linear infinite` }}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="team-motion absolute inset-10 rounded-full border border-yellow-400/20" style={{ animation: `team-orbit-reverse ${innerOrbitDuration} linear infinite` }} />
            <div className="absolute inset-24 rounded-full border border-purple-400/25 shadow-[inset_0_0_35px_rgba(168,85,247,0.18)]" />
          </div>

          {loaderVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: introReady ? 0 : 1, scale: introReady ? 1.08 : 1, filter: introReady ? 'blur(6px)' : 'blur(0px)' }}
              transition={{ duration: introReady ? 0.9 : 0.35, ease: 'easeOut' }}
              className="absolute inset-0 z-20 flex items-center justify-center px-4 text-center"
            >
              <div className="relative w-full max-w-sm overflow-hidden border border-cyan-300/60 bg-[#050110]/90 px-5 py-5 shadow-[0_0_32px_rgba(34,211,238,0.32),inset_0_0_24px_rgba(168,85,247,0.14)]" style={{ clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)' }}>
                <div className="absolute inset-0 opacity-[0.16]" style={{
                  backgroundImage: 'linear-gradient(to right, rgba(34,211,238,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(168,85,247,0.32) 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                }} />
                <div className="team-motion absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-200 to-transparent" style={{ animation: 'team-loader-bar 1.05s ease-in-out infinite' }} />
                <div className="relative mx-auto mb-4 h-16 w-16">
                  <div className="team-motion absolute inset-0 rounded-full border border-cyan-300/40 border-t-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.35)]" style={{ animation: `team-loader-ring ${introStage === 'fast' ? '0.38s' : '1.1s'} linear infinite` }} />
                  <div className="team-motion absolute inset-3 rounded-full border border-yellow-300/40 border-b-yellow-200" style={{ animation: `team-loader-ring ${introStage === 'fast' ? '0.5s' : '1.35s'} linear reverse infinite` }} />
                  <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 bg-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
                </div>
                <span className="relative flex items-center justify-center gap-1 font-pixel text-[10px] tracking-[0.3em] text-cyan-100">
                  <span>CREW DOCK SYNC</span>
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="team-motion inline-block h-1 w-1 bg-cyan-200 shadow-[0_0_8px_rgba(34,211,238,0.9)]"
                      style={{ animation: `team-loader-dot 1.05s ease-in-out ${dot * 0.16}s infinite` }}
                    />
                  ))}
                </span>
                <span className="relative mt-2 block font-mono text-xs font-bold tracking-[0.22em] text-yellow-200">
                  {introStage === 'fast' ? 'SPINNING CREW MATRIX' : 'STABILIZING ORBIT'}
                </span>
                <div className="relative mx-auto mt-4 grid max-w-[180px] grid-cols-10 gap-1">
                  {Array.from({ length: 20 }, (_, index) => (
                    <span
                      key={index}
                      className="team-motion aspect-square border border-cyan-300/30 bg-cyan-300/15"
                      style={{
                        animation: `team-loader-square 1.55s steps(2,end) ${(index % 10) * 0.08 + Math.floor(index / 10) * 0.14}s infinite`,
                        boxShadow: '0 0 8px rgba(34,211,238,0.32)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={false}
            animate={{ opacity: introReady ? 1 : 0, y: introReady ? 0 : 18, scale: introReady ? 1 : 0.98 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="relative z-10 flex min-h-[520px] flex-col items-center justify-center px-5 py-14 text-center"
          >
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-pixel text-[10px] uppercase tracking-[0.32em] text-cyan-300 sm:text-xs"
            >
              MEET THE FLIGHT SQUADRON
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="mt-5 max-w-5xl font-pixel text-3xl font-black leading-[1.15] tracking-wider text-white sm:text-5xl lg:text-6xl"
            >
              ACM TEAM <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-cyan-300 to-pink-400">COMMAND DECK</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-5 max-w-2xl font-mono text-sm font-bold leading-relaxed text-purple-200 sm:text-base"
            >
              The pilots, system architects, creators, and mission controllers powering the ELICIT'26 expedition.
            </motion.p>

            <div className="mt-8 grid w-full max-w-3xl grid-cols-3 gap-2 sm:gap-3">
              {[
                [String(EXECUTIVE_MEMBERS.length).padStart(2, '0'), 'EXEC CREW'],
                [String(CLUB_MEMBERS.length).padStart(2, '0'), 'MEMBERS'],
                ['24/7', 'SIGNAL LOCK'],
              ].map(([value, label], index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.14 + index * 0.08 }}
                  className="relative overflow-hidden border border-purple-700/60 bg-purple-950/20 px-2 py-4 shadow-[inset_0_0_18px_rgba(168,85,247,0.14)]"
                  style={{ clipPath: 'polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)' }}
                >
                  <div className="team-motion absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-cyan-300/0 via-cyan-300/15 to-cyan-300/0" style={{ animation: `team-signal ${2.4 + index * 0.3}s ease-in-out infinite` }} />
                  <span className="block font-pixel text-lg text-yellow-300 sm:text-2xl">{value}</span>
                  <span className="mt-1 block font-mono text-[10px] font-bold tracking-[0.2em] text-cyan-200 sm:text-xs">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <motion.div
          initial={false}
          animate={{ opacity: introReady ? 1 : 0, y: introReady ? 0 : 20 }}
          transition={{ duration: 0.75, delay: 0.2, ease: 'easeOut' }}
          className="relative -my-4 flex min-h-28 items-center justify-center overflow-hidden md:-my-5"
        >
          <div className="absolute inset-x-4 top-1/2 h-px bg-gradient-to-r from-transparent via-purple-400/70 to-transparent" />
          <div className="team-motion absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-cyan-300/0 via-cyan-300 to-cyan-300/0 shadow-[0_0_18px_rgba(34,211,238,0.65)]" style={{ animation: 'team-dock-flow 2.2s ease-in-out infinite' }} />
          <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-cyan-300/50 bg-[#050110]/80 shadow-[0_0_28px_rgba(34,211,238,0.22)]" />
          <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-yellow-300/60 bg-purple-950/20" />
          <div className="team-motion absolute left-1/2 top-1/2 h-[3px] w-40 -translate-x-1/2 -translate-y-1/2 origin-center bg-gradient-to-r from-transparent via-yellow-300 to-transparent shadow-[0_0_18px_rgba(250,204,21,0.7)]" style={{ animation: 'team-dock-core 1.65s ease-in-out infinite' }} />
          <div className="relative z-10 bg-[#050110] px-4 py-2 text-center" style={{ clipPath: 'polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)' }}>
            <span className="font-pixel text-[8px] tracking-[0.28em] text-cyan-200">ENTER COMMAND ROSTER</span>
          </div>
        </motion.div>

        <motion.section
          initial={false}
          animate={{ opacity: introReady ? 1 : 0, y: introReady ? 0 : 24 }}
          transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col justify-between gap-3 border-l-4 border-cyan-400/80 pl-4 sm:flex-row sm:items-end">
            <div>
              <span className="font-pixel text-[9px] tracking-[0.28em] text-cyan-300">SECTION 01</span>
              <h3 className="mt-2 font-pixel text-2xl leading-tight text-white sm:text-3xl">
                EXECUTIVE <span className="text-yellow-300">COMMAND</span>
              </h3>
            </div>
            <p className="max-w-xl font-mono text-sm font-bold leading-relaxed text-purple-200">
              Chairperson, faculty command, and the core leads steering the club mission.
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-4 sm:gap-5">
            {EXECUTIVE_MEMBERS.map((member, index) => (
              <motion.article
                key={member.name}
                initial={{ opacity: 0, y: 36, rotateX: 8 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                whileHover={{ y: -9, scale: 1.035, rotateX: 3, rotateY: index % 2 === 0 ? 3 : -3 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.52, delay: index * 0.07, ease: 'easeOut' }}
                onMouseEnter={() => playSound('hover', state.soundEnabled)}
                className="group relative overflow-hidden border bg-[#060112]/92 p-1.5 shadow-[0_12px_24px_rgba(0,0,0,0.44)] transition-all duration-300 hover:brightness-110"
                style={{
                  borderColor: member.color,
                  boxShadow: `0 0 12px ${member.shadow}, inset 0 0 18px rgba(255,255,255,0.03)`,
                  background: `radial-gradient(circle at 20% 10%, ${member.bg} 0%, rgba(6,1,18,0.95) 46%, rgba(2,0,8,0.98) 100%)`,
                  clipPath: 'polygon(14px 0%, 100% 0%, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0% 100%, 0% 14px)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="team-motion absolute -left-1/3 -top-1/3 h-2/3 w-2/3 rounded-full blur-3xl" style={{ backgroundColor: member.color, animation: 'team-card-aura 5.5s ease-in-out infinite' }} />
                <div className="team-motion absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100" style={{ animation: 'team-border-sweep 1.15s ease-out infinite' }} />
                <div className="team-motion absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-200 to-transparent opacity-0 group-hover:opacity-100" style={{ animation: 'team-border-sweep 1.25s ease-out 0.12s infinite' }} />
                <div className="absolute inset-0 opacity-[0.13]" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                }} />
                <div className="team-motion absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100" style={{ animation: 'team-scan 2.2s linear infinite' }} />
                <span className="team-motion absolute left-2 top-2 h-2 w-2 border-l border-t opacity-60 group-hover:opacity-100" style={{ borderColor: member.color, animation: 'team-corner-blink 1.8s ease-in-out infinite' }} />
                <span className="team-motion absolute bottom-2 right-2 h-2 w-2 border-b border-r opacity-60 group-hover:opacity-100" style={{ borderColor: member.color, animation: 'team-corner-blink 1.8s ease-in-out 0.35s infinite' }} />

                <div className="relative z-10 flex h-full flex-col gap-1.5">
                  <div className="flex items-start justify-end gap-2">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleSocialClick(member.linkedin)}
                        className="grid h-5 w-5 place-items-center border border-purple-700/70 bg-purple-950/30 text-purple-200 transition-colors hover:border-cyan-300 hover:text-cyan-200"
                        title={`${member.name} LinkedIn`}
                      >
                        <LinkedinIcon size={10} />
                      </button>
                      {member.github && (
                        <button
                          onClick={() => handleSocialClick(member.github!)}
                          className="grid h-5 w-5 place-items-center border border-purple-700/70 bg-purple-950/30 text-purple-200 transition-colors hover:border-yellow-300 hover:text-yellow-200"
                          title={`${member.name} GitHub`}
                        >
                          <GithubIcon size={10} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="relative aspect-[0.92] overflow-hidden border bg-black/40" style={{ borderColor: member.color }}>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-full w-full object-cover brightness-90 contrast-110 saturate-[0.82] transition-transform duration-500 group-hover:scale-[1.12] group-hover:saturate-125"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050110] via-transparent to-transparent" />
                    <div className="absolute inset-0 opacity-[0.12]" style={{
                      backgroundImage: 'linear-gradient(rgba(18,5,44,0.55) 50%, transparent 50%)',
                      backgroundSize: '100% 4px',
                    }} />
                    <div className="absolute bottom-1.5 left-1.5 right-1.5">
                      <h3 className="font-pixel text-[8px] leading-snug text-white sm:text-[9px]">{member.name}</h3>
                      <p className="mt-0.5 truncate font-mono text-[9px] font-bold text-purple-200">{member.subTitle}</p>
                    </div>
                  </div>

                  <p className="line-clamp-1 font-mono text-[9px] font-bold leading-relaxed text-purple-200">
                    {member.bio}
                  </p>

                  <div className="mt-auto flex items-center justify-end border-t border-purple-900/60 pt-1">
                    <span className="h-1 w-1 rounded-full" style={{ backgroundColor: member.color, boxShadow: `0 0 10px ${member.color}` }} />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={false}
          animate={{ opacity: introReady ? 1 : 0, y: introReady ? 0 : 24 }}
          transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col justify-between gap-3 border-l-4 border-pink-400/80 pl-4 sm:flex-row sm:items-end">
            <div>
              <span className="font-pixel text-[9px] tracking-[0.28em] text-pink-300">SECTION 02</span>
              <h3 className="mt-2 font-pixel text-2xl leading-tight text-white sm:text-3xl">
                CLUB <span className="text-cyan-300">CREW</span>
              </h3>
            </div>
            <p className="max-w-xl font-mono text-sm font-bold leading-relaxed text-purple-200">
              Wider club members displayed as clean profile cards. Replace these neutral slots with real names and photos when the roster is finalized.
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(145px,1fr))] gap-4 sm:gap-5">
            {CLUB_MEMBERS.map((member, index) => (
              <motion.article
                key={member.name}
                initial={{ opacity: 0, y: 28, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -8, scale: 1.045, rotateZ: index % 2 === 0 ? 0.7 : -0.7 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: index * 0.055, ease: 'easeOut' }}
                onMouseEnter={() => playSound('hover', state.soundEnabled)}
                className="group relative overflow-hidden border bg-[#050110]/95 p-1.5 shadow-[0_12px_24px_rgba(0,0,0,0.42)]"
                style={{
                  borderColor: member.color,
                  boxShadow: `0 0 11px ${member.shadow}, inset 0 0 16px rgba(255,255,255,0.03)`,
                  clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)',
                }}
              >
                <div className="team-motion absolute -right-16 -top-16 h-32 w-32 rounded-full blur-3xl" style={{ backgroundColor: member.color, animation: 'team-card-aura 5.5s ease-in-out infinite' }} />
                <div className="team-motion absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100" style={{ animation: 'team-border-sweep 1.05s ease-out infinite' }} />
                <div className="team-motion absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-pink-200 to-transparent opacity-0 group-hover:opacity-100" style={{ animation: 'team-border-sweep 1.18s ease-out 0.1s infinite' }} />
                <div className="absolute inset-0 opacity-[0.12]" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                }} />
                <div className="team-motion absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100" style={{ animation: 'team-scan 2.5s linear infinite' }} />
                <span className="team-motion absolute left-2 top-2 h-2 w-2 border-l border-t opacity-60 group-hover:opacity-100" style={{ borderColor: member.color, animation: 'team-corner-blink 1.6s ease-in-out infinite' }} />
                <span className="team-motion absolute bottom-2 right-2 h-2 w-2 border-b border-r opacity-60 group-hover:opacity-100" style={{ borderColor: member.color, animation: 'team-corner-blink 1.6s ease-in-out 0.25s infinite' }} />

                <div className="relative z-10 flex flex-col gap-1.5">
                  <div className="relative aspect-[0.68] overflow-hidden border bg-black/40" style={{ borderColor: member.color }}>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-full w-full object-cover brightness-90 contrast-110 saturate-[0.82] transition-transform duration-500 group-hover:scale-[1.12] group-hover:saturate-125"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050110] via-[#050110]/5 to-transparent" />
                  </div>

                  <div className="min-h-[36px]">
                    <h4 className="truncate font-pixel text-[8px] leading-snug text-white sm:text-[9px]">{member.name}</h4>
                    <p className="mt-0.5 truncate font-mono text-[9px] font-bold tracking-[0.08em] text-purple-300">{member.role}</p>
                  </div>

                  <span className="h-[2px] w-full origin-left transition-transform duration-300 group-hover:scale-x-75" style={{ backgroundColor: member.color, boxShadow: `0 0 10px ${member.color}` }} />
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};
