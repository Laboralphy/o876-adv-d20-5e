const CONSTS = require('../consts')

module.exports = function ({ amp, skill }) {
    return {
        property: CONSTS.ITEM_PROPERTY_SKILL_BONUS,
        amp,
        data: {
            skill
        }
    }
}