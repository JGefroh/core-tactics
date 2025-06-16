import { default as System } from '@core/system';
import { default as Core}  from '@core/core';
import { default as Entity } from '@core/entity.js'

import guiMainMenu from './screens/gui-main-menu';
import guiSettings from './screens/gui-settings';
import guiHowToPlay from './screens/gui-how-to-play';
import guiMainGame from './screens/gui-main-game';

import { GuiLoadNew } from './actions/gui-load-new';
import { GuiGoToSite } from './actions/gui-go-to-site';


// Attachable GUI elements
import UiHealthBar from '@game/features/ui/elements/ui-health-bar';
import UiEnergyBar from '@game/features/ui/elements/ui-energy-bar';
import UiUnitSelected from '@game/features/ui/elements/ui-unit-selected';
import UiUnitProfile from '@game/features/ui/elements/ui-unit-profile';
import UiUnitName from '@game/features/ui/elements/ui-unit-name';

export default class GuiConfigurationSystem extends System {
    constructor() {
        super()
    }

    initialize() {
        this.send('REGISTER_GUI_ACTION', GuiLoadNew)
        this.send('REGISTER_GUI_ACTION', GuiGoToSite)
        
        this.send('REGISTER_GUI', {key: 'main-menu', definition: guiMainMenu})
        this.send('REGISTER_GUI', {key: 'how-to-play', definition: guiHowToPlay})
        this.send('REGISTER_GUI', {key: 'main-game', definition: guiMainGame})
        // this.send('REGISTER_GUI', {key: 'example-layout', definition: layoutGuiConfiguration})


      let guiElements = {
        'UI_HEALTH_BAR': UiHealthBar,
        'UI_ENERGY_BAR': UiEnergyBar,
        'UI_UNIT_NAME': UiUnitName,
        'UI_UNIT_SELECTED': UiUnitSelected,
        'UI_UNIT_PROFILE': UiUnitProfile,
      }

        for (const [key, value] of Object.entries(guiElements)) {
              this.send('REGISTER_ATTACHABLE_GUI_ELEMENT', {markerName: key, elementClass: value})
        }

        
    }
  }