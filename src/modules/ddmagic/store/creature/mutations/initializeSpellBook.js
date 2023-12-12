module.exports = ({ state, getters }) => {
    const scpl = getters.getSpellSlotStatus
    scpl.forEach((count, iLevel) => {
        state.data.spellbook.levels[iLevel + 1] = count
    })
}