const CONSTS = require('../../../consts')

module.exports = (state, getters) => {
    const oWeapon = getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
    if (oWeapon) {
        return oWeapon
    }
    return state.naturalWeapon
}