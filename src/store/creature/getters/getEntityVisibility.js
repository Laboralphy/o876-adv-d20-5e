const CONSTS = require('../../../consts')

function canSee (getters, oWatcherConditions, oWatchedConditions) {
    const bTargetInvisible = oWatchedConditions.has(CONSTS.CONDITION_INVISIBLE)
    const bCanSeeInvis = getters.canSeeInvisibility
    return !bTargetInvisible || bCanSeeInvis
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
    const conditions = getters.getConditionSet
    const effects = getters.getEffectSet
    const targetConditions = getters.getTargetConditionSet
    const targetEffects = getters.getTargetEffectSet
    const bIAmInvisible = conditions.has(CONSTS.CONDITION_INVISIBLE)
    const bICanSeeInvisibility = effects.has(CONSTS.EFFECT_SEE_INVISIBILITY)
    const bTargetInvisible = targetConditions.has(CONSTS.CONDITION_INVISIBLE)
    const bTargetCanSeeInvisibility = targetEffects.has(CONSTS.EFFECT_SEE_INVISIBILITY)



    const ac = getters.getAggressorConditionSet
    const tc = getters.getTargetConditionSet
    return {
        detectable: {
            target: canSee(getters, c, tc),          // true : you can see your target ; false : you cannot see your target
            aggressor: canSee(getters, c, tc)        // true : you can see your aggressor ; false : you cannot see your aggressor
        },
        detectedBy: {
            target: canSee(getters, tc, c),          // true : your target can see you ; false : your target cannot see you
            aggressor: canSee(getters, ac, c)        // true : your aggressor can see you , false : your aggressor cannot see you
        }
    }
}
