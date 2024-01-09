const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_EXTRA_PROFICIENCY
 * Add a new proficiency
 * @param amp {number}
 * @returns {{data: {}, amp, property: (string|*)}}
 */
module.exports = function ({ proficiency }) {
    return {
        property: CONSTS.ITEM_PROPERTY_EXTRA_PROFICIENCY,
        amp: 0,
        data: {
            proficiency
        }
    }
}