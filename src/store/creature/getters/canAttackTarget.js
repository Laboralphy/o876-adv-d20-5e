CONSTS = require('../../../consts')
/**
 * Une creature attaquante ne peut attaquer sa cible que si :
 * - l'attaquante n'est pas hors de combat
 * - l'attaquant ne subit pas un effet de charme issu de sa cible
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @return {boolean}
 */
module.exports = (state, getters) => {
    const cond = getters.getConditionSet
    const target = getters.getTarget
    if (cond.has(CONSTS.CONDITION_INCAPACITATED)) {
        return false
    }
    if (cond.has(CONSTS.CONDITION_CHARMED)) {
        // déterminer les source de l'effet charm
        return !getters.getEffects.some(eff =>
            eff.type === CONSTS.EFFECT_CONDITION &&
            eff.data.condition === CONSTS.CONDITION_CHARMED &&
            eff.source === target.id
        )
    }
    return true
}
