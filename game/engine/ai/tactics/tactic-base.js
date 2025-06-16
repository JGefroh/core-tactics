export class TacticBase extends TacticBase {
    constructor(configuration = {}) {
        this.configuration = configuration;
        this.actionOptions = [
        ]
    }

    getActionOptions() {
        return this.actionOptions;
    }
}