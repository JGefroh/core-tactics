import { GoalBase } from "@game/engine/ai/goals/goal-base";

export class GoalDefend extends GoalBase {
    constructor(configuration) {
        super(configuration)
        this.configuration = configuration
        this.tacticOptions = [
            {key: 'tactic_defend', configuration: configuration}
        ]
    }

    getTacticOptions() {
        return this.tacticOptions;
    }
}