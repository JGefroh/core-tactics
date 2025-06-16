import { StepBase } from '@game/engine/ai/steps/step-base';
import { distanceFromTo } from '@game/utilities/distance-util';

export class StepMoveTowardsTarget extends StepBase {
    constructor(core, currentState, configuration) {
        super(configuration)
        this._core = core;
    }

    execute(currentState) {
        const entity = currentState.entity;
        if (!this._getIntent(entity)) {
            this._core.send('INTEND', {id: this.getStepId(), intentType: 'MOVEMENT', entity: entity, params: {
                targetPosition: currentState.goalConfiguration?.targetPosition,
                targetEntity: currentState.targetEntity,
                distanceTo:  currentState.targetEntity ? currentState.range : 10
            }})
        }
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