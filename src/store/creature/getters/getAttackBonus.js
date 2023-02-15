const CONSTS = require("../../../consts");
const { aggregateModifiers } = require('../common/aggregate-modifiers')

/**
 * Renvoie la valeur du bonus d'attaque
 * @param state
 * @param getters
 * @param externals
 * @returns {number}
 */
module.exports = (state, getters, externals) => {
    const bProficient = getters.isProficientSelectedWeapon
    const sOffensiveAbility = getters.getOffensiveAbility
    const nAbilityBonus = getters.getAbilityModifiers[sOffensiveAbility]
    const nProfBonus = bProficient ? getters.getProficiencyBonus : 0
    const bRanged = getters.getSelectedWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)
    return nAbilityBonus + nProfBonus + aggregateModifiers([
        CONSTS.EFFECT_ATTACK_BONUS,
        bRanged ? CONSTS.EFFECT_RANGED_ATTACK_BONUS : CONSTS.EFFECT_MELEE_ATTACK_BONUS,
        CONSTS.ITEM_PROPERTY_ENHANCEMENT,
        CONSTS.ITEM_PROPERTY_ATTACK_BONUS
    ], getters).sum
}
