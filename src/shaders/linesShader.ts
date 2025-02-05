const linesShader = `
varying vec2 vUv;
varying vec3 vPos;

uniform float uTime;
uniform vec3 uColor;

void main() {
  float lines = step(0.5, fract(vUv.x * 10.0)) * step(0.5, fract(vUv.y * 10.0));
  vec3 color = mix(vec3(0.0), uColor, lines);
  gl_FragColor = vec4(color, 1.0);
}
`;

export default linesShader;