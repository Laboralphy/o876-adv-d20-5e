const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_DARKVISION
 * @returns {{data: {}, amp, property: (string|*)}}
 */
module.exports = function () {
    return {
        property: CONSTS.ITEM_PROPERTY_DARKVISION,
        amp: 0,
        data: {}
    }
}