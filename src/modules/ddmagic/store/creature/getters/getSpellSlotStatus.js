/**
 *
 * @param state
 * @param getters
 * @param externals
 * @returns {{ count: number, used: number }[]}
 */
module.exports = (state, getters, externals) => {
    const nLevel = getters.getSpellCasterLevel
    const data = externals.data['data-ddmagic-spell-count']
    const aSpellSlots = nLevel === 0
        ? [0, 0, 0, 0, 0, 0, 0, 0, 0]
        : data[nLevel - 1].slotCountPerLevel
    return aSpellSlots.map((n, i) => ({
        count: n,
        used: state.data.spellbook.slots[i]
    }))
}
