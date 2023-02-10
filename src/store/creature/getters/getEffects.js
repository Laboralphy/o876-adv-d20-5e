/**
 * Liste des effets actifs sur la créature
 * @param state
 * @param getters
 * @returns {[]}
 */
module.exports = (state, getters) => {
    return state
        .effects
        .filter(eff => eff.duration > 0)
        .map(eff => ({
            ...eff,
            amp: typeof eff.amp === 'number'
                ? eff.amp
                : eff.amp in getters
                    ? getters[eff.amp]
                    : 0
        }))
}
