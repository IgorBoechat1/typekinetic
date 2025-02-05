const vertexShader = `
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vNormal;

uniform float uTime;
uniform float uDisplacementIntensity;
uniform float uSoundData;

void main() {
  vUv = uv;
  vPos = position;
  vNormal = normal;

  vec3 newPosition = position;
  newPosition.z += sin(position.x * 3.0 + uTime * 2.0) * uDisplacementIntensity * uSoundData;
  newPosition.z += sin(position.y * 2.0 + uTime * 3.0) * uDisplacementIntensity * uSoundData;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

export default vertexShader;