export const vertex = `

precision highp float;

attribute vec3 position;
attribute float worldPositionIndex;
attribute vec3 colorParams;
attribute vec2 uv;

uniform vec2 _AnchorPoints[5];
uniform vec2 _ViewplaneSize;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform vec2 _Resolution;
uniform vec2 _Aspect;

uniform sampler2D _FlowMap;

uniform float _Time;

varying vec2 vUv;
varying float vSection;
varying float vPhase;

#define SECTION_COUNT 5.0
#define FLOW_AMP 0.3

vec2 hash22(vec2 p)
{
	vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx+33.33);
    return fract((p3.xx+p3.yz)*p3.zy);

}

#define m3 mat3(-0.73736, 0.45628, 0.49808, 0, -0.73736, 0.67549, 0.67549, 0.49808, 0.54371)
#define m4 (0.00,  0.80,  0.60, -0.4, -0.80,  0.36, -0.48, -0.5, -0.60, -0.48,  0.64,  0.2, 0.40,  0.30,  0.20,  0.4)


#define SPATIALF 3.31
#define TEMPORALF 0.21441
#define TEXELSIZE 0.00390625
#define AMP TEXELSIZE*1.0
#define FALLOFF 1.0
#define TEXTUREOFFSET_SCALE 0.01
#define TAU 6.2831
#define OCTAVES 4

vec3 sinNoise33(vec3 st) {

    st.xy *= SPATIALF;
    st.z *= TEMPORALF;
    vec3 noise = vec3(0.0,0.0,0.0);
    float a = 1.0;
    float f = 1.0;

    for(int i = 0; i < OCTAVES; i++) {
        
      // st *= f;
        st = m3 * st;
        noise += sin(st.yzx*f)*a;
        st += noise;

        // noise += sin(st.yzx);
        // st += noise*1.5;
        
        
        f /= FALLOFF;
        a *= FALLOFF;
    }

    return noise;
}

vec3 hash32(vec2 p)
{
	vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    return fract((p3.xxy+p3.yzz)*p3.zyx);
}

mat2 rotate2D(float angle) {
    return mat2(
        cos(angle), -sin(angle),
        sin(angle), cos(angle)
    );
}

void main() {
    
    vec3 localPos = position;

    localPos.xy = rotate2D(TAU*0.125) * localPos.xy;
    
    vec3 noise = sinNoise33(vec3(localPos.xy, _Time + colorParams.y));
    localPos += noise*0.25;

    vPhase = (noise.x+noise.y+noise.z)*0.05+0.57;
    vPhase = vPhase*vPhase;

    vec2 mapPos = _AnchorPoints[int(worldPositionIndex)];

    vec4 viewPos = viewMatrix * vec4(mapPos, 0.0, 1.0);
    viewPos.xy += localPos.xy * _ViewplaneSize * 2.5 * _Aspect;
    //viewPos.xy += localPos.xy * _ViewplaneSize * 0.95;

    vec4 clipPos = projectionMatrix * viewPos;

    gl_Position = clipPos;

    float section = colorParams.x/(SECTION_COUNT - 1.0);
    
    vSection = section;
    vUv = uv;

}


`;