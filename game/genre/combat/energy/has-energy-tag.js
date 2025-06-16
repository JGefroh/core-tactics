import { default as Tag } from '@core/tag';

export default class HasEnergy extends Tag {
    static tagType = 'HasEnergy';

    constructor() {
        super();
        this.tagType = 'HasEnergy';
    }

    static isAssignableTo(entity) {
        return entity.hasComponent('EnergyComponent');
    }

    adjust(amount) {
        this.entity.getComponent('EnergyComponent').energy -= amount;
        this.entity.getComponent('EnergyComponent').lastAdjustedTimestamp = Date.now()
    }

    getEnergy() {
        return this.entity.getComponent('EnergyComponent').energy;
    }

    isEnergyZero() {
        return this.entity.getComponent('EnergyComponent').energy <= 0;
    }

    onEnergyLoss() {
        return this.entity.getComponent('EnergyComponent').onEnergyLoss(this.entity, this.getEnergy());
    }

    onEnergyZero() {
        return this.entity.getComponent('EnergyComponent').onEnergyZero(this.entity, this.getEnergy());
    }
} 