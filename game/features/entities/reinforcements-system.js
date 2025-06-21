import { default as System } from '@core/system';


export default class ReinforcementsSystem extends System {
    constructor() {
        super()
        this.wait = 1000;

        this.reinforcementsByFaction = {
            'enemy': 500,
            'ally': 500
        };
    }

    work() {
        let countsByFaction = {};
        this.workForTag('Faction', (tag) => {
            if (!countsByFaction[tag.getFaction()]) {
                countsByFaction[tag.getFaction()] = 0;
            }

            if (tag.getEntity().hasLabel('IsUnit')) {
                countsByFaction[tag.getFaction()]++;
            }
        });

        Object.keys(countsByFaction).forEach((faction) => {
            if (faction != 'player' && countsByFaction[faction] < 20 && this.reinforcementsByFaction[faction] > 0) {
                this.reinforceFaction(faction, 3)
            }
        })

        if (!countsByFaction['player']) {
            this.send('SHOW_REINFORCEMENTS_SCREEN')
        }

        this._core.publishData('REINFORCEMENTS', this.reinforcementsByFaction)

        if (this.reinforcementsByFaction['enemy'] <= 0 && countsByFaction['enemy'] <= 0) {
            this._core.send('REQUEST_GAME_OVER', {winner: 'ally'})
        }
        else if (this.reinforcementsByFaction['ally'] <= 0 && (countsByFaction['ally'] + (countsByFaction['player'] || 0)) <= 0) {
            this._core.send('REQUEST_GAME_OVER', {winner: 'enemy'})
        }

    }

    reinforceFaction(faction, count) {
        let unitCount = Math.max(6, Math.floor(Math.random() * 12));

        for (let i = 0; i < Math.random() * count; i++) {
            this.workForTag('SpawnPoint', (spawn) => {
                if (spawn.getFaction() == faction) {
                    this.send('CREATE_SQUAD', {
                        count: count,
                        faction: faction,
                        unitType: 'random'
                    })
                    this.reinforcementsByFaction[faction] -= unitCount;
                    this.reinforcementsByFaction[faction] = Math.max(this.reinforcementsByFaction[faction], 0)
                }
            })
            
        }
        
    }
}