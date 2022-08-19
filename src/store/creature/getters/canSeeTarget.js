const CONSTS = require('../../../consts')
/**
 *
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {boolean}
 */
module.exports = (state, getters) => {
    const tc = getters.getTargetConditions
    const c = getters.getConditions
    const bBlinded = c[CONSTS.CONDITION_BLINDED]
    const bTargetInvis = tc.has(CONSTS.CONDITION_INVISIBLE)
    const bHaveTrueSight = c.has(CONSTS.CONDITION_TRUE_SIGHT)
    const bTargetDetectable = !bTargetInvis || bHaveTrueSight
    return !bBlinded && bTargetDetectable
}
