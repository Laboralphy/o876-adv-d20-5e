/**
 *
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {Set}
 */
module.exports = (state, getters) => {
    const target = getters.getTarget
    if (target) {
        return new Set(target.conditions)
    } else {
        return new Set()
    }
}
