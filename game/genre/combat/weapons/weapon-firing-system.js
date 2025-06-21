import { default as System } from '@core/system';
import { default as Entity } from '@core/entity.js'

import { angleTo, toFriendlyMeters, distanceFromTo, toMetersFromCoordinateUnits, toCoordinateUnitsFromMeters } from '@game/utilities/distance-util';


export default class WeaponFiringSystem extends System {
    constructor() {
      super()
    }
  
    work() {
       this.workForTag('Weapon', (tag, entity) => {
          let successfullyFired = false;

          if (!this._checkIsFireRequested(tag)) {
            successfullyFired = false;
          }
          else if (!this._checkHasAmmo(tag)) {
            successfullyFired = false;

          }
          else if (this._checkInCooldown(tag)) {
            successfullyFired = false;
          }
          else if (!this._checkHasEnergy(tag)) {
            successfullyFired = false;
          }
          else {
            // Fire Weapon, all preconditions pass
            this.fireWeaponAtTarget(tag)
            successfullyFired = true;
          }

          this._cleanup(tag, successfullyFired);
        });
    };

    fireWeaponAtTarget(tag) {
      this.send('REQUEST_DAMAGE', {
        entity: tag.getTargetEntity(),
        amount: tag.getWeaponStats().damage,
      });
      this.send('REQUEST_ENERGY', {
        entity: tag.getEntity(),
        amount: tag.getWeaponStats().energy,
      });

      // At Source
      this.send('EXECUTE_FX', {
        fxKey: tag.getWeaponStats().fxOnFire,
        params: {
          xPosition: tag.getXPosition(),
          yPosition: tag.getYPosition(),
          angleDegrees: tag.getAngleDegrees()
        }
      });

      // At Target
      let targetPosition = tag.getTargetPosition();
      if (targetPosition) {
        this.send('EXECUTE_FX', {
          fxKey: tag.getWeaponStats().fxOnHit,
          params: {
            sourcePosition: tag.getSourcePosition(),
            targetPosition: tag.getTargetPosition()
          },
        })
      }
    }

    _checkIsFireRequested(tag) {
      return tag.getFireRequest();
    }

    _checkHasAmmo(weapon) {
      return weapon.getCurrentAmmunition() > 0;
    }

    _checkHasEnergy(weapon) {
      return weapon.getCurrentEnergy() > 0;
    }


    _checkInCooldown(weapon) {
      if (!weapon.getLastFired()) {
        return false;
      }


      let cooldown = weapon.getWeaponStats().cooldownMs;
      return weapon.getLastFired() + cooldown >= Date.now();
    }

    _cleanup(tag, successfullyFired) {
      tag.setFireRequest(false); 
      if (successfullyFired) {
        tag.decrementCurrentAmmunition();
        tag.setLastFired(Date.now())
      }
    }
  }
  