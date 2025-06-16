import { default as System } from '@core/system';
import { default as Core}  from '@core/core';
import { default as Entity } from '@core/entity.js'

import CommandSetFormation from './commands/command-set-formation';
import CommandMoveTo from './commands/command-move-to';
import CommandAttackTarget from './commands/command-attack-target';
import CommandDefend from './commands/command-defend';
import CommandSelectUnit from './commands/command-select-unit';
import CommandSelectAllUnits from './commands/command-select-all-units';
import CommandSelectGroup from './commands/command-select-group';
import CommandUpdateGroup from './commands/command-update-group';
import CommandDestroySelected from './commands/command-destroy-selected';
import CommandMoveCamera from './commands/command-move-camera';

export default class PlayerCommandSystem extends System {
    constructor() {
      super()

      this.commands = {
        attackTarget: new CommandAttackTarget(),
        defend: new CommandDefend(),
        destroySelected: new CommandDestroySelected(),
        moveCamera: new CommandMoveCamera(),
        moveTo: new CommandMoveTo(),
        selectGroup: new CommandSelectGroup(),
        selectUnit: new CommandSelectUnit(),
        selectAllUnits: new CommandSelectAllUnits(),
        setFormation: new CommandSetFormation(),
        updateGroup: new CommandUpdateGroup(),
      }

      this.addHandler('PLAYER_COMMAND', (payload) => {
        this.handlePlayerCommand(payload)
      });
    }

    work() {}
    
    handlePlayerCommand(payload) {
      let command = this.commands[payload.command];
      this.enrichWithContext(payload);

      if (!command) {
        console.warn('PlayerCommandSystem - unknown command:', payload)
        return;
      } 

      if (command.canPerform(this._core, this, payload)) {
        command.onPerform(this._core, this, payload);
      }
    };

    enrichWithContext(payload) {
      payload.currentSelectedEntities = this.getCurrentSelected();
    }

    getCurrentSelected() {
      let currentSelected = [];
      this.workForTag('PlayerControllable', (tag, entity) => {
        if (tag.isCurrentlyControlled()) {
          currentSelected.push(entity);
        }
      })
      return currentSelected;
    }
  }