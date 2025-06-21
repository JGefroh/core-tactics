import { default as Tag } from '@core/tag'

export default class Weapon extends Tag{
  static tagType = 'Weapon'

    constructor() {
        super()
    }

    static isAssignableTo(entity) {
      return entity.hasComponent('PositionComponent') && entity.hasComponent('WeaponComponent');
    };

    getXPosition() {
      return this.entity.getComponent('PositionComponent').xPosition;
    }

    getYPosition() {
      return this.entity.getComponent('PositionComponent').yPosition;
    }

    getOwningEntity() {
      return this.entity.getComponent('AttachedComponent')?.attachedToEntity || this.entity;
    }

    belongsToEntity(entityId) {
      return this.entity.getComponent('AttachedComponent')?.attachedToEntity?.id == entityId || this.entity.id == entityId;
    }

    setFireRequest(fireRequestPayload) {
      this.entity.getComponent('WeaponComponent').fireRequest = fireRequestPayload;
    }

    getFireRequest() {
      return this.entity.getComponent('WeaponComponent').fireRequest;
    }

    getWeaponKey() {
      return this.entity.getComponent('WeaponComponent').weaponKey;
    }

    getCurrentAmmunition() {
      return this.entity.getComponent('WeaponComponent').currentAmmunition;
    }

    setCurrentAmmunition(currentAmmunition) {
      this.entity.getComponent('WeaponComponent').currentAmmunition = currentAmmunition;
    }

    getLastFired() {
      return this.entity.getComponent('WeaponComponent').lastFired;
    }

    setLastFired(time) {
      this.entity.getComponent('WeaponComponent').lastFired = time
    }

    decrementCurrentAmmunition() {
      this.entity.getComponent('WeaponComponent').currentAmmunition--;
    }

    getAngleDegrees() {
      return this.entity.getComponent('PositionComponent').angleDegrees;
    }

    getWeaponStats() {
      return this.entity.getComponent('WeaponComponent').weaponStats;
    }


    setTargetEntity(targetEntity) {
      this.entity.getComponent('WeaponComponent').targetEntity = targetEntity;
    }

    getSourcePosition() {
      let source = this.entity;
      let sourcePosition = source.getComponent('PositionComponent');
      if (!sourcePosition) {
        return null;
      }

      return {
        xPosition: sourcePosition.xPosition,
        yPosition: sourcePosition.yPosition
      }
    }

    getTargetEntity() {
      return this.entity.getComponent('WeaponComponent').targetEntity;
    }

    getTargetPosition() {
      let target = this.entity.getComponent('WeaponComponent').targetEntity;
      let targetPosition = target.getComponent('PositionComponent');
      if (!targetPosition) {
        return null;
      }

      return {
        xPosition: targetPosition.xPosition,
        yPosition: targetPosition.yPosition
      }
    }

    getCurrentEnergy() {
      if (this.entity.getComponent('EnergyComponent')) {
        return this.entity.getComponent('EnergyComponent').energy;
      }
      return Infinity; // Energy is optional
    }
  }