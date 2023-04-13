export const fragment = `

precision highp float;

uniform sampler2D _Image;
uniform sampler2D _Pattern;
uniform float _Time;

uniform vec2 _ViewplaneSize;
uniform vec2 _Aspect;

varying vec2 vUv;

void main() {
    
    vec2 patternCoord = vUv;
    patternCoord -= 0.5;
    patternCoord *= _Aspect;
    patternCoord += 0.5;
    
    float pattern = texture2D(_Pattern, patternCoord).x;
    
    vec2 imgCoord = vUv;
    imgCoord.y = 1.0-imgCoord.y;
    vec4 col = texture2D(_Image, imgCoord).xyzw;

    gl_FragColor = vec4(col.xyz, col.w*pattern);

}


`;