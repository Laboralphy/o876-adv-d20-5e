const CONSTS = require("../../../consts");

/**
 *
 * @param state
 * @param getters
 * @param externals
 * @returns {boolean}
 */
module.exports = (state, getters, externals) => {
    const nDistance = getters.getTargetDistance
    if (isNaN(nDistance)) {
        return false
    } else {
        return nDistance <= getters.getSelectedWeaponRange
    }
}