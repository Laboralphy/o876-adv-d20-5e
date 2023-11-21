const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * Ajoute le bonus de proficiency modifié à un skill ou une caractéristique de skill
 * @param value {number} factueur de multiplication du bonus de proficiency
 * @param sType {string} ABILITY_* ou SKILL_*
 * @returns {D20Effect}
 */
function create (value) {
    return createEffect(CONSTS.EFFECT_SKILL_EXPERTISE_MINIMUM_ROLL, value)
}

module.exports = {
    create
}