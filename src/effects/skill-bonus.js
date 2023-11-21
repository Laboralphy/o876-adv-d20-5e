const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * Ajoute un bonus plein à un skill en particulier
 * @param value {number} valeur ajoutée au skill lors des rolls
 * @param sSkill {string} skill-
 * @returns {D20Effect}
 */
function create (value, sSkill) {
    return createEffect(CONSTS.EFFECT_SKILL_BONUS, value, { skill: sSkill })
}

module.exports = {
    create
}