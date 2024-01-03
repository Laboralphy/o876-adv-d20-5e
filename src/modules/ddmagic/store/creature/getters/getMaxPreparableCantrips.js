/**
 *
 * @param state {object}
 * @param getters {D20CreatureStoreGetters}
 * @param externals {object}
 * @returns {number}
 */
module.exports = (state, getters, externals) => {
    const nLevel = getters.getSpellCasterLevel
    const data = externals
        .data['data-ddmagic-spell-count']
        .find(d => d.wizardLevel === nLevel)
    if (!data) {
        throw new Error('this wizard level is invalid : ' + nLevel)
    }
    return data.knownCantripCount
}
