import FxBase from "../fx-base";

export default class FxFireCannon extends FxBase {

    static getFxKey() {
        return 'FxFireCannon';
    }
    
    execute(core, params = {}) {
        core.send('PLAY_AUDIO', {
            audioKey: 'cannon-attack.mp3',
            decibels: 120,
            sourceXPosition: params.xPosition,
            sourceYPosition: params.yPosition
,        });

        core.send('EMIT_PARTICLES', {
            xPosition: params.xPosition,
            yPosition: params.yPosition,
            particleEmitFrequencyInMs: 50,
            particleEmissionCyclesMax: 1,
            particleShape: 'circle',
            particleCount: 12,
            particleLifetimeMin: 50,
            particleLifetimeMax: 50,
            particleHeightMin: 5, //0.08 is pretty much the smallest
            particleHeightMax: 15,
            particleWidthMin: 5,
            particleWidthMax: 15,
            particleColors: [`rgba(255, 174, 66, ${Math.random()})`],
            particleSpeedMin: 0,
            particleSpeedMax: 0,
            particleEmissionAngleDegreesMin: params.angleDegrees - 15,
            particleEmissionAngleDegreesMax: params.angleDegrees + 15,
            particleSpawnRadius: 0,
        });
    }
    
    undo(core, params = {}) {
    }
}