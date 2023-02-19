const CONSTS = require('../../../consts')

/**
 *
 * @param oSet {Set<string>}
 * @param sMaterial {string}
 * @param data {object}
 */
function getMaterialSuite (oSet, sMaterial, data) {
    oSet.add(sMaterial)
    const oMaterial = data[sMaterial]
    if (oSet.has(oMaterial.parent)) {
        return oSet
    } else if (oMaterial.parent) {
        return getMaterialSuite(oSet, oMaterial.parent, data)
    } else {
        return oSet
    }
}

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
