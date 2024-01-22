/**
 *
 * @param state
 * @returns {*|null}
 */
module.exports = state => state.target.active && !!state.target.id ? state.target : null
