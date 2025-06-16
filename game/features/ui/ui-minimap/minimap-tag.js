import { default as Tag } from '@core/tag'

export default class Minimap extends Tag {
    static tagType = 'Minimap'

    constructor() {
      super();
      this.tagType = 'Minimap'
    }

    static isAssignableTo(entity) {
      return entity.hasComponent('MinimapComponent');
    };

    getColor() {
        return this.entity.getComponent('MinimapComponent').color
    }

}
  