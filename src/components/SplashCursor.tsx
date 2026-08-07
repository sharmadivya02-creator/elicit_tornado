'use client';

import React, { useEffect, useRef } from 'react';

interface SplashCursorProps {
  SIM_RESOLUTION?: number;
  DYE_RESOLUTION?: number;
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  COLOR_UPDATE_SPEED?: number;
}

export const SplashCursor: React.FC<SplashCursorProps> = ({
  SIM_RESOLUTION = 128,
  DYE_RESOLUTION = 1440,
  DENSITY_DISSIPATION = 3.5,
  VELOCITY_DISSIPATION = 2,
  PRESSURE = 0.1,
  CURL = 3,
  SPLAT_RADIUS = 0.2,
  SPLAT_FORCE = 6000,
  COLOR_UPDATE_SPEED = 10,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });
    if (!gl) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let mouseDown = false;

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      mouseX = e.clientX;
      mouseY = canvas.height - e.clientY;
    };

    const handleMouseDown = () => {
      mouseDown = true;
    };

    const handleMouseUp = () => {
      mouseDown = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Simple fluid simulation shader setup
    const vertexShader = `#version 300 es
      precision highp float;
      in vec2 uv;
      out vec2 vUv;
      void main() {
        gl_Position = vec4(uv * 2.0 - 1.0, 0.0, 1.0);
        vUv = uv;
      }
    `;

    const fragmentShader = `#version 300 es
      precision highp float;
      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform vec2 uLastMouse;
      uniform float uRadius;
      uniform vec3 uColor;
      in vec2 vUv;
      out vec4 fragColor;
      
      void main() {
        vec2 coord = vUv * vec2(${DYE_RESOLUTION}, ${DYE_RESOLUTION});
        vec2 mouseCoord = uMouse;
        vec2 lastMouseCoord = uLastMouse;
        
        float dist = distance(coord, mouseCoord);
        float influence = exp(-dist * dist / (uRadius * uRadius));
        
        vec4 texColor = texture(uTexture, vUv);
        
        // Add color with dissipation
        vec3 added = uColor * influence * 0.5;
        vec3 result = mix(texColor.rgb * 0.98, added, influence);
        
        fragColor = vec4(result, 1.0);
      }
    `;

    const program = gl.createProgram();
    if (!program) return;

    const vs = gl.createShader(gl.VERTEX_SHADER);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    gl.shaderSource(vs, vertexShader);
    gl.shaderSource(fs, fragmentShader);

    gl.compileShader(vs);
    gl.compileShader(fs);

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'uv');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 8, 0);

    // Color palette for cycling
    const colors = [[0.32, 0.15, 1], [0.49, 1, 0.4], [1, 0.42, 0.42]];
    let colorIndex = 0;

    const render = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), mouseX, mouseY);
      gl.uniform2f(gl.getUniformLocation(program, 'uLastMouse'), lastMouseX, lastMouseY);
      gl.uniform1f(gl.getUniformLocation(program, 'uRadius'), SPLAT_RADIUS * 100);
      
      const color = colors[Math.floor((Date.now() / COLOR_UPDATE_SPEED) % colors.length)];
      gl.uniform3f(gl.getUniformLocation(program, 'uColor'), color[0], color[1], color[2]);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    };

    gl.clearColor(0, 0, 0, 0);
    render();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
    };
  }, [SIM_RESOLUTION, DYE_RESOLUTION, DENSITY_DISSIPATION, VELOCITY_DISSIPATION, PRESSURE, CURL, SPLAT_RADIUS, SPLAT_FORCE, COLOR_UPDATE_SPEED]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};