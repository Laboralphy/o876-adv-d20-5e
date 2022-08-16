const CONSTS = require("../../../consts");

/**
 * liste des propriétés générant un bonus d'attaque par l'arme à distance spécifié et les munitions éventuellement équipées
 * @param oWeapon
 * @param state
 * @param getters
 * @returns {*[]}
 */
function getRangedWeaponProperties (oWeapon, state, getters) {
    const bUseAmmo = oWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_AMMUNITION)
    const oAmmo = bUseAmmo ? state.equipment[CONSTS.EQUIPMENT_SLOT_AMMO] : null
    const aWeaponProp = oWeapon ? oWeapon.properties : []
    const aAmmoProp = oAmmo ? oAmmo.properties : []
    return [
        ...aWeaponProp,
        ...aAmmoProp
    ]
}

/**
 * Liste des propriété de l'arme équipée et des munitions dans le cas d'arme à distance utilisant des munitions
 * @param state
 * @param getters
 * @returns {array}
 */
module.exports = (state, getters) => {
    const oWeapon = getters.getSelectedWeapon
    return oWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)
        ? getRangedWeaponProperties(oWeapon, state, getters)
        : oWeapon.properties
}