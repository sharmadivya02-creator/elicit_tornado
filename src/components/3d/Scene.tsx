'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, Preload } from '@react-three/drei';
import { Suspense } from 'react';
import PortfolioCards, { CARD_COUNT } from './PortfolioCards';
import { CameraRig } from './CameraRig';
import PostProcessing from './PostProcessing';

export default function Scene() {
  return (
    <div
      id="scroll-container"
      className="w-full relative bg-black"
      // Force the scroll height to allow the Lenis timeline to breathe
      style={{ height: `${Math.max(CARD_COUNT * 100, 400)}vh` }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <Canvas
          // Initial camera position is instantly overridden by CameraRig
          camera={{ position: [0, 0, 8], fov: 45 }}
          dpr={[1, 2]} // Performance: limits pixel ratio on high-res displays
          gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
        >
          <color attach="background" args={['#000000']} />
          
          <Suspense fallback={null}>
            <Environment preset="city" background={false} environmentIntensity={0.2} />
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} color="#8A2BE2" />
            <directionalLight position={[-5, -5, -5]} intensity={1} color="#00FFFF" />

            {/* The newly created modules */}
            <CameraRig />
            <PortfolioCards />
            <PostProcessing />

            <Preload all />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}