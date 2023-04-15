const CONSTS = require('../consts')

module.exports = function ({ amp, type = '' }) {
    return {
        property: CONSTS.ITEM_PROPERTY_DAMAGE_BONUS,
        amp,
        data: {
            type
        }
    }
}