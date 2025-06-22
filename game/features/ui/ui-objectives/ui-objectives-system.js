import { default as System } from '@core/system';
import { default as Entity } from '@core/entity.js'

import { uiSettings } from '../ui-settings';
import FactionComponent from '../../../genre/factions/faction-component';

export default class UiObjectivesSystem extends System {
    constructor() {
      super()

      this.wait = 1000;
  }

  initialize() {
    this.addLabel()
    
    this.addReinforcements(window.innerWidth / 2 - 100, 30, 'ally')
    this.addReinforcements(window.innerWidth / 2 + 100, 30, 'enemy')
  }

  work() {
    let reinforcements = this._core.getData('REINFORCEMENTS');
    if (!reinforcements) {
        return;
    }
    this.updateReinforcements('ally', reinforcements['ally'])
    this.updateReinforcements('enemy', reinforcements['enemy'])

  }

  addLabel() {
    this.send('ADD_GUI_RENDERABLE', {
        key: `reinforcements-label`,
        width: 128,
        height: 32,
        canvasXPosition: window.innerWidth / 2 - 40,
        canvasYPosition: 0,
        fontSize: 18,
        strokeStyle: uiSettings.borderColor,
        text: "Reinforcements remaining",
        textOffsetX: 8,
        textOffsetY: 4
    });
  }

  addReinforcements(x, y, faction) {
    this.send('ADD_GUI_RENDERABLE', {
        key: `reinforcements-${faction}-label`,
        width: 128,
        height: 32,
        canvasXPosition: x,
        canvasYPosition: y,
        fillStyle: FactionComponent.getFactionColor(faction),
        strokeStyle: uiSettings.borderColor,
        fontSize: 18,
        text: faction.toUpperCase(),
        textOffsetX: 8,
        textOffsetY: 6,
    });
    this.send('ADD_GUI_RENDERABLE', {
        key: `reinforcements-${faction}`,
        width: 128,
        height: 32,
        canvasXPosition: x + 110,
        canvasYPosition: y,
        fontSize: 18,
        textOffsetX: 8,
        textOffsetY: 6,
        textAlign: 'right'
    });
  }

  updateReinforcements(faction, amount) {
     this.send('GUI_UPDATE_PROPERTIES', {
      key: `reinforcements-${faction}`,
      value: {
        text: `${Math.max(amount, 0)}`
      }
    });
  }
}
  