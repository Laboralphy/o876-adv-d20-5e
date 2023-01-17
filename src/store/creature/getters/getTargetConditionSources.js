/**
 *
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {{}}
 */
module.exports = (state, getters) => {
    const creature = getters.getTarget
    if (creature) {
        return creature.conditions
    } else {
        return {}
    }
}
