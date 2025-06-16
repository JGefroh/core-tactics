export class TacticMove {
    constructor(configuration = {}) {
        this.configuration = configuration;
        this.actionOptions = [
            {key: 'action_move_towards_target', configuration: {calculateScore: this._calculateScoreForActionMoveTowardsTarget}},
        ]
    }

    getActionOptions() {
        return this.actionOptions;
    }

    _calculateScoreForActionMoveTowardsTarget(currentState, core) {
        return 100;
    }
}