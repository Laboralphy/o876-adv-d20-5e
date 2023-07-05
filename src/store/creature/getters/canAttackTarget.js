CONSTS = require('../../../consts')
/**
 * Une creature ne peut attaquer sa cible que si celle-ci n'est pas la source de son charme
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @return {boolean}
 */
module.exports = (state, getters) => {
    const cond = getters.getConditions
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
