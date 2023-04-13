export const vertex = `

precision highp float;

attribute vec3 position;
attribute vec2 uv;
attribute float spiralIndex;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float _PhaseValues[32];

uniform vec2 _Resolution;
uniform vec2 _TextureSize;

varying vec2 vUv;
varying float vSpiralIndex;

void main() {
    
    vec3 pos = position;

    gl_Position = vec4(pos, 1.0);

    vUv = uv;
    vSpiralIndex = spiralIndex;

}


`;