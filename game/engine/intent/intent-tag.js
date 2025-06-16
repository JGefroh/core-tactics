import { default as Tag } from '@core/tag'

export default class Intent extends Tag {
    static tagType = 'HasIntent'

    constructor() {
      super();
      this.tagType = 'HasIntent'
    }

    static isAssignableTo(entity) {
      return entity.hasComponent('IntentComponent')
    };

    getIntentByName(intentType) {
      return this.entity.getComponent('IntentComponent').getIntentByName(intentType);
    }

    getIntentById(intentId) {
      return this.entity.getComponent('IntentComponent').getIntentById(intentId);
    }

    insertIntent(id, intentName, payload) {
      this.entity.getComponent('IntentComponent').insertIntent(id, intentName, payload);
    }

    addIntent(id, intentName, payload) {
      this.entity.getComponent('IntentComponent').addIntent(id, intentName, payload);
    }

    replaceIntent(id, intentName, payload) {
      this.entity.getComponent('IntentComponent').replaceIntent(id, intentName, payload);
    }

    removeIntent(intentName) {
      this.entity.getComponent('IntentComponent').removeIntent(intentName);
    }

    removeIntents(intentName) {
      this.entity.getComponent('IntentComponent').removeIntents(intentName);
    }

    clearIntents() {
      this.entity.getComponent('IntentComponent').clearIntents();
    }
}
  