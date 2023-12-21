/**
 *
 * @param state
 * @param getters
 * @param externals
 * @param spells
 */
module.exports = ({ state, getters, externals }, { spell }) => {
    if (getters.getFeats.has('feat-spell-signature')) {
        const aStateSignatureSpells = state.data.spellbook.signatureSpells
        const aCurrentSignatureSpells = new Set(aStateSignatureSpells)
        if (!aCurrentSignatureSpells.has(spell)) {
            const nMaxSpells = externals.data['data-ddmagic-constants'].featSpellSignatureSpellCount
            aStateSignatureSpells.push({ spell, used: 0 })
            while (aStateSignatureSpells.length > nMaxSpells) {
                aStateSignatureSpells.shift()
            }
        }
    }
}