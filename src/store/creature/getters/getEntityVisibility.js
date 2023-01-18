const CONSTS = require('../../../consts')

function canSee (oWatcherConditions, oWatchedConditions) {
    const bBlinded = oWatcherConditions.has(CONSTS.CONDITION_BLINDED)
    const bTargetInvisible = oWatchedConditions.has(CONSTS.CONDITION_INVISIBLE)
    const bHaveTrueSight = oWatcherConditions.has(CONSTS.CONDITION_TRUE_SIGHT)
    const bTargetDetectable = !bTargetInvisible || bHaveTrueSight
    return !bBlinded && bTargetDetectable
}

/**
 * @typedef D20EntityVisibilityResultCategory {object}
 * @property target {boolean}
 * @property aggressor {boolean}
 *
 * @typedef D20EntityVisibilityResult {object}
 * @property detectable {D20EntityVisibilityResultCategory}
 * @property detectedBy {D20EntityVisibilityResultCategory}
 *
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {D20EntityVisibilityResult}
 */
module.exports = (state, getters) => {
    const ac = getters.getAggressorConditions
    const tc = getters.getTargetConditions
    const c = getters.getConditions
    return {
        detectable: {
            target: canSee(c, tc),
            aggressor: canSee(c, tc)
        },
        detectedBy: {
            target: canSee(tc, c),
            aggressor: canSee(ac, c)
        }
    }
}
