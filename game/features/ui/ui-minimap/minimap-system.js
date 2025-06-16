import { default as System } from '@core/system';
import { default as Entity } from '@core/entity.js'
import MinimapComponent from './minimap-component';
import { uiSettings } from '../ui-settings';

export default class MinimapSystem extends System {
    constructor() {
      super()
      this.wait = 50
      setTimeout(() => {
        let viewport = this._core.getData('VIEWPORT');
        this.worldBounds = { x: 0, y: 0, width: 3000, height: 3000 };

        this.panelWidth = 170;
        this.panelHeight = 170;
        this.panelX = 20;
        this.panelY = viewport.height - this.panelHeight - 10;

        this.radarScale = 1;
        this.radarCenterX = 0;
        this.radarCenterY = 0;

        this.radarBgColor = uiSettings.backgroundColor
        this.radarBorderColor = uiSettings.borderColor
  
        this._addPanel()
        this.startSync = true;
      }, 100)

      this.addHandler('SET_ENTITY_MINIMAP', (payload) => {
        this.addToMinimap(payload.entity, payload.color);
      });

      this.addHandler('INPUT_RECEIVED', (payload) => {
        if (payload.type == 'mouse_press') {
          let clickX = payload.canvas.xPosition;
          let clickY = payload.canvas.yPosition;

          // Check if click is inside radar bounds
          if (clickX >= this.panelX && clickX <= this.panelX + this.panelWidth &&
              clickY >= this.panelY && clickY <= this.panelY + this.panelHeight) {

            // Local radar panel coordinates
            let radarLocalX = clickX - this.panelX;
            let radarLocalY = clickY - this.panelY;

            // World bounds and radar scale
            let worldX = this.worldBounds.x;
            let worldY = this.worldBounds.y;
            let worldWidth = this.worldBounds.width;
            let worldHeight = this.worldBounds.height;

            let scaleX = worldWidth / this.panelWidth;
            let scaleY = worldHeight / this.panelHeight;

            // Convert radar click to world coordinates
            let worldClickX = radarLocalX * scaleX + worldX;
            let worldClickY = radarLocalY * scaleY + worldY;

            // Center viewport there
            this._core.send('SET_VIEWPORT', {
              xPosition: worldClickX,
              yPosition: worldClickY
            });
          }
        }
      });
    }

    work() {
      if (!this.startSync) {
        return; // Avoid radar objects being rendered behind the radar.
      }
      this.syncRadarViewport()
      this.syncRadarObjects();
    };


    syncRadarViewport() {
      let viewport = this._core.getData('VIEWPORT');

      let worldX = this.worldBounds.x;
      let worldY = this.worldBounds.y;
      let worldWidth = this.worldBounds.width;
      let worldHeight = this.worldBounds.height;

      // Radar panel size
      let radarXPosition = this.panelX;
      let radarYPosition = this.panelY;
      let radarWidth = this.panelWidth;
      let radarHeight = this.panelHeight;

      // Scale factor
      let scaleX = radarWidth / worldWidth;
      let scaleY = radarHeight / worldHeight;

      let radarViewportWidth = viewport.width * scaleX;
      let radarViewportHeight = viewport.height * scaleY;
      
      // Compensate for getXPosition() adding (width / 2)
      let radarViewportX = radarXPosition + (viewport.xPosition - worldX) * scaleX;
      let radarViewportY = radarYPosition + (viewport.yPosition - worldY) * scaleY;


      this.send('GUI_UPDATE_PROPERTIES', {
        key: 'radar-viewport-box',
        value: {
          canvasXPosition: radarViewportX,
          canvasYPosition: radarViewportY,
          width: radarViewportWidth,
          height: radarViewportHeight,
        }
      });
    }

    addToMinimap(entity, color) {
      if (entity.getComponent('MinimapComponent')) {
        entity.getComponent('MinimapComponent').color = color;
      }
      else {
        entity.addComponent(new MinimapComponent({
          color: color
        }));
      }
    }


    syncRadarObjects() {
      let viewport = this._core.getData('VIEWPORT');
      let entitiesModified = []

    
      this.workForTag('Minimap', (tag, entity) => {
        let key = `radar-panel-object-${entity.id}`;
        entitiesModified.push(entity.getId())

        let radarTag = this._core.getKeyedAs(key)
        if (!radarTag) {
          this.send('ADD_GUI_RENDERABLE', {
            key: key,
            width: 8,
            height: 8,
            xPosition: 0,
            yPosition: 0,
          });
        }
        
        let radarPosition = this._calculateRadarPosition(viewport, entity);

        this.send('GUI_UPDATE_PROPERTIES', {key: key, value: {
          canvasXPosition: radarPosition.canvasXPosition, 
          canvasYPosition: radarPosition.canvasYPosition, 
          isVisible: !radarPosition.isOutside,
          width: Math.max(radarPosition.width, 4),
          height: Math.max(radarPosition.height, 4),
          fillStyle: tag.getColor() || 'rgb(255,255,255,1)',
          strokeStyle: tag.getColor() || 'rgb(255,255,255,1)'
        }})
      });


      this._removeOldRadarObjects(entitiesModified);
    }

    _calculateRadarPosition(viewport, entity) {
      let entityPosition = entity.getComponent('PositionComponent');
      let entityXPosition = entityPosition.xPosition;
      let entityYPosition = entityPosition.yPosition;
      let entityWidth = entityPosition.width;
      let entityHeight = entityPosition.height;

      let radarXPosition = this.panelX;
      let radarYPosition = this.panelY;
      let radarWidth = this.panelWidth;
      let radarHeight = this.panelHeight;

      let worldX = this.worldBounds.x;
      let worldY = this.worldBounds.y;
      let worldWidth = this.worldBounds.width;
      let worldHeight = this.worldBounds.height;

      let scaleX = radarWidth / worldWidth;
      let scaleY = radarHeight / worldHeight;

      let radarObjectWidth = entityWidth * scaleX;
      let radarObjectHeight = entityHeight * scaleY;

      // Compute center for rendering (since draw uses center position)
      let radarXCoordinate = radarXPosition + (entityXPosition - worldX + entityWidth / 2) * scaleX;
      let radarYCoordinate = radarYPosition + (entityYPosition - worldY + entityHeight / 2) * scaleY;

      let isOutside =
        (radarXCoordinate + radarObjectWidth / 2) < radarXPosition ||
        (radarXCoordinate - radarObjectWidth / 2) > (radarXPosition + radarWidth) ||
        (radarYCoordinate + radarObjectHeight / 2) < radarYPosition ||
        (radarYCoordinate - radarObjectHeight / 2) > (radarYPosition + radarHeight);

      return {
        canvasXPosition: radarXCoordinate,
        canvasYPosition: radarYCoordinate,
        width: Math.max(radarObjectWidth, 4),
        height: Math.max(radarObjectHeight, 4),
        isOutside: isOutside
      };
    }
  
    _removeOldRadarObjects(entitiesModified) {
      this.workForTag('GuiCanvasRenderable', (tag, entity) => {
        if (!entity) {
          return;
        }

        if (!entity.key.includes('radar-panel-object')) {
          return;
        }

        let entityId = parseInt(entity.key.split('radar-panel-object-')[1])
        
        if (!entitiesModified.includes(entityId)) {
          this._core.removeEntity(entity.id)
        }
      });
    }

    _addPanel() {
      let viewport = this._core.getData('VIEWPORT');

      this.send('ADD_GUI_RENDERABLE', {
        key: 'radar-panel',
        width: this.panelWidth,
        height: this.panelHeight,
        canvasXPosition: this.panelX,
        canvasYPosition: this.panelY,
        fontSize: 18,
        fillStyle: this.radarBgColor
      });

      this.send('ADD_GUI_RENDERABLE', {
        key: 'radar-outline',
        width: this.panelWidth,
        height: this.panelHeight,
        canvasXPosition: this.panelX ,
        canvasYPosition: this.panelY ,
        fontSize: 18,
        strokeStyle: this.radarBorderColor
      });

      let targetRadarViewportWidth = this.panelWidth / 8 * 5;
      let targetRadarViewportHeight = this.panelHeight / 8 * 2;
      let viewportAspectRatio = viewport.height / viewport.width
      let radarViewportWidth = targetRadarViewportWidth / viewportAspectRatio;
      let radarViewportHeight = targetRadarViewportHeight * viewportAspectRatio;

      this.send('ADD_GUI_RENDERABLE', {
        key: 'radar-viewport-box',
        width: radarViewportWidth,
        height: radarViewportHeight,
        canvasXPosition: this.panelX,
        canvasYPosition: this.panelY,
        fontSize: 18,
        borderSize: 4,
        borderColor: uiSettings.borderColor,
      });

      this._addRadarGrid();
    }

    _addRadarGrid() {
      const cols = 5;
      const rows = 5;
      const cellWidth = this.panelWidth / cols;
      const cellHeight = this.panelHeight / rows;

      const letters = ['A', 'B', 'C', 'D', 'E'];

      // Vertical grid lines
      for (let i = 1; i < cols; i++) {
        let x = this.panelX + i * cellWidth;
        this.send('ADD_GUI_RENDERABLE', {
          key: `radar-grid-vline-${i}`,
          canvasXPosition: x,
          canvasYPosition: this.panelY,
          width: 1,
          height: this.panelHeight,
          fillStyle: uiSettings.borderColorSubtle
        });
      }

      // Horizontal grid lines
      for (let i = 1; i < rows; i++) {
        let y = this.panelY + i * cellHeight;
        this.send('ADD_GUI_RENDERABLE', {
          key: `radar-grid-hline-${i}`,
          canvasXPosition: this.panelX,
          canvasYPosition: y,
          width: this.panelWidth,
          height: 1,
          fillStyle: uiSettings.borderColorSubtle
        });
      }

      // Column labels (top)
      for (let col = 0; col < cols; col++) {
        let label = letters[col];
        let x = this.panelX + col * cellWidth + cellWidth / 2;
        this.send('ADD_GUI_RENDERABLE', {
          key: `radar-grid-col-label-${col}`,
          canvasXPosition: x,
          canvasYPosition: this.panelY - 12, // Above radar
          text: label,
          fontSize: 12,
          textAlign: 'center',
          fillStyle: uiSettings.textColor
        });
      }

      // Row labels (left)
      for (let row = 0; row < rows; row++) {
        let label = (row + 1).toString();
        let y = this.panelY + row * cellHeight + cellHeight / 2;
        this.send('ADD_GUI_RENDERABLE', {
          key: `radar-grid-row-label-${row}`,
          canvasXPosition: this.panelX - 12, // Left of radar
          canvasYPosition: y,
          text: label,
          fontSize: 12,
          textAlign: 'center',
          fillStyle: uiSettings.textColor
        });
      }
    }
  }
  