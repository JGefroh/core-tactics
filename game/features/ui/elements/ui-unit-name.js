export default class UiUnitName {

    constructor(suffix) {
        this.suffix = suffix;
    }
    define(entity) {
        let faction = entity.getComponent('FactionComponent')?.faction;

        let color = null;
        if (faction == 'ally') {
            color =  'rgba(0,0,255, 1)'
        }
        else if (faction == 'player') {
            color =  'rgba(0,255,0, 1)'
        }
        else if (faction == 'enemy') {
            color = 'rgba(255,0 ,0, 1)'
        }
        else {
            color = 'rgba(255,255,255, 1)'
        }

        let definitions = [
            {
                key: `gui-ui-unit-name-${entity.id}-1-${this.suffix}`,
                width: 100,
                height: 5,
                offsetYAmount: -70,
                text: entity.getComponent('NameComponent')?.name,
                fontSize: 16,
                fontColor: color,
                isVisible: false,
            }
        ]
        definitions.push(
            {
                // Pseudo-box to allow for hover
                key: `gui-ui-unit-name-${entity.id}-3-${this.suffix}`,
                width: entity.getComponent('RenderComponent').width,
                height: entity.getComponent('RenderComponent').height,
                text: '',
                fontSize: 16,
                isVisible: true,
                renderAlignment: 'center',
                onHover: (core, guiEntity, params) => {
                    core.getEntityWithKey(definitions[0].key).getComponent('GuiCanvasRenderComponent').isVisible = true;
                },
                onHoverStop: (core, guiEntity, params) => {
                    core.getEntityWithKey(definitions[0].key).getComponent('GuiCanvasRenderComponent').isVisible = false;
                }
            }
        )
        return definitions;
    }

    update(entity) {
        return [
            {
            }, 
            {}
        ]
    }
}