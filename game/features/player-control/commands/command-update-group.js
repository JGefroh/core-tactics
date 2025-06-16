import BaseCommand from "./base-command";

export default class CommandUpdateGroup extends BaseCommand {
    constructor() {
        super();
    }

    onPerform(core, system, context) {
       this.updateGroup(core, system, context);
    }

    canPerform() {
        return true;
    }

    updateGroup(core, system, context) {
      let groupableTag = core.getTag('Groupable');
      system.workForTag('PlayerControllable', (tag, entity) => {
        if (!groupableTag.constructor.isAssignableTo(entity)) {
          return;
        }
        groupableTag.setEntity(entity);

        if (tag.isCurrentlyControlled()) {
          groupableTag.setGroup(context.group)
        }
        else if (groupableTag.getGroup() == context.group) {
          groupableTag.setGroup(null)
        }
      })
    }
}