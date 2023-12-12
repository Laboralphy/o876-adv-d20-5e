module.exports = ({ state, getters, externals }, { spell }) => {
    const oSpellDB = externals.data['data-ddmagic-spell-database']
    if (spell in oSpellDB) {
        if (!state.data.spellbook.knownSpells.includes(spell)) {
            state.data.spellbook.knownSpells.push(spell)
        }
    } else {
        throw new Error('Spell "' + spell + '" does not exist')
    }
}
