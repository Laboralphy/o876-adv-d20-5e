const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_AC_BONUS
 * @param amp {number}
 * @returns {{data: {}, amp, property: (string|*)}}
 */
module.exports = function ({ amp }) {
    return {
        property: CONSTS.ITEM_PROPERTY_EXTRA_WEIGHT,
        amp,
        data: {}
    }
}