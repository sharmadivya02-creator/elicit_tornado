export const vertexShader = `
uniform float uTime;
uniform float uProgress;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vUv = uv;
    vPosition = position;
    
    vec3 pos = position;
    vec3 norm = normal;
    
    float noise = sin(pos.x * 10.0 + uTime * 2.0) * cos(pos.y * 10.0 + uTime * 2.0);
    float displacement = uProgress * (4.0 + noise * 2.0);
    pos += norm * displacement;
    
    float angle = uProgress * 2.0 * pos.z;
    float s = sin(angle);
    float c = cos(angle);
    mat2 rot = mat2(c, -s, s, c);
    pos.xy *= rot;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    gl_PointSize = (4.0 * (1.0 - (uProgress * 0.5))) * (10.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}
`;