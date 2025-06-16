import BaseCommand from "./base-command";

export default class CommandSetFormation extends BaseCommand {
    constructor() {
        super();
    }

    onPerform(core, system, context) {
        core.send('SET_FORMATION', context.formation);

        let targetPosition = core.getData('CURSOR_COORDINATES')?.world;
        core.send('PLAYER_COMMAND', {command: 'moveTo', targetPosition: targetPosition}); // force a new move
    }

    canPerform() {
        return true;
    }
}