export class GoalBase {
    constructor(configuration) {
        this.configuration = configuration
        this.tacticOptions = [
        ]
    }

    getTacticOptions() {
        return this.tacticOptions;
    }

    getConfiguration() {
        return this.configuration;
    }

    isCompleted() {
        return false;
    }

    onComplete() {
    }
}