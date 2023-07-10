const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_DAMAGE_BONUS
 * @param amp {number|string} dice
 * @param type {string} damageType
 * @returns {{data: {type: string}, amp, property: (string|*)}}
 */
module.exports = function ({ amp, type = '' }) {
    return {
        property: CONSTS.ITEM_PROPERTY_DAMAGE_BONUS,
        amp,
        data: {
            type
        }
    }
}