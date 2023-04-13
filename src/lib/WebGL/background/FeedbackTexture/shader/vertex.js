export const vertex = `

precision highp float;

attribute vec2 position;
attribute vec2 uv;

varying vec2 vUv;

void main() {

    gl_Position = vec4(position, 0.0, 1.0);
    vUv = uv;

}

`;


