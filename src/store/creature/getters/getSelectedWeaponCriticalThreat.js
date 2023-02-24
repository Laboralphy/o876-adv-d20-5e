const CONSTS = require("../../../consts");
const { aggregateModifiers } = require('../common/aggregate-modifiers')

/**
 *
 * @param state
 * @param getters
 * @param externals {*}
 * @returns {number}
 */
module.exports = (state, getters, externals) => externals.data.variables.CRITICAL_THREAT_RANGE - aggregateModifiers([
    CONSTS.EFFECT_CRITICAL_THREAT,
    CONSTS.ITEM_PROPERTY_CRITICAL_THREAT
], getters).max
