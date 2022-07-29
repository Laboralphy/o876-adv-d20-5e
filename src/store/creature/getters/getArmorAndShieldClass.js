const CONSTS = require('../../../consts')

module.exports = (state, getters) => {
    const nDexterityBonus = getters.getAbilityModifiers[CONSTS.ABILITY_DEXTERITY]
    const oArmor = getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_CHEST]
    const nArmorAC = oArmor ? oArmor.ac : 0
    const nMaxedDexterityBonus = oArmor.maxDexterityModifier === false
        ? nDexterityBonus
        : Math.min(nDexterityBonus, oArmor.maxDexterityModifier)
    const oShield = getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_SHIELD]
    const nShieldAC = oShield ?oShield.ac : 0
    return nArmorAC + nMaxedDexterityBonus + nShieldAC
}
