import FxBase from "../fx-base";

export default class FxHitLaserSword extends FxBase {
    execute(core, params = {}) {
        let viewport = core.getData('VIEWPORT');
        core.send('PLAY_AUDIO', {
            audioKey: 'laser-attack.mp3',
            decibels: 120,
            sourceXPosition: params.xPosition,
            sourceYPosition: params.yPosition
,        });
        core.send('EMIT_PARTICLES', {
            xPosition: params.xPosition,
            yPosition: params.yPosition,
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