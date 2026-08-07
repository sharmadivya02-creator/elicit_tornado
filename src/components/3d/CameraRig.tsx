// src/components/3d/CameraRig.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '@/store/useStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TUNNEL_DEPTH } from './PortfolioCards';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

export function CameraRig() {
  const { camera } = useThree();
  const setScrollProgress = useStore((state) => state.setScrollProgress);
  
  const velocityRef = useRef({ x: 0, y: 0, z: 0 });

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
    
    // Camera stays stable - minimal movement
    const targetZ = 6 - progress * 0.5; // Very slow Z movement
    const targetY = 0 + Math.sin(progress * Math.PI * 0.1) * 0.2;
    const targetX = Math.sin(progress * Math.PI * 2 * 0.05) * 0.1;
    
    const damping = 0.95;
    const springStrength = 0.05;
    
    velocityRef.current.x += (targetX - camera.position.x) * springStrength;
    velocityRef.current.y += (targetY - camera.position.y) * springStrength;
    velocityRef.current.z += (targetZ - camera.position.z) * springStrength;
    
    velocityRef.current.x *= damping;
    velocityRef.current.y *= damping;
    velocityRef.current.z *= damping;
    
    camera.position.x += velocityRef.current.x;
    camera.position.y += velocityRef.current.y;
    camera.position.z += velocityRef.current.z;

    const lookTarget = new THREE.Vector3(0, 0, camera.position.z - 8);
    camera.lookAt(lookTarget);
  });

  return null;
}