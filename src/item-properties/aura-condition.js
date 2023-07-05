const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_AURA_CONDITION
 * La créature emet une aura qui applique une condition aux créatures situées dans un certain rayon
 * @param condition {string} condition
 * @param dc {number}
 * @param ability {string} ability
 * @param duration {number}
 * @param radius {number}
 * @returns {{data: {}, amp, property: (string|*)}}
 */
module.exports = function ({ condition, dc, ability, duration, radius }) {
    return {
        property: CONSTS.ITEM_PROPERTY_AURA_CONDITION,
        amp: 0,
        data: {
            condition,
            dc,
            ability,
            duration,
            radius
        }
    }
}
