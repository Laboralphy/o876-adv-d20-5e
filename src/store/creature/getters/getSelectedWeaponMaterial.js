const CONSTS = require('../../../consts')
const { getMaterialSuite } = require('../common/get-material-suite')

/**
 *
 * @param state
 * @param getters
 * @param externals
 * @returns {string}
 */
module.exports = (state, getters, externals) => {
    const { data } = externals
    const oWeapon = getters.getSelectedWeapon

    return oWeapon
        ? getMaterialSuite(new Set(), oWeapon.material, data)
        : new Set([CONSTS.MATERIAL_UNKNOWN])
}
