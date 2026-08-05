export const fragmentShader = `
uniform float uTime;
varying float vSeed;

void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;

    vec3 gold = vec3(1.0, 0.82, 0.35);

    float falloff = 1.0 - smoothstep(0.0, 0.5, dist);
    float twinkle = 0.6 + 0.4 * sin(uTime * 2.0 + vSeed * 50.0);

    float alpha = falloff * twinkle * 0.7;

    gl_FragColor = vec4(gold, alpha);
}
`;