"use client";

import React, { useMemo, useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Image as DreiImage, useProgress } from "@react-three/drei";
import * as THREE from "three";

/* ============================================================
   PHASE TYPE
   ============================================================ */
type Phase = "logo-in" | "headline" | "spiral" | "logo-out";

/* ============================================================
   3D PIECES (unchanged from before — particle field + photo ring)
   ============================================================ */
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

  useFrame((_, delta) => {
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
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const ABOUT_IMAGES = [
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
  "/about/untitled-23.jpg",
];

const FloatingImages = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {ABOUT_IMAGES.map((url, i) => {
        const angle = (i / ABOUT_IMAGES.length) * Math.PI * 2 * 2;
        const radius = 6.0;

        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (i - ABOUT_IMAGES.length / 2) * 0.5;

        return (
          <DreiImage
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

const LoadingOverlay = () => {
  const { active, progress } = useProgress();
  if (!active) return null;

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 pointer-events-none">
      <div className="text-cyan-400 font-mono text-sm tracking-widest mb-3">
        LOADING MEMORY VORTEX... {Math.round(progress)}%
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
   STAGE: ACM LOGO (opening + closing)
   ============================================================ */
const AcmLogoStage: React.FC<{ visible: boolean }> = ({ visible }) => (
  <div
    className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-[1200ms] ease-out ${
      visible ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
  >
    <img
      src="/logo/acm-logo.svg"
      alt="ACM Logo"
      className="w-36 h-36 md:w-52 md:h-52 object-contain drop-shadow-[0_0_35px_rgba(34,211,238,0.55)]"
      style={{ animation: visible ? "acmPulse 3s ease-in-out infinite" : "none" }}
    />
    <style jsx>{`
      @keyframes acmPulse {
        0%, 100% { transform: scale(1); filter: brightness(1); }
        50% { transform: scale(1.05); filter: brightness(1.25); }
      }
    `}</style>
  </div>
);

/* ============================================================
   STAGE: HEADLINE (ELICIT '26 + Powered by OnePlus)
   ============================================================ */
const HeadlineStage: React.FC<{ visible: boolean }> = ({ visible }) => (
  <div
    className={`absolute inset-0 flex flex-col items-center justify-center text-center px-6 transition-opacity duration-[1200ms] ease-out ${
      visible ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
  >
    <h2 className="font-display text-4xl md:text-6xl font-black tracking-[0.15em] bg-gradient-to-r from-cyan-300 via-white to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(124,58,237,0.5)]">
      ELICIT&nbsp;'26
    </h2>
    <p className="mt-4 font-mono text-[10px] md:text-xs tracking-[0.4em] text-cyan-300/80 uppercase">
      Powered by OnePlus
    </p>
  </div>
);

/* ============================================================
   STAGE: DESCRIPTION OVERLAY (shown while spiral is active)
   ============================================================ */
const DescriptionStage: React.FC<{ visible: boolean }> = ({ visible }) => (
  <div
    className={`absolute bottom-6 left-0 right-0 flex justify-center px-6 transition-opacity duration-[1200ms] ease-out ${
      visible ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
  >
    <p className="max-w-xl text-center font-mono text-[11px] md:text-sm leading-relaxed text-gray-300/90 tracking-wide bg-black/40 backdrop-blur-sm rounded-lg px-4 py-3 border border-cyan-500/10">
      ELICIT '26 is MUJ ACM Student Chapter's flagship tech fest — a gathering
      of builders, dreamers and explorers pushing the edges of code, design
      and imagination across a galaxy of ideas.
    </p>
  </div>
);

/* ============================================================
   MAIN SEQUENCE ORCHESTRATOR
   ============================================================ */
export const CosmicTornado3D = () => {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("logo-in");
  const [showDescription, setShowDescription] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Timeline (ms) — tweak these to change pacing
    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => setPhase("headline"), 3200),   // logo holds ~3.2s
      setTimeout(() => {
        setPhase("spiral");
        setShowCanvas(true);
      }, 6800),                                        // headline holds ~3.6s
      setTimeout(() => setShowDescription(true), 9000),  // description fades in
      setTimeout(() => setShowDescription(false), 16000), // description fades out
      setTimeout(() => setPhase("logo-out"), 17000),   // spiral fades, closing logo fades in
    ];

    return () => timers.forEach(clearTimeout);
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="w-full h-[600px] bg-black/90 rounded-xl flex items-center justify-center text-cyan-400 font-mono text-sm tracking-widest">
        INITIALIZING NEURAL WEBGL ENGINE...
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] relative border border-cyan-500/30 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.15)] bg-black">
      {showCanvas && (
        <div
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-out ${
            phase === "spiral" ? "opacity-100" : "opacity-0"
          }`}
        >
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
          <LoadingOverlay />
        </div>
      )}

      <AcmLogoStage visible={phase === "logo-in" || phase === "logo-out"} />
      <HeadlineStage visible={phase === "headline"} />
      <DescriptionStage visible={showDescription} />
    </div>
  );
};