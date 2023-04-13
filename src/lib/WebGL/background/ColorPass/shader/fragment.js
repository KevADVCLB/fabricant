export const fragment = `

precision highp float;

uniform sampler2D _Gradient;
uniform sampler2D _Feedback;


uniform float _Time;

varying vec2 vUv;
varying float vSection;
varying float vPhase;

vec3 hash32(vec2 p)
{
	vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    return fract((p3.xxy+p3.yzz)*p3.zyx);
}

void main() {
    
    vec2 uv = vUv;
    vec2 c = 0.5 - uv;
    

    float gradientRow = (floor(vSection * 4.0) + 0.5) / 5.0;
    
    float colPhase = vPhase;
    vec3 col = texture2D(_Gradient, vec2(colPhase, gradientRow)).xyz;

    vec3 hash1 = hash32(gl_FragCoord.xy+fract(_Time)*1387.0);
    vec3 hash2 = hash32(gl_FragCoord.yx+fract(_Time)*1721.0);
    vec3 dither = ((hash1) + (hash2-1.0)) / 255.0;
    gl_FragColor = vec4(vec3(col*0.5) + dither, 1.0);

}


`;