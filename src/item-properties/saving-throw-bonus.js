const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_SAVING_THROW_BONUS
 * @param amp {number}
 * @param type {string} savingThrowType
 * @returns {{data: {type}, amp, property: (string|*)}}
 */
module.exports = function ({ amp, type: sType }) {
    return {
        property: CONSTS.ITEM_PROPERTY_SAVING_THROW_BONUS,
        amp,
        data: {
            type: sType
        }
    }
}