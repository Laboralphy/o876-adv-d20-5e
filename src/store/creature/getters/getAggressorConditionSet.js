/**
 *
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {Set}
 */
module.exports = (state, getters) => {
    return new Set(Object
        .entries(getters.getAggressorConditionSources)
        .filter(([key, value]) => value.size > 0)
        .map(([key, value]) => key)
    )
}
