const {aggregateModifiers} = require("../common/aggregate-modifiers");
const CONSTS = require("../../../consts");

/**
 *
 * @param state
 * @param getters
 * @param externals
 * @returns {{pharma: boolean, negateheal: boolean, factor: number}}
 */
module.exports = (state, getters, externals) => {
    const {
        HEAL_FACTOR_PHARMA
    } = externals.data['variables']
    const bHasDoubleHeal = aggregateModifiers([
        CONSTS.EFFECT_PHARMA,
        CONSTS.ITEM_PROPERTY_PHARMA
    ], getters).count > 0
    const bHasNegateHeal = aggregateModifiers([
        CONSTS.EFFECT_MUMMY_ROT,
        CONSTS.ITEM_PROPERTY_MUMMY_ROT
    ], getters).count > 0
    return {
        pharma: bHasDoubleHeal,
        negateheal: bHasNegateHeal,
        factor: bHasNegateHeal
            ? 0
            : bHasDoubleHeal
                ? HEAL_FACTOR_PHARMA
                : 1
    }
}