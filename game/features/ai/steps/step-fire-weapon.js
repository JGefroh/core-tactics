import { StepBase } from '@game/engine/ai/steps/step-base';
import { distanceFromTo } from '@game/utilities/distance-util';

export class StepFireWeapon extends StepBase {
    constructor(core, currentState, configuration) {
        super(configuration)
        this._core = core;
    }

    execute(currentState) {
        let entity = currentState.entity;
        this._core.send('INTEND', {id: this.getStepId(), intentType: 'ATTACK', entity: entity, params: {
            targetEntity: currentState.targetEntity
        }})
    }

    checkCompleted(currentState) {
        const entity = currentState.entity;
        let intent = this._getIntent(entity);
        return intent;
    }

    _getIntent(entity) {
        let intentComponent = entity.getComponent('IntentComponent');
        if (!intentComponent) {
            return;
        }

        let intent = intentComponent.getIntentById(this.getStepId());
        if (!intent) {
            return;
        }

        return intent;
    }
}