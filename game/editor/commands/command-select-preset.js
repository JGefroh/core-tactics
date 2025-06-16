import BaseCommand from "./base-command";

import { default as Entity } from '@core/entity.js';

import PositionComponent from '@game/engine/position/position-component';
import RenderComponent from '@game/engine/renderer/render-component';


export default class CommandSelectPreset extends BaseCommand {
    constructor() {
        super();
        this.mode = null;
    }

    onPerform(core, system, context) {
        core.publishData('EDITOR_SELECTED_PRESET', context.preset)
    }

    canPerform(core, system, context) {
        return true;
    }

    
}