const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_MASSIVE_CRITICAL
 * @param amp {number}
 * @returns {{data: {}, amp, property: (string|*)}}
 */
module.exports = function ({ amp }) {
    return {
        property: CONSTS.ITEM_PROPERTY_MASSIVE_CRITICAL,
        amp,
        data: {}
    }
}