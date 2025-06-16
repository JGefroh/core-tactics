
import { default as fragmentShaderSourceCode } from '@game/engine/renderer/shaders/light-fragment-shader';
import { default as vertexShaderSourceCode } from '@game/engine/renderer/shaders/light-vertex-shader';

import { compileShader } from '@game/engine/renderer/util/shader-util';

import Colors from '@game/engine/util/colors';
import BaseProgram from './base-program';

class Program extends BaseProgram {
  constructor(renderCtx, config = {}) {
    super(renderCtx, config);
    this.shapeMap = {
      'rectangle': 0,
      'circle': 1
    }
    this.initialize(renderCtx, config);
  }

  uploadInstanceData(commands) {
      for (let command of commands) {
        this.instanceBuffers.offsets.push(command.xPosition, command.yPosition)
        this.instanceBuffers.shapes.push(this.shapeMap[command.shape] || 0)
        this.instanceBuffers.angles.push(command.angleDegrees || 0)
        this.instanceBuffers.scales.push(command.width, command.height)
        let colorObject = this.colorUtil.colorToRaw(command.color, 255);
        this.instanceBuffers.colors.push(...[colorObject.r, colorObject.g, colorObject.b, colorObject.a])
      }
    }

    /////
    // Draw
    ////

    draw(renderCtx, perFrameCache) {
      this._flushInstanceDataBuffer(renderCtx, perFrameCache);
    }

    _flushInstanceDataBuffer(renderCtx, perFrameCache) {
      if (!this.instanceBuffers?.offsets?.length) {
        return;
      }

      let index = this._getFlushIndex();

      renderCtx.useProgram(this.getProgram().program);
      renderCtx.enable(renderCtx.BLEND)
      renderCtx.blendFunc(renderCtx.ONE, renderCtx.ONE);


      

      renderCtx.bindVertexArray(this.getVertexArrayObjects()[`${index}`]);
      renderCtx.uniformMatrix4fv(this.program.uniforms['u_projectionMatrix'], false, perFrameCache['projectionMatrix']);

      this._bindToBufferIfExists(renderCtx, this.getBuffers(), `INSTANCE_OFFSET_${index}`, this.instanceBuffers.offsets)
      this._bindToBufferIfExists(renderCtx, this.getBuffers(), `INSTANCE_SCALE_${index}`, this.instanceBuffers.scales)
      this._bindToBufferIfExists(renderCtx, this.getBuffers(), `INSTANCE_SHAPE_${index}`, this.instanceBuffers.shapes)
      this._bindToBufferIfExists(renderCtx, this.getBuffers(), `INSTANCE_ANGLE_${index}`, this.instanceBuffers.angles)
      this._bindToBufferIfExists(renderCtx, this.getBuffers(), `INSTANCE_COLOR_${index}`, this.instanceBuffers.colors)

      renderCtx.drawArraysInstanced(renderCtx.TRIANGLES, 0, 6, this.instanceBuffers.offsets.length / 2);

      // Clear
      renderCtx.bindBuffer(renderCtx.ARRAY_BUFFER, null);
      renderCtx.bindTexture(renderCtx.TEXTURE_2D, null);

      this._clearInstanceBuffers();
    }



    /////
    // Initialization
    ////
    
    _initializeProgram(renderCtx) {
      this.program = this._initializeProgramGeneric(
        renderCtx, 
        vertexShaderSourceCode, 
        fragmentShaderSourceCode, 
        ['u_projectionMatrix']
      )
    }

    _initializeBuffers(renderCtx) {
        const program = this.program;
        this.vertexArrayObjects = {};
        this.buffers = {};
    
        for (let index = 0; index < this.flushCountMax; index++) {
          const vao = renderCtx.createVertexArray();
          renderCtx.bindVertexArray(vao);
          this.vertexArrayObjects[`${index}`] = vao;
    
          // === Per-vertex position (static geometry for quad) ===
          const quadVertices = new Float32Array([
            -0.5, -0.5,
            0.5, -0.5,
            -0.5, 0.5,
            -0.5, 0.5,
            0.5, -0.5,
            0.5, 0.5
          ]);
          const quadVertexBuffer = renderCtx.createBuffer();
          this.buffers[`${index}`] = quadVertexBuffer;
          renderCtx.bindBuffer(renderCtx.ARRAY_BUFFER, quadVertexBuffer);
          renderCtx.bufferData(renderCtx.ARRAY_BUFFER, quadVertices, renderCtx.STATIC_DRAW);
    
          renderCtx.enableVertexAttribArray(0);
          renderCtx.vertexAttribPointer(0, 2, renderCtx.FLOAT, false, 0, 0);
          renderCtx.vertexAttribDivisor(0, 0); // per-vertex
    
          // === Per-instance offset (vec2) ===
          this.initializeBuffersFor(renderCtx, `INSTANCE_OFFSET`, this.maxBufferSize, renderCtx.DYNAMIC_DRAW, 'float32', index, () => {
            const locOffset = renderCtx.getAttribLocation(program.program, 'a_instanceOffset');
            renderCtx.enableVertexAttribArray(locOffset);
            renderCtx.vertexAttribPointer(locOffset, 2, renderCtx.FLOAT, false, 0, 0);
            renderCtx.vertexAttribDivisor(locOffset, 1); // per-instance
          })
          // === Per-instance color (vec4) ===
          this.initializeBuffersFor(renderCtx, `INSTANCE_COLOR`, this.maxBufferSize * 2, renderCtx.DYNAMIC_DRAW, 'float32', index, () => {
            const locColor = renderCtx.getAttribLocation(program.program, 'a_instanceColor');
            renderCtx.enableVertexAttribArray(locColor);
            renderCtx.vertexAttribPointer(locColor, 4, renderCtx.FLOAT, false, 0, 0);
            renderCtx.vertexAttribDivisor(locColor, 1); // per-instance
          })
    
          // === Per-instance scale (vec2) ===
          this.initializeBuffersFor(renderCtx, `INSTANCE_SCALE`, this.maxBufferSize, renderCtx.DYNAMIC_DRAW, 'float32', index, () => {
            const locScale = renderCtx.getAttribLocation(program.program, 'a_instanceScale');
            renderCtx.enableVertexAttribArray(locScale);
            renderCtx.vertexAttribPointer(locScale, 2, renderCtx.FLOAT, false, 0, 0);
            renderCtx.vertexAttribDivisor(locScale, 1); // per-instance
        
          })
          // === Per-instance angle (float) ===
          this.initializeBuffersFor(renderCtx, `INSTANCE_ANGLE`, this.maxBufferSize, renderCtx.DYNAMIC_DRAW, 'float32', index, () => {
            const locAngle = renderCtx.getAttribLocation(program.program, 'a_instanceAngleDegrees');
            renderCtx.enableVertexAttribArray(locAngle);
            renderCtx.vertexAttribPointer(locAngle, 1, renderCtx.FLOAT, false, 0, 0);
            renderCtx.vertexAttribDivisor(locAngle, 1); // per-instance
          })
    
          // === Per-instance border size (float) ===
          this.initializeBuffersFor(renderCtx, `INSTANCE_SHAPE`, this.maxBufferSize, renderCtx.DYNAMIC_DRAW, 'int', index, () => {
            const locShape = renderCtx.getAttribLocation(program.program, 'a_instanceShape');
            renderCtx.enableVertexAttribArray(locShape);
            renderCtx.vertexAttribIPointer(locShape, 1, renderCtx.INT, 0, 0);
            renderCtx.vertexAttribDivisor(locShape, 1); // per-instance
          })
    
          // Clean up
          renderCtx.bindVertexArray(null);
          renderCtx.bindBuffer(renderCtx.ARRAY_BUFFER, null);
        }
      }

      _ensureInstanceBuffers() {
        this.instanceBuffers ||= {
          offsets: [],
          shapes: [],
          colors: [],
          angles: [],
          scales: [],
        }
      }
}

export default Program;