import { default as fragmentShaderSourceCode } from '@game/engine/renderer/shaders/blit-fragment-shader';
import { default as vertexShaderSourceCode } from '@game/engine/renderer/shaders/blit-vertex-shader';

import { compileShader } from '@game/engine/renderer/util/shader-util';
import Colors from '@game/engine/util/colors';

class Program {
  constructor(renderCtx, config = {}) {
    this.renderCtx = renderCtx;
    this.initialize(renderCtx, config);
  }

  initialize(renderCtx, config) {
    this._initializeProgramGeneric(renderCtx, vertexShaderSourceCode, fragmentShaderSourceCode, ['u_sourceTexture']);
    this._initializeBuffers(renderCtx);
  }

  uploadInstanceData(commands) {
    // No-op during a blit
  }

  draw(renderCtx, perFrameCache) {
    renderCtx.useProgram(this.program.program);

    // Load the texture to blit
    const sourceTexture = perFrameCache['sourceTexture']
    if (sourceTexture) {
      renderCtx.activeTexture(renderCtx.TEXTURE0);
      renderCtx.bindTexture(renderCtx.TEXTURE_2D, sourceTexture);
      renderCtx.uniform1i(this.program.uniforms['u_sourceTexture'], 0);
    }
    renderCtx.enable(renderCtx.BLEND);
    renderCtx.blendFunc(renderCtx.SRC_ALPHA, renderCtx.ONE_MINUS_SRC_ALPHA);


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