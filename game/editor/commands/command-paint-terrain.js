import BaseCommand from "./base-command";

import { default as Entity } from '@core/entity.js';

import PositionComponent from '@game/engine/position/position-component';
import RenderComponent from '@game/engine/renderer/render-component';


export default class CommandPaintTerrain extends BaseCommand {
    constructor() {
        super();
        this.mode = null;

        this.terrainsByPreset = {
            0: 'TERRAIN_GRASS',
            1: 'TERRAIN_DIRT',
            2: 'TERRAIN_ROCKS'
        }
    }

    onStart(core, system, context) {
    }

    onContinue(core, system, context) {
        let x = context.xPosition;
        let y = context.yPosition;
        let size =  context.selectedSize || 32;
        let snappedX = Math.floor(x / size) * size;
        let snappedY = Math.floor(y / size) * size;
        let terrain = this.terrainsByPreset[context.selectedPreset] || 'TERRAIN_GRASS';
        // let shape = 'circle';
        let shape = 'rectangle'
        let key =  `painted-terrain-${snappedX}-${snappedY}-${size}`;

        if (!core.getEntityWithKey(key)) {
            this.createEntity(core, key, snappedX, snappedY, size, terrain, shape)
        }
        else {
            this.updateEntity(core.getEntityWithKey(key), terrain);
        }
    }

    onEnd(core, system, context) {
    }

    updateEntity(entity, terrain) {
        entity.getComponent('RenderComponent').imagePath = terrain;
    }

    createEntity(core, key, snappedX, snappedY, size, terrain, shape) {
        let entity = new Entity({key: key})

        entity.addComponent(new PositionComponent(
            {
                width: size,
                height: size,
                xPosition: snappedX,
                yPosition: snappedY,
            }
        ));
        entity.addComponent(new RenderComponent({
            width: size,
            height: size,
            shape: shape || 'rectangle',
            angleDegrees: 0,
            renderLayer: 'TERRAIN',
            imagePath: terrain,
            imageStyle: 1024,
            imageType: 'continuous'
        }))
        core.addEntity(entity);
    }

    canPerform(core, system, context) {
        return true;
    }

    
}