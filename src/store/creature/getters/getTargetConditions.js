/**
 *
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {Set}
 */
module.exports = (state, getters) => {
    console.log('update getter getTargetConditions')
    return new Set(Object
        .entries(getters.getTargetConditionSources)
        .filter(([key, value]) => value.size > 0)
        .map(([key, value]) => key)
    )
}
