import { ActionBase } from '@game/engine/ai/actions/action-base';

export class ActionIdle extends ActionBase {
    constructor(configuration) {
        super(configuration)
        this.score = 0;
        this.key = 'action_idle'
        this.cooldown = 0;
        this.stepOptions = [
            {key: 'step_idle'},
        ]
    }

    beforeActionRun(currentState, core) {
    }
}