import { default as Component } from '@core/component';

export default class EnergyComponent extends Component {
    constructor(payload = {}) {
        super();
        this.componentType = 'EnergyComponent';

        this.energy = payload.energy || 100;
        this.energyMax = payload.energyMax || payload.energy || 100;

        this.isRecharging = payload.isRecharging || false;
        this.rechargeRatePerSecond = payload.rechargeRatePerSecond || 0;
        this.lastAdjustedTimestamp = Date.now();

        // Callbacks
        this.onEnergyLoss = payload.onEnergyLoss || (() => {});
        this.onEnergyZero = payload.onEnergyZero || (() => { return 'default' });
    }
} 