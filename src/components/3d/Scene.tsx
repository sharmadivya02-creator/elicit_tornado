// src/components/3d/Scene.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, Preload } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import Portal from './Portal';
import PortfolioCards, { CARD_COUNT, DEPTH_SPACING } from './PortfolioCards';
import { CameraRig } from './CameraRig';
import PostProcessing from './PostProcessing';
import Overlay from '../dom/Overlay';

export default function Scene() {
  const scrollHeight = Math.max(CARD_COUNT * 80, 4000);
  
  return (
    <div
      id="scroll-container"
      className="w-full relative bg-black"
      style={{ height: `${scrollHeight}vh` }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <Canvas
          camera={{ 
            position: [0, 0, 6], // CORRECTED: 5-7 units distance
            fov: 45, // CORRECTED: 45-50 degrees
            near: 0.1,
            far: 100
          }}
          dpr={[1, 1.5]}
          gl={{ 
            antialias: true, 
            powerPreference: 'high-performance', 
            alpha: false,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
            depth: true,
            stencil: false
          }}
        >
          <color attach="background" args={['#000000']} />

          <Suspense fallback={null}>
            <Environment 
              preset="studio" 
              background={false} 
              environmentIntensity={0.5}
            />
            
            {/* Key Light */}
            <directionalLight 
              position={[5, 8, 6]} 
              intensity={2.0} 
              color="#8A2BE2"
            />
            
            {/* Fill Light */}
            <directionalLight 
              position={[-4, 2, -3]} 
              intensity={0.8} 
              color="#00FFFF"
            />
            
            {/* Rim Light */}
            <directionalLight 
              position={[0, 4, -8]} 
              intensity={1.5} 
              color="#FF4DA6"
            />
            
            <ambientLight intensity={0.4} color="#222244" />
            <pointLight position={[0, 0, 5]} intensity={0.3} color="#7c3aed" />

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