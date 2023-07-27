const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_EXTRA_ATTACK
 * Augmente le nombre d'attaques par tour
 * L'amplitude peut être négative pour réduire le nombre d'attaques
 * @param amp {number}
 * @returns {{data: {}, amp, property: (string|*)}}
 */
module.exports = function ({ amp }) {
    return {
        property: CONSTS.ITEM_PROPERTY_EXTRA_ATTACKS,
        amp,
        data: {}
    }
}