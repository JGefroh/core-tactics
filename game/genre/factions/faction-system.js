import { default as Entity } from '@core/entity.js';
import { default as System } from '@core/system';
import FactionComponent from './faction-component';

export default class FactionSystem extends System {
    constructor() {
        super()

        FactionComponent.setFactionColors({
            'ally': 'rgba(0,0,255, 1)',
            'enemy': 'rgba(255,0 ,0, 1)',
            'player': 'rgba(0,255,0, 1)',
            'neutral': 'rgba(255,255,255, 1)'
        })

        this.factions = {
            'enemy': {
                enemies: ['player', 'ally']
            },
            'neutral': {
                enemies: []
            },
            'ally': {
                enemies: ['enemy']
            },
            'player': {
                enemies: ['enemy']
            }
        }

        this.addHandler('SET_ENTITY_FACTION', (payload) => {
            this.setEntityFaction(payload.entity, payload.faction)
        });

        this._core.publishData('FACTIONS', this.factions)
    }

    setEntityFaction(entity, faction) {
        if (entity.getComponent('FactionComponent')) {
            entity.getComponent('FactionComponent').faction = faction;
        }
        else {
            entity.addComponent(new FactionComponent({faction: faction}))
        }

    }

    work() {

    }
}
