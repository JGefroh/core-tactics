import { default as Component} from '@core/component'

export default class NameComponent extends Component {
    constructor(payload = {}) {
        super();
        this.componentType = 'NameComponent';
        this.name = payload.name || this.generateRandomName();
    }

    generateRandomName() {
        const callsigns = [
            "Viper", "Ghost", "Falcon", "Cancer", "Shadow", "Blaze", "Raptor", "Titan", "Specter", "Hawk",
            "Reaper", "Maverick", "Phantom", "Rogue", "Sabre", "Onyx", "Striker", "Venom", "Gunner", "Raider",
            "Spartan", "Hunter", "Cyclone", "Havoc", "Inferno", "Thunder", "Nova", "Vortex", "Fury", "Saber",
            "Gladiator", "Tempest", "Drifter", "Banshee", "Warden", "Juggernaut", "Predator", "Howl", "Ember", "Pulse",
            "Blizzard", "Cobra", "Prowler", "Obsidian", "Meteor", "Raven", "Helix", "Scorpion", "Stalker", "Crimson"
        ];
        const surnames = [
            "Marksen", "Steel", "Hunter", "Graves", "Stone", "Wolf", "Cross", "Drake", "Voss", "Striker",
            "Warden", "Griffin", "Holt", "Blaze", "Dagger", "Archer", "Viper", "Knight", "Slade", "Talon",
            "Fletcher", "Cage", "Hawke", "Storm", "Blackwood", "Stroud", "Frost", "Bane", "Cortez", "Maddox",
            "Ryder", "Trevino", "Slater", "Kane", "Dane", "Mercer", "Nash", "Quinn", "Rourke", "Shaw",
            "Thorne", "Underwood", "Vaughn", "York", "Xavier", "Blanchard", "Creed", "Dalton", "Everett", "Fox"
        ];
        const callsign = this.getRandomElement(callsigns);
        const surname = this.getRandomElement(surnames);

        return `\"${callsign}\" ${surname}`;
        
    }
    getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}