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
    const oArmor = getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_CHEST]

    return oArmor
        ? getMaterialSuite(new Set(), oArmor.material, data)
        : CONSTS.MATERIAL_UNKNOWN
}
