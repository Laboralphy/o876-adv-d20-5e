const CONSTS = require("../../../consts");

/**
 *
 * @param oWeapon {D20Item}
 * @param externals {*}
 * @return {number}
 */
function getWeaponRange (oWeapon, externals) {
    const data = externals.data
    if (!oWeapon) {
        return data['weapon-ranges'].WEAPON_RANGE_MELEE
    } else if (oWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)) {
        return data['weapon-ranges'].WEAPON_RANGE_RANGED
    } else if (oWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_REACH)) {
        return data['weapon-ranges'].WEAPON_RANGE_REACH
    } else {
        console.log(externals)
        return data['weapon-ranges'].WEAPON_RANGE_MELEE
    }
}

module.exports = {
    getWeaponRange
}