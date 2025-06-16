import { GoalBase } from "@game/engine/ai/goals/goal-base";

export class GoalMove extends GoalBase {
    constructor(configuration) {
        super(configuration);
        this.configuration = configuration
        this.tacticOptions = [
            {key: 'tactic_move', configuration: configuration}
        ]
    }

    getTacticOptions() {
        return this.tacticOptions;
    }

    isCompleted(currentState) {
        return currentState.isNearTarget;
    }

    onComplete(core, currentState) {
        core.send('SET_AI', {
            entity: currentState.entity,
            goal: 'goal_defend'
        });
    }
}