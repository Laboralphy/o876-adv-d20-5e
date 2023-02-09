const CONSTS = require('../../../consts')

module.exports = ({ state, getters, externals }, { item, slot = ''}) => {
    if (slot === '') {
        slot = item.equipmentSlots[]
        if (slots.length > 0) {
            slot = slots[0]
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