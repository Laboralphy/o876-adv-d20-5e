function isSpellSignature (state, spell) {
    return !!state.data.spellbook.signatureSpells.find(s => s.spell === spell)
}

module.exports = ({ state, getters, externals }, { spells }) => {
    const nMaxSpells = externals.data['data-ddmagic-constants'].featSpellSignatureSpellCount
    if (getters.getFeats.has('feat-spell-signature')) {
        // raboter (en cas)
        state.data.spellbook.signatureSpells = state.data.spellbook.signatureSpells.slice(0, nMaxSpells)
        const aSpellToPush = spells
            .filter(s => !isSpellSignature(state, s))
            .slice(0, nMaxSpells)
            .map(spell => ({
                spell,
                used: 0
            }))
        state
            .data
            .spellbook
            .signatureSpells
            .push(...aSpellToPush)
        while (state.data.spellbook.masteredSpells.length > nMaxSpells) {
            state.data.spellbook.masteredSpells.shift()
        }
    }
}