const CONSTS = require('../../../consts')

/**
 * Renvoie true si la créature est compétente dans le port de son armure et de son bouclier
 * @param state
 * @param getters
 * @returns {boolean}
 */
module.exports = (state, getters) => {
    const oArmor = getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_CHEST]
    const oShield = getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_SHIELD]
    const bArmorProficient = (oArmor && oArmor.proficiency)
        ? (getters.getProficiencies.includes(oArmor.proficiency) || getters.getProficiencies.includes(oArmor.armorType))
        : true
    const bShieldProficient = (oShield && oShield.itemType === CONSTS.ITEM_TYPE_SHIELD)
        ? getters.getProficiencies.includes(CONSTS.PROFICIENCY_SHIELD)
        : true
    return bArmorProficient && bShieldProficient
}
