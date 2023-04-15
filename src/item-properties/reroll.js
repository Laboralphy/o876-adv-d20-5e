const CONSTS = require('../consts')

module.exports = function ({ amp, when }) {
    return {
        property: CONSTS.ITEM_PROPERTY_REROLL,
        amp,
        data: {
            when
        }
    }
}