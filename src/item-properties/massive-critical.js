const CONSTS = require('../consts')

module.exports = function ({ value }) {
    return {
        property: CONSTS.ITEM_PROPERTY_MASSIVE_CRITICAL,
        amp: value
    }
}