const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_ON_HIT_ABILITY_DRAIN
 *
 * Provoque un effet spécial de réduction de caractéristique sur une créature touchée par l'arme
 * sur laquelle est associée cette propriété
 *
 * on hit effects :
 *
 * ON_HIT_ : Applique un effet de reduction de caractéristique si la cible rate son jet de sauvegarde
 * ON_HIT_ABILITY_DRAIN : Applique un effet de reduction de caractéristique si la cible rate son jet de sauvegarde
 * sur cette même caractéristique
 * ON_HIT_POISON : Applique un effet de poison-wyvern.json si la cible rate son jet de sauvegarde
 * ON_HIT_DISEASE : Applique une maladie
 *
 *
 * @param amp {number}
 * @param poison {string} ability
 * @param dc {number}
 * @param saveCount {number}
 * @param duration {number}
 * @returns {{data: {}, amp, property: (string|*)}}
 */
module.exports = function ({ amp = 0, dot = "", dc, saveCount = 0, duration = 0 }) {
    return {
        property: CONSTS.ITEM_PROPERTY_ON_HIT_LIFE_DRAIN,
        amp,
        data: {
            dc,
            dot,
            saveCount,
            duration
        }
    }
}
