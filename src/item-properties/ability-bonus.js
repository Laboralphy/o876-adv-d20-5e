const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_ABILITY_BONUS
 * Increase or decrease an ability
 * @param ability {string} ability
 * @param amp {number}
 * @returns {{data: {ability}, amp, property: (string|*)}}
 */
module.exports = function ({ ability, amp }) {
    return {
        property: CONSTS.ITEM_PROPERTY_ABILITY_BONUS,
        amp,
        data: {
            ability
        }
    }
}