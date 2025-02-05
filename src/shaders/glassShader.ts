const glassShader = `
#define timeScale 1.0

uniform float uTime;
uniform vec2 uResolution;
uniform float uSoundData;
varying vec2 vUv;

float N11(float n) {
    vec2 v1 = vec2(fract(n * 129.3484), fract(n * 10.2347 + 1.4948));
    vec2 v2 = vec2(49.256, n);
    return fract(dot(v1, v2));
}

vec2 N12(float n) {
    vec2 v1 = vec2(fract(n * 33.24102 + 1.2847), fract(n * 4.70234556 - 2.5856));
    vec2 v2 = vec2(39.3823 + n, n * 3.1938 + 1.4028);
    return vec2(fract(dot(v1, v2)), N11(dot(v1, v2)));
}

vec2 N22(vec2 p) {
    return vec2(N11(4.238 + p.y + p.x * 0.6274), N11(3.4148 * p.y - 8.29 * p.x + 1.39558));
}

float perlin(vec2 p, float scale, float seed) {
    vec2 pS = p * scale;
    float X1 = floor(p.x * scale);
    float X2 = X1 + 1.0;
    float Y1 = floor(p.y * scale);
    float Y2 = Y1 + 1.0;
    vec2 v11 = vec2(X1, Y1);
    vec2 gpUnfaded = pS - v11;
    float xCub = pow(gpUnfaded.x, 3.0);
    float yCub = pow(gpUnfaded.y, 3.0);
    vec2 gp = vec2((6.0 * gpUnfaded.x * gpUnfaded.x - 15.0 * gpUnfaded.x + 10.0) * xCub,
                   (6.0 * gpUnfaded.y * gpUnfaded.y - 15.0 * gpUnfaded.y + 10.0) * yCub);
    vec2 v12 = vec2(X1, Y2);
    vec2 v21 = vec2(X2, Y1);
    vec2 v22 = vec2(X2, Y2);
    vec2 d11 = gp - v11;
    vec2 d12 = gp - v12;
    vec2 d21 = gp - v21;
    vec2 d22 = gp - v22;
    float fact = 1.394 + seed;
    vec2 g11 = (N22(v11 * fact) - 0.5) * 2.0;
    vec2 g12 = (N22(v12 * fact) - 0.5) * 2.0;
    vec2 g21 = (N22(v21 * fact) - 0.5) * 2.0;
    vec2 g22 = (N22(v22 * fact) - 0.5) * 2.0;
    vec2 contribY1 = mix(g11, g21, gp.x);
    vec2 contribY2 = mix(g12, g22, gp.x);
    vec2 contrib = mix(contribY1, contribY2, gp.y);
    float value = dot(d11, contrib) + dot(d12, contrib) - dot(d21, contrib) - dot(d22, contrib);
    return mix(0.0, 1.0, value);
}

vec3 starColor(vec2 p, float id, float radius) {
    vec2 center = N12(id) - 0.5;
    vec3 color = vec3(N11(id), N11(id * 7.2819), N11(id / 2.0));
    vec2 vec = center - p;
    float dist = length(vec);
    float angle = abs(sqrt(abs(vec.x * vec.y))) * 5.0;
    float star = smoothstep(radius * 0.3, radius * 0.25, dist);
    float halo = smoothstep(radius * 1.2, 0.0, dist) * (0.7 + abs(sin(uTime * (20.0 + center.x * 40.0))) * 0.3);
    float scint = smoothstep(1.0, 0.0, angle) * halo * (0.7 + abs(sin(uTime * (10.0 + center.x * 20.0))) * 0.3);
    return star * vec3(sqrt(color)) + (scint + halo) * color;
}

vec3 layerColor(vec2 uv, float layerIndex, float scale) {
    uv = uv * scale;
    float seed = 2.309387 + layerIndex * 1.283374;
    vec2 gv = (fract(uv * 10.0) * 2.0) - 1.0;
    float id = seed * 1.4983 * floor(uv.y * 10.0) + 5.39283 * floor(uv.x * 10.0);
    float radius = mix(0.1, 0.5, N11(id * 3.82918));
    float visible = smoothstep(0.95, 0.96, N11(id * 19.10982));
    vec3 starColor = starColor(gv, id, radius);
    return starColor * visible;
}

vec3 nebula(vec2 uv, float scale, float seed) {
    uv = uv * scale;
    vec3 color = 0.5 + 0.5 * cos(uTime * 0.4 * timeScale - length(uv) + vec3(0, 2, 4));
    float valPerlin = perlin(uv, scale, seed) + 0.6 * perlin(uv, 5.0 * scale, seed) + 0.3 * perlin(uv, 7.0 * scale, seed);
    vec3 colNebul = smoothstep(-1.0, 1.0, valPerlin) * color * 0.12 * (0.2 + 0.2 * length(uv));
    return colNebul;
}

void main() {
    vec2 uv = (gl_FragCoord.xy / uResolution.xy * 2.0) - 1.0;
    uv.x *= uResolution.x / uResolution.y;
    vec3 col = vec3(0.0);
    float time = uTime * timeScale;
    float nbLayers = 20.0;
    float step = 0.5;
    float width = nbLayers * step;
    for (float i = 1.0; i < nbLayers; i++) {
        float posI = mod(width - (time + i), width + 0.5);
        float scale = posI;
        float visible = clamp(2.0 - abs(posI - 2.0), 0.0, 1.0);
        vec3 nebulVal = nebula(uv, scale, i) * 0.7;
        col += visible * (layerColor(uv, i, scale) + nebulVal);
    }
    col *= uSoundData; // Make the color reactive to sound
    col *= 10.5; // Increase brightness
    gl_FragColor = vec4(col, 1.0);
}
`;

export default glassShader;