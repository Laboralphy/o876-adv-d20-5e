const CONSTS = require('../consts')

module.exports = function ({ rollTypes, abilities, origin }) {
    return {
        property: CONSTS.ITEM_PROPERTY_DISADVANTAGE,
        amp: 0,
        abilities,
        rollTypes,
        origin
    }
}