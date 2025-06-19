import { default as Component } from '@core/component';

export default class GuiCanvasRenderComponent extends Component {
    constructor(payload) {
        super()
        this.componentType = 'GuiCanvasRenderComponent';

        // Element
        this.elementKey = payload.elementKey;

        // Layout
        this.autolayout = payload.autolayout // Allow the gui autolayout to manipulate this component's position
        this.layourParentGuiKey = payload.layourParentGuiKey // A reference to the parent GUI element instance this belongs to

        //Render
        this.postRender = payload.postRender;
        this.renderAlignment = payload.renderAlignment || 'top-left' // default is x,y represent top-left what point is the coordinate describing? top-left means it's the top left corner

        // Position
        this.canvasXPosition = payload.canvasXPosition || 0; // The position that describes the center on canvas
        this.canvasYPosition = payload.canvasYPosition || 0; // The position that describes the center on canvas
        this.worldXPosition = payload.worldXPosition || 0;
        this.worldYPosition = payload.worldYPosition || 0;
        this.offsetXAmount = payload.offsetXAmount || 0; // The amount to adjust from its almost final position
        this.offsetYAmount = payload.offsetYAmount || 0;// The amount to adjust from its almost final position
        this.angleDegrees = payload.angleDegrees || 0

        // Size
        this.width = payload.width || 0;
        this.height = payload.height || 0;
        
        // Shape Options
        //Circles
        this.radius = payload.radius

        //Images
        this.imageObject = payload.imageObject;
        this.imagePath = payload.imagePath;
        this.imageStyle = 'fit'

        // Text
        this.text = payload.text;
        this.textOffsetX = payload.textOffsetX || 0; // Required for math.
        this.textOffsetY = payload.textOffsetY || 0; // Required for math.
        this.textAlign = payload.textAlign || 'left' // center, left
        this.fontSize = payload.fontSize;
        this.fontType = payload.fontType;
        this.fontColor = payload.fontColor;

        //Styles
        this.strokeStyle = payload.strokeStyle;
        this.fillStyle = payload.fillStyle;
        this.lineWidth = payload.lineWidth;
        this.lineDash = payload.lineDash || [] // Required or else Canvas will throw error.
        this.hoverStyles = payload.hoverStyles;
        this.borderSize = payload.borderSize;
        this.borderColor = payload.borderColor;

        //Interaction
        this.isHovered = false;
        this.isVisible = payload.isVisible == false ? false : true
        this.isActive = payload.isActive;
        this.activeStyle = payload.activeStyle || {};

        // Actions
        this.onClick = payload.onClick;
        this.onClickParams = payload.onClickParams || {};
        this.onHover = payload.onHover;
        this.onHoverParams = payload.onHoverParams || {};
        this.onHoverStop = payload.onHoverStop;

        this.attachedToEntity = payload.attachedToEntity;
        
    }
}