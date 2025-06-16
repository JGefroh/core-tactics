export default class UiHealthBar {

    constructor(suffix) {
        this.suffix = suffix;
    }
    
    define(entity) {
        let definitions = [
            {
                key: `gui-ui-health-bar-${entity.id}-0-${this.suffix}`,
                width: 100,
                height: 5,
                offsetYAmount: -(entity.getComponent('RenderComponent').height / 2) - 20,
                fillStyle: 'rgb(72, 72, 72)',
                strokeStyle: 'rgba(0,0,255,1)',
                text: '',
                fontSize: 16,
                isVisible: false
            },
            {
                key: `gui-ui-health-bar-${entity.id}-1-${this.suffix}`,
                width: 100,
                height: 5,
                offsetYAmount: -(entity.getComponent('RenderComponent').height / 2) - 20,
                fillStyle: 'rgba(255,0,0,1)',
                text: '',
                fontSize: 16,
                isVisible: false
            }
        ]

        definitions.push(
            {
                // Pseudo-box to allow for hover
                key: `gui-ui-health-bar-${entity.id}-2-${this.suffix}`,
                width: entity.getComponent('RenderComponent').width,
                height: entity.getComponent('RenderComponent').height,
                fillStyle: 'rgba(255,0,0,0)',
                text: '',
                fontSize: 16,
                isVisible: true,
                renderAlignment: 'center',
                onHover: (core, guiEntity, params) => {
                    core.getEntityWithKey(definitions[0].key).getComponent('GuiCanvasRenderComponent').isVisible = true;
                    core.getEntityWithKey(definitions[1].key).getComponent('GuiCanvasRenderComponent').isVisible = true;
                },
                onHoverStop: (core, guiEntity, params) => {
                    core.getEntityWithKey(definitions[0].key).getComponent('GuiCanvasRenderComponent').isVisible = false;
                    core.getEntityWithKey(definitions[1].key).getComponent('GuiCanvasRenderComponent').isVisible = false;
                }
            }
        )

        return definitions;
    }

    update(entity) {
        let healthComponent = entity.getComponent('HealthComponent');

        return [
            {}, 
            {
                key: `gui-ui-health-bar-${entity.id}-1-${this.suffix}`,
                width: Math.max((healthComponent.health / healthComponent.healthMax) * 100, 0)
            },
            {}
        ]
    }
}