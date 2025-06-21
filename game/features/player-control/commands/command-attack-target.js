import BaseCommand from "./base-command";

export default class CommandAttackTarget extends BaseCommand {
    constructor() {
        super();
    }

    onPerform(core, system, context) {
        let units = context.currentSelectedEntities;

        if (context.entity.getComponent('FactionComponent')?.faction == 'ally') {
          return;
        }

        units.forEach((unitEntity) => {
          core.send('SET_AI', {
            entity: unitEntity,
            goal: 'goal_attack',
            configuration: {
              targetEntity: context.entity
            }
          })
        })

        if (context.entity) {
          // If there was a specific enemy attacked, use appropriate FX.
          core.send('EXECUTE_FX', {
            fxKey: 'FxCommandAttack',
            params: {
              xPosition: context.entity.getComponent('PositionComponent').xPosition,
              yPosition: context.entity.getComponent('PositionComponent').yPosition 
            },
          })
        }

        
    }

    canPerform() {
        return true;
    }
}