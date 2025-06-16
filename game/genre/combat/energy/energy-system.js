import { default as Entity } from '@core/entity.js';
import { default as System } from '@core/system';

import CollisionComponent from '@game/engine/collision/collision-component';
import HitscanTargetComponent from '@game/engine/hitscan/hitscan-target-component';
import VectorComponent from '@game/engine/movement/vector-component';
import PositionComponent from '@game/engine/position/position-component';
import RenderComponent from '@game/engine/renderer/render-component';
import AiComponent from '@game/engine/ai/ai-component';
import MaterialComponent from '@game/engine/material/material-component';
import HealthComponent from './energy-component';


export default class EnergySystem extends System {
    constructor() {
        super()
    }

    initialize() {
        this.addHandler('REQUEST_ENERGY', (payload) => {
            this.handleRequestEnergy(payload)
        });
    }

    work() {

    }

    handleRequestEnergy(payload) {
        this.workForEntityWithTag(payload.entity, 'HasEnergy', (entity, tag) => {
            tag.adjust(payload.amount);
            if (payload.amount > 0) {
                tag.onEnergyLoss();
            }

            if (tag.isEnergyZero()) {
                tag.onEnergyZero();
            }
        });
    }
}
