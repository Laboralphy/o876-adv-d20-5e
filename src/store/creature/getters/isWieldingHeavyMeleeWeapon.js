const CONSTS = require("../../../consts");

/**
 *
 * @param state
 * @param getters
 * @return {boolean}
 */
module.exports = (state, getters) => {
    const w = getters.getSelectedWeapon
    if (w) {
        const wa = w.attributes
        return wa.includes(CONSTS.WEAPON_ATTRIBUTE_HEAVY) && !wa.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)
    } else {
        return false
    }
}
