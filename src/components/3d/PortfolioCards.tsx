// src/components/3d/PortfolioCards.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { cardVertexShader } from '@/shaders/card/vertex';
import { cardFragmentShader } from '@/shaders/card/fragment';

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
export const DEPTH_SPACING = 3.0;
export const TUNNEL_DEPTH = CARD_COUNT * DEPTH_SPACING;

// ==================== SPEED CONTROL ====================
const SWIRL_SPEED = 0.015;
const HEX_RADIUS = 1.5;

function createFallbackTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 1024, 768);
    gradient.addColorStop(0, '#1a0a2e');
    gradient.addColorStop(1, '#0a0015');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 768);
    
    ctx.fillStyle = '#7c3aed';
    ctx.font = '120px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦', 512, 384);
    
    ctx.fillStyle = '#00f0ff';
    ctx.font = '60px sans-serif';
    ctx.fillText('ELICIT', 512, 500);
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

  const particlesCount = 40;
  const [particlePositions] = useState(() => {
    const pos = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount; i++) {
      pos[i*3] = (Math.random() - 0.5) * 12;     
      pos[i*3+1] = (Math.random() - 0.5) * 12;   
      pos[i*3+2] = (Math.random() - 0.5) * 4 - 2; 
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
        loadedTex.anisotropy = 4;
        
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
      }
    );
  }, [imgUrl]);

  useEffect(() => {
    if (materialRef.current && texture) {
      materialRef.current.uniforms.uTexture.value = texture;
    }
  }, [texture]);

  const baseHeight = 3.2;
  const baseWidth = baseHeight * aspectRatio;
  const cardHeight = baseHeight;
  const cardWidth = baseWidth;

  const initialZ = -index * DEPTH_SPACING;
  const hexAngleOffset = index * 0.3;

  useFrame(({ camera, clock }) => {
    if (!meshRef.current || !groupRef.current) return;

    const progress = useStore.getState().scrollProgress || 0;
    
    // IMPORTANT: Use modulo to cycle through images continuously
    const totalImages = CARD_COUNT;
    const imageIndex = index;
    
    // Calculate where this image should be in the scroll cycle
    // Each image gets a segment of the scroll progress
    const segmentLength = 1 / totalImages;
    const imageStart = imageIndex * segmentLength;
    const imageEnd = (imageIndex + 1) * segmentLength;
    
    // Wrap progress so it loops infinitely
    let wrappedProgress = progress % 1;
    if (wrappedProgress < 0) wrappedProgress += 1;
    
    // Calculate distance from this image's segment
    let distanceFromCenter = (wrappedProgress - imageStart) / segmentLength - 0.5;
    
    // Handle wrapping for seamless looping
    if (distanceFromCenter > 0.5) distanceFromCenter -= 1;
    if (distanceFromCenter < -0.5) distanceFromCenter += 1;
    
    // Clamp distance for visibility
    const clampedDistance = Math.max(-0.8, Math.min(0.8, distanceFromCenter));
    
    // Calculate opacity - image is visible when near center
    const visibility = 1 - Math.abs(clampedDistance * 1.5);
    const opacity = Math.max(0, Math.min(1, visibility));
    
    // Scale - stable with slight zoom on active
    const scaleFactor = 0.8 + 0.2 * (1 - Math.abs(clampedDistance) * 0.5);
    const finalScale = Math.max(0.7, Math.min(1.0, scaleFactor));
    
    const time = clock.getElapsedTime();
    
    // Gentle movement
    const hexAngle = hexAngleOffset + time * SWIRL_SPEED + wrappedProgress * Math.PI * 2;
    const hexModulation = Math.min(0.5, Math.abs(clampedDistance) * 0.8);
    
    const hexY = Math.sin(hexAngle * 0.5 + 0.3) * HEX_RADIUS * 0.3 * hexModulation;
    const hexX = Math.cos(hexAngle * 0.4) * HEX_RADIUS * 0.2 * hexModulation;
    
    const floatX = Math.sin(time * 0.08 + index * 0.5) * 0.03;
    const floatY = Math.cos(time * 0.1 + index * 0.3) * 0.03;
    
    // Z position - images cycle through depth
    const targetZ = initialZ * 0.2 + wrappedProgress * DEPTH_SPACING * 0.3;
    const targetX = hexX + floatX;
    const targetY = hexY + floatY;
    
    // Smooth interpolation
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.1;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.1;
    meshRef.current.position.z += (targetZ - meshRef.current.position.z) * 0.1;
    
    // Apply scale
    meshRef.current.scale.setScalar(finalScale);
    
    // Keep images facing camera
    meshRef.current.rotation.z += (-meshRef.current.rotation.z) * 0.03;
    meshRef.current.rotation.y += (-meshRef.current.rotation.y) * 0.03;
    
    meshRef.current.frustumCulled = false;
    meshRef.current.renderOrder = 1;
    
    // Set opacity on material
    const meshMaterial = meshRef.current.material;
    const materials = Array.isArray(meshMaterial) ? meshMaterial : [meshMaterial];
    materials.forEach((m) => {
      (m as any).opacity = opacity;
      (m as any).transparent = opacity < 1;
    });
    meshRef.current.visible = opacity > 0.01;

    // Particles
    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.attributes.position;
      const positions = posAttr.array as Float32Array;
      
      const driftX = targetX * 0.15;
      const driftY = targetY * 0.15;
      const driftZ = targetZ * 0.1;
      
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        positions[i3] = initialParticlePositions.current[i3] + driftX * (0.5 + Math.sin(i * 0.5) * 0.3);
        positions[i3 + 1] = initialParticlePositions.current[i3 + 1] + driftY * (0.5 + Math.cos(i * 0.7) * 0.3);
        positions[i3 + 2] = initialParticlePositions.current[i3 + 2] + driftZ * (0.5 + Math.sin(i * 0.3 + 1) * 0.3);
      }
      
      posAttr.needsUpdate = true;
      
      particlesRef.current.frustumCulled = false;
      
      particlesRef.current.position.set(
        meshRef.current.position.x * 0.1,
        meshRef.current.position.y * 0.1,
        meshRef.current.position.z - 0.3
      );
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} frustumCulled={false}>
        <planeGeometry args={[cardWidth, cardHeight, 32, 32]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={cardVertexShader}
          fragmentShader={cardFragmentShader}
          transparent={true}
          side={THREE.DoubleSide}
          uniforms={{
            uTexture: { value: texture },
            uResolution: { value: new THREE.Vector2(cardWidth * 200, cardHeight * 200) },
            uRadius: { value: 20.0 },
          }}
        />
      </mesh>

      <points ref={particlesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.04} 
          color="#00f0ff" 
          transparent={true} 
          opacity={0.2} 
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function PortfolioCards() {
  return (
    <group position={[0, 0, 0]}>
      {IMAGES.map((imgUrl, index) => (
        <SingleCard key={`${imgUrl}-${index}`} index={index} imgUrl={imgUrl} />
      ))}
    </group>
  );
}