const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect add an advantage
 * @param rollTypes {string[]|string} types de lancer de dé : attaque, sauvegarde, check
 * @param abilities {string[]|string} caractéristiques impactées par le désavantage
 * @param origin {string} indication sur la nature du désavantage (pour information)
 * @returns {D20Effect}
 */
function create (rollTypes, abilities, origin) {
    if (!Array.isArray(rollTypes)) {
        rollTypes = [rollTypes]
    }
    if (!Array.isArray(abilities)) {
        abilities = [abilities]
    }
    return createEffect(CONSTS.EFFECT_DISADVANTAGE, 1, {
        rollTypes,
        abilities,
        origin
    })
}

module.exports = {
    create
}
