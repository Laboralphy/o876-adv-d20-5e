const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_PHARMA
 * @returns {{data: {}, amp, property: (string|*)}}
 */
module.exports = function () {
    return {
        property: CONSTS.ITEM_PROPERTY_PHARMA,
        amp: 0,
        data: {}
    }
}