import BaseCommand from "./base-command";

import { default as Entity } from '@core/entity.js';

import PositionComponent from '@game/engine/position/position-component';
import RenderComponent from '@game/engine/renderer/render-component';


export default class CommandAdjustSize extends BaseCommand {
    constructor() {
        super();
        this.mode = null;
    }

    onPerform(core, system, context) {
        console.info("HM")
        core.publishData('EDITOR_SELECTED_SIZE', (core.getData('EDITOR_SELECTED_SIZE') || 32) + context.amount)
    }

    canPerform(core, system, context) {
        return true;
    }

    
}