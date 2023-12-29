/**
 *
 * @param state {object}
 * @param getters {D20CreatureStoreGetters}
 * @param externals {object}
 * @returns {number}
 */
module.exports = (state, getters, externals) => {
    const nLevel = getters.getSpellCasterLevel
    const data = externals.data['data-ddmagic-spell-count']
    return nLevel === 0
        ? 0
        : data[nLevel - 1].knownCantripCount
}
