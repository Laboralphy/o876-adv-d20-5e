/**
 * Returns the known spell list
 * @param state
 * @returns {Set<string>}
 */
module.exports = state => new Set(state.data.spellbook.knownSpells)
