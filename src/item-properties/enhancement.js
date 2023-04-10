const CONSTS = require('../consts')

module.exports = function ({ value }) {
    return {
        property: CONSTS.ITEM_PROPERTY_ENHANCEMENT,
        amp: value,
        data: {}
    }
}