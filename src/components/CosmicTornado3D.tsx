"use client";
import React, { useMemo, useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Image as DreiImage, Text, useProgress } from "@react-three/drei";
import * as THREE from "three";

/* ============================================================
   DATA: MULTI-PROJECT SHOWCASE
   ============================================================ */
const SHOWCASE_ITEMS = [
  { id: 'echo', title: 'ECHO', subtitle: 'COSMIC HACK 2.0', color: '#00e5ff', img: '/about/DSC_0074.jpg' },
  { id: 'mission', title: 'MISSION', subtitle: 'ROBOTICS ARENA', color: '#ff007f', img: '/about/DSC01089.jpg' },
  { id: 'harmonic', title: 'HARMONIC STATE', subtitle: 'AI ODYSSEY', color: '#a855f7', img: '/about/DSC01093.jpg' },
  { id: 'lab', title: 'THE LAB', subtitle: 'DESIGN SPRINT', color: '#facc15', img: '/about/DSC01123.jpg' },
];

/* ============================================================
   3D COMPONENT: COLOR-BLAST SMOKE BURST
   ============================================================ */
const SmokeBurst = ({ triggerIndex }: { triggerIndex: number }) => {
  const count = 2500;
  const meshRef = useRef<THREE.Points>(null);
  const posRef = useRef(new Float32Array(count * 3));
  const velRef = useRef(new Float32Array(count * 3));
  const lifeRef = useRef(new Float32Array(count));

  // Generate the particle geometry and colors once
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(posRef.current, 3));

    const colors = new Float32Array(count * 3);
    const palette = [new THREE.Color('#00e5ff'), new THREE.Color('#ff007f'), new THREE.Color('#a855f7')];
    
    for (let i = 0; i < count; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r; 
      colors[i * 3 + 1] = c.g; 
      colors[i * 3 + 2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return g;
  }, []);

  // Generate a soft, smoky puff texture programmatically
  const smokeTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.6)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Fire the burst whenever the index changes
  useEffect(() => {
    for (let i = 0; i < count; i++) {
      // Start in a tight cluster at the center
      posRef.current[i * 3] = (Math.random() - 0.5) * 0.5;
      posRef.current[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      posRef.current[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      // Spherical explosion velocity
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const speed = Math.random() * 20 + 8;
      velRef.current[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velRef.current[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velRef.current[i * 3 + 2] = Math.cos(phi) * speed;

      lifeRef.current[i] = 1.0; // Reset life
    }
    if (meshRef.current) {
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  }, [triggerIndex]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    let needsUpdate = false;
    const positions = posRef.current;
    const velocities = velRef.current;
    const life = lifeRef.current;

    for (let i = 0; i < count; i++) {
      if (life[i] > 0) {
        life[i] -= delta * 1.5; // Controls how fast the smoke clears
        
        positions[i * 3] += velocities[i * 3] * delta;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;
        
        // High drag creates the billowing smoke effect
        velocities[i * 3] *= 0.82;
        velocities[i * 3 + 1] *= 0.82;
        velocities[i * 3 + 2] *= 0.82;
        
        needsUpdate = true;
      } else if (life[i] > -1) {
        // Move off-camera once dead
        positions[i * 3] = 9999;
        life[i] = -2;
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={meshRef} geometry={geo}>
      <pointsMaterial
        size={1.2}
        map={smokeTexture}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/* ============================================================
   3D COMPONENT: PARALLAX SHOWCASE CARD
   ============================================================ */
const ShowcaseCard = ({ item, isActive }: { item: any; isActive: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    // 1. 3D Parallax Tilt based on cursor
    const targetX = (pointer.y * Math.PI) / 12;
    const targetY = (pointer.x * Math.PI) / 12;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * delta * 6;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * delta * 6;

    // 2. Scale & reveal logic (pops out of the smoke)
    const targetScale = isActive ? 1 : 0.01;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 7);

    // Render optimization
    groupRef.current.visible = groupRef.current.scale.x > 0.05;
  });

  return (
    <group ref={groupRef}>
      {/* Photo Layer */}
      <DreiImage
        url={item.img}
        transparent
        opacity={0.9}
        position={[0, 0, -0.2]}
        scale={[6, 3.5]} // Widescreen aspect ratio
      />
      
      {/* Darkening overlay to make text pop */}
      <mesh position={[0, 0, -0.19]}>
        <planeGeometry args={[6, 3.5]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.4} />
      </mesh>

      {/* Floating 3D Text Layers */}
      <Text
        position={[0, 0.3, 0.4]}
        fontSize={0.85}
        color={item.color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
        letterSpacing={0.05}
      >
        {item.title}
      </Text>
      
      <Text
        position={[0, -0.6, 0.6]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.3}
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {item.subtitle}
      </Text>
    </group>
  );
};

/* ============================================================
   3D COMPONENT: AMBIENT SWIRLING PARTICLES
   ============================================================ */
const AmbientVortex = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 1500;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const palette = [new THREE.Color('#00e5ff'), new THREE.Color('#ff007f'), new THREE.Color('#a855f7')];

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 10 + 2;
      const theta = Math.random() * 2 * Math.PI;
      const y = (Math.random() - 0.5) * 12;
      const twist = y * 0.5;

      pos[i * 3] = radius * Math.cos(theta + twist);
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = radius * Math.sin(theta + twist) - 4; // Push behind cards

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r; 
      col[i * 3 + 1] = c.g; 
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
};

/* ============================================================
   UI COMPONENT: LOADING OVERLAY
   ============================================================ */
const LoadingOverlay = () => {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 pointer-events-none">
      <div className="text-cyan-400 font-mono text-sm tracking-widest mb-3 animate-pulse">
        RENDERING GALAXY... {Math.round(progress)}%
      </div>
      <div className="w-48 h-1.5 bg-cyan-950 rounded-full overflow-hidden border border-cyan-500/30">
        <div
          className="h-full bg-cyan-400 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

/* ============================================================
   MAIN SEQUENCE ORCHESTRATOR
   ============================================================ */
export const CosmicTornado3D = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-advance the portfolio carousel every 5.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SHOWCASE_ITEMS.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[600px] relative border border-cyan-500/30 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.15)] bg-black">
      
      {/* 3D Canvas Context */}
      <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          
          <AmbientVortex />
          <SmokeBurst triggerIndex={activeIndex} />
          
          {SHOWCASE_ITEMS.map((item, index) => (
            <ShowcaseCard key={item.id} item={item} isActive={index === activeIndex} />
          ))}
        </Suspense>
      </Canvas>

      <LoadingOverlay />

      {/* UI Overlay: Manual Navigation Track */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
        <div className="flex gap-3 bg-black/40 backdrop-blur-md px-4 py-3 rounded-full border border-purple-500/20">
          {SHOWCASE_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer hover:scale-110 ${
                idx === activeIndex 
                  ? 'w-10 h-2 bg-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.8)]' 
                  : 'w-2 h-2 bg-purple-700/60 hover:bg-purple-400'
              }`}
              aria-label={`Jump to ${item.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};