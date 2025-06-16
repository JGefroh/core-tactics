import { uiSettings } from "../ui-settings";

export default class UiUnitProfile {

    constructor() {
        this.backgroundColor = uiSettings.backgroundColor;
        this.backgroundActiveColor = uiSettings.backgroundActiveColor;
        this.borderColor = uiSettings.borderColor;
        this.textActiveColor = uiSettings.textActiveColor;

        this.healthBarColor = uiSettings.accentRedLight;
        this.healthBarBorderColor = uiSettings.accentRedDark;
        this.healthBarBackgroundColor = uiSettings.greyModerate;
        
        this.energyBarColor = uiSettings.accentYellowLight;
        this.energyBarBorderColor = uiSettings.accentYellowDark;
        this.energyBarBackgroundColor = uiSettings.greyModerate;

        this.lineWidth = 1;

        this.barWidth = 80;
    }

    define(entity, config) {
        const group = config.group;
        const columns = 1;
        const rows = 12;

        const width = 128;
        const height = 20;

        const index = parseInt(group);
        const col = index % columns;
        const row = Math.floor(index / columns);


        const marginY = 8 * index;
        const xPosition = col * width;
        const yPosition = row * height;

        let xWindowOffset = 18
        let yWindowOffset = 20

        const textWidth = 84;
        let barYOffset = 4;

        ///

        let boxWidth = 150;
        let boxHeight = 20;


        return [
            //Unit Group
            {
                text: group,
                width: boxHeight,
                height: boxHeight,
                canvasXPosition: xPosition + xWindowOffset,
                canvasYPosition: yPosition + yWindowOffset + marginY,
                fillStyle: this.backgroundActiveColor,
                strokeStyle: this.borderColor,
                isVisible: true,
                attachedToEntity: null,
                textOffsetX: 2,
                textOffsetY: 4,
                fontSize: 12, 
            },

            // Full Box w/ BG and Unit name
            {
                width: boxWidth,
                height: boxHeight,
                canvasXPosition: xPosition + xWindowOffset + boxHeight,
                canvasYPosition: yPosition + yWindowOffset + marginY,
                fillStyle: this.backgroundColor || 'rgba(255,0,0,1)',
                strokeStyle: this.borderColor,
                isVisible: true,
                attachedToEntity: null,
                text: 'Tank',
                textOffsetX: 4,
                textOffsetY: 4,
                onClick: (core) => {
                    core.send('PLAYER_COMMAND', {command: 'selectUnit', entity: entity})
                }
            },
            // Health bar Bg
            {
                width: this.barWidth,
                height: 5,
                canvasXPosition: xPosition + xWindowOffset + textWidth,
                canvasYPosition: yPosition + yWindowOffset + marginY + barYOffset,
                fillStyle: this.healthBarBackgroundColor,
                strokeStyle: this.healthBarBorderColor,
                lineWidth: this.lineWidth,
                isVisible: true,
                attachedToEntity: null,
                textOffsetX: 4,
                textOffsetY: 4,
            },
            // Health bar
            {
                width: this.barWidth,
                height: 5,
                canvasXPosition: xPosition + xWindowOffset + textWidth,
                canvasYPosition: yPosition + yWindowOffset + marginY + barYOffset,
                fillStyle: this.healthBarColor,
                strokeStyle: this.healthBarBorderColor,
                lineWidth: this.lineWidth,
                isVisible: true,
                attachedToEntity: null,
                textOffsetX: 4,
                textOffsetY: 4,
            },

            // Energy bar Bg
            {
                width: this.barWidth,
                height: 3,
                canvasXPosition: xPosition + xWindowOffset + textWidth,
                canvasYPosition: yPosition + yWindowOffset + marginY + 8 + barYOffset,
                fillStyle: this.energyBarBackgroundColor,
                strokeStyle: this.energyBarBorderColor,
                lineWidth: this.lineWidth,
                isVisible: true,
                attachedToEntity: null,
                textOffsetX: 4,
                textOffsetY: 4,
            },
            // Energy bar
            {
                width: this.barWidth,
                height: 3,
                canvasXPosition: xPosition + xWindowOffset + textWidth,
                canvasYPosition: yPosition + yWindowOffset + marginY + 8 + barYOffset,
                fillStyle: this.energyBarColor,
                strokeStyle: this.energyBarBorderColor,
                lineWidth: this.lineWidth,
                isVisible: true,
                attachedToEntity: null,
                textOffsetX: 4,
                textOffsetY: 4,
            },


        ]
        
    }

    update(entity) {
        let pcc = entity.getComponent('PlayerControlComponent');
        if (!pcc) {
            return {};
        }
        let healthComponent = entity.getComponent('HealthComponent');
        let energyComponent = entity.getComponent('EnergyComponent');

        let group = entity.getComponent('GroupComponent')?.group;
        if (group) {
            group = parseInt(group)
        }

        let nameComponent = entity.getComponent('NameComponent');
        let text = `${nameComponent?.name || 'Unit'}`;
        
        let isVisible = entity.id

        return [
            {
                text: group == null ? '' : `${group + 1}`,
                textOffsetX: group == null ? 0 : (parseInt(group) + 1 < 10) ? 6 : 3,
                fillStyle: healthComponent.health > 0 && pcc.isCurrentlyControlled ? this.backgroundActiveColor : this.backgroundColor,
                fontColor: healthComponent.health > 0 && pcc.isCurrentlyControlled ? this.textActiveColor : this.textColor,
            },
            { 
                text: text,
            },
            {
            },
            {
                width: Math.max((healthComponent.health / healthComponent.healthMax) * this.barWidth, 0),
            },
            {
            },
            {
                width: Math.max((energyComponent.energy / energyComponent.energyMax) * this.barWidth, 0),
            }
        ]
        
    }
}