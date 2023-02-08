module.exports = ({ state, getters, externals }, { item, slot = ''}) => {
    if (slot === '') {
        slot = item.slots[0]
    }
    if (slot in state.equipment) {
        state.equipment[slot] = item
    } else {
        throw new Error('Equipment slot invalid : "' + slot + '"')
    }
}