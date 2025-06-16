
import { default as Tag } from '@core/tag'

export default class PlayerIntentTargetable extends Tag {
    static tagType = 'PlayerIntentTargetable'

    constructor() {
      super();
      this.tagType = 'PlayerIntentTargetable'
    }

    static isAssignableTo(entity) {
      return entity.hasComponent('PlayerIntentTargetableComponent');
    };

    has(intentName) {
        return this.entity.hasComponent('PlayerIntentTargetableComponent').intents[intentName];
    }

    getAll() {
        return Object.keys(this.entity.getComponent('PlayerIntentTargetableComponent').intents);
    }
}
  

