const shaderSourceCode = `#version 300 es
layout(location = 0) in vec2 a_position;

out vec2 v_uv;
out vec4 v_color;

uniform vec4 u_color;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  v_color = u_color;
  gl_Position = vec4(a_position, 0.0, 1.0);
}

`;
export default shaderSourceCode