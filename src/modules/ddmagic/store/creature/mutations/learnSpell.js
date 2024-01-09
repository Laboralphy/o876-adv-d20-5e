module.exports = ({ state, getters, externals }, { spell }) => {
    const oSpellDB = externals.data['data-ddmagic-spell-database']
    if (spell in oSpellDB) {
        if (!getters.getKnownSpells.has(spell)) {
            state.data.spellbook.knownSpells.push(spell)
        }
    } else {
        throw new Error('Spell "' + spell + '" does not exist')
    }
}
