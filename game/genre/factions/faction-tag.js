import { default as Tag } from '@core/tag'

export default class Faction extends Tag {
    static tagType = 'Faction'

    constructor() {
      super();
      this.tagType = 'Faction'
    }

    static isAssignableTo(entity) {
        return entity.hasComponent('FactionComponent');
    };

    getFaction() {
        return this.entity.getComponent('FactionComponent').faction;
    }
}