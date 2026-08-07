'use client';

import React, { useEffect } from 'react';

interface LetterGlitchProps {
  glitchColors?: string[];
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  smooth?: boolean;
}

export const LetterGlitch: React.FC<LetterGlitchProps> = ({
  glitchColors = ['#5227FF', '#7cff67', '#ff6b6b'],
  glitchSpeed = 50,
  centerVignette = true,
  outerVignette = false,
  smooth = true,
}) => {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';

    document.body.insertBefore(canvas, document.body.firstChild);

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Random glitch lines
      const now = Date.now();
      const glitchAmount = Math.sin(now / glitchSpeed) * 20 + 10;

      for (let i = 0; i < 5; i++) {
        const y = Math.random() * canvas.height;
        const height = Math.random() * 30 + 5;
        const offset = (Math.random() - 0.5) * glitchAmount;

        const color = glitchColors[Math.floor(Math.random() * glitchColors.length)];
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.1 + Math.random() * 0.2;
        ctx.fillRect(offset, y, canvas.width, height);
      }

      // Center vignette
      if (centerVignette) {
        const gradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          Math.max(canvas.width, canvas.height)
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');

        ctx.globalAlpha = 1;
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.removeChild(canvas);
    };
  }, [glitchColors, glitchSpeed, centerVignette, outerVignette, smooth]);

  return null;
};