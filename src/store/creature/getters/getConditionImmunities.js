const {aggregateModifiers} = require("../common/aggregate-modifiers");
const CONSTS = require("../../../consts");

/**
 *
 * @param state
 * @param getters
 * @returns {Set<string>}
 */
module.exports = (state, getters) => {
    const oImmunities = aggregateModifiers([
        CONSTS.EFFECT_CONDITION_IMMUNITY,
        CONSTS.ITEM_PROPERTY_CONDITION_IMMUNITY
    ], getters,{
        effectSorter: effect => effect.data.condition,
        propSorter: prop => prop.data.condition
    })
    return new Set(Object.keys(oImmunities.sorter))
}
