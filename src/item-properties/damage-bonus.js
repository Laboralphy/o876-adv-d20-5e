const CONSTS = require('../consts')

module.exports = function ({ value, type }) {
    return {
        property: CONSTS.ITEM_PROPERTY_DAMAGE_BONUS,
        amp: value,
        type
    }
}