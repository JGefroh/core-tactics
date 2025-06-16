import { default as System } from '@core/system';
import { default as Core}  from '@core/core';
import { default as Entity } from '@core/entity.js'

export default class EditorInputConfigurationSystem extends System {
    constructor() {
        super()
        this.keyMap = {
            // Movement controls
            "mouse_press": {action: 'command_start_current'},
            "mouse_hold": {action: 'command_continue_current'},
            "mouse_release": {action: 'command_end_current'},


            '1_release': {action: 'command_select_preset', preset: 0},
            '2_release': {action: 'command_select_preset', preset: 1},
            '3_release': {action: 'command_select_preset', preset: 2},
            '4_release': {action: 'command_select_preset', preset: 3},
            '5_release': {action: 'command_select_preset', preset: 4},

            //
            '-_release': {action: 'command_adjust_size', amount: -32},
            '=_release': {action: 'command_adjust_size', amount: 32},

            '\\_release': { action: 'command_export_terrain', command: 'exportTerrain' }
        };
    }
    
    work() {
        if (!this._core.getData('CONFIG_KEYS')) {
            this._core.publishData('CONFIG_KEYS', this.keyMap)
        }
    };
  }