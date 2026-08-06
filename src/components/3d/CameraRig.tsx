// src/components/3d/CameraRig.tsx
'use client';

import { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '@/store/useStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TUNNEL_DEPTH } from './PortfolioCards';

gsap.registerPlugin(ScrollTrigger);

export function CameraRig() {
  const { camera } = useThree();
  const setScrollProgress = useStore((state) => state.setScrollProgress);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: '#scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    return () => {
      st.kill();
    };
  }, [setScrollProgress]);

  useFrame(() => {
    const progress = useStore.getState().scrollProgress;
    
    // Camera moves through the tunnel
    const targetZ = 10 - progress * TUNNEL_DEPTH * 0.8;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    
    // Subtle camera sway
    const swayX = Math.sin(progress * Math.PI * 2 * 0.3) * 0.2;
    const swayY = Math.cos(progress * Math.PI * 2 * 0.2) * 0.1;
    
    camera.position.x += (swayX - camera.position.x) * 0.03;
    camera.position.y += (swayY - camera.position.y) * 0.03;

    camera.lookAt(0, 0, camera.position.z - 15);
  });

  return null;
}