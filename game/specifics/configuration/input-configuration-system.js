import { default as System } from '@core/system';
import { default as Core}  from '@core/core';
import { default as Entity } from '@core/entity.js'

export default class InputConfigurationSystem extends System {
    constructor() {
        super()
        this.keyMap = {
            // Movement controls
            "left_click": {action: 'command_select'},
            "mouse_press": {action: 'selection_box_start'},
            "mouse_hold": {action: 'selection_box_resize'},
            "mouse_release": {action: 'selection_box_end'},
            "left_click_shift": {action: 'command_select_incremental'},
            "right_click": {action: 'command_attack_or_move'},

            // Command shortcuts
            "s_release": { action: 'command_posture_defend' },

            // Unit selections
            '`_release': {action: 'command_select_all'},
            '1_release': {action: 'command_select_group', group: 0},
            '2_release': {action: 'command_select_group', group: 1},
            '3_release': {action: 'command_select_group', group: 2},
            '4_release': {action: 'command_select_group', group: 3},
            '5_release': {action: 'command_select_group', group: 4},
            '6_release': {action: 'command_select_group', group: 5},
            '7_release': {action: 'command_select_group', group: 6},
            '8_release': {action: 'command_select_group', group: 7},
            '9_release': {action: 'command_select_group', group: 8},
            '0_release': {action: 'command_select_group', group: 9},
            '-_release': {action: 'command_select_group', group: 10},
            '=_release': {action: 'command_select_group', group: 11},
            '!_release_shift': {action: 'command_select_group', group: 0, incremental: true},
            '@_release_shift': {action: 'command_select_group', group: 1, incremental: true},
            '#_release_shift': {action: 'command_select_group', group: 2, incremental: true},
            '$_release_shift': {action: 'command_select_group', group: 3, incremental: true},
            '%_release_shift': {action: 'command_select_group', group: 4, incremental: true},
            '^_release_shift': {action: 'command_select_group', group: 5, incremental: true},
            '&_release_shift': {action: 'command_select_group', group: 6, incremental: true},
            '*_release_shift': {action: 'command_select_group', group: 7, incremental: true},
            '(_release_shift': {action: 'command_select_group', group: 8, incremental: true},
            ')_release_shift': {action: 'command_select_group', group: 9, incremental: true},
            '__release_shift': {action: 'command_select_group', group: 10, incremental: true},
            '+_release_shift': {action: 'command_select_group', group: 11, incremental: true},

            // Group Modifiers
            '1_release_control': {action: 'command_update_group', group: 0},
            '2_release_control': {action: 'command_update_group', group: 1},
            '3_release_control': {action: 'command_update_group', group: 2},
            '4_release_control': {action: 'command_update_group', group: 3},
            '5_release_control': {action: 'command_update_group', group: 4},
            '6_release_control': {action: 'command_update_group', group: 5},
            '7_release_control': {action: 'command_update_group', group: 6},
            '8_release_control': {action: 'command_update_group', group: 7},
            '9_release_control': {action: 'command_update_group', group: 8},
            '0_release_control': {action: 'command_update_group', group: 9},
            '-_release_control': {action: 'command_update_group', group: 10},
            '=_release_control': {action: 'command_update_group', group: 11},


            // Formations
            'R_release_shift': {action: 'command_set_formation', formation: 'grid'},
            'Q_release_shift': {action: 'command_set_formation', formation: 'o'},
            'W_release_shift': {action: 'command_set_formation', formation: 'horizontal'},
            'E_release_shift': {action: 'command_set_formation', formation: 'vertical'},


            
            // DEBUG
            'p_release': {action: 'debug_kill'},

            // Viewport Contrlols - Debug
            'j_press': {action: 'move_viewport_left'},
            'j_hold': {action: 'move_viewport_left'},
            'l_press': {action: 'move_viewport_right'},
            'l_hold': {action: 'move_viewport_right'},
            'k_press': {action:  'move_viewport_down'},
            'k_hold': {action: 'move_viewport_down'},
            'i_press': {action:  'move_viewport_up'},
            'i_hold': {action: 'move_viewport_up'},
            '\\_press': { action: 'command_destroy_selected' }
        };
    }
    
    work() {
        if (!this._core.getData('CONFIG_KEYS')) {
            this._core.publishData('CONFIG_KEYS', this.keyMap)
        }
    };
  }