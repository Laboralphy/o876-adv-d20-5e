const CONSTS = require('../consts')

module.exports = function ({ value, sType }) {
    return {
        property: CONSTS.ITEM_PROPERTY_AC_BONUS,
        amp: value,
        data: {
            type: sType
        }
    }
}