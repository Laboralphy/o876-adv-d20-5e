const CONSTS = require("../../../consts");

/**
 *
 * @param state
 * @param getters
 * @return {boolean}
 */
module.exports = (state, getters) => {
    return getters.getSelectedWeapon
        ? getters.getSelectedWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)
        : false
}
