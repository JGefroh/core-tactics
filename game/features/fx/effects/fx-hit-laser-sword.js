import FxBase from "../fx-base";

export default class FxHitLaserSword extends FxBase {

    static getFxKey() {
        return 'FxHitLaserSword';
    }

    execute(core, params = {}) {
        core.send('PLAY_AUDIO', {
            groupKey: 'LASER_ATTACK',
            decibels: 40,
            sourceXPosition: params.targetPosition.xPosition,
            sourceYPosition: params.targetPosition.yPosition,
            cooldownMs: 500,
            
        });
        core.send('EMIT_PARTICLES', {
            xPosition: params.targetPosition.xPosition,
            yPosition: params.targetPosition.yPosition,
            particleEmitFrequencyInMs: 100,
            particleEmissionCyclesMax: 1,
            particleShape: 'rectangle',
            particleCount: 1,
            particleLifetimeMin: 50,
            particleLifetimeMax: 50,
            particleHeightMin: 32, //0.08 is pretty much the smallest
            particleHeightMax: 32,
            particleWidthMin: 4,
            particleWidthMax: 4,
            particleColors: [`rgba(76, 159, 254, 1)`],
            particleSpeedMin: 0,
            particleSpeedMax: 0,
            particleEmissionAngleDegreesMin: 0,
            particleEmissionAngleDegreesMax: 360,
            particleSpawnRadius: 0,
        });
    }
    
    undo(core, params = {}) {
    }
}