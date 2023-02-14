const CONSTS = require('../consts')

module.exports = function ({ value, when }) {
    return {
        property: CONSTS.ITEM_PROPERTY_REROLL,
        amp: value,
        when
    }
}