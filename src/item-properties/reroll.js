const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_REROLL
 * @param amp {number}
 * @param when {string} getter
 * @returns {{data: {when}, amp, property: (string|*)}}
 */
module.exports = function ({ amp, when }) {
    return {
        property: CONSTS.ITEM_PROPERTY_REROLL,
        amp,
        data: {
            when
        }
    }
}