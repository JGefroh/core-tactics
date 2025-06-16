import { default as Component} from '@core/component'

export default class PlayerIntentTargetableComponent extends Component {
    constructor(payload = {}) {
        super();
        this.componentType = "PlayerIntentTargetableComponent"
        this.intents = payload.intents || {};
    }
}