/**
 * Renvoi le matériaux avec lequel est fabriqué l'armure équipé
 * @param oSet {Set<string>}
 * @param sMaterial {string}
 * @param data {object}
 */
function getMaterialSuite (oSet, sMaterial, data) {
    oSet.add(sMaterial)
    const oMaterial = data.materials[sMaterial]
    if (!oMaterial) {
        throw new Error('This material does not exist : ' + sMaterial)
    }
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