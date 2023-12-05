const CONSTS = require('../../../consts')
const { conditionAttack } = require('../common/spell-helper')

/**
 * Tentative de charme d'une créature qui a le vampire dans sa ligne de mire
 * le charme dure 10 tours sauf si la cible subit des dégâts
 * @param caster {Creature}
 */
module.exports = function (caster) {
    const oTarget = caster.getTarget()
    const bTargettingVampire = caster.getTargetTarget() === caster
    if (bTargettingVampire && oTarget.store.getters.getEntityVisibility.detectable.target) {
        conditionAttack({
            caster,
            target: caster.getTarget(),
            condition: CONSTS.CONDITION_CHARMED,
            duration: 10,
            savingAbility: CONSTS.ABILITY_WISDOM,
            dc: 17,
            subtype: CONSTS.EFFECT_SUBTYPE_BREAKABLE,
            apply: true
        })
    }
}