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

export const CARD_COUNT = IMAGES.length;
export const DEPTH_SPACING = 5.5;
export const TUNNEL_DEPTH = CARD_COUNT * DEPTH_SPACING;

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
  // Default to a 1.5 (landscape) aspect ratio until the image loads
  const [aspectRatio, setAspectRatio] = useState<number>(1.5); 

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      encodeURI(imgUrl),
      (loadedTex) => {
        loadedTex.generateMipmaps = true;
        loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
        
        // 1. Calculate actual image dimensions to prevent skewing
        const width = loadedTex.image.width || 1;
        const height = loadedTex.image.height || 1;
        setAspectRatio(width / height);
        
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

  // 2. Apply the dynamic aspect ratio to the geometry scale
  const cardHeight = 3.5;
  const cardWidth = cardHeight * aspectRatio;
  const pixelMultiplier = 150;

  // 3. Beautiful 3D Curved Tunnel Arrangement
// Centered directly on the camera's path — no left/right/up/down scatter
  const initialZ = -index * DEPTH_SPACING;
  const initialX = 0;
  const initialY = 0;

  const rotY = 0;
  const rotZ = 0;

 

  return (
    <mesh ref={meshRef} position={[initialX, initialY, initialZ]} rotation={[0, rotY, rotZ]}>
      <planeGeometry args={[cardWidth, cardHeight, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={cardVertexShader}
        fragmentShader={cardFragmentShader}
        transparent={true}
        side={THREE.DoubleSide}
        uniforms={{
          uTexture: { value: texture },
          // Dynamically pass the updated width/height to the shader for the border radius
          uResolution: { value: new THREE.Vector2(cardWidth * pixelMultiplier, cardHeight * pixelMultiplier) },
          uRadius: { value: 24.0 },
        }}
      />
    </mesh>
  );
}

export default function PortfolioCards() {
  return (
    <group position={[0, 0, -3]}>
      {IMAGES.map((imgUrl, index) => (
        <SingleCard key={index} index={index} imgUrl={imgUrl} />
      ))}
    </group>
  );
}