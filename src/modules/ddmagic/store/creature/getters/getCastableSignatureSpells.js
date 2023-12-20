/**
 *
 * @param state {object}
 * @param getters {D20CreatureStoreGetters}
 * @param externals {object}
 * @returns {Set<string>}
 */
module.exports = (state, getters, externals) => {
    if (getters.getFeats.has('feat-spell-signature')) {
        // on a le feat
        // on va lister les sorts de prédilection qui ont des slots
        const sssps = externals.data['data-ddmagic-constants'].featSpellSignatureSlotPerSpell
        return new Set(state
            .data
            .spellbook
            .signatureSpells
            .filter(({ used }) => used >= sssps)
            .map(({ spell }) => spell)
            .slice(0, externals.data['data-ddmagic-constants'].featSpellSignatureSpellCount))
    } else {
        return new Set()
    }
}