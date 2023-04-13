export const fragment = `

precision highp float;

varying vec2 vUv;
varying float vScale;

void main() {

    vec2 uv = vUv;
    vec2 c = 0.5 - vUv;
    float d = dot(c, c);

    float phase = smoothstep(1.0, 0.0, d*5.0);
    phase = phase;

    gl_FragColor = vec4(phase * 0.23 * vScale);

}

`