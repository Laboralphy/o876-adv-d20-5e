const CONSTS = require("../../../consts");
const { aggregateModifiers } = require('../common/aggregate-modifiers')

/**
 *
 * @param state
 * @param getters
 * @returns {number}
 */
module.exports = (state, getters) => 20 - aggregateModifiers([
        CONSTS.EFFECT_CRITICAL_THREAT,
        CONSTS.ITEM_PROPERTY_CRITICAL_THREAT
    ], getters).max
