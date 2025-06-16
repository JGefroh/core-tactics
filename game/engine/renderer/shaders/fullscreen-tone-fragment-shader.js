const fragmentSourceCode = `#version 300 es
precision mediump float;

in vec4 v_color;
in vec2 v_uv;
out vec4 o_color;

uniform sampler2D u_sourceTexture;

void main() {
  float raw = texture(u_sourceTexture, v_uv).a;
float mask = min(max(raw, 0.0), 1.0); // 🚫 No room for guesswork
  float toneAlpha = mix(0.4, 1.0, 1.0 - pow(mask, 1.5));
  vec3 toneColor = v_color.rgb * toneAlpha;
  o_color = vec4(toneColor, toneAlpha * v_color.a * 1.12);
}
`;

export default fragmentSourceCode