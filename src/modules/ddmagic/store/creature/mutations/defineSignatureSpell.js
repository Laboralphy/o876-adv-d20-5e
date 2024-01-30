/**
 *
 * @param state
 * @param getters
 * @param externals
 * @param spell {string}
 */
module.exports = ({ state, getters, externals }, { spell }) => {
    if (getters.getFeatSet.has('feat-spell-signature')) {
        const aStateSignatureSpells = state.data.spellbook.signatureSpells
        const aCurrentSignatureSpells = new Set(aStateSignatureSpells.map(s => s.spell))
        if (!aCurrentSignatureSpells.has(spell)) {
            aStateSignatureSpells.push({ spell, used: 0 })
            aStateSignatureSpells.shift()
        }
    }
}