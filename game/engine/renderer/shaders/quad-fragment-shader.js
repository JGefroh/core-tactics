const fragmentSourceCode = `#version 300 es
precision mediump float;

in vec4 v_color;
in vec2 v_localPosition;
in float v_borderSize;
in vec4 v_borderColor;
in vec2 v_instanceScale;
in vec2 v_texCoord;
in vec2 v_rawTexCoord;
flat in int v_instanceShape;
flat in float v_instanceTextureImageStyle;
flat in vec4 v_instanceTextureUvBounds;

uniform sampler2D u_texture0;

out vec4 o_color;

vec4 renderCircle(vec4 baseColor) {
  float dist = length(v_localPosition);
  float edge = 0.49;
  float pixelSize = fwidth(dist);

  float borderOuter = edge;
  float borderInner = edge - (v_borderSize / max(v_instanceScale.x, v_instanceScale.y));

  if (dist >= borderOuter) discard;

  if (dist >= borderInner) {
    return v_borderColor;
  } else {
    float alpha = smoothstep(borderInner, borderInner - pixelSize, dist);
    vec3 premultiplied = baseColor.rgb * (baseColor.a * alpha);
    return vec4(premultiplied, baseColor.a * alpha);
  }
}

vec4 renderRectangle(vec4 baseColor) {
  vec2 uv = v_localPosition + vec2(0.5);
  vec2 edgeDist = min(uv, 1.0 - uv);

  float relativeBorderX = v_borderSize / v_instanceScale.x;
  float relativeBorderY = v_borderSize / v_instanceScale.y;

  bool isBorder = (edgeDist.x < relativeBorderX) || (edgeDist.y < relativeBorderY);
  return isBorder ? v_borderColor : baseColor;
}

void main() {
  vec4 baseColor = v_color;
  bool hasTexture = any(greaterThan(v_texCoord, vec2(0.001)));

  if (hasTexture) {
    vec4 texColor;

    if (v_instanceTextureImageStyle > 0.0) {
      // Tiled sampling inside the atlas region
      float tileScale = v_instanceTextureImageStyle; // Hardcoded for now
      vec2 tiledUV = fract(v_rawTexCoord * tileScale);
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

  if (v_instanceShape == 1) {
    o_color = renderCircle(baseColor);
  } else {
    o_color = renderRectangle(baseColor);
  }
}`;

export default fragmentSourceCode