'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, Preload } from '@react-three/drei';
import { Suspense } from 'react';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import Portal from '@/components/3d/Portal';
import PortfolioCards from '@/components/3d/PortfolioCards';

export default function Page() {
  return (
    <main className="w-full h-screen bg-black overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
      >
        {/* Base Void Background */}
        <color attach="background" args={['#000000']} />
        
        <Suspense fallback={null}>
          {/* Environment & Lighting */}
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} color="#8A2BE2" />
          <directionalLight position={[-5, -5, -5]} intensity={1} color="#00FFFF" />

          {/* Active 3D Components */}
          <Portal />
          <PortfolioCards />

          {/* Post-Processing Pipeline */}
          <EffectComposer multisampling={0}>
            <Bloom 
              luminanceThreshold={1.2}
              mipmapBlur 
              intensity={2.0} 
              levels={8}
            />
            <Noise opacity={0.04} />
          </EffectComposer>

          <Preload all />
        </Suspense>
      </Canvas>
    </main>
  );
}