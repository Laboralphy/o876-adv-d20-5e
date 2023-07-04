const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_ON_HIT_APPLY_CONDITION
 * @param condition {string} condition
 * @param dc {number}
 * @param ability {string} ability
 * @param duration {number}
 * @param chance {number}
 * @returns {{data: {}, amp, property: (string|*)}}
 */
module.exports = function ({ condition, dc, ability, duration }) {
    return {
        property: CONSTS.ITEM_PROPERTY_ON_HIT_APPLY_CONDITION,
        amp: 0,
        data: {
            condition,
            dc,
            ability,
            duration
        }
    }
}
