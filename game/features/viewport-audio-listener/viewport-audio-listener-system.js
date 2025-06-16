import { default as System } from '@core/system';

import { default as Entity } from '@core/entity.js';

import PositionComponent from '@game/engine/position/position-component';
import AudioListenerComponent from '../../engine/audio/audio-listener-component';

export default class ViewportAudioListenerSystem extends System {
    constructor() {
      super()
      this._createListener();
    }
    work() {
        let viewport = this._core.getData('VIEWPORT');
        if (viewport) {
            this._updateListener(viewport.xPosition, viewport.yPosition)
        }
    };

    _updateListener(x, y) {
        let entity = this._core.getEntityWithKey('audio-listener');
        entity.getComponent('PositionComponent').xPosition = x
        entity.getComponent('PositionComponent').yPosition = y
    }

    _createListener() {
      let entity = new Entity({key: 'audio-listener'});
      entity.addComponent(new PositionComponent({
        xPosition: 0,
        yPosition: 0
      }));
      entity.addComponent(new AudioListenerComponent());
      this._core.addEntity(entity);
    }
  }
  