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
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const st = ScrollTrigger.create({
      trigger: '#scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    return () => {
      clearTimeout(timer);
      st.kill();
    };
  }, [setScrollProgress]);

  useFrame(() => {
    const progress = useStore.getState().scrollProgress;

    const targetZ = 8 - progress * TUNNEL_DEPTH;
    camera.position.z += (targetZ - camera.position.z) * 0.12;
    camera.position.x += (0 - camera.position.x) * 0.12;
    camera.position.y += (0 - camera.position.y) * 0.12;

    camera.lookAt(0, 0, camera.position.z - 10);
  });

  return null;
}