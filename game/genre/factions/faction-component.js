import { default as Component } from '@core/component';

export default class FactionComponent extends Component {
    static factionColors;

    constructor(payload) {
        super()
        this.componentType = 'FactionComponent'
        this.faction = payload.faction || 'neutral'
    }

    static setFactionColors(factionColors) {
        FactionComponent.factionColors = factionColors;
    }

    static getFactionColor(faction) {
        return FactionComponent.factionColors[faction];
    }
}