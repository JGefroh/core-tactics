import BaseCommand from "./base-command";

export default class CommandMoveCamera extends BaseCommand {
    constructor() {
        super();
    }

    onPerform(core, system, context) {
      core.send('SET_VIEWPORT', {
        xPosition: context.entity.getComponent('PositionComponent').xPosition,
        yPosition: context.entity.getComponent('PositionComponent').yPosition,
      });
    }

    canPerform() {
        return true;
    }
}