import { ActionBase } from '@game/engine/ai/actions/action-base';

export class ActionSelectTarget extends ActionBase {
    constructor(configuration) {
        super(configuration)
        this.key = 'action_select_target'
        this.cooldown = 0;
        this.stepOptions = [
            {key: 'step_idle'}
        ]
    }

    beforeActionRun(currentState, core) {
        if (currentState.goalConfiguration?.targetEntity?.id) {
            currentState.targetEntity = currentState.goalConfiguration.targetEntity;
            return;
        } 
        else if (currentState.targetEntity?.id) {
            return;
        }

        let targets = currentState.potentialTargets;
        if (!targets) {
            return;
        }

        if (currentState.entity.hasLabel('UnitType:slicer')) {
            currentState.targetEntity = this.selectFrom(targets.near, 'UnitType:sniper') || this.selectFrom(targets.far, 'UnitType:sniper') || this.selectFrom(targets.near) || this.selectFrom(targets.far);
            if (currentState.targetEntity) {
                return;
            }
        }
        
        currentState.targetEntity = this._randomFrom(targets.close)
        if (!currentState.targetEntity) {
            currentState.targetEntity = this._randomFrom(targets.far.slice(0, 3));
        }
    }

    selectFrom(collection, label) {
        if (!collection?.length) {
            return;
        }
        let prospects = collection.filter((entity) => {
            return !label || entity.hasLabel(label)
        });

        if (!prospects.length) {
            return null;
        }

        return this._randomFrom(prospects);
    }


    _randomFrom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}