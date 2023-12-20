/**
 * Returns the mastered spell list
 * @param state
 * @param getters
 * @param externals
 * @returns {Set<string>}
 */
module.exports = (state, getters, externals) => {
    const nMaxSpells = externals.data['data-ddmagic-constants'].featSpellMasterySpellCount
    if (getters.getFeats.has('feat-spell-mastery')) {
        const ps = state.data.spellbook.preparedSpells
        new Set(state
            .data
            .spellbook
            .masteredSpells
            .filter(s => ps.includes(s))
            .slice(0, nMaxSpells)
        )
    } else {
        return new Set()
    }
}
