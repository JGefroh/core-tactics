import { GuiBaseAction } from "@game/engine/gui/actions/gui-base-action";

export class GuiLoadNew extends GuiBaseAction {
    getKey() {
        return 'LOAD_GUI'
    }

    execute(core, entity, params) {
        core.send('LOAD_GUI', params.gui)
    }
}