import { default as Component } from '@core/component';

export default class RenderComponent extends Component {
    constructor(payload) {
        super()
        this.componentType = 'RenderComponent'
        this.width = payload.width;
        this.height = payload.height;
        
        this.imagePath = payload.imagePath; // a path or a key to an asset-manifest entry
        this.imageStyle = payload.imageStyle || 'fit'; // fit, or a float representing tile scale
        this.imageType = payload.imageType || 'instance' // instance for specific instances, continuous for terrain / wallpaper


        this.angleDegrees = payload.angleDegrees; // This is used for visual angles, and not position-based logic.

        // Z-indexing: you can specify a value OR assign to a semantic render layer
        this.zIndex = payload.zIndex || 0; // Supercedes render layer if present (ie. non-zero)
        this.renderLayer = payload.renderLayer || 'DEFAULT'//
        this.renderAlignment = payload.renderAlignment || 'center' // default is x,y represent center ['bottom-center']

        // Shape primitivis
        this.shape = payload.shape ||'rectangle' // rectangle, circle, path
        this.shapeColor = payload.shapeColor;
        this.pathPoints = payload.pathPoints || null; // If oyu want path rendering.

        this.borderColor = payload.borderColor;
        this.borderSize = payload.borderSize;
    }
    

    setImageObject(imageObject) {
        this.imageObject = imageObject;
    }
}