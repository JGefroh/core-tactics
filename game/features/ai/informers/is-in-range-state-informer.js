import { distanceFromTo, distanceBetweenEntities } from '../../../utilities/distance-util';

export default function isInRangeStateInformer(currentState, core) {
    let entity = currentState.entity;
    let target = currentState.targetEntity;
    let range = currentState.range || 10;

    if (!entity?.id || !target?.id || !range) {
        return {
            isInRange: null
        }
    }

    let distance = distanceBetweenEntities(currentState.entity, target);
    let isInRange = distance <= range;

    return {
        isInRange: isInRange
    }
}