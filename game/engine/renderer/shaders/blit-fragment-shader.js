const fragmentSourceCode = `#version 300 es
precision mediump float;

in vec2 v_uv;
out vec4 o_color;

uniform sampler2D u_sourceTexture;

void main() {
  o_color = texture(u_sourceTexture, v_uv);
}
`;

export default fragmentSourceCode