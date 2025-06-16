import { default as fragmentShaderSourceCode } from '@game/engine/renderer/shaders/fullscreen-tone-fragment-shader';
import { default as vertexShaderSourceCode } from '@game/engine/renderer/shaders/fullscreen-tone-vertex-shader';

import { compileShader } from '@game/engine/renderer/util/shader-util';
import Colors from '@game/engine/util/colors';

class Program {
  constructor(renderCtx, config = {}) {
    this.fullscreenTone = {};
    this.renderCtx = renderCtx;
    this.colorUtil = new Colors();
    this.initialize(renderCtx, config);
  }

  initialize(renderCtx, config) {
    this._initializeProgramGeneric(renderCtx, vertexShaderSourceCode, fragmentShaderSourceCode, ['u_color', 'u_sourceTexture']);
    this._initializeBuffers(renderCtx);
  }

  uploadInstanceData(commands) {
    if (!commands.length) {
      return;
    }

    let command = commands[0];
    let colorObject = this.colorUtil.colorToRaw(command.color, 255);
    command.color = [colorObject.r, colorObject.g, colorObject.b, colorObject.a];
    this.fullscreenTone = command;
  }

  draw(renderCtx, perFrameCache) {
    if (!this.fullscreenTone) return;

    renderCtx.useProgram(this.program.program);
    renderCtx.uniform4fv(this.program.uniforms['u_color'], this.fullscreenTone.color);
    

    // Load the texture to blit
    const sourceTexture = perFrameCache['sourceTexture']
    if (sourceTexture) {
      renderCtx.activeTexture(renderCtx.TEXTURE0);
      renderCtx.bindTexture(renderCtx.TEXTURE_2D, sourceTexture);
      renderCtx.uniform1i(this.program.uniforms['u_sourceTexture'], 0);
    }


    renderCtx.bindVertexArray(this.vertexArrayObject);
    renderCtx.drawArrays(renderCtx.TRIANGLES, 0, 6);
  }


  // Initialization
  _initializeProgramGeneric(renderCtx, vertexShaderSourceCode, fragmentShaderSourceCode, uniforms) {
    const program = renderCtx.createProgram();

    let vertexShader = compileShader(renderCtx, vertexShaderSourceCode, renderCtx.VERTEX_SHADER)
    renderCtx.attachShader(program, vertexShader);

    let fragmentShader = compileShader(renderCtx, fragmentShaderSourceCode, renderCtx.FRAGMENT_SHADER)
    renderCtx.attachShader(program, fragmentShader);

    renderCtx.linkProgram(program);


    let uniformLocations = {}
    uniforms.forEach((uniform) => { uniformLocations[uniform] = renderCtx.getUniformLocation(program, uniform); })

    this.program = {
        program: program,
        attributes: {},
        uniforms: uniformLocations
    }

    return this.program;
  }

  _initializeBuffers(renderCtx) {
    const quadVertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]);

    const vao = renderCtx.createVertexArray();
    renderCtx.bindVertexArray(vao);

    const vbo = renderCtx.createBuffer();
    renderCtx.bindBuffer(renderCtx.ARRAY_BUFFER, vbo);
    renderCtx.bufferData(renderCtx.ARRAY_BUFFER, quadVertices, renderCtx.STATIC_DRAW);

    renderCtx.enableVertexAttribArray(0);
    renderCtx.vertexAttribPointer(0, 2, renderCtx.FLOAT, false, 0, 0);

    renderCtx.bindVertexArray(null);
    this.vertexArrayObject = vao;
  }
}

export default Program;