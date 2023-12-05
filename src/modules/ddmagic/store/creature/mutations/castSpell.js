module.exports = ({ state, getters, externals }, { spell, power = 0}) => {
    const cs = getters.getCastableSpells
    const oSpellDB = externals.data['data-ddmagic-spell-database']
    if (spell in oSpellDB) {
        const oSpell = oSpellDB[spell]
        const nCastLevel = Math.min(9, oSpell.level + power)
        if (spell in cs) {
            if (cs[spell][nCastLevel]) {
                // on peut caster
            }
        }
    }
}