/**
 * @param state
 * @returns {Set<string>}
 */
module.exports = state => new Set(state.areaFlags.slice(0))
