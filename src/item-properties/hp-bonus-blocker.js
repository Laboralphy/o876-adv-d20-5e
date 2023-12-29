const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_HP_BONUS_BLOCKER
 * @param amp {number} if < 0 blocks hp drain if > 0 blocks hp raise
 * @returns {{data: {}, amp, property: (string|*)}}
 */
module.exports = function ({ amp }) {
    return {
        property: CONSTS.ITEM_PROPERTY_HP_BONUS_BLOCKER,
        amp,
        data: {}
    }
}