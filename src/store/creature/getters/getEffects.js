/**
 * Liste des effets actifs sur la créature
 * @param state
 * @returns {[]}
 */
module.exports = state =>
        state
            .effects
            .filter(eff => eff.duration > 0)
