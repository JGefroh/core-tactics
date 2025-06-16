import { StepBase } from '@game/engine/ai/steps/step-base';
import { distanceFromTo } from '@game/utilities/distance-util';

export class StepIdle extends StepBase {
    constructor(core, currentState, configuration) {
        super(configuration)
        this._core = core;
    }

    execute(currentState) {
    }

    checkCompleted(currentState) {
        return false;
    }
}