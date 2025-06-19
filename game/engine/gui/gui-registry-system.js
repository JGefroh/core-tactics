import { default as System } from '@core/system';
import { default as Entity } from '@core/entity.js'

import { _deepMerge } from '@game/engine/util/object-util';

import { isPointInRotatedRect } from '@game/engine/collision/collision-util';

import GuiCanvasRenderComponent from '@game/engine/gui/gui-canvas-render-component';

import { GuiPrint } from './actions/gui-print';
import { GuiSend } from './actions/gui-send';

import { GuiSliderElement } from '@game/engine/gui/elements/gui-slider-element';

/***
 * 
 */
export default class GuiRegistrySystem extends System {
    constructor() {
      super()

      this.guiScreens = {};
      this.guiActions = {};
      this.guiElements = {};
    }

    initialize() {
      this.addHandler('REGISTER_GUI_SCREEN', (payload) => {
        this.guiScreens[payload.key] = payload.definition
      })

      this.addHandler('REGISTER_GUI_ELEMENT', (payload) => {
        this.guiElements[payload.klass.getKey()] = new payload.klass();
      })

      this.addHandler('REGISTER_GUI_ACTION', (payload) => {
        this.guiActions[payload.key] = payload.klass
      });

      this.addHandler('CREATE_GUI_ELEMENT', (payload) => {
        this._createGuiElement(payload)
      });

      this.initializeExample();
    }

    work() {
      this.updateAllGuiElements();
    }


    _createGuiElement(payload) {
      let element = this.guiElements[payload.key];

      if (!element) {
        // This is not managed by the registry, skip.
        return;
      }

      let elementDefinition = element.define(this._core, this, payload);

      if (Array.isArray(elementDefinition)) {
        this._createCombinedGuiRenderables(payload.key, elementDefinition)
      }
      else {
        this._createSingleGuiRenderable()
      }
    }

    /// Element Lifecycle - Create

    _createSingleGuiRenderable(elementkey, elementDefinition) {
        let instanceId = elementDefinition.id || Math.random();
        let key = `gui-${elementKey}-${instanceId}`;
        let guiObj = {
            key: key,
            ...elementDefinition
        }
        this._addGuiRenderable(guiObj);
    }

    _createCombinedGuiRenderables(elementKey, elementDefinition) {
      let instanceId = elementDefinition.id || Math.random();
      elementDefinition.forEach((definition, index) => {
          let key = `gui-${elementKey}-${instanceId}-${index}`;
          let guiObj = {
              key: key,
              ...definition
          }
          this._addGuiRenderable(guiObj);
      })

    }

    _addGuiRenderable(payload) {
      let entity = new Entity({ key: payload.key });
      let renderComponent = new GuiCanvasRenderComponent(payload)
      entity.addComponent(renderComponent);
      this._core.addEntity(entity)
    }


    /// Element Lifecycle - Update
    updateAllGuiElements() {
      this.workForTag('GuiCanvasRenderable', (renderable, entity) => {
        if (!renderable.getElementKey()) {
          return;
        }

        let element = this.guiElements[renderable.getElementKey()];
        element.update(this._core, this.system, {}, renderable);
      });
    }

    initializeExample() {
      // this.send('REGISTER_GUI_ELEMENT', {
      //   klass: GuiSliderElement
      // })

      // this.send('CREATE_GUI_ELEMENT', {
      //   key: 'GUI_SLIDER'
      // })
      // console.info(this._core.entities[0])
      // console.info(this._core.entities[1])
    }
  }
  
  