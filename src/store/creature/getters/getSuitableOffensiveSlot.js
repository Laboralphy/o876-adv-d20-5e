const CONSTS = require('../../../consts')
const { getWeaponRange } = require('../common/get-weapon-range')

/**
 * Détermine le slot offensif de l'arme la plus adaptée à la cible
 * - si la cible est loin et qu'une arme à distance est équipée et approvisionnée : RANGED
 * - sinon si la cible est proche et qu'une arme de mélée est équipée : MELEE
 * - sinon si la cible est proche et qu'une arme à distance est équipée et approvisionnée : RANGED
 * - sinon : MELEE
 * @return {string}
 */

module.exports = (state, getters, externals) => {
    // déterminer la distance de la cible
    // déterminer la portée de l'arme de mélée
    const nDistance = getters.getTargetDistance
    const ei = getters.getEquippedItems
    const oMeleeWeapon = ei[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
    const oRangedWeapon = ei[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]
    const oShield = ei[CONSTS.EQUIPMENT_SLOT_SHIELD]
    const bRightAmmo = getters.isRangedWeaponProperlyLoaded
    const nMeleeWeaponRange = getWeaponRange(getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE], externals)
    const nRangedWeaponRange = getWeaponRange(getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED], externals)
    const bInMeleeRange = nDistance <= nMeleeWeaponRange
    const bInRangedRange = nDistance <= nRangedWeaponRange
    const bCanUseMelee = !!oMeleeWeapon && bInMeleeRange
    const bCanUseRanged = !!oRangedWeapon && bRightAmmo && !oShield && bInRangedRange
    const n =
        (bCanUseMelee ? 1 : 0) |
        (bCanUseRanged ? 2 : 0)
    switch (n) {
        case 0: {
            // neither melee nor ranged
            return ''
        }

        case 1: {
            // melee only
            return CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE
        }

        case 2: {
            // ranged only
            return CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED
        }

        case 3: {
            // both melee and ranged
            // choose best
            return bInMeleeRange ? CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE : CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED
        }
    }
}