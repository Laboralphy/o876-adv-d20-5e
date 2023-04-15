const CONSTS = require('../consts')

module.exports = function ({ amp, type: sType }) {
    return {
        property: CONSTS.ITEM_PROPERTY_SAVING_THROW_BONUS,
        amp,
        data: {
            type: sType
        }
    }
}