const CONSTS = require("../../../consts");
/**
 * Renvoie true si l'arme à distance est chargée avec le type de munitions correct
 * @return {boolean}
 */
module.exports = (state, getters) => {
    // déterminer l'arme à distance équipée
    /**
     * @type {D20Item}
     */
    const oWeapon = getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]
    if (!oWeapon) {
        return false
    }
    if (!oWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)) {
        return false
    }
    // déterminer le type de munitions requis pour cette arme
    const sWeaponAmmoType = oWeapon.ammo?.type || ''
    // déterminer les munitions equipées
    const oAmmo = getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_AMMO]
    const sAmmoType = oAmmo ? oAmmo.ammoType : ''
    // déterminer le type de ces munitions
    return sAmmoType === sWeaponAmmoType
}
