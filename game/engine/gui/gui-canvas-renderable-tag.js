import { default as Tag } from '@core/tag'

export default class GuiCanvasRenderable extends Tag {
    static tagType = 'GuiCanvasRenderable'
    constructor() {
      super();
    }

    static isAssignableTo(entity) {
      return entity.hasComponent('GuiCanvasRenderComponent');
    };

    ////////
    // Layout
    ////////

    getElementKey() {
      return this.entity.getComponent('GuiCanvasRenderComponent').elementKey;
    }

    getAutoLayout() {
      return this.entity.getComponent('GuiCanvasRenderComponent').autolayout;
    }

    getLayoutParentGuiKey() {
      return this.entity.getComponent('GuiCanvasRenderComponent').layoutParentGuiKey;
    }


    ////////
    // Position
    ////////

    getCenterXPosition() {
      if (!this.entity.getComponent('GuiCanvasRenderComponent').renderAlignment || this.entity.getComponent('GuiCanvasRenderComponent').renderAlignment == 'center') {
        return this.entity.getComponent('GuiCanvasRenderComponent').canvasXPosition;
      }
      else if (this.entity.getComponent('GuiCanvasRenderComponent').renderAlignment == 'bottom-center') {
        return this.entity.getComponent('GuiCanvasRenderComponent').canvasXPosition; 
      }
      else if (this.entity.getComponent('GuiCanvasRenderComponent').renderAlignment == 'top-left') {
        return this.entity.getComponent('GuiCanvasRenderComponent').canvasXPosition + (this.getWidth() / 2);
      }
    }

    getCenterYPosition() {
      if (!this.entity.getComponent('GuiCanvasRenderComponent').renderAlignment || this.entity.getComponent('GuiCanvasRenderComponent').renderAlignment == 'center') {
        return this.entity.getComponent('GuiCanvasRenderComponent').canvasYPosition;
      }
      else if (this.entity.getComponent('GuiCanvasRenderComponent').renderAlignment == 'bottom-center') {
        return this.entity.getComponent('GuiCanvasRenderComponent').canvasYPosition - (this.getHeight() / 2);
      }
      else if (this.entity.getComponent('GuiCanvasRenderComponent').renderAlignment == 'top-left') {
        return this.entity.getComponent('GuiCanvasRenderComponent').canvasYPosition + (this.getHeight() / 2);
      }

    }

    getCanvasXPosition() {
      if (!this.entity.getComponent('GuiCanvasRenderComponent').renderAlignment || this.entity.getComponent('GuiCanvasRenderComponent').renderAlignment == 'center') {
        return this.entity.getComponent('GuiCanvasRenderComponent').canvasXPosition;
      }
      else if (this.entity.getComponent('GuiCanvasRenderComponent').renderAlignment == 'bottom-center') {
        return this.entity.getComponent('GuiCanvasRenderComponent').canvasXPosition;
      }
      else if (this.entity.getComponent('GuiCanvasRenderComponent').renderAlignment == 'top-left') {
        return this.entity.getComponent('GuiCanvasRenderComponent').canvasXPosition + (this.getWidth() / 2);
      }
    };

    getCanvasYPosition() {
      if (!this.entity.getComponent('GuiCanvasRenderComponent').renderAlignment || this.entity.getComponent('GuiCanvasRenderComponent').renderAlignment == 'center') {
        return this.entity.getComponent('GuiCanvasRenderComponent').canvasYPosition;
      }
      else if (this.entity.getComponent('GuiCanvasRenderComponent').renderAlignment == 'bottom-center') {
        return this.entity.getComponent('GuiCanvasRenderComponent').canvasYPosition + (-this.getHeight() / 2);
      }
      else if (this.entity.getComponent('GuiCanvasRenderComponent').renderAlignment == 'top-left') {
        return this.entity.getComponent('GuiCanvasRenderComponent').canvasYPosition + (this.getHeight() / 2);
      }
    };

    getOffsetXAmount() {
      return this.entity.getComponent('GuiCanvasRenderComponent').offsetXAmount;
    }

    getOffsetYAmount() {
      return this.entity.getComponent('GuiCanvasRenderComponent').offsetYAmount;
    }

    getAngleDegrees() {
      return this.entity.getComponent('GuiCanvasRenderComponent').angleDegrees
    }

    getShape() {
      return this.entity.getComponent('GuiCanvasRenderComponent').radius ? 'circle' : 'rectangle'
    }

    getRenderAlignment() {
      return this.entity.getComponent('GuiCanvasRenderComponent').renderAlignment;
    }


    
    ////////
    // Text and Typography
    ////////
  

    getText() {
      return this.entity.getComponent('GuiCanvasRenderComponent').text
    }

    setText(text) {
      this.entity.getComponent('GuiCanvasRenderComponent').text = text;
    }

    getTextAlign() {
      return this.entity.getComponent('GuiCanvasRenderComponent').textAlign;
    }

    getTextOffsetX() {
      return this.entity.getComponent('GuiCanvasRenderComponent').textOffsetX;
    }

    getTextOffsetY() {
      return this.entity.getComponent('GuiCanvasRenderComponent').textOffsetY;
    }

    getFontSize() {
        return this.entity.getComponent('GuiCanvasRenderComponent').fontSize;
    }

    getFontColor() {
      return this.entity.getComponent('GuiCanvasRenderComponent').fontColor;
    }

    getFontType() {
      return this.entity.getComponent('GuiCanvasRenderComponent').fontType
    }


    ////////
    // Size
    ////////
  
    getWidth() {
      return this.entity.getComponent('GuiCanvasRenderComponent').width;
    };

    getHeight() {
      return this.entity.getComponent('GuiCanvasRenderComponent').height;
    }

    setWidth(width) {
      this.entity.getComponent('GuiCanvasRenderComponent').width = width;
    }


    ////////
    // Textures
    ////////
    getShapeColor() {
      return this.entity.getComponent('GuiCanvasRenderComponent').fillStyle;   
    }
    getImagePath() {
      return this.entity.getComponent('GuiCanvasRenderComponent').imagePath;
    }
    getImageStyle() {
      return this.entity.getComponent('GuiCanvasRenderComponent').imageStyle;
    }


    ////////
    // Borders
    ////////
    getBorderSize() {
      return this.entity.getComponent('GuiCanvasRenderComponent').borderSize;
    }

    getBorderColor() {
      return this.entity.getComponent('GuiCanvasRenderComponent').borderColor;
    }

    ////////
    // World GUIs
    ////////

    getLayer() {
      if (this.entity.getComponent('GuiCanvasRenderComponent').attachedToEntity) {
        return 'world'
      }
      return 'canvas'
    }

    getAttachedExists() {
      return this.entity.getComponent('GuiCanvasRenderComponent').attachedToEntity?.id;
    }
    
    getAttachedXPosition() {
      let gui = this.entity.getComponent('GuiCanvasRenderComponent')
      if (gui.attachedToEntity?.id) {
        return gui.attachedToEntity.getComponent('PositionComponent').xPosition
      }
    };
  
    getAttachedYPosition() {
      let gui = this.entity.getComponent('GuiCanvasRenderComponent')
      if (gui.attachedToEntity?.id) {
        return gui.attachedToEntity.getComponent('PositionComponent').yPosition
      }
    };

    getAttachedEntity() {
       return this.entity.getComponent('GuiCanvasRenderComponent').attachedToEntity;
    }



    getRadius() {
        return this.entity.getComponent('GuiCanvasRenderComponent').radius;   
    }

    setImageObject(imageObject) {
      this.entity.getComponent('GuiCanvasRenderComponent').imageObject = imageObject
    }

    getImageObject() {
      return this.entity.getComponent('GuiCanvasRenderComponent').imageObject
    }
    getFillStyle() {
        return this.entity.getComponent('GuiCanvasRenderComponent').fillStyle;   
    }
    getStrokeStyle() {
        return this.entity.getComponent('GuiCanvasRenderComponent').strokeStyle;   
    }
    getLineWidth() {
        return this.entity.getComponent('GuiCanvasRenderComponent').lineWidth;   
    }
    getLineDash() {
      return this.entity.getComponent('GuiCanvasRenderComponent').lineDash;
    }

    setFillStyle(fillStyle) {
      this.entity.getComponent('GuiCanvasRenderComponent').fillStyle = fillStyle;
    }

    setIsHovered(isHovered) {
      this.entity.getComponent('GuiCanvasRenderComponent').isHovered = isHovered;
    }

    getIsHovered() {
      return this.entity.getComponent('GuiCanvasRenderComponent').isHovered;
    }

    getHoverStyles() {
      return this.entity.getComponent('GuiCanvasRenderComponent').hoverStyles
    }

    setIsVisible() {
      this.entity.getComponent('GuiCanvasRenderComponent').isVisible = !this.entity.getComponent('GuiCanvasRenderComponent').isVisible;
    }

    getIsVisible() {
      return this.entity.getComponent('GuiCanvasRenderComponent').isVisible
    }

    updateProperties(properties) {
      Object.assign(this.entity.getComponent('GuiCanvasRenderComponent'), properties)
    }

    hasPostRender() {
      return this.entity.getComponent('GuiCanvasRenderComponent').postRender;
    }
    postRender(renderable, canvasCtx) {
      this.entity.getComponent('GuiCanvasRenderComponent').postRender(renderable, canvasCtx);
    }

    onClick(core) {
      if (this.entity.getComponent('GuiCanvasRenderComponent').onClick) {
        this.entity.getComponent('GuiCanvasRenderComponent').onClick(core, this.entity, this.entity.getComponent('GuiCanvasRenderComponent').onClickParams);
      };
    }

    onHover(core) {
      if (this.entity.getComponent('GuiCanvasRenderComponent').onHover) {
        this.entity.getComponent('GuiCanvasRenderComponent').onHover(core, this.entity, this.entity.getComponent('GuiCanvasRenderComponent').onHoverParams);
      };
    }

    onHoverStop(core) {
      if (this.entity.getComponent('GuiCanvasRenderComponent').onHoverStop) {
        this.entity.getComponent('GuiCanvasRenderComponent').onHoverStop(core, this.entity, this.entity.getComponent('GuiCanvasRenderComponent').onHoverParams);
      };
    }

    isActive(core) {
      if (this.entity.getComponent('GuiCanvasRenderComponent').isActive) {
        return this.entity.getComponent('GuiCanvasRenderComponent').isActive(core);
      };
    }

    getActiveStyles() {
      return this.entity.getComponent('GuiCanvasRenderComponent').activeStyle;
    }

    getAttachedTo() {
      return this.entity.getComponent('GuiCanvasRenderComponent').attachedToEntity;
    }

    setAttachedTo(attachedToEntity) {
      this.entity.getComponent('GuiCanvasRenderComponent').attachedToEntity = attachedToEntity;
    }












  }
  