import { ActionBase } from '@game/engine/ai/actions/action-base';

export class ActionSelectTarget extends ActionBase {
    constructor(configuration) {
        super(configuration)
        this.key = 'action_select_target'
        this.cooldown = 0;
        this.stepOptions = [
            {key: 'step_idle'}
        ]
    }

    beforeActionRun(currentState, core) {
        if (currentState.goalConfiguration?.targetEntity?.id) {
            currentState.targetEntity = currentState.goalConfiguration.targetEntity;
            return;
        } 
        else if (currentState.targetEntity?.id) {
            return;
        }

        let targets = currentState.potentialTargets;
        if (!targets) {
            return;
        }
        currentState.targetEntity = this._randomFrom(targets.close)
        if (!currentState.targetEntity) {
            currentState.targetEntity = this._randomFrom(targets.far.slice(0, 3));
        }
    }


    _randomFrom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}