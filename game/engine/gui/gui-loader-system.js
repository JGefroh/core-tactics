import { default as System } from '@core/system';
import { default as Entity } from '@core/entity.js'

import { _deepMerge } from '@game/engine/util/object-util';

import { isPointInRotatedRect } from '@game/engine/collision/collision-util';

import GuiCanvasRenderComponent from '@game/engine/gui/gui-canvas-render-component';

import { GuiPrint } from './actions/gui-print';
import { GuiSend } from './actions/gui-send';

/***
 * 
 */
export default class GuiLoaderSystem extends System {
    constructor() {
      super()
      this.guis = {};
      this.guiActions = {};
      this.guiElementKeys = [];
    }

    initialize() {
      this.addHandler('REGISTER_GUI_ACTION', (payload) => {
        let action = new payload();
        this.guiActions[action.getKey()] = action
      })

      this.addHandler('REGISTER_GUI', (payload) => {
        this.guis[payload.key] = payload.definition
      })

      this.addHandler('LOAD_GUI', (payload) => {
        this._clearGui();
        this._loadGuiDefinition(this.guis[payload])
      })

      this.send('REGISTER_GUI_ACTION', GuiPrint);
      this.send('REGISTER_GUI_ACTION', GuiSend);
    }

    _clearGui() {
      this.guiElementKeys.forEach((key) => {
        let entity = this._core.getEntityWithKey(key);
        this._core.removeEntity(entity);
      })
      this.guiElementKeys.length = 0;
    }

    _loadGuiDefinition(guiDefinition) {
      this._parseGuiConfiguration(guiDefinition)
    }

    _parseGuiConfiguration(guiConfig) {
      if (!guiConfig.definedElements || !guiConfig.instances) {
          console.error('Invalid GUI Configuration');
          return;
      }

      this.parseInstances(guiConfig, guiConfig.instances);
    }

    parseInstances(guiConfig, instances, bounds, options = {}) {
      bounds ||= {
        xPosition: 0,
        yPosition: 0,
        height: window.innerHeight,
        width: window.innerWidth,
      }

      // Stacking support
      const layout = options.layout || {
        strategy: 'none'
      };
      let offsetX = bounds.xPosition;
      let offsetY = bounds.yPosition;

      Object.keys(instances).forEach((instanceKey) => {
        const instanceDef = instances[instanceKey];
        instanceDef.key ||= instanceKey
        const elementDef = guiConfig.definedElements[instanceDef.element || key]; // Assume a direct match if there's only the key

        let instanceBounds = { ...bounds };
        if (layout.strategy.indexOf('vertical') != -1) {
          instanceBounds.yPosition = offsetY;
        } else if (layout.strategy.indexOf('horizontal') != -1) {
          instanceBounds.xPosition = offsetX;
        }

        if (layout.strategy.indexOf('next') != -1) {
          instanceBounds.xPosition += instanceBounds.width;
        }

        const instanceAttributes = this._createGuiElement(guiConfig, instanceKey, elementDef, instanceDef, instanceBounds);

        if (layout && instanceAttributes?.size) {
          if (layout.strategy.indexOf('vertical') != -1) {
            offsetY += instanceAttributes.size.height + (layout.marginY || 0);
          } else if (layout.strategy.indexOf('horizontal') != -1) {
            offsetX += instanceAttributes.size.width + (layout.marginX || 0);
          }
        }
      });
    }

    _createGuiElement(guiConfig, instanceKey, elementDef, instanceDef, parentBounds) {
      let instanceAttributes = this._parseConfigurationObject(elementDef, instanceDef);

      this._parseActions(instanceAttributes)
      this._parseSize(instanceAttributes, parentBounds)
      this._parsePosition(instanceAttributes, parentBounds)
      this._parseAppearance(instanceAttributes)

      this._convertToGuiRenderable(instanceAttributes)
      this._parseChildren(guiConfig, instanceAttributes, parentBounds)

      return instanceAttributes;
    }

    _parseConfigurationObject(elementDef, instanceDef) {
      return _deepMerge(elementDef, instanceDef)
    }

    _parsePosition(instanceAttributes, bounds) {
      if (!instanceAttributes) {
        return;
      }
    
      bounds = bounds || {
        width: window.innerWidth,
        height: window.innerHeight,
        xPosition: 0,
        yPosition: 0
      };

      // Set defaults
      if (!instanceAttributes.position.anchor) { instanceAttributes.position.anchor = 'top-left' }
    
      if (instanceAttributes.position.anchor.indexOf('center') != -1) {
        instanceAttributes.position.xPosition = bounds.xPosition + (bounds.width / 2) - (instanceAttributes.size.width / 2);
        instanceAttributes.position.yPosition = bounds.yPosition + (bounds.height / 2) - (instanceAttributes.size.height / 2);
      }
    
      if (instanceAttributes.position.anchor.indexOf('top') != -1) {
        instanceAttributes.position.yPosition = bounds.yPosition;
      }
      else if (instanceAttributes.position.anchor.indexOf('bottom') != -1) {
        instanceAttributes.position.yPosition = bounds.yPosition + bounds.height - instanceAttributes.size.height;
      }
    
      if (instanceAttributes.position.anchor.indexOf('left') != -1) {
        instanceAttributes.position.xPosition = bounds.xPosition;
      }
      else if (instanceAttributes.position.anchor.indexOf('right') != -1) {
        instanceAttributes.position.xPosition = bounds.xPosition + bounds.width - instanceAttributes.size.width;
      }

      instanceAttributes.position.xPosition += (instanceAttributes.position.offsetX || 0);
      instanceAttributes.position.yPosition += (instanceAttributes.position.offsetY || 0);
    }

    _parseSize(instanceAttributes, bounds) {
      if (!instanceAttributes.size) {
        return;
      }

      if (instanceAttributes.size.strategy && instanceAttributes.size.strategy.indexOf('stretch') != -1) {
        if (instanceAttributes.size.strategy.indexOf('x') != -1) {
          instanceAttributes.size.width = bounds.width;
        }
    
        if (instanceAttributes.size.strategy.indexOf('y') != -1) {
          instanceAttributes.size.height = bounds.height;
        }
      }
    }

    _parseAppearance(instanceAttributes) {

    }

    _parseActions(instanceAttributes) {
      if (instanceAttributes.onClick) {
        let action = this.guiActions[instanceAttributes.onClick.command];
        if (action) {
          instanceAttributes.onClickFn = action.execute;
        }
      }

      if (instanceAttributes.onHover) {
        let action = this.guiActions[instanceAttributes.onHover.command];
        if (action) {
          instanceAttributes.onHoverFn = action.execute;
        }
      }

    }

    _parseChildren(guiConfig, instanceAttributes) {
      if (!instanceAttributes.children) {
        return;
      }

      const parentBounds = {
        xPosition: instanceAttributes.position.xPosition,
        yPosition: instanceAttributes.position.yPosition,
        width: instanceAttributes.size.width,
        height: instanceAttributes.size.height
      };
      this.parseInstances(guiConfig, instanceAttributes.children, parentBounds, { layout: instanceAttributes.layout });
    }

    _convertToGuiRenderable(instanceAttributes) {
      let payload = {}
      payload.key = instanceAttributes.key;
      payload.canvasXPosition = instanceAttributes.position.xPosition;
      payload.canvasYPosition = instanceAttributes.position.yPosition;
      payload.width = instanceAttributes.size?.width;
      payload.height = instanceAttributes.size?.height;
      payload.fillStyle = instanceAttributes.appearance?.fillColor || 'rgba(0,0,0,0)';
      payload.lineWidth = 0;
      payload.text = instanceAttributes.text;
      payload.textOffsetX = instanceAttributes.font?.offsetX
      payload.textOffsetY = instanceAttributes.font?.offsetY
      payload.fontSize = instanceAttributes.font?.fontSize;

      // Actions
      payload.onClick = instanceAttributes.onClickFn;
      payload.onClickParams = instanceAttributes.onClick?.params;
      payload.onHover = instanceAttributes.onHoverFn;
      payload.onHoverParams = instanceAttributes.onHover?.params;

      // Transitions
      payload.hoverStyles = {
        // fillStyle: instanceAttributes.hoverStyles?.fillColor
        fontColor: instanceAttributes.hoverStyles?.fillColor
      }

      // NOT YET
      payload.fontColor = instanceAttributes.font?.color

      this.send('ADD_GUI_RENDERABLE', payload)

      this.guiElementKeys.push(payload.key)
    }
  }
  
  