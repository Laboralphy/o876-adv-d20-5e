const CONSTS = require("../../../consts");
/**
 * Renvoi le matériaux avec lequel est fabriqué l'armure équipé
 * @param oSet {Set<string>}
 * @param sMaterial {string}
 * @param data {object}
 */
function getMaterialSuite (oSet, sMaterial, data) {
    if (!data.materials[sMaterial]) {
        sMaterial = CONSTS.MATERIAL_UNKNOWN
    }
    oSet.add(sMaterial)
    const oMaterial = data.materials[sMaterial]
    if (oSet.has(oMaterial.parent)) {
        return oSet
    } else if (oMaterial.parent) {
        return getMaterialSuite(oSet, oMaterial.parent, data)
    } else {
        return oSet
    }
}

module.exports = {
    getMaterialSuite
}