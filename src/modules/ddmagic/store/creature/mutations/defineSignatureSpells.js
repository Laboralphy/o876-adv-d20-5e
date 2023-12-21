/**
 *
 * @param state
 * @param getters
 * @param externals
 * @param spells
 */
module.exports = ({ state, getters, externals }, { spells }) => {
    if (getters.getFeats.has('feat-spell-signature')) {
        const aStateSignatureSpells = state.data.spellbook.signatureSpells
        const nMaxSpells = externals.data['data-ddmagic-constants'].featSpellSignatureSpellCount
        const aCurrentSignatureSpells = new Set(aStateSignatureSpells)
        const aSpellToPush = spells
            .filter(s => !aCurrentSignatureSpells.has(s))
            .slice(0, nMaxSpells)
            .map(spell => ({ spell, used: 0 }))
        aStateSignatureSpells.push(...aSpellToPush)
        while (aStateSignatureSpells.length > nMaxSpells) {
            aStateSignatureSpells.shift()
        }
    }
}