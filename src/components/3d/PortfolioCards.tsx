// src/components/3d/PortfolioCards.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { cardVertexShader } from '@/shaders/card/vertex';
import { cardFragmentShader } from '@/shaders/card/fragment';

// Use placeholder images that definitely exist
const IMAGES_BASE = [
  '/about/DSC_0074.jpg',
  '/about/DSC01089.jpg',
  '/about/DSC01093.jpg',
  '/about/DSC01123.jpg',
  '/about/DSC03579-2.jpg',
  '/about/DSC05277-Enhanced-NR.jpg',
  '/about/DSC05360-Enhanced-NR.jpg',
  '/about/DSC09563.jpg',
  '/about/DSC09810.jpg',
  '/about/DSC09946.jpg',
  '/about/IMG_0013.jpg',
  '/about/IMG_0043.jpg',
  '/about/IMG_0465.jpg',
  '/about/IMG_0651.jpg',
  '/about/IMG_3281.jpg',
  '/about/IMG_8134.jpg',
  '/about/IMG_8199.jpg',
  '/about/IMG_8215.jpg',
  '/about/untitled-4.jpg',
  '/about/untitled-18 (1).jpg',
  '/about/untitled-23.jpg',
];

// Duplicate for infinite feel
const IMAGES = [...IMAGES_BASE, ...IMAGES_BASE, ...IMAGES_BASE];

export const CARD_COUNT = IMAGES.length;
export const DEPTH_SPACING = 4.5;
export const TUNNEL_DEPTH = CARD_COUNT * DEPTH_SPACING;

// ==================== SPEED CONTROL ====================
const SWIRL_SPEED = 0.05; // <-- ADJUST THIS VALUE
const HEX_RADIUS = 4.2; // <-- ADJUST THIS VALUE

function createFallbackTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Dark gradient background
    const gradient = ctx.createLinearGradient(0, 0, 256, 256);
    gradient.addColorStop(0, '#1a0a2e');
    gradient.addColorStop(1, '#0a0015');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    
    // Draw a simple icon
    ctx.fillStyle = '#7c3aed';
    ctx.font = '40px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦', 128, 128);
    
    ctx.fillStyle = '#00f0ff';
    ctx.font = '20px sans-serif';
    ctx.fillText('ELICIT', 128, 180);
  }
  return new THREE.CanvasTexture(canvas);
}

function SingleCard({ index, imgUrl }: { index: number; imgUrl: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  const [texture, setTexture] = useState<THREE.Texture>(createFallbackTexture());
  const [aspectRatio, setAspectRatio] = useState<number>(1.5);
  const [textureLoaded, setTextureLoaded] = useState(false);

  const particlesCount = 50;
  const [particlePositions] = useState(() => {
    const pos = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount; i++) {
      pos[i*3] = (Math.random() - 0.5) * 25;     
      pos[i*3+1] = (Math.random() - 0.5) * 25;   
      pos[i*3+2] = (Math.random() - 0.5) * 10 - 4; 
    }
    return pos;
  });

  const initialParticlePositions = useRef(new Float32Array(particlePositions));

  useEffect(() => {
    if (!imgUrl) return;
    
    const loader = new THREE.TextureLoader();
    loader.load(
      imgUrl,
      (loadedTex) => {
        loadedTex.generateMipmaps = true;
        loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
        loadedTex.magFilter = THREE.LinearFilter;
        
        const img = loadedTex.image;
        if (img) {
          const width = img.width || 1;
          const height = img.height || 1;
          setAspectRatio(width / height);
        }
        
        setTexture(loadedTex);
        setTextureLoaded(true);
      },
      undefined,
      (error) => {
        console.warn(`Could not load image: ${imgUrl}`, error);
        // Keep using fallback texture
      }
    );
  }, [imgUrl]);

  useEffect(() => {
    if (materialRef.current && texture) {
      materialRef.current.uniforms.uTexture.value = texture;
    }
  }, [texture]);

  const cardHeight = 2;
  const cardWidth = cardHeight * aspectRatio;
  const pixelMultiplier = 200;

  const initialZ = -index * DEPTH_SPACING;
  const hexAngleOffset = index * 0.5;

  useFrame(({ camera, clock }) => {
    if (!meshRef.current || !groupRef.current) return;

    const progress = useStore.getState().scrollProgress || 0;
    
    // Wrap progress for infinite scrolling
    const maxProgress = CARD_COUNT * 0.6;
    const wrappedProgress = progress % maxProgress;
    const normalizedProgress = wrappedProgress / maxProgress;
    
    // Calculate position in the scroll timeline
    const cardPosition = index / CARD_COUNT;
    let distanceFromCenter = normalizedProgress - cardPosition;
    
    // Handle wrapping - show images before and after the center
    if (distanceFromCenter > 0.5) distanceFromCenter -= 1;
    if (distanceFromCenter < -0.5) distanceFromCenter += 1;
    
    const transitionWidth = 0.3;
    const rawActive = 1 - Math.abs(distanceFromCenter) / transitionWidth;
    const activeFactor = Math.max(0, Math.min(1, rawActive));

    // Scale based on distance
    const scaleFactor = 0.4 + 0.6 * (1 - Math.abs(distanceFromCenter) * 1.2);
    const finalScale = Math.max(0.2, Math.min(1.2, scaleFactor));
    
    const time = clock.getElapsedTime();
    
    // Hexagonal movement
const hexAngle = hexAngleOffset + time * SWIRL_SPEED + normalizedProgress * Math.PI * 2;

// Amplitude grows as the image moves AWAY from center (0 at center,
// full swing during transition), so the active image stays centered.
const hexModulation = Math.min(1, Math.abs(distanceFromCenter) / transitionWidth);

// VERTICAL hexagonal motion: full-radius sin drives Y (was X), reduced
// cos drives X (was Y) — swings the image up/down instead of side-to-side.
const hexY =Math.cos(hexAngle * 0.6 + 0.3) * HEX_RADIUS * 0.6 * hexModulation;
const hexX = Math.sin(hexAngle) * HEX_RADIUS * hexModulation;
    
    const floatX = Math.sin(time * 0.3 + index * 0.5) * 0.2;
    const floatY = Math.cos(time * 0.4 + index * 0.7) * 0.2;
    
    const targetX = hexX + floatX * activeFactor;
    const targetY = hexY + floatY * activeFactor;
    const targetZ = initialZ + wrappedProgress * DEPTH_SPACING * 1.1;
    
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.08;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.08;
    meshRef.current.position.z += (targetZ - meshRef.current.position.z) * 0.08;
    
    meshRef.current.scale.setScalar(
      meshRef.current.scale.x + (finalScale - meshRef.current.scale.x) * 0.08
    );
    
    meshRef.current.rotation.z += (Math.sin(hexAngle * 0.5) * 0.04 - meshRef.current.rotation.z) * 0.04;
    meshRef.current.rotation.y += (Math.cos(hexAngle * 0.3) * 0.03 - meshRef.current.rotation.y) * 0.04;
    
    // Opacity based on distance from center
    const visibilityFactor = Math.max(0, 1 - Math.abs(distanceFromCenter) * 1.5);
    const opacity = Math.min(1, Math.max(0, visibilityFactor));
    // material can be a single material or an array; set opacity safely
    const meshMaterial = meshRef.current.material;
    const materials = Array.isArray(meshMaterial) ? meshMaterial : [meshMaterial];
    materials.forEach((m) => {
      // some material types may not have opacity in their typings, so coerce
      (m as any).opacity = opacity;
      // ensure transparent flag if opacity < 1
      if (typeof (m as any).transparent !== 'undefined') (m as any).transparent = (opacity < 1) || !!(m as any).transparent;
    });
    meshRef.current.visible = opacity > 0.01;

    // Particles
    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.attributes.position;
      const positions = posAttr.array as Float32Array;
      
      const driftX = targetX * 0.3;
      const driftY = targetY * 0.3;
      const driftZ = targetZ * 0.2;
      
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        positions[i3] = initialParticlePositions.current[i3] + driftX * (0.5 + Math.sin(i * 0.5) * 0.3);
        positions[i3 + 1] = initialParticlePositions.current[i3 + 1] + driftY * (0.5 + Math.cos(i * 0.7) * 0.3);
        positions[i3 + 2] = initialParticlePositions.current[i3 + 2] + driftZ * (0.5 + Math.sin(i * 0.3 + 1) * 0.3);
      }
      
      posAttr.needsUpdate = true;
      
      (particlesRef.current.material as THREE.PointsMaterial).opacity = opacity * 0.5;
      
      particlesRef.current.position.set(
        meshRef.current.position.x * 0.2,
        meshRef.current.position.y * 0.2,
        meshRef.current.position.z - 0.5
      );
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <planeGeometry args={[cardWidth, cardHeight, 32, 32]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={cardVertexShader}
          fragmentShader={cardFragmentShader}
          transparent={true}
          side={THREE.DoubleSide}
          uniforms={{
            uTexture: { value: texture },
            uResolution: { value: new THREE.Vector2(cardWidth * pixelMultiplier, cardHeight * pixelMultiplier) },
            uRadius: { value: 24.0 },
          }}
        />
      </mesh>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.08} 
          color="#00f0ff" 
          transparent={true} 
          opacity={0.5} 
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function PortfolioCards() {
  return (
    <group position={[0, 0, -3]}>
      {IMAGES.map((imgUrl, index) => (
        <SingleCard key={`${imgUrl}-${index}`} index={index} imgUrl={imgUrl} />
      ))}
    </group>
  );
}