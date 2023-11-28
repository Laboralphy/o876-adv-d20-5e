const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_LIGHT
 * @param amp {number} intensité lumineuse
 * @returns {{data: {}, amp, property: (string|*)}}
 */
module.exports = function ({ amp }) {
    return {
        property: CONSTS.ITEM_PROPERTY_LIGHT,
        amp,
        data: {}
    }
}