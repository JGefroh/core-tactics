import BaseCommand from "./base-command";

export default class CommandSelectUnit extends BaseCommand {
    constructor() {
        super();
    }

    onPerform(core, system, context) {
      if (!context.entity) {
        return;
      }
       this.setCurrentSelected(system, context.entity, context.incremental);
    }

    canPerform(core, system, context) {
      let lastTimestamp = core.getData('SELECTION_BOX_LAST_TIMESTAMP');
      if (!lastTimestamp || (lastTimestamp + 300 < Date.now())) {
        return true;
      }

      return false;
    }

    setCurrentSelected(system, selectedEntity, incremental = false) {
      system.workForTag('PlayerControllable', (tag, entity) => {
        if (selectedEntity?.id == entity?.id) {
          tag.setCurrentlyControlled(!tag.isCurrentlyControlled())
        }
        else if (!incremental && tag.isCurrentlyControlled()) {
          tag.setCurrentlyControlled(false)
        }
      })
    }
}