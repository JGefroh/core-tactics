import { GuiBaseAction } from "./gui-base-action";

export class GuiSend extends GuiBaseAction {
    getKey() {
        return 'SEND'
    }

    execute(core, entity, params) {
        core.send(params.event, params);
    }
}