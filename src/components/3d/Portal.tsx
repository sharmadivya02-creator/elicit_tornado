'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader } from '@/shaders/portal/vertex';
import { fragmentShader } from '@/shaders/portal/fragment';
import { TUNNEL_DEPTH } from './PortfolioCards';

const PARTICLE_COUNT = 6000;

export default function Portal() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT);

    const verticalSpan = 10;
    const helixTurns = 3.5;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const baseZ = -Math.random() * TUNNEL_DEPTH;

      const t = Math.random();
      const y = (t - 0.5) * verticalSpan;
      const angle = t * helixTurns * Math.PI * 2 + Math.random() * 0.4;

      const radius = 2.2 + Math.random() * 1.8;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = baseZ + Math.sin(angle) * radius * 0.3;

      seeds[i] = Math.random();
    }

    return { positions, seeds };
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <points position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSeed" count={PARTICLE_COUNT} array={seeds} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uTime: { value: 0 } }}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}