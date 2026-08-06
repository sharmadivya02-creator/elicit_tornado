// src/components/3d/Scene.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, Preload } from '@react-three/drei';
import { Suspense } from 'react';
import Portal from './Portal';
import PortfolioCards, { CARD_COUNT, DEPTH_SPACING } from './PortfolioCards';
import { CameraRig } from './CameraRig';
import PostProcessing from './PostProcessing';
import Overlay from '../dom/Overlay';

export default function Scene() {
  // Much taller scroll height for continuous scrolling
  const scrollHeight = Math.max(CARD_COUNT * 120, 5000);
  
  return (
    <div
      id="scroll-container"
      className="w-full relative bg-black"
      style={{ height: `${scrollHeight}vh` }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
        >
          <color attach="background" args={['#000000']} />

          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} color="#8A2BE2" />
            <directionalLight position={[-5, -5, -5]} intensity={1} color="#00FFFF" />
            <pointLight position={[0, 0, 5]} intensity={0.5} color="#a855f7" />

            <CameraRig />
            <Portal />
            <PortfolioCards />
            <PostProcessing />

            <Preload all />
          </Suspense>
        </Canvas>

        <Overlay />
      </div>
    </div>
  );
}