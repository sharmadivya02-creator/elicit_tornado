'use client';

import { ReactNode, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { useStore } from '@/store/useStore';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const setScrollProgress = useStore((state) => state.setScrollProgress);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expoOut easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Sync Lenis scroll progress (0 to 1) with our Zustand store for WebGL shaders
    lenis.on('scroll', (e: any) => {
      setScrollProgress(e.progress);
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, [setScrollProgress]);

  return <>{children}</>;
}