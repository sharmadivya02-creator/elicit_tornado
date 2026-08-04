'use client';

import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '@/store/useStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function CameraRig() {
  const setScrollProgress = useStore((state) => state.setScrollProgress);

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const st = ScrollTrigger.create({
      trigger: '#scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5, // Smooth lag effect on scroll
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    return () => {
      clearTimeout(timer);
      st.kill();
    };
  }, [setScrollProgress]);

  useFrame((state) => {
    const progress = useStore.getState().scrollProgress;

    // Travel deep down the Z-axis based on scroll progress (matching your 21 cards)
    const totalTunnelDepth = 21 * 4.5; 
    state.camera.position.z = 8 - progress * totalTunnelDepth;
    
    // Subtle organic camera sway
    state.camera.position.y = Math.sin(progress * Math.PI * 4) * 0.4;
    state.camera.position.x = Math.cos(progress * Math.PI * 2) * 0.3;
    
    // Look ahead of the camera for cinematic depth
    state.camera.lookAt(0, 0, state.camera.position.z - 10);
  });

  return null;
}