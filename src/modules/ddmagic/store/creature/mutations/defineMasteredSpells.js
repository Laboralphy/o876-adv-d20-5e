module.exports = ({ state, getters, externals }, { spells }) => {
    const nMaxSpells = externals.data['data-ddmagic-constants'].featSpellMasterySpellCount
    if (getters.getFeats.has('feat-spell-mastery')) {
        const aSpellToPush = spells.slice(0, nMaxSpells)
        state.data.spellbook.masteredSpells.push(...aSpellToPush)
        while (state.data.spellbook.masteredSpells.length > nMaxSpells) {
            state.data.spellbook.masteredSpells.shift()
        }
    }
}