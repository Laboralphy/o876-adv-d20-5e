const CONSTS = require("../../../consts");
/**
 * Renvoie true si l'arme à distance est chargée avec le type de munitions correct
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
    if (oWeapon.data.ammo const  = oWeapon.ammoType
    // déterminer le type de munitions requis pour cette arme
    // déterminer les munitions equipées
    // déterminer le type de ces munitions
}
