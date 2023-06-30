const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_REGEN
 * @param amp {number}
 * @returns {{data: {}, amp, property: (string|*)}}
 */
module.exports = function ({ amp }) {
    return {
        property: CONSTS.ITEM_PROPERTY_REGEN,
        amp,
        data: {}
    }
}