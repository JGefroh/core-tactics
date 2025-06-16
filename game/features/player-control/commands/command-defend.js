import BaseCommand from "./base-command";

export default class CommandDefend extends BaseCommand {
  constructor() {
    super();
  }

  onPerform(core, system, context) {
    let units = context.currentSelectedEntities;
    context.unitsCount = units.length;

    units.forEach((unitEntity, index) => {
      core.send('SET_AI', {
        entity: unitEntity,
        goal: 'goal_defend',
        fullyCancel: true,
        configuration: {
        }
      })
    })
  }

  canPerform() {
    return true;
  }
}