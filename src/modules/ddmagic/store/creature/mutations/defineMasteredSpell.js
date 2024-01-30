/**
 *
 * @param state
 * @param getters
 * @param externals
 * @param spell {string}
 */
module.exports = ({ state, getters, externals }, { spell }) => {
    if (getters.getFeatSet.has('feat-spell-mastery')) {
        const aStateMasteredSpells = state.data.spellbook.masteredSpells
        const aCurrentMasteredSpells = new Set(aStateMasteredSpells)
        if (!aCurrentMasteredSpells.has(spell)) {
            const sd = externals.data['data-ddmagic-spell-database'][spell]
            if (!sd) {
                throw new Error('Spell ' + spell + ' is not in database')
            }
            switch (sd.level) {
                case 2: {
                    aStateMasteredSpells[1] = spell
                    break
                }

                case 1: {
                    aStateMasteredSpells[0] = spell
                    break
                }

                default: {
                    throw new Error('Spell ' + spell + ' is level ' + sd.level + ', thus cannot be mastered (only level 1 and level 2)')
                }
            }
        }
    }
}