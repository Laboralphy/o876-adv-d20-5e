const CONSTS = require('../consts')

module.exports = function ({ value, type: sType }) {
    return {
        property: CONSTS.ITEM_PROPERTY_SAVING_THROW_BONUS,
        amp: value,
        data: {
            type: sType
        }
    }
}