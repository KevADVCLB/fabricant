export const vertex = `

precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

uniform vec2 _Resolution;
uniform vec2 _ViewPlanePos;
uniform vec2 _ViewplaneSize;

uniform float _RevealPhase;
uniform float _Time;

varying vec2 vUv;

void main() {
    
    vec3 pos = position;
    pos.xy *= _ViewplaneSize;
    
    pos.xy += _ViewPlanePos;
    vec4 clipPos = projectionMatrix * viewMatrix * vec4(pos, 1.0);

    gl_Position = clipPos;

    vUv = uv;

}


`;