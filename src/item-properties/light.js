const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_LIGHT
 * @returns {{data: {}, amp, property: (string|*)}}
 */
module.exports = function () {
    return {
        property: CONSTS.ITEM_PROPERTY_LIGHT,
        amp: 100,
        data: {}
    }
}