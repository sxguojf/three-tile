varying vec2 vUv;
void main() {
    vUv = uv;
    vec4 finalPosition = vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * finalPosition;
}