export class TacticDefend {
    constructor(configuration = {}) {
        this.configuration = configuration;
        this.actionOptions = [
            {key: 'action_select_target', configuration: {calculateScore: this._calculateScoreForActionSelectTarget}},
            {key: 'action_attack_target', configuration: {calculateScore: this._calculateScoreForActionAttackTarget}},
            {key: 'action_idle', configuration: {calculateScore:  () => {return 1}}},
        ]
    }

    getActionOptions() {
        return this.actionOptions;
    }

    _calculateScoreForActionSelectTarget(currentState, core) {
        if (!currentState?.targetEntity?.id) {
            return 100;
        }
        return 0;
    }

    _calculateScoreForActionAttackTarget(currentState, core) {
        if (currentState?.targetEntity?.id && currentState.isInRange) {
            return 100;
        };
        return 0;
    }
}