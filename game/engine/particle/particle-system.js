import { default as System } from '@core/system';
import { default as Entity } from '@core/entity.js';


import PositionComponent from '@game/engine/position/position-component';
import ParticleEmitterComponent from './particle-emitter-component';


export default class ParticleSystem extends System {
    constructor() {
        super();

        this.particles = [];
        this.emitters = [];

        this.addHandler('EMIT_PARTICLES', (payload) => {
            this._createEmitter(payload);
        });

        this.send('REGISTER_RENDER_PASS', {
            name: 'PARTICLE',
            execute: (renderer, materialResolver) => {
                this._submitRenderableDraws(renderer, materialResolver);
            }
        });
    }

    _createEmitter(payload) {
        const now = Date.now();

        let entity = new Entity()
        entity.addComponent(new PositionComponent(
            {
                width: 1,
                height: 1,
                xPosition: payload.xPosition,
                yPosition: payload.yPosition,
            }
        ));

        entity.addComponent(new ParticleEmitterComponent({
            nextEmissionTime: now,
            lastEmissionTime: now,
            ...payload
        }));
      
        this._core.addEntity(entity);
    }

    _emitParticles(emitter) {
        const {
            particleCount,
            xPosition,
            yPosition,
            particleLifetimeMin,
            particleLifetimeMax,
            particleHeightMin,
            particleHeightMax,
            particleWidthMin,
            particleWidthMax,
            particleShape,
            particleColors,
            particleSpeedMin, 
            particleSpeedMax,
            particleEmissionAngleDegreesMin,
            particleEmissionAngleDegreesMax,
            particleSpawnRadius = 0,
            fxRotateDegrees,
            fxSizeChangeRate
        } = emitter;

        for (let i = 0; i < particleCount; i++) {
            const lifetime = this._rand(particleLifetimeMin, particleLifetimeMax);
            const width = this._rand(particleWidthMin, particleWidthMax);
            const height = this._rand(particleHeightMin, particleHeightMax);
            const angleDeg = this._rand(particleEmissionAngleDegreesMin, particleEmissionAngleDegreesMax);
            const angleRad = angleDeg * Math.PI / 180;
            const speed = this._rand(particleSpeedMin, particleSpeedMax);
    
            const velocityX = Math.cos(angleRad) * speed;
            const velocityY = Math.sin(angleRad) * speed;
            const color = Array.isArray(particleColors)
                ? particleColors[Math.floor(Math.random() * particleColors.length)]
                : particleColors;
    
            // Apply spawn radius offset
            const theta = Math.random() * 2 * Math.PI;
            const radius = Math.sqrt(Math.random()) * particleSpawnRadius;
            const offsetX = Math.cos(theta) * radius;
            const offsetY = Math.sin(theta) * radius;
    
            this.particles.push({
                xPosition: xPosition + offsetX,
                yPosition: yPosition + offsetY,
                vx: velocityX,
                vy: velocityY,
                width,
                height,
                shape: particleShape,
                angleDegrees: angleDeg,
                color,
                age: 0,
                lifetime,
                fxRotateDegrees,
                fxSizeChangeRate
            });
        }
    }

    work() {
        const now = Date.now();
        let deltaMs = now - this.lastRanTimestamp;

        // Emit particles from emitters if due
        this.workForTag('ParticleEmitter', (tag) => {
            let emitter = tag.getEmitterDetails();
            if (now >= emitter.nextEmissionTime) {
                if (!emitter.particleEmissionCyclesMax || emitter.particleEmissionCyclesCurrent < emitter.particleEmissionCyclesMax) {
                    this._emitParticles(emitter);
                    tag.incrementParticleEmissionCyclesCurrent();
                    emitter.nextEmissionTime = now + (emitter.particleEmitFrequencyInMs || 1000);
                }
                else {
                    this._core.markRemoveEntity(tag.getEntity()?.id);
                }
            }
        });

        // Update particles
        this.particles = this.particles.filter(p => {
            p.age += deltaMs;
            if (p.age >= p.lifetime) {
                return false;
            }

            // Position
            p.xPosition += p.vx * (deltaMs / 1000);
            p.yPosition += p.vy * (deltaMs / 1000);

            // FX Rotation
            if (p.fxRotateDegrees) {
                p.angleDegrees += p.fxRotateDegrees; 
            }

            // FX Shrink
            if (p.fxSizeChangeRate) {
                p.width = p.width + p.width * p.fxSizeChangeRate
                p.height = p.height + p.height * p.fxSizeChangeRate
            }
            return true;
        });

    }

    _submitRenderableDraws(renderer, materialResolver) {
        let particles = this.particles;
        for (const particle of particles) {
            const materialId = materialResolver.resolve(particle);

            renderer.submitRenderCommand({
                materialId,
                shape: particle.shape,
                xPosition: particle.xPosition,
                yPosition: particle.yPosition,
                width: particle.width,
                height: particle.height,
                color: particle.color,
                angleDegrees: particle.angleDegrees,
                options: {} // Use later
            });
        };
    }

    _rand(min, max) {
        return Math.random() * (max - min) + min;
    }
}