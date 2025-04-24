varying vec2 vUv;
uniform float brightness;
uniform float contrast;
uniform float hue;
uniform float saturation;
uniform sampler2D u_texture;
void main() {
    vec4 texColor = texture2D(u_texture, vUv);
    texColor.rgb = vec3(1.0) - texColor.rgb;
    texColor.rgb = mix(vec3(0.0), texColor.rgb, brightness);
    texColor.rgb = mix(vec3(0.5), texColor.rgb, contrast);
    float angle = hue * 3.14159265;
    float s = sin(angle), c = cos(angle);
    vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;
    float len = length(texColor.rgb);
    texColor.rgb = vec3(dot(texColor.rgb, weights.xyz), dot(texColor.rgb, weights.zxy), dot(texColor.rgb, weights.yzx));
    float average = (texColor.r + texColor.g + texColor.b) / 3.0;
    if(saturation > 0.0) {
        texColor.rgb += (average - texColor.rgb) * (1.0 - 1.0 / (1.001 - saturation));
    } else {
        texColor.rgb += (average - texColor.rgb) * (-saturation);
    }
    texColor.rgb = texColor.rgb * 0.6 + vec3(0.12 * 2.0, 0.16 * 2.0, 0.2 * 2.0);
    gl_FragColor = texColor;
}