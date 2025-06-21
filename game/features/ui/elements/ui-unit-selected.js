export default class UiUnitSelected {

    define(entity) {
        let size = Math.min(entity.getComponent('RenderComponent').width, entity.getComponent('RenderComponent').height);

        return {
            width: size * 1.6,
            height: size * 1.6,
            xPosition: 0,
            yPosition: 0, 
            fillStyle: 'rgba(72, 255, 72, 0)',
            borderColor: 'rgba(0,255,0,0.4)',
            borderSize: 1,
            isVisible: false,
            radius: size * .9,
            renderAlignment: 'center',
        }
        
    }

    update(entity) {
        let pcc = entity.getComponent('PlayerControlComponent');
        if (!pcc) {
            return {};
        }

        return {
            isVisible: pcc.isCurrentlyControlled
        }
        
    }
}