import { default as Tag } from '@core/tag'

export default class CanCapture extends Tag {
    static tagType = 'CanCapture'

    constructor() {
      super();
      this.tagType = 'CanCapture'
    }

    static isAssignableTo(entity) {
      return entity.hasLabel('CanCapture') && entity.getComponent('PositionComponent') && entity.getComponent('FactionComponent');
    };

    getXPosition() {
      return this.entity.getComponent('PositionComponent').xPosition;
    }

    getYPosition() {
      return this.entity.getComponent('PositionComponent').yPosition;
    }

    getFaction() {
      return this.entity.getComponent('FactionComponent').faction;
    }
}
  