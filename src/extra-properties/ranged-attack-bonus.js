const CONSTS = require('../consts')

module.exports = function ({ value }) {
    return {
        property: CONSTS.EXTRA_PROPERTY_RANGED_ATTACK_BONUS,
        amp: value
    }
}