import { default as System } from '@core/system';

export default class MovementIntentSystem extends System {
    constructor() {
      super();
    }
    
    work() {
      let movable = this.getTag('Movable');

      this.workForTag('HasIntent', (tag, entity) => {
        let intent = tag.getIntentByName('MOVEMENT');
        if (!intent) {
          return;
        }

        if (!movable.constructor.isAssignableTo(entity)) {
          return;
        }
        movable.setEntity(entity);

        let position = null;
        if (intent.targetEntity) {
          position = intent.targetEntity.getComponent('PositionComponent');
        }
        else if (intent.targetPosition) {
          position = intent.targetPosition
        }

        if (!position) {
          return;
        }

        this._setVectorTowards(movable, position.xPosition, position.yPosition)
        if (this._isNearTarget(movable, position, intent.distanceTo)) {
          tag.removeIntent('MOVEMENT');
        }
      });
    };

    _setVectorTowards(movable, targetXPosition, targetYPosition) {
        const dx = targetXPosition - movable.getXPosition();
        const dy = targetYPosition - movable.getYPosition();
        const directionInRadians = Math.atan2(dy, dx);
        const directionInDegrees = directionInRadians * (180 / Math.PI);
        const distance = Math.sqrt(dx * dx + dy * dy);

        movable.setAngleDegrees(directionInDegrees);
        movable.addVector(distance, directionInDegrees);
    }

    _isNearTarget(movable, target, distanceTo) {
        const dx = movable.getXPosition() - target.xPosition;
        const dy = movable.getYPosition() - target.yPosition;
    
        const distanceSquared = dx * dx + dy * dy;
        const radius = distanceTo || 10; 
        const radiusSquared = radius * radius;
    
        return distanceSquared <= radiusSquared
    }
  }