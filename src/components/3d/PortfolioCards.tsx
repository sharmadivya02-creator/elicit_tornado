'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { cardVertexShader } from '@/shaders/card/vertex';
import { cardFragmentShader } from '@/shaders/card/fragment';

// Exact filenames matching your public/about/ folder structure
const IMAGES = [
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

// Create a default placeholder texture while loading or on error
function createFallbackTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#444444';
    ctx.font = '20px sans-serif';
    ctx.fillText('Loading...', 80, 130);
  }
  return new THREE.CanvasTexture(canvas);
}

function SingleCard({ index, imgUrl }: { index: number; imgUrl: string }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture>(createFallbackTexture());

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      encodeURI(imgUrl),
      (loadedTex) => {
        loadedTex.generateMipmaps = true;
        loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
        setTexture(loadedTex);
      },
      undefined,
      (error) => {
        console.warn(`Could not load image: ${imgUrl}, using fallback.`, error);
      }
    );
  }, [imgUrl]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTexture.value = texture;
    }
  }, [texture]);

  const cardWidth = 3.0;
  const cardHeight = 4.0;
  const pixelMultiplier = 150;

  const angle = index * 0.8;
  const radius = 3.8;
  const initialX = Math.cos(angle) * radius;
  const initialY = Math.sin(angle) * 1.8;
  const initialZ = -index * 4.5;

  useFrame(() => {
    const scrollProgress = useStore.getState().scrollProgress;

    if (meshRef.current) {
      meshRef.current.position.z = initialZ + scrollProgress * (IMAGES.length * 4.5);
    }
  });

  return (
    <mesh ref={meshRef} position={[initialX, initialY, initialZ]}>
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
  );
}

export default function PortfolioCards() {
  return (
    <group position={[0, 0, -5]}>
      {IMAGES.map((imgUrl, index) => (
        <SingleCard key={index} index={index} imgUrl={imgUrl} />
      ))}
    </group>
  );
}