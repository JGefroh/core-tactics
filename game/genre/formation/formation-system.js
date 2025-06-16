import { default as Entity } from '@core/entity.js';
import { default as System } from '@core/system';

import { default as gridFormation } from '@game/genre/formation/grid-formation';
import { default as oFormation } from '@game/genre/formation/o-formation';
import { default as horizontalFormation } from '@game/genre/formation/horizontal-formation';
import { default as verticalFormation } from '@game/genre/formation/vertical-formation';
import { default as splitFormation } from '@game/genre/formation/split-formation';

export default class FormationSystem extends System {
    constructor() {
        super()

        this.formation = 'grid';
        this.formations = {
            'o': {fn: oFormation, spacing: 200},
            'grid': {fn: gridFormation, spacing: 50},
            'horizontal': {fn: horizontalFormation, spacing: 50},
            'vertical': {fn: verticalFormation, spacing: 50},
            'split': {fn: splitFormation, spacing: 50}
        }

        this._core.publishData('CURRENT_FORMATION', this.formation)
        this.addHandler('SET_FORMATION', (payload) => {
            this.formation = payload;
            this._core.publishData('CURRENT_FORMATION', this.formation)
        });

        this.addHandler('GET_FORMATION', (payload) => {
            let data = this.formations[this.formation].fn(payload.targetPosition.xPosition, payload.targetPosition.yPosition, payload.unitsCount, this.formations[this.formation || 'grid'].spacing);
            
            payload.callback(data);
        });
    }

    work() {
    }


}
