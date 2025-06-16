import FxBase from "../fx-base";

export default class FxCommandMove extends FxBase {
    
    static getFxKey() {
        return 'FxCommandMove';
    }
    
    execute(core, params = {}) {
        core.send('EMIT_PARTICLES', {
            xPosition: params.xPosition,
            yPosition: params.yPosition,
            particleEmitFrequencyInMs: 50,
            particleEmissionCyclesMax: 1,
            particleShape: 'rectangle',
            particleCount: 1,
            particleLifetimeMin: 200,
            particleLifetimeMax: 200,
            particleHeightMin: 20, 
            particleHeightMax: 20,
            particleWidthMin: 5,
            particleWidthMax: 5,
            particleColors: [`rgba(0, 0, 255, 1)`],
            particleSpeedMin: 0,
            particleSpeedMax: 0,
            particleEmissionAngleDegreesMin: 0,
            particleEmissionAngleDegreesMax: 0,
            particleSpawnRadius: 0,
        });
        core.send('EMIT_PARTICLES', {
            xPosition: params.xPosition,
            yPosition: params.yPosition,
            particleEmitFrequencyInMs: 50,
            particleEmissionCyclesMax: 1,
            particleShape: 'rectangle',
            particleCount: 1,
            particleLifetimeMin: 200,
            particleLifetimeMax: 200,
            particleHeightMin: 5, 
            particleHeightMax: 5,
            particleWidthMin: 20,
            particleWidthMax: 20,
            particleColors: [`rgba(0, 0, 255, 1)`],
            particleSpeedMin: 0,
            particleSpeedMax: 0,
            particleEmissionAngleDegreesMin: 0,
            particleEmissionAngleDegreesMax: 0,
            particleSpawnRadius: 0,
        });
    }
    
    undo(core, params = {}) {
    }
}