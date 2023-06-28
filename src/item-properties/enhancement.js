const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_ENHANCEMENT
 * @param amp {number}
 * @returns {{data: {}, amp, property: (string|*)}}
 */
module.exports = function ({ amp }) {
    return {
        property: CONSTS.ITEM_PROPERTY_ENHANCEMENT,
        amp,
        data: {}
    }
}