module.exports = ({ state }, { item, slot }) => {
    if (slot in state.equipment) {
        state.equipment[slot] = item
    } else {
        throw new Error('Equipment slot invalid : "' + slot + '"')
    }
}