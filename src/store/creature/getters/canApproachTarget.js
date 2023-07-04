CONSTS = require('../../../consts')
/**
 * Une créature effrayée ne peut pas approcher la source de sa terreur
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @return {boolean}
 */
module.exports = (state, getters) => {
    const cond = getters.getConditions
    if (!getters.canMove) {
        return false
    }
    const target = getters.getTarget
    if (cond.has(CONSTS.CONDITION_FRIGHTENED)) {
        // déterminer les source de l'effet fright
        return getters.getEffects.some(eff =>
            eff.type === CONSTS.EFFECT_CONDITION &&
            eff.data.condition === CONSTS.CONDITION_FRIGHTENED &&
            eff.source === target
        )
    }
    return true
}
