/**
 *
 * @param state
 * @param getters
 * @param externals
 * @param spells
 */
module.exports = ({ state, getters, externals }, { spells }) => {
    if (getters.getFeats.has('feat-spell-mastery')) {
        const aStateMasteredSpells = state.data.spellbook.masteredSpells
        const nMaxSpells = externals.data['data-ddmagic-constants'].featSpellMasterySpellCount
        const aCurrentMasteredSpells = new Set(aStateMasteredSpells)
        const aSpellToPush = spells
            .filter(s => !aCurrentMasteredSpells.has(s))
            .slice(0, nMaxSpells)
        aStateMasteredSpells.push(...aSpellToPush)
        while (aStateMasteredSpells.length > nMaxSpells) {
            aStateMasteredSpells.shift()
        }
    }
}