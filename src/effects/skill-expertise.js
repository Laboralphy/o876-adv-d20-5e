const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * Ajoute le bonus de proficiency modifié à un skill ou une caractéristique de skill
 * @param value {number} factueur de multiplication du bonus de proficiency
 * @param sType {string} ABILITY_* ou SKILL_*
 * @returns {D20Effect}
 */
function create (value, sType) {
    return createEffect(CONSTS.EFFECT_SKILL_EXPERTISE, value, { type: sType })
}

module.exports = {
    create
}