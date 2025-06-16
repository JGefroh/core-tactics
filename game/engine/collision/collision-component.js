import { default as Component} from '@core/component'

export default class CollisionComponent extends Component {
    constructor(payload = {}) {
        super();
        this.collisionGroup = payload.collisionGroup || 'default';
        this.componentType = "CollisionComponent"

        this.collisionShape = payload.collisionShape || 'rectangle' // circle, rectangle

        this.onCollision = payload.onCollision || ((collidable) => {});


        // Set these values to override use a different size for the collision instead of the position size.
        this.width = payload.width || null;
        this.height = payload.height || null;
    }
}