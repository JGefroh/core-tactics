import { default as System } from '@core/system';
import { default as Core}  from '@core/core';
import { default as Entity } from '@core/entity.js'
import CommandPaintTerrain from './commands/command-paint-terrain';
import CommandSelectPreset from './commands/command-select-preset';
import CommandAdjustSize from './commands/command-adjust-size';
import CommandExportTerrain from './commands/command-export-terrain';


export default class EditorCommandSystem extends System {
    constructor() {
      super()

      this.commands = {
        'paintTerrain': new CommandPaintTerrain(),
        'selectPreset': new CommandSelectPreset(),
        'adjustSize': new CommandAdjustSize(),
        'exportTerrain': new CommandExportTerrain()
      }

      this.addHandler('PLAYER_COMMAND', (payload) => {
        this.handleEditorCommand(payload)
      });
    }

    work() {}
    
    handleEditorCommand(payload) {
      let command = this.getSelectedCommand(payload);
      this.enrichWithContext(payload);

      if (!command) {
        console.warn('EditorCommandSystem - unknown command:', payload)
        return;
      } 

      if (command.canPerform(this._core, this, payload)) {
        command.onPerform(this._core, this, payload);
      }
    };

    getSelectedCommand(payload) {
      return this.commands[payload.command || 'paintTerrain'];
    }

    enrichWithContext(payload) {
      let cursorCoordinates = this._core.getData('CURSOR_COORDINATES');
      payload.xPosition = cursorCoordinates?.world?.xPosition;
      payload.yPosition = cursorCoordinates?.world?.yPosition;
      payload.selectedPreset = this._core.getData('EDITOR_SELECTED_PRESET');
      payload.selectedSize = this._core.getData('EDITOR_SELECTED_SIZE');
    }
  }