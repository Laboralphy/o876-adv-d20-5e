const CONSTS = require('../../../consts')
const { aggregateModifiers } = require('../common/aggregate-modifiers')

/**
 * Une créature peut elle voir dans le noirs
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @return {boolean}
 */
module.exports = (state, getters) => {
    const bSeeInvis =  aggregateModifiers([
        CONSTS.EFFECT_DARKVISION,
        CONSTS.ITEM_PROPERTY_DARKVISION
    ]).count > 0
    const bBlind = getters.getConditions.has(CONSTS.CONDITION_BLINDED)
    return !bBlind && bSeeInvis
}
