/**
 * Liste des effets actifs sur la créature
 * @param state
 * @returns {D20Effect[]}
 */
module.exports = state => {
    return state.effects.filter(eff => eff.duration <= 0)
}
