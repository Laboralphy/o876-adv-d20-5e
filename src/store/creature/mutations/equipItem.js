module.exports = ({ state, getters, externals }, { item, slot = ''}) => {
    if (slot === '') {
        if (item.equipmentSlots.length > 0) {
            slot = item.equipmentSlots[0]
        } else {
            throw new Error('Item could not be equipped : no equip-slot defined')
        }
    }
    if (slot in state.equipment) {
        state.equipment[slot] = item
    } else {
        throw new Error('Equipment slot invalid : "' + slot + '"')
    }
}