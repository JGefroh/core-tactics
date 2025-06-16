import { default as Tag } from '@core/tag'

export default class HasGuiAttachment extends Tag {
    static tagType = 'HasGuiAttachment'

    constructor() {
      super();
      this.tagType = 'HasGuiAttachment'
    }

    static isAssignableTo(entity) {
      return entity.hasComponent('GuiAttachmentComponent');
    };

    hasMarker(markerName) {
        return this.entity.getComponent('GuiAttachmentComponent').markers[markerName]
    }

    getMarkerConfig(markerName) {
        return this.entity.getComponent('GuiAttachmentComponent').markers[markerName]
    }

    removeMarker(markerName) {
        delete this.entity.getComponent('GuiAttachmentComponent').markers[markerName];
    }

    getAllMarkers() {
        return Object.keys(this.entity.getComponent('GuiAttachmentComponent').markers);
    }

    hasAttachedGuiElement(markerName) {
        return this.entity.getComponent('GuiAttachmentComponent').attachedGuiElements[markerName];
    }


    getAttachedGuiElement(markerName) {
        return this.entity.getComponent('GuiAttachmentComponent').attachedGuiElements[markerName];
    }

    setAttachedGuiElement(markerName, attachedGuiElement) {
        this.entity.getComponent('GuiAttachmentComponent').attachedGuiElements[markerName] = attachedGuiElement
    }
}
  