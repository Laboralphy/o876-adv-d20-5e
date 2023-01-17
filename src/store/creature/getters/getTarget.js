/**
 *
 * @param state
 * @returns {{ condition: Object.<string, boolean>}}
 */
module.exports = state => state.target.active && state.target.id > 0 ? state.target : null
