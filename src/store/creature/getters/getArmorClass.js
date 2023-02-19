const CONSTS = require('../../../consts')
const { aggregateModifiers } = require('../common/aggregate-modifiers')

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
    const nItemACProps = aggregateModifiers([
        CONSTS.EFFECT_AC_BONUS,
        CONSTS.ITEM_PROPERTY_AC_BONUS
    ], getters).sum
    return nArmorAC + nMaxedDexterityBonus + nShieldAC + nItemACProps
}
