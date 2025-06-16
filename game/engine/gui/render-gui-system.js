import { default as System } from '@core/system';
import { default as Entity } from '@core/entity.js'

import { _deepMerge } from '@game/engine/util/object-util';

import { isPointInRotatedRect } from '@game/engine/collision/collision-util';

import GuiCanvasRenderComponent from '@game/engine/gui/gui-canvas-render-component';


export default class RenderGuiSystem extends System {
  constructor() {
    super()
    this.hoverLastChecked = null;

    this._addUIHandlers();
  }

  initialize() {
    this.send('REGISTER_RENDER_PASS', {
      name: 'GUI',
      // destinationTarget: 'GUI',
      execute: (renderer, materialResolver) => {
          this._submitGuiDraws(renderer, materialResolver);
      },
      // tickInterval: 3
    });

    //   this.send('REGISTER_RENDER_PASS', {
    //     name: 'GUI_BLIT',
    //     sourceTargets: ['GUI'],
    //     execute: (renderer, materialResolver) => {
    //         renderer.submitRenderCommand({
    //             materialId: 'blit',
    //         });
    //     },
    // });
  }
  

  _addUIHandlers() {
    this.addHandler('ADD_GUI_RENDERABLE', (payload) => {
      this._addGuiRenderable(payload)
    });

    this.addHandler('GUI_ADD_TEXT', (payload) => {
      this._addText(payload.key, payload.text, payload.canvasXPosition, payload.canvasYPosition, payload.width, payload.height, payload.fontSize)
    });

    this.addHandler('GUI_UPDATE_TEXT', (payload) => {
      this._updateText(payload.key, payload.value)
    });

    this.addHandler('GUI_UPDATE_VISIBLE', (payload) => {
      if (payload.isVisible != undefined) {
        this._updateProperties(payload.key, { isVisible: payload.isVisible })
      }
      else {
        this._toggleVisible(payload.key)
      }

      if (payload.relatedKeyPrefix) {
        this.workForTag('GuiCanvasRenderable', (renderable, entity) => {
          if (entity.getKey().startsWith(payload.relatedKeyPrefix)) {
            this._updateProperties(entity.getKey(), { isVisible: payload.isVisible })
          }
        });
      }
    });

    this.addHandler('GUI_UPDATE_PROPERTIES', (payload) => {
      this._updateProperties(payload.key, payload.value)
    });
  }

  work() {
    this.wait = 30;
    let canvasCtx = document.getElementById('ui-canvas').getContext("2d");
    canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);

    this._renderCanvas(canvasCtx)
  };

  _submitGuiDraws(renderer, materialResolver) {
    this.workForTag('GuiCanvasRenderable', (renderable, entity) => {
      if (!renderable.getIsVisible()) {
        return;
      }

      let xPosition = renderable.getCanvasXPosition() + renderable.getOffsetXAmount();
      let yPosition = renderable.getCanvasYPosition() + renderable.getOffsetYAmount();

      if (renderable.getAttachedExists()) {
        xPosition = renderable.getAttachedXPosition() + renderable.getOffsetXAmount();
        yPosition = renderable.getAttachedYPosition() + renderable.getOffsetYAmount();
      }

      let drawCommand = {
        materialId: renderable.getLayer() == 'world' ? 'basic-quad' : 'canvas-quad',
        shape: renderable.getShape() ,
        zIndex: 'DEFAULT',
        xPosition: xPosition,
        yPosition: yPosition,
        angleDegrees: renderable.getAngleDegrees() || 0,
        width: renderable.getWidth() ||  0,
        height: renderable.getHeight() || 0,
        texture: {
          imagePath: renderable.getImagePath(),
          imageStyle: renderable.getImageStyle()
        },
        color: renderable.getShapeColor(),
        options: {}, // Use later
        borderSize: renderable.getBorderSize(),
        borderColor: renderable.getBorderColor(),
      }
      renderer.submitRenderCommand(drawCommand);
    });
  }

  _renderCanvas(canvasCtx) {
    canvasCtx.save();

    this.resetCanvas(canvasCtx)

    this.workForTag('GuiCanvasRenderable', (renderable, entity) => {
      if (!renderable.getIsVisible()) {
        return;
      }

      this.resetCanvas(canvasCtx);
      
      canvasCtx.save();

      if (renderable.getLayer() == 'world') {
        if (!renderable.getAttachedExists()) {
          return;
        }
        let viewport = this._core.getData('VIEWPORT');

        if (viewport) {
          let angleDegrees = renderable.getAngleDegrees();
          const angleRadians = angleDegrees * (Math.PI / 180);

          let xPosition = renderable.getAttachedXPosition() + -(renderable.getWidth() / 2) + renderable.getOffsetXAmount();
          let yPosition = renderable.getAttachedYPosition() + -(renderable.getHeight() / 2) + renderable.getOffsetYAmount();

          let translateXPosition = (xPosition - viewport.xPosition) * viewport.scale;
          let translateYPosition = (yPosition - viewport.yPosition) * viewport.scale;

          canvasCtx.translate(translateXPosition, translateYPosition);
          canvasCtx.rotate(angleRadians)

        }
      }
      else {
          // Canvas orientation
          let translateXPosition = renderable.getCanvasXPosition() - renderable.getWidth() / 2
          let translateYPosition = renderable.getCanvasYPosition() - renderable.getHeight() / 2
          let angleDegrees = renderable.getAngleDegrees();
          const angleRadians = angleDegrees * (Math.PI / 180);
          canvasCtx.translate(translateXPosition, translateYPosition);
          canvasCtx.rotate(angleRadians)
      }

      // Use Canvas to render the text at the end.
      if (renderable.getText()) {
        this._renderText(renderable, canvasCtx)
      }

      canvasCtx.restore();
    });


    canvasCtx.restore();
  }

  _renderText(renderable, canvasCtx) {
    if (`${renderable.getText()}` == '') {
      return;
    }

    let width = renderable.getWidth()
    if (!width) {
      width = canvasCtx.measureText(renderable.getText()).width
      renderable.setWidth(width);
    }
    
    if (renderable.isActive(this._core) && renderable.getActiveStyles()) {
      canvasCtx.fillStyle = renderable.getActiveStyles()?.fontColor;
    }
    else if (renderable.getIsHovered() && renderable.getHoverStyles()?.fontColor) {
      canvasCtx.fillStyle = renderable.getHoverStyles()?.fontColor;
    }
    else {
      canvasCtx.fillStyle = renderable.getFontColor() || '#FFFFFF';
    }
    canvasCtx.font = `${renderable.getFontSize() || 14}px ${renderable.getFontType() || 'sans-serif'}`;
    canvasCtx.textBaseline = 'top';
    canvasCtx.textAlign = 'left' || renderable.getTextAlign();

    if (`${renderable.getText()}`.split(' ').length <= 2) {
      // It's unlikely that a couple words will require a split.
      canvasCtx.fillText(`${renderable.getText()}`, renderable.getTextOffsetX(), renderable.getTextOffsetY());
      return;
    }

    let lineHeight = renderable.getFontSize() || '14'; // Set the lineHeight or use a default value

    // // Draw wrapped text
    this.drawWrappedText(canvasCtx, `${renderable.getText()}`,  renderable.getTextOffsetX(), renderable.getTextOffsetY(), width, lineHeight);
  }

  drawWrappedText(canvasCtx, text, x, y, maxWidth, lineHeight) {
    let lines = [];
    let words = text.split(' ');
    if (canvasCtx.measureText(text).width <= maxWidth) {
      // Fits on one line.
      canvasCtx.fillText(text, x, y);
      return;
    }


    let line = '';
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      let parts = word.split('\n');

      for (let j = 0; j < parts.length; j++) {
        let part = parts[j];

        if (line !== '') {
          let testLine = line + ' ' + part;
          let metrics = canvasCtx.measureText(testLine);
          let testWidth = metrics.width;

          if (testWidth > maxWidth) {
            lines.push(line);
            line = part; // Start a new line
          } else {
            line = testLine;
          }
        } else {
          line = part;
        }

        // Push the line if we encounter a \n or it's the last part
        if (j < parts.length - 1 || i === words.length - 1) {
          lines.push(line);
          line = ''; // Start a new line
        }
      }
    }

    // Draw each line
    for (let i = 0; i < lines.length; i++) {
      canvasCtx.fillText(lines[i], x, y + (i * lineHeight));
    }
  }

  _postRender(renderable, canvasCtx) {
    if (renderable.hasPostRender()) {
      renderable.postRender(renderable, canvasCtx);
    }
  }
  /**
   * Add elements to the renderable.
   */

  _addGuiRenderable(payload) {
    let entity = new Entity({ key: payload.key });
    let renderComponent = new GuiCanvasRenderComponent(payload)
    entity.addComponent(renderComponent);
    this._core.addEntity(entity)
  }

  /**
   * Update elements on the GUI
   */

  _updateGuiCanvasRenderable(key, callback) {
    let entity = this._core.getKeyedAs(key);
    let tag = this.getTag('GuiCanvasRenderable')
    renderable.setEntity(entity);
    callback(tag)
  }

  _updateProperties(key, properties) {
    let renderable = this.getTag('GuiCanvasRenderable');

    if (!renderable) {
      return;
    }
    this.forKeyedAs(key, (entity) => {
      renderable.setEntity(entity);
      renderable.updateProperties(properties);
    });
  }

  _toggleVisible(key) {
    let renderable = this.getTag('GuiCanvasRenderable');

    if (!renderable) {
      return;
    }
    this.forKeyedAs(key, (entity) => {
      renderable.setEntity(entity);
      renderable.setIsVisible(!renderable.getIsVisible())
    });
  }

  _updateText(key, value) {
    let renderable = this.getTag('GuiCanvasRenderable');

    if (!renderable) {
      return;
    }
    this.forKeyedAs(key, (entity) => {
      renderable.setEntity(entity);
      renderable.setText(value);
    });
  }

  resetCanvas(ctx) {
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineWidth = 1;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 10;
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

}

