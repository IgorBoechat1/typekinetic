const mirrorShader = `
uniform float uTime;
uniform vec3 uColor;
uniform vec2 uResolution;
uniform sampler2D uTexture;
varying vec3 vPosition;

vec3 spectral_colour(float l) {
  float r = 0.0, g = 0.0, b = 0.0;
  if ((l >= 400.0) && (l < 410.0)) { float t = (l - 400.0) / (410.0 - 400.0); r = +(0.33 * t) - (0.20 * t * t); }
  else if ((l >= 410.0) && (l < 475.0)) { float t = (l - 410.0) / (475.0 - 410.0); r = 0.14 - (0.13 * t * t); }
  else if ((l >= 545.0) && (l < 595.0)) { float t = (l - 545.0) / (595.0 - 545.0); r = +(1.98 * t) - (t * t); }
  else if ((l >= 595.0) && (l < 650.0)) { float t = (l - 595.0) / (650.0 - 595.0); r = 0.98 + (0.06 * t) - (0.40 * t * t); }
  else if ((l >= 650.0) && (l < 700.0)) { float t = (l - 650.0) / (700.0 - 650.0); r = 0.65 - (0.84 * t) + (0.20 * t * t); }
  if ((l >= 415.0) && (l < 475.0)) { float t = (l - 415.0) / (475.0 - 415.0); g = +(0.80 * t * t); }
  else if ((l >= 475.0) && (l < 590.0)) { float t = (l - 475.0) / (590.0 - 475.0); g = 0.8 + (0.76 * t) - (0.80 * t * t); }
  else if ((l >= 585.0) && (l < 639.0)) { float t = (l - 585.0) / (639.0 - 585.0); g = 0.82 - (0.80 * t); }
  if ((l >= 400.0) && (l < 475.0)) { float t = (l - 400.0) / (475.0 - 400.0); b = +(2.20 * t) - (1.50 * t * t); }
  else if ((l >= 475.0) && (l < 560.0)) { float t = (l - 475.0) / (560.0 - 475.0); b = 0.7 - (t) + (0.30 * t * t); }
  return vec3(r, g, b);
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 uv = 1.5 * (2.0 * fragCoord - uResolution) / uResolution.y;
  vec2 p = (2.0 * fragCoord - uResolution) / min(uResolution.x, uResolution.y);
  p *= 1.0; // Reduce the scaling factor for smaller effect

  for (int i = 0; i < 8; i++) {
    vec2 newp = vec2(
      p.y + 0.3 * cos(p.x + uTime) - 0.3 * sin(p.y * cos(uTime * 0.2)), // Reduce the intensity of transformations
      p.x - 0.3 * sin(p.y - uTime) - 0.3 * cos(p.x * sin(uTime * 0.3))  // Reduce the intensity of transformations
    );
    p = newp;
  }

  vec3 color = spectral_colour(p.y * 50.0 + 500.0 + sin(uTime * 0.6));

  // Light effect
  vec3 light_color = vec3(0.9, 0.65, 0.5);
  float light = 0.1 / distance(normalize(uv), uv);
  if (length(uv) < 1.0) {
    light *= 0.1 / distance(normalize(uv), uv);
  }
  vec3 lightEffect = light * light_color;

  // Texture blending
  vec4 textureColor = texture2D(uTexture, uv);
  vec3 finalColor = mix(color, textureColor.rgb, 0.5) + lightEffect;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export default mirrorShader;