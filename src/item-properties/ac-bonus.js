const CONSTS = require('../consts')

module.exports = function ({ value }) {
    return {
        property: CONSTS.EXTRA_PROPERTY_AC_BONUS,
        amp: value
    }
}