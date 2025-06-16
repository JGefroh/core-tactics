import { default as System } from '@core/system';
import { default as Entity } from '@core/entity.js'

import { _deepMerge } from '@game/engine/util/object-util';

import { isPointInRotatedRect } from '@game/engine/collision/collision-util';

import GuiCanvasRenderComponent from '@game/engine/gui/gui-canvas-render-component';


export default class GuiLayoutSystem extends System {
  constructor() {
    super()
  }
}

