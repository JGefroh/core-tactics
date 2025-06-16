import { default as System } from '@core/system';

import AiComponent from '@game/engine/ai/ai-component';
import { GoalAttack } from '../../features/ai/goals/goal-attack';
import { GoalMove } from '../../features/ai/goals/goal-move';
import { GoalDefend } from '../../features/ai/goals/goal-defend';

import { TacticAttack } from '../../features/ai/tactics/tactic-attack';
import { TacticMove } from '../../features/ai/tactics/tactic-move';
import { TacticDefend } from '../../features/ai/tactics/tactic-defend';


import { ActionMoveTowardsTarget } from '../../features/ai/actions/action-move-towards-target';
import { StepTurnTowardsTarget } from '../../features/ai/steps/step-turn-towards-target';
import { StepMoveTowardsTarget } from '../../features/ai/steps/step-move-towards-target';

import { StepFireWeapon } from '../../features/ai/steps/step-fire-weapon';
import { StepIdle } from '../../features/ai/steps/step-idle';
import { ActionAttackTarget } from '../../features/ai/actions/action-attack-target';
import { ActionSelectTarget } from '../../features/ai/actions/action-select-target';


import isInRangeStateInformer from '../../features/ai/informers/is-in-range-state-informer';
import combatInformer from '../../features/ai/informers/combat-informer';
import { ActionIdle } from '../../features/ai/actions/action-idle';

export default class AiConfigurationSystem extends System {
    constructor() {
      super();

      this.goals = {
        'goal_defend': GoalDefend,
        'goal_attack': GoalAttack,
        'goal_move': GoalMove
      }

      this.tactics = {
        'tactic_attack': TacticAttack,
        'tactic_move': TacticMove,
        'tactic_defend': TacticDefend
      }

      this.actions = {
        'action_move_towards_target': ActionMoveTowardsTarget,
        'action_attack_target': ActionAttackTarget,
        'action_select_target': ActionSelectTarget,
        'action_idle': ActionIdle
      }

      this.steps = {
        'step_turn_towards_target': StepTurnTowardsTarget,
        'step_move_towards_target': StepMoveTowardsTarget,
        'step_fire_weapon': StepFireWeapon,
        'step_idle': StepIdle
      }

      this.localStateInformers = {
        isInRangeStateInformer: isInRangeStateInformer,
        combatInformer: combatInformer
      }

      Object.keys(this.goals).forEach((key) => {
        this.send('REGISTER_GOAL', {key: key, class: this.goals[key]})
      })

      Object.keys(this.tactics).forEach((key) => {
        this.send('REGISTER_TACTIC', {key: key, class: this.tactics[key]})
      })

      Object.keys(this.actions).forEach((key) => {
        this.send('REGISTER_ACTION', {key: key, class: this.actions[key]})
      })

      Object.keys(this.steps).forEach((key) => {
        this.send('REGISTER_STEP', {key: key, class: this.steps[key]})
      })

      
      Object.keys(this.localStateInformers).forEach((key) => {
        this.send('REGISTER_STATE_INFORMER', {
          key: key,
          inform: this.localStateInformers[key],
          scope: 'local'
        });
      });
    }
    
    work() {
    }
  }
  