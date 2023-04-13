export const vertex = `

precision highp float;

attribute vec3 position;
attribute vec3 worldPosition;
attribute vec3 normal;
attribute vec2 uv;
attribute float scale;

uniform vec2 _Offset;
uniform float _Time;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

varying vec2 vUv;
varying float vScale;

float hash11(float p)
{
    p = fract(p * .1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}


vec2 hash23(vec3 p3)
{
	p3 = fract(p3 * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx+33.33);
    return fract((p3.xx+p3.yz)*p3.zy);
}

vec2 hash22(vec2 p)
{
	vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx+33.33);
    return fract((p3.xx+p3.yz)*p3.zy);

}

float hash13(vec3 p3)
{
	p3  = fract(p3 * .1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
}

#define SPATIALF 9.9
#define TEMPORALF 0.07441
#define AMP 2.0
#define FALLOFF 0.731
#define OCTAVES 4

#define m4 mat4(0.00,  0.80,  0.60, -0.4, -0.80,  0.36, -0.48, -0.5, -0.60, -0.48,  0.64,  0.2, 0.40,  0.30,  0.20,  0.4)

vec3 SinNoise43(vec4 p) {

    p.xyz *= SPATIALF;
    p.w *= TEMPORALF;

    float a = 1.0;
    float f = 1.0;

    vec3 outPut = vec3(0.0, 0.0, 0.0);

    for(int i = 0; i < OCTAVES; i++) {

        // p *= f;
        p = m4 * p.wzxy;
        outPut += sin(p.zwy + p.x * f) * a;
        a *= FALLOFF;
        f /= FALLOFF;

    }

    return outPut;

}

void main() {

    vec3 worldPos = worldPosition;

    vec3 noise = SinNoise43(vec4(worldPos.xyz, _Time)).xyz * AMP;        

    worldPos.xy += _Offset * 0.001 * vec2(1.0, -1.0);
    worldPos.z -= 5.0;

    worldPos += noise;

    vec3 localPos = position * mix(0.1, 1.0, scale);

    float scaleHash = hash11(scale*10000.0);
    vScale = sin(_Time * mix(0.5, 2.0, scaleHash))*0.5+0.5;

    vec4 viewPos = viewMatrix * vec4(worldPos, 1.0);
    viewPos.xy += localPos.xy * 0.2;

    vec4 clipPos = projectionMatrix * viewPos;

    gl_Position = clipPos;
    vUv = uv;
}

`