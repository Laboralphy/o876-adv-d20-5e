const CONSTS = require("../../../consts");

function getRangedOffensiveEquipment (state, getters) {
    const oWeapon = getters.getSelectedWeapon
    const bUseAmmo = oWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_AMMUNITION)
    const oAmmo = bUseAmmo ? state.equipment[CONSTS.EQUIPMENT_SLOT_AMMO] : null
    return [
        oWeapon,
        oAmmo
    ]
}

function getMeleeOffensiveEquipment (state, getters) {
    const oWeapon = getters.getSelectedWeapon
    return [
        oWeapon
    ]
}

/**
 * Renvoie la liste de l'équipement offensif
 * @param state
 * @param getters
 * @returns {D20Item[]}
 */
module.exports = (state, getters) => {
    const oWeapon = getters.getSelectedWeapon
    if (!oWeapon) {
        return []
    }
    const aWeapons = oWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)
        ? getRangedOffensiveEquipment(state, getters)
        : getMeleeOffensiveEquipment(state, getters)
    return aWeapons.filter(e => !!e)
}
