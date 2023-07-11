const CONSTS = require('../../../consts')
const {aggregateModifiers} = require("../common/aggregate-modifiers");

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
    const { sum: nHPBonus } = aggregateModifiers([
        CONSTS.EFFECT_HP_BONUS,
        CONSTS.ITEM_PROPERTY_HP_BONUS
    ], getters, {})
    const nConModifier = getters.getAbilityModifiers[CONSTS.ABILITY_CONSTITUTION]
    for (const [ ref, levels ] of Object.entries(oClasses)) {
        const sClassName = 'class-' + ref
        const oClassData = DATA[sClassName]
        if (!oClassData) {
            throw new Error('this character-class is undefined : "' + ref + '"')
        }
        const nHD = 'hitDice' in oClassData ? oClassData.hitDice : DATA['creature-sizes'][getters.getSize].hitDice
        const nHitPointsPerLevel = Math.floor(nHD / 2) + 1 + nConModifier
        const nLevel = levels
        if (bFirstLevel) {
            nMaxHitPoints += (nLevel - 1) * nHitPointsPerLevel + nHD + nConModifier
            bFirstLevel = false
        } else {
            nMaxHitPoints += nLevel * nHitPointsPerLevel
        }
    }
    return nMaxHitPoints + nHPBonus
}
