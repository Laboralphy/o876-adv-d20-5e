/**
 *
 * @param state
 * @param getters
 * @returns {number}
 */
module.exports = (state, getters) => getters.getTarget ? getters.getTarget.distance : NaN
