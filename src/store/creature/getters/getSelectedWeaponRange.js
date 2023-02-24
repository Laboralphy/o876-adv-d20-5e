const {getWeaponRange} = require("../common/get-weapon-range");

/**
 *
 * @param state
 * @param getters
 * @param externals
 * @returns {number}
 */
module.exports = (state, getters, externals) => getWeaponRange(getters.getSelectedWeapon, externals)
