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
    const bTargetBlind = tc.has(CONSTS.CONDITION_BLINDED)
    const bInvis = c.has(CONSTS.CONDITION_INVISIBLE)
    const bTargetHasTrueSight = tc.has(CONSTS.CONDITION_TRUE_SIGHT)
    return !bTargetBlind && (!bInvis || bTargetHasTrueSight)
}
