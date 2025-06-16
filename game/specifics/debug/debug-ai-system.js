import { default as System } from '@core/system';

export default class DebugAiSystem extends System {
    constructor() {
        super();
        this.guis = {};
    }

    initialize() {
        if (window.location.href.indexOf('debugai') != -1) {
          this.addHandler('DEBUG_AI_DATA', (data) => {
            Object.keys(data).forEach((entityId) => {
              this.createGuiElementsForEntity(entityId);
              let debugData = data[entityId];

              let entity = this._core.getEntityWithId(entityId);
              let state = entity.getComponent('AiComponent').currentState


              this.send("GUI_UPDATE_TEXT", {
                key: `debug-ai-${entityId}`,
                value: `${debugData.goal.constructor.name} -> ${debugData.tactic.constructor.name} -> ${debugData.action.constructor.name}-> ${debugData.step?.constructor?.name}}`
              })
            })

          })
        }
    }

    createGuiElementsForEntity(entityId) {
      if (!this.guis[entityId]) {
        this.guis[entityId] = true;
        this.send('ADD_GUI_RENDERABLE', {
            key: `debug-ai-${entityId}`,
            text: 'm####x####',
            fontSize: 10,
            attachedToEntity: this._core.getEntityWithId(entityId)
        });
        this.send('ADD_GUI_RENDERABLE', {
            key: `debug-ai-${entityId}-state`,
            offsetXAmount: 0,
            offsetYAmount: 20,
            // text: 'm####x####',
            fontSize: 10,
            attachedToEntity: this._core.getEntityWithId(entityId)
        });
      }
    }

    floatTo(key, entity) {
      let viewport = this._core.getData('VIEWPORT');
      if (!viewport) {
        return;
      }

      let worldXPosition = entity.getComponent('PositionComponent').xPosition;
      let worldYPosition = entity.getComponent('PositionComponent').yPosition;
      let canvasXPosition = (worldXPosition - viewport.xPosition) * viewport.scale;
      let canvasYPosition = (worldYPosition - viewport.yPosition) * viewport.scale;

      this.send("GUI_UPDATE_PROPERTIES", {
        key: key,
        value: {
          xPosition: canvasXPosition,
          yPosition: canvasYPosition
        }
      })
    }
    
    work() {

    }
} 

