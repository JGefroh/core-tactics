import { default as Tag } from '@core/tag'

export default class CapturePoint extends Tag {
    static tagType = 'CapturePoint'

    constructor() {
      super();
      this.tagType = 'CapturePoint'
    }

    static isAssignableTo(entity) {
      return entity.hasComponent('PositionComponent') && entity.hasComponent('CapturePointComponent') && entity.hasComponent('FactionComponent');
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

    getSize() {
      return this.entity.getComponent('PositionComponent').width;
    }

    setFaction(faction) {
      this.entity.getComponent('FactionComponent').faction = faction;
    }


    isTimeToProgress() {
      let lastProgressed = this.entity.getComponent('CapturePointComponent').lastProgressed;
      return lastProgressed + this.entity.getComponent('CapturePointComponent').progressionIntervalMs <= Date.now();
    }

    adjustCapturePointsProgress(value, isAbsolute) {
      if (isAbsolute) {
        this.entity.getComponent('CapturePointComponent').capturePointsProgress = value;
      }
      else {
        this.entity.getComponent('CapturePointComponent').capturePointsProgress += value;
      }

      this.entity.getComponent('CapturePointComponent').lastProgressed = Date.now();
    }

    getPointsToCapture() {
      return this.entity.getComponent('CapturePointComponent').pointsToCapture;
    }

    getCapturePointsProgress() {
      return this.entity.getComponent('CapturePointComponent').capturePointsProgress
    }
}
  