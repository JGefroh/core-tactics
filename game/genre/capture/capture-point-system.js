import { default as System } from '@core/system';
import { default as Core } from '@core/core';
import { default as Entity } from '@core/entity.js'

import CapturePointComponent from './capture-point-component';
import PositionComponent from '../../engine/position/position-component';
import RenderComponent from '@game/engine/renderer/render-component';
import FactionComponent from '../factions/faction-component';

export default class CapturePointSystem extends System {
    constructor(params = {}) {
        super()
    }

    initialize() {
        this.addHandler('ADD_CAPTURE_POINT', (payload) => {
            this.addCapturePoint(payload.xPosition, payload.yPosition)
        })
    }

    addCapturePoint(x, y) {
        let entity = new Entity();
        let position = new PositionComponent({
            xPosition: x,
            yPosition: y,
            width: 100,
            height: 100
        });
        let renderComponent = new RenderComponent({
            width: 180,
            height: 180,
            // imagePath: 'CAPTURE_POINT',
            shape: 'circle',
            renderLayer: 'LOWER_DECOR',
            shapeColor: 'rgba(255,255,255, 0.3)',
            borderSize: 1,
            borderColor: 'rgba(255,255,255, 0.8)',
        });
        let factionComponent = new FactionComponent({
            faction: 'neutral'
        }) 
        let capture = new CapturePointComponent({});
        entity.addComponent(position);
        entity.addComponent(capture);
        entity.addComponent(renderComponent);
        entity.addComponent(factionComponent);
        this._core.addEntity(entity);

        this.send('SET_ENTITY_MINIMAP', { entity: entity, color: 'rgba(255,0,255, 0.8)' })
    }

    work() {
        this.workForTag('CapturePoint', (tag) => {
            tag.getEntity().getComponent('RenderComponent').borderSize = tag.getCapturePointsProgress() * 2;

            if (!tag.isTimeToProgress()) {
                return;
            }

            let factionCapturing = this.getFactionCapturing(tag);
            if (factionCapturing) {
                tag.adjustCapturePointsProgress(1);
            }
            else {
                if (tag.getCapturePointsProgress() >= 100) {
                    return;
                }
                tag.adjustCapturePointsProgress(0, true);
            }

            if (tag.getCapturePointsProgress() >= tag.getPointsToCapture()) {
                tag.setFaction(factionCapturing);
                tag.getEntity().getComponent('RenderComponent').shapeColor = FactionComponent.getFactionColor(factionCapturing);
            }
            tag.getEntity().getComponent('RenderComponent').borderColor = FactionComponent.getFactionColor(factionCapturing);

        });
    }

    getFactionCapturing(captureTag) {
        const centerX = captureTag.getXPosition();
        const centerY = captureTag.getYPosition();
        const radius = captureTag.getSize();
        const radiusSquared = radius * radius;

        let factionCapturing = null;

        this.workForTag('CanCapture', (unitTag) => {
            if (factionCapturing) {
                return;
            }

            if (unitTag.getFaction() == captureTag.getFaction() || (captureTag.getFaction() == 'ally' && unitTag.getFaction() == 'player')) {
                return; // can't capture your own point
            }

            const dx = unitTag.getXPosition() - centerX;
            const dy = unitTag.getYPosition() - centerY;
            const distanceSquared = dx * dx + dy * dy;

            if (distanceSquared <= radiusSquared) {
                factionCapturing = unitTag.getFaction() == 'player' ? 'ally' : unitTag.getFaction();
            }
        });

        return factionCapturing;
    }
}