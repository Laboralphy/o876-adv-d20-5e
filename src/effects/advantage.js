const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect add an advantage
 * @param rollTypes {string[]} types de lancer de dé : attaque, sauvegarde, check
 * @param abilities {string[]} caractéristiques impactées par l'avantage
 * @param origin {string} indication sur la nature de l'avantage (pour information)
 * @returns {D20Effect}
 */
function create (rollTypes, abilities, origin) {
    return createEffect(CONSTS.EFFECT_ADVANTAGE, 0, {
        rollTypes,
        abilities,
        origin
    })
}

module.exports = {
    create
}
