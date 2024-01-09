/**
 *
 * @param state
 * @param getters
 * @param externals
 * @returns {Object<string, boolean[]>}
 */
module.exports = (state, getters, externals) => {
    const oSpellBook = state.data.spellbook
    const aKnownSpells = oSpellBook.knownSpells
    const aMasteredSpells = oSpellBook.masteredSpells
    const oRegistry = {}
    const oSpellDB = externals.data['data-ddmagic-spell-database']
    /**
     * @type {{ count: number, used: number }[]}
     */
    const oSlotStatus = getters.getSpellSlotStatus
    const oPrepared = getters.getPreparedSpells
    const aPrepCantrips = new Set(oPrepared.cantrips)
    const aPrepSpells = new Set(oPrepared.spells)
    const bFeatSpellMastery = getters.getFeats.has('feat-spell-mastery')
    const aCastableSignatureSpells = getters.getCastableSignatureSpells
    aKnownSpells.forEach(spell => {
        if (spell in oSpellDB) {
            const oSpell = oSpellDB[spell]
            const nSpellLevel = oSpell.level
            const bCantrip = nSpellLevel === 0
            const bSpellPrepared = bCantrip
                ? aPrepCantrips.has(spell)
                : aPrepSpells.has(spell)
            if (bCantrip) {
                // les cantrips sont castables si préparés
                oRegistry[spell] = [bSpellPrepared, false, false, false, false, false, false, false]
            } else if (oSpell.ritual || (bFeatSpellMastery && nSpellLevel <= 2 && aMasteredSpells.includes(spell) && bSpellPrepared)) {
                // les rituels sont toujours disponibles
                // le sort fait partie des sorts maîtrisés (il faut qu'ils soient également préparés)
                // On peut donc les caster au niveau natif du sort
                oRegistry[spell] = [false, false, false, false, false, false, false, false, false, false]
                oRegistry[spell][nSpellLevel] = true
            } else if (
                aCastableSignatureSpells &&
                nSpellLevel === 3
            ) {
                oRegistry[spell] = [false, false, false, false, false, false, false, false, false, false]
                oRegistry[spell][nSpellLevel] = true
            } else {
                const a = [false]
                for (let i = 1; i <= 9; ++i) {
                    const { count, used } = oSlotStatus[i - 1]
                    a[i] = bSpellPrepared && nSpellLevel <= i && used < count
                }
                oRegistry[spell] = a
            }
        }
    })
    return oRegistry
}
