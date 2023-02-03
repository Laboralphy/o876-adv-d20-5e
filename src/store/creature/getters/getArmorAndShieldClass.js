const CONSTS = require('../../../consts')

/**
 * Classe d'armure complete de la créature
 * @param state
 * @param getters
 * @returns {number}
 */
module.exports = (state, getters) => {
    const nDexterityBonus = getters.getAbilityModifiers[CONSTS.ABILITY_DEXTERITY]
    const oArmor = getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_CHEST]
    const bHasArmor = !!oArmor
    const nArmorAC = bHasArmor ? oArmor.ac : 0
    const nMaxedDexterityBonus = bHasArmor && oArmor.maxDexterityModifier !== false && !isNaN(oArmor.maxDexterityModifier)
        ? Math.min(nDexterityBonus, oArmor.maxDexterityModifier)
        : nDexterityBonus
    const oShield = getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_SHIELD]
    const nShieldAC = oShield ?oShield.ac : 0
    return nArmorAC + nMaxedDexterityBonus + nShieldAC
}
