import AiSystem from '@game/engine/ai/ai-system';
import Ai from '@game/engine/ai/ai-tag';
import AssetLoaderSystem from '@game/engine/assets/asset-loader-system';
import Attached from '@game/engine/attachments/attached-tag';
import AttachmentSyncSystem from '@game/engine/attachments/attachment-sync-system';
import AudioListener from '@game/engine/audio/audio-listener-tag';
import AudioSystem from '@game/engine/audio/audio-system';
import Collidable from '@game/engine/collision/collidable-tag';
import CollisionSystem from '@game/engine/collision/collision-system';
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
import MovementFinalizationSystem from '@game/engine/movement/movement-finalization-system';
import MovementProposalSystem from '@game/engine/movement/movement-proposal-system';
import Movable from '@game/engine/movement/movement-tags';
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
import DistanceTrack from '@game/engine/tracker/distance-track-tag';
import DistanceTrackerSystem from '@game/engine/tracker/distance-tracker-system';
import UnitGenerationSystem from '@game/features/entities/unit-generation-system';

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
import MovementIntentSystem from '../../engine/movement/movement-intent-system';
import ReinforcementsSystem from '../../features/entities/reinforcements-system';
import FxSystem from '../../features/fx/fx-system';
import PlayerCommandSystem from '../../features/player-control/player-command-system';
import PlayerControlViewportSystem from '../../features/player-control/player-control-viewport-system';
import PlayerControllable from '../../features/player-control/player-controllable-tag';
import PlayerInputInterpreterSystem from '../../features/player-control/player-input-interpreter-system';
import PlayerIntentTargetable from '../../features/player-control/player-intent-targetable-tag';
import PlayerSelectionBoxSystem from '../../features/player-control/player-selection-box-system';
import GuiAttachmentSystem from '@game/engine/gui/gui-attachables/gui-attachment-system';
import HasGuiAttachment from '@game/engine/gui/gui-attachables/has-gui-attachment-tag';
import CommandPaletteSystem from '../../features/ui/ui-command-palette/command-palette-system';
import MinimapSystem from '../../features/ui/ui-minimap/minimap-system';
import Minimap from '../../features/ui/ui-minimap/minimap-tag';
import UiReinforcementsSystem from '../../features/ui/ui-reinforcements/ui-reinforcements-system';
import AttackIntentSystem from '../../genre/combat/attack-intent-system';
import DamageSystem from '../../genre/combat/damage-system';
import Damageable from '../../genre/combat/damageable-tag';
import EnergySystem from '../../genre/combat/energy/energy-system';
import HasEnergy from '../../genre/combat/energy/has-energy-tag';
import WeaponFiringSystem from '../../genre/combat/weapons/weapon-firing-system';
import Weapon from '../../genre/combat/weapons/weapon-tag';
import FactionSystem from '../../genre/factions/faction-system';
import Faction from '../../genre/factions/faction-tag';
import FormationSystem from '../../genre/formation/formation-system';
import Groupable from '../../genre/grouping/groupable-tag';
import SpawnPointSystem from '../../genre/spawns/spawn-point-system';
import SpawnPoint from '../../genre/spawns/spawn-point-tag';
import AiConfigurationSystem from '../configuration/ai-configuration-system';
import FxConfigurationSystem from '../configuration/fx-configuration-system';
import GuiInteractionSystem from '../../engine/gui/gui-interaction-system';
import ViewportAudioListenerSystem from '../../features/viewport-audio-listener/viewport-audio-listener-system';

export class GameScene extends BaseScene {
    load(core) {
        this._loadSystems(core);
        core.start();

        core.send('SET_VIEWPORT_BOUNDS', {minXPosition: 0, minYPosition: 0, maxXPosition: 3000, maxYPosition: 3000})
        core.send('SET_VIEWPORT', {xPosition: 0, yPosition: 0})
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
        // Gameplay systems
        ////

        // 1. Movement and Collision
        core.addSystem(new MovementIntentSystem());
        core.addSystem(new MovementProposalSystem());
        core.addTag(Movable);
        core.addSystem(new DistanceTrackerSystem());
        core.addTag(DistanceTrack);
        core.addSystem(new CollisionSystem());
        core.addTag(Collidable);
        core.addSystem(new MovementFinalizationSystem());
        core.addSystem(new AttachmentSyncSystem())
        core.addTag(Attached)

        // 2. Player Control
        core.addSystem(new PlayerInputInterpreterSystem());
        core.addSystem(new PlayerCommandSystem());
            core.addTag(PlayerControllable);
            core.addTag(PlayerIntentTargetable);
        core.addSystem(new PlayerControlViewportSystem());
        core.addSystem(new PlayerSelectionBoxSystem())
        core.addSystem(new FormationSystem());

        // 3. Combat
        core.addSystem(new DamageSystem());
            core.addTag(Damageable);
        core.addSystem(new WeaponFiringSystem());
            core.addTag(Weapon);
        core.addSystem(new AttackIntentSystem());
        core.addSystem(new EnergySystem());
            core.addTag(HasEnergy);

        // 4. Relationships and Factions
        core.addSystem(new FactionSystem());
            core.addTag(Faction);
        
        // 5. Unit Groupings
        core.addTag(Groupable);

        // Game-specific utilities

        // 1. Generators
        core.addSystem(new UnitGenerationSystem());


        // 2. World Space UI
        core.addSystem(new GuiAttachmentSystem());
        core.addTag(HasGuiAttachment);

        // 3. UI Elements
        core.addSystem(new MinimapSystem());
            core.addTag(Minimap);
        core.addSystem(new CommandPaletteSystem());
        core.addSystem(new UiReinforcementsSystem());


        ///
        // Game rules
        ///
        core.addSystem(new ReinforcementsSystem());
        core.addSystem(new SpawnPointSystem());
            core.addTag(SpawnPoint);


        ///
        // Ambience
        ///
        core.addSystem(new ViewportAudioListenerSystem())

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