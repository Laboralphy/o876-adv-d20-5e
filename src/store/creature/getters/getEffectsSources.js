/**
 * Renvoie la liste des identifiant des créature qui sont la source des effets
 * appliquée à la créature
 * @param state
 * @param getters
 * @returns {string[]}
 */
module.exports = (state, getters) => getters
    .getEffects
    .map(eff => eff.source)
