"use client";

import React, { useMemo, useRef, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Image } from '@react-three/drei';
import * as THREE from 'three';

// 1. The Particle System Component
const ParticleVortex = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 5000;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 4;
      const theta = Math.random() * 2 * Math.PI;
      const y = (Math.random() - 0.5) * 10; 
      const twist = y * 0.5;
      
      pos[i * 3] = radius * Math.cos(theta + twist);
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = radius * Math.sin(theta + twist);
    }
    return pos;
  }, [particleCount]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#22d3ee" 
        transparent={true}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// 2. The Floating Images Component with verified paths from your public folder
const FloatingImages = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  const images = [
    "/about/DSC_0074.jpg",
    "/about/DSC01089.jpg",
    "/about/DSC01093.jpg",
    "/about/DSC01123.jpg",
    "/about/DSC03579-2.jpg",
    "/about/DSC05277-Enhanced-NR.jpg",
    "/about/DSC05360-Enhanced-NR.jpg",
    "/about/DSC09563.jpg",
    "/about/DSC09810.jpg",
    "/about/DSC09946.jpg",
    "/about/IMG_0013.jpg",
    "/about/IMG_0465.jpg",
    "/about/IMG_0651.jpg",
    "/about/IMG_3281.jpg",
    "/about/IMG_8134.jpg",
    "/about/IMG_8199.jpg",
    "/about/IMG_8215.jpg",
    "/about/untitled-4.jpg",
    "/about/untitled-18 (1).jpg",
    "/about/untitled-23.jpg"
  ];

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.15; 
    }
  });

  return (
    <group ref={groupRef}>
      {images.map((url, i) => {
        const angle = (i / images.length) * Math.PI * 2 * 2;
        const radius = 6.0; 
        
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (i - images.length / 2) * 0.5; 
        
        return (
          <Image 
            key={i}
            url={url}
            position={[x, y, z]}
            rotation={[0, -angle + Math.PI / 2, 0]} 
            scale={[2.2, 1.4]} 
            transparent
            opacity={0.9}
          />
        );
      })}
    </group>
  );
};

// 3. Main Export with SSR Safety Check
export const CosmicTornado3D = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="w-full h-[600px] bg-black/90 rounded-xl flex items-center justify-center text-cyan-400 font-mono text-sm tracking-widest">INITIALIZING NEURAL WEBGL ENGINE...</div>;
  }

  return (
    <div className="w-full h-[600px] relative border border-cyan-500/30 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.15)] bg-black/90">
      <Canvas camera={{ position: [0, 2, 11], fov: 60 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <ParticleVortex />
          <FloatingImages />
          <OrbitControls 
            enableZoom={false} 
            autoRotate={false} 
            maxPolarAngle={Math.PI / 1.5} 
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};