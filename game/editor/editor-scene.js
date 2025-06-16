import AiSystem from '@game/engine/ai/ai-system';
import Ai from '@game/engine/ai/ai-tag';
import AssetLoaderSystem from '@game/engine/assets/asset-loader-system';
import AudioListener from '@game/engine/audio/audio-listener-tag';
import AudioSystem from '@game/engine/audio/audio-system';
import MapGeneratorSystem from '@game/engine/generators/map-generator-system';
import PropGeneratorSystem from '@game/engine/generators/prop-generator-system';
import GuiCanvasRenderable from '@game/engine/gui/gui-canvas-renderable-tag';
import RenderGuiSystem from '@game/engine/gui/render-gui-system';
import InputSystem from '@game/engine/input/input-system';
import IntentSystem from '@game/engine/intent/intent-system';
import Intent from '@game/engine/intent/intent-tag';
import HasLogic from '@game/engine/logic/has-logic';
import LogicSystem from '@game/engine/logic/logic-system';
import Material from '@game/engine/material/material-tag';
import ParticleEmitter from '@game/engine/particle/particle-emitter-tag';
import ParticleSystem from '@game/engine/particle/particle-system';
import RenderRenderablesSystem from '@game/engine/renderer/render-renderables-system';
import RenderSystem from '@game/engine/renderer/render-system';
import Renderable from '@game/engine/renderer/render-tags';
import TextureSystem from '@game/engine/renderer/texture-system';
import ViewportFollowable from '@game/engine/renderer/viewport-followable-tag';
import ViewportSystem from '@game/engine/renderer/viewport-system';
import TimerSystem from '@game/engine/timer/timer-system';
import Timer from '@game/engine/timer/timer-tag';

// Debug
import DebugAiSystem from '@game/specifics/debug/debug-ai-system';
import DebugUiSystem from '@game/specifics/debug/debug-ui-system';

// Configuration
import GuiLoaderSystem from '@game/engine/gui/gui-loader-system';
import AssetConfigurationSystem from '@game/specifics/configuration/assets/asset-configuration-system';
import CollisionConfigurationSystem from '@game/specifics/configuration/collision-configuration-system';
import GuiConfigurationSystem from '@game/specifics/configuration/gui/gui-configuration-system';
import InputConfigurationSystem from '@game/specifics/configuration/input-configuration-system';
import LogicConfigurationSystem from '@game/specifics/configuration/logic/logic-configuration-system';

import BaseScene from '@game/engine/scenes/base-scene';
import GuiInteractionSystem from '@game/engine/gui/gui-interaction-system';
import FxSystem from '@game/features/fx/fx-system';
import AiConfigurationSystem from '@game/specifics/configuration/ai-configuration-system';
import FxConfigurationSystem from '@game/specifics/configuration/fx-configuration-system';
import PlayerControlViewportSystem from '../features/player-control/player-control-viewport-system';
import EditorCommandSystem from './editor-command-system';
import EditorInputInterpreterSystem from './editor-input-interpreter-system';
import EditorInputConfigurationSystem from './editor-input-configuration-system';

export class EditorScene extends BaseScene {
    load(core) {
        this._loadSystems(core);
        core.start();

        core.send('SET_VIEWPORT', {xPosition: 1300, yPosition: 1300})
        core.send('SET_VIEWPORT_BOUNDS', {minXPosition: 0, minYPosition: 0, maxXPosition: 3000, maxYPosition: 3000})
    }

    unload(core) {
    }

    _loadSystems(core) {
        //Debug
        core.addSystem(new DebugUiSystem());
        core.addSystem(new DebugAiSystem());

        ////
        // Core Engine systems
        ////
        // 1. Loaders and Gnerators
        core.addSystem(new AssetLoaderSystem());

        // 2. Rendering
        core.addSystem(new RenderSystem())
        core.addTag(Renderable)
        core.addSystem(new RenderRenderablesSystem())
        core.addSystem(new TextureSystem());
        core.addTag(Material);

        // 3. GUI
        core.addSystem(new RenderGuiSystem())
        core.addTag(GuiCanvasRenderable)
        core.addSystem(new GuiInteractionSystem());
        core.addSystem(new GuiLoaderSystem());

        // 4. Camera
        core.addSystem(new ViewportSystem());
        core.addTag(ViewportFollowable)

        // 5. Input
        core.addSystem(new InputSystem())

        // 6. Audio
        core.addSystem(new AudioSystem());
        core.addTag(AudioListener);



        ////
        // Secondary Engine Systems
        ////
        // 1. Helpers and Tools
        core.addSystem(new PropGeneratorSystem());
        core.addSystem(new MapGeneratorSystem());

        // 2. Wiring
        core.addSystem(new LogicSystem());
        core.addTag(HasLogic)

        // 3. Secondary Lifecycle Managers
        core.addSystem(new ParticleSystem());
        core.addTag(ParticleEmitter);
        core.addSystem(new TimerSystem());
        core.addTag(Timer);

        // 4. AI Framework
        core.addSystem(new AiSystem());
        core.addTag(Ai);
        core.addSystem(new IntentSystem());
        core.addTag(Intent);

        // 5. FX Framework
        core.addSystem(new FxSystem());


        ////
        // Editor
        ////

        core.addSystem(new PlayerControlViewportSystem())
        core.addSystem(new EditorInputConfigurationSystem())
        core.addSystem(new EditorInputInterpreterSystem())
        core.addSystem(new EditorCommandSystem());


        ////
        // Game-specific configuration
        ////

        core.addSystem(new AiConfigurationSystem());
        core.addSystem(new InputConfigurationSystem());
        core.addSystem(new CollisionConfigurationSystem());
        core.addSystem(new LogicConfigurationSystem());
        core.addSystem(new AssetConfigurationSystem()); // Must go after logic
        core.addSystem(new GuiConfigurationSystem());    
        core.addSystem(new FxConfigurationSystem());    
    }
}