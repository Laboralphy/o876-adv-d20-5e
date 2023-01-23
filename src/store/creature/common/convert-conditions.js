/**
 * Transforme une sortie de getter getConditionSources en structure que l'on peut stocker dans un store (sans Set())
 */
function convertConditionsToArray (conditions) {
    const oNewConditions = {}
    for (const [sCondition, oSourceSet] of Object.entries(conditions)) {
        if (oSourceSet instanceof Set) {
            oNewConditions[sCondition] = [...oSourceSet]
        } else {
            console.error(oSourceSet)
            throw new TypeError('The condition "' + sCondition + '" source set is not a Set !')
        }
    }
    return oNewConditions
}

function convertConditionsToSet (conditions) {
    const oNewConditions = {}
    for (const [sCondition, aSourceSet] of Object.entries(conditions)) {
        if (aSourceSet instanceof Array) {
            oNewConditions[sCondition] = new Set(aSourceSet)
        } else {
            throw new TypeError('The condition "' + sCondition + '" source set is not an Array !')
        }
    }
    return oNewConditions
}

module.exports = { convertConditionsToArray, convertConditionsToSet }