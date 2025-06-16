import { default as System } from '@core/system';

export default class AttackIntentSystem extends System {
    constructor() {
      super();
    }
    
    work() {
      let hasWeapon = this.getTag('Weapon');

      this.workForTag('HasIntent', (tag, entity) => {
        let intent = tag.getIntentByName('ATTACK');
        if (!intent) {
          return;
        }

        if (!hasWeapon.constructor.isAssignableTo(entity) && !hasWeapon.constructor.isAssignableTo(entity.getChild('weapon'))) {
          return;
        }

        hasWeapon.setEntity(entity.getChild('weapon') || entity);

        if (this._checkHasTarget(intent) && this._checkTargetInRange(entity, intent.targetEntity, hasWeapon.getWeaponStats()?.range)) {
          hasWeapon.setTargetEntity(intent.targetEntity);
          hasWeapon.setFireRequest(true); // This will get picked up weapon firing system
        }

        tag.removeIntent('ATTACK');
      });
    };

    _checkHasTarget(intent) {
      return !!intent?.targetEntity?.id;
    }

    _checkTargetInRange(entity, targetEntity, range) {
        let movable = this.getTag('Movable');
        movable.setEntity(entity);

        let target = targetEntity.getComponent('PositionComponent');
        let distanceTo = range;

        const dx = movable.getXPosition() - target.xPosition;
        const dy = movable.getYPosition() - target.yPosition;
    
        const distanceSquared = dx * dx + dy * dy;
        const radius = distanceTo || 10; 
        const radiusSquared = radius * radius;
    
        return distanceSquared <= radiusSquared
    }
  }