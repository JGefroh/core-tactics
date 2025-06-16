import Core from '@core/core';

import SceneManager from '@game/engine/scenes/scene-manager';
import { TitleScene } from '@game/specifics/scenes/title-scene';
import { BootstrapScene } from '@game/specifics/scenes/bootstrap-scene';

SceneManager.registerScene(Core, 'bootstrap', BootstrapScene)
SceneManager.loadScene(Core, 'bootstrap');