const CONSTS = require('../../../consts')
const { aggregateModifiers } = require('../common/aggregate-modifiers')

/**
 * Une créature peut elle voir les cibles invisible
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @return {boolean}
 */
module.exports = (state, getters) => {
    const bSeeInvis =  aggregateModifiers([
        CONSTS.EFFECT_SEE_INVISIBILITY,
        CONSTS.EFFECT_TRUE_SIGHT
    ]).count > 0
    const bBlind = getters.getConditions.has(CONSTS.CONDITION_BLINDED)
    return !bBlind && bSeeInvis
}
