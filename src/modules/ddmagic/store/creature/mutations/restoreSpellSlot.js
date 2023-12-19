module.exports = ({ state }, { level, count }) => {
    state.data.spellbook.slots[level] = Math.max(0, state.data.spellbook.slots[level] - count)
}