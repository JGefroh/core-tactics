const shaderSourceCode = `#version 300 es
      layout(location = 0) in vec2 a_position;
      in vec2 a_instanceOffset;
      in vec4 a_instanceColor;
      in vec2 a_instanceScale;
      in float a_instanceAngleDegrees;
      in int a_instanceShape;
      
      out vec4 v_color;
      out vec2 v_localPosition;
      out vec2 v_instanceScale;
      flat out int v_instanceShape;

      uniform mat4 u_projectionMatrix;

      void main() {
        float angleRadians = radians(a_instanceAngleDegrees);
        float c = cos(angleRadians);
        float s = sin(angleRadians);
        
        vec2 scaled = a_position * a_instanceScale;

        vec2 rotated = vec2(
          scaled.x * c - scaled.y * s,
          scaled.x * s + scaled.y * c
        );

        vec2 worldPosition = rotated + a_instanceOffset;

        gl_Position = u_projectionMatrix * vec4(worldPosition, 0.0, 1.0);
        v_color = a_instanceColor;
        v_localPosition = a_position;
        v_instanceScale = a_instanceScale;
        v_instanceShape = a_instanceShape;
      }`;
export default shaderSourceCode