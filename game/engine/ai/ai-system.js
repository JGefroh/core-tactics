import { default as System } from '@core/system';

import AiComponent from '@game/engine/ai/ai-component';

export default class AiSystem extends System {
    constructor() {
      super();

      this.goals = {
      }

      this.tactics = {
      }

      this.actions = {
      }

      this.steps = {
      }

      this.localStateInformers = {}
      this.globalStateInformers = {}
      this.globalCurrentState = {};

      this.addHandler('SET_AI', (payload) => {
        let entity = payload.entity || this._core.getEntityWithId(payload.entityId);
        this.interruptAi(entity);

        if (payload.fullyCancel) {
          this.clearIntents(entity);
        }

        this.setEntityGoal(entity, payload.goal, payload.configuration)
      })

      this.addHandler('REGISTER_STATE_INFORMER', (payload) => {
        if (payload.scope == 'global') {
          this.globalStateInformers[payload.key] = payload.inform;
        }
        else {
          this.localStateInformers[payload.key] = payload.inform;
        }
      });

      this.addHandler('REGISTER_GOAL', (payload) => {
        this.goals[payload.key] = payload.class
      })

      this.addHandler('REGISTER_TACTIC', (payload) => {
        this.tactics[payload.key] = payload.class
      })

      this.addHandler('REGISTER_ACTION', (payload) => {
        this.actions[payload.key] = payload.class
      })

      this.addHandler('REGISTER_STEP', (payload) => {
        this.steps[payload.key] = payload.class
      })

      this.wait = 10
    }
    
    work() {
      if (this.goals == {} || this.tactics == {} || this.actions == {} || this.steps == {}) {
        return;
      }
      this.informCurrentState(this.globalStateInformers, this.globalCurrentState);
      let debugDataByEntity = {};

      this.workForTag('Ai', (tag, entity) => {
        let currentState = tag.getCurrentState();
        this.informCurrentState(this.localStateInformers, currentState);

        currentState.entityId = entity.id
        currentState.entity = entity;
        currentState.globalCurrentState = this.globalCurrentState;

        let goal = this.identifyGoal(tag, entity);
        if (!goal) {
          return;
        }
        tag.setGoal(goal);
        currentState.goalConfiguration = goal.getConfiguration() || {};

        let tactic = this.identifyTactic(goal);
        tag.setTactic(tactic);
        let action = this.identifyAction(tactic, currentState, tag)
        tag.setAction(action)
        
        if (!action) {
          return;
        }

        let steps = this.getStepsToExecute(action, currentState, tag);
        let lastStepRan = null;
        if (steps?.length) {
          lastStepRan = this.executeSteps(steps, currentState);
        }

        tag.setCurrentState(currentState)

        if (goal.isCompleted(currentState)) {
          tag.setGoal(null);
          tag.setTactic(null);
          tag.setAction(null);
          tag.setSteps(null);
          goal.onComplete(this._core, currentState);
          tag.setCurrentState({})
        }

        debugDataByEntity[entity.id] = {
          goal: goal,
          tactic: tactic,
          action: action,
          step: lastStepRan,
          currentState: currentState
        }
      });

      this.send('DEBUG_AI_DATA', debugDataByEntity);
    };

    clearIntents(entity) {
      this._core.send('INTERRUPT_INTENT', {
        entity: entity,
        intentType: 'all'
      })
    }

    interruptAi(entity) {
      let tag = this.getTag('Ai')
      if (!tag.constructor.isAssignableTo(entity)) {
        return;
      }

      tag.setEntity(entity);
      tag.setGoal(null);
      tag.setTactic(null);
      tag.setAction(null);
      tag.setSteps(null);
      tag.setCurrentState({})
    }

    informCurrentState(stateInformers, currentState) {
      Object.keys(stateInformers).forEach((key) => {
        let stateInformFunction = stateInformers[key]
        let result = stateInformFunction(currentState, this._core);
        Object.assign(currentState, result)
      })
    }

    identifyGoal(tag, entity) {
      let goal = tag.getGoal();
      if (typeof goal == 'string') {
        goal = this.setEntityGoal(entity, goal, {}); // Transform strings into Goal objects
      }
      return goal;
    }

    setEntityGoal(entity, goal, configuration) {
      if (!entity || !goal) {
        return;
      }

      let ai = this.getTag('Ai');
      ai.setEntity(entity);
      ai.setGoal(new this.goals[goal](configuration));
      ai.setCurrentState({})

      return ai.getGoal();
    }

    identifyTactic(goal) {
      let tacticOptions = goal.getTacticOptions();
      let selection = 0
      return new this.tactics[tacticOptions[selection].key](tacticOptions[selection].configuration)
    }

    identifyAction(tactic, currentState, tag) {
      let actionOptions = tactic.getActionOptions();
      let actionObjects = []
      actionOptions.forEach((actionOption) => {
        actionObjects.push(new (this.actions[actionOption.key])(actionOption.configuration))
      })

      let highestActions = [];
      actionObjects.forEach((actionObject) => {
        let action = actionObject;
        let key = actionObject.key;
        
        action.calculate(currentState, this._core);

        if (!action.getScore()) {
          return;
        }
        if (!highestActions.length) {
          highestActions.push(action);
        }
        else if (highestActions[0].getScore() == action.getScore()) {
          highestActions.push(action)
        }
        else if (highestActions[0].getScore() < action.getScore()) {
          highestActions = [action]
        }
      });

      if (tag.getAction() && !tag.getAction()?.isCompleted()) {
        let highestAction = highestActions[0]
        if (highestAction && highestAction.key == tag.getAction().key) {
          return tag.getAction()
        }
      }

      return highestActions[0];
    }

    getStepsToExecute(action, currentState, tag) {
      let stepOptions = []
      let stepObjects = null;
      

      if (action.getCurrentStepIndex() == null) {
        action.prepareAction(currentState, this._core)
        let stepOptions = action.getStepOptions();

        let stepObjects = stepOptions.map((stepOption) => { return new this.steps[stepOption.key](this._core, currentState, stepOption.configuration) });
        action.setSteps(stepObjects);
        action.setCurrentStepIndex(0)
      }

      stepObjects = action.getSteps()

      let stepsToRun = []
      stepObjects.forEach((stepObject, index) => {
        if (stepObject.alwaysRun()) {
          stepsToRun.push(stepObject);
        }

        if (stepObject.alwaysRunUntilComplete() && !stepObject.isCompleted()) {
          stepsToRun.push(stepObject);
        }
        else if (index == action.getCurrentStepIndex()) {
          if (stepObject.isCompleted()) {
            action.setCurrentStepIndex(action.getCurrentStepIndex() + 1);
          }
          else {
            stepsToRun.push(stepObject);
          }
        }
      });

      if (!stepObjects.length || stepObjects.every((stepObject) => { return stepObject.isCompleted() })) {
        action.markCompleted(currentState)
        tag.setActionLastRan(action.key)
        return null;
      }

      action.beforeActionRun(currentState, this._core)

      return stepsToRun
    }

    executeSteps(stepsToExecute, currentState) {
      let lastStepRan = null;
      stepsToExecute.forEach((stepToExecute) => {
        if (stepToExecute.isNotStarted()) {
          stepToExecute.setState('in_progress');
          stepToExecute.executeStep(currentState);
          lastStepRan = stepToExecute;
        } else if (stepToExecute.isInProgress() && stepToExecute.checkCompleted(currentState)) {
            stepToExecute.setState('completed');
            if (stepToExecute.alwaysRun()) {
              stepToExecute.executeStep(currentState);
              lastStepRan = stepToExecute;
            }
        } else if (stepToExecute.isInProgress()) {
            stepToExecute.executeStep(currentState);
            lastStepRan = stepToExecute;
        }
      });

      return lastStepRan;
    }

    deleteKeysNotInObject(obj1, obj2) {
      for (let key in obj1) {
          if (!obj2.hasOwnProperty(key)) {
              delete obj1[key];
          }
      }
    }
  }
  