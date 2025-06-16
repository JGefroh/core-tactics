import { GuiBaseAction } from "@game/engine/gui/actions/gui-base-action";

export class GuiGoToSite extends GuiBaseAction {
    getKey() {
        return 'GO_TO_SITE'
    }

    execute(core, entity, params) {
        window.open(params.href);
    }
}