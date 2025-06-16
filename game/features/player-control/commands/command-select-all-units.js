import BaseCommand from "./base-command";

export default class CommandSelectAllUnits extends BaseCommand {
    constructor() {
        super();
    }

    onPerform(core, system, context) {
       this.setCurrentSelected(core, system);
    }

    canPerform() {
        return true;
    }

    setCurrentSelected(core, system) {
      let allControlled = true;
      let firstEntity = null;
      system.workForTag('PlayerControllable', (tag, entity) => {
        if (!tag.isCurrentlyControlled()) {
          allControlled = false;
        }
        tag.setCurrentlyControlled(true);
        firstEntity ||= entity;
      })

      if (allControlled && firstEntity) {
        // All of them are selected
        core.send('PLAYER_COMMAND', { command: 'moveCamera', entity: firstEntity })
      }
    }
}