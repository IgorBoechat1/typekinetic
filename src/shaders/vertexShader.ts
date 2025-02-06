const vertexShader = `
uniform float u_time;
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vPos = position;
  vNormal = normal;

  vec3 newPosition = position;
  newPosition.x += sin(position.y * 5.0 + u_time) * 0.1;
  newPosition.y += cos(position.x * 5.0 + u_time) * 0.1;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

export default vertexShader;