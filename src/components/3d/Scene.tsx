'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, Preload } from '@react-three/drei';
import { Suspense } from 'react';
import Portal from './Portal';
import PortfolioCards from './PortfolioCards';
import { CameraRig } from './CameraRig';
import PostProcessing from './PostProcessing';
import Overlay from '../dom/Overlay';

export default function Scene() {
  return (
    <div id="scroll-container" className="w-full h-[300vh] relative bg-black">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
        >
          <color attach="background" args={['#000000']} />
          
          <Suspense fallback={null}>
            <Environment preset="city" />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} color="#8A2BE2" />
            <directionalLight position={[-5, -5, -5]} intensity={1} color="#00FFFF" />

            {/* Camera Animation Controller */}
            <CameraRig />

            {/* 3D Visual Elements */}
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