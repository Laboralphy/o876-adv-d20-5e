const CONSTS = require('../../../consts')

module.exports = (state, getters) => {
    const oArmor = getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_CHEST]
    return oArmor
        ? oArmor.disadvantageStealth
        : false
}
