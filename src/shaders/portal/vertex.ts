export const vertexShader = `
uniform float uTime;
attribute float aSeed;

varying float vSeed;

void main() {
    vSeed = aSeed;

vec3 pos = position;

    float spinSpeed = 0.15 + aSeed * 0.1;
    float angle = uTime * spinSpeed;
    float s = sin(angle);
    float c = cos(angle);
    float rx = pos.x * c - pos.z * s;
    float rz = pos.x * s + pos.z * c;
    pos.x = rx;
    pos.z = rz;

    pos.y += sin(uTime * 0.6 + aSeed * 20.0) * 0.15;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    gl_PointSize = (1.6 + aSeed * 1.4) * (60.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}
`;