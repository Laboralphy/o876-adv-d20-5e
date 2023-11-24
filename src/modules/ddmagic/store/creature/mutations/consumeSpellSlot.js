module.exports = ({ state }, { level }) => {
    ++state.data.spellbook.slots[level]
}