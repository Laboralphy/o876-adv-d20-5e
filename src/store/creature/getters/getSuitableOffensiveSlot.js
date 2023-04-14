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

    // Liste des armes équipées
    const oMeleeWeapon = ei[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
    const oNaturalWeapon = ei[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON]
    const oRangedWeapon = ei[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]
    const oShield = ei[CONSTS.EQUIPMENT_SLOT_SHIELD]

    // Types d'armes possédés
    const bHasMelee = !!oMeleeWeapon
    const bHasRanged = !!oRangedWeapon && getters.isRangedWeaponProperlyLoaded
    const bHasNatural = !!oNaturalWeapon
    const bHasShield = !!oShield

    // Calcul des portées
    const nMeleeWeaponRange = getWeaponRange(oMeleeWeapon || oNaturalWeapon, externals)
    const nRangedWeaponRange = bHasRanged ? getWeaponRange(oRangedWeapon, externals) : 0

    const bInMeleeRange = nDistance <= nMeleeWeaponRange
    const bInRangedRange = (nDistance <= nRangedWeaponRange) && !bInMeleeRange
    if (bInRangedRange && bHasRanged && !bHasShield) {
        // Utilisation d'arme à distance uniquement si la cible est à portée, et si on n'a pas de bouclier
        return CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED
    } else if (bInMeleeRange) {
        if (bHasMelee) {
            // Utilisation d'arme de contact lorsque la cible est à portée de l'arme
            return CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE
        } else if (bHasRanged && !bHasShield) {
            // On n'a qu'une arme à distance, on l'utilise à bout portant
            return CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED
        } else if (bHasNatural) {
            console.log('on choisi natural weapon')
            // On n'a pas d'autre arme que ses points, griffes, crocs
            return CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON
        } else {
            // on n'a vraiment aucune arme, pas même naturelle
            return ''
        }
    } else {
        // cible trop loin pour tout l'arsenal équipé
        return ''
    }
}