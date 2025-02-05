const gradientShader = `
varying vec2 vUv;

void main() {
  vec3 color = mix(vec3(0.0), vec3(1.0), vUv.y);
  gl_FragColor = vec4(color, 1.0);
}
`;

export default gradientShader;