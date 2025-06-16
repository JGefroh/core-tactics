import { default as System } from '@core/system';
import { default as Core}  from '@core/core';
import { default as Entity } from '@core/entity.js'

export default class CollisionConfigurationSystem extends System {
    constructor() {
        super()
        this.collidables = {
          'none': ['none'],
          'default': ['character', 'wall'],
          'character': ['character', 'wall'],
        }
    }
    
    work() {
        if (!this._core.getData('CONFIG_COLLISION_GROUPS')) {
            this._core.publishData('CONFIG_COLLISION_GROUPS', this.collidables)
        }
    };
  }