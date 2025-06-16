import BaseCommand from "./base-command";

export default class CommandMoveTo extends BaseCommand {
  constructor() {
    super();
  }

  onPerform(core, system, context) {
    let units = context.currentSelectedEntities;
    context.unitsCount = units.length;

    context.callback = (data) => {
      let formation = data;
      units.forEach((unitEntity, index) => {
        core.send('SET_AI', {
          entity: unitEntity,
          goal: 'goal_move',
          configuration: {
            targetPosition: {
              xPosition: formation[index].xPosition,
              yPosition: formation[index].yPosition
            }
          }
        })
        core.send('EXECUTE_FX', {
          fxKey: 'FxCommandMove',
          params: {
            xPosition: formation[index].xPosition,
            yPosition: formation[index].yPosition
          },
        })
      })
    }
    core.send('GET_FORMATION', context)
  }

  canPerform() {
    return true;
  }
}