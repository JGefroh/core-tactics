import { default as System } from '@core/system';

export default class MovementProposalSystem extends System {
    constructor() {
      super();
    }
    
    work() {
      this.workForTag('Movable', (movable, entity) => {
        movable.setEntity(entity);

        let totalVector = movable.getVectorTotal();

        let oldXPosition = movable.getXPosition()
        let oldYPosition = movable.getYPosition()


        let newXPosition = oldXPosition + (totalVector.xDelta);
        let newYPosition = oldYPosition + (totalVector.yDelta);

        if (Number.isNaN(newXPosition) || Number.isNaN(newYPosition)) {
          // Prevent moving into an invalid zone, esp. when things spawn in without a position specified.
          return;
        }

        movable.setXPositionProposed(newXPosition);
        movable.setYPositionProposed(newYPosition);


        if (movable.getTurnMagnitude() != null) {
          let oldAngleDegrees = movable.getAngleDegrees();
          let newAngleDegrees = oldAngleDegrees + movable.getTurnMagnitude();
          movable.setAngleDegreesProposed(newAngleDegrees);
        }
      });
    };
  }