import { default as Tag } from '@core/tag'

export default class PlayerControllable extends Tag{
  static tagType = 'PlayerControllable'

    constructor() {
        super()
        this.tagType = 'PlayerControllable'
    }

    static isAssignableTo(entity) {
      return entity.hasComponent('PlayerControlComponent');
    };

    isCurrentlyControlled() {
      return this.entity.getComponent('PlayerControlComponent').isCurrentlyControlled;
    }

    setCurrentlyControlled(isCurrentlyControlled) {
      this.entity.getComponent('PlayerControlComponent').isCurrentlyControlled = isCurrentlyControlled;
    }
  }
  