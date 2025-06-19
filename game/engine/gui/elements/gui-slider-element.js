import { BaseElement } from './base-element';

export class GuiSliderElement extends BaseElement {
    static getKey() {
        return 'GUI_SLIDER'
    }

    define(core, system, context) {
        return [
            {
                width: 300,
                height: 400,
                fillStyle: 'rgba(0,255,0,1)',
                canvasXPosition: 400,
                canvasYPosition: 200,
            }, // slider bar
            {

                width: 100,
                height: 200,
                offsetXAmount: 30,
                fillStyle: 'rgba(0,0,255,1)',
                canvasXPosition: 100,
                canvasYPosition: 200
            }, // slider marker
        ]
    }

    update(core, system, context) {
        return [
            {}, // slider bar
            {}, // slider marker
        ]
    }
}