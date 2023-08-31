/**
 *
 * @param state
 * @param getters
 * @returns {boolean}
 */
module.exports = (state, getters) => (getters.getHitPoints / getters.getMaxHitPoints) < 0.5