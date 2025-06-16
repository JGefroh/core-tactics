import { default as System } from '@core/system';
import { default as Core } from '@core/core';
import { default as Entity } from '@core/entity.js'

import SpawnPointComponent from './spawn-point-component';
import PositionComponent from '../../engine/position/position-component';
import RenderComponent from '@game/engine/renderer/render-component';

export default class SpawnPointSystem extends System {
    constructor() {
        super()
    }

    initialize() {
        this.addHandler('ADD_SPAWN_POINT', (payload) => {
            this.addSpawnPoint(payload.xPosition, payload.yPosition, payload.faction)
        })

        this.addHandler('REQUEST_SPAWN', (payload) => {
            if (payload.entities) {
                this.requestSpawnEntities(payload.entities)
            }
            else {
                this.requestSpawnEntity(payload.entity)
            }
        })

        this.addSpawnPoint(300, 300, 'ally', 'rgba(0,0,255,0.8)');
        this.addSpawnPoint(300, 2700, 'ally', 'rgba(0,0,255,0.8)');
        this.addSpawnPoint(2700, 2700, 'enemy', 'rgba(255,0,0,0.5)');
        this.addSpawnPoint(2700, 300, 'enemy', 'rgba(255,0,0,0.5)');
    }

    addSpawnPoint(x, y, faction, color) {
        let entity = new Entity();
        let position = new PositionComponent({
            xPosition: x,
            yPosition: y,
            width: 100,
            height: 100
        });
        let renderComponent = new RenderComponent({
            width: 300,
            height: 300,
            imagePath: 'SPAWN_POINT',
            renderLayer: 'LOWER_DECOR',
            shapeColor: color
        });
        let spawn = new SpawnPointComponent({});
        entity.addComponent(position);
        entity.addComponent(spawn);
        entity.addComponent(renderComponent);
        this._core.addEntity(entity);
        this.send('SET_ENTITY_MINIMAP', { entity: entity, color: color })
        this.send('SET_ENTITY_FACTION', { entity: entity, faction: faction })
    }

    selectSpawnPoint(faction) {
        let validSpawns = [];

        this.workForTag('SpawnPoint', (spawn) => {
            if (spawn.getFaction() === faction || (faction === 'player' && spawn.getFaction() === 'ally')) {
                validSpawns.push(spawn.getEntity());
            }
        });;
        let spawn = this._randomFrom(validSpawns);
        return spawn;
    }

    requestSpawnEntities(entities) {
        let spawn = this.selectSpawnPoint(entities[0].getComponent('FactionComponent')?.faction);
        entities.forEach((entity) => {
            this.requestSpawnEntity(entity, spawn)
        });
    }

    requestSpawnEntity(entity1, spawnEntity) {
        const position = entity1.getComponent('PositionComponent');
        const collision = entity1.getComponent('CollisionComponent');
        const faction = entity1.getComponent('FactionComponent')?.faction;

        if (!position || !collision || !faction) return;

        const proposed = {
            width: position.width,
            height: position.height,
            angleDegrees: position.angleDegrees,
            shape: collision.collisionShape,
            group: collision.collisionGroup
        };

        let spawnX = null;
        let spawnY = null;

        if (!spawnEntity) {
            spawnEntity = this.selectSpawnPoint(faction);
        }

        if (!spawnEntity) {
            return;
        }
        
        let spawn = this.getTag('SpawnPoint');
        spawn.setEntity(spawnEntity);


        spawnX = spawn.getXPosition();
        spawnY = spawn.getYPosition();

        if (spawnX === null || spawnY === null) return;

        const spacing = Math.max(proposed.width, proposed.height);

        this._scanSpawnPosition(entity1, position, proposed, spawnX, spawnY, spacing);
    }

    _scanSpawnPosition(entity, positionComponent, proposed, baseX, baseY, spacing) {
        const maxAttempts = 100;
        let attempts = 0;
        let found = false;

        const tryNext = () => {
            if (attempts >= maxAttempts || found) return;

            const ring = Math.floor((Math.sqrt(attempts) + 1) / 2);
            const side = ring * 2 + 1;
            const px = baseX + ((attempts % side) - ring) * spacing;
            const py = baseY + (Math.floor(attempts / side) - ring) * spacing;

            attempts++;
            this._trySpawnPosition(entity, positionComponent, proposed, px, py, tryNext, () => {
                found = true;
            });
        };

        tryNext();
    }

    _trySpawnPosition(entity, positionComponent, proposed, x, y, onFail, onSuccess) {
        const trial = {
            shape: proposed.shape,
            xPosition: x,
            yPosition: y,
            width: proposed.width,
            height: proposed.height,
            angleDegrees: proposed.angleDegrees,
            group: proposed.group
        };

        this.send('REQUEST_COLLISION_CHECK', {
            ...trial,
            callback: (result) => {
                if (!result) {
                    positionComponent.xPosition = trial.xPosition;
                    positionComponent.yPosition = trial.yPosition;
                    onSuccess();
                } else {
                    onFail();
                }
            }
        });
    }

    _randomFrom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}