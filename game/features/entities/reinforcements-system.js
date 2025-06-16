import { default as System } from '@core/system';


export default class ReinforcementsSystem extends System {
    constructor() {
        super()
        this.wait = 3000;
    }

    work() {
        let countsByFaction = {};
        this.workForTag('Faction', (tag) => {
            if (!countsByFaction[tag.getFaction()]) {
                countsByFaction[tag.getFaction()] = 0;
            }

            countsByFaction[tag.getFaction()]++;
        });

        Object.keys(countsByFaction).forEach((faction) => {
            if (faction != 'player' && countsByFaction[faction] < 20) {
                this.reinforceFaction(faction, 3)
            }
        })
        if (!countsByFaction['player']) {
            this.send('SHOW_REINFORCEMENTS_SCREEN')
        }
    }

    reinforceFaction(faction, count) {
        for (let i = 0; i < Math.random() * count; i++) {
            this.workForTag('SpawnPoint', (spawn) => {
                if (spawn.getFaction() == faction) {
                    this.send('CREATE_SQUAD', {
                        count: Math.max(6, Math.floor(Math.random() * 12)),
                        faction: faction,
                        unitType: 'random'
                    })
                }
            })
            
        }
        
    }
}