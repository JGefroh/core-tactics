import { default as Component } from '@core/component';

export default class FactionComponent extends Component {
    constructor(payload) {
        super()
        this.componentType = 'FactionComponent'
        this.faction = payload.faction || 'neutral'
    }
}