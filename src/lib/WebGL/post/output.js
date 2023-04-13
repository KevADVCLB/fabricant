export const output = `

precision highp float;

uniform sampler2D tMap;
uniform sampler2D _Image;
uniform sampler2D _BlurPass;
uniform float _Time;
uniform float _BlurPhase;

varying vec2 vUv;

float hash12(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec3 hash32(vec2 p)
{
	vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    return fract((p3.xxy+p3.yzz)*p3.zyx);
}

void main() {

    vec3 col = texture2D(_BlurPass, vUv).xyz;
    // vec3 regularPass = texture2D(_Image, vUv).xyz;

    vec3 hash1 = hash32(gl_FragCoord.xy+fract(_Time)*1300.0);
    vec3 hash2 = hash32(gl_FragCoord.yx+fract(_Time+0.3123)*1300.0);
    vec3 dither = ((hash1) + (hash2-1.0)) / 255.0;

    // vec3 outPut = mix(regularPass, col, 1.0);

    gl_FragColor = vec4(col, 1.0);

}


`