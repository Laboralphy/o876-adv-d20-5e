const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_RANGED_ATTACK_BONUS
 * @param amp {number}
 * @returns {{data: {}, amp, property: (string|*)}}
 */
module.exports = function ({ amp }) {
    return {
        property: CONSTS.ITEM_PROPERTY_RANGED_ATTACK_BONUS,
        amp,
        data: {}
    }
}
