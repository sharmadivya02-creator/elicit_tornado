export const cardFragmentShader = `
uniform sampler2D uTexture;
uniform vec2 uResolution; 
uniform float uRadius;    

varying vec2 vUv;

// SDF Box formula for perfect GPU border-radius
float roundedBoxSDF(vec2 CenterPosition, vec2 Size, float Radius) {
    return length(max(abs(CenterPosition) - Size + Radius, 0.0)) - Radius;
}

void main() {
    vec2 pos = (vUv - 0.5) * uResolution;
    vec2 extents = (uResolution * 0.5);
    
    // Calculate distance to the SDF rounded edge
    float dist = roundedBoxSDF(pos, extents, uRadius);
    
    // Create a smooth, anti-aliased alpha mask for the outer edge
    float alpha = 1.0 - smoothstep(-1.0, 1.0, dist);
    
    // Discard pixels completely outside our rounded rectangle
    if (alpha <= 0.0) discard;
    
    vec4 texColor = texture2D(uTexture, vUv);
    
    // Neon Glowing Border Effect
    float borderGlow = 1.0 - smoothstep(-8.0, 0.0, dist);
    vec3 neonPink = vec3(1.0, 0.08, 0.58); 
    
    // Mix the image with the glowing edge (glassy effect)
    vec3 finalColor = mix(texColor.rgb * 0.85, neonPink, borderGlow * 0.6);
    float finalAlpha = max(0.15, borderGlow);
    
    gl_FragColor = vec4(finalColor, finalAlpha * alpha);
}
`;