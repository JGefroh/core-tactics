import FxBase from "../fx-base";

export default class FxCommandAttack extends FxBase {

    static getFxKey() {
        return 'FxCommandAttack';
    }
    
    execute(core, params = {}) {

        core.send('PLAY_AUDIO', {
            groupKey: 'UNIT_ATTACK',
            decibels: 30,
            cooldownMs: 300,
            exclusiveGroup: 'UNIT_ATTACK'
        });

        core.send('EMIT_PARTICLES', {
            xPosition: params.xPosition,
            yPosition: params.yPosition,
            particleEmitFrequencyInMs: 50,
            particleEmissionCyclesMax: 1,
            particleShape: 'rectangle',
            particleCount: 1,
            particleLifetimeMin: 700,
            particleLifetimeMax: 700,
            particleHeightMin: 40, 
            particleHeightMax: 40,
            particleWidthMin: 2,
            particleWidthMax: 2,
            particleColors: [`rgba(255, 0, 0, 0.8)`],
            particleSpeedMin: 0,
            particleSpeedMax: 0,
            particleEmissionAngleDegreesMin: 0,
            particleEmissionAngleDegreesMax: 0,
            particleSpawnRadius: 0,
            fxSizeChangeRate: -0.05,
            fxRotateDegrees: -5
        });
        core.send('EMIT_PARTICLES', {
            xPosition: params.xPosition,
            yPosition: params.yPosition,
            particleEmitFrequencyInMs: 50,
            particleEmissionCyclesMax: 1,
            particleShape: 'rectangle',
            particleCount: 1,
            particleLifetimeMin: 700,
            particleLifetimeMax: 700,
            particleHeightMin: 2, 
            particleHeightMax: 2,
            particleWidthMin: 40,
            particleWidthMax: 40,
            particleColors: [`rgba(255, 0, 0, 0.8)`],
            particleSpeedMin: 0,
            particleSpeedMax: 0,
            particleEmissionAngleDegreesMin: 0,
            particleEmissionAngleDegreesMax: 0,
            particleSpawnRadius: 0,
            fxSizeChangeRate: -0.05,
            fxRotateDegrees: -5
        });
    }
    
    undo(core, params = {}) {
    }
}