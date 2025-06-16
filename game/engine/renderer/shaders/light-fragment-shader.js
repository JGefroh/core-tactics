const fragmentSourceCode = `#version 300 es
  precision mediump float;

  in vec4 v_color;
  in vec2 v_localPosition;
  in vec2 v_instanceScale;
  flat in int v_instanceShape;

  out vec4 o_color;

 vec4 renderCircle(vec4 baseColor) {
  float dist = length(v_localPosition) * 1.5;
  float edge = 0.1;
  float blur = 0.55;

  // Raw radial gradient
  float gradient = 1.0 - smoothstep(edge - blur, edge + blur, dist);
  gradient = pow(gradient, 0.5);

  // ✅ Clamp gradient to avoid exceeding 1.0 when blending
  gradient = clamp(gradient, 0.0, 1.0);

  // ✅ Only write to alpha (clean mask)
  return vec4(0.0, 0.0, 0.0, gradient);
}

  vec4 renderRectangle(vec4 baseColor) {
    return baseColor;
  }

  void main() {
    vec4 baseColor;
    baseColor = v_color;

    if (v_instanceShape == 1) {
      o_color = renderCircle(baseColor);
    } else {
      o_color = renderRectangle(baseColor);
    }
  }`;

export default fragmentSourceCode