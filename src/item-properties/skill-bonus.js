const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_SKILL_BONUS
 * @param amp {number}
 * @param skill {string} skill
 * @returns {{data: {skill}, amp, property: (string|*)}}
 */
module.exports = function ({ amp, skill }) {
    return {
        property: CONSTS.ITEM_PROPERTY_SKILL_BONUS,
        amp,
        data: {
            skill
        }
    }
}