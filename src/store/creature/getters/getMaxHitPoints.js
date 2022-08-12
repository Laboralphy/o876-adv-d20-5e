const CONSTS = require('../../../consts')

/**
 * Nombre maximum de points de vie
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @param externals {object}
 * @returns {number}
 */
module.exports = (state, getters, externals) => {
    const DATA = externals.data
    const oClasses = getters.getLevelByClass
    let bFirstLevel = true
    let nMaxHitPoints = 0
    const nConModifier = getters.getAbilityModifiers[CONSTS.ABILITY_CONSTITUTION]
    for (const [ ref, levels ] of Object.entries(oClasses)) {
        const oClassData = DATA['class-' + ref]
        const nHD = oClassData.hitDice
        const nHitPointsPerLevel = Math.floor(nHD / 2) + 1 + nConModifier
        const nLevel = levels
        if (bFirstLevel) {
            nMaxHitPoints += (nLevel - 1) * nHitPointsPerLevel + nHD
            bFirstLevel = false
        } else {
            nMaxHitPoints += nLevel * nHitPointsPerLevel
        }
    }
    return nMaxHitPoints
}
