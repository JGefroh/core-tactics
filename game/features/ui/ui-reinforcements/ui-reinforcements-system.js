import { default as System } from '@core/system';
import { default as Entity } from '@core/entity.js'

import { uiSettings } from '../ui-settings';

export default class UiReinforcementsSystem extends System {
    constructor() {
      super()

      this.buttonWidth = 150;
      this.buttonHeight = 32;
      this.panelY = 0
      this.panelX = 10
  }

  initialize() {
    this.addLabel(1, 'Reinforce - Select a squad')
    this.addButton(2, 'Squad Heavy | 8x Tanks', 8, 'tank')
    this.addButton(3, 'Squad Medium | 10x Gunners', 10, 'gunner')
    this.addButton(4, 'Squad Light | 12x Slicers', 12, 'slicer')
    this.addButton(5, 'Squad Support | 5x Sniper', 5, 'sniper')

    this.addHandler('SHOW_REINFORCEMENTS_SCREEN', () => {
      this.send("GUI_UPDATE_VISIBLE", {
        relatedKeyPrefix: 'ui-reinforcement-select',
        isVisible: true
      });
    })
  }

  addLabel(index, label) {
    this.send('ADD_GUI_RENDERABLE', {
      key: 'ui-reinforcement-select-label-reinforcements',
      width: this.buttonWidth * 2,
      height: this.buttonHeight,
      canvasXPosition: this.panelX,
      canvasYPosition: this.panelY + (index * this.buttonHeight),
      fontSize: 14,
      lineDash: [5,5],
      text: label,
      textOffsetY: 12,
      isVisible: false
    });
  }

  addButton(index, label, count, unitType) {
    this.send('ADD_GUI_RENDERABLE', {
        key: `ui-reinforcement-select-button-reinforce-${index}`,
        width: this.buttonWidth * 2,
        height: this.buttonHeight,
        canvasXPosition: this.panelX,
        canvasYPosition: this.panelY + (index * this.buttonHeight),
        fontSize: 18,
        lineDash: [5,5],
        fillStyle: 'rgba(0,0,0,1)',
        strokeStyle: 'rgba(255,255,255,0.5)',
        text: label,
        textOffsetX: 24,
        textOffsetY: 7,
        isVisible: false,
        activeStyle: {
            fillStyle: 'rgba(255,255,255,0.5)',
            fontColor: 'rgba(0,0,0,1)',
        },
        onClick: (core) => {
                this.send('CREATE_SQUAD', {
                    count: count,
                    faction: 'player',
                    unitType: unitType
                })

                this.send("GUI_UPDATE_VISIBLE", {
                  relatedKeyPrefix: 'ui-reinforcement-select'
                });
        },
        isActive: (core) => {
            // return core.getData('CURRENT_FORMATION') == value;
        }
      });
  }
}
  