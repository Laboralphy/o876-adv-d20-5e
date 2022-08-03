const CONSTS = require('../../../consts')

module.exports = state => {
    const oWeapon = getters.getSelectedWeapon
    const oAmmo = state.equipment[CONSTS.EQUIPMENT_SLOT_AMMO]
    const aWeaponProp = oWeapon ? oWeapon.properties : []
    const aAmmoProp = oAmmo ? oAmmo.properties : []
    return [
        ...aWeaponProp,
        ...aAmmoProp
    ]
}
