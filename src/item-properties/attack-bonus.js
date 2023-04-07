const CONSTS = require('../consts')

module.exports = function ({ value }) {
    return {
        property: CONSTS.ITEM_PROPERTY_ATTACK_BONUS,
        amp: value,
        data: {}
    }
}