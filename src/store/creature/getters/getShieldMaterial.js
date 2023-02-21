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
    const oShield = getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_SHIELD]

    return oShield
        ? getMaterialSuite(new Set(), oShield.material, data)
        : CONSTS.MATERIAL_UNKNOWN
}
