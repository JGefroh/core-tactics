import { default as Tag } from '@core/tag'

export default class Groupable extends Tag{
  static tagType = 'Groupable'

    constructor() {
        super()
        this.tagType = 'Groupable'
    }

    static isAssignableTo(entity) {
      return entity.hasComponent('GroupComponent')
    };

    getGroup() {
        return this.entity.getComponent('GroupComponent').group;
    }

    setGroup(group) {
      this.entity.getComponent('GroupComponent').group = group;
    }
  }
  