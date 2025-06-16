import { default as System } from '@core/system';
import { default as Core } from '@core/core';
import { default as Entity } from '@core/entity.js';

// Interprets a selection box
export default class PlayerSelectionBoxSystem extends System {
  constructor() {
    super();

    this.mouseState = null;
    this.meetsMinimumSize = false;
  }

  initialize() {
    this.addHandler('INPUT_RECEIVED', (inputPayload) => {
      if (!inputPayload.action || inputPayload.action.indexOf('selection_box') == -1) {
        return;
      }

      this.handleSelectionInput(inputPayload);
    });

    this.send('ADD_GUI_RENDERABLE', {
      key: `gui_selection_box`,
      canvasXPosition: 0,
      canvasYPosition: 0,
      width: 0,
      height: 0,
      fontSize: 10,
      text: '',
      isVisible: false,
      fillStyle: 'rgba(0,0,255,0.2)',
      strokeStyle: 'rgba(0,0,255, 1)'
    });
  }

  work() { }

  handleSelectionInput(inputPayload) {
    this.viewport = this._core.getData('VIEWPORT'); // viewport.xPosition, viewport.yPosition, viewport.scale, viewport.width, viewport.height
    if (inputPayload.action === 'selection_box_start') {
      this._handleStart(inputPayload);
    } else if (inputPayload.action === 'selection_box_resize' && this.mouseState === 'started') {
      this._handleResize(inputPayload);
    } else if (inputPayload.action === 'selection_box_end') {
      this._handleEnd(inputPayload);
    }
  }

  _worldToScreen(world) {
    const scale = this.viewport.scale || 1;
    return {
      x: (world.xPosition - this.viewport.xPosition) * scale,
      y: (world.yPosition - this.viewport.yPosition) * scale
    };
  }

  _handleStart(inputPayload) {
    this.mouseState = 'started';
    this.meetsMinimumSize = false;

    const world = inputPayload.world;
    const screen = this._worldToScreen(world);

    this.startX = screen.x;
    this.startY = screen.y;

    this.send('GUI_UPDATE_PROPERTIES', {
      key: 'gui_selection_box',
      value: {
        width: 0,
        height: 0,
        canvasXPosition: screen.x,
        canvasYPosition: screen.y,
      }
    });
  }

  _handleResize(inputPayload) {
    const world = inputPayload.world;
    const screen = this._worldToScreen(world);

    if (Math.abs(screen.x - this.startX) < 10 && Math.abs(screen.y - this.startY) < 10) {
      this.meetsMinimumSize = false;
      return;
    }
    this.meetsMinimumSize = true;

    this.send('GUI_UPDATE_PROPERTIES', {
      key: 'gui_selection_box',
      value: {
        isVisible: true,
        width: screen.x - this.startX,
        height: screen.y - this.startY
      }
    });
  }

  _handleEnd(inputPayload) {
    this.mouseState = 'ended';
    if (!this.meetsMinimumSize) {
      return;
    }

    const world = inputPayload.world;
    const screen = this._worldToScreen(world);


    this.send('GUI_UPDATE_PROPERTIES', {
      key: 'gui_selection_box',
      value: {
        isVisible: false,
        canvasXPosition: screen.x,
        canvasYPosition: screen.y
      }
    });

    this._setUnitSelections(this.startX, this.startY, screen.x, screen.y);
    this._core.publishData('SELECTION_BOX_LAST_TIMESTAMP', Date.now())
  }
  
  _setUnitSelections(startX, startY, endX, endY) {
    const selectionBox = {
      x: Math.min(startX, endX),
      y: Math.min(startY, endY),
      width: Math.abs(endX - startX),
      height: Math.abs(endY - startY)
    };

    this.workForTag('PlayerControllable', (tag, entity) => {
      if (!tag.constructor.isAssignableTo(entity)) {
        return;
      }

      const positionComponent = entity.getComponent('PositionComponent');
      const unitScreenPos = this._worldToScreen({
        xPosition: positionComponent.xPosition,
        yPosition: positionComponent.yPosition
      });

      if (
        unitScreenPos.x >= selectionBox.x &&
        unitScreenPos.x <= selectionBox.x + selectionBox.width &&
        unitScreenPos.y >= selectionBox.y &&
        unitScreenPos.y <= selectionBox.y + selectionBox.height
      ) {
        tag.setCurrentlyControlled(true);
      } else {
        tag.setCurrentlyControlled(false);
      }
    });
}
}