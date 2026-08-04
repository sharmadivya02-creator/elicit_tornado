'use client';

import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export default function PostProcessing() {
  return (
    <EffectComposer >
      {/* 
        LuminanceThreshold controls what glows. Lower = more glow.
        Intensity controls how bright the glow is.
      */}
      <Bloom 
        luminanceThreshold={0.2} 
        mipmapBlur 
        intensity={1.5} 
      />
      {/* Subtle cinematic film grain to blend the banding */}
      <Noise 
        opacity={0.035} 
        blendFunction={BlendFunction.OVERLAY} 
      />
    </EffectComposer>
  );
}