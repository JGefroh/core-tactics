import FxBase from "../fx-base";

export default class FxCommandMove extends FxBase {
    
    static getFxKey() {
        return 'FxCommandMove';
    }
    
    execute(core, params = {}) {

        core.send('PLAY_AUDIO', {
            groupKey: 'UNIT_MOVE',
            decibels: 30,
            cooldownMs: 300,
            exclusiveGroup: 'UNIT_MOVE'
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
            particleHeightMin: 20, 
            particleHeightMax: 20,
            particleWidthMin: 2,
            particleWidthMax: 2,
            particleColors: [`rgba(0, 255, 0, 0.8)`],
            particleSpeedMin: 0,
            particleSpeedMax: 0,
            particleEmissionAngleDegreesMin: 0,
            particleEmissionAngleDegreesMax: 0,
            particleSpawnRadius: 0,
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
            particleWidthMin: 20,
            particleWidthMax: 20,
            particleColors: [`rgba(0, 255, 0, 0.8)`],
            particleSpeedMin: 0,
            particleSpeedMax: 0,
            particleEmissionAngleDegreesMin: 0,
            particleEmissionAngleDegreesMax: 0,
            particleSpawnRadius: 0,
            fxRotateDegrees: -5
        });
    }
    
    undo(core, params = {}) {
    }
}