// src/components/CinematicShowcase.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera, SpotLight, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer, Bloom, DepthOfField, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

gsap.registerPlugin(ScrollTrigger);

// ==================== SPEED CONTROL ====================
const SWIRL_SPEED = 0.03;
const HEX_RADIUS = 3.5;

// ==================== PARTICLE SYSTEM ====================
interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  target: THREE.Vector3;
  size: number;
  color: THREE.Color;
  phase: number;
  originalPos: THREE.Vector3;
}

class ParticleSystem {
  particles: Particle[];
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
  points: THREE.Points;
  count: number;
  radius: number;
  morphProgress: number = 0;

  constructor(count: number = 8000, radius: number = 8) {
    this.count = count;
    this.radius = radius;
    this.particles = [];
    
    // Create geometry
    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const randoms = new Float32Array(count);
    
    const color = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
      // Initial positions in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.cbrt(Math.random());
      
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
      positions[i * 3 + 2] = Math.cos(phi) * r;
      
      // Colors - gradient from cyan to purple
      const t = Math.random();
      color.setHSL(0.55 + t * 0.2, 0.8, 0.5 + t * 0.3);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = 0.02 + Math.random() * 0.06;
      randoms[i] = Math.random() * 100;
      
      // Store particle data
      this.particles.push({
        position: new THREE.Vector3(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
        target: new THREE.Vector3(
          (Math.random() - 0.5) * radius * 1.5,
          (Math.random() - 0.5) * radius * 1.5,
          (Math.random() - 0.5) * radius * 1.5
        ),
        size: sizes[i],
        color: new THREE.Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]),
        phase: randoms[i],
        originalPos: new THREE.Vector3(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        )
      });
    }
    
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    this.geometry.setAttribute('random', new THREE.BufferAttribute(randoms, 1));
    
    this.material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    
    this.points = new THREE.Points(this.geometry, this.material);
  }

  update(time: number, progress: number, mouseX: number, mouseY: number) {
    const positions = this.geometry.attributes.position.array as Float32Array;
    const targetProgress = Math.min(1, progress * 2);
    
    // Morph from sphere to dispersed state
    const morphTarget = Math.min(1, progress * 3);
    
    for (let i = 0; i < this.count; i++) {
      const p = this.particles[i];
      const i3 = i * 3;
      
      // Curl noise turbulence
      const noiseX = Math.sin(p.originalPos.x * 2 + time * 0.5 + p.phase) * 0.1;
      const noiseY = Math.cos(p.originalPos.y * 2 + time * 0.7 + p.phase * 0.7) * 0.1;
      const noiseZ = Math.sin(p.originalPos.z * 2 + time * 0.3 + p.phase * 1.3) * 0.1;
      
      // Swirl effect
      const angle = time * 0.2 + p.phase * 0.01;
      const radius = Math.sqrt(
        p.originalPos.x * p.originalPos.x + 
        p.originalPos.z * p.originalPos.z
      );
      const swirlX = -Math.sin(angle) * radius * 0.02;
      const swirlZ = Math.cos(angle) * radius * 0.02;
      
      // Target position with morphing
      const targetX = p.originalPos.x * (1 - morphTarget * 0.6) + 
                     (Math.random() - 0.5) * morphTarget * 4;
      const targetY = p.originalPos.y * (1 - morphTarget * 0.6) + 
                     (Math.random() - 0.5) * morphTarget * 4;
      const targetZ = p.originalPos.z * (1 - morphTarget * 0.6) + 
                     (Math.random() - 0.5) * morphTarget * 4;
      
      // Mouse interaction - attraction/repulsion
      const dx = mouseX * 8 - p.position.x;
      const dy = mouseY * 4 - p.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      let mouseForceX = 0;
      let mouseForceY = 0;
      let mouseForceZ = 0;
      
      if (dist < 3) {
        const force = (1 - dist / 3) * 0.02;
        mouseForceX = dx * force;
        mouseForceY = dy * force;
        mouseForceZ = (p.position.z * -1) * force * 0.5;
      }
      
      // Velocity damping with physics
      p.velocity.x += (targetX - p.position.x) * 0.01 + noiseX + swirlX + mouseForceX;
      p.velocity.y += (targetY - p.position.y) * 0.01 + noiseY + mouseForceY;
      p.velocity.z += (targetZ - p.position.z) * 0.01 + noiseZ + swirlZ + mouseForceZ;
      
      // Damping
      p.velocity.x *= 0.98;
      p.velocity.y *= 0.98;
      p.velocity.z *= 0.98;
      
      // Update position
      p.position.x += p.velocity.x;
      p.position.y += p.velocity.y;
      p.position.z += p.velocity.z;
      
      positions[i3] = p.position.x;
      positions[i3 + 1] = p.position.y;
      positions[i3 + 2] = p.position.z;
    }
    
    this.geometry.attributes.position.needsUpdate = true;
    
    // Opacity based on scroll progress
    this.material.opacity = 0.3 + 0.7 * (1 - Math.abs(progress - 0.5) * 1.5);
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}

// ==================== 3D SCENE COMPONENTS ====================

// Floating Metallic Torus
function FloatingTorus({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();
    
    // Idle rotation
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    meshRef.current.rotation.y = time * 0.2;
    meshRef.current.rotation.z = Math.sin(time * 0.2) * 0.05;
    
    // Mouse parallax
    meshRef.current.position.x = Math.sin(time * 0.2) * 0.5 + mouse.x * 0.3;
    meshRef.current.position.y = Math.sin(time * 0.15 + 1) * 0.3 + mouse.y * 0.2;
    
    // Scale based on scroll progress
    const scale = 0.5 + 0.5 * (1 - Math.abs(progress - 0.5) * 1.5);
    meshRef.current.scale.setScalar(Math.max(0.3, Math.min(1.2, scale)));
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]}>
      <torusGeometry args={[2, 0.3, 32, 64]} />
      <meshPhysicalMaterial
        color="#7c3aed"
        metalness={0.9}
        roughness={0.1}
        envMapIntensity={1.5}
        emissive="#4f1d91"
        emissiveIntensity={0.3}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

// Metallic Sphere with Environment Reflections
function MetallicSphere({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();
    
    meshRef.current.rotation.x = time * 0.1;
    meshRef.current.rotation.y = time * 0.15;
    
    // Floating animation
    meshRef.current.position.y = Math.sin(time * 0.5 + 1) * 0.5;
    
    // Scale based on scroll
    const scale = 0.5 + 0.5 * (1 - Math.abs(progress - 0.5) * 1.5);
    meshRef.current.scale.setScalar(Math.max(0.3, Math.min(1.2, scale)));
  });
  
  return (
    <mesh ref={meshRef} position={[-3, 0, -2]}>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshPhysicalMaterial
        color="#00f0ff"
        metalness={0.95}
        roughness={0.05}
        envMapIntensity={2}
        emissive="#003366"
        emissiveIntensity={0.2}
        clearcoat={1}
        clearcoatRoughness={0.05}
      />
    </mesh>
  );
}

// Glass Torus Knot
function GlassKnot({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();
    
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.y = time * 0.3;
    
    meshRef.current.position.y = Math.sin(time * 0.3 + 2) * 0.8;
    
    const scale = 0.3 + 0.7 * (1 - Math.abs(progress - 0.5) * 1.5);
    meshRef.current.scale.setScalar(Math.max(0.2, Math.min(1.0, scale)));
  });
  
  return (
    <mesh ref={meshRef} position={[3, -0.5, -1]}>
      <torusKnotGeometry args={[1, 0.3, 64, 32]} />
      <meshPhysicalMaterial
        color="#ff4da6"
        metalness={0.3}
        roughness={0.1}
        envMapIntensity={1.2}
        transparent={true}
        opacity={0.7}
        clearcoat={1}
        clearcoatRoughness={0.1}
        emissive="#660033"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

// Ambient Particles
function AmbientParticles({ progress }: { progress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 2000;
  
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 12 + Math.random() * 4;
    
    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
    positions[i * 3 + 2] = Math.cos(phi) * r;
    
    const t = Math.random();
    colors[i * 3] = 0.3 + t * 0.4;
    colors[i * 3 + 1] = 0.1 + t * 0.2;
    colors[i * 3 + 2] = 0.5 + t * 0.5;
  }
  
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ==================== MAIN SCENE ====================

function SceneContent({ progress, mouseX, mouseY }: { progress: number; mouseX: number; mouseY: number }) {
  const { camera } = useThree();
  
  // Camera movement based on scroll
  useFrame(() => {
    const targetZ = 8 - progress * 6;
    const targetY = 0.5 + Math.sin(progress * Math.PI * 0.5) * 0.5;
    
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    
    // Mouse parallax for camera
    camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.02;
    
    camera.lookAt(0, 0.5, -2);
  });
  
  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={0.3} color="#222244" />
      
      {/* Key Light */}
      <directionalLight position={[5, 10, 7]} intensity={1.5} color="#8A2BE2" />
      
      {/* Fill Light */}
      <directionalLight position={[-5, -2, -5]} intensity={0.8} color="#00FFFF" />
      
      {/* Rim Light */}
      <directionalLight position={[0, 5, -8]} intensity={1.2} color="#FF4DA6" />
      
      {/* Spot Light for drama */}
      <SpotLight
        position={[0, 8, 0]}
        angle={0.5}
        penumbra={0.5}
        intensity={2}
        color="#7c3aed"
        distance={20}
        castShadow
      />
      
      {/* Environment */}
      <Environment preset="city" environmentIntensity={0.8} />
      
      {/* Scene Objects */}
      <FloatingTorus progress={progress} />
      <MetallicSphere progress={progress} />
      <GlassKnot progress={progress} />
      <AmbientParticles progress={progress} />
      
      {/* Ground plane for reflections */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshPhysicalMaterial
          color="#0a0a15"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.5}
        />
      </mesh>
    </>
  );
}

// ==================== MAIN COMPONENT ====================

export default function CinematicShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [progress, setProgress] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  
  // GSAP Timeline
  useEffect(() => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
      // Pin the hero section
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          setProgress(self.progress);
        }
      });
      
      // Section animations
      sectionsRef.current.forEach((section, index) => {
        if (!section) return;
        
        // Each section flies in from Z-axis
        gsap.fromTo(section,
          {
            opacity: 0,
            scale: 0.8,
            rotationX: 15,
            z: 100,
            filter: 'blur(10px)'
          },
          {
            opacity: 1,
            scale: 1,
            rotationX: 0,
            z: 0,
            filter: 'blur(0px)',
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom-=10%',
              end: 'top center',
              scrub: 1.2,
            }
          }
        );
      });
      
      // Crossfade backgrounds between sections
      const sections = document.querySelectorAll('.project-section');
      sections.forEach((section, i) => {
        if (i === 0) return;
        const prevSection = sections[i - 1];
        
        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom-=20%',
          end: 'top top+=20%',
          onUpdate: (self) => {
            const opacity = self.progress;
            (prevSection as HTMLElement).style.opacity = String(1 - opacity);
          }
        });
      });
    });
    
    return () => ctx.revert();
  }, []);
  
  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      
      // Smooth mouse with inertia
      setMouseX(prev => prev + (x - prev) * 0.05);
      setMouseY(prev => prev + (y - prev) * 0.05);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div ref={containerRef} className="relative w-full bg-black">
      {/* ===== HERO SECTION ===== */}
      <div
        ref={heroRef}
        className="relative w-full h-screen overflow-hidden"
      >
        {/* 3D Canvas */}
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0.5, 8], fov: 45 }}
            gl={{
              antialias: true,
              powerPreference: 'high-performance',
              alpha: false
            }}
          >
            <SceneContent progress={progress} mouseX={mouseX} mouseY={mouseY} />
            
            {/* Post-processing */}
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.2}
                intensity={0.8}
                radius={0.4}
                levels={8}
              />
              <DepthOfField
                focusDistance={0.02}
                focalLength={0.2}
                bokehScale={2}
              />
              <Noise
                opacity={0.02}
                blendFunction={BlendFunction.OVERLAY}
              />
            </EffectComposer>
          </Canvas>
        </div>
        
        {/* Hero Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          <h1 className="font-pixel text-6xl md:text-8xl text-white text-center tracking-wider">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
              ELICIT'26
            </span>
            <span className="block text-2xl md:text-3xl text-cyan-400 mt-4 font-mono tracking-[0.3em]">
              WHERE INNOVATION MEETS THE COSMOS
            </span>
          </h1>
          
          <div className="mt-8 text-center max-w-2xl px-4">
            <p className="font-mono text-sm md:text-base text-purple-200 leading-relaxed bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20">
              A fest that blends creativity with innovation. Explore the possibilities
              of design, tech, and imagination coming together in harmony. This is
              ELICIT '26 — the biggest techfest of MUJ. A must-have experience. We
              celebrate 10 years of ACM as well as ELICIT.
            </p>
          </div>
          
          <div className="mt-8 font-mono text-xs text-cyan-400/70 animate-pulse tracking-[0.3em]">
            SCROLL TO EXPLORE
          </div>
        </div>
      </div>
      
      {/* ===== PROJECT SECTIONS ===== */}
      <div className="relative z-10">
        {[
          { title: 'ABOUT ACM', desc: 'The Association for Computing Machinery at Manipal University Jaipur, fostering innovation and technical excellence since 2016.', color: '#7c3aed' },
          { title: 'EVENTS', desc: 'From hackathons to workshops, we bring the best of technology, design, and creativity to our community.', color: '#00f0ff' },
          { title: 'GALLERY', desc: 'Explore our journey through the years — moments captured from our tech fests, workshops, and community events.', color: '#ff4da6' },
          { title: 'SPONSORS', desc: 'Our partners in innovation — companies and organizations that support our mission to build the future.', color: '#ffd700' },
          { title: 'TEAM', desc: 'The passionate individuals behind ACM MUJ, working tirelessly to create memorable experiences.', color: '#00ffa3' },
        ].map((section, index) => (
          <div
            key={index}
            ref={el => { sectionsRef.current[index] = el; }}
            className="project-section relative w-full min-h-screen flex items-center justify-center px-4 py-20"
            style={{
              backgroundColor: index % 2 === 0 ? 'rgba(7,1,20,0.85)' : 'rgba(10,2,25,0.85)',
              borderBottom: index < 4 ? '1px solid rgba(124,58,237,0.1)' : 'none',
            }}
          >
            {/* Section background glow */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                background: `radial-gradient(circle at ${50 + Math.sin(index * 2) * 20}% ${50 + Math.cos(index * 3) * 20}%, ${section.color}33 0%, transparent 70%)`
              }}
            />
            
            {/* Card content */}
            <div className="relative max-w-4xl w-full bg-black/40 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-purple-500/20 shadow-2xl">
              <div
                className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, ${section.color}, ${section.color}44)` }}
              />
              
              <h2
                className="font-pixel text-3xl md:text-5xl mb-6 tracking-wider"
                style={{ color: section.color }}
              >
                {section.title}
              </h2>
              
              <p className="font-mono text-base md:text-lg text-purple-200 leading-relaxed">
                {section.desc}
              </p>
              
              <div className="mt-6 flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: section.color }}
                />
                <span className="font-mono text-xs text-purple-400 tracking-wider">
                  SECTION {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* ===== OUTRO ===== */}
      <div className="relative w-full min-h-screen flex items-center justify-center bg-black/95 px-4">
        <div className="text-center max-w-2xl">
          <h2 className="font-pixel text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
            SEE YOU AT ELICIT'26
          </h2>
          <p className="font-mono text-sm text-purple-300 mt-4 leading-relaxed">
            Powered by Manipal University Jaipur ACM Student Chapter
          </p>
          <div className="mt-8 w-24 h-1 mx-auto bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}