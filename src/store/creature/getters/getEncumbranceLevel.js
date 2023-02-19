/**
 *
 * @param state
 * @param getters
 * @param externals
 * @return {number}
 */
module.exports = (state, getters, externals) => {
    const { LIGHTLY_ENCUMBERED_LIMIT, HEAVILY_ENCUMBERED_LIMIT } = externals.data.variables
    const cc = getters.getCarryingCapacity
    if (state.encumbrance > cc) {
        return 3
    }
    if (state.encumbrance > cc * HEAVILY_ENCUMBERED_LIMIT) {
        return 2
    }
    if (state.encumbrance > cc * LIGHTLY_ENCUMBERED_LIMIT) {
        return 1
    }
    return 0
}