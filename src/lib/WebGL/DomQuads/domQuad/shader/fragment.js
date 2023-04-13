export const fragment = `

precision highp float;

uniform sampler2D _Image;
uniform sampler2D _Pattern;

uniform float _Time;
uniform vec2 _Aspect;

varying vec2 vUv;

void main() {
    
    vec2 patternCoord = vUv;
    patternCoord -= 0.5;
    patternCoord *= _Aspect;
    patternCoord += 0.5;
    
    float pattern = texture2D(_Pattern, patternCoord).x;

    vec2 uv = vUv;

    vec4 col = texture2D(_Image, uv).xyzw;
    float patternPhase = smoothstep(0.9, 0.93, pattern);

    gl_FragColor = vec4(col.xyz, col.w*pattern);

}


`;