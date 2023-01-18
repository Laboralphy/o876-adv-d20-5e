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
            target: canSee(c, tc),          // true : you can see your target ; false : you cannot see your target
            aggressor: canSee(c, tc)        // true : you can see your aggressor ; false : you cannot see your aggressor
        },
        detectedBy: {
            target: canSee(tc, c),          // true : your target can see you ; false : your target cannot see you
            aggressor: canSee(ac, c)        // true : your aggressor can see you , false : your aggressor cannot see you
        }
    }
}
