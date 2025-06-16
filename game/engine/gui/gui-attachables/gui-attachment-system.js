import { default as System } from '@core/system';
import { default as Entity } from '@core/entity.js'

// Used for GUI elements that can be attached to an entity (eg. exists in world space)
// or describe a specific entity (eg. a health bar for a particular entity.
export default class GuiAttachmentSystem extends System {
    constructor() {
      super()


      this.attachableGuiElements = {}
      this.allUiElementKeys = [];

      this.addHandler('REGISTER_ATTACHABLE_GUI_ELEMENT', (payload) => {
        this.attachableGuiElements[payload.markerName] = new payload.elementClass();
      })
    }

    work() {
        this._updateAttachedGuis();
        this._removeStaleElements();
    }

    _updateAttachedGuis() {
        this.workForTag('HasGuiAttachment', (tag, entity) => {
            tag.getAllMarkers().forEach((markerName) => {
                if (!tag.hasMarker(markerName)) {
                    return;
                }

                this._ensureGuiObject(tag, markerName);
                this._updateGuiObject(entity, markerName)
            });
        });
    }

    _removeStaleElements() {
        let keep = [];
        for (const obj of this.allUiElementKeys) {
            if (!obj.entity?.id) {
                let uiEntity = this._core.getEntityWithKey(obj.key)
                this._core.removeEntity(uiEntity)
            }
            else {
                keep.push(obj)
            }
        }
        this.allUiElementKeys = keep;
    }

    _ensureGuiObject(tag, markerName) {
        if (tag.hasAttachedGuiElement(markerName)) {
            return;
        }
        
        let keys = this._requestGuiObject(tag.getEntity(), markerName, tag.getMarkerConfig(markerName));
        tag.setAttachedGuiElement(markerName, keys);

        keys.forEach((key) => {
            this.allUiElementKeys.push(key)
        })

    }

    _requestGuiObject(entity, markerName, config) {
        let elementDefinition = this.attachableGuiElements[markerName].define(entity, config);

        let keys = [];

        if (Array.isArray(elementDefinition)) {
            elementDefinition.forEach((definition, index) => {
                let key = `gui-${entity.id}-${markerName}-${index}`;
                let guiObj = {
                    key: key,
                    attachedToEntity: entity,
                    ...definition
                }
                this.send('ADD_GUI_RENDERABLE', guiObj);
                keys.push({key: guiObj.key, entity: entity})
            })
        }
        else {
            let key = `gui-${entity.id}-${markerName}`
            let guiObj = {
                key: key,
                attachedToEntity: entity,
                ...elementDefinition
            }
            this.send('ADD_GUI_RENDERABLE', guiObj);
            keys.push({key: guiObj.key, entity: entity})
        }

        return keys;
    }

    _updateGuiObject(entity, markerName, params = {}) {
        let elementDefinition = this.attachableGuiElements[markerName].update(entity);

        if (Array.isArray(elementDefinition)) {
            elementDefinition.forEach((definition, index) => {
                this.send("GUI_UPDATE_PROPERTIES", {
                    key: definition.key || `gui-${entity.id}-${markerName}-${index}`,
                    value: definition
                }) 
            })
        }
        else {
            this.send("GUI_UPDATE_PROPERTIES", {
                key: elementDefinition.key || `gui-${entity.id}-${markerName}`,
                value: elementDefinition
            })
        }
    }
  }
  
  