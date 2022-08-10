const CONSTS = require('../../../consts')

const aSlots = [
    CONSTS.EQUIPMENT_SLOT_HEAD,
    CONSTS.EQUIPMENT_SLOT_NECK,
    CONSTS.EQUIPMENT_SLOT_CHEST,
    CONSTS.EQUIPMENT_SLOT_BACK,
    CONSTS.EQUIPMENT_SLOT_ARMS,
    CONSTS.EQUIPMENT_SLOT_RIGHT_FINGER,
    CONSTS.EQUIPMENT_SLOT_LEFT_FINGER,
    CONSTS.EQUIPMENT_SLOT_WAIST,
    CONSTS.EQUIPMENT_SLOT_FEET,
    CONSTS.EQUIPMENT_SLOT_SHIELD,
    CONSTS.EQUIPMENT_SLOT_NATURAL_ARMOR
]

module.exports = (state, getters) => {
    const oEquipItems = getters.getEquippedItems
    return aSlots
        .map(s => oEquipItems[s])
        .filter(item => !!item)
}
