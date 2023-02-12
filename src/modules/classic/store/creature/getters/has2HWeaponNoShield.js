const CONSTS = require('../../../../../consts')

/**
 * Renvoie true si on porte une arme de mélée à deux mains et pas de bouclier
 * @param state
 * @param getters
 * @returns {boolean}
 */
module.exports = (state, getters) => {
    const oWeapon = getters.getSelectedWeapon
    const bMeleeWeapon = !oWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)
    const oShield = getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_SHIELD]
    const b2HWeapon = oWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_TWO_HANDED) ||
        oWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_VERSATILE)
    const bHasNoShield = !oShield
    return bMeleeWeapon && bHasNoShield && b2HWeapon
}
