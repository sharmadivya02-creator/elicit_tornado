'use client';

import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 8),
        new THREE.Vector3(3, 1, 0),
        new THREE.Vector3(-3, -1, -15),
        new THREE.Vector3(0, 0, -30),
      ]),
    []
  );

  useFrame(() => {
    const scrollProgress = useStore.getState().scrollProgress;
    const point = curve.getPoint(scrollProgress);
    const lookAtPoint = curve.getPoint(Math.min(scrollProgress + 0.05, 1.0));
    camera.position.lerp(point, 0.08);
    camera.lookAt(lookAtPoint);
  });

  return null;
}