import FxBase from "../fx-base";

export default class FxHitCannon extends FxBase {

    static getFxKey() {
        return 'FxHitCannon';
    }
    
    execute(core, params = {}) {
        core.send('EMIT_PARTICLES', {
            xPosition: params.targetPosition.xPosition,
            yPosition: params.targetPosition.yPosition,
            particleEmitFrequencyInMs: 50,
            particleEmissionCyclesMax: 2,
            particleShape: 'circle',
            particleCount: 12,
            particleLifetimeMin: 50,
            particleLifetimeMax: 50,
            particleHeightMin: 16, //0.08 is pretty much the smallest
            particleHeightMax: 16,
            particleWidthMin: 16,
            particleWidthMax: 16,
            particleColors: [`rgba(255, 174, 66, ${Math.random()})`],
            particleSpeedMin: 0,
            particleSpeedMax: 0,
            particleEmissionAngleDegreesMin: 0,
            particleEmissionAngleDegreesMax: 360,
            particleSpawnRadius: 20,
        });
    }
    
    undo(core, params = {}) {
    }
}