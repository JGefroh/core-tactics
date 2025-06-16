import BaseCommand from "./base-command";

export default class CommandSelectGroup extends BaseCommand {
    constructor() {
        super();
    }

    onPerform(core, system, context) {
       this.setCurrentSelected(core, system, context);
    }

    canPerform() {
        return true;
    }

    setCurrentSelected(core, system, context) {
      let groupableTag = core.getTag('Groupable');
      system.workForTag('PlayerControllable', (tag, entity) => {
        if (!groupableTag.constructor.isAssignableTo(entity)) {
          return;
        }
        groupableTag.setEntity(entity);

        if (groupableTag.getGroup() == context.group) {
          if (tag.isCurrentlyControlled()) {
            // Already selected, so move the camera.
            core.send('PLAYER_COMMAND', { command: 'moveCamera', entity: entity })
          }
          tag.setCurrentlyControlled(true);
        }
        else if (!context.incremental) {
          tag.setCurrentlyControlled(false)
        }
      })
    }
}