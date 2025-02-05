const fragmentShader = `
varying vec2 vUv;
varying vec3 vPos;

uniform float uTime;
uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uSoundData;

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);

  float d = -uTime * 0.5 * uSoundData;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSoundData;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5);

  // Apply the color uniform
  col *= uColor;

  gl_FragColor = vec4(col, 1.0);
}
`;

export default fragmentShader;