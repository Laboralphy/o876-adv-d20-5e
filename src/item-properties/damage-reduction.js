const CONSTS = require('../consts')

module.exports = function ({ amp, type = '' }) {
    return {
        property: CONSTS.ITEM_PROPERTY_DAMAGE_REDUCTION,
        amp,
        data: {
            type
        }
    }
}