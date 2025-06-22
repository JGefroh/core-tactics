import FxBase from "../fx-base";
import FactionComponent from "../../../genre/factions/faction-component";

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

        let color = FactionComponent.getFactionColor(params.firingEntity.getComponent('FactionComponent').faction);

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
            particleColors: [color || `rgba(255, 174, 66, 1)`],
            particleSpeedMin: 0,
            particleSpeedMax: 0,
            particleEmissionAngleDegreesMin: angleDegrees,
            particleEmissionAngleDegreesMax: angleDegrees,
            particleSpawnRadius: 0,
        });

        core.send('EMIT_PARTICLES', {
            xPosition: params.targetPosition.xPosition,
            yPosition: params.targetPosition.yPosition,
            particleEmitFrequencyInMs: 50,
            particleEmissionCyclesMax: 1,
            particleShape: 'circle',
            particleCount: 1,
            particleLifetimeMin: 300,
            particleLifetimeMax: 300,
            particleHeightMin: 16, //0.08 is pretty much the smallest
            particleHeightMax: 16,
            particleWidthMin: 16,
            particleWidthMax: 16,
            particleColors: [color || `rgba(255, 174, 66, 1)`],
            particleSpeedMin: 0,
            particleSpeedMax: 0,
            particleEmissionAngleDegreesMin: 0,
            particleEmissionAngleDegreesMax: 360,
            particleSpawnRadius: 0,
            fxSizeChangeRate: 0.0005
        });
    }
    
    undo(core, params = {}) {
    }
}