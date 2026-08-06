// src/shaders/card/fragment.tsx
export const cardFragmentShader = `
uniform sampler2D uTexture;
uniform vec2 uResolution; 
uniform float uRadius;    

varying vec2 vUv;

float roundedBoxSDF(vec2 CenterPosition, vec2 Size, float Radius) {
    return length(max(abs(CenterPosition) - Size + Radius, 0.0)) - Radius;
}

void main() {
    vec2 pos = (vUv - 0.5) * uResolution;
    vec2 extents = (uResolution * 0.5);
    
    float dist = roundedBoxSDF(pos, extents, uRadius);
    float alpha = 1.0 - smoothstep(-1.0, 1.0, dist);
    
    if (alpha <= 0.0) discard;
    
    vec4 texColor = texture2D(uTexture, vUv);

    // Glassy, cinematic look with subtle glow
    float borderGlow = smoothstep(-8.0, 0.0, dist);
    vec3 subtleWhite = vec3(0.9, 0.9, 0.95);
    vec3 finalColor = mix(texColor.rgb, subtleWhite, borderGlow * 0.15);
    
    // Subtle vignette effect
    float vignette = 1.0 - length((vUv - 0.5) * 1.2);
    finalColor *= (0.85 + 0.15 * vignette);
    
    gl_FragColor = vec4(finalColor, alpha);
}
`;