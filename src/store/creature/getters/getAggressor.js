/**
 *
 * @param state
 * @returns {{ condition: Object.<string, boolean>}}
 */
module.exports = state => state.aggressor.active && !!state.aggressor.id ? state.aggressor : null
