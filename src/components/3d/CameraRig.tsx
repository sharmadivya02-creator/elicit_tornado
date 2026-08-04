'use client';

import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useMemo } from 'react';
import { useStore } from '../../store/useStore';

export function CameraRig() {
  const { camera } = useThree();

  // Create a sweeping CatmullRom curve for the camera to fly through
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 8),      // Start position (viewing portal)
    new THREE.Vector3(3, 1, 0),      // Curve right and up
    new THREE.Vector3(-3, -1, -15),  // Curve left and down through the cards
    new THREE.Vector3(0, 0, -30)     // End deep in the scene
  ]), []);

  useFrame(() => {
    // Grab the 0 to 1 progress from Zustand (driven by Lenis)
    const scrollProgress = useStore.getState().scrollProgress;
    
    // Map progress to the 3D curve
    const point = curve.getPoint(scrollProgress);
    
    // Look slightly ahead on the curve for realistic cinematic movement
    const lookAtPoint = curve.getPoint(Math.min(scrollProgress + 0.05, 1.0));
    
    // Smoothly interpolate the camera's position and rotation
    camera.position.lerp(point, 0.08);
    camera.lookAt(lookAtPoint);
  });

  return null;
}