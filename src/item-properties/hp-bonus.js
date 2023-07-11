const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_HP_BONUS
 * @param amp {number}
 * @returns {{data: {}, amp, property: (string|*)}}
 */
module.exports = function ({ amp }) {
    return {
        property: CONSTS.ITEM_PROPERTY_HP_BONUS,
        amp,
        data: {}
    }
}