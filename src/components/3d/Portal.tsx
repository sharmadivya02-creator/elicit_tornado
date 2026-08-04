'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { vertexShader } from '@/shaders/portal/vertex';
import { fragmentShader } from '@/shaders/portal/fragment';

export default function Portal() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const scrollProgress = useStore((state) => state.scrollProgress);

  useFrame((state) => {
    if (materialRef.current) {
      // Update elapsed time for ambient animation
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      
      // Scale scroll progress so the portal explosion happens during the first chunk of the scroll
      materialRef.current.uniforms.uProgress.value = Math.min(scrollProgress * 2.5, 1.0);
    }
  });

  return (
    <points position={[0, 0, 0]}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uProgress: { value: 0 },
        }}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}