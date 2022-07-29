const CONSTS = require('../../../consts')

module.exports = (state, getters) => {
    const oArmor = getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_CHEST]
    const oShield = getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_SHIELD]
    const bArmorProficient = oArmor
        ? state.proficiencies.includes(oArmor.proficiency)
        : true
    const bShieldProficient = oShield
        ? state.proficiencies.includes(CONSTS.PROFICIENCY_SHIELD)
        : true
    return bArmorProficient && bShieldProficient
}
