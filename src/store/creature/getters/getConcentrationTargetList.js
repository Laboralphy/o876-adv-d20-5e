const CONSTS = require('../../../consts')
/**
 * Renvoie la liste des identifiant de créature qui sont la cible des effets
 * de concentration de la creature
 * @param state
 * @param getters
 * @returns {string[]}
 */
module.exports = (state, getters) => getters
    .getEffects
    .filter(eff =>eff.type === CONSTS.EFFECT_CONCENTRATION)
    .map(eff => eff.data.effects.map(eff2 => eff2.target))
    .flat()
