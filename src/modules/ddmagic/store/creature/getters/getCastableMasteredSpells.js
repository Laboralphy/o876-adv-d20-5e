/**
 * Returns the mastered spell list
 * @param state
 * @param getters
 * @param externals
 * @returns {Set<string>}
 */
module.exports = (state, getters, externals) => {
    if (getters.getFeats.has('feat-spell-mastery')) {
        const ps = state.data.spellbook.preparedSpells
        return new Set(state
            .data
            .spellbook
            .masteredSpells
            .filter(s => ps.includes(s))
        )
    } else {
        return new Set()
    }
}
