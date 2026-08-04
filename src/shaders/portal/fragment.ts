export const fragmentShader = `
uniform float uProgress;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;

    // 1. Replaced blinding neon colors with deep, subtle space tones
    vec3 deepPurple = vec3(0.10, 0.05, 0.20);
    vec3 softBlue = vec3(0.05, 0.10, 0.25);
    
    float colorMix = smoothstep(-1.0, 1.0, vPosition.y) + uProgress;
    vec3 finalColor = mix(deepPurple, softBlue, clamp(colorMix, 0.0, 1.0));
    
    // 2. Drastically reduced glow from 1.3 to 0.3
    float glow = 0.3; 
    
    // 3. Force early fade out! Particles will now disperse by 20% scroll progress
    // This leaves the screen clear for the cards for the next ~4 scrolls.
    float alpha = (1.0 - smoothstep(0.0, 0.2, uProgress)) * 0.4;

    gl_FragColor = vec4(finalColor * glow, alpha);
}
`;