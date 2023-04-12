const CONSTS = require('../consts')

module.exports = function ({ value, skill }) {
    return {
        property: CONSTS.ITEM_PROPERTY_SKILL_BONUS,
        amp: value,
        data: {
            skill
        }
    }
}