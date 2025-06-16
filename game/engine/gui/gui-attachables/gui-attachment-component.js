import { default as Component } from '@core/component';

// This is just a market component for entities with world-space UI.
// 
export default class GuiAttachmentComponent extends Component {
    constructor(payload = {}) {
        super();
        this.componentType = 'GuiAttachmentComponent';
        this.markers = payload.markers || {};

        this.attachedGuiElements = {};
    }
} 