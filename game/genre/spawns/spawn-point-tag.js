import { default as Tag } from '@core/tag'

export default class SpawnPoint extends Tag {
    static tagType = 'SpawnPoint'

    constructor() {
      super();
      this.tagType = 'SpawnPoint'
    }

    static isAssignableTo(entity) {
      return entity.hasComponent('PositionComponent') && entity.hasComponent('SpawnPointComponent');
    };

    getFaction() {
      return this.entity.getComponent('FactionComponent')?.faction;
    }

    getXPosition() {
      return this.entity.getComponent('PositionComponent').xPosition;
    }

    getYPosition() {
      return this.entity.getComponent('PositionComponent').yPosition;
    }
}
  