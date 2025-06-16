import { default as System } from '@core/system';
import { default as Core } from '@core/core';
import { default as Entity } from '@core/entity.js'

// Resolve a raw input action into a specific player command { command: 'name', entity: {}}
export default class PlayerInputInterpreterSystem extends System {
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
    if (inputPayload.action == 'command_select') {
      commandPayload = this._interpretCommandSelect(inputPayload)
    }
    if (inputPayload.action == 'command_select_unit') {
      commandPayload = this._interpretCommandSelectUnit(inputPayload)
    }
    else if (inputPayload.action == 'command_select_group') {
      commandPayload = { command: 'selectGroup', group: inputPayload.group, incremental: inputPayload.incremental }
    }
    else if (inputPayload.action == 'command_select_incremental') {
      commandPayload = this._interpretCommandSelectIncremental(inputPayload)
    }
    else if (inputPayload.action == 'command_attack_or_move') {
      commandPayload = this._interpretCommandAttackOrMove(inputPayload)
    }
    else if (inputPayload.action == 'command_select_all') {
      commandPayload = { command: 'selectAllUnits' }
    }
    else if (inputPayload.action == 'command_set_formation') {
      commandPayload = { command: 'setFormation', formation: inputPayload.formation }
    }
    else if (inputPayload.action == 'command_update_group') {
      commandPayload = { command: 'updateGroup', group: inputPayload.group }
    }
    else if (inputPayload.action == 'command_posture_attack') {
      commandPayload = { command: 'attackTarget' } // No target -> Hunt
    }
    else if (inputPayload.action == 'command_posture_defend') {
      commandPayload = { command: 'defend' }
    }
    else if (inputPayload.action == 'command_destroy_selected') {
      commandPayload = { command: 'destroySelected' }
    }
  
    if (commandPayload) {
      this.send('PLAYER_COMMAND', commandPayload);
    }
    else {
      console.warn('PlayerInputInterpreter - uninterpreted input:', inputPayload)
    }
  }

  _interpretCommandSelect(inputPayload) {
    let selectedEntity = null;

    this.workForTag('PlayerIntentTargetable', (tag, entity) => {
      if (!tag.has('selectUnit')) {
        return;
      }

      if (selectedEntity) {
        return;
      }

      let clicked = this._entityWasClicked(tag, entity, inputPayload)
      if (clicked) {
        selectedEntity = entity;
        return;
      }
    });

    return { command: 'selectUnit', entity: selectedEntity }
  }

  _interpretCommandSelectGroup(inputPayload) {
    return { command: 'selectGroup', group: group }
  }

  _interpretCommandSelectIncremental(inputPayload) {
    let commandPayload = this._interpretCommandSelect(inputPayload);

    commandPayload.incremental = true;

    return commandPayload;
  }

  _interpretCommandAttackOrMove(inputPayload) {
    let selectedCommand = 'moveTo'
    let targetedEntity = null;

    this.workForTag('PlayerIntentTargetable', (tag, entity) => {
      if (!tag.has('attackTarget')) {
        return;
      }

      if (targetedEntity) {
        return;
      }

      let clicked = this._entityWasClicked(tag, entity, inputPayload)
      if (clicked) {
        targetedEntity = entity;
        selectedCommand = 'attackTarget'
      }
    });

    return { command: selectedCommand, entity: targetedEntity, targetPosition: inputPayload.world };
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