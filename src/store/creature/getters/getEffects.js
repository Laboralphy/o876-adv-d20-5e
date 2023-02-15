/**
 * Liste des effets actifs sur la créature
 * @param state
 * @param getters
 * @returns {[]}
 */
module.exports = (state, getters) =>
        state
            .effects
            .filter(eff => eff.duration > 0)
