import { default as System } from '@core/system';
import { default as Entity } from '@core/entity.js'

import { _deepMerge } from '@game/engine/util/object-util';

import { isPointInRotatedRect } from '@game/engine/collision/collision-util';



export default class GuiInteractionSystem extends System {
  constructor() {
    super()
  }

  initialize() {
    this._addUIHandlers();
  }

  _addUIHandlers() {
    this.addHandler('INPUT_RECEIVED', (payload) => {
      this.checkUIClick(payload)
    });
  }

  work() {
    if (!this.notYetTime(30, this.hoverLastChecked)) {
      this.hoverLastChecked = Date.now();
      this.checkUIHover();
    }
  };

  _checkPointInRenderable(renderable, cursorCoordinates) {
    let layer = renderable.getLayer();
    let cursorX = layer === 'world' ? cursorCoordinates.world.xPosition : cursorCoordinates.canvas.xPosition;
    let cursorY = layer === 'world' ? cursorCoordinates.world.yPosition : cursorCoordinates.canvas.yPosition;

    let xPosition = (layer === 'world')
      ? renderable.getAttachedXPosition() + renderable.getCenterXPosition()
      : renderable.getCenterXPosition();
    let yPosition = (layer === 'world')
      ? renderable.getAttachedYPosition() + renderable.getCenterYPosition()
      : renderable.getCenterYPosition();

    let width = renderable.getWidth();
    let height = renderable.getHeight();
    let angleDegrees = renderable.getAngleDegrees();

    return isPointInRotatedRect(
      cursorX,
      cursorY,
      xPosition,
      yPosition,
      width,
      height,
      angleDegrees,
      true
    );
  }

  checkUIHover() {
    let cursorCoordinates = this._core.getData('CURSOR_COORDINATES');
    if (!cursorCoordinates || !cursorCoordinates.canvas) {
      return;
    }

    this.workForTag('GuiCanvasRenderable', (renderable, entity) => {
      let isHovered = this._checkPointInRenderable(renderable, cursorCoordinates);
      let wasHovered = renderable.getIsHovered();
      if (wasHovered !== isHovered) {
        renderable.setIsHovered(isHovered);
        this.handleUiHover(entity, renderable, isHovered);
      }
    });
  }

  checkUIClick(payload) {
    if (payload.type !== 'click') {
      return;
    }
    let cursorCoordinates = this._core.getData('CURSOR_COORDINATES');

    this.workForTag('GuiCanvasRenderable', (renderable, entity) => {
      if (!renderable.getIsVisible()) {
        return;
      }

      let isSelected = this._checkPointInRenderable(renderable, payload);
      if (isSelected) {
        this.handleUiClick(entity, renderable);
      }
    });
  }

  handleUiHover(selectedEntity, tag, isHovered) {
    if (!selectedEntity) {
      return
    }

    if (isHovered) {
      tag.onHover(this._core);
    }
    else {
      tag.onHoverStop(this._core);
    }
  }

  handleUiClick(selectedEntity, tag) {
    if (!selectedEntity) {
      return
    }

    tag.onClick(this._core);
  }
}

