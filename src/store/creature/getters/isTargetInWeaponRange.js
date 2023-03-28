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
        throw new Error('ERR_DISTANCE_TO_TARGET_NAN')
    } else {
        return nDistance <= getters.getSelectedWeaponRange
    }
}