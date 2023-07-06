const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_ON_HIT_POISON
 *
 * Provoque un effet de poison sur la cible touchée par l'arme sur laquelle est appliquée cette propriété
 *
 * @param damage {number|string} dice
 * @param dc {number}
 * @param dot {number|string} dice
 * @param saveCount {number}
 * @param duration {number}
 * @returns {{data: {}, amp, property: (string|*)}}
 */
module.exports = function ({ damage = 0, dot = "", dc, saveCount = 0, duration = 0 }) {
    return {
        property: CONSTS.ITEM_PROPERTY_ON_HIT_ABILITY_DRAIN,
        amp: damage,
        data: {
            dc,
            dot,
            saveCount,
            duration
        }
    }
}
