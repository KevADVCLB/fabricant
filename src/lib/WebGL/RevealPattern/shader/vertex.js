export const vertex = `

precision highp float;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;

void main() {
    
    vec3 pos = position;

    gl_Position = vec4(pos, 1.0);

    vUv = uv;
}


`;