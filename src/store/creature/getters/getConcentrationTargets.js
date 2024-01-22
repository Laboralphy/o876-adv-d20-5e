const CONSTS = require('../../../consts')
/**
 * Renvoie la liste des identifiants de créatures qui sont la cible des effets
 * de concentration de la creature
 * @param state
 * @param getters
 * @returns {string[]}
 */
module.exports = (state, getters) => {
    const aCreatures = new Set()
    getters
        .getEffects
        .filter(eff =>eff.type === CONSTS.EFFECT_CONCENTRATION)
        .forEach(eff => {
            eff.data.effects.forEach(eff2 => {
                aCreatures.add(eff2.target)
            })
        })
    return Array.from(aCreatures)
}
