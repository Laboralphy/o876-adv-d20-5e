/**
 *
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {{}}
 */
module.exports = (state, getters) => {
    const creature = getters.getAggressor
    if (creature) {
        return creature.conditions
    } else {
        return {}
    }
}
