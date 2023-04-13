export const fragment = `

precision highp float;

uniform vec2 _Resolution;
uniform float _PhaseValues[32];
uniform float _Time;
uniform float _Seed;

varying vec2 vUv;

#define SIZE 5.0
#define RENDERSPEED 10.0
#define TEXTURERES vec2(340.0,620.0)
#define GRIDRESOLUTION vec2(5.0, 5.0)
#define EPS 0.001


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

float hash11(float p)
{
    p = fract(p * .1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

void main() {

    vec2 uv = vUv;
    vec2 coord = floor(uv * GRIDRESOLUTION.x);
    int index = int(coord.x + (GRIDRESOLUTION.x * coord.y));
    float phase = 0.0;
    
    //not elegant...
    if(index == 0) phase = _PhaseValues[0];
    if(index == 1) phase = _PhaseValues[1];
    if(index == 2) phase = _PhaseValues[2];
    if(index == 3) phase = _PhaseValues[3];
    if(index == 4) phase = _PhaseValues[4];

    if(index == 5) phase = _PhaseValues[5];
    if(index == 6) phase = _PhaseValues[6];
    if(index == 7) phase = _PhaseValues[7];
    if(index == 8) phase = _PhaseValues[8];
    if(index == 9) phase = _PhaseValues[9];

    if(index == 10) phase = _PhaseValues[10];
    if(index == 11) phase = _PhaseValues[11];
    if(index == 12) phase = _PhaseValues[12];
    if(index == 13) phase = _PhaseValues[13];
    if(index == 14) phase = _PhaseValues[14];

    if(index == 15) phase = _PhaseValues[15];
    if(index == 16) phase = _PhaseValues[16];
    if(index == 17) phase = _PhaseValues[17];
    if(index == 18) phase = _PhaseValues[18];
    if(index == 19) phase = _PhaseValues[19];

    if(index == 20) phase = _PhaseValues[20];
    if(index == 21) phase = _PhaseValues[21];
    if(index == 22) phase = _PhaseValues[22];
    if(index == 23) phase = _PhaseValues[23];
    if(index == 24) phase = _PhaseValues[24];


    float tileCount = GRIDRESOLUTION.x * GRIDRESOLUTION.y;
    phase = phase / (tileCount);

    float hashGridTileCount = floor(tileCount*0.5); //gives interesting mixes of squares and rectangles

    vec2 grid = floor(uv * hashGridTileCount)/hashGridTileCount;
    float hash = hash12(grid + phase + mix(923.0, 12354.0, _Seed));
    
    float tileReveal = smoothstep(phase, 1.0, _Time*mix(1.0, 2.0, hash));

    gl_FragColor = vec4(vec3(tileReveal),1.0);

}


`;