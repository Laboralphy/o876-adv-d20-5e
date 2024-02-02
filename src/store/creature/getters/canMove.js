CONSTS = require('../../../consts')
/**
 * Une créature ne peut bouger que si elle n'est pas incapacité
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @return {boolean}
 */
module.exports = (state, getters) => {
    const cond = getters.getConditionSet
    return !cond.has(CONSTS.CONDITION_INCAPACITATED) && !cond.has(CONSTS.CONDITION_RESTRAINED)
}
