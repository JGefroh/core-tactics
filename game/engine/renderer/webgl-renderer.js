import BasicQuadProgram from './programs/basic-quad-program'
import BasicLightProgram from './programs/basic-light-program'
import BlitProgram from './programs/blit-program';
import FullscreenToneProgram from './programs/fullscreen-tone-program'
import CanvasQuadProgram from './programs/canvas-quad-program'
import TerrainProgram from './programs/terrain-program';

import Colors from '@game/engine/util/colors';

export default class WebGLRenderer {
  constructor(renderCtx, materialRegistry) {
    this.clearScreenColor = 'rgba(0, 0, 0, 0.0)';

    this.materialRegistry = materialRegistry;
    this.renderCtx = renderCtx;
    this.perFrameCache = {};
    this.renderCommandBuffer = [];
    this.destinationTargets = {}; // FBOs and other registered render targets

    this._initializeSupportedMaterials();
    this.colorUtil = new Colors();
    this.textureDetails = null;
  }

  _initializeSupportedMaterials() {
    this.materialRegistry.register('terrain', 
      {
        program: new TerrainProgram(this.renderCtx, {}),
        resolver: (drawCommand) => { return drawCommand.texture?.imageType == 'continuous' ? 'terrain' : null; }
      }
    );
    this.materialRegistry.register('basic-quad', {program: new BasicQuadProgram(this.renderCtx, {})});
    this.materialRegistry.register('basic-light', {program: new BasicLightProgram(this.renderCtx, {})});
    this.materialRegistry.register('fullscreen-tone', {program: new FullscreenToneProgram(this.renderCtx, {})});
    this.materialRegistry.register('blit', {program: new BlitProgram(this.renderCtx, {})});
    this.materialRegistry.register('canvas-quad', {program: new CanvasQuadProgram(this.renderCtx, {})});
  }

  getCanvasDimensions() {
    return {width: this.renderCtx.canvas.width, height: this.renderCtx.canvas.height};
  }

  loadTexture(renderCtx, textureDetails) {
    const texture = renderCtx.createTexture();
    renderCtx.bindTexture(renderCtx.TEXTURE_2D, texture);
    textureDetails.texture = texture;

    renderCtx.texImage2D(
      renderCtx.TEXTURE_2D,
      0,
      renderCtx.RGBA,
      renderCtx.RGBA,
      renderCtx.UNSIGNED_BYTE,
      textureDetails.atlasImage
    );

    renderCtx.texParameteri(renderCtx.TEXTURE_2D, renderCtx.TEXTURE_WRAP_S, renderCtx.CLAMP_TO_EDGE);
    renderCtx.texParameteri(renderCtx.TEXTURE_2D, renderCtx.TEXTURE_WRAP_T, renderCtx.CLAMP_TO_EDGE);
    renderCtx.texParameteri(renderCtx.TEXTURE_2D, renderCtx.TEXTURE_MIN_FILTER, renderCtx.NEAREST);
    renderCtx.texParameteri(renderCtx.TEXTURE_2D, renderCtx.TEXTURE_MAG_FILTER, renderCtx.NEAREST);

    this.textureDetails = textureDetails; //TODO: Make this support multiple textures when the need eventually arises.
  }

  ////
  // Rendering
  ////

  beginFrame(renderCtx, viewport) {
    this.perFrameCache = {};
    this.perFrameCache['projectionMatrix'] = this._buildProjectionMatrix(renderCtx, viewport)
    this.perFrameCache['texture0'] = this.textureDetails?.texture;
    this._clearScreen(renderCtx);
  }

  beginPass(pass) {
    let sourceName = (pass.sourceTargets || [])[0];
    let source = this.destinationTargets[sourceName]; 
    this.perFrameCache['sourceTexture'] = source?.texture
  }

  draw() {
    this.renderCommandBuffer = this.renderCommandBuffer.sort((a, b) => {return a.zIndex - b.zIndex});
    this.flushRenderCommandBuffer(this.renderCommandBuffer)

    this.renderCtx.activeTexture(this.renderCtx.TEXTURE0);
    this.renderCtx.bindTexture(this.renderCtx.TEXTURE_2D, null);
  }

  endFrame() {
  }

  submitRenderCommand(command) {
    if (command.texture?.imagePath) {
      let textureDetail = this._getTextureDetails(command.texture.imagePath);
      if (textureDetail) {
        command.texture.textureUVBounds = textureDetail.uvBounds;
        command.texture.textureAtlasPosition = textureDetail.atlasPosition;
      }
    }
    this.renderCommandBuffer.push(command);
  }

  _getTextureDetails(imagePath) {
    if (!this.textureDetails) {
      return null; // No texture loaded.
    }
    let image = this.textureDetails.images[imagePath]

    if (!image) {
      return null; // Can't find image.
    }

    if (!image.uv) {
      // Calculate and cache UV
      const u0 = image.atlasXPosition / this.textureDetails.width;
      const v0 = image.atlasYPosition / this.textureDetails.height;
      const u1 = (image.atlasXPosition + image.width) / this.textureDetails.width;
      const v1 = (image.atlasYPosition + image.height) / this.textureDetails.height;
  
      image.uv = [u0, v0, u1, v1];
    }

    if (!image.atlasPosition) {
      image.atlasPosition = [image.atlasXPosition, image.atlasYPosition, image.atlasXPosition + image.width, image.atlasYPosition + image.height]
    }

    return {
      uvBounds: image.uv,
      atlasPosition: [image.atlasXPosition, image.atlasYPosition, image.atlasXPosition + image.width, image.atlasYPosition + image.height]
    }
  }

  flushRenderCommandBuffer(renderCommandBuffer) {
    const grouped = new Map();

    for (const command of renderCommandBuffer) {
      const key = command.materialId;
      
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }

      grouped.get(key).push(command);
    }
  
    for (const [materialId, commands] of grouped.entries()) {
      const program = this.materialRegistry.get(materialId)?.program;
      if (!program) { continue; }
  
      program.uploadInstanceData(commands);
      program.draw(this.renderCtx, this.perFrameCache);
    }
  
    renderCommandBuffer.length = 0; // clear
  }

  _clearScreen(renderCtx, targetFramebuffer = null) {
    const color = this.colorUtil.colorToRaw(this.clearScreenColor, 255);
    if (targetFramebuffer) {
      this.renderCtx.bindFramebuffer(this.renderCtx.FRAMEBUFFER, targetFramebuffer);
    }
    else {
      this.renderCtx.bindFramebuffer(this.renderCtx.FRAMEBUFFER, null);
    }
    this.renderCtx.enable(this.renderCtx.BLEND);
    this.renderCtx.blendFunc(this.renderCtx.SRC_ALPHA, this.renderCtx.ONE_MINUS_SRC_ALPHA);
    renderCtx.clearColor(color.r, color.g, color.b, color.a);
    renderCtx.clear(renderCtx.COLOR_BUFFER_BIT | renderCtx.DEPTH_BUFFER_BIT);
  }

  //////
  // Hooks
  /////

  createDestinationTarget(key, width, height) {
    let framebuffer = this.renderCtx.createFramebuffer();
    this.renderCtx.bindFramebuffer(this.renderCtx.FRAMEBUFFER, framebuffer);

    // Frame Buffer renders to a target texture
    const texture = this.renderCtx.createTexture();
    texture.key = key; // Easier to identify textures for debugging
    this.renderCtx.activeTexture(this.renderCtx.TEXTURE0);
    this.renderCtx.bindTexture(this.renderCtx.TEXTURE_2D, texture);
    this.renderCtx.texImage2D(this.renderCtx.TEXTURE_2D, 0, this.renderCtx.RGBA, width, height, 0, this.renderCtx.RGBA, this.renderCtx.UNSIGNED_BYTE, null);
    this.renderCtx.texParameteri(this.renderCtx.TEXTURE_2D, this.renderCtx.TEXTURE_MIN_FILTER, this.renderCtx.LINEAR);
    this.renderCtx.texParameteri(this.renderCtx.TEXTURE_2D, this.renderCtx.TEXTURE_WRAP_S, this.renderCtx.CLAMP_TO_EDGE);
    this.renderCtx.texParameteri(this.renderCtx.TEXTURE_2D, this.renderCtx.TEXTURE_WRAP_T, this.renderCtx.CLAMP_TO_EDGE);
  
    this.renderCtx.framebufferTexture2D(this.renderCtx.FRAMEBUFFER, this.renderCtx.COLOR_ATTACHMENT0, this.renderCtx.TEXTURE_2D, texture, 0);
    this.renderCtx.bindFramebuffer(this.renderCtx.FRAMEBUFFER, null);

    this.destinationTargets[key] = {
      framebuffer: framebuffer,
      texture: texture,
      width: width,
      height: height
    }
    framebuffer.key = key

    return this.destinationTargets[key]
  }

  bindDestinationTarget(key = null) {
    if (!key) {
      this.renderCtx.bindFramebuffer(this.renderCtx.FRAMEBUFFER, null);
      this.renderCtx.viewport(0, 0, this.renderCtx.canvas.width, this.renderCtx.canvas.height);
      return;
    }


    let target = this.destinationTargets[key];

    if (!target) {
      target = this.createDestinationTarget(key, this.renderCtx.canvas.width, this.renderCtx.canvas.height);
    }

    this.renderCtx.bindFramebuffer(this.renderCtx.FRAMEBUFFER, target.framebuffer);
    this._clearScreen(this.renderCtx, target.framebuffer);
    this.renderCtx.viewport(0, 0, target.width, target.height);
  }


  // Math and Matrixes

  _buildProjectionMatrix(renderCtx, viewport) {
    const canvasWidth = renderCtx.canvas.width;
    const canvasHeight = renderCtx.canvas.height;
    const baseScale = viewport.scale;
    const scaled = baseScale;
  
    // Compute visible world area size at this zoom
    const viewWidthWorld = canvasWidth / scaled;
    const viewHeightWorld = canvasHeight / scaled;
  
    // Center of screen in world space
    const cx = viewport.xPosition / baseScale + canvasWidth / (2 * baseScale);
    const cy = viewport.yPosition / baseScale + canvasHeight / (2 * baseScale);

    // Compute new bounds centered on screen center
    const left = cx - viewWidthWorld / 2;
    const right = cx + viewWidthWorld / 2;
    const top = cy - viewHeightWorld / 2;
    const bottom = cy + viewHeightWorld / 2;
  
    const sx = 2 / (right - left);
    const sy = 2 / (top - bottom); // keep Y up
    const tx = -(right + left) / (right - left);
    const ty = -(top + bottom) / (top - bottom);
  
    return new Float32Array([
      sx, 0, 0, 0,
      0, sy, 0, 0,
      0, 0, -1, 0,
      tx, ty, 0, 1
    ]);
  }


  save(targetName) {
    this.saveFramebufferAsImage(this.renderCtx, this.destinationTargets[targetName]?.framebuffer, 1024, 1024);
  }


  /// DEBUG
  saveFramebufferAsImage(gl, framebuffer, width, height, filename = 'output.png') {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);
  
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
} 