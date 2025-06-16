import { default as System } from '@core/system';

export default class PlayerControlViewportSystem extends System {
  constructor() {
    super();

    // Distance in pixels from edge to trigger movement
    this.edgeThresholds = {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
    };

    this.panSpeed = 30;

    // Speed or movement rate could be added here if needed
  }

  work() {
    const cursorData = this._core.getData('CURSOR_COORDINATES');
    const viewport = this._core.getData('VIEWPORT');

    if (!cursorData || !cursorData.canvas || !viewport) {
      return; // Cannot act without cursor or viewport data
    }

    const { xPosition, yPosition } = cursorData.canvas;
    const canvasWidth = viewport.width;
    const canvasHeight = viewport.height;

    if (xPosition <= this.edgeThresholds.left) {
      this.send('INPUT_RECEIVED', { action: 'move_viewport_left', speed: this.panSpeed });

    }
    if (xPosition >= canvasWidth - this.edgeThresholds.right) {
      this.send('INPUT_RECEIVED', { action: 'move_viewport_right', speed: this.panSpeed });

    }
    if (yPosition <= this.edgeThresholds.top) {
      this.send('INPUT_RECEIVED', { action: 'move_viewport_up', speed: this.panSpeed });

    }
    if (yPosition >= canvasHeight - this.edgeThresholds.bottom) {
      this.send('INPUT_RECEIVED', { action: 'move_viewport_down', speed: this.panSpeed });
    }
  }
}
