const CONSTS = require('../consts')

module.exports = function ({ ability, value }) {
    return {
        property: CONSTS.EXTRA_PROPERTY_ABILITY_BONUS,
        amp: value,
        ability
    }
}