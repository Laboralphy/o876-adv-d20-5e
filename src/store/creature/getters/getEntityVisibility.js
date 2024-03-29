const CONSTS = require('../../../consts')

/**
 *
 * @param a {Object<string, string[]>}
 * @returns {string[]}
 */
function extractConditions (a) {
    return Object
        .keys(a)
        .filter(x => a[x].length > 0)
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
    const bHasTarget = state.target.active
    const bHasAggressor = state.aggressor.active
    const targetStuff = bHasTarget
        ? new Set([
            ...state.target.effects,
            ...state.target.itemProperties,
            ...extractConditions(state.target.conditions)
        ])
        : new Set()

    const aggressorStuff = bHasAggressor
        ? new Set([
            ...state.aggressor.effects,
            ...state.aggressor.itemProperties,
            ...extractConditions(state.aggressor.conditions)
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

    const bAggressorBlind = aggressorStuff.has(CONSTS.CONDITION_BLINDED)
    const bAggressorSeeInvisibility = aggressorStuff.has(CONSTS.EFFECT_SEE_INVISIBILITY) || aggressorStuff.has(CONSTS.EFFECT_TRUE_SIGHT)
    const bAggressorInvisible = aggressorStuff.has(CONSTS.CONDITION_INVISIBLE)

    // Darkness
    const bHasDarkVision =
        getters.getEffectSet.has(CONSTS.EFFECT_DARKVISION) ||
        getters.getEquipmentItemPropertySet.has(CONSTS.ITEM_PROPERTY_DARKVISION)
    const bInDarkRoom = getters.getAreaFlagSet.has(CONSTS.AREA_FLAG_DARK)
    const bCanSeeInRoom = !bInDarkRoom || (bInDarkRoom && bHasDarkVision)

    return {
        detectable: { // ce qu'on peut détecter
            target:
                bHasTarget && bCanSeeInRoom && !bMeBlind && (
                    !bTargetInvisible ||
                    (bTargetInvisible && bMeSeeInvisibility)
                ),
            aggressor:
                bHasAggressor && bCanSeeInRoom && !bMeBlind && (
                    !bAggressorInvisible ||
                    bAggressorInvisible && bMeSeeInvisibility
                )
        },
        detectedBy: { // par qui on est détecté
            target:
                bHasTarget && !bTargetBlind && (
                    !bMeInvisible ||
                    (bMeInvisible && bTargetSeeInvisibility)
                ),
            aggressor:
                bHasAggressor && !bAggressorBlind && (
                    !bMeInvisible ||
                    (bMeInvisible && bAggressorSeeInvisibility)
                )
        }
    }
}
