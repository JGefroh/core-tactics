import { distanceFromTo, distanceBetweenEntities } from '../../../utilities/distance-util';

export default function combatInformer(currentState, core) {
    let entity = currentState.entity;

    if (!entity?.id) {
        return {
        }
    }

    let weapon = entity.getComponent('WeaponComponent') || entity.getChild('weapon').getComponent('WeaponComponent');
    let faction = entity.getComponent('FactionComponent')?.faction;

    return {
        range: weapon?.weaponStats?.range,
        faction: faction,
        potentialTargets: getPotentialTargets(currentState, core)
    }
}

function getPotentialTargets(currentState, core) {
    let potentialTargets = core.getTaggedAs('Faction') // replace later with target-specific
    let factions = core.getData('FACTIONS');
    let factionTag = core.getTag('Faction');
    let enemies = [];
    let closeEnemies = [];

    potentialTargets.forEach((entity) => {
        factionTag.setEntity(entity)
        if (!entity.getComponent('HealthComponent')) {
            return;
        }
        if (!currentState.faction) {
            return;
        }

        if (factions) {
            let enemyFactions = factions[currentState.faction]?.enemies;
            if (enemyFactions.indexOf(factionTag.getFaction()) == -1) {
                return;
            }

            let distance = distanceBetweenEntities(currentState.entity, factionTag.getEntity());
            if (distance <= currentState.range) {
                closeEnemies.push(factionTag.getEntity())
            }
            else {
                enemies.push({entity: factionTag.getEntity(), distance: distance});
            }

        }
        else if (factionTag.getFaction() != currentState.faction) {
            // use naive free-for-all approach if no relationships are defined
            enemies.push(factionTag.getEntity());
        }
    });

    enemies = enemies.sort((a, b) => a.distance - b.distance).map((obj) => { return obj.entity });

    return {
        close: closeEnemies,
        far: enemies
    };
}