import { ActionBase } from '@game/engine/ai/actions/action-base';
import { calculateDistanceBetweenPositions } from '@game/engine/position/distance.js';

export class ActionMoveTowardsTarget extends ActionBase {
    constructor(configuration) {
        super(configuration)
        this.score = 0;
        this.key = 'action_move_towards_target'
        this.cooldown = 0;
        this.stepOptions = [
            { key: 'step_move_towards_target' },
            { key: 'step_idle' },
        ]
    }

    beforeActionRun(currentState, core) {
        currentState.isNearTarget = false;
    }

    onActionCompleted(currentState) {
        currentState.isNearTarget = true;
    }
}