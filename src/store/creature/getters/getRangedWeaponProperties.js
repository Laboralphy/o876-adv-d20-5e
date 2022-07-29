const CONSTS = require('../../../consts')

module.exports = state => {
    const oWeapon = state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]
    const oAmmo = state.equipment[CONSTS.EQUIPMENT_SLOT_AMMO]
    const aWeaponProp = oWeapon ? oWeapon.properties : []
    const aAmmoProp = oAmmo ? oAmmo.properties : []
    return [
        ...aWeaponProp,
        ...aAmmoProp
    ]
}
