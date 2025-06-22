import { default as System } from '@core/system';
import { default as Core}  from '@core/core';
import { default as Entity } from '@core/entity.js'

import FxHitMachineGun from '../../features/fx/effects/fx-hit-machine-gun';
import FxHitCannon from '../../features/fx/effects/fx-hit-cannon';
import FxHitLaserSword from '../../features/fx/effects/fx-hit-laser-sword';
import FxHitSniper from '../../features/fx/effects/fx-hit-sniper';
import FxCommandAttack from '../../features/fx/effects/fx-command-attack';
import FxCommandMove from '../../features/fx/effects/fx-command-move';
import FxFireCannon from '../../features/fx/effects/fx-fire-cannon';
import FxDeath from '../../features/fx/effects/fx-death';
import FxFireMachineGun from '../../features/fx/effects/fx-fire-machine-gun';

export default class FxConfigurationSystem extends System {
    constructor() {
        super()

        this.send('REGISTER_FX', FxHitMachineGun);
        this.send('REGISTER_FX', FxHitCannon);
        this.send('REGISTER_FX', FxFireCannon);
        this.send('REGISTER_FX', FxHitLaserSword);
        this.send('REGISTER_FX', FxHitSniper);
        this.send('REGISTER_FX', FxCommandAttack);
        this.send('REGISTER_FX', FxCommandMove);
        this.send('REGISTER_FX', FxDeath)
        this.send('REGISTER_FX', FxFireMachineGun)
    }
  }