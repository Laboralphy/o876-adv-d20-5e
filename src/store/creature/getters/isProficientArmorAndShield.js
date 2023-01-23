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
    const bArmorProficient = oArmor
        ? (state.proficiencies.includes(oArmor.proficiency || state.proficiencies.includes(oArmor.armorType)))
        : true
    const bShieldProficient = oShield
        ? state.proficiencies.includes(CONSTS.PROFICIENCY_SHIELD)
        : true
    return bArmorProficient && bShieldProficient
}
