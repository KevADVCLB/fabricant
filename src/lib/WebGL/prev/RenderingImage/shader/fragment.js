export const fragment = `

precision highp float;

uniform sampler2D _Image;
uniform sampler2D _Pattern;
uniform vec2 _Resolution;
uniform float _PhaseValues[32];
uniform float _Time;

uniform vec2 _TextureSize;

varying vec2 vUv;
varying float vSpiralIndex;

#define SIZE 5.0
#define RENDERSPEED 10.0
#define TEXTURERES vec2(340.0,620.0)
#define GRIDRESOLUTION vec2(5.0, 5.0)


// #define USING_FLOORED_TIME

//  1 out, 2 in...
float hash12(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p)
{
	vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx+33.33);
    return fract((p3.xx+p3.yz)*p3.zy);

}

vec2 getCoord(float index) {

    float x = mod(index, SIZE) / SIZE;
    float y = floor(index/SIZE) / SIZE;

    return vec2(x, y);

}

vec2 remap(vec2 val, vec2 valMin, vec2 valMax) {

    return clamp((val - valMin) / (valMax - valMin), 0.0, 1.0);

}

vec3 remap(vec3 val, vec3 valMin, vec3 valMax) {

    return clamp((val - valMin) / (valMax - valMin), 0.0, 1.0);

}

void main() {

    // vec2 uv = gl_FragCoord.xy/_Resolution.xy;
    vec2 uv = vUv;

    float aspect = _TextureSize.x/_TextureSize.y;
    
    uv -= 0.5;
    uv *= mix(vec2(1.0, 1.0/aspect), vec2(aspect,1.0), step(_TextureSize.x, _TextureSize.y));
    uv += 0.5;

    vec2 imageCoord = uv;
    vec2 jitter = hash22(gl_FragCoord.xy) * 2.0 - 1.0;
    jitter *= 1.0/_TextureSize;

    // float clarityPhase = floor(((animTime)/tileCount)*tileCount)/tileCount;
    float pattern = texture2D(_Pattern, uv).x;
    
    // jitter *= mix(15.5, 0.0, clarityPhase);

    vec4 col = texture2D(_Image, vUv).xyzw;

    // pattern = smoothstep(0.9, 1.0, pattern);

    // if(pattern <= 0.1) discard;

    // gl_FragColor = vec4(col*smoothstep(0.95, 1.0, pattern));
    gl_FragColor = vec4((col*smoothstep(0.95, 1.0, pattern)));
    // gl_FragColor = vec4(col.xyz, col.w);

}


`;