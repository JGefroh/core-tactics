import { default as System } from '@core/system';
import WebGLRenderer from '@game/engine/renderer/webgl-renderer'

export default class ToneOverlaySystem extends System {
    constructor() {
      super();
      this.toneColor = 'rgba(0,0,0,1)';
    }
  
    initialize() {
      this.addHandler('REQUEST_FULLSCREEN_TONE', (payload) => {
        this.toneColor = payload.color;
      });

      this.send('REGISTER_RENDER_PASS', {
        name: 'ENVIRONMENT',
        destinationTarget: 'ENVIRONMENT',
        sourceTargets: ['LIGHTING'],
        execute: (renderer, materialResolver) => {
            this.render(renderer, materialResolver);
        }
      });

      this.send('REGISTER_RENDER_PASS', {
          name: 'ENVIRONMENT_BLIT',
          sourceTargets: ['ENVIRONMENT'],
          execute: (renderer, materialResolver) => {
              renderer.submitRenderCommand({
                  materialId: 'blit',
              });
          }
      });
    }
  
    work() {
    }

    render(renderer, materialResolver) {
        if (!this.toneColor) {
          return;
        }
        let {width, height} = renderer.getCanvasDimensions();

        renderer.submitRenderCommand({
            materialId: 'fullscreen-tone',
            xPosition: 0,
            yPosition: 0,
            width: width,
            height: height,
            color: this.toneColor,
            shape: 'rectangle',
          });
          
    }
  }