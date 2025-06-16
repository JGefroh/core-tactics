import { default as System } from '@core/system';
import { areRectanglesColliding, isCircleCollidingWithRotatedRect } from './collision-util';

export default class CollisionSystem extends System {
  constructor() {
    super();
    this.collidablesByCollisionGroup = {};
    this.collidables = {};

    this.addHandler('REQUEST_COLLISION_CHECK', (payload) => {
      this._requestCollisionCheck({
        shape: payload.shape,
        x: payload.xPosition,
        y: payload.yPosition,
        width: payload.width,
        height: payload.height,
        angleDegrees: payload.angleDegrees,
        group: payload.group
      },
      payload.callback
      )
    })
  }

  work() {
    this.checkCount = 0;

    this.collidables = this._core.getData('CONFIG_COLLISION_GROUPS') || [];
    if (!this.collidables) return;

    this.collidablesByCollisionGroup = this.getAndCacheCollidables();

    for (const [groupA, targets] of Object.entries(this.collidables)) {
      for (const groupB of targets) {
        this.checkCollisionBetweenGroups(this.collidablesByCollisionGroup, groupA, groupB);
      }
    }
  }

  _requestCollisionCheck(proposed, callback) {
    const proposedGroup = proposed.group || 'default'; // Optional grouping logic
    const p2 = proposed;
    this.collidablesByCollisionGroup = this.getAndCacheCollidables();

    let collided = false;

    for (const groupName in this.collidablesByCollisionGroup) {
      const entities = this.collidablesByCollisionGroup[groupName];
      for (const entity of entities) {
        const tag = this.getTag('Collidable');
        tag.setEntity(entity);

        const entityGroup = tag.getCollisionGroup() || 'default';
        const shouldCheck = this.collidables[entityGroup]?.includes(proposedGroup);
        if (!shouldCheck) continue;

        const maxDelta = Math.max(tag.getWidth(), tag.getHeight(), p2.width, p2.height);
        const dx = Math.abs(tag.getXPosition() - p2.x);
        const dy = Math.abs(tag.getYPosition() - p2.y);
        if (dx > maxDelta && dy > maxDelta) continue;

        const p1 = {
          shape: tag.getCollisionShape(),
          x: tag.getXPosition(),
          y: tag.getYPosition(),
          width: tag.getWidth(),
          height: tag.getHeight(),
          angleDegrees: tag.getAngleDegrees()
        };

        if (this._checkCollidedPrimitives(p1, p2)) {
          collided = true;
          break;
        }
      }

      if (collided) break;
    }

    callback(collided);
  }


  getAndCacheCollidables() {
    const map = {};
    this.workForTag('Collidable', (tag, entity) => {
      const group = tag.getCollisionGroup();
      if (!map[group]) map[group] = [];
      map[group].push(entity);
    });
    return map;
  }

  checkCollisionBetweenGroups(groups, groupName1, groupName2) {
    const shot = this.getTag('Collidable');
    const target = this.getTag('Collidable');

    (groups[groupName1] || []).forEach(entity1 => {
      if (!entity1.id) {
        return;
      }
      shot.setEntity(entity1);
      let skipX = false;
      let skipY = false;

      (groups[groupName2] || []).forEach(entity2 => {
        if (!entity2.id) {
          return;
        }
        if (skipX && skipY) return;

        target.setEntity(entity2);
        if (!entity1?.id || !entity2?.id || !this._checkShouldCheck(shot, target)) return;

        if (!skipX) {
          const collidedX = this._checkCollided(
            shot.getXPositionProposed(), shot.getYPosition(),
            shot,
            target.getXPosition(), target.getYPosition(),
            target
          );
          if (collidedX) {
            shot.setXPositionProposalValid(false);
            skipX = true;
          }
        }

        if (!skipY) {
          const collidedY = this._checkCollided(
            shot.getXPosition(), shot.getYPositionProposed(),
            shot,
            target.getXPosition(), target.getYPosition(),
            target
          );
          if (collidedY) {
            shot.setYPositionProposalValid(false);
            skipY = true;
          }
        }

        let triggered = false;

        if (skipX || skipY) {
          triggered = true;
        } else {
          const collidedFull = this._checkCollided(
            shot.getXPositionProposed(), shot.getYPositionProposed(),
            shot,
            target.getXPosition(), target.getYPosition(),
            target
          );
          if (collidedFull) {
            shot.setXPositionProposalValid(false);
            shot.setYPositionProposalValid(false);
            triggered = true;
          }
        }

        if (triggered) {
          this.executeCollisionEffect(shot, target);

        }
      });
    });
  }

  _insertMovementBounce() {
    
  }

  executeCollisionEffect(collidable1, collidable2) {
    collidable1.onCollision(collidable2);
    collidable2.onCollision(collidable1);
  }

  _checkShouldCheck(c1, c2) {
    if (c1.getId() === c2.getId()) return false;
    if (!c1.getEntity() || !c2.getEntity()) return false;

    const groupA = c1.getCollisionGroup() || 'default';
    const groupB = c2.getCollisionGroup() || 'default';
    if (!this.collidables[groupA]?.includes(groupB)) return false;

    const maxDelta = Math.max(c1.getWidth(), c1.getHeight(), c2.getWidth(), c2.getHeight());
    const dx = Math.abs(c1.getXPosition() - c2.getXPosition());
    const dy = Math.abs(c1.getYPosition() - c2.getYPosition());
    if (dx > maxDelta && dy > maxDelta) return false;

    return true;
  }

  _checkCollided(x1, y1, c1, x2, y2, c2, axisLimit = null) {
  const shape1 = c1.getCollisionShape();
  const shape2 = c2.getCollisionShape();

  const p1 = {
    shape: shape1,
    x: x1,
    y: y1,
    width: c1.getWidth(),
    height: c1.getHeight(),
    angleDegrees: c1.getAngleDegrees()
  };

  const p2 = {
    shape: shape2,
    x: x2,
    y: y2,
    width: c2.getWidth(),
    height: c2.getHeight(),
    angleDegrees: c2.getAngleDegrees()
  };

  return this._checkCollidedPrimitives(p1, p2, axisLimit);
}

_checkCollidedPrimitives(p1, p2, axisLimit = null) {
  try {
    this.checkCount++;

    if (p1.shape === 'rectangle' && p2.shape === 'rectangle') {
      return areRectanglesColliding(
        p1.x - (p1.width / 2), p1.y - (p1.height / 2),
        p1.width, p1.height, p1.angleDegrees,
        p2.x - (p2.width / 2), p2.y - (p2.height / 2),
        p2.width, p2.height, p2.angleDegrees,
        axisLimit
      );
    }

    if (p1.shape === 'circle' && p2.shape === 'rectangle') {
      return isCircleCollidingWithRotatedRect({
        x: p1.x,
        y: p1.y,
        radius: p1.width / 2
      }, {
        x: p2.x,
        y: p2.y,
        width: p2.width,
        height: p2.height,
        angleDegrees: p2.angleDegrees
      });
    }

    if (p1.shape === 'rectangle' && p2.shape === 'circle') {
      return isCircleCollidingWithRotatedRect({
        x: p2.x,
        y: p2.y,
        radius: p2.width / 2
      }, {
        x: p1.x,
        y: p1.y,
        width: p1.width,
        height: p1.height,
        angleDegrees: p1.angleDegrees
      });
    }

    if (p1.shape === 'circle' && p2.shape === 'circle') {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distanceSq = dx * dx + dy * dy;
      const radius1 = p1.width / 2;
      const radius2 = p2.width / 2;
      const combined = radius1 + radius2;
      return distanceSq <= combined * combined;
    }

    return false;
  } catch {
    return false;
  }
}
}