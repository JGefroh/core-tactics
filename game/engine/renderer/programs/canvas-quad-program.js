
import { default as quadFragmentShaderSourceCode } from '@game/engine/renderer/shaders/quad-fragment-shader';
import { default as quadVertexShaderSourceCode } from '@game/engine/renderer/shaders/quad-vertex-shader';

import { compileShader } from '@game/engine/renderer/util/shader-util';

import Colors from '@game/engine/util/colors';
import BaseProgram from './base-program';
import BasicQuadProgram from './basic-quad-program';

class Program extends BasicQuadProgram {
  constructor(renderCtx, config = {}) {
    super(renderCtx, config);
    this._createCanvasProjection(window.innerWidth, window.innerHeight)
  }

    /////
    // Draw
    ////

    draw(renderCtx, perFrameCache) {
      this._flushInstanceDataBuffer(renderCtx, perFrameCache);
    }
    getProjectionMatrix() {
      return this.canvasProjectionMatrix;
    }
    _createCanvasProjection(width, height) {
      this.canvasProjectionMatrix = new Float32Array([
        2 / width, 0, 0, 0,
        0, -2 / height, 0, 0,
        0, 0, 1, 0,
        -1, 1, 0, 1,
      ]);
    }
}

export default Program;