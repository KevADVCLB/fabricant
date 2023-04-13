export const fragment = `

precision highp float;

uniform vec2 _Resolution;
uniform float _PhaseValues[32];
uniform float _Time;

varying vec2 vUv;

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

    vec2 uv = vUv;


    vec2 coord = floor(uv * GRIDRESOLUTION.x);

    float index = coord.x + (GRIDRESOLUTION.x * coord.y);
    float phase = 0.0;
    
    //not elegant...
    for(int i = 0; i < 25; i++) {
    // for(int i = 0; i < 64; i++) {
        if(i == int(index)) {
            phase = _PhaseValues[i];
        }
    }

    float tileCount = GRIDRESOLUTION.x * GRIDRESOLUTION.y;
    float tileCountMinusOne = tileCount - 1.0;
    phase = phase / (tileCount-1.0);
    // phase = 1.0 - phase;

    #ifdef USING_FLOORED_TIME

    vec2 grid = floor(uv * 25.0)/25.0;
    float hash = hash12(grid + phase * 10000.0);

    float renderSpeedFloored = floor(RENDERSPEED); //redundant
    float renderTime = floor((fract(_Time*1.0/renderSpeedFloored)*renderSpeedFloored)+0.5) / RENDERSPEED;
    
    vec2 tileCoord = fract(uv * 5.0);

    float renderPattern = step(phase * mix(1.0, 1.2, hash), renderTime);

    // float renderOrder = step(phase*24.0, mod(_Time, 25.0));

    float animTime = mod(_Time*1.0/renderSpeedFloored, 25.0);
    float renderOrder = step(phase*24.0, animTime);


    renderOrder = renderTime * renderOrder;
    renderOrder += step(phase*24.0 + 1.0, animTime);
    float tileReveal = step(tileCoord.y, clamp(renderOrder*mix(1.0, 1.5, hash), 0.0, 1.0));
    // float tileReveal = smoothstep(0.0, hash, renderOrder);

    // gl_FragColor = vec4(vec3(phase),1.0);
    gl_FragColor = vec4(vec3(vUv, 0.0)*vec3(tileReveal),1.0);

    #else

    float animSpeed = 5.0;

    vec2 grid = floor(uv * tileCount)/tileCount;
    float hash = hash12(grid + phase * 10000.0);

    float renderSpeedFloored = floor(RENDERSPEED);
    float renderTime = floor((fract(_Time*1.0/renderSpeedFloored)*renderSpeedFloored)+0.5) / RENDERSPEED;
    
    vec2 tileCoord = fract(uv * GRIDRESOLUTION.x);

    float renderPattern = step(phase * mix(1.0, 1.2, hash), renderTime);

    // float renderOrder = step(phase*tileCountMinusOne, mod(_Time, tileCount));

    float animTime = mod(_Time*animSpeed, tileCount);

    float renderOrder = step(phase*tileCountMinusOne, animTime);
    renderOrder = fract(_Time*animSpeed) * renderOrder;
    renderOrder += step(phase*tileCountMinusOne + 1.0, animTime);
    // float tileReveal = step(clamp(hash + 0.0, 0.0, 0.9), renderOrder);
    float tileReveal = step(hash, renderOrder);

    gl_FragColor = vec4(vec3(hash),1.0);

    #endif

}


`;