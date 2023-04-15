const CONSTS = require('../consts')

module.exports = function ({ ability, amp }) {
    return {
        property: CONSTS.ITEM_PROPERTY_ABILITY_BONUS,
        amp,
        data: {
            ability
        }
    }
}