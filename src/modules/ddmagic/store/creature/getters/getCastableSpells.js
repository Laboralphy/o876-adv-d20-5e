/**
 *
 * @param state
 * @param getters
 * @param externals
 * @returns {Object<string, boolean[]>}
 */
module.exports = (state, getters, externals) => {
    const aKnownSpells = state.data.spellbooks.knownSpells
    const oRegistry = {}
    const oSpellDB = externals.data['data-ddmagic-spell-database']
    const oSlotStatus = getters.getSpellSlotStatus
    const oPrepared = getters.getPreparedSpells
    const aPrepCantrips = new Set(oPrepared.cantrips)
    const aPrepSpells = new Set(oPrepared.spell)
    aKnownSpells.forEach(spell => {
        if (spell in oSpellDB) {
            const oSpell = oSpellDB[spell]
            const nSpellLevel = oSpell.level
            if (oSpell.ritual) {
                // les rituels sont toujours disponibles
                oRegistry[spell] = [true, true, true, true, true, true, true, true, true, true]
            } else if (oSpell.level === 0) {
                // les cantrips sont castable si préparé
                oRegistry[spell] = [aPrepCantrips.has(spell), false, false, false, false, false, false, false]
            } else {
                const a = [false]
                const b = aPrepSpells.has(spell)
                for (let i = 1; i <= 9; ++i) {
                    const { count, uses } = oSlotStatus[i - 1]
                    a[i] = b && nSpellLevel <= i && uses < count
                }
                oRegistry[spell] = a
            }
        }
    })
    return oRegistry
}