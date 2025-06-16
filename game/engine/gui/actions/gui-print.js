import { GuiBaseAction } from "./gui-base-action";

export class GuiPrint extends GuiBaseAction {
    getKey() {
        return 'PRINT'
    }

    execute(entity, params) {
        console.info('GUIPRINT: ', entity, params)
    }
}