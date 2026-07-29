import React, { useEffect, useRef, useState } from 'react';
import { 
  PixelOrange, 
  PixelBlue, 
  PixelAsteroid, 
  PixelAsteroidAlt,
  PixelSpiralGalaxy,
  PixelSpaceStation,
  PixelRocket
} from './PixelArtwork';

interface BackgroundProps {
  activeTab?: string;
}

interface Star {
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
  speedMult: number;
  twinkleOffset?: number;
  twinkleSpeed?: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  color: string;
}

interface QuantumNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseColor: 'cyan' | 'purple' | 'yellow';
  pulseSpeed: number;
  angle: number;
}

export const GlobalCosmicBackground: React.FC<BackgroundProps> = ({ activeTab = 'home' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    isDown: false,
    active: false,
    lastActiveTime: 0
  });

  const [, setDimensions] = useState({ width: 0, height: 0 });

  // Get dynamic colors depending on active tab
  const getThemeColors = () => {
    switch (activeTab) {
      case 'home':
        return {
          primary: 'rgba(0, 240, 255, 0.45)', // Cyan
          secondary: 'rgba(168, 85, 247, 0.45)', // Purple
          accent: 'rgba(250, 204, 21, 0.45)', // Yellow
          gridColor: 'rgba(124, 58, 237, 0.08)'
        };
      case 'about':
        return {
          primary: 'rgba(59, 130, 246, 0.4)', // Blue
          secondary: 'rgba(124, 58, 237, 0.45)', // Violet
          accent: 'rgba(0, 240, 255, 0.35)',
          gridColor: 'rgba(59, 130, 246, 0.06)'
        };
      case 'events':
        return {
          primary: 'rgba(236, 72, 153, 0.45)', // Pink
          secondary: 'rgba(0, 240, 255, 0.45)', // Cyan
          accent: 'rgba(168, 85, 247, 0.4)',
          gridColor: 'rgba(236, 72, 153, 0.07)'
        };
      case 'gallery':
        return {
          primary: 'rgba(59, 130, 246, 0.35)',
          secondary: 'rgba(14, 116, 144, 0.35)',
          accent: 'rgba(168, 85, 247, 0.3)',
          gridColor: 'rgba(14, 116, 144, 0.05)'
        };
      default:
        return {
          primary: 'rgba(168, 85, 247, 0.4)',
          secondary: 'rgba(0, 240, 255, 0.4)',
          accent: 'rgba(250, 204, 21, 0.35)',
          gridColor: 'rgba(124, 58, 237, 0.07)'
        };
    }
  };

  const colors = getThemeColors();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let centerX = width / 2;
    let centerY = height / 2;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;
      setDimensions({ width, height });
    };

    window.addEventListener('resize', handleResize);
    setDimensions({ width, height });

    // Initialize 3D Starfield
    const stars: Star[] = [];
    const numStars = 60;
    const maxDepth = 1000;
    const fov = 200;

    const starColors = [
      '#ffffff',
      '#00f0ff', // cyan
      '#a855f7', // purple
      '#facc15', // yellow star coin
      '#3b82f6'  // space blue
    ];

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * maxDepth,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        size: Math.random() * 1.6 + 0.4,
        speedMult: Math.random() * 0.6 + 0.4,
        twinkleOffset: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.01
      });
    }

    // Initialize Shooting Stars
    const shootingStars: ShootingStar[] = [];

    // Initialize HUD Quantum Nodes (floating constellation particles)
    const nodes: QuantumNode[] = [];
    const numNodes = 8;
    const nodeColorKeys: ('cyan' | 'purple' | 'yellow')[] = ['cyan', 'purple', 'yellow'];

    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 2.5 + 1.2,
        baseColor: nodeColorKeys[Math.floor(Math.random() * nodeColorKeys.length)],
        pulseSpeed: Math.random() * 0.02 + 0.01,
        angle: Math.random() * Math.PI * 2
      });
    }

    // Global Interactive Listeners
    const handleGlobalMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
      mouseRef.current.lastActiveTime = Date.now();
    };

    const handleGlobalMouseDown = () => {
      mouseRef.current.isDown = true;
    };

    const handleGlobalMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mousedown', handleGlobalMouseDown);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    // Constant ambient drift speed (no sudden warp speed lines on click)
    const normalSpeed = 1.2;

    // Render loop
    const render = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Damp mouse target positions smoothly for fluid parallax look
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Deactivate mouse if motionless for more than 4 seconds
      if (Date.now() - mouseRef.current.lastActiveTime > 4000) {
        mouseRef.current.active = false;
      }

      // Parallax shifts the space perspective camera based on mouse coordinates
      const parallaxX = mouseRef.current.active ? (mouseRef.current.x - centerX) * 0.15 : 0;
      const parallaxY = mouseRef.current.active ? (mouseRef.current.y - centerY) * 0.15 : 0;

      // 1. Draw Twinkling stars (3D Perspective Projection as subtle floating points)
      stars.forEach((star) => {
        // Move star closer at smooth speed
        star.z -= normalSpeed * star.speedMult;

        // Reset if star passes viewer
        if (star.z <= 0) {
          star.z = maxDepth;
          star.x = (Math.random() - 0.5) * 2000;
          star.y = (Math.random() - 0.5) * 2000;
        }

        // Calculate 3D projection on screen
        const px = (star.x - parallaxX) * (fov / star.z) + centerX;
        const py = (star.y - parallaxY) * (fov / star.z) + centerY;

        // Check boundary safety before drawing
        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const depthAlpha = (1 - star.z / maxDepth);
          
          // Twinkling offset Calculation
          const twinkle = star.twinkleOffset && star.twinkleSpeed 
            ? Math.sin(star.twinkleOffset + Date.now() * star.twinkleSpeed) * 0.15 + 0.85
            : 1.0;

          // Draw floating star points with soft halos and subtle twinkling (no streaking lines)
          ctx.beginPath();
          ctx.fillStyle = star.color;
          ctx.arc(px, py, star.size * (1 + depthAlpha * 0.8) * twinkle, 0, Math.PI * 2);
          ctx.fill();

          // Tiny pulse flare for bright stars
          if (star.size > 1.7 && twinkle > 0.9 && Math.random() > 0.985) {
            ctx.fillStyle = `rgba(255,255,255,${0.4 * twinkle})`;
            ctx.fillRect(px - 3, py, 7, 1);
            ctx.fillRect(px, py - 3, 1, 7);
          }
        }
      });

      // Spawn random shooting stars
      if (Math.random() > 0.985 && shootingStars.length < 5) {
        shootingStars.push({
          x: Math.random() * width * 0.9,
          y: Math.random() * height * 0.5,
          length: Math.random() * 90 + 50,
          speed: Math.random() * 14 + 10,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.15,
          opacity: Math.random() * 0.75 + 0.25,
          color: ['#00f0ff', '#ffffff', '#a855f7', '#ec4899'][Math.floor(Math.random() * 4)]
        });
      }

      // Render and update shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity -= 0.016;

        if (ss.opacity <= 0 || ss.x > width || ss.y > height) {
          shootingStars.splice(i, 1);
        } else {
          ctx.beginPath();
          const grad = ctx.createLinearGradient(
            ss.x - Math.cos(ss.angle) * ss.length,
            ss.y - Math.sin(ss.angle) * ss.length,
            ss.x,
            ss.y
          );
          
          let rgb = '0, 240, 255';
          if (ss.color === '#ffffff') rgb = '255, 255, 255';
          else if (ss.color === '#a855f7') rgb = '168, 85, 247';
          else if (ss.color === '#ec4899') rgb = '236, 72, 153';

          grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          grad.addColorStop(0.7, `rgba(${rgb}, ${ss.opacity * 0.4})`);
          grad.addColorStop(1, `rgba(${rgb}, ${ss.opacity})`);
          
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.0;
          ctx.moveTo(ss.x - Math.cos(ss.angle) * ss.length, ss.y - Math.sin(ss.angle) * ss.length);
          ctx.lineTo(ss.x, ss.y);
          ctx.stroke();

          // Sparkle tip head
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${ss.opacity})`;
          ctx.arc(ss.x, ss.y, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Draw Interactive Constellation Quantum Nodes
      nodes.forEach((node) => {
        node.angle += node.pulseSpeed;
        
        // Gentle perpetual drift
        node.x += node.vx;
        node.y += node.vy;

        // Bounce back nicely from boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Interactive mouse interaction: soft orbital attraction
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - node.x;
          const dy = mouseRef.current.y - node.y;
          const dist = Math.hypot(dx, dy);
          
          if (dist < 180) {
            const force = (180 - dist) / 180;
            node.x += (dx / dist) * force * 0.4;
            node.y += (dy / dist) * force * 0.4;
          }
        }

        // Draw node
        const pulseSize = node.size + Math.sin(node.angle) * 0.5;
        let nodeColor = 'rgba(0, 240, 255, 0.7)'; // Default cyan
        
        if (node.baseColor === 'purple') {
          nodeColor = 'rgba(168, 85, 247, 0.7)';
        } else if (node.baseColor === 'yellow') {
          nodeColor = 'rgba(250, 204, 21, 0.7)';
        }

        ctx.beginPath();
        ctx.fillStyle = nodeColor;
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();

        // High fidelity cyber grid constellation links between nodes
        nodes.forEach((otherNode) => {
          if (node === otherNode) return;
          const distance = Math.hypot(node.x - otherNode.x, node.y - otherNode.y);
          
          if (distance < 50) {
            ctx.beginPath();
            ctx.strokeStyle = node.baseColor === 'purple' ? colors.secondary : colors.primary;
            ctx.lineWidth = 0.5;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
          }
        });
      });

      // 3. Subtle micro cursor tracking indicator if mouse is active
      if (mouseRef.current.active) {
        ctx.beginPath();
        const trackingRingRadius = 12 + Math.sin(Date.now() * 0.006) * 2;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
        ctx.lineWidth = 1.0;
        ctx.arc(mouseRef.current.x, mouseRef.current.y, trackingRingRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mousedown', handleGlobalMouseDown);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTab, colors.primary, colors.secondary]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-black">
      
      {/* 1. Interactive high-performance Canvas Layer */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0" 
      />

      {/* 2. Cybernetic grid overlay - Opacity responds to pages for clean readability */}
      <div 
        className="absolute inset-0 retro-grid-bg transition-opacity duration-500 pointer-events-none z-10" 
        style={{ 
          opacity: activeTab === 'gallery' ? 0.08 : activeTab === 'about' ? 0.12 : 0.22,
          backgroundImage: `
            linear-gradient(to right, ${colors.gridColor} 1.2px, transparent 1.2px),
            linear-gradient(to bottom, ${colors.gridColor} 1.2px, transparent 1.2px)
          `
        }} 
      />

      {/* 3. Retained Pixel-Art Retro Accent Items */}
      
      {/* ----------------- ABOUT TAB RETRO SCENE ACCENTS ----------------- */}
      {activeTab === 'about' && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Distant tiny asteroids floating */}
          <div className="absolute left-[8%] top-[15%] w-10 h-10 opacity-35 animate-float-slow">
            <PixelAsteroid />
          </div>
          <div className="absolute right-[10%] top-[12%] w-8 h-8 opacity-40 animate-float-medium">
            <PixelAsteroidAlt />
          </div>

          {/* Small flying cruising ship */}
          <div className="absolute right-[22%] top-[15%] w-16 h-16 opacity-75 animate-float-slow">
            <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_0_12px_rgba(59,130,246,0.5)] transform rotate-12">
              <g stroke="#000" strokeWidth="1.5" strokeLinejoin="miter">
                <path d="M 12,48 L 4,56 L 8,46 Z" fill="#3b82f6" />
                <path d="M 14,40 L 38,20 L 52,24 L 46,38 L 22,42 Z" fill="#ffffff" />
                <path d="M 40,22 L 58,10 C 56,18 48,26 40,22 Z" fill="#60a5fa" />
                <circle cx="28" cy="30" r="2.5" fill="#38bdf8" />
              </g>
            </svg>
          </div>

          {/* Large curved planet horizon along the bottom of the page */}
          <div className="absolute bottom-[-150px] left-[-10%] right-[-10%] h-[350px] bg-gradient-to-t from-[#0e163d] via-[#1034a6]/40 to-transparent border-t-2 border-cyan-500/40 rounded-[100%_100%_0_0] opacity-80 shadow-[0_-15px_40px_rgba(6,182,212,0.25)]" />
        </div>
      )}

      {/* ----------------- GALLERY TAB RETRO SCENE ACCENTS ----------------- */}
      {activeTab === 'gallery' && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Swirling Spiral Galaxy in the top-right corner */}
          <div className="absolute top-[8%] right-[5%] w-32 h-32 lg:w-48 lg:h-48 opacity-80 transition-all duration-500">
            <PixelSpiralGalaxy className="w-full h-full" />
          </div>

          {/* Soft background blue constellation lines details */}
          <div className="absolute inset-0 opacity-15">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <line x1="20%" y1="30%" x2="40%" y2="50%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40%" y1="50%" x2="60%" y2="25%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="60%" y1="25%" x2="80%" y2="45%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40%" y1="50%" x2="55%" y2="75%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="55%" y1="75%" x2="72%" y2="85%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
            </svg>
          </div>
        </div>
      )}

      {/* ----------------- HOME TAB RETRO SCENE ACCENTS ----------------- */}
      {activeTab === 'home' && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Floating colorful planet in the top-left */}
          <div className="absolute left-[5%] sm:left-[8%] top-[12%] w-14 h-14 sm:w-18 sm:h-18 opacity-50 animate-float-slow">
            <PixelOrange />
          </div>

          {/* Floating water planet in the bottom-right */}
          <div className="absolute right-[4%] sm:right-[6%] bottom-[15%] w-16 h-16 sm:w-20 sm:h-20 opacity-40 animate-float-medium">
            <PixelBlue />
          </div>

          {/* Drifting asteroid 1 */}
          <div className="absolute left-[3%] bottom-[32%] w-10 h-10 opacity-35 animate-float-slow">
            <PixelAsteroid />
          </div>

          {/* Drifting asteroid 2 */}
          <div className="absolute right-[12%] top-[10%] w-8 h-8 opacity-30 animate-float-fast">
            <PixelAsteroidAlt />
          </div>

          {/* Faraway drifting space station */}
          <div className="absolute left-[16%] bottom-[12%] w-20 h-20 opacity-35 animate-float-slow scale-75">
            <PixelSpaceStation />
          </div>

          {/* A cool cruising retro rocket on the top right */}
          <div className="absolute right-[8%] sm:right-[15%] top-[18%] w-14 h-14 opacity-55 animate-float-medium rotate-45 scale-90">
            <PixelRocket isLaunching={false} />
          </div>
        </div>
      )}
    </div>
  );
};
