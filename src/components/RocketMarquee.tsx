"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "motion/react";

const IMAGES = [
  "/about/event-1.jpg",
  "/about/event-2.jpg",
  "/about/event-3.jpg",
  "/about/event-4.jpg",
  "/about/event-5.jpg",
];

/*
 * Lower number = slower marquee.
 * Around 45–60 usually feels smooth.
 */
const MARQUEE_SPEED = 60;

const ImageCards = () => (
  <>
    {IMAGES.map((src, index) => (
      <div
        key={`${src}-${index}`}
        className="
          relative
          h-36 w-56
          shrink-0
          overflow-hidden
          rounded-lg
          border-4 border-purple-700
          bg-[#0b011d]
          shadow-[0_0_16px_rgba(124,58,237,0.85)]
          sm:h-64 sm:w-[17rem]
        "
      >
        <img
          src={src}
          alt={`ACM event memory ${index + 1}`}
          className="h-full w-full object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-purple-950/10" />
      </div>
    ))}
  </>
);

type MarqueeGroupProps = {
  groupRef?: React.RefObject<HTMLDivElement | null>;
};

const MarqueeGroup = ({ groupRef }: MarqueeGroupProps) => (
  <div
    ref={groupRef}
    className="flex shrink-0 items-center gap-7 pr-5"
  >
    <ImageCards />
  </div>
);

type IntroGroupProps = {
  introRef: React.RefObject<HTMLDivElement | null>;
};

const IntroGroup = ({ introRef }: IntroGroupProps) => (
  <div
    ref={introRef}
    className="flex shrink-0 items-center gap-7 pr-7"
  >
    {/* Rocket leads while the whole row moves right → left */}
    <div className="mr-16 shrink-0 sm:-mr-20">
      <img
        src="/about/Picture2.png"
        alt=""
        aria-hidden="true"
        className="
          h-36 w-auto
          shrink-0
          object-contain
          drop-shadow-[0_0_18px_rgba(34,211,238,0.8)]
          sm:h-56
        "
      />
    </div>

    <ImageCards />
  </div>
);

export const RocketMarquee = () => {
  const introGroupRef = useRef<HTMLDivElement>(null);
  const marqueeGroupRef = useRef<HTMLDivElement>(null);

  const introControls = useAnimationControls();

  const [ready, setReady] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [marqueeGroupWidth, setMarqueeGroupWidth] = useState(0);

  useLayoutEffect(() => {
    const introGroup = introGroupRef.current;
    const marqueeGroup = marqueeGroupRef.current;

    if (!introGroup || !marqueeGroup) return;

    let cancelled = false;

    const runIntro = async () => {
      const introWidth = introGroup.getBoundingClientRect().width;
      const normalGroupWidth = marqueeGroup.getBoundingClientRect().width;
      const viewportWidth = window.innerWidth;

      if (!introWidth || !normalGroupWidth) return;

      setMarqueeGroupWidth(normalGroupWidth);

      /*
       * Start completely outside the right side.
       */
      const startingX = viewportWidth + 80;

      /*
       * The quick zap ends around the middle.
       */
      const zapEndX = viewportWidth * 0.48;

      /*
       * When x reaches -introWidth, the rocket group is fully gone,
       * and the next images-only group is positioned at x = 0.
       */
      const introEndX = -introWidth;

      introControls.set({ x: startingX });

      setReady(true);

      /*
       * Stage 1: quick zap into the screen.
       */
      await introControls.start({
        x: zapEndX,
        transition: {
          duration: 0.85,
          ease: [0.16, 0, 0.3, 1],
        },
      });

      if (cancelled) return;

      /*
       * Stage 2: move at the exact same pixel speed
       * as the permanent marquee.
       */
      const normalDistance = zapEndX - introEndX;
      const normalDuration = normalDistance / MARQUEE_SPEED;

      await introControls.start({
        x: introEndX,
        transition: {
          duration: normalDuration,
          ease: "linear",
        },
      });

      if (!cancelled) {
        setIntroFinished(true);
      }
    };

    const frame = requestAnimationFrame(runIntro);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      introControls.stop();
    };
  }, [introControls]);

  const loopDuration =
    marqueeGroupWidth > 0
      ? marqueeGroupWidth / MARQUEE_SPEED
      : 28;

  return (
    <section className="relative w-full overflow-hidden py-8">
  {/* Left fade */}
  <div
    className="
      pointer-events-none
      absolute
      inset-y-0
      left-0
      z-20
      w-80
      bg-gradient-to-r
      from-[#000000]
      via-[#080014]/80
      to-transparent
    "
  />

  {/* Right fade */}
  <div
    className="
      pointer-events-none
      absolute
      inset-y-0
      right-0
      z-20
      w-80
      bg-gradient-to-l
      from-[#000000]
      via-[#080014]/80
      to-transparent
    "
  />

  {/* Marquee goes here */}

    <section className="relative h-[12rem] w-full overflow-hidden py-8 sm:h-[20rem]">
      {/* Intro track: rocket group followed immediately by normal groups */}
      {!introFinished && (
        <motion.div
          animate={introControls}
          className={`
            absolute left-0 top-4
            flex w-max items-center
            will-change-transform
            sm:top-0
            ${ready ? "visible" : "invisible"}
          `}
        >
          <IntroGroup introRef={introGroupRef} />

          {/*
           * These groups trail directly behind the intro group.
           * One is measured so the permanent loop can use the same speed.
           */}
          <MarqueeGroup groupRef={marqueeGroupRef} />
          <MarqueeGroup />
        </motion.div>
      )}

      {/* Permanent image-only loop */}
      {introFinished && marqueeGroupWidth > 0 && (
        <motion.div
          className="
            absolute left-0 top-4
            flex w-max
            will-change-transform
            sm:top-0
          "
          initial={{ x: 0 }}
          animate={{ x: -marqueeGroupWidth }}
          transition={{
            duration: loopDuration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <MarqueeGroup />
          <MarqueeGroup />
        </motion.div>
      )}
    </section>
    </section>
  );
};