import { StepBase } from '@game/engine/ai/steps/step-base';
import { distanceFromTo } from '@game/utilities/distance-util';

export class StepTurnTowardsTarget extends StepBase {
    constructor(core, currentState, configuration) {
        super(configuration)
        this._core = core;
    }

    execute(currentState) {
        const entity = currentState.entity;
        let target = currentState.goalConfiguration?.target || currentState.targetEntity;

        if (!entity || !target) return;

        if (target.id) {
            target = target.getComponent('PositionComponent');
        }

        const position = entity.getComponent('PositionComponent');
        if (!position) return;

        const dx = target.xPosition - position.xPosition;
        const dy = target.yPosition - position.yPosition;
        const angleToTarget = Math.atan2(dy, dx) * (180 / Math.PI);

        // Normalize angle to [0, 360)
        const normalizedAngle = (angleToTarget + 360) % 360;

        position.angleDegrees = normalizedAngle;
    }

    checkCompleted(currentState) {
        return true;
    }
}