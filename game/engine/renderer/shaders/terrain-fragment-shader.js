const fragmentSourceCode = `#version 300 es
precision mediump float;

in vec4 v_color;
in vec2 v_localPosition;
in float v_borderSize;
in vec4 v_borderColor;
in vec2 v_instanceScale;
in vec2 v_texCoord;
in vec2 v_rawTexCoord;
in vec2 v_worldPosition;
flat in int v_instanceShape;
flat in float v_instanceTextureImageStyle;
flat in vec4 v_instanceTextureUvBounds;

uniform sampler2D u_texture0;

out vec4 o_color;

void main() {
  vec4 baseColor = v_color;
  bool hasTexture = any(greaterThan(v_texCoord, vec2(0.001)));

  if (hasTexture) {
    vec4 texColor;

    if (v_instanceTextureImageStyle > 0.0) {
      // Tiled sampling using inferred tile size
      vec2 tileSize = vec2(v_instanceTextureImageStyle); // uniform tile size
      vec2 tiledUV = fract(v_worldPosition / tileSize);
      vec2 regionMin = v_instanceTextureUvBounds.xy;
      vec2 regionMax = v_instanceTextureUvBounds.zw;
      vec2 regionSize = regionMax - regionMin;
      vec2 atlasUV = regionMin + tiledUV * regionSize;
      texColor = texture(u_texture0, atlasUV);
    } else {
      texColor = texture(u_texture0, v_texCoord);
    }

    bool isWhite = all(equal(texColor, vec4(1.0)));
    baseColor = isWhite ? v_color : texColor;
  }

  // Compute distance to edge
  float edgeDist;
  if (v_instanceShape == 1) {
    float dist = length(v_localPosition);
    edgeDist = 0.5 - dist;
  } else {
    vec2 uv = v_localPosition + vec2(0.5);
    vec2 edge = min(uv, 1.0 - uv);
    edgeDist = min(edge.x, edge.y);
  }

  // Noise-based irregular alpha mask
  float noise = fract(sin(dot(v_localPosition * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
  float softness = 0.0; // how wide the edge blur is
  float mask = smoothstep(0.0, softness, edgeDist);
  mask *= step(noise, mask); // discard fragments irregularly

  baseColor.a *= mask;
  baseColor.rgb *= baseColor.a;

  if (baseColor.a < 0.01) {
    discard;
  }

  o_color = baseColor;
}
`;

export default fragmentSourceCode;