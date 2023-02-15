const CONSTS = require("../../../consts");
const { aggregateModifiers } = require('../common/aggregate-modifiers')

module.exports = (state, getter) => 20 - aggregateModifiers([
        CONSTS.EFFECT_CRITICAL_THREAT,
        CONSTS.ITEM_PROPERTY_CRITICAL_THREAT
    ]).max
