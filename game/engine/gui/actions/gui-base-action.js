export class GuiBaseAction {
    constructor() {
    }

    getActionKey() {
        return this.actionKey;
    }

    execute(core, entity, params) {
        core.send(params.eventName, {entity: entity, ...params});
    }
}