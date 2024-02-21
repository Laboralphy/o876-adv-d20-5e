const CONSTS = require('../../../consts')
const { aggregateModifiers } = require('../common/aggregate-modifiers')

/**
 * Classe d'armure complete de la créature
 * @param state
 * @param getters
 * @returns {{armor: number, dexterity: number, shield: number, effects: number, props: number}}
 */
module.exports = (state, getters) => {
    const nDexterityBonus = getters.getAbilityModifiers[CONSTS.ABILITY_DEXTERITY]
    const oArmor = getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_CHEST] || getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_NATURAL_ARMOR]
    const bHasArmor = !!oArmor
    const nBaseACEffect = aggregateModifiers([
        CONSTS.EFFECT_AC_BASE
    ], getters).max
    const nArmorAC = Math.max(nBaseACEffect, bHasArmor ? oArmor.ac : 0)
    if (nArmorAC === undefined) {
        console.error(oArmor)
        throw new Error('Worn armor has undefined AC')
    }
    const nMaxedDexterityBonus = bHasArmor && oArmor.maxDexterityModifier !== false && !isNaN(oArmor.maxDexterityModifier)
        ? Math.min(nDexterityBonus, oArmor.maxDexterityModifier)
        : nDexterityBonus
    const oShield = getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_SHIELD]
    const nShieldAC = (oShield && oShield.itemType === CONSTS.ITEM_TYPE_SHIELD) ? (oShield.ac || 0) : 0
    const oItemACEffProps = aggregateModifiers([
        CONSTS.EFFECT_AC_BONUS,
        CONSTS.ITEM_PROPERTY_AC_BONUS
    ], getters)
    return {
        [CONSTS.ARMOR_DEFLECTOR_ARMOR]: nArmorAC,
        [CONSTS.ARMOR_DEFLECTOR_SHIELD]: nShieldAC,
        [CONSTS.ARMOR_DEFLECTOR_DEXTERITY]: nMaxedDexterityBonus,
        [CONSTS.ARMOR_DEFLECTOR_PROPERTIES]: oItemACEffProps.ip,
        [CONSTS.ARMOR_DEFLECTOR_EFFECTS]: oItemACEffProps.effects,
    }
}
