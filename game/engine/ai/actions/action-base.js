export class ActionBase {
    constructor(configuration = {}) {
        this.stepOptions = []
        this.score = 0;
        this.state = 'not_started'
        this.currentStepIndex = null;
        this.configuration = configuration || {}
    }

    getStepOptions() {
        return this.stepOptions;
    }

    getSteps() {
        return this.stepObjects;
    }

    setSteps(steps) {
        this.stepObjects = steps;
    }

    calculate(currentState, core) {
        if (this.configuration.calculateScore) {
            this.score = this.configuration.calculateScore(currentState, core);
        }
    }

    getKey() {
        return this.key;
    }

    getScore() {
        return this.score;
    }

    isCompleted() {
        return this.state == 'completed'
    }

    markCompleted(currentState) {
        this.state = 'completed'
        this.onActionCompleted(currentState);
    }

    prepareAction(currentState) {
        // Configure the action before it runs for the first time.
    }

    beforeActionRun(currentState, core) {
        // Before every action run, do this.
    }

    getCurrentStepIndex() {
        return this.currentStepIndex;
    }
    setCurrentStepIndex(stepIndex) {
        this.currentStepIndex = stepIndex;
    }

    isInCooldown(lastRun) {
        if (lastRun && this.cooldown) {
            return lastRun + this.cooldown >= Date.now() 
        }
        return false;
    }

    onActionCompleted(currentState) {
        
    }
}