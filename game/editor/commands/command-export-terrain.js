import BaseCommand from "./base-command";

import { default as Entity } from '@core/entity.js';

import PositionComponent from '@game/engine/position/position-component';
import RenderComponent from '@game/engine/renderer/render-component';


export default class CommandExportTerrain extends BaseCommand {
    constructor() {
        super();
    }

    onPerform(core, system, context) {
        let results = [];
        core.getEntities().forEach((entity) => {
            if (!entity.key) {
                return;
            }

            if (entity.key.startsWith('painted-terrain')) {
                results.push({
                    xPosition: entity.getComponent('PositionComponent').xPosition,
                    yPosition: entity.getComponent('PositionComponent').yPosition,
                    width: entity.getComponent('PositionComponent').width,
                    height: entity.getComponent('PositionComponent').height,
                    imageKey: entity.getComponent('RenderComponent').imagePath,
                    imageStyle: entity.getComponent('RenderComponent').imageStyle
                })
            }
        });
        const string = JSON.stringify(results, null, 2);
        navigator.clipboard.writeText(string);
    }

    canPerform(core, system, context) {
        return true;
    }

    
}