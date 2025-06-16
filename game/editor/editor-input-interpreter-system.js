import { default as System } from '@core/system';
import { default as Core } from '@core/core';
import { default as Entity } from '@core/entity.js'

// Resolve a raw input action into a specific player command { command: 'name', entity: {}}
export default class EditorInputInterpreterSystem extends System {
  constructor() {
    super()
  }

  initialize() {
    this.addHandler('INPUT_RECEIVED', (inputPayload) => {
      this.interpretInput(inputPayload);
    });
  }

  work() { }

  interpretInput(inputPayload) {
    if (!inputPayload.action || inputPayload.action.indexOf('command') == -1) {
      return; // this is not a command needing interpretation
    }

    let commandPayload = null;
    if (inputPayload.action.startsWith('command_start')) {
      commandPayload = { command: 'paintTerrain', event: 'start' }
    }
    else if (inputPayload.action.startsWith('command_continue')) {
      commandPayload = { command: 'paintTerrain', event: 'continue' }
    }
    else if (inputPayload.action.startsWith('command_end')) {
      commandPayload = { command: 'paintTerrain', event: 'end' }
    }
    else if (inputPayload.action == 'command_select_preset') {
      commandPayload = { command: 'selectPreset', preset: inputPayload.preset }
    }
    else if (inputPayload.action == 'command_adjust_size') {
      commandPayload = { command: 'adjustSize', amount: inputPayload.amount }
    }
    else {
      commandPayload = { command: inputPayload.command };
    }
  
    if (commandPayload) {
      this.send('PLAYER_COMMAND', commandPayload);
    }
    else {
      console.warn('EditorInputInterpreter - uninterpreted input:', inputPayload)
    }
  }

  _entityWasClicked(tag, entity, inputPayload) {
    let clickX = inputPayload.world.xPosition;
    let clickY = inputPayload.world.yPosition;

    let positionComponent = entity.getComponent('PositionComponent');
    if (!positionComponent) {
      return;
    }

    let cx = positionComponent.xPosition;
    let cy = positionComponent.yPosition;
    let width = positionComponent.width;
    let height = positionComponent.height;
    let angleDegrees = positionComponent.angleDegrees || 0;

    // Convert angle to radians and invert it
    let theta = -angleDegrees * Math.PI / 180;

    // Translate point relative to center
    let dx = clickX - cx;
    let dy = clickY - cy;

    // Rotate point into rectangle's local space
    let localX = dx * Math.cos(theta) - dy * Math.sin(theta);
    let localY = dx * Math.sin(theta) + dy * Math.cos(theta);

    // Half extents
    let halfWidth = width / 2;
    let halfHeight = height / 2;

    // Check if inside bounds
    if (
      localX >= -halfWidth && localX <= halfWidth &&
      localY >= -halfHeight && localY <= halfHeight
    ) {
      return true; // Stop searching
    }
  }
}