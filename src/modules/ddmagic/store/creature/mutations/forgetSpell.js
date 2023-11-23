/**
 * forget a spell to make room for another spell
 * @param state
 * @param spell {string} identifiant du sort
 * @param getters {*}
 * @param externals
 */
module.exports = ({ state, getters, externals }, { spell}) => {
    // il faut que le sort existe
    const oSpellData = externals.data['data-ddmagic-spell-database']
    if (spell in oSpellData) {
        if (spell.ritual) {
            return // on ne mémorise pas les rituels, on les connait déjà tous
        }
        const nSpellLevel = spell.level
        if (nSpellLevel === 0) {
            // memorisation d'un cantrip
            const nMaxCantrip = getters.getMaxPreparableCantrips
            const m = state.data.spellbook.preparedCantrips
            const iSpell = m.indexOf(spell)
            if (iSpell >= 0) {
                m.splice(iSpell, 1)
            }
            m.push(spell)
            while (m.length > nMaxCantrip) {
                m.shift()
            }
        } else {
            // memorisation d'un spell
            const nMaxSpell = getters.getMaxPreparableSpells
            const m = state.data.spellbook.preparedSpells
            const iSpell = m.indexOf(spell)
            if (iSpell >= 0) {
                m.splice(iSpell, 1)
            }
            while (m.length > nMaxSpell) {
                m.shift()
            }
        }
    } else {
        throw new Error('Spell "' + spell + '" does not exist')
    }
}
