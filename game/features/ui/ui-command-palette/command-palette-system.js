import { default as System } from '@core/system';
import { default as Entity } from '@core/entity.js'

import { uiSettings } from '../ui-settings';

export default class CommandPaletteSystem extends System {
    constructor() {
      super()

      this.buttonWidth = 100;
      this.buttonHeight = 32;
      this.panelY = window.innerHeight - 202;
      this.panelX = window.innerWidth - 200;
  }

  initialize() {

    this.addLabel(16, this.panelY - 160, 'Formation');
    this.addFormationButton(0, 'Grid', 'grid', 'ICON_GRID');
    this.addFormationButton(1, 'Circle', 'o', 'ICON_CIRCLE');
    this.addFormationButton(2, 'Horizontal', 'horizontal', 'ICON_HLINE');
    this.addFormationButton(3, 'Vertical', 'vertical', 'ICON_VLINE');

    // this.addAttackButton();
    // this.addDefendButton();

    this.addShortcutButton(220, this.panelY + 22, 'S', 'defend', 'ICON_STOP')
    this.addShortcutButton(220, this.panelY + 62, 'A', 'attackTarget', 'ICON_ATTACK')
    // this.addShortcutButton(220, this.panelY + 80, 'D', null)
    // this.addShortcutButton(220, this.panelY + 120, 'D', null)
    // this.addShortcutButton(220, this.panelY + 160, 'D', null)
  }

  addShortcutButton(x, y, label, value, image) {
     this.send('ADD_GUI_RENDERABLE', {
        key: `button-action-${value}-bg`,
        width: 32,
        height: 32,
        canvasXPosition: x,
        canvasYPosition: y,
        fontSize: 18,
        fillStyle: uiSettings.backgroundColor,
        strokeStyle: uiSettings.borderColor,
        activeStyle: {
            fillStyle: uiSettings.backgroundActiveColor,
            fontColor: uiSettings.backgroundColor,
        },
        onClick: (core) => {
            core.send('PLAYER_COMMAND', { command: value })
        },
        isActive: (core) => {
            return core.getData('CURRENT_FORMATION') == value;
        }
    });
    this.send('ADD_GUI_RENDERABLE', {
        key: `button-action-${value}-icon`,
        width: 32,
        height: 32,
        canvasXPosition: x,
        canvasYPosition: y,
        imagePath: image, 
        activeStyle: {
            fillStyle: uiSettings.borderColor,
            fontColor: uiSettings.backgroundColor,
        }
      });
  }

  addLabel(x, y, label) {
    this.send('ADD_GUI_RENDERABLE', {
      key: 'button-formation-label',
      width: this.buttonWidth * 2,
      height: this.buttonHeight,
      canvasXPosition: x,
      canvasYPosition: y,
      fontSize: 14,
      text: label,
      textOffsetY: 12
    });
  }

  addFormationButton(index, label, value, image) {
    this.send('ADD_GUI_RENDERABLE', {
        key: `button-formation-${value}-bg`,
        width: 32,
        height: 32,
        canvasXPosition: 16 + (index % 4 * 46) ,
        canvasYPosition: this.panelY - 120 + (index < 4 ? 0 : 38),
        fontSize: 18,
        fillStyle: uiSettings.backgroundColor,
        strokeStyle: uiSettings.borderColor,
        activeStyle: {
            fillStyle: uiSettings.backgroundActiveColor,
            fontColor: uiSettings.backgroundColor,
        },
        onClick: (core) => {
            core.send('SET_FORMATION', value)
        },
        isActive: (core) => {
            return core.getData('CURRENT_FORMATION') == value;
        }
    });
    this.send('ADD_GUI_RENDERABLE', {
        key: `button-formation-${value}-icon`,
        width: 32,
        height: 32,
        canvasXPosition: 16 + (index % 4 * 46) ,
        canvasYPosition: this.panelY - 120 + (index < 4 ? 0 : 38),
        imagePath: image, 
        activeStyle: {
            fillStyle: uiSettings.borderColor,
            fontColor: uiSettings.backgroundColor,
        },
        onClick: (core) => {
            core.send('SET_FORMATION', value)
        }
      });
    // this.send('ADD_GUI_RENDERABLE', {
    //     key: `button-formation-${value}`,
    //     width: 32,
    //     height: 32,
    //     xPosition: 16 + (index * 46),
    //     yPosition: this.panelY - 120,
    //     fontSize: 18,
    //     fillStyle: uiSettings.backgroundColor,
    //     strokeStyle: uiSettings.borderColor,
    //     imagePath: image, 
    //     activeStyle: {
    //         fillStyle: uiSettings.borderColor,
    //         fontColor: uiSettings.backgroundColor,
    //     },
    //     onClick: (core) => {
    //         core.send('SET_FORMATION', value)
    //     },
    //     isActive: (core) => {
    //         return core.getData('CURRENT_FORMATION') == value;
    //     }
    //   });
  }

  addAttackButton() {
      this.send('ADD_GUI_RENDERABLE', {
        key: 'button-attack',
        width: this.buttonWidth,
        height: this.buttonHeight,
        canvasXPosition: this.panelX,
        canvasYPosition: this.panelY,
        fontSize: 18,
        fillStyle: uiSettings.backgroundColor,
        strokeStyle: uiSettings.borderColor,
        text: 'Attack',
        textOffsetX: 24,
        textOffsetY: 7,
        onClick: () => {
            this.send('INPUT_RECEIVED', { action: 'command_posture_attack'});
        }
      });
  }

  addDefendButton() {
      this.send('ADD_GUI_RENDERABLE', {
        key: 'button-defend',
        width: this.buttonWidth,
        height: this.buttonHeight,
        canvasXPosition: this.panelX + this.buttonWidth,
        canvasYPosition: this.panelY,
        fontSize: 18,
        fillStyle: uiSettings.backgroundColor,
        strokeStyle: uiSettings.borderColor,
        text: 'Defend',
        textOffsetX: 24,
        textOffsetY: 7,
        onClick: () => {
            this.send('INPUT_RECEIVED', { action: 'command_posture_defend'});
        }
      });
  }
  
  addAbilityButton(index, ability) {
    this.send('ADD_GUI_RENDERABLE', {
      key: 'button-defend',
      width: this.buttonWidth,
      height: this.buttonHeight,
      canvasXPosition: this.panelX + this.buttonWidth * 2 + 14,
      canvasYPosition: this.panelY + this.buttonHeight * index,
      fontSize: 18,
      lineDash: [5,5],
      fillStyle: uiSettings.backgroundColor,
      strokeStyle: uiSettings.borderColor,
      text: ability,
      textOffsetX: 24,
      textOffsetY: 7,
      onClick: () => {
          // this.send('INPUT_RECEIVED', { action: 'command_posture_defend'});
      }
    });
  }
}
  