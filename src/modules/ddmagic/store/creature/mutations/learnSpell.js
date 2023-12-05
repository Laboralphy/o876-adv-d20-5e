module.exports = ({ state, getters, externals }, { spell }) => {
    const oSpellDB = externals.data['data-ddmagic-spell-database']
    if (spell in oSpellDB) {
        if (!(spell in state.data.spellbook.knownSpells)) {
            state.data.spellbook.knownSpells.push(spell)
        }
    } else {
        throw new Error('Spell "' + spell + '" does not exist')
    }
}
