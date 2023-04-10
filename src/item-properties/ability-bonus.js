const CONSTS = require('../consts')

module.exports = function ({ ability, value }) {
    return {
        property: CONSTS.ITEM_PROPERTY_ABILITY_BONUS,
        amp: value,
        data: {
            ability
        }
    }
}