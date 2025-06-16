import { default as System } from '@core/system';
import WebGLRenderer from '@game/engine/renderer/webgl-renderer'

import MaterialRegistry from './material-registry';
import MaterialResolver from './material-resolver';

export default class RenderSystem extends System {
  constructor() {
    super();

    this.viewportScale = 1;

    this.primaryCanvas = document.getElementById('canvas');
    this.renderCtx = this.primaryCanvas.getContext('webgl2', {debug: true});

    this.materialRegistry = new MaterialRegistry();

    this.materialResolver = new MaterialResolver(this.materialRegistry);

    this.renderer = new WebGLRenderer(this.renderCtx, this.materialRegistry);

    this.renderPasses = [];

    this.renderPassSequence = ['WORLD', 'WORLD_OVERLAY_1', 'WORLD_OVERLAY_1_BLIT', 'PARTICLE', 'PARTICLE_BLIT', 'LIGHTING', 'LIGHTING_BLIT', 'ENVIRONMENT', 'ENVIRONMENT_BLIT', 'GUI']

    this.addHandler('REGISTER_RENDER_PASS', (pass) => {
      this.renderPasses.push(pass);
      this.renderPasses = this.renderPasses.sort((a, b) => this.renderPassSequence.indexOf(a.name) - this.renderPassSequence.indexOf(b.name));
    });

    this.addHandler('REGISTER_MATERIAL', (payload) => {
      this.materialRegistry.register(payload.materialId, {
        program: new payload.materialClass(this.renderCtx, {}),
        resolver: payload.materialResolver
      })
    });


    this.addHandler('LOAD_TEXTURE_TO_RENDERER', (textureDetails) => {
      this.renderer.loadTexture(this.renderCtx, textureDetails);
    });

    this.renderCtx.enable(this.renderCtx.BLEND);
    this.renderCtx.blendFunc(this.renderCtx.SRC_ALPHA, this.renderCtx.ONE_MINUS_SRC_ALPHA);
  }

  work() {
    if (!this.renderCtx) return;

    let viewport = this._core.getData('VIEWPORT') || {
      xPosition: 0,
      yPosition: 0,
      width: this.primaryCanvas.width,
      height: this.primaryCanvas.height,
      scale: this.viewportScale
    };

    this.renderer.beginFrame(this.renderCtx, viewport);

    for (let pass of this.renderPasses) {
      this.renderer.beginPass(pass);
      this.renderer.bindDestinationTarget(pass.destinationTarget);
      pass.execute(this.renderer, this.materialResolver); 
      this.renderer.draw();
    }

    this.renderer.endFrame();
  }
}