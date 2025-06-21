import FxBase from "../fx-base";

export default class FxHitSnipe extends FxBase {

    static getFxKey() {
        return 'FxHitSniper';
    }
    
    execute(core, params = {}) {
        core.send('PLAY_AUDIO', {
            groupKey: 'SNIPER_ATTACK',
            decibels: 40,
            sourceXPosition: params.targetPosition.xPosition,
            sourceYPosition: params.targetPosition.yPosition,
            cooldownMs: 500,
        });

        let targetPosition = params.targetPosition;
        let sourcePosition = params.sourcePosition;
        const dx = targetPosition.xPosition - sourcePosition.xPosition;
        const dy = targetPosition.yPosition - sourcePosition.yPosition;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angleRadians = Math.atan2(dy, dx);
        const angleDegrees = angleRadians * (180 / Math.PI);

        const midX = (sourcePosition.xPosition + targetPosition.xPosition) / 2;
        const midY = (sourcePosition.yPosition + targetPosition.yPosition) / 2;

        core.send('EMIT_PARTICLES', {
            xPosition: midX,
            yPosition: midY,
            particleEmitFrequencyInMs: 0,
            particleEmissionCyclesMax: 1,
            particleShape: 'rectangle',
            particleCount: 1,
            particleLifetimeMin: 300,
            particleLifetimeMax: 300,
            particleHeightMin: 4,
            particleHeightMax: 4,
            particleWidthMin: distance,
            particleWidthMax: distance,
            particleColors: [`rgba(255, 174, 66, 1)`],
            particleSpeedMin: 0,
            particleSpeedMax: 0,
            particleEmissionAngleDegreesMin: angleDegrees,
            particleEmissionAngleDegreesMax: angleDegrees,
            particleSpawnRadius: 0,
        });
    }
    
    undo(core, params = {}) {
    }
}