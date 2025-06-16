import { default as System } from '@core/system';

import IntentComponent from './intent-component';

export default class IntentSystem extends System {
    constructor() {
      super();

      this.addHandler('INTEND', (payload) => {
        this.processIntent(payload);
      });

      this.addHandler('INTERRUPT_INTENT', (payload) => {
        this.processInterrupt(payload);
      });
    }
    
    work() {
    };

    processIntent(payload) {
      let entity = payload.entity;
      if (!entity?.id) {
        return;
      }

      if (!payload.params) {
        return;
      }

      if (!entity.getComponent('IntentComponent')) {
        entity.addComponent(new IntentComponent());
      }

      this.workForEntityWithTag(entity, 'HasIntent', (entity, tag) => {
        if (payload.queue) {
          tag.addIntent(payload.id, payload.intentType, payload.params);
        }
        else if (payload.insert) {
          tag.insertIntent(payload.id, payload.intentType, payload.params);
        }
        else {
          tag.replaceIntent(payload.id, payload.intentType, payload.params);
        }
      });
    }

    processInterrupt(payload) {
       let entity = payload.entity;
      if (!entity?.id) {
        return;
      }

      if (!payload.intentType) {
        return;
      }

      if (!entity.getComponent('IntentComponent')) {
        return;
      }

      this.workForEntityWithTag(entity, 'HasIntent', (entity, tag) => {
        if (payload.intentType == 'all') {
          tag.clearIntents();
        }
      });
    }
  }