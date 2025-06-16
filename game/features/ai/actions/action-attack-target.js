import { ActionBase } from '@game/engine/ai/actions/action-base';

export class ActionAttackTarget extends ActionBase {
    constructor(configuration) {
        super(configuration)
        this.score = 0;
        this.key = 'action_attack_target'
        this.cooldown = 0;
        this.stepOptions = [
            {key: 'step_turn_towards_target', configuration: {alwaysRun: true}},
            {key: 'step_fire_weapon'}
        ]
    }

    beforeActionRun(currentState, core) {
    }
}