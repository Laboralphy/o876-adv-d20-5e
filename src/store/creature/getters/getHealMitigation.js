const {aggregateModifiers} = require("../common/aggregate-modifiers");
const CONSTS = require("../../../consts");

/**
 *
 * @param state
 * @param getters
 * @param externals
 * @returns {{pharma: boolean, factor: number}}
 */
module.exports = (state, getters, externals) => {
    const {
        HEAL_FACTOR_PHARMA
    } = externals.data['variables']
    const bHasPharma = aggregateModifiers([
        CONSTS.EFFECT_PHARMA,
        CONSTS.ITEM_PROPERTY_PHARMA
    ], getters).count > 0
    return {
        pharma: bHasPharma,
        factor: bHasPharma ? HEAL_FACTOR_PHARMA : 1
    }
}