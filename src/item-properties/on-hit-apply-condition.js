const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_ON_HIT_APPLY_CONDITION
 * @param condition {string} condition
 * @param dc {number}
 * @param saveAbility {string} ability
 * @param duration {number}
 * @returns {{data: {}, amp, property: (string|*)}}
 */
module.exports = function ({
    condition,
    dc,
    saveAbility,
    duration
}) {
    return {
        property: CONSTS.ITEM_PROPERTY_ON_HIT_APPLY_CONDITION,
        amp: 0,
        data: {
            condition,
            dc,
            saveAbility,
            duration
        }
    }
}
