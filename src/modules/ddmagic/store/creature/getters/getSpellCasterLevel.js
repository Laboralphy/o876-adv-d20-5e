/**
 * Returns the number of wizard levels
 * @param state
 * @param getters
 * @returns {number}
 */
module.exports = (state, getters) => getters.getLevelByClass.wizard || 0
