/**
 *
 * @param state
 * @param getters
 * @returns {number}
 */
module.exports = (state, getters, externals) => {
    const nLevel = getters.getWizardLevel
    const data = externals.data['data-ddmagic-spell-count']
    return nLevel === 0
        ? 0
        : data[nLevel - 1].knownCantripCount
}
