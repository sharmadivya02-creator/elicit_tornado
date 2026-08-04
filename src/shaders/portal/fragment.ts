export const fragmentShader = `
uniform float uProgress;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;

    vec3 neonPurple = vec3(0.54, 0.17, 0.89);
    vec3 cyanAccent = vec3(0.0, 1.0, 1.0);
    
    float colorMix = smoothstep(-1.0, 1.0, vPosition.y) + uProgress;
    vec3 finalColor = mix(neonPurple, cyanAccent, clamp(colorMix, 0.0, 1.0));
    
    float glow = 3.0; 
    float alpha = 1.0 - smoothstep(0.5, 1.0, uProgress);

    gl_FragColor = vec4(finalColor * glow, alpha);
}
`;