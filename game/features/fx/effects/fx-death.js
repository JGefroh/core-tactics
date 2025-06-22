import FxBase from "../fx-base";

export default class FxDeath extends FxBase {

    static getFxKey() {
        return 'FxDeath';
    }
    
    execute(core, params = {}) {
        core.send('PLAY_AUDIO', {
            audioKey: 'unit-death.mp3',
            decibels: 100,
            sourceXPosition: params.xPosition,
            sourceYPosition: params.yPosition,
            cooldownMs: 500
,        });

        core.send('EMIT_PARTICLES', {
            xPosition: params.xPosition,
            yPosition: params.yPosition,
            particleEmitFrequencyInMs: 50,
            particleEmissionCyclesMax: 2,
            particleShape: 'circle',
            particleCount: 12,
            particleLifetimeMin: 50,
            particleLifetimeMax: 50,
            particleHeightMin: 16, 
            particleHeightMax: 16,
            particleWidthMin: 16,
            particleWidthMax: 16,
            particleColors: [`rgba(255, 174, 66, ${0.5 + Math.random()})`],
            particleSpeedMin: 0,
            particleSpeedMax: 0,
            particleEmissionAngleDegreesMin: 0,
            particleEmissionAngleDegreesMax: 360,
            particleSpawnRadius: 20,
        });
        core.send('EMIT_PARTICLES', {
            xPosition: params.xPosition,
            yPosition: params.yPosition,
            particleEmitFrequencyInMs: 10,
            particleEmissionCyclesMax: 1,
            particleShape: 'rectangle',
            particleCount: 20,
            particleLifetimeMin: 100,
            particleLifetimeMax: 500,
            particleHeightMin: 0, 
            particleHeightMax: 8,
            particleWidthMin: 0,
            particleWidthMax: 8,
            particleColors: [`rgba(58, 60,59, 1)`],
            particleSpeedMin: 50,
            particleSpeedMax: 100,
            particleEmissionAngleDegreesMin: 0,
            particleEmissionAngleDegreesMax: 360,
            particleSpawnRadius: 5,
        });
    }
    
    undo(core, params = {}) {
    }
}