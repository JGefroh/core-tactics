import FxBase from "../fx-base";

export default class FxHitMachineGun extends FxBase {

    static getFxKey() {
        return 'FxHitMachineGun';
    }
    
    execute(core, params = {}) {
        let viewport = core.getData('VIEWPORT');
        core.send('PLAY_AUDIO', {
            audioKey: 'machine-gun-attack.mp3',
            decibels: 40,
            sourceXPosition: params.targetPosition.xPosition,
            sourceYPosition: params.targetPosition.yPosition,
            cooldownMs: 500
,        });
        core.send('EMIT_PARTICLES', {
            xPosition: params.targetPosition.xPosition,
            yPosition: params.targetPosition.yPosition,
            particleEmitFrequencyInMs: 50,
            particleEmissionCyclesMax: 4,
            particleShape: 'circle',
            particleCount: 12,
            particleLifetimeMin: 50,
            particleLifetimeMax: 50,
            particleHeightMin: 5, //0.08 is pretty much the smallest
            particleHeightMax: 5,
            particleWidthMin: 5,
            particleWidthMax: 5,
            particleColors: [`rgba(255, 174, 66, ${Math.random()})`],
            particleSpeedMin: 0,
            particleSpeedMax: 0,
            particleEmissionAngleDegreesMin: 0,
            particleEmissionAngleDegreesMax: 360,
            particleSpawnRadius: 30,
        });
    }
    
    undo(core, params = {}) {
    }
}