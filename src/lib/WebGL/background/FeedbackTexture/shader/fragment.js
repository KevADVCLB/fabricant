export const fragment = `

precision highp float;

uniform sampler2D _PrevFrame;
uniform sampler2D _ColorPass;

uniform float _SpatialF;
uniform float _TemporalF;
uniform float _FallOff;
uniform float _Amp;
uniform float _FeedbackAmpK;

uniform vec2 _TextureOffset;

uniform float _Time;

varying vec2 vUv;

#define m3 mat3(-0.73736, 0.45628, 0.49808, 0, -0.73736, 0.67549, 0.67549, 0.49808, 0.54371)

// #define SPATIALF 7.53
// #define SPATIALF 3.83
#define SPATIALF 4.35234
#define TEMPORALF 0.31441
#define TEXELSIZE 0.00390625
#define AMP TEXELSIZE*1.0
#define FALLOFF 0.9351
#define TEXTUREOFFSET_SCALE 0.01
#define TAU 6.2831
#define OCTAVES 3

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
        
        
        f /= FALLOFF;
        a *= FALLOFF;
    }

    return noise;
}

float hash12(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

void main() {

    vec2 uv = vUv;
    
    // vec3 noise = sinNoise33(vec3(vUv*TAU, _Time));        
    // vec3 noise = sinNoise33(vec3(((vUv)*2.0-1.0)*TAU, _Time));        
    vec3 noise = sinNoise33(vec3(2.0*vUv-1.0, _Time));        
    // vec3 noise = sinNoise33(vec3(vUv, _Time));        
    vec3 col = texture2D(_ColorPass, vUv).xyz;

    float noiseAmp = AMP * _FeedbackAmpK;
    vec2 noiseOffset = noise.xy * noiseAmp*1.5;
    vec2 radialOffset = (0.5-uv)*noiseAmp*2.5;
         
    vec3 prevFrame = texture2D(_PrevFrame, uv + noiseOffset).xyz;

    // vec3 outPut = mix(col, prevFrame, mix(0.915, 0.983, _FeedbackAmpK));
    vec3 outPut = mix(col, prevFrame, 0.933);
    gl_FragColor = vec4(outPut, 1.0);

}

`;