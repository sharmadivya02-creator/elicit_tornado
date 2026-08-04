'use client';

import { ReactLenis } from '@studio-freight/react-lenis';
import { useStore } from '../../store/useStore';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{ lerp: 0.05, smoothWheel: true }}
      onScroll={(e: any) => {
        // Sync lenis scroll progress (0 to 1) directly into our Zustand store
        useStore.getState().setScrollProgress(e.progress);
      }}
    >
      {children }
    </ReactLenis>
  );
}