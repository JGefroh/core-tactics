import { default as Component} from '@core/component'

export default class WeaponComponent extends Component {
    constructor(payload) {
        super();
        this.componentType = "WeaponComponent"
        this.lastFired = null;
        this.currentAmmunition = payload.currentAmmunition ?? Infinity;
        this.fireRequest = null;
        this.weaponKey = payload.weaponKey || null;
        this.weaponStats = payload.weaponStats || null;
        this.targetEntity = null;
    }
}