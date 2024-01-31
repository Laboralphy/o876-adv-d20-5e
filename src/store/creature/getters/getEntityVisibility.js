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
    const targetStuff = state.target.active
        ? new Set([
            ...state.target.effect,
            ...state.target.itemProperties,
            ...Object.keys(state.target.conditions)
        ])
        : new Set()

    const aggressorStuff = state.aggressor.active
        ? new Set([
            ...state.aggressor.effect,
            ...state.target.itemProperties,
            ...Object.keys(state.target.conditions)
        ])
        : new Set()
    const myStuff = new Set([
        ...getters.getEffectSet,
        ...getters.getEquipmentItemPropertySet,
        ...getters.getConditionSet
    ])

    const bMeBlind = myStuff.has(CONSTS.CONDITION_BLINDED)
    const bMeSeeInvisibility = myStuff.has(CONSTS.EFFECT_SEE_INVISIBILITY) || myStuff.has(CONSTS.EFFECT_TRUE_SIGHT)
    const bMeInvisible = myStuff.has(CONSTS.CONDITION_INVISIBLE)

    const bTargetBlind = targetStuff.has(CONSTS.CONDITION_BLINDED)
    const bTargetSeeInvisibility = targetStuff.has(CONSTS.EFFECT_SEE_INVISIBILITY) || targetStuff.has(CONSTS.EFFECT_TRUE_SIGHT)
    const bTargetInvisible = targetStuff.has(CONSTS.CONDITION_INVISIBLE)



    return {
        detectable: { // ce qu'on peut détecter
            target:
                (!bMeBlind && !bTargetInvisible) ||
                (!bMeBlind && bTargetInvisible && bMeSeeInvisibility)

            aggressor: canSee(getters, c, tc)        // true : you can see your aggressor ; false : you cannot see your aggressor
        },
        detectedBy: { // par qui on est détecté
            target: canSee(getters, tc, c),          // true : your target can see you ; false : your target cannot see you
            aggressor: canSee(getters, ac, c)        // true : your aggressor can see you , false : your aggressor cannot see you
        }
    }
}
