
// General Mechanics
import AssetLoaderSystem from '@game/engine/assets/asset-loader-system';
import AudioListener from '@game/engine/audio/audio-listener-tag';
import AudioSystem from '@game/engine/audio/audio-system';
import GuiCanvasRenderable from '@game/engine/gui/gui-canvas-renderable-tag';
import RenderGuiSystem from '@game/engine/gui/render-gui-system';
import GuiLoaderSystem from '@game/engine/gui/gui-loader-system';
import InputSystem from '@game/engine/input/input-system';
import RenderSystem from '@game/engine/renderer/render-system';
import Renderable from '@game/engine/renderer/render-tags';
import RenderRenderablesSystem from '@game/engine/renderer/render-renderables-system';
import Material from '@game/engine/material/material-tag';
import TextureSystem from '@game/engine/renderer/texture-system';
import ViewportSystem from '@game/engine/renderer/viewport-system';

// Configuration
import AssetConfigurationSystem from '@game/specifics/configuration/assets/asset-configuration-system';
import GuiConfigurationSystem from '@game/specifics/configuration/gui/gui-configuration-system';

// Other
import BaseScene from '@game/engine/scenes/base-scene';
import GuiInteractionSystem from '../../engine/gui/gui-interaction-system';

export class TitleScene extends BaseScene {
    load(core) {
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
            core.addSystem(new GuiLoaderSystem());
        core.addSystem(new GuiInteractionSystem());
        
        // 4. Camera
        core.addSystem(new ViewportSystem());
    
        // 5. Input
        core.addSystem(new InputSystem())
    
        // 6. Audio
        core.addSystem(new AudioSystem());
            core.addTag(AudioListener);
    
        // Game Specific Configuration
        core.addSystem(new AssetConfigurationSystem({skipMapLoad: true})); // Must go after logic
        core.addSystem(new GuiConfigurationSystem());
    
    
        core.start();

        core.send('LOAD_GUI', 'main-menu')
    }

    unload(core) {
        core.clear();
    }
}