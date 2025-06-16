import { GoalBase } from "@game/engine/ai/goals/goal-base";

export class GoalAttack extends GoalBase {
    constructor(configuration) {
        super(configuration)
        this.configuration = configuration
        this.tacticOptions = [
            {key: 'tactic_attack', configuration: configuration}
        ]
    }

    getTacticOptions() {
        return this.tacticOptions;
    }
}