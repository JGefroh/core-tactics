import { default as Entity } from '@core/entity.js';
import { default as System } from '@core/system';

import AiComponent from '@game/engine/ai/ai-component';
import VectorComponent from '@game/engine/movement/vector-component';
import PositionComponent from '@game/engine/position/position-component';
import RenderComponent from '@game/engine/renderer/render-component';
import PlayerControlComponent from '@game/features/player-control/player-control-component';
import AttachedComponent from '../../engine/attachments/attached-component';
import CollisionComponent from '../../engine/collision/collision-component';
import EnergyComponent from '../../genre/combat/energy/energy-component';
import HealthComponent from '../../genre/combat/health-component';
import WeaponComponent from '../../genre/combat/weapons/weapon-component';
import FactionComponent from '../../genre/factions/faction-component';
import GroupComponent from '../../genre/grouping/group-component';
import NameComponent from '../../genre/names/name-component';
import PlayerIntentTargetableComponent from '../player-control/player-intent-targetable-component';
import GuiAttachmentComponent from '@game/engine/gui/gui-attachables/gui-attachment-component';
import MinimapComponent from '../ui/ui-minimap/minimap-component';

export default class UnitGenerationSystem extends System {
    constructor(params = {}) {
        super()
        this.noSpawn = params.noSpawn;

        this.units = {
            "sniper": {
                "shape": {
                    "width": 60,
                    "height": 60,
                    "shape": "circle",
                    "image": "UNIT_SNIPER"
                },
                "health": 1000,
                "energy": 3000,
                "weapon": {
                    "weaponKey": "sniper",
                    "damage": 1500,
                    "energy": 30,
                    "range": 1500,
                    "cooldownMs": 8000,
                    "fxOnHit": "FxHitSniper"
                },
                "speed": 0.5
            },
            "gunner": {
                "shape": {
                    "width": 50,
                    "height": 50,
                    "shape": "circle",
                    "image": "UNIT_GUNNER"
                },
                "health": 4000,
                "energy": 3000,
                "weapon": {
                    "weaponKey": "machine_gun",
                    "damage": 300,
                    "energy": 30,
                    "range": 500,
                    "cooldownMs": 1000,
                    "fxOnHit": "FxHitMachineGun",
                    "fxOnFire": "FxFireMachineGun"
                },
                "speed": 2
            },
            "tank": {
                "shape": {
                    "width": 75,
                    "height": 45,
                    "shape": "rectangle",
                    "image": "UNIT_TANK"
                },
                "health": 18000,
                "energy": 5000,
                "weapon": {
                    "weaponKey": "cannon",
                    "damage": 550,
                    "energy": 100,
                    "range": 800,
                    "cooldownMs": 3000,
                    "fxOnHit": "FxHitCannon",
                    "fxOnFire": "FxFireCannon"
                },
                 "speed": 1
            },
            "slicer": {
                "shape": {
                    "width": 30,
                    "height": 30,
                    "shape": "rectangle",
                    "image": "UNIT_SLICER"
                },
                "health": 1800,
                "energy": 1000,
                "weapon": {
                    "weaponKey": "laser_sword",
                    "damage": 600,
                    "range": 180,
                    "energy": 5,
                    "cooldownMs": 300,
                    'fxOnHit': 'FxHitLaserSword',
                },
                "speed": 4
            }
        }

        if (window.location.href.indexOf('debugunit') != -1) {
            this.units['debug'] = {
                "shape": {
                    "width": 100,
                    "height": 100,
                    "shape": "circle",
                },
                "health": 2000000,
                "energy": 3000000,
                "weapon": {
                    "weaponKey": "sniper",
                    "damage": 1000500,
                    "energy": 30,
                    "range": 150000,
                    "cooldownMs": 50,
                    "fxOnHit": "FxHitSniper"
                },
                "speed": 0.5
            }
        }

        this.addHandler('CREATE_SQUAD', (payload) => {
            let unit = null;
            if (!payload.unitType || payload.unitType == 'random') {
                unit = this._randomFrom(Object.keys(this.units));
            }
            else {
                unit = payload.unitType;
            }

            this.createSquad(payload.xPosition, payload.yPosition, payload.count, payload.faction, unit);
        });
    }

    work() {
    }

    initialize() {
        if (this.noSpawn) {
            return;
        }


        if (this.units['debug']) {
            this.createSquad(500, 100, 12, 'player', 'debug');
        }
        else {
            // this.createSquad(500, 100, 12, 'player', 'tank');
        }

        // this.createSquad(0, 500, 12, 'ally', 'slicer');
        // this.createSquad(0, 2500, 12, 'ally', 'tank');

        // this.createSquad(2500, 500, 12, 'enemy', 'tank');
        // this.createSquad(2500, 100, 7, 'enemy', 'slicer');
        // this.createSquad(2500, 2500, 12, 'enemy', 'tank');
        // this.createSquad(2500, 2500, 12, 'enemy', 'gunner');

    }

    createSquad(x, y, count, faction, unitType) {
        const spacing = 60;
        const unitsPerRow = Math.ceil(Math.sqrt(count)); 

        let unitEntities = [];

        for (let i = 0; i < count; i++) {
            const row = Math.floor(i / unitsPerRow);
            const col = i % unitsPerRow;

            const unitX = x + col * spacing;
            const unitY = y + row * spacing;

            let group = `${i}`;

            unitEntities.push(this.createUnit(unitX, unitY, faction, unitType, group));
        }

        this.send('REQUEST_SPAWN', {entities: unitEntities});
    }

    createUnit(x, y, faction, unitType, group) {
        let color = FactionComponent.getFactionColor(faction)

        let unit = this.units[unitType]

        let entity = new Entity();
        entity.addLabel('CanCapture')
        entity.addLabel('IsUnit')
        entity.addLabel(`UnitType:${unitType}`)
        let position = new PositionComponent({
            xPosition: x,
            yPosition: y,
            width: unit.shape.width,
            height: unit.shape.height
        });
        let render = new RenderComponent({
            width: unit.shape.width,
            height: unit.shape.height,
            shape: unit.shape,
            shapeColor: color,
            imagePath: unit.shape.image
        });
        let vector = new VectorComponent({
            maxMagnitude: unit.speed,
            bleedAmount: 0.3
        });
        let collision = new CollisionComponent({
            collisionGroup: 'character',
            collisionShape: 'circle',
            width: Math.min(unit.shape.width, unit.shape.height), 
            height: Math.min(unit.shape.width, unit.shape.height),
        })

        let health = new HealthComponent({
            health: unit.health,
            onHealthZero: () => {
                this._core.send('EXECUTE_FX', {
                    fxKey: 'FxDeath',
                    params: {
                        xPosition: position.xPosition,
                        yPosition: position.yPosition,
                    }
                })
                return 'default'
            }
        })

        let minimap = new MinimapComponent({
            color: color
        })
        let name = new NameComponent({
            name: faction == 'player' ? unitType.charAt(0).toUpperCase() + unitType.slice(1).toLowerCase() : null
        });

        let markers = {
            'UI_HEALTH_BAR': true,
            'UI_UNIT_SELECTED': faction == 'player',
            'UI_UNIT_NAME': true
        }
        if (faction == 'player') {
            markers[`UI_UNIT_PROFILE`] = { group: group }
            markers['UI_ENERGY_BAR'] = true
        }

        let ui = new GuiAttachmentComponent({
            markers: markers
        });
        let control = new PlayerControlComponent({});
        let ai = new AiComponent({});
        let factionC = new FactionComponent({
            faction: faction
        })
        let intentTarget = new PlayerIntentTargetableComponent({
            intents: {
                'attackTarget': faction != 'player',
                'selectUnit': faction == 'player'
            }
        });

        if (faction == 'player') {
            let groupC = new GroupComponent({
                group: group
            });
            entity.addComponent(groupC);

        }

        let energy = new EnergyComponent({
            energy: unit.energy,
            onEnergyZero: () => {
                entity.removeComponent('VectorComponent');
            }
        });

        entity.addComponent(position);
        entity.addComponent(render);
        entity.addComponent(collision);
        entity.addComponent(health);
        entity.addComponent(minimap)
        entity.addComponent(energy);
        entity.addComponent(name);

        if (faction == 'player') {
            entity.addComponent(control);
        }
        entity.addComponent(factionC);
        entity.addComponent(vector);
        entity.addComponent(ai);
        entity.addComponent(ui);
        entity.addComponent(intentTarget)
        this._core.addEntity(entity);

        if (faction != 'player') {
            ai.goal = 'goal_attack'
        }
        else {
            ai.goal = 'goal_defend'
        }
        this._addWeapon(entity, unit.shape.width, unit.weapon)
        return entity;
    }

    _addWeapon(parentEntity, width, weapon) {
        
        let entity = new Entity();
        let position = new PositionComponent({
            width: 4,
            height: 4,
        });
        let attached = new AttachedComponent({
            attachedToEntity: parentEntity,
            attachmentOptions: {
                xPosition: (width / 2) - 4
            },
            sync: ['xPosition', 'yPosition', 'angleDegrees']
        });
        let weaponC = new WeaponComponent({
            weaponKey: weapon.weaponKey
        });
        weaponC.weaponStats = weapon
        entity.addComponent(position)
        entity.addComponent(attached)
        entity.addComponent(weaponC)
        this._core.addEntity(entity)
        parentEntity.setChild('weapon', entity);
    }

    _randomFrom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}