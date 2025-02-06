const linesShader = `
varying vec2 vUv;
varying vec3 vPos;

uniform float uTime;
uniform vec3 uColor;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float uSoundData;

const vec4 col_a = vec4(224.0 / 255.0, 0.0, 61.0 / 255.0, 1.0);
const vec4 col_b = vec4(0.0, 41.0 / 255.0, 136.0 / 255.0, 1.0);

vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}

float plot(float edge, float val, float t) {
    return step(edge, val) - step(edge + t, val);
}

float smoothplot(float edge, float val, float t, float s) {
    return smoothstep(edge - t - s, edge - t, val) - smoothstep(edge + t, edge + t + s, val);
}

void main() {
    vec2 R = uResolution.xy;
    vec2 U = vUv;
    vec2 G = R / 8.0;
    vec2 I = round(U * G) / G;
    vec2 V = 2.0 * U - 1.0;
    V *= V;

    G = G * (U - I) + 0.5;

    vec4 O = vec4(0.0);
    vec4 P = texture2D(uTexture, vec2(U.x, I.y));  // horizontal RGB profiles
    O = mix(O, vec4(1.0), smoothstep(1.0, 0.0, abs(G.y - length(P.rgb) / sqrt(3.0)) / fwidth(G.y)));

    P = texture2D(uTexture, vec2(I.x, U.y));       // vertical RGB profiles
    O = mix(O, vec4(1.0), smoothstep(1.0, 0.0, abs(G.x - length(P.rgb) / sqrt(3.0)) / fwidth(G.x)));

    O = sqrt(O);  // to sRGB

    // Apply sound data to the color
    vec3 soundColor = mix(vec3(0.0), uColor, uSoundData);
    O.rgb *= soundColor;

    gl_FragColor = O;
}
`;

export default linesShader;