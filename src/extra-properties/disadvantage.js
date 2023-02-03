const CONSTS = require('../consts')

module.exports = function ({ rollTypes, abilities, origin }) {
    return {
        property: CONSTS.EXTRA_PROPERTY_DISADVANTAGE,
        amp: 0,
        abilities,
        rollTypes,
        origin
    }
}