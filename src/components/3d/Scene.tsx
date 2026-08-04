'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, Preload } from '@react-three/drei';
import { Suspense } from 'react';
import Portal from './Portal';
import PortfolioCards, { CARD_COUNT } from './PortfolioCards';
import { CameraRig } from './CameraRig';
import PostProcessing from './PostProcessing';
import Overlay from '../dom/Overlay';

export default function Scene() {
  return (
    <div
      id="scroll-container"
      className="w-full relative bg-black"
      style={{ height: `${Math.max(CARD_COUNT * 100, 400)}vh` }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
        >
          <color attach="background" args={['#000000']} />

          <Suspense fallback={null}>
            <Environment preset="city" background={false} environmentIntensity={0.2} />
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} color="#8A2BE2" />
            <directionalLight position={[-5, -5, -5]} intensity={1} color="#00FFFF" />

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