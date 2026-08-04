'use client';

import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';

export default function PostProcessing() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={1.2}
        mipmapBlur
        intensity={2.0}
        levels={8}
      />
      <Noise opacity={0.04} />
    </EffectComposer>
  );
}