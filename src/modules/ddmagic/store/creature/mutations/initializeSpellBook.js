module.exports = ({ state, getters }) => {
    const scpl = getters.getDDMagicSlotCountPerLevel
    scpl.forEach((count, iLevel) => {
        state.data.spellbook.levels[iLevel + 1] = count
    })
}