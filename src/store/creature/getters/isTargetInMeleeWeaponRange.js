const CONSTS = require('../../../consts')
const {getWeaponRange} = require("../common/get-weapon-range");

/**
 * Verifie si la cible est a portée de l'arme de mélée
 * Si on est équipé d'une arme à distance, on vérifie que la cible soit à très courte portée
 * @param state
 * @param getters
 * @returns {boolean}
 */
module.exports = (state, getters, externals) => {
    const nDistance = getters.getTargetDistance
    if (isNaN(nDistance)) {
        return false
    }
    if (getters.isWieldingRangedWeapon) {
        // on a une arme à distance, mais il faut déterminer si on tire à bout portant
        return nDistance <= externals.data['weapon-ranges'].WEAPON_RANGE_MELEE
    } else {
        return nDistance <= getWeaponRange(
            getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] || getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON],
            externals
        )
    }
}
