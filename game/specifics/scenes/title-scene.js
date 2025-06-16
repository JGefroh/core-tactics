
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



// Game-specific
import SpawnPointSystem from '../../genre/spawns/spawn-point-system';
import SpawnPoint from '../../genre/spawns/spawn-point-tag';
import FactionSystem from '../../genre/factions/faction-system';
import Faction from '../../genre/factions/faction-tag';
import UnitGenerationSystem from '@game/features/entities/unit-generation-system';
import MapGeneratorSystem from '@game/engine/generators/map-generator-system';
import CollisionSystem from '../../engine/collision/collision-system';
import Collidable from '../../engine/collision/collidable-tag';
import CollisionConfigurationSystem from '../configuration/collision-configuration-system';
import MovementIntentSystem from '../../engine/movement/movement-intent-system';
import MovementFinalizationSystem from '@game/engine/movement/movement-finalization-system';
import MovementProposalSystem from '@game/engine/movement/movement-proposal-system';
import Movable from '@game/engine/movement/movement-tags';
import AiSystem from '@game/engine/ai/ai-system';
import Ai from '@game/engine/ai/ai-tag';
import IntentSystem from '@game/engine/intent/intent-system';
import Intent from '@game/engine/intent/intent-tag';
import AiConfigurationSystem from '../configuration/ai-configuration-system';
import FxConfigurationSystem from '../configuration/fx-configuration-system';
import FxSystem from '../../features/fx/fx-system';
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
        core.addSystem(new MapGeneratorSystem());
        core.addSystem(new AssetConfigurationSystem({ skipMapLoad: false })); // Must go after logic
        core.addSystem(new GuiConfigurationSystem());


        // Game systems for title-screen specific bootstrapping
        core.addSystem(new AiSystem());
        core.addTag(Ai);
        core.addSystem(new IntentSystem());
        core.addTag(Intent);

        core.addSystem(new MovementIntentSystem());
        core.addSystem(new MovementProposalSystem());
        core.addTag(Movable);
        core.addSystem(new CollisionSystem());
        core.addTag(Collidable);
        core.addSystem(new MovementFinalizationSystem());

        core.addSystem(new FactionSystem());
        core.addTag(Faction);
        core.addSystem(new SpawnPointSystem({ noSpawn: true }));
        core.addTag(SpawnPoint);
        core.addSystem(new UnitGenerationSystem({ noSpawn: true }));
        core.addSystem(new CollisionConfigurationSystem());
        core.addSystem(new AiConfigurationSystem());
        core.addSystem(new FxSystem());
        core.addSystem(new FxConfigurationSystem());

        core.start();

        core.send('LOAD_GUI', 'main-menu')


        // Reinforce a portal and make them move off screen
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;
        core.send('ADD_SPAWN_POINT', { xPosition: x, yPosition: y, faction: 'enemy', color: 'rgba(255,0,0,1)' })
        core.send('SET_VIEWPORT_BOUNDS', { minXPosition: 0, minYPosition: 0, maxXPosition: 3000, maxYPosition: 3000 })
        core.send('SET_VIEWPORT', { xPosition: 0, yPosition: 0 })
        setTimeout(() => {
            this._reinforce(core)
        }, 100);

        this.interval = setInterval(() => {
            if (Math.random() < 0.3) {
                this._reinforce(core);
            }
        }, 1000)
    }

    _reinforce(core) {
        this.lastEntityId ||= 0;
        this._generateSquad(core);

        let entities = core.getTaggedAs('Ai');
        let lastId = 0;
        entities.forEach((entity) => {
            if (entity.id > this.lastEntityId) {
                core.send('SET_AI', { entity: entity, goal: 'goal_move', configuration: { targetPosition: { xPosition: 500 + Math.random() * 5000, yPosition: 500 + Math.random() + 3000 } } })
                lastId = entity.id;
            }
        })
        this.lastEntityId = lastId;
        setTimeout(() => {
            if (!this.cancelTimer) {
                entities.forEach((entity) => {
                    core.removeEntity(entity);
                })
            }
        }, 20000)
    }

    _generateSquad(core) {
        core.send('CREATE_SQUAD', {
            count: Math.max(6, Math.floor(Math.random() * 12)),
            faction: 'enemy',
            unitType: 'random'
        });
    }

    unload(core) {
        this.cancelTimer = true;
        clearInterval(this.interval);
        core.clear();
    }
}