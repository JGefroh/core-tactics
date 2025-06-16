import BaseCommand from "./base-command";

export default class CommandDestroySelected extends BaseCommand {
  constructor() {
    super();
  }

  onPerform(core, system, context) {
    let units = context.currentSelectedEntities;
    units.forEach((unit) => {
      core.send('REQUEST_DAMAGE', { entity: unit, amount: Infinity});
    })
  }

  canPerform() {
    return true;
  }
}